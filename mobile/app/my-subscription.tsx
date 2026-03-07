// app/my-subscription.tsx
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePremium } from "../hooks/usePremium";

const PREMIUM_KEY = "PREMIUM_ACTIVE";
const SHARE_COUNT_KEY = "SHARE_COUNT";

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
  const { isPremium } = usePremium();
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
    await AsyncStorage.multiRemove([PREMIUM_KEY, SHARE_COUNT_KEY]);
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
            await AsyncStorage.multiRemove([PREMIUM_KEY, SHARE_COUNT_KEY]);
            Alert.alert("Reset Done", "You are now a free user.", [
              { text: "OK", onPress: () => router.replace("/") },
            ]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blobA} />
      <View style={styles.blobB} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#9fb1be" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.hero}>
          <View style={[styles.iconWrap, isPremium ? styles.iconWrapActive : styles.iconWrapInactive]}>
            <Text style={{ fontSize: 32 }}>{isPremium ? "✨" : "🔒"}</Text>
          </View>
          <Text style={styles.heroTitle}>
            {isPremium ? "Premium Active" : "No Active Subscription"}
          </Text>
          <View style={[styles.statusBadge, isPremium ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
            <View style={[styles.statusDot, isPremium ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={[styles.statusText, isPremium ? styles.statusTextActive : styles.statusTextInactive]}>
              {isPremium ? "Active" : "Free Plan"}
            </Text>
          </View>
        </View>

        {isPremium ? (
          <>
            {/* Billing card */}
            <View style={styles.billingCard}>
              <Text style={styles.cardTitle}>Billing Details</Text>
              {[
                { label: "Plan", value: billing.plan },
                { label: "Price", value: billing.price },
                { label: "Started", value: billing.startedOn },
                { label: "Next billing", value: billing.nextBilling },
                { label: "Status", value: billing.status },
              ].map((row, i, arr) => (
                <View key={i} style={[styles.billingRow, i < arr.length - 1 && styles.billingRowBorder]}>
                  <Text style={styles.billingLabel}>{row.label}</Text>
                  <Text style={[styles.billingValue, row.label === "Status" && { color: "#22c55e", fontWeight: "800" }]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Active features */}
            <Text style={styles.sectionLabel}>Your Premium Features</Text>
            <View style={styles.featuresCard}>
              {PREMIUM_FEATURES.map((f, i) => (
                <View key={i} style={[styles.featureRow, i < PREMIUM_FEATURES.length - 1 && styles.featureRowBorder]}>
                  <View style={[styles.featureIconWrap, { backgroundColor: f.color + "22" }]}>
                    <Ionicons name={f.icon as any} size={18} color={f.color} />
                  </View>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
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
            <Text style={styles.cancelNote}>
              You'll keep Premium access until April 7, 2026. No refunds for partial months.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.freeSub}>Upgrade to Premium to unlock all features.</Text>
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push("/premium")} activeOpacity={0.88}>
              <Ionicons name="rocket-outline" size={18} color="#051013" />
              <Text style={styles.upgradeBtnText}>View Premium Plans</Text>
            </TouchableOpacity>
          </>
        )}

        {/* DEV RESET — remove this block before shipping to production */}
        <View style={styles.devSection}>
          <Text style={styles.devLabel}>🛠 Developer Tools</Text>
          <TouchableOpacity style={styles.devBtn} onPress={handleDevReset} activeOpacity={0.85}>
            <Ionicons name="refresh-outline" size={16} color="#f59e0b" />
            <Text style={styles.devBtnText}>Reset to Free User (Demo)</Text>
          </TouchableOpacity>
          <Text style={styles.devNote}>Remove this section before releasing to production.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071024" },
  scroll: { padding: 20, paddingBottom: 48 },
  blobA: { position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.1)" },
  blobB: { position: "absolute", bottom: -100, left: -80, width: 240, height: 240, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.07)" },

  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 24 },
  backText: { color: "#9fb1be", fontSize: 15, fontWeight: "600" },

  hero: { alignItems: "center", marginBottom: 28 },
  iconWrap: { width: 76, height: 76, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 1 },
  iconWrapActive: { backgroundColor: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.3)" },
  iconWrapInactive: { backgroundColor: "rgba(75,85,99,0.15)", borderColor: "rgba(75,85,99,0.25)" },
  heroTitle: { fontSize: 24, fontWeight: "900", color: "#f0fdf4", marginBottom: 10 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 5, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  statusBadgeActive: { backgroundColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.25)" },
  statusBadgeInactive: { backgroundColor: "rgba(75,85,99,0.1)", borderColor: "rgba(75,85,99,0.2)" },
  statusDot: { width: 7, height: 7, borderRadius: 99 },
  statusDotActive: { backgroundColor: "#22c55e" },
  statusDotInactive: { backgroundColor: "#6b7280" },
  statusText: { fontSize: 13, fontWeight: "700" },
  statusTextActive: { color: "#22c55e" },
  statusTextInactive: { color: "#6b7280" },

  billingCard: { backgroundColor: "rgba(15,23,42,0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", borderRadius: 18, marginBottom: 24, overflow: "hidden" },
  cardTitle: { color: "#9fb1be", fontSize: 12, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", padding: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.08)" },
  billingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  billingRowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.06)" },
  billingLabel: { color: "#9fb1be", fontSize: 14 },
  billingValue: { color: "#e6eef3", fontSize: 14, fontWeight: "600" },

  sectionLabel: { color: "#cbd5e1", fontSize: 15, fontWeight: "800", marginBottom: 12 },
  featuresCard: { backgroundColor: "rgba(15,23,42,0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", borderRadius: 18, marginBottom: 24, overflow: "hidden" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.08)" },
  featureIconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  featureLabel: { flex: 1, color: "#e6eef3", fontWeight: "600", fontSize: 14 },

  cancelBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderColor: "rgba(239,68,68,0.35)", borderRadius: 14, paddingVertical: 14, backgroundColor: "rgba(239,68,68,0.06)", marginBottom: 10 },
  cancelBtnText: { color: "#ef4444", fontWeight: "800", fontSize: 15 },
  cancelNote: { color: "#4b5563", fontSize: 11, textAlign: "center", lineHeight: 16, marginBottom: 32 },

  freeSub: { color: "#9fb1be", textAlign: "center", fontSize: 15, marginBottom: 20 },
  upgradeBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#22c55e", paddingVertical: 15, paddingHorizontal: 28, borderRadius: 14, justifyContent: "center", marginBottom: 32 },
  upgradeBtnText: { color: "#051013", fontWeight: "900", fontSize: 15 },

  devSection: { borderWidth: 1, borderColor: "rgba(245,158,11,0.25)", borderRadius: 16, padding: 16, backgroundColor: "rgba(245,158,11,0.04)", marginTop: 8 },
  devLabel: { color: "#f59e0b", fontWeight: "800", fontSize: 13, marginBottom: 12 },
  devBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(245,158,11,0.1)", borderWidth: 1, borderColor: "rgba(245,158,11,0.2)", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 8 },
  devBtnText: { color: "#f59e0b", fontWeight: "700", fontSize: 14 },
  devNote: { color: "#78716c", fontSize: 11 },
});