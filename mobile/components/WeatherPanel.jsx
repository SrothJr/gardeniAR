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

const SCREEN_HEIGHT = Dimensions.get("window").height;
const FULL_SNAP = 0;
const MINI_SNAP = SCREEN_HEIGHT * 0.42; // minimized — just handle + header visible
const CLOSE_THRESHOLD = SCREEN_HEIGHT * 0.72; // drag past this → close

export default function WeatherPanel({ visible, onClose, weather, weatherLoading }) {
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
        style={[wp.panel, { transform: [{ translateY: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        {/* Handle bar — also shows expand hint when minimized */}
        <View style={wp.handleWrap}>
          <View style={wp.handle} />
          {minimized && (
            <Text style={wp.expandHint}>↑ Swipe up to expand</Text>
          )}
        </View>

        {/* Header — entire row is tappable to toggle minimize/expand */}
        <TouchableOpacity
          style={wp.header}
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
            <Text style={wp.headerTitle}>🌍 Local Weather</Text>
            {minimized && w && (
              <Text style={wp.miniPreview}>
                {conditionEmoji()}  {w.temperature}°C · {w.city}
              </Text>
            )}
          </View>

          {/* Arrow indicator */}
          <Text style={wp.arrowIcon}>{minimized ? "⬆" : "⬇"}</Text>

          {/* Close — stopPropagation so tapping ✕ doesn't also toggle */}
          <TouchableOpacity
            style={wp.closeBtn}
            onPress={(e) => { e.stopPropagation?.(); onClose(); }}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={wp.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Content — hidden when minimized */}
        {!minimized && (
          weatherLoading ? (
            <View style={wp.loadingWrap}>
              <ActivityIndicator size="large" color="#22c55e" />
              <Text style={wp.loadingText}>Fetching weather…</Text>
            </View>
          ) : !w ? (
            <View style={wp.loadingWrap}>
              <Text style={wp.noDataEmoji}>📡</Text>
              <Text style={wp.noDataText}>Weather data unavailable.</Text>
              <Text style={wp.noDataSub}>Make sure location access is enabled.</Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={wp.body}
              scrollEventThrottle={16}
            >
              <View style={wp.heroRow}>
                <View style={{ flex: 1 }}>
                  <Text style={wp.city}>📍 {w.city}</Text>
                  <Text style={wp.conditionText}>{w.condition}</Text>
                </View>
                <Text style={wp.conditionEmoji}>{conditionEmoji()}</Text>
              </View>

              <View style={wp.statsRow}>
                <View style={wp.statCard}>
                  <Text style={wp.statIcon}>🌡</Text>
                  <Text style={wp.statValue}>{w.temperature}°C</Text>
                  <Text style={wp.statLabel}>Temp</Text>
                </View>
                <View style={wp.statCard}>
                  <Text style={wp.statIcon}>💧</Text>
                  <Text style={wp.statValue}>{w.humidity}%</Text>
                  <Text style={wp.statLabel}>Humidity</Text>
                </View>
                {w.windSpeed != null && (
                  <View style={wp.statCard}>
                    <Text style={wp.statIcon}>💨</Text>
                    <Text style={wp.statValue}>{w.windSpeed} m/s</Text>
                    <Text style={wp.statLabel}>Wind</Text>
                  </View>
                )}
              </View>

              {!!weather?.alert && (
                <View style={wp.adviceCard}>
                  <Text style={wp.adviceTitle}>🧠 Gardening Advice</Text>
                  <Text style={wp.adviceTip}>{weather.alert}</Text>
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
    backgroundColor: "#0d1f35",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: "#1e293b",
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
    backgroundColor: "#334155",
  },
  expandHint: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    gap: 8,
  },
  headerTitle: { color: "#e5e7eb", fontSize: 16, fontWeight: "800" },
  miniPreview: { color: "#94a3b8", fontSize: 13, marginTop: 2 },

  arrowIcon: { fontSize: 14, color: "#64748b", marginRight: 4 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { color: "#94a3b8", fontSize: 14, fontWeight: "700" },

  loadingWrap: { alignItems: "center", paddingVertical: 48, gap: 12 },
  loadingText: { color: "#94a3b8", fontSize: 14 },
  noDataEmoji: { fontSize: 40 },
  noDataText: { color: "#e5e7eb", fontWeight: "700", fontSize: 15 },
  noDataSub: { color: "#64748b", fontSize: 13 },

  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 14 },

  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34,197,94,0.08)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.18)",
    borderRadius: 18,
    padding: 16,
  },
  city: { color: "#e5e7eb", fontSize: 17, fontWeight: "800", marginBottom: 4 },
  conditionText: { color: "#a7f3d0", fontSize: 13, textTransform: "capitalize" },
  conditionEmoji: { fontSize: 52 },

  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 4,
  },
  statIcon: { fontSize: 20 },
  statValue: { color: "#e5e7eb", fontWeight: "800", fontSize: 15 },
  statLabel: { color: "#64748b", fontSize: 11 },

  adviceCard: {
    backgroundColor: "rgba(251,191,36,0.08)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.22)",
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  adviceTitle: { color: "#fbbf24", fontWeight: "700", fontSize: 13 },
  adviceTip: { color: "#cbd5e1", fontSize: 13, lineHeight: 20 },
});