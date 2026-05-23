// app/ar/PlantTracker.tsx
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Linking, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND } from "../../config";
import { usePremium } from "../../hooks/usePremium";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const API_URL = `${BACKEND}/api`;

interface Plant {
  _id: string;
  name: string;
  species?: string;
  status?: string;
  plantingDate: string;
  harvestingDate: string;
  remainingDays: number;
  readyToHarvest?: boolean;
}

export default function PlantTracker() {
  const router = useRouter();
  const { isPremium } = usePremium();
  const { colors, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [status, setStatus] = useState("Vegetative");
  const [plantingDate, setPlantingDate] = useState("");
  const [harvestingDate, setHarvestingDate] = useState("");
  const [showPlantingPicker, setShowPlantingPicker] = useState(false);
  const [showHarvestingPicker, setShowHarvestingPicker] = useState(false);
  const [adding, setAdding] = useState(false);

  const onPlantingDateChange = (event: any, selectedDate?: Date) => {
    setShowPlantingPicker(false);
    if (selectedDate) {
      setPlantingDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onHarvestingDateChange = (event: any, selectedDate?: Date) => {
    setShowHarvestingPicker(false);
    if (selectedDate) {
      setHarvestingDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const fetchPlants = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      
      const res = await axios.get<Plant[]>(`${API_URL}/tracked-plants/${user._id}`);
      setPlants(res.data);
    } catch (err: any) {
      console.log("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchPlants();
    const interval = setInterval(fetchPlants, 60_000);
    return () => clearInterval(interval);
  }, []);

  const addPlant = async () => {
    if (!name || !plantingDate || !harvestingDate) {
      Alert.alert(t('tracker.error_title'), t('tracker.fill_fields'));
      return;
    }
    if (isNaN(Date.parse(plantingDate)) || isNaN(Date.parse(harvestingDate))) {
      Alert.alert(t('tracker.error_title'), t('tracker.date_format'));
      return;
    }
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        Alert.alert(t('tracker.login_required'), t('tracker.login_msg'));
        return;
      }
      const user = JSON.parse(userStr);

      setAdding(true);
      await axios.post(`${API_URL}/tracked-plants`, { 
        userId: user._id,
        name, 
        species: species || name, // Fallback to name if not provided
        status,
        plantingDate, 
        harvestingDate 
      });
      setName(""); setSpecies(""); setPlantingDate(""); setHarvestingDate(""); setStatus("Vegetative");
      fetchPlants();
    } catch {
      Alert.alert(t('tracker.error_title'), t('tracker.add_failed'));
    } finally {
      setAdding(false);
    }
  };

  const handleARPress = async () => {
    if (!isPremium) {
      Alert.alert(t('tracker.premium_feature'), t('tracker.ar_premium_msg'), [
        { text: t('common.not_now'), style: "cancel" },
        { text: t('common.upgrade_arrow'), onPress: () => router.push("/premium") },
      ]);
      return;
    }
    router.push("/ar/VirtualAR");
  };

  const handleDiseasePress = () => {
    if (!isPremium) {
      Alert.alert(t('tracker.premium_feature'), t('tracker.disease_premium_msg'), [
        { text: t('common.not_now'), style: "cancel" },
        { text: t('common.upgrade_arrow'), onPress: () => router.push("/premium") },
      ]);
      return;
    }
    router.push("/ar/DiseaseDetection");
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header */}
      <View style={[s.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[s.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.topTitle, { color: colors.text }]}>{t('tracker.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Action pills */}
        <View style={s.pillRow}>
          <TouchableOpacity style={[s.pill, { backgroundColor: colors.primary, borderColor: 'transparent' }]} onPress={() => router.push("/ar/CropSuggestions")}>
            <Ionicons name="leaf-outline" size={13} color="#000" />
            <Text style={[s.pillText, { color: "#000" }]}>{t('tracker.crop_suggestions')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.pill, { backgroundColor: colors.surface, borderColor: colors.border }, !isPremium && s.pillDim]} onPress={handleDiseasePress}>
            {!isPremium && <Ionicons name="lock-closed" size={11} color={colors.textMuted} />}
            <Text style={[s.pillText, { color: colors.text }]}>{t('tracker.disease_detection')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.pill, { backgroundColor: colors.surface, borderColor: colors.border }, !isPremium && s.pillDim]} onPress={handleARPress}>
            {!isPremium && <Ionicons name="lock-closed" size={11} color={colors.textMuted} />}
            <Text style={[s.pillText, { color: colors.text }]}>{t('tracker.view_ar')}</Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade banner */}
        {!isPremium && (
          <TouchableOpacity style={[s.upgradeBanner, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '35' }]} onPress={() => router.push("/premium")}>
            <Ionicons name="rocket-outline" size={14} color={colors.primary} />
            <Text style={[s.upgradeBannerText, { color: colors.textMuted }]}>
              {t('tracker.upgrade_msg')}{" "}
              <Text style={{ color: colors.primary, fontWeight: "800" }}>{t('tracker.upgrade_btn')}</Text>
            </Text>
            <Ionicons name="chevron-forward" size={13} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* Add plant form */}
        <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[s.cardTitle, { color: colors.text }]}>🌱 {t('tracker.add_plant')}</Text>
          <TextInput
            placeholder={t('tracker.name_placeholder')}
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            style={[s.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
          />
          <View style={s.row}>
            <TextInput
              placeholder={t('tracker.species_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={species}
              onChangeText={setSpecies}
              style={[s.input, { flex: 1, marginBottom: 10, backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            />
          </View>
          
          <Text style={[s.label, { color: colors.textMuted }]}>{t('tracker.life_stage')}</Text>
          <View style={s.stageRow}>
            {['Seedling', 'Vegetative', 'Flowering'].map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[s.stageBtn, { backgroundColor: colors.background, borderColor: colors.border }, status === stage && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                onPress={() => setStatus(stage)}
              >
                <Text style={[s.stageBtnText, { color: colors.textMuted }, status === stage && { color: colors.primary, fontWeight: "800" }]}>
                  {stage === 'Seedling' ? t('tracker.seedling') : stage === 'Vegetative' ? t('tracker.vegetative') : t('tracker.flowering')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.row}>
            <TouchableOpacity 
              style={[s.input, { flex: 1, marginBottom: 0, justifyContent: 'center', backgroundColor: colors.background, borderColor: colors.border }]} 
              onPress={() => setShowPlantingPicker(true)}
            >
              <Text style={{ color: plantingDate ? colors.text : colors.textMuted }}>
                {plantingDate || t('tracker.planting_date')}
              </Text>
            </TouchableOpacity>
            
            <View style={{ width: 10 }} />
            
            <TouchableOpacity 
              style={[s.input, { flex: 1, marginBottom: 0, justifyContent: 'center', backgroundColor: colors.background, borderColor: colors.border }]} 
              onPress={() => setShowHarvestingPicker(true)}
            >
              <Text style={{ color: harvestingDate ? colors.text : colors.textMuted }}>
                {harvestingDate || t('tracker.harvest_date')}
              </Text>
            </TouchableOpacity>
          </View>

          {showPlantingPicker && (
            <DateTimePicker
              value={plantingDate ? new Date(plantingDate) : new Date()}
              mode="date"
              display="default"
              onChange={onPlantingDateChange}
            />
          )}
          {showHarvestingPicker && (
            <DateTimePicker
              value={harvestingDate ? new Date(harvestingDate) : new Date()}
              mode="date"
              display="default"
              onChange={onHarvestingDateChange}
            />
          )}
          
          <View style={{ height: 14 }} />
          <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.primary }, adding && { opacity: 0.7 }]} onPress={addPlant} disabled={adding}>
            <Ionicons name="add-circle-outline" size={18} color="#000" />
            <Text style={[s.addBtnText, { color: "#000" }]}>{adding ? t('tracker.adding') : t('tracker.add_btn')}</Text>
          </TouchableOpacity>
        </View>

        {/* Plant list */}
        <Text style={[s.listLabel, { color: colors.textMuted }]}>{t('tracker.your_plants')}{plants.length > 0 ? `  (${plants.length})` : ""}</Text>

        {plants.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🪴</Text>
            <Text style={[s.emptyText, { color: colors.textMuted }]}>{t('tracker.empty')}</Text>
          </View>
        ) : (
          plants.map((item) => (
            <View key={item._id} style={[s.plantCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={s.plantTop}>
                <View style={[s.plantIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="leaf" size={16} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.plantName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                    {item.species ? `${item.species} · ` : ""}{item.status || "Unknown"}
                  </Text>
                </View>
                <View style={item.readyToHarvest ? [s.badgeReady, { backgroundColor: colors.primary + '20' }] : [s.badgeGrowing, { backgroundColor: colors.secondary + '20' }]}>
                  <Text style={[item.readyToHarvest ? s.badgeReadyTxt : s.badgeGrowingTxt, { color: item.readyToHarvest ? colors.primary : colors.secondary }]}>
                    {item.readyToHarvest ? t('tracker.ready') : t('tracker.growing')}
                  </Text>
                </View>
              </View>
              <View style={[s.plantDates, { backgroundColor: colors.background }]}>
                <View style={s.dateCol}>
                  <Text style={[s.dateLabel, { color: colors.textMuted }]}>{t('tracker.planting')}</Text>
                  <Text style={[s.dateVal, { color: colors.text }]}>{item.plantingDate || "—"}</Text>
                </View>
                <View style={[s.dateSep, { backgroundColor: colors.border }]} />
                <View style={s.dateCol}>
                  <Text style={[s.dateLabel, { color: colors.textMuted }]}>{t('tracker.harvest')}</Text>
                  <Text style={[s.dateVal, { color: colors.text }]}>{item.harvestingDate || "—"}</Text>
                </View>
                <View style={[s.dateSep, { backgroundColor: colors.border }]} />
                <View style={s.dateCol}>
                  <Text style={[s.dateLabel, { color: colors.textMuted }]}>{t('tracker.days_left')}</Text>
                  <Text style={[s.dateVal, { color: colors.primary }]}>
                    {item.remainingDays != null ? `${item.remainingDays}d` : "—"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 18, paddingBottom: 24 },

  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center",
  },
  topTitle: { fontSize: 17, fontWeight: "800" },

  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16, marginBottom: 12 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },
  pillDim: { opacity: 0.6 },
  pillText: { fontWeight: "800", fontSize: 13 },

  upgradeBanner: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 16,
  },
  upgradeBannerText: { flex: 1, fontSize: 12 },

  card: {
    borderRadius: 18, padding: 18, marginBottom: 24, borderWidth: 1,
  },
  cardTitle: { fontWeight: "800", fontSize: 16, marginBottom: 14 },
  input: {
    borderWidth: 1, padding: 12, borderRadius: 12, fontSize: 14, marginBottom: 10,
  },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { fontSize: 13, fontWeight: "700", marginBottom: 8, marginTop: 4 },
  stageRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  stageBtn: {
    flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10,
    borderWidth: 1,
  },
  stageBtnText: { fontSize: 12, fontWeight: "700" },
  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 13, borderRadius: 12,
  },
  addBtnText: { fontWeight: "900", fontSize: 15 },

  listLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },

  empty: { alignItems: "center", paddingVertical: 48 },
  emptyText: { fontSize: 14, textAlign: "center" },

  plantCard: {
    borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1,
  },
  plantTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  plantIcon: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  plantName: { flex: 1, fontSize: 16, fontWeight: "800" },
  badgeReady: { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 10 },
  badgeReadyTxt: { fontSize: 12, fontWeight: "800" },
  badgeGrowing: { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 10 },
  badgeGrowingTxt: { fontSize: 12, fontWeight: "800" },

  plantDates: {
    flexDirection: "row",
    borderRadius: 10, padding: 12,
  },
  dateCol: { flex: 1, alignItems: "center" },
  dateLabel: { fontSize: 10, fontWeight: "700", marginBottom: 4, textTransform: "uppercase" },
  dateVal: { fontSize: 13, fontWeight: "700" },
  dateSep: { width: 1 },
});
