// hooks/usePremium.ts
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { BACKEND_URL } from "../config";

const PREMIUM_KEY = "PREMIUM_ACTIVE";
const SHARE_COUNT_KEY = "SHARE_COUNT";
export const FREE_SHARE_LIMIT = 2;

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  const load = useCallback(() => {
    async function fetchState() {
      try {
        const [premiumVal, shareVal, userVal] = await Promise.all([
          AsyncStorage.getItem(PREMIUM_KEY),
          AsyncStorage.getItem(SHARE_COUNT_KEY),
          AsyncStorage.getItem("user"),
        ]);
        
        const userData = userVal ? JSON.parse(userVal) : null;
        
        // Ensure user is actually logged in by checking for an ID
        if (userData && userData._id) {
          setUser(userData);
          setIsPremium(userData.isPremium === true);
        } else {
          setUser(null);
          setIsPremium(false); // Guest users can't have premium
        }
        
        setShareCount(parseInt(shareVal ?? "0", 10));
      } catch (e) {
        console.error("usePremium load error:", e);
      } finally {
        setLoaded(true);
      }
    }
    fetchState();
  }, []);

  // Initial load on mount
  useEffect(() => { load(); }, [load]);

  // Re-check on every screen focus (e.g. returning from /premium after upgrading)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const updateBackendPremium = async (premiumStatus: boolean) => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/premium`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, isPremium: premiumStatus }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (e) {
      console.error("Failed to update premium status on backend:", e);
    }
  };

  const activatePremium = async () => {
    await AsyncStorage.setItem(PREMIUM_KEY, "1");
    setIsPremium(true);
    await updateBackendPremium(true);
  };

  const incrementShare = async (): Promise<number> => {
    const next = shareCount + 1;
    await AsyncStorage.setItem(SHARE_COUNT_KEY, String(next));
    setShareCount(next);
    return next;
  };

  // Dev helper — call from a settings screen to reset state for testing
  const resetPremium = async () => {
    await AsyncStorage.multiRemove([PREMIUM_KEY, SHARE_COUNT_KEY]);
    setIsPremium(false);
    setShareCount(0);
    await updateBackendPremium(false);
  };

  const canShare = isPremium || shareCount < FREE_SHARE_LIMIT;
  const sharesLeft = Math.max(0, FREE_SHARE_LIMIT - shareCount);

  return { isPremium, shareCount, sharesLeft, canShare, loaded, activatePremium, incrementShare, resetPremium, user };
}