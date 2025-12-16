import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { nBACKEND } from "../../config";
import { Ionicons } from "@expo/vector-icons";

const STAGES = ["Seedling", "Vegetative", "Flowering"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export default function CareGuideDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("Vegetative");
  const [activeSeason, setActiveSeason] = useState("Summer");

  useEffect(() => {
    // Auto-detect current season on load
    // use weather api to detect season
    // use accurate data to show details
    // SHOW DIFFERENT PHOTOS FOR DIFFERENT LIFE STAGES
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setActiveSeason("Spring");
    else if (month >= 5 && month <= 7) setActiveSeason("Summer");
    else if (month >= 8 && month <= 10) setActiveSeason("Autumn");
    else setActiveSeason("Winter");
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`${nBACKEND}/api/care-guide/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const plantData = data.guide || data;
        setGuide(plantData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Guide not found</Text>
      </View>
    );
  }

  const getRule = (list) => {
    if (!list || list.length === 0) return null;

    // 1. Try Exact Match (Stage + Season)
    const exact = list.find(
      (r) =>
        r.lifeStage === activeStage &&
        (Array.isArray(r.season)
          ? r.season.includes(activeSeason)
          : r.season === activeSeason)
    );
    if (exact) return exact;

    // 2. Try Stage + 'All Year'
    const allYear = list.find(
      (r) =>
        r.lifeStage === activeStage &&
        (Array.isArray(r.season)
          ? r.season.includes("All Year")
          : r.season === "All Year")
    );
    if (allYear) return allYear;

    // 3. Try 'General' Stage + Season
    const generalSeason = list.find(
      (r) =>
        r.lifeStage === "General" &&
        (Array.isArray(r.season)
          ? r.season.includes(activeSeason)
          : r.season === activeSeason)
    );
    if (generalSeason) return generalSeason;

    // 4. Try 'General' + 'All Year'
    return list.find(
      (r) =>
        r.lifeStage === "General" &&
        (Array.isArray(r.season)
          ? r.season.includes("All Year")
          : r.season === "All Year")
    );
  };

  const waterRule = getRule(guide.waterConfig);
  const fertRule = getRule(guide.fertilizerConfig);

  const currentImage =
    guide.stageImages?.[activeStage.toLowerCase()] ||
    guide.image ||
    "https://picsum.photos/800/600";

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Image
        source={{ uri: currentImage }}
        style={styles.hero}
      />

      <View style={styles.content}>
        <Text style={styles.name}>{guide.name}</Text>
        <Text style={styles.scientific}>{guide.scientificName}</Text>

        {/* --- SELECTORS --- */}
        <View style={styles.controls}>
          {/* Stage Selector */}
          <View style={styles.controlGroup}>
            <Text style={styles.sectionTitle}>Life Stage</Text>
            <View style={styles.pills}>
              {STAGES.map((stage) => (
                <TouchableOpacity
                  key={stage}
                  style={[
                    styles.pill,
                    activeStage === stage && styles.pillActive,
                  ]}
                  onPress={() => setActiveStage(stage)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      activeStage === stage && styles.pillTextActive,
                    ]}
                  >
                    {stage}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Season Selector */}
          <View style={styles.controlGroup}>
            <Text style={styles.sectionTitle}>Season</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillsScroll}
            >
              {SEASONS.map((season) => (
                <TouchableOpacity
                  key={season}
                  style={[
                    styles.pill,
                    activeSeason === season && styles.pillActive,
                  ]}
                  onPress={() => setActiveSeason(season)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      activeSeason === season && styles.pillTextActive,
                    ]}
                  >
                    {season}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* --- CARDS --- */}

        {/* Water Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="water" size={24} color="#3b82f6" />
            <Text style={styles.cardTitle}>Watering</Text>
          </View>

          {waterRule ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Amount:</Text>
                <Text style={styles.value}>{waterRule.amount}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Frequency:</Text>
                <Text style={styles.value}>{waterRule.frequency}</Text>
              </View>
              {waterRule.description && (
                <Text style={styles.desc}>{waterRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={styles.missing}>
              No data for {activeStage} in {activeSeason}
            </Text>
          )}
        </View>

        {/* Fertilizer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="leaf" size={24} color="#22c55e" />
            <Text style={styles.cardTitle}>Fertilizer</Text>
          </View>

          {fertRule ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Type:</Text>
                <Text style={styles.value}>
                  {fertRule.type || fertRule.name || "General"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Dosage:</Text>
                <Text style={styles.value}>{fertRule.dosage}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Frequency:</Text>
                <Text style={styles.value}>{fertRule.frequency}</Text>
              </View>
              {fertRule.description && (
                <Text style={styles.desc}>{fertRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={styles.missing}>
              No data for {activeStage} in {activeSeason}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#071024" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071024",
  },
  hero: { width: "100%", height: 250 },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "#071024",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  name: { fontSize: 28, fontWeight: "bold", color: "#e6eef3" },
  scientific: {
    fontSize: 16,
    color: "#94a3b8",
    fontStyle: "italic",
    marginBottom: 20,
  },
  errorText: { color: "#ef4444", fontSize: 18 },

  controls: { marginBottom: 20 },
  controlGroup: { marginBottom: 15 },
  sectionTitle: {
    color: "#94a3b8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pillsScroll: { flexDirection: "row" },
  pill: {
    backgroundColor: "#0f1724",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginRight: 8,
  },
  pillActive: { backgroundColor: "#22c55e", borderColor: "#22c55e" },
  pillText: { color: "#94a3b8", fontSize: 13, fontWeight: "600" },
  pillTextActive: { color: "#071024", fontWeight: "bold" },

  card: {
    backgroundColor: "#0f1724",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#e6eef3" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { color: "#94a3b8", fontSize: 14 },
  value: {
    color: "#e6eef3",
    fontWeight: "600",
    fontSize: 14,
    maxWidth: "65%",
    textAlign: "right",
  },
  desc: {
    color: "#cbd5e1",
    marginTop: 8,
    fontSize: 13,
    fontStyle: "italic",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 8,
  },
  missing: {
    color: "#64748b",
    fontStyle: "italic",
    textAlign: "center",
    padding: 10,
  },
});
