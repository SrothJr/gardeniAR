// components/WeatherPanel.jsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ActivityIndicator,
} from "react-native";

export default function WeatherPanel({ visible, onClose, weather, weatherLoading }) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 300, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const w = weather?.weather;

  // Map condition to an emoji
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
      {/* Backdrop */}
      <Animated.View style={[wp.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Panel */}
      <Animated.View style={[wp.panel, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle bar */}
        <View style={wp.handle} />

        {/* Header */}
        <View style={wp.header}>
          <Text style={wp.headerTitle}>🌍 Local Weather</Text>
          <TouchableOpacity style={wp.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={wp.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {weatherLoading ? (
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
          <View style={wp.body}>
            {/* City + condition hero */}
            <View style={wp.heroRow}>
              <View style={{ flex: 1 }}>
                <Text style={wp.city}>📍 {w.city}</Text>
                <Text style={wp.conditionText}>{w.condition}</Text>
              </View>
              <Text style={wp.conditionEmoji}>{conditionEmoji()}</Text>
            </View>

            {/* Stats row */}
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

            {/* Gardening advice */}
            {!!weather?.alert && (
              <View style={wp.adviceCard}>
                <Text style={wp.adviceTitle}>🧠 Gardening Advice</Text>
                <Text style={wp.adviceTip}>{weather.alert}</Text>
              </View>
            )}
          </View>
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
    backgroundColor: "#0d1f35",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: "#1e293b",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: "#334155",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerTitle: { color: "#e5e7eb", fontSize: 16, fontWeight: "800" },
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

  body: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },

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