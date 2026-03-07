// mobile/app/ar/PlantTracker.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { BACKEND } from "../../config";

const API_URL = `${BACKEND}/api`;

interface Plant {
  _id: string;
  name: string;
  plantingDate: string;
  harvestingDate: string;
  remainingDays: number;
  readyToHarvest?: boolean;
}

export default function PlantTracker() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [name, setName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [harvestingDate, setHarvestingDate] = useState("");

  const fetchPlants = async () => {
    try {
      const res = await axios.get<Plant[]>(`${API_URL}/plants`);
      setPlants(res.data);
    } catch (err: any) {
      console.log("Fetch Plants Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPlants();
    const interval = setInterval(fetchPlants, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const addPlant = async () => {
    if (!name || !plantingDate || !harvestingDate) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (isNaN(Date.parse(plantingDate)) || isNaN(Date.parse(harvestingDate))) {
      Alert.alert("Error", "Please enter valid dates in YYYY-MM-DD format");
      return;
    }

    try {
      const res = await axios.post<Plant>(`${API_URL}/plants`, {
        name,
        plantingDate,
        harvestingDate,
      });
      console.log("Added plant:", res.data);
      setName("");
      setPlantingDate("");
      setHarvestingDate("");
      fetchPlants();
    } catch (err: any) {
      console.log("Add Plant Error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to add plant. Check your server.");
    }
  };

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.brand}>GardeniAR</Text>
      <Text style={styles.subtitle}>Track, plan and view in AR</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.pill, styles.pillPrimary]} onPress={() => router.push("/ar/CropSuggestions")}>
          <Text style={styles.pillText}>Crop Suggestions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pill, styles.pillSecondary]} onPress={() => router.push("/ar/DiseaseDetection")}>
          <Text style={styles.pillTextAlt}>Disease Detection</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, styles.pillOutline]}
          onPress={async () => {
            const unityPackage = 'com.ScriptingSanskrit.VirtualGardening';
            const url = `intent://#Intent;package=${unityPackage};end`;
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                Linking.openURL(url);
              } else {
                Alert.alert("Unity app not installed", "Please install the Unity AR app first.");
              }
            } catch (error) {
              Alert.alert("Error", "Cannot open Unity app.");
            }
          }}
        >
          <Text style={styles.pillTextOutline}>View in AR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Plant }) => (
    <View style={styles.plantCard}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.plantName}>{item.name}</Text>
        {item.readyToHarvest ? <Text style={styles.badgeReady}>Ready</Text> : <Text style={styles.badgeSoon}>Growing</Text>}
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Planting: <Text style={styles.textStrong}>{item.plantingDate}</Text></Text>
        <Text style={styles.text}>Harvest: <Text style={styles.textStrong}>{item.harvestingDate}</Text></Text>
      </View>
      <Text style={styles.days}>Remaining {item.remainingDays} days</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require("../../assets/images/splash.png")} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Header />
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add a plant</Text>
          <View style={styles.inputRow}>
            <TextInput placeholder="Name" placeholderTextColor="#a3a3a3" value={name} onChangeText={setName} style={[styles.input, { flex: 1 }]} />
          </View>
          <View style={styles.inputRow}>
            <TextInput placeholder="Planting (YYYY-MM-DD)" placeholderTextColor="#a3a3a3" value={plantingDate} onChangeText={setPlantingDate} style={[styles.input, { flex: 1 }]} />
            <View style={{ width: 10 }} />
            <TextInput placeholder="Harvest (YYYY-MM-DD)" placeholderTextColor="#a3a3a3" value={harvestingDate} onChangeText={setHarvestingDate} style={[styles.input, { flex: 1 }]} />
          </View>
          <TouchableOpacity style={styles.button} onPress={addPlant}>
            <Text style={styles.buttonText}>Add Plant</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={plants}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },
  container: { flex: 1, padding: 18 },
  header: { marginBottom: 14 },
  brand: { fontSize: 22, fontWeight: "800", color: "#e6eef3" },
  subtitle: { color: "#aab8c2", marginTop: 4, fontSize: 13 },
  actionsRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  pill: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(148,163,184,0.25)" },
  pillPrimary: { backgroundColor: "rgba(34,197,94,0.92)", borderColor: "rgba(34,197,94,0.92)" },
  pillSecondary: { backgroundColor: "rgba(59,130,246,0.18)", borderColor: "rgba(59,130,246,0.28)" },
  pillOutline: { backgroundColor: "rgba(15, 23, 42, 0.75)" },
  pillText: { color: "#051013", fontWeight: "800" },
  pillTextAlt: { color: "#93c5fd", fontWeight: "700" },
  pillTextOutline: { color: "#e5e7eb", fontWeight: "700" },
  formCard: { backgroundColor: "rgba(15, 23, 42, 0.95)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(148,163,184,0.18)", padding: 14, marginBottom: 14 },
  formTitle: { color: "#e6eef3", fontWeight: "800", marginBottom: 10, fontSize: 16 },
  inputRow: { flexDirection: "row" },
  input: {
    borderWidth: 1,
    borderColor: "#1e293b",
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: { color: "#051013", fontWeight: "900", fontSize: 15 },
  plantCard: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  plantName: { fontSize: 16, fontWeight: "800", marginBottom: 6, color: "#e6eef3" },
  text: { fontSize: 13, color: "#9fb1be" },
  textStrong: { color: "#cfe7d4", fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  days: { marginTop: 8, color: "#93c5fd", fontWeight: "700" },
  badgeReady: { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, fontSize: 12, fontWeight: "800" },
  badgeSoon: { backgroundColor: "rgba(59,130,246,0.14)", color: "#93c5fd", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, fontSize: 12, fontWeight: "800" },
});
