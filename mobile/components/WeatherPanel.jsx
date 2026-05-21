// components/WeatherPanel.jsx
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ActivityIndicator,
  PanResponder,
  ScrollView,
  Dimensions,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const FULL_SNAP = 0;
const MINI_SNAP = SCREEN_HEIGHT * 0.42; // minimized — just handle + header visible
const CLOSE_THRESHOLD = SCREEN_HEIGHT * 0.72; // drag past this → close

export default function WeatherPanel({ visible, onClose, weather, weatherLoading }) {
  const { colors, resolvedTheme } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [minimized, setMinimized] = useState(false);

  // Snap to a position with spring
  const snapTo = (toValue, onDone) => {
    Animated.spring(slideAnim, {
      toValue,
      tension: 70,
      friction: 13,
      useNativeDriver: true,
    }).start(onDone);
  };

  useEffect(() => {
    if (visible) {
      setMinimized(false);
      slideAnim.setValue(SCREEN_HEIGHT);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: FULL_SNAP, tension: 70, friction: 13, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dy) > 5 && Math.abs(gs.dy) > Math.abs(gs.dx),

      onPanResponderMove: (_, gs) => {
        const base = minimized ? MINI_SNAP : FULL_SNAP;
        const next = base + gs.dy;
        // Allow dragging up a little (rubberbanding) and freely downward
        slideAnim.setValue(Math.max(-30, next));
      },

      onPanResponderRelease: (_, gs) => {
        const base = minimized ? MINI_SNAP : FULL_SNAP;
        const current = base + gs.dy;

        if (current >= CLOSE_THRESHOLD || gs.vy > 1.2) {
          // Close entirely
          Animated.timing(slideAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            setMinimized(false);
            onClose();
          });
          Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start();

        } else if (!minimized && (current >= MINI_SNAP * 0.55 || gs.vy > 0.5)) {
          // Minimize — snap to mini position
          snapTo(MINI_SNAP, () => setMinimized(true));

        } else if (minimized && gs.dy < -40) {
          // Swipe UP from minimized → restore full
          snapTo(FULL_SNAP, () => setMinimized(false));

        } else {
          // Snap back to current state
          snapTo(minimized ? MINI_SNAP : FULL_SNAP);
        }
      },
    })
  ).current;

  const w = weather?.weather;

  const conditionEmoji = () => {
    if (!w?.condition) return "🌤";
    const c = w.condition.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle")) return "🌧";
    if (c.includes("storm") || c.includes("thunder")) return "⛈";
    if (c.includes("cloud")) return "☁️";
    if (c.includes("clear") || c.includes("sunny")) return "☀️";
    if (c.includes("snow")) return "❄️";
    if (c.includes("fog") || c.includes("mist") || c.includes("haze")) return "🌫";
    return "🌤";
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop — tap to close, fades when minimized */}
      <Animated.View style={[wp.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Panel */}
      <Animated.View
        style={[wp.panel, { backgroundColor: colors.surface, borderColor: colors.border, transform: [{ translateY: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        {/* Handle bar — also shows expand hint when minimized */}
        <View style={wp.handleWrap}>
          <View style={[wp.handle, { backgroundColor: colors.border }]} />
          {minimized && (
            <Text style={[wp.expandHint, { color: colors.textMuted }]}>↑ Swipe up to expand</Text>
          )}
        </View>

        {/* Header — entire row is tappable to toggle minimize/expand */}
        <TouchableOpacity
          style={[wp.header, { borderBottomColor: colors.border }]}
          activeOpacity={0.7}
          onPress={() => {
            if (minimized) {
              snapTo(FULL_SNAP, () => setMinimized(false));
            } else {
              snapTo(MINI_SNAP, () => setMinimized(true));
            }
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[wp.headerTitle, { color: colors.text }]}>🌍 Local Weather</Text>
            {minimized && w && (
              <Text style={[wp.miniPreview, { color: colors.textMuted }]}>
                {conditionEmoji()}  {w.temperature}°C · {w.city}
              </Text>
            )}
          </View>

          {/* Arrow indicator */}
          <Text style={[wp.arrowIcon, { color: colors.textMuted }]}>{minimized ? "⬆" : "⬇"}</Text>

          {/* Close — stopPropagation so tapping ✕ doesn't also toggle */}
          <TouchableOpacity
            style={[wp.closeBtn, { backgroundColor: colors.background }]}
            onPress={(e) => { e.stopPropagation?.(); onClose(); }}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[wp.closeBtnText, { color: colors.textMuted }]}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Content — hidden when minimized */}
        {!minimized && (
          weatherLoading ? (
            <View style={wp.loadingWrap}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[wp.loadingText, { color: colors.textMuted }]}>Fetching weather…</Text>
            </View>
          ) : !w ? (
            <View style={wp.loadingWrap}>
              <Text style={wp.noDataEmoji}>📡</Text>
              <Text style={[wp.noDataText, { color: colors.text }]}>Weather data unavailable.</Text>
              <Text style={[wp.noDataSub, { color: colors.textMuted }]}>Make sure location access is enabled.</Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={wp.body}
              scrollEventThrottle={16}
            >
              <View style={[wp.heroRow, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[wp.city, { color: colors.text }]}>📍 {w.city}</Text>
                  <Text style={[wp.conditionText, { color: colors.primary }]}>{w.condition}</Text>
                </View>
                <Text style={wp.conditionEmoji}>{conditionEmoji()}</Text>
              </View>

              <View style={wp.statsRow}>
                <View style={[wp.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={wp.statIcon}>🌡</Text>
                  <Text style={[wp.statValue, { color: colors.text }]}>{w.temperature}°C</Text>
                  <Text style={[wp.statLabel, { color: colors.textMuted }]}>Temp</Text>
                </View>
                <View style={[wp.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={wp.statIcon}>💧</Text>
                  <Text style={[wp.statValue, { color: colors.text }]}>{w.humidity}%</Text>
                  <Text style={[wp.statLabel, { color: colors.textMuted }]}>Humidity</Text>
                </View>
                {w.windSpeed != null && (
                  <View style={[wp.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={wp.statIcon}>💨</Text>
                    <Text style={[wp.statValue, { color: colors.text }]}>{w.windSpeed} m/s</Text>
                    <Text style={[wp.statLabel, { color: colors.textMuted }]}>Wind</Text>
                  </View>
                )}
              </View>

              {!!weather?.alert && (
                <View style={[wp.adviceCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25' }]}>
                  <Text style={[wp.adviceTitle, { color: colors.primary }]}>🧠 Gardening Advice</Text>
                  <Text style={[wp.adviceTip, { color: colors.textMuted }]}>{weather.alert}</Text>
                </View>
              )}
            </ScrollView>
          )
        )}
      </Animated.View>
    </Modal>
  );
}

const wp = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "78%",           // fixed height so mini snap works correctly
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingBottom: 40,
  },
  handleWrap: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 2,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 99,
  },
  expandHint: {
    fontSize: 11,
    marginTop: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  miniPreview: { fontSize: 13, marginTop: 2 },

  arrowIcon: { fontSize: 14, marginRight: 4 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { fontSize: 14, fontWeight: "700" },

  loadingWrap: { alignItems: "center", paddingVertical: 48, gap: 12 },
  loadingText: { fontSize: 14 },
  noDataEmoji: { fontSize: 40 },
  noDataText: { fontWeight: "700", fontSize: 15 },
  noDataSub: { fontSize: 13 },

  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 14 },

  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  city: { fontSize: 17, fontWeight: "800", marginBottom: 4 },
  conditionText: { fontSize: 13, textTransform: "capitalize" },
  conditionEmoji: { fontSize: 52 },

  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 4,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontWeight: "800", fontSize: 15 },
  statLabel: { fontSize: 11 },

  adviceCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  adviceTitle: { fontWeight: "700", fontSize: 13 },
  adviceTip: { fontSize: 13, lineHeight: 20 },
});