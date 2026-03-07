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
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Video } from "expo-av";

// Replace with your backend IP/URL
const API_URL = "http://192.168.0.100:5000";

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

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={require("../assets/background.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>🌱 Plant Tracker</Text>

        <View style={styles.card}>
          <TextInput
            placeholder="Plant Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Planting Date (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={plantingDate}
            onChangeText={setPlantingDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Harvesting Date (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={harvestingDate}
            onChangeText={setHarvestingDate}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={addPlant}>
            <Text style={styles.buttonText}>Add Plant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/CropSuggestions")}
          >
            <Text style={styles.secondaryText}>Crop Suggestions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/DiseaseDetection")}
          >
            <Text style={styles.secondaryText}>Disease Detection</Text>
          </TouchableOpacity>

          {/* View in AR Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={async () => {
              const unityPackage = 'com.ScriptingSanskrit.VirtualGardening';
              const url = `intent://#Intent;package=${unityPackage};end`;

              try {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                  Linking.openURL(url);
                } else {
                  Alert.alert(
                    "Unity app not installed",
                    "Please install the Unity AR app first."
                  );
                }
              } catch (error) {
                Alert.alert("Error", "Cannot open Unity app.");
              }
            }}
          >
            <Text style={styles.secondaryText}>View in AR</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={plants}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.plantCard}>
              <Text style={styles.plantName}>{item.name}</Text>
              <Text style={styles.text}>Planting: {item.plantingDate}</Text>
              <Text style={styles.text}>Harvesting: {item.harvestingDate}</Text>
              <Text style={styles.text}>
                Remaining Days: {item.remainingDays}
              </Text>
              {item.readyToHarvest && (
                <Text style={styles.ready}>🌾 Ready to Harvest</Text>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  secondaryButton: { marginTop: 10, alignItems: "center" },
  secondaryText: { color: "#2e7d32", fontWeight: "600" },
  plantCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
  },
  plantName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  text: { fontSize: 14, color: "#444" },
  ready: { marginTop: 6, color: "green", fontWeight: "bold" },
});
