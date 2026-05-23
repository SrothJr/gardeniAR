// mobile/app/care-guides/[id].jsx
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
  Alert,
} from "react-native";
import * as Location from 'expo-location';
import { BACKEND } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const STAGES = ["Seedling", "Vegetative", "Flowering"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export default function CareGuideDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("Vegetative");
  const [activeSeason, setActiveSeason] = useState("Summer");
  
  const [todayAdvice, setTodayAdvice] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

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
    fetch(`${BACKEND}/api/care-guide/${id}`)
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
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: "#ef4444" }]}>Guide not found</Text>
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

  const translateValue = (val) => {
    if (!val) return val;
    
    // 1. Handle direct translations
    const key = val.toLowerCase().trim()
      .replace(/[()]/g, "")
      .replace(/ /g, "_")
      .replace(/-/g, "_");
    const trans = t(`plant.${key}`);
    if (trans !== `plant.${key}`) return trans;

    // 2. Handle numbers + units
    if (i18n.language === "bn") {
      const bnNumbers = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
        '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      return val.replace(/[0-9]/g, m => bnNumbers[m] || m)
                .replace(/ml/gi, "মি.লি.")
                .replace(/l/gi, "লিটার")
                .replace(/g/gi, "গ্রাম");
    }

    return val;
  };

  const waterRule = getRule(guide.waterConfig);
  const fertRule = getRule(guide.fertilizerConfig);

  const handleForToday = async () => {
    setAnalyzing(true);
    try {
      // 1. Permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      // 2. Location
      let location = await Location.getCurrentPositionAsync({});
      
      // 3. API
      const generalWater = waterRule ? `${waterRule.amount} ${waterRule.frequency}` : "Standard";
      const generalFert = fertRule ? `${fertRule.dosage} ${fertRule.frequency}` : "Standard";

      const res = await fetch(`${BACKEND}/api/weather/care-adjustment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          plantName: guide.name,
          lifeStage: activeStage, // Added lifeStage
          generalWater,
          generalFert,
          lang: i18n.language,
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTodayAdvice(data);
      } else {
        Alert.alert("Error", data.error || "Failed to get advice");
      }

    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not analyze weather.");
    } finally {
      setAnalyzing(false);
    }
  };

  const currentImage =
    guide.stageImages?.[activeStage.toLowerCase()] ||
    guide.image ||
    "https://picsum.photos/800/600";

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.floatingBackBtn}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Image
          source={{ uri: currentImage }}
          style={styles.hero}
        />

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Text style={[styles.name, { color: colors.text }]}>{guide.name}</Text>
        <Text style={[styles.scientific, { color: colors.textMuted }]}>{guide.scientificName}</Text>

        {/* TODAY'S ADVICE BUTTON */}
        <TouchableOpacity 
            style={[styles.aiButton, { backgroundColor: colors.primary }]} 
            onPress={handleForToday} 
            disabled={analyzing}
        >
            {analyzing ? (
                <ActivityIndicator color="#000" />
            ) : (
                <>
                    <Ionicons name="sunny" size={20} color="#000" style={{ marginRight: 8 }} />
                    <Text style={styles.aiButtonText}>For Today (AI Weather Adjust)</Text>
                </>
            )}
        </TouchableOpacity>

        {/* TODAY'S ADVICE CARD */}
        {todayAdvice && (
             <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 }]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="sparkles" size={24} color={colors.primary} />
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>Today's Advice</Text>
                </View>
                
                <Text style={[styles.label, { color: colors.textMuted, marginBottom: 4 }]}>
                    Weather: {todayAdvice.weather.condition}, {Math.round(todayAdvice.weather.temperature)}°C
                </Text>
                
                <View style={{ marginVertical: 8 }}>
                    <Text style={[styles.label, { color: '#3b82f6' }]}>Water:</Text>
                    <Text style={[styles.valueLeft, { color: colors.text }]}>{todayAdvice.adjustment.waterAdvice}</Text>
                </View>

                <View style={{ marginVertical: 8 }}>
                    <Text style={[styles.label, { color: colors.primary }]}>Fertilizer:</Text>
                    <Text style={[styles.valueLeft, { color: colors.text }]}>{todayAdvice.adjustment.fertilizerAdvice}</Text>
                </View>

                <Text style={[styles.desc, { color: colors.text, borderTopColor: colors.border }]}>{todayAdvice.adjustment.reasoning}</Text>
             </View>
        )}

        {/* --- SELECTORS --- */}
        <View style={styles.controls}>
          {/* Stage Selector */}
          <View style={styles.controlGroup}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{t("plant.life_stage")}</Text>
            <View style={styles.pills}>
              {STAGES.map((stage) => (
                <TouchableOpacity
                  key={stage}
                  style={[
                    styles.pill,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    activeStage === stage && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setActiveStage(stage)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: colors.textMuted },
                      activeStage === stage && { color: "#000", fontWeight: "bold" },
                    ]}
                  >
                    {translateValue(stage)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Season Selector */}
          <View style={styles.controlGroup}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{t("plant.season")}</Text>
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
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    activeSeason === season && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setActiveSeason(season)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: colors.textMuted },
                      activeSeason === season && { color: "#000", fontWeight: "bold" },
                    ]}
                  >
                    {translateValue(season)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* --- CARDS --- */}

        {/* Water Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="water" size={24} color="#3b82f6" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t("plant.watering")}</Text>
          </View>

          {waterRule ? (
            <>
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.textMuted }]}>{t("plant.amount")}:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{translateValue(waterRule.amount)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.textMuted }]}>{t("plant.frequency")}:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{translateValue(waterRule.frequency)}</Text>
              </View>
              {waterRule.description && (
                <Text style={[styles.desc, { color: colors.text, borderTopColor: colors.border }]}>{waterRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={[styles.missing, { color: colors.textMuted }]}>
              {t("plant.no_data", { stage: translateValue(activeStage), season: translateValue(activeSeason) })}
            </Text>
          )}
        </View>

        {/* Fertilizer Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="leaf" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t("plant.fertilizer")}</Text>
          </View>

          {fertRule ? (
            <>
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.textMuted }]}>{t("plant.type")}:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {translateValue(fertRule.type || fertRule.name || "General")}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.textMuted }]}>{t("plant.dosage")}:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{translateValue(fertRule.dosage)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.textMuted }]}>{t("plant.frequency")}:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{translateValue(fertRule.frequency)}</Text>
              </View>
              {fertRule.description && (
                <Text style={[styles.desc, { color: colors.text, borderTopColor: colors.border }]}>{fertRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={[styles.missing, { color: colors.textMuted }]}>
              {t("plant.no_data", { stage: translateValue(activeStage), season: translateValue(activeSeason) })}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  floatingBackBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: { width: "100%", height: 250 },
  content: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  name: { fontSize: 28, fontWeight: "bold" },
  scientific: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 20,
  },
  errorText: { fontSize: 18 },

  controls: { marginBottom: 20 },
  controlGroup: { marginBottom: 15 },
  sectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  pills: { flexDirection: "row", flexWrap: "wrap" },
  pillsScroll: { flexDirection: "row" },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: { fontSize: 13, fontWeight: "600" },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontSize: 14 },
  value: {
    fontWeight: "600",
    fontSize: 14,
    maxWidth: "65%",
    textAlign: "right",
  },
  desc: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: "italic",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  missing: {
    fontStyle: "italic",
    textAlign: "center",
    padding: 10,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  aiButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  valueLeft: {
    fontWeight: '600',
    fontSize: 15,
  }
});
