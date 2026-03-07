// hooks/usePremium.ts
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const PREMIUM_KEY = "PREMIUM_ACTIVE";
const SHARE_COUNT_KEY = "SHARE_COUNT";
export const FREE_SHARE_LIMIT = 2;

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    async function fetchPremiumState() {
      try {
        const [premiumVal, shareVal] = await Promise.all([
          AsyncStorage.getItem(PREMIUM_KEY),
          AsyncStorage.getItem(SHARE_COUNT_KEY),
        ]);
        setIsPremium(premiumVal === "1");
        setShareCount(parseInt(shareVal ?? "0", 10));
      } catch (e) {
        console.error("usePremium load error:", e);
      } finally {
        setLoaded(true);
      }
    }
    fetchPremiumState();
  }, []);

  // Initial load on mount
  useEffect(() => { load(); }, [load]);

  // Re-check on every screen focus (e.g. returning from /premium after upgrading)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const activatePremium = async () => {
    await AsyncStorage.setItem(PREMIUM_KEY, "1");
    setIsPremium(true);
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
  };

  const canShare = isPremium || shareCount < FREE_SHARE_LIMIT;
  const sharesLeft = Math.max(0, FREE_SHARE_LIMIT - shareCount);

  return { isPremium, shareCount, sharesLeft, canShare, loaded, activatePremium, incrementShare, resetPremium };
}