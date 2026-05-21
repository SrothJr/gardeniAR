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
import { useRouter, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { usePremium } from "../hooks/usePremium";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function PremiumScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { activatePremium, user, loaded } = usePremium();

  const FREE_FEATURES = [
    { label: t("premium.share_garden"), detail: t("premium.shares_2"), locked: false },
    { label: t("premium.weed_scanner"), detail: t("premium.unlimited"), locked: false },
    { label: t("premium.soil_test"), detail: t("premium.unlimited"), locked: false },
    { label: t("premium.crop_suggestions"), detail: t("premium.unlimited"), locked: false },
    { label: t("premium.plant_growth"), detail: t("premium.locked"), locked: true },
    { label: t("premium.disease_ai"), detail: t("premium.locked"), locked: true },
    { label: t("premium.view_ar"), detail: t("premium.locked"), locked: true },
  ];

  const PREMIUM_FEATURES = [
    { icon: "share-social-outline", label: t("premium.unlimited_share"), color: "#4ade80" },
    { icon: "trending-up-outline", label: t("premium.plant_growth"), color: "#34d399" },
    { icon: "medkit-outline", label: t("premium.disease_ai"), color: "#a78bfa" },
    { icon: "cube-outline", label: t("premium.view_ar"), color: "#60a5fa" },
    { icon: "notifications-outline", label: t("premium.harvest_alerts"), color: "#fbbf24" },
    { icon: "cloud-offline-outline", label: t("premium.offline_mode"), color: "#f87171" },
  ];

  const handleUpgrade = async () => {
    if (!user) {
      Alert.alert(t("premium.login_required"), t("premium.login_required_sub"), [
        { text: "Cancel", style: "cancel" },
        { text: t("premium.login_btn"), onPress: () => router.push("/auth/login") },
      ]);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    await activatePremium();
    setLoading(false);
    Alert.alert(t("premium.activated_title"), t("premium.activated_sub"), [
      { text: t("premium.lets_go"), onPress: () => router.back() },
    ]);
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
          <Text style={[styles.gateTitle, { color: colors.text }]}>{t("premium.login_required")}</Text>
          <Text style={[styles.gateSub, { color: colors.textMuted }]}>
            {t("premium.login_required_sub")}
          </Text>
          <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/auth/login")}>
            <Text style={[styles.loginBtnText, { color: '#000' }]}>{t("premium.login_btn")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtnAlt} onPress={() => router.back()}>
            <Text style={[styles.backTextAlt, { color: colors.textMuted }]}>{t("premium.go_back")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      {/* Decorative blobs */}
      <View style={[styles.blobA, { backgroundColor: colors.primary + '12' }]} />
      <View style={[styles.blobB, { backgroundColor: colors.primary + '08' }]} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>{t("premium.title")}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.crownWrap, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '25' }]}>
            <Text style={styles.crownEmoji}>✨</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{t("premium.title")}</Text>
          <Text style={[styles.heroSub, { color: colors.textMuted }]}>
            {t("premium.unlock_full")}
          </Text>
        </View>

        {/* Price card */}
        <View style={[styles.priceCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }]}>
          <View style={[styles.priceBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.priceBadgeText, { color: '#000' }]}>{t("premium.most_popular")}</Text>
          </View>
          <Text style={[styles.price, { color: colors.text }]}>
            $4.99<Text style={[styles.pricePer, { color: colors.textMuted }]}> / {t("premium.month")}</Text>
          </Text>
          <Text style={[styles.priceNote, { color: colors.textMuted }]}>{t("premium.secure_payment")}</Text>

          <TouchableOpacity
            style={[styles.upgradeBtn, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]}
            onPress={handleUpgrade}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="rocket-outline" size={18} color="#000" />
                <Text style={[styles.upgradeBtnText, { color: '#000' }]}>{t("premium.upgrade_btn")}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Premium features */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t("premium.everything_premium")}</Text>
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

        {/* Comparison table */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t("premium.free_vs_premium")}</Text>
        <View style={[styles.tableCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.background + '40', borderBottomColor: colors.border }]}>
            <Text style={[styles.tableCol, { flex: 2, color: colors.textMuted }]}>{t("premium.feature")}</Text>
            <Text style={[styles.tableCol, { color: colors.textMuted }]}>{t("premium.free")}</Text>
            <Text style={[styles.tableCol, { color: colors.primary }]}>{t("premium.premium_label")}</Text>
          </View>
          {FREE_FEATURES.map((f, i) => (
            <View key={i} style={[styles.tableRow, i < FREE_FEATURES.length - 1 && [styles.tableRowBorder, { borderBottomColor: colors.border }]]}>
              <Text style={[styles.tableCell, { flex: 2, color: colors.text }]}>{f.label}</Text>
              <Text style={[styles.tableCell, { color: colors.textMuted }, f.locked && { color: "#ef4444" }]}>
                {f.locked ? "🔒" : f.detail}
              </Text>
              <Text style={[styles.tableCell, { color: colors.primary }]}>✓</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.legal, { color: colors.textMuted }]}>
          {t("premium.legal_note")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 48 },

  blobA: { position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: 999 },
  blobB: { position: "absolute", bottom: -100, left: -80, width: 240, height: 240, borderRadius: 999 },

  backBtn: { padding: 4 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
  },

  hero: { alignItems: "center", marginBottom: 28 },
  crownWrap: { width: 72, height: 72, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 1 },
  crownEmoji: { fontSize: 34 },
  heroTitle: { fontSize: 28, fontWeight: "900", marginBottom: 8, letterSpacing: -0.5 },
  heroSub: { textAlign: "center", fontSize: 14, lineHeight: 20, paddingHorizontal: 10 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  gateTitle: { fontSize: 24, fontWeight: "900", marginTop: 24, marginBottom: 8 },
  gateSub: { textAlign: "center", fontSize: 15, lineHeight: 22, marginBottom: 32 },
  loginBtn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: "100%", alignItems: "center" },
  loginBtnText: { fontWeight: "900", fontSize: 16 },
  backBtnAlt: { marginTop: 20, padding: 12 },
  backTextAlt: { fontWeight: "700", fontSize: 14 },

  priceCard: { borderWidth: 1.5, borderRadius: 20, padding: 22, alignItems: "center", marginBottom: 28, position: "relative" },
  priceBadge: { position: "absolute", top: -12, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 12 },
  priceBadgeText: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  price: { fontSize: 40, fontWeight: "900", marginTop: 8 },
  pricePer: { fontSize: 16, fontWeight: "500" },
  priceNote: { fontSize: 12, marginTop: 4, marginBottom: 18 },
  upgradeBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 15, paddingHorizontal: 36, borderRadius: 16, width: "100%", justifyContent: "center" },
  upgradeBtnText: { fontWeight: "900", fontSize: 16 },

  sectionLabel: { fontSize: 15, fontWeight: "800", marginBottom: 12 },
  featuresCard: { borderWidth: 1, borderRadius: 18, marginBottom: 28, overflow: "hidden" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  featureRowBorder: { borderBottomWidth: 1 },
  featureIconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  featureLabel: { flex: 1, fontWeight: "600", fontSize: 14 },

  tableCard: { borderWidth: 1, borderRadius: 18, marginBottom: 24, overflow: "hidden" },
  tableHeader: { flexDirection: "row", padding: 12, borderBottomWidth: 1 },
  tableCol: { flex: 1, fontWeight: "800", fontSize: 12, textAlign: "center" },
  tableRow: { flexDirection: "row", padding: 12 },
  tableRowBorder: { borderBottomWidth: 1 },
  tableCell: { flex: 1, fontSize: 12, textAlign: "center" },

  legal: { fontSize: 11, textAlign: "center", lineHeight: 16 },
});