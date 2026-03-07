// app/premium.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_KEY = "PREMIUM_ACTIVE";

const FREE_FEATURES = [
  { label: "Share Garden", detail: "2 free shares", locked: false },
  { label: "Weed Scanner", detail: "Unlimited", locked: false },
  { label: "Soil Test", detail: "Unlimited", locked: false },
  { label: "Crop Suggestions", detail: "Unlimited", locked: false },
  { label: "Plant Growth Tracking", detail: "Locked", locked: true },
  { label: "Disease Detection", detail: "Locked", locked: true },
  { label: "View in AR", detail: "Locked", locked: true },
];

const PREMIUM_FEATURES = [
  { icon: "share-social-outline", label: "Unlimited Share Garden", color: "#4ade80" },
  { icon: "trending-up-outline", label: "Plant Growth Tracking", color: "#34d399" },
  { icon: "medkit-outline", label: "Disease Detection AI", color: "#a78bfa" },
  { icon: "cube-outline", label: "View in AR", color: "#60a5fa" },
  { icon: "notifications-outline", label: "Harvest Alerts", color: "#fbbf24" },
  { icon: "cloud-offline-outline", label: "Offline Mode", color: "#f87171" },
];

export default function PremiumScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    // 🔌 Wire your real payment flow here (RevenueCat, Stripe, etc.)
    // For now we simulate a successful purchase:
    await new Promise((r) => setTimeout(r, 1200));
    await AsyncStorage.setItem(PREMIUM_KEY, "1");
    setLoading(false);
    Alert.alert("🎉 Premium Activated!", "You now have full access to all features.", [
      { text: "Let's go!", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Decorative blobs */}
      <View style={styles.blobA} />
      <View style={styles.blobB} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#9fb1be" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.crownWrap}>
            <Text style={styles.crownEmoji}>✨</Text>
          </View>
          <Text style={styles.heroTitle}>GardeniAR Premium</Text>
          <Text style={styles.heroSub}>
            Unlock every feature and grow your garden to its full potential
          </Text>
        </View>

        {/* Price card */}
        <View style={styles.priceCard}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>MOST POPULAR</Text>
          </View>
          <Text style={styles.price}>
            $4.99<Text style={styles.pricePer}> / month</Text>
          </Text>
          <Text style={styles.priceNote}>Cancel anytime · Secure payment</Text>

          <TouchableOpacity
            style={[styles.upgradeBtn, loading && { opacity: 0.7 }]}
            onPress={handleUpgrade}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#051013" />
            ) : (
              <>
                <Ionicons name="rocket-outline" size={18} color="#051013" />
                <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Premium features */}
        <Text style={styles.sectionLabel}>Everything in Premium</Text>
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

        {/* Comparison table */}
        <Text style={styles.sectionLabel}>Free vs Premium</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol, { flex: 2 }]}>Feature</Text>
            <Text style={styles.tableCol}>Free</Text>
            <Text style={[styles.tableCol, { color: "#22c55e" }]}>Premium</Text>
          </View>
          {FREE_FEATURES.map((f, i) => (
            <View key={i} style={[styles.tableRow, i < FREE_FEATURES.length - 1 && styles.tableRowBorder]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{f.label}</Text>
              <Text style={[styles.tableCell, f.locked && { color: "#ef4444" }]}>
                {f.locked ? "🔒" : f.detail}
              </Text>
              <Text style={[styles.tableCell, { color: "#22c55e" }]}>✓</Text>
            </View>
          ))}
        </View>

        <Text style={styles.legal}>
          Subscription renews monthly. Cancel anytime in your account settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071024" },
  scroll: { padding: 20, paddingBottom: 48 },

  blobA: { position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.12)" },
  blobB: { position: "absolute", bottom: -100, left: -80, width: 240, height: 240, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.08)" },

  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 20 },
  backText: { color: "#9fb1be", fontSize: 15, fontWeight: "600" },

  hero: { alignItems: "center", marginBottom: 28 },
  crownWrap: { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(34,197,94,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 1, borderColor: "rgba(34,197,94,0.25)" },
  crownEmoji: { fontSize: 34 },
  heroTitle: { fontSize: 28, fontWeight: "900", color: "#f0fdf4", marginBottom: 8, letterSpacing: -0.5 },
  heroSub: { color: "#9fb1be", textAlign: "center", fontSize: 14, lineHeight: 20, paddingHorizontal: 10 },

  priceCard: { backgroundColor: "rgba(34,197,94,0.08)", borderWidth: 1.5, borderColor: "rgba(34,197,94,0.3)", borderRadius: 20, padding: 22, alignItems: "center", marginBottom: 28, position: "relative" },
  priceBadge: { position: "absolute", top: -12, backgroundColor: "#22c55e", borderRadius: 20, paddingVertical: 3, paddingHorizontal: 12 },
  priceBadgeText: { color: "#051013", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  price: { fontSize: 40, fontWeight: "900", color: "#f0fdf4", marginTop: 8 },
  pricePer: { fontSize: 16, fontWeight: "500", color: "#9fb1be" },
  priceNote: { color: "#9fb1be", fontSize: 12, marginTop: 4, marginBottom: 18 },
  upgradeBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#22c55e", paddingVertical: 15, paddingHorizontal: 36, borderRadius: 16, width: "100%", justifyContent: "center" },
  upgradeBtnText: { color: "#051013", fontWeight: "900", fontSize: 16 },

  sectionLabel: { color: "#cbd5e1", fontSize: 15, fontWeight: "800", marginBottom: 12 },
  featuresCard: { backgroundColor: "rgba(15,23,42,0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", borderRadius: 18, marginBottom: 28, overflow: "hidden" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.08)" },
  featureIconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  featureLabel: { flex: 1, color: "#e6eef3", fontWeight: "600", fontSize: 14 },

  tableCard: { backgroundColor: "rgba(15,23,42,0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", borderRadius: 18, marginBottom: 24, overflow: "hidden" },
  tableHeader: { flexDirection: "row", padding: 12, backgroundColor: "rgba(255,255,255,0.04)", borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.1)" },
  tableCol: { flex: 1, color: "#9fb1be", fontWeight: "800", fontSize: 12, textAlign: "center" },
  tableRow: { flexDirection: "row", padding: 12 },
  tableRowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.06)" },
  tableCell: { flex: 1, color: "#cbd5e1", fontSize: 12, textAlign: "center" },

  legal: { color: "#4b5563", fontSize: 11, textAlign: "center", lineHeight: 16 },
});