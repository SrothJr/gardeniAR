import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { usePremium } from "../hooks/usePremium";
import { useTheme } from "../hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Subscription() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isPremium, sharesLeft, activatePremium, resetPremium, loaded, user } = usePremium();

  if (!loaded) {
    return (
      <View style={[s.page, s.center, { backgroundColor: colors.background }]}>
        <Text style={[s.title, { color: colors.text }]}>Subscription</Text>
        <Text style={[s.sub, { color: colors.textMuted }]}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.center}>
          <Ionicons name="lock-closed" size={64} color={colors.textMuted} />
          <Text style={[s.title, { color: colors.text }]}>Login Required</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>Please log in to manage your subscription.</Text>
          <TouchableOpacity style={[s.btn, { backgroundColor: colors.primary }]} onPress={() => router.push("/auth/login")}>
            <Text style={[s.btnText, { color: '#000' }]}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondary} onPress={() => router.back()}>
            <Text style={[s.secondaryText, { color: colors.textMuted }]}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.page, { backgroundColor: colors.background }]}>
      <View style={s.center}>
        <Text style={[s.title, { color: colors.text }]}>Subscription</Text>
        <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[s.status, { color: colors.text }]}>
            {isPremium ? "Premium Active" : "Free Plan"}
          </Text>
          {!isPremium && (
            <Text style={[s.sub, { color: colors.textMuted }]}>Free Share left: {sharesLeft}</Text>
          )}

          {isPremium ? (
            <>
              <TouchableOpacity style={[s.btn, s.danger]} onPress={async () => { await resetPremium(); router.back(); }}>
                <Text style={s.btnTextAlt}>Cancel Premium</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.secondary} onPress={() => router.back()}>
                <Text style={[s.secondaryText, { color: colors.textMuted }]}>Back</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[s.btn, { backgroundColor: colors.primary }]} onPress={async () => { await activatePremium(); router.back(); }}>
                <Text style={[s.btnText, { color: '#000' }]}>Upgrade to Premium</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.secondary} onPress={() => router.back()}>
                <Text style={[s.secondaryText, { color: colors.textMuted }]}>Back</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 12 },
  sub: { textAlign: "center" },
  card: { borderWidth: 1, borderRadius: 16, padding: 18, alignItems: "center", width: "100%" },
  status: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  btn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, alignItems: "center", width: "100%", marginTop: 10 },
  btnText: { fontWeight: "900" },
  danger: { backgroundColor: "#ef4444" },
  btnTextAlt: { color: "#fff", fontWeight: "900" },
  secondary: { paddingVertical: 10, width: "100%", alignItems: "center" },
  secondaryText: { fontWeight: "700" },
});
