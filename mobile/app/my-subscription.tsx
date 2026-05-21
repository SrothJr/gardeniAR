// app/my-subscription.tsx
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePremium } from "../hooks/usePremium";
import { useTheme } from "../hooks/useTheme";

const PREMIUM_FEATURES = [
  { icon: "share-social-outline", label: "Unlimited Share Garden", color: "#4ade80" },
  { icon: "trending-up-outline", label: "Plant Growth Tracking", color: "#34d399" },
  { icon: "medkit-outline", label: "Disease Detection AI", color: "#a78bfa" },
  { icon: "cube-outline", label: "View in AR", color: "#60a5fa" },
  { icon: "notifications-outline", label: "Harvest Alerts", color: "#fbbf24" },
  { icon: "cloud-offline-outline", label: "Offline Mode", color: "#f87171" },
];

export default function MySubscription() {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();
  const { isPremium, resetPremium, user, loaded } = usePremium();
  const [cancelling, setCancelling] = useState(false);

  // Simulated billing info — replace with your real payment provider data
  const billing = {
    plan: "Premium Monthly",
    price: "$4.99 / month",
    nextBilling: "April 7, 2026",
    startedOn: "March 7, 2026",
    status: "Active",
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Subscription?",
      "You'll lose access to Growth Tracking, Disease Detection, AR View and unlimited sharing at the end of your billing period.",
      [
        { text: "Keep Premium", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: confirmCancel,
        },
      ]
    );
  };

  const confirmCancel = async () => {
    setCancelling(true);
    // 🔌 Call your payment provider cancellation API here
    await new Promise((r) => setTimeout(r, 1000)); // simulate API call
    await resetPremium();
    setCancelling(false);
    Alert.alert(
      "Subscription Cancelled",
      "Your Premium access has been removed. You can re-subscribe anytime.",
      [{ text: "OK", onPress: () => router.replace("/") }]
    );
  };

  // DEV ONLY: reset everything to simulate fresh free user
  const handleDevReset = () => {
    Alert.alert(
      "🛠 Dev Reset",
      "This will clear Premium status and share count so you can demo the upgrade flow again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset", style: "destructive",
          onPress: async () => {
            await resetPremium();
            Alert.alert("Reset Done", "You are now a free user.", [
              { text: "OK", onPress: () => router.replace("/") },
            ]);
          },
        },
      ]
    );
  };

  if (!loaded) {
    return (
      <View style={[styles.safe, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Ionicons name="lock-closed" size={64} color={colors.textMuted} />
          <Text style={[styles.gateTitle, { color: colors.text }]}>Login Required</Text>
          <Text style={[styles.gateSub, { color: colors.textMuted }]}>
            Please sign in to view your subscription details.
          </Text>
          <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/auth/login")}>
            <Text style={[styles.loginBtnText, { color: "#000" }]}>Log In to Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtnAlt} onPress={() => router.back()}>
            <Text style={[styles.backTextAlt, { color: colors.textMuted }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.blobA, { backgroundColor: colors.primary + '10' }]} />
      <View style={[styles.blobB, { backgroundColor: colors.primary + '07' }]} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textMuted} />
          <Text style={[styles.backText, { color: colors.textMuted }]}>Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.hero}>
          <View style={[styles.iconWrap, isPremium ? [styles.iconWrapActive, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }] : styles.iconWrapInactive]}>
            <Text style={{ fontSize: 32 }}>{isPremium ? "✨" : "🔒"}</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {isPremium ? "Premium Active" : "No Active Subscription"}
          </Text>
          <View style={[styles.statusBadge, isPremium ? [styles.statusBadgeActive, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25' }] : styles.statusBadgeInactive]}>
            <View style={[styles.statusDot, isPremium ? [styles.statusDotActive, { backgroundColor: colors.primary }] : styles.statusDotInactive]} />
            <Text style={[styles.statusText, isPremium ? [styles.statusTextActive, { color: colors.primary }] : styles.statusTextInactive]}>
              {isPremium ? "Active" : "Free Plan"}
            </Text>
          </View>
        </View>

        {isPremium ? (
          <>
            {/* Billing card */}
            <View style={[styles.billingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.textMuted, borderBottomColor: colors.border }]}>Billing Details</Text>
              {[
                { label: "Plan", value: billing.plan },
                { label: "Price", value: billing.price },
                { label: "Started", value: billing.startedOn },
                { label: "Next billing", value: billing.nextBilling },
                { label: "Status", value: billing.status },
              ].map((row, i, arr) => (
                <View key={i} style={[styles.billingRow, i < arr.length - 1 && [styles.billingRowBorder, { borderBottomColor: colors.border }]]}>
                  <Text style={[styles.billingLabel, { color: colors.textMuted }]}>{row.label}</Text>
                  <Text style={[styles.billingValue, { color: colors.text }, row.label === "Status" && { color: colors.primary, fontWeight: "800" }]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Active features */}
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Your Premium Features</Text>
            <View style={[styles.featuresCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {PREMIUM_FEATURES.map((f, i) => (
                <View key={i} style={[styles.featureRow, i < PREMIUM_FEATURES.length - 1 && [styles.featureRowBorder, { borderBottomColor: colors.border }]]}>
                  <View style={[styles.featureIconWrap, { backgroundColor: f.color + "22" }]}>
                    <Ionicons name={f.icon as any} size={18} color={f.color} />
                  </View>
                  <Text style={[styles.featureLabel, { color: colors.text }]}>{f.label}</Text>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                </View>
              ))}
            </View>

            {/* Cancel */}
            <TouchableOpacity
              style={[styles.cancelBtn, cancelling && { opacity: 0.6 }]}
              onPress={handleCancel}
              disabled={cancelling}
              activeOpacity={0.85}
            >
              {cancelling
                ? <ActivityIndicator color="#ef4444" />
                : <><Ionicons name="close-circle-outline" size={18} color="#ef4444" /><Text style={styles.cancelBtnText}>Cancel Subscription</Text></>
              }
            </TouchableOpacity>
            <Text style={[styles.cancelNote, { color: colors.textMuted }]}>
              You'll keep Premium access until {billing.nextBilling}. No refunds for partial months.
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.freeSub, { color: colors.textMuted }]}>Upgrade to Premium to unlock all features.</Text>
            <TouchableOpacity style={[styles.upgradeBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/premium")} activeOpacity={0.88}>
              <Ionicons name="rocket-outline" size={18} color="#000" />
              <Text style={[styles.upgradeBtnText, { color: "#000" }]}>View Premium Plans</Text>
            </TouchableOpacity>
          </>
        )}

        {/* DEV RESET */}
        <View style={[styles.devSection, { borderColor: colors.border }]}>
          <Text style={[styles.devLabel, { color: colors.textMuted }]}>🛠 Developer Tools</Text>
          <TouchableOpacity style={[styles.devBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleDevReset} activeOpacity={0.85}>
            <Ionicons name="refresh-outline" size={16} color={colors.primary} />
            <Text style={[styles.devBtnText, { color: colors.primary }]}>Reset to Free User (Demo)</Text>
          </TouchableOpacity>
          <Text style={[styles.devNote, { color: colors.textMuted }]}>Remove this section before releasing to production.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 48 },
  blobA: { position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: 999 },
  blobB: { position: "absolute", bottom: -100, left: -80, width: 240, height: 240, borderRadius: 999 },

  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 24 },
  backText: { fontSize: 15, fontWeight: "600" },

  hero: { alignItems: "center", marginBottom: 28 },
  iconWrap: { width: 76, height: 76, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 1 },
  iconWrapActive: { },
  iconWrapInactive: { backgroundColor: "rgba(75,85,99,0.15)", borderColor: "rgba(75,85,99,0.25)" },
  heroTitle: { fontSize: 24, fontWeight: "900", marginBottom: 10 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 5, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  statusBadgeActive: { },
  statusBadgeInactive: { backgroundColor: "rgba(75,85,99,0.1)", borderColor: "rgba(75,85,99,0.2)" },
  statusDot: { width: 7, height: 7, borderRadius: 99 },
  statusDotActive: { },
  statusDotInactive: { backgroundColor: "#6b7280" },
  statusText: { fontSize: 13, fontWeight: "700" },
  statusTextActive: { },
  statusTextInactive: { color: "#6b7280" },

  billingCard: { borderWidth: 1, borderRadius: 18, marginBottom: 24, overflow: "hidden" },
  cardTitle: { fontSize: 12, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", padding: 14, paddingBottom: 10, borderBottomWidth: 1 },
  billingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  billingRowBorder: { borderBottomWidth: 1 },
  billingLabel: { fontSize: 14 },
  billingValue: { fontSize: 14, fontWeight: "600" },

  sectionLabel: { fontSize: 15, fontWeight: "800", marginBottom: 12 },
  featuresCard: { borderWidth: 1, borderRadius: 18, marginBottom: 24, overflow: "hidden" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  featureRowBorder: { borderBottomWidth: 1 },
  featureIconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  featureLabel: { flex: 1, fontWeight: "600", fontSize: 14 },

  cancelBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderColor: "rgba(239,68,68,0.35)", borderRadius: 14, paddingVertical: 14, backgroundColor: "rgba(239,68,68,0.06)", marginBottom: 10 },
  cancelBtnText: { color: "#ef4444", fontWeight: "800", fontSize: 15 },
  cancelNote: { fontSize: 11, textAlign: "center", lineHeight: 16, marginBottom: 32 },

  freeSub: { textAlign: "center", fontSize: 15, marginBottom: 20 },
  upgradeBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 15, paddingHorizontal: 28, borderRadius: 14, justifyContent: "center", marginBottom: 32 },
  upgradeBtnText: { fontWeight: "900", fontSize: 15 },

  devSection: { borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 8 },
  devLabel: { fontWeight: "800", fontSize: 13, marginBottom: 12 },
  devBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 8 },
  devBtnText: { fontWeight: "700", fontSize: 14 },
  devNote: { fontSize: 11 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  gateTitle: { fontSize: 24, fontWeight: "900", marginTop: 24, marginBottom: 8 },
  gateSub: { textAlign: "center", fontSize: 15, lineHeight: 22, marginBottom: 32 },
  loginBtn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: "100%", alignItems: "center" },
  loginBtnText: { fontWeight: "900", fontSize: 16 },
  backBtnAlt: { marginTop: 20, padding: 12 },
  backTextAlt: { fontWeight: "700", fontSize: 14 },
});