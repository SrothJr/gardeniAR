import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { usePremium } from "../hooks/usePremium";

export default function Subscription() {
  const router = useRouter();
  const { isPremium, sharesLeft, activatePremium, resetPremium, loaded, user } = usePremium();

  if (!loaded) {
    return (
      <View style={s.page}>
        <Text style={s.title}>Subscription</Text>
        <Text style={s.sub}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={s.page}>
        <Text style={s.title}>Login Required</Text>
        <Text style={s.sub}>Please log in to manage your subscription.</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.push("/auth/login")}>
          <Text style={s.btnText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondary} onPress={() => router.back()}>
          <Text style={s.secondaryText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.page}>
      <Text style={s.title}>Subscription</Text>
      <View style={s.card}>
        <Text style={s.status}>
          {isPremium ? "Premium Active" : "Free Plan"}
        </Text>
        {!isPremium && (
          <Text style={s.sub}>Free Share left: {sharesLeft}</Text>
        )}

        {isPremium ? (
          <>
            <TouchableOpacity style={[s.btn, s.danger]} onPress={async () => { await resetPremium(); router.back(); }}>
              <Text style={s.btnTextAlt}>Cancel Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondary} onPress={() => router.back()}>
              <Text style={s.secondaryText}>Back</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={s.btn} onPress={async () => { await activatePremium(); router.back(); }}>
              <Text style={s.btnText}>Upgrade to Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondary} onPress={() => router.back()}>
              <Text style={s.secondaryText}>Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#071024", padding: 20, justifyContent: "center" },
  title: { color: "#e6eef3", fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 12 },
  sub: { color: "#9fb1be", textAlign: "center" },
  card: { backgroundColor: "rgba(15,23,42,0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.16)", borderRadius: 16, padding: 18, alignItems: "center" },
  status: { color: "#e6eef3", fontSize: 16, fontWeight: "800", marginBottom: 8 },
  btn: { backgroundColor: "#22c55e", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, alignItems: "center", width: "100%", marginTop: 10 },
  btnText: { color: "#051013", fontWeight: "900" },
  danger: { backgroundColor: "#ef4444" },
  btnTextAlt: { color: "#fff", fontWeight: "900" },
  secondary: { paddingVertical: 10, width: "100%", alignItems: "center" },
  secondaryText: { color: "#94a3b8", fontWeight: "700" },
});
