// app/index.jsx
import { Link, useRouter, useFocusEffect } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import WeatherPanel from "../components/WeatherPanel";
import { BACKEND } from "../config";
import * as Location from "expo-location";
import { usePremium } from "../hooks/usePremium";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function Index() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { isPremium, sharesLeft } = usePremium();
  const { colors, resolvedTheme } = useTheme();

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherPanelOpen, setWeatherPanelOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkUser();
    }, [])
  );

  const checkUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      const userData = userStr ? JSON.parse(userStr) : null;
      if (userData && userData._id) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/auth/login");
  };

  const handleBellPress = async () => {
    setWeatherPanelOpen(true);
    if (!weather && !weatherLoading) fetchWeather();
  };

  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const res = await fetch(`${BACKEND}/api/weather/alert?lat=${latitude}&lon=${longitude}&lang=${i18n.language}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("fetchWeather error", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const firstName = user?.name?.split?.(" ")?.[0] ?? "Guest";

  // Service tiles — premiumLocked = fully locked, shareGated = 2 free uses then locked
  const ServiceTile = ({ icon, label, sub, href, tone = "mint", premiumLocked = false, shareGated = false }) => {
    const toneStyles =
      tone === "blue" ? styles.toneBlue
      : tone === "amber" ? styles.toneAmber
      : tone === "rose" ? styles.toneRose
      : styles.toneMint;

    const isLocked = premiumLocked && !isPremium;
    // Share is never hard-locked from the home tile — the gate lives inside camera.jsx
    const showLockIcon = isLocked;

    const handlePress = () => {
      // If not logged in, clicking any premium-related feature should require login
      if (!user && (premiumLocked || shareGated)) {
        Alert.alert("Login Required", "Please sign in to access premium features.", [
          { text: "Cancel", style: "cancel" },
          { text: "Log In", onPress: () => router.push("/auth/login") },
        ]);
        return;
      }

      if (isLocked) {
        router.push("/premium");
        return;
      }
      router.push(href);
    };

    // For share tile: show how many free uses remain
    const subLabel = isLocked
      ? t('common.premium')
      : shareGated && !isPremium
        ? `${sharesLeft} free use${sharesLeft !== 1 ? "s" : ""} left`
        : sub;

    return (
      <TouchableOpacity activeOpacity={0.92} style={[styles.serviceTile, { backgroundColor: colors.surface, borderColor: colors.border }, isLocked && styles.serviceTileLocked]} onPress={handlePress}>
        <View style={[styles.serviceIconWrap, toneStyles, isLocked && styles.serviceIconLocked]}>
          <Ionicons name={icon} size={20} color={isLocked ? colors.textMuted : "#051013"} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={[styles.serviceLabel, { color: colors.text }, isLocked && styles.serviceLabelLocked]} numberOfLines={1}>
            {label}
          </Text>
          {showLockIcon && (
            <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
          )}
        </View>
        {!!subLabel && (
          <Text
            style={[
              styles.serviceSub,
              { color: colors.textMuted },
              isLocked && { color: colors.border },
              shareGated && !isPremium && sharesLeft === 0 && { color: "#ef4444" },
            ]}
            numberOfLines={1}
          >
            {subLabel}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const FeaturedCard = ({ title, subtitle, icon, href, imageSource }) => (
    <Link href={href} asChild>
      <TouchableOpacity activeOpacity={0.92} style={styles.featuredCard}>
        <View style={styles.featuredTop}>
          <View style={styles.featuredIcon}>
            <Ionicons name={icon} size={18} color="#06150b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.featuredTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.featuredSubtitle} numberOfLines={2}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.featuredBottom}>
          <Text style={styles.featuredCta}>Open</Text>
          <Ionicons name="chevron-forward" size={18} color="#9fb1be" />
        </View>
        {!!imageSource && (
          <Image source={imageSource} style={styles.featuredImage} resizeMode="contain" />
        )}
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <View style={[styles.bgBlobA, { backgroundColor: colors.primary + '20' }]} />
      <View style={[styles.bgBlobB, { backgroundColor: colors.primary + '10' }]} />

      <WeatherPanel
        visible={weatherPanelOpen}
        onClose={() => setWeatherPanelOpen(false)}
        weather={weather}
        weatherLoading={weatherLoading}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.brand, { color: colors.text }]}>GardeniAR</Text>
            <Text style={[styles.greeting, { color: colors.textMuted }]} numberOfLines={1}>
              {user ? `${t('common.welcome')}, ${firstName}` : t('common.grow_smarter')}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }, weather && styles.iconBtnActive]}
            onPress={handleBellPress}
          >
            <Ionicons name="notifications-outline" size={20} color={weather ? colors.primary : colors.textMuted} />
            {weather && <View style={[styles.bellDot, { backgroundColor: colors.primary, borderColor: colors.background }]} />}
          </TouchableOpacity>

          {/* Premium chip — only shown for logged in users */}
          {user && (
            <TouchableOpacity
            style={[styles.premiumChip, { backgroundColor: colors.surface, borderColor: colors.border }, isPremium && styles.premiumChipActive]}
            onPress={() => router.push(isPremium ? "/my-subscription" : "/premium")}
            activeOpacity={0.85}
          >
            <Text style={[styles.premiumChipText, { color: colors.textMuted }, isPremium && styles.premiumChipTextActive]}>
              {isPremium ? `✨ ${t('common.premium')}` : t('common.upgrade')}
            </Text>
          </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}
            onPress={() => router.push(user ? "/profile" : "/auth/login")}
            activeOpacity={0.8}
          >
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {user ? firstName?.slice?.(0, 1)?.toUpperCase?.() ?? "U" : "?"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Free-user info strip — only for logged in users */}
        {user && !isPremium && (
          <TouchableOpacity style={[styles.freeStrip, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/premium")} activeOpacity={0.85}>
            <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
            <Text style={[styles.freeStripText, { color: colors.textMuted }]}>
              Share Garden: <Text style={{ color: sharesLeft === 0 ? "#ef4444" : colors.primary, fontWeight: "700" }}>{sharesLeft} free use{sharesLeft !== 1 ? "s" : ""} left</Text>
              {"  ·  "}
              <Text style={{ color: "#3b82f6" }}>Growth, Disease & AR locked 🔒</Text>
            </Text>
            <Ionicons name="chevron-forward" size={13} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        <View style={styles.featuredRow}>
          <FeaturedCard
            title={t('services.weed_scanner')}
            subtitle="Point your camera and get AI identification"
            icon="scan-outline"
            href="/identify"
            imageSource={require("../assets/images/basil.png")}
          />
          <FeaturedCard
            title={t('services.soil_test')}
            subtitle="Scan soil color & texture for quick tips"
            icon="color-wand-outline"
            href="/soil"
            imageSource={require("../assets/images/seed.png")}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.services')}</Text>
          <Link href="/explore" asChild>
            <TouchableOpacity activeOpacity={0.8} style={[styles.sectionLink, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
              <Text style={[styles.sectionLinkText, { color: colors.primary }]}>{t('common.see_all')}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.servicesGrid}>
          <ServiceTile icon="search-outline"      label={t('services.explore')}        sub="Plants & tips"   href="/explore"          tone="blue" />
          <ServiceTile icon="leaf-outline"        label={t('services.companions')}     sub="Plant buddies"   href="/companions"       tone="amber" />
          <ServiceTile icon="checkbox-outline"    label={t('services.tasks')}          sub="Daily checklist" href="/checklist"        tone="amber" />
          <ServiceTile icon="chatbubbles-outline" label={t('services.forum')}          sub="Ask & help"      href="/forum"            tone="blue" />
          <ServiceTile icon="cart-outline"        label={t('services.cart')}           sub="Your items"      href="/cart"             tone="rose" />
          {/* 🔒 Premium locked tiles */}
          <ServiceTile icon="trending-up-outline" label={t('services.growth')}         sub="Track plants"    href="/growth"           tone="mint"  premiumLocked />
          <ServiceTile icon="cube-outline"        label={t('services.plant_tracker')}  sub="AR & Disease"    href="/ar/PlantTracker"  tone="mint"  premiumLocked />
          <ServiceTile icon="camera-outline"      label={t('services.share')}          sub="2 free uses"     href="/share/camera"     tone="rose"  shareGated />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.for_you')}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoRow}>
          <Link href="/collections/seasonal" asChild>
            <TouchableOpacity activeOpacity={0.92} style={styles.promoCard}>
              <View style={styles.promoTextWrap}>
                <Text style={styles.promoTitle}>{t('promo.seasonal_picks')}</Text>
                <Text style={styles.promoSub}>{t('promo.seasonal_sub')}</Text>
              </View>
              <Image source={require("../assets/images/lettuce.png")} style={styles.promoImage} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
          <Link href="/routines/watering" asChild>
            <TouchableOpacity activeOpacity={0.92} style={[styles.promoCard, styles.promoAlt]}>
              <View style={styles.promoTextWrap}>
                <Text style={styles.promoTitle}>{t('promo.watering_routine')}</Text>
                <Text style={styles.promoSub}>{t('promo.watering_sub')}</Text>
              </View>
              <Image source={require("../assets/images/cucumber.png")} style={styles.promoImage} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
        </ScrollView>

        <View style={[styles.authCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {user ? (
            <View style={styles.authRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.authTitle, { color: colors.text }]} numberOfLines={1}>{t('common.welcome')}, {firstName}</Text>
                <Text style={[styles.authSub, { color: colors.textMuted }]}>You'll get personalized recommendations</Text>
              </View>
              <TouchableOpacity activeOpacity={0.9} style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={18} color="#fff" />
                <Text style={styles.authBtnText}>{t('common.logout')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.authTitle, { color: colors.text }]}>{t('common.login')}</Text>
                <Text style={[styles.authSub, { color: colors.textMuted }]}>Sync your garden and track progress</Text>
              </View>
              <Link href="/auth/login" asChild>
                <TouchableOpacity activeOpacity={0.9} style={[styles.loginBtn, { backgroundColor: colors.primary }]}>
                  <Ionicons name="log-in-outline" size={18} color="#051013" />
                  <Text style={[styles.authBtnText, { color: "#051013" }]}>{t('common.login')}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 24 },
  bgBlobA: { position: "absolute", top: -120, right: -120, width: 240, height: 240, borderRadius: 999 },
  bgBlobB: { position: "absolute", bottom: -140, left: -120, width: 260, height: 260, borderRadius: 999 },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 10, paddingBottom: 12 },
  brand: { fontSize: 26, fontWeight: "800", letterSpacing: 0.2 },
  greeting: { marginTop: 3, fontSize: 14 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  iconBtnActive: { borderColor: "rgba(34,197,94,0.4)", backgroundColor: "rgba(34,197,94,0.1)" },
  bellDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 99, borderWidth: 1.5 },
  avatar: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
  avatarText: { fontWeight: "800" },

  premiumChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  premiumChipActive: { },
  premiumChipText: { fontWeight: "700", fontSize: 12 },
  premiumChipTextActive: { },

  freeStrip: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 12 },
  freeStripText: { flex: 1, fontSize: 12 },

  featuredRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  featuredCard: { flex: 1, minHeight: 132, borderRadius: 18, padding: 14, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", overflow: "hidden", ...Platform.select({ android: { elevation: 3 }, ios: { shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } } }) },
  featuredTop: { flexDirection: "row", gap: 10, alignItems: "center" },
  featuredIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "rgba(34,197,94,0.95)", alignItems: "center", justifyContent: "center" },
  featuredTitle: { color: "#e6eef3", fontWeight: "800", fontSize: 15 },
  featuredSubtitle: { color: "#9fb1be", marginTop: 2, fontSize: 12, lineHeight: 16 },
  featuredBottom: { position: "absolute", bottom: 12, left: 14, right: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  featuredCta: { color: "#cbd5e1", fontWeight: "700" },
  featuredImage: { position: "absolute", right: -10, bottom: -10, width: 92, height: 92, opacity: 0.9 },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  sectionLink: { flexDirection: "row", alignItems: "center", gap: 2, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
  sectionLinkText: { fontWeight: "700", fontSize: 13 },

  servicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  serviceTile: { width: "48.5%", padding: 14, borderRadius: 18, borderWidth: 1 },
  serviceTileLocked: { opacity: 0.6 },
  serviceIconWrap: { width: 36, height: 36, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  serviceIconLocked: { backgroundColor: "rgba(55,65,81,0.6)" },
  serviceLabel: { fontWeight: "800", fontSize: 14 },
  serviceLabelLocked: { },
  serviceSub: { fontSize: 12, marginTop: 3 },
  toneMint: { backgroundColor: "rgba(34,197,94,0.9)" },
  toneBlue: { backgroundColor: "rgba(59,130,246,0.92)" },
  toneAmber: { backgroundColor: "rgba(245,158,11,0.92)" },
  toneRose: { backgroundColor: "rgba(244,63,94,0.9)" },

  promoRow: { gap: 12, paddingBottom: 6 },
  promoCard: { width: 260, minHeight: 110, borderRadius: 18, padding: 14, backgroundColor: "rgba(34, 197, 94, 0.16)", borderWidth: 1, borderColor: "rgba(34, 197, 94, 0.22)", overflow: "hidden" },
  promoAlt: { backgroundColor: "rgba(59, 130, 246, 0.14)", borderColor: "rgba(59, 130, 246, 0.20)" },
  promoTextWrap: { paddingRight: 88 },
  promoTitle: { color: "#e6eef3", fontWeight: "900", fontSize: 15 },
  promoSub: { color: "#b3c4cf", marginTop: 4, fontSize: 12, lineHeight: 16 },
  promoImage: { position: "absolute", right: 8, bottom: -8, width: 90, height: 90, opacity: 0.95 },

  authCard: { marginTop: 16, borderRadius: 18, padding: 14, borderWidth: 1 },
  authRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  authTitle: { fontWeight: "900", fontSize: 14 },
  authSub: { marginTop: 3, fontSize: 12 },
  loginBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14 },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(239,68,68,0.92)" },
  authBtnText: { color: "#fff", fontWeight: "900" },
});
