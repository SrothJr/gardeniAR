// // mobile/app/ar/PlantTracker.tsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Alert,
//   Linking,
//   ImageBackground,
// } from "react-native";
// import axios from "axios";
// import { useRouter } from "expo-router";
// import { BACKEND } from "../../config";

// const API_URL = `${BACKEND}/api`;

// interface Plant {
//   _id: string;
//   name: string;
//   plantingDate: string;
//   harvestingDate: string;
//   remainingDays: number;
//   readyToHarvest?: boolean;
// }

// export default function PlantTracker() {
//   const router = useRouter();
//   const [plants, setPlants] = useState<Plant[]>([]);
//   const [name, setName] = useState("");
//   const [plantingDate, setPlantingDate] = useState("");
//   const [harvestingDate, setHarvestingDate] = useState("");

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get<Plant[]>(`${API_URL}/plants`);
//       setPlants(res.data);
//     } catch (err: any) {
//       console.log("Fetch Plants Error:", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchPlants();
//     const interval = setInterval(fetchPlants, 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const addPlant = async () => {
//     if (!name || !plantingDate || !harvestingDate) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     if (isNaN(Date.parse(plantingDate)) || isNaN(Date.parse(harvestingDate))) {
//       Alert.alert("Error", "Please enter valid dates in YYYY-MM-DD format");
//       return;
//     }

//     try {
//       const res = await axios.post<Plant>(`${API_URL}/plants`, {
//         name,
//         plantingDate,
//         harvestingDate,
//       });
//       console.log("Added plant:", res.data);
//       setName("");
//       setPlantingDate("");
//       setHarvestingDate("");
//       fetchPlants();
//     } catch (err: any) {
//       console.log("Add Plant Error:", err.response?.data || err.message);
//       Alert.alert("Error", "Failed to add plant. Check your server.");
//     }
//   };

//   const Header = () => (
//     <View style={styles.header}>
//       <Text style={styles.brand}>GardeniAR</Text>
//       <Text style={styles.subtitle}>Track, plan and view in AR</Text>
//       <View style={styles.actionsRow}>
//         <TouchableOpacity style={[styles.pill, styles.pillPrimary]} onPress={() => router.push("/ar/CropSuggestions")}>
//           <Text style={styles.pillText}>Crop Suggestions</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.pill, styles.pillSecondary]} onPress={() => router.push("/ar/DiseaseDetection")}>
//           <Text style={styles.pillTextAlt}>Disease Detection</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.pill, styles.pillOutline]}
//           onPress={async () => {
//             const unityPackage = 'com.ScriptingSanskrit.VirtualGardening';
//             const url = `intent://#Intent;package=${unityPackage};end`;
//             try {
//               const supported = await Linking.canOpenURL(url);
//               if (supported) {
//                 Linking.openURL(url);
//               } else {
//                 Alert.alert("Unity app not installed", "Please install the Unity AR app first.");
//               }
//             } catch (error) {
//               Alert.alert("Error", "Cannot open Unity app.");
//             }
//           }}
//         >
//           <Text style={styles.pillTextOutline}>View in AR</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderItem = ({ item }: { item: Plant }) => (
//     <View style={styles.plantCard}>
//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//         <Text style={styles.plantName}>{item.name}</Text>
//         {item.readyToHarvest ? <Text style={styles.badgeReady}>Ready</Text> : <Text style={styles.badgeSoon}>Growing</Text>}
//       </View>
//       <View style={styles.row}>
//         <Text style={styles.text}>Planting: <Text style={styles.textStrong}>{item.plantingDate}</Text></Text>
//         <Text style={styles.text}>Harvest: <Text style={styles.textStrong}>{item.harvestingDate}</Text></Text>
//       </View>
//       <Text style={styles.days}>Remaining {item.remainingDays} days</Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <ImageBackground source={require("../../assets/images/splash.png")} style={StyleSheet.absoluteFill} resizeMode="cover" />
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <Header />
//         <View style={styles.formCard}>
//           <Text style={styles.formTitle}>Add a plant</Text>
//           <View style={styles.inputRow}>
//             <TextInput placeholder="Name" placeholderTextColor="#a3a3a3" value={name} onChangeText={setName} style={[styles.input, { flex: 1 }]} />
//           </View>
//           <View style={styles.inputRow}>
//             <TextInput placeholder="Planting (YYYY-MM-DD)" placeholderTextColor="#a3a3a3" value={plantingDate} onChangeText={setPlantingDate} style={[styles.input, { flex: 1 }]} />
//             <View style={{ width: 10 }} />
//             <TextInput placeholder="Harvest (YYYY-MM-DD)" placeholderTextColor="#a3a3a3" value={harvestingDate} onChangeText={setHarvestingDate} style={[styles.input, { flex: 1 }]} />
//           </View>
//           <TouchableOpacity style={styles.button} onPress={addPlant}>
//             <Text style={styles.buttonText}>Add Plant</Text>
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           data={plants}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           renderItem={renderItem}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },
//   container: { flex: 1, padding: 18 },
//   header: { marginBottom: 14 },
//   brand: { fontSize: 22, fontWeight: "800", color: "#e6eef3" },
//   subtitle: { color: "#aab8c2", marginTop: 4, fontSize: 13 },
//   actionsRow: { flexDirection: "row", gap: 8, marginTop: 10 },
//   pill: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(148,163,184,0.25)" },
//   pillPrimary: { backgroundColor: "rgba(34,197,94,0.92)", borderColor: "rgba(34,197,94,0.92)" },
//   pillSecondary: { backgroundColor: "rgba(59,130,246,0.18)", borderColor: "rgba(59,130,246,0.28)" },
//   pillOutline: { backgroundColor: "rgba(15, 23, 42, 0.75)" },
//   pillText: { color: "#051013", fontWeight: "800" },
//   pillTextAlt: { color: "#93c5fd", fontWeight: "700" },
//   pillTextOutline: { color: "#e5e7eb", fontWeight: "700" },
//   formCard: { backgroundColor: "rgba(15, 23, 42, 0.95)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(148,163,184,0.18)", padding: 14, marginBottom: 14 },
//   formTitle: { color: "#e6eef3", fontWeight: "800", marginBottom: 10, fontSize: 16 },
//   inputRow: { flexDirection: "row" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#1e293b",
//     backgroundColor: "#0f172a",
//     color: "#e5e7eb",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   button: {
//     backgroundColor: "#22c55e",
//     padding: 13,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 6,
//   },
//   buttonText: { color: "#051013", fontWeight: "900", fontSize: 15 },
//   plantCard: {
//     backgroundColor: "rgba(15, 23, 42, 0.95)",
//     borderWidth: 1,
//     borderColor: "rgba(148,163,184,0.16)",
//     padding: 14,
//     borderRadius: 16,
//     marginBottom: 12,
//   },
//   plantName: { fontSize: 16, fontWeight: "800", marginBottom: 6, color: "#e6eef3" },
//   text: { fontSize: 13, color: "#9fb1be" },
//   textStrong: { color: "#cfe7d4", fontWeight: "700" },
//   row: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
//   days: { marginTop: 8, color: "#93c5fd", fontWeight: "700" },
//   badgeReady: { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, fontSize: 12, fontWeight: "800" },
//   badgeSoon: { backgroundColor: "rgba(59,130,246,0.14)", color: "#93c5fd", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, fontSize: 12, fontWeight: "800" },
// });


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
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (isNaN(Date.parse(plantingDate)) || isNaN(Date.parse(harvestingDate))) {
      Alert.alert("Error", "Use YYYY-MM-DD format");
      return;
    }
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        Alert.alert('Login Required', 'Please log in to add plants.');
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
      Alert.alert("Error", "Failed to add plant.");
    } finally {
      setAdding(false);
    }
  };

  const handleARPress = async () => {
    if (!isPremium) {
      Alert.alert("🔒 Premium Feature", "View in AR is for Premium subscribers only.", [
        { text: "Not now", style: "cancel" },
        { text: "Upgrade →", onPress: () => router.push("/premium") },
      ]);
      return;
    }
    router.push("/ar/VirtualAR");
  };

  const handleDiseasePress = () => {
    if (!isPremium) {
      Alert.alert("🔒 Premium Feature", "Disease Detection is for Premium subscribers only.", [
        { text: "Not now", style: "cancel" },
        { text: "Upgrade →", onPress: () => router.push("/premium") },
      ]);
      return;
    }
    router.push("/ar/DiseaseDetection");
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* Header */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#e6eef3" />
        </TouchableOpacity>
        <Text style={s.topTitle}>Plant Tracker</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Action pills */}
        <View style={s.pillRow}>
          <TouchableOpacity style={[s.pill, s.pillGreen]} onPress={() => router.push("/ar/CropSuggestions")}>
            <Ionicons name="leaf-outline" size={13} color="#051013" />
            <Text style={s.pillTextGreen}>Crop Suggestions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.pill, s.pillBlue, !isPremium && s.pillDim]} onPress={handleDiseasePress}>
            {!isPremium && <Ionicons name="lock-closed" size={11} color="#93c5fd" />}
            <Text style={s.pillTextBlue}>Disease Detection</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.pill, s.pillDark, !isPremium && s.pillDim]} onPress={handleARPress}>
            {!isPremium && <Ionicons name="lock-closed" size={11} color="#9ca3af" />}
            <Text style={s.pillTextWhite}>View in AR</Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade banner */}
        {!isPremium && (
          <TouchableOpacity style={s.upgradeBanner} onPress={() => router.push("/premium")}>
            <Ionicons name="rocket-outline" size={14} color="#22c55e" />
            <Text style={s.upgradeBannerText}>
              Unlock Disease Detection & AR —{" "}
              <Text style={{ color: "#22c55e", fontWeight: "800" }}>Upgrade to Premium</Text>
            </Text>
            <Ionicons name="chevron-forward" size={13} color="#22c55e" />
          </TouchableOpacity>
        )}

        {/* Add plant form */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🌱 Add a Plant</Text>
          <TextInput
            placeholder="Plant name (e.g. My Favorite Basil)"
            placeholderTextColor="#4b5563"
            value={name}
            onChangeText={setName}
            style={s.input}
          />
          <View style={s.row}>
            <TextInput
              placeholder="Species (e.g. Basil)"
              placeholderTextColor="#4b5563"
              value={species}
              onChangeText={setSpecies}
              style={[s.input, { flex: 1, marginBottom: 10 }]}
            />
          </View>
          
          <Text style={s.label}>Life Stage:</Text>
          <View style={s.stageRow}>
            {['Seedling', 'Vegetative', 'Flowering'].map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[s.stageBtn, status === stage && s.stageBtnActive]}
                onPress={() => setStatus(stage)}
              >
                <Text style={[s.stageBtnText, status === stage && s.stageBtnTextActive]}>
                  {stage}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.row}>
            <TouchableOpacity 
              style={[s.input, { flex: 1, marginBottom: 0, justifyContent: 'center' }]} 
              onPress={() => setShowPlantingPicker(true)}
            >
              <Text style={{ color: plantingDate ? "#e5e7eb" : "#4b5563" }}>
                {plantingDate || "Planting date"}
              </Text>
            </TouchableOpacity>
            
            <View style={{ width: 10 }} />
            
            <TouchableOpacity 
              style={[s.input, { flex: 1, marginBottom: 0, justifyContent: 'center' }]} 
              onPress={() => setShowHarvestingPicker(true)}
            >
              <Text style={{ color: harvestingDate ? "#e5e7eb" : "#4b5563" }}>
                {harvestingDate || "Harvest date"}
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
          <TouchableOpacity style={[s.addBtn, adding && { opacity: 0.7 }]} onPress={addPlant} disabled={adding}>
            <Ionicons name="add-circle-outline" size={18} color="#051013" />
            <Text style={s.addBtnText}>{adding ? "Adding…" : "Add Plant"}</Text>
          </TouchableOpacity>
        </View>

        {/* Plant list */}
        <Text style={s.listLabel}>Your Plants{plants.length > 0 ? `  (${plants.length})` : ""}</Text>

        {plants.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🪴</Text>
            <Text style={s.emptyText}>No plants yet — add your first one above!</Text>
          </View>
        ) : (
          plants.map((item) => (
            <View key={item._id} style={s.plantCard}>
              <View style={s.plantTop}>
                <View style={s.plantIcon}>
                  <Ionicons name="leaf" size={16} color="#22c55e" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.plantName}>{item.name}</Text>
                  <Text style={{ color: "#9fb1be", fontSize: 12, marginTop: 2 }}>
                    {item.species ? `${item.species} · ` : ""}{item.status || "Unknown"}
                  </Text>
                </View>
                <View style={item.readyToHarvest ? s.badgeReady : s.badgeGrowing}>
                  <Text style={item.readyToHarvest ? s.badgeReadyTxt : s.badgeGrowingTxt}>
                    {item.readyToHarvest ? "Ready" : "Growing"}
                  </Text>
                </View>
              </View>
              <View style={s.plantDates}>
                <View style={s.dateCol}>
                  <Text style={s.dateLabel}>Planting</Text>
                  <Text style={s.dateVal}>{item.plantingDate || "—"}</Text>
                </View>
                <View style={s.dateSep} />
                <View style={s.dateCol}>
                  <Text style={s.dateLabel}>Harvest</Text>
                  <Text style={s.dateVal}>{item.harvestingDate || "—"}</Text>
                </View>
                <View style={s.dateSep} />
                <View style={s.dateCol}>
                  <Text style={s.dateLabel}>Days left</Text>
                  <Text style={[s.dateVal, { color: "#60a5fa" }]}>
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
  safe: { flex: 1, backgroundColor: "#071024" },
  scroll: { paddingHorizontal: 18, paddingBottom: 24 },

  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.1)",
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  topTitle: { fontSize: 17, fontWeight: "800", color: "#e6eef3" },

  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16, marginBottom: 12 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },
  pillGreen: { backgroundColor: "rgba(34,197,94,0.9)", borderColor: "transparent" },
  pillBlue: { backgroundColor: "rgba(59,130,246,0.15)", borderColor: "rgba(59,130,246,0.25)" },
  pillDark: { backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" },
  pillDim: { opacity: 0.6 },
  pillTextGreen: { color: "#051013", fontWeight: "800", fontSize: 13 },
  pillTextBlue: { color: "#93c5fd", fontWeight: "700", fontSize: 13 },
  pillTextWhite: { color: "#d1d5db", fontWeight: "700", fontSize: 13 },

  upgradeBanner: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(34,197,94,0.05)", borderWidth: 1, borderColor: "rgba(34,197,94,0.15)",
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 16,
  },
  upgradeBannerText: { flex: 1, color: "#9fb1be", fontSize: 12 },

  card: {
    backgroundColor: "rgba(15,23,42,0.98)", borderWidth: 1, borderColor: "rgba(148,163,184,0.1)",
    borderRadius: 18, padding: 18, marginBottom: 24,
  },
  cardTitle: { color: "#e6eef3", fontWeight: "800", fontSize: 16, marginBottom: 14 },
  input: {
    borderWidth: 1, borderColor: "rgba(148,163,184,0.12)", backgroundColor: "rgba(255,255,255,0.03)",
    color: "#e5e7eb", padding: 12, borderRadius: 12, fontSize: 14, marginBottom: 10,
  },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { color: "#9fb1be", fontSize: 13, fontWeight: "700", marginBottom: 8, marginTop: 4 },
  stageRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  stageBtn: {
    flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(148,163,184,0.15)",
  },
  stageBtnActive: { backgroundColor: "rgba(34,197,94,0.15)", borderColor: "#22c55e" },
  stageBtnText: { color: "#a1a1aa", fontSize: 12, fontWeight: "700" },
  stageBtnTextActive: { color: "#22c55e", fontWeight: "800" },
  hint: { color: "#374151", fontSize: 11, marginBottom: 14 },
  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#22c55e", paddingVertical: 13, borderRadius: 12,
  },
  addBtnText: { color: "#051013", fontWeight: "900", fontSize: 15 },

  listLabel: { color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },

  empty: { alignItems: "center", paddingVertical: 48 },
  emptyText: { color: "#374151", fontSize: 14, textAlign: "center" },

  plantCard: {
    backgroundColor: "rgba(15,23,42,0.98)", borderWidth: 1, borderColor: "rgba(148,163,184,0.1)",
    borderRadius: 16, padding: 16, marginBottom: 10,
  },
  plantTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  plantIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "rgba(34,197,94,0.1)", alignItems: "center", justifyContent: "center",
  },
  plantName: { flex: 1, fontSize: 16, fontWeight: "800", color: "#e6eef3" },
  badgeReady: { backgroundColor: "rgba(34,197,94,0.12)", borderRadius: 8, paddingVertical: 3, paddingHorizontal: 10 },
  badgeReadyTxt: { color: "#22c55e", fontSize: 12, fontWeight: "800" },
  badgeGrowing: { backgroundColor: "rgba(59,130,246,0.12)", borderRadius: 8, paddingVertical: 3, paddingHorizontal: 10 },
  badgeGrowingTxt: { color: "#93c5fd", fontSize: 12, fontWeight: "800" },

  plantDates: {
    flexDirection: "row", backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 10, padding: 12,
  },
  dateCol: { flex: 1, alignItems: "center" },
  dateLabel: { color: "#4b5563", fontSize: 10, fontWeight: "700", marginBottom: 4, textTransform: "uppercase" },
  dateVal: { color: "#cbd5e1", fontSize: 13, fontWeight: "700" },
  dateSep: { width: 1, backgroundColor: "rgba(148,163,184,0.08)" },
});