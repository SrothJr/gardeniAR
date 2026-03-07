// ar/CropSuggestions.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 60) / 2;
const fallbackImage = "https://loremflickr.com/400/400/plant";

// -------------------- CROP DATA --------------------
const cropsByMonth: Record<number, any[]> = {
  1: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/tomato.png" },
    { name: "Carrot", soil: "Sandy Loam", water: "Moderate", imageUrl: "../assets/crops/carrot.jpg" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "../assets/crops/spinach.jpg" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "../assets/crops/cabbage.png" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/onion.png" },
    { name: "Garlic", soil: "Loamy", water: "Low", imageUrl: "../assets/crops/garlic.png" },
    { name: "Cauliflower", soil: "Loamy", water: "High", imageUrl: "../assets/crops/cauliflower.png" },
    { name: "Lettuce", soil: "Sandy Loam", water: "High", imageUrl: "../assets/crops/lettuce.png" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/peas.png" },
    { name: "Beetroot", soil: "Sandy Loam", water: "Moderate", imageUrl: "../assets/crops/beetroot.png" },
  ],
  2: [
    { name: "Peas", soil: "Loamy", water: "High", imageUrl: "../assets/crops/peas.png" },
    { name: "Radish", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/raddish.png" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "../assets/crops/spinach.jpg" },
    { name: "Carrot", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/carrot.jpg" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/onion.png" },
    { name: "Lettuce", soil: "Loamy", water: "High", imageUrl: "../assets/crops/lettuce.png" },
    { name: "Broccoli", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/brocoli.png" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "../assets/crops/cabbage.png" },
    { name: "Cauliflower", soil: "Loamy", water: "High", imageUrl: "../assets/crops/cauliflower.png" },
    { name: "Beetroot", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/beetroot.png" },
  ],
  3: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/tomato.png" },
    { name: "Cucumber", soil: "Sandy Loam", water: "High", imageUrl: "../assets/crops/cucumber.png" },
    { name: "Pumpkin", soil: "Loamy", water: "High", imageUrl: "../assets/crops/pumkin.png" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "../assets/crops/spinach.jpg" },
    { name: "Carrot", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/carrot.png" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/peas.png" },
    { name: "Lettuce", soil: "Loamy", water: "High", imageUrl: "../assets/crops/lettuce.png" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/onion.png" },
    { name: "Broccoli", soil: "Loamy", water: "Moderate", imageUrl: "../assets/crops/brocoli.png" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "../assets/crops/cabbage.png" },
  ],
  4: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Carrot", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Lettuce", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
    { name: "Broccoli", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?broccoli,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Pumpkin", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?pumpkin,plant" },
    { name: "Cucumber", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cucumber,plant" },
  ],
  5: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Cucumber", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cucumber,plant" },
    { name: "Pumpkin", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?pumpkin,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Carrot", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Lettuce", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Broccoli", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?broccoli,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
  ],
  6: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Carrot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Garlic", soil: "Loamy", water: "Low", imageUrl: "https://source.unsplash.com/400x400/?garlic,plant" },
    { name: "Cauliflower", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cauliflower,plant" },
    { name: "Lettuce", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Beetroot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?beetroot,plant" },
  ],
  7: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Cucumber", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cucumber,plant" },
    { name: "Pumpkin", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?pumpkin,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Carrot", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Lettuce", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Broccoli", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?broccoli,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
  ],
    8: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Cucumber", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cucumber,plant" },
    { name: "Pumpkin", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?pumpkin,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Carrot", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Lettuce", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Broccoli", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?broccoli,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
  ],
  9: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Carrot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Garlic", soil: "Loamy", water: "Low", imageUrl: "https://source.unsplash.com/400x400/?garlic,plant" },
    { name: "Cauliflower", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cauliflower,plant" },
    { name: "Lettuce", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Beetroot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?beetroot,plant" },
  ],
  10: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Carrot", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Lettuce", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
    { name: "Broccoli", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?broccoli,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Pumpkin", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?pumpkin,plant" },
    { name: "Cucumber", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cucumber,plant" },
  ],
  11: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Carrot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Garlic", soil: "Loamy", water: "Low", imageUrl: "https://source.unsplash.com/400x400/?garlic,plant" },
    { name: "Cauliflower", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cauliflower,plant" },
    { name: "Lettuce", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Beetroot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?beetroot,plant" },
  ],
  12: [
    { name: "Tomato", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?tomato,plant" },
    { name: "Carrot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?carrot,plant" },
    { name: "Spinach", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?spinach,plant" },
    { name: "Cabbage", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cabbage,plant" },
    { name: "Onion", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?onion,plant" },
    { name: "Garlic", soil: "Loamy", water: "Low", imageUrl: "https://source.unsplash.com/400x400/?garlic,plant" },
    { name: "Cauliflower", soil: "Loamy", water: "High", imageUrl: "https://source.unsplash.com/400x400/?cauliflower,plant" },
    { name: "Lettuce", soil: "Sandy Loam", water: "High", imageUrl: "https://source.unsplash.com/400x400/?lettuce,plant" },
    { name: "Peas", soil: "Loamy", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?peas,plant" },
    { name: "Beetroot", soil: "Sandy Loam", water: "Moderate", imageUrl: "https://source.unsplash.com/400x400/?beetroot,plant" },
  ],
};

// -------------------- CROP SUGGESTIONS COMPONENT --------------------
export default function CropSuggestions() {
  const [month, setMonth] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    getWeather(loc.coords.latitude, loc.coords.longitude);
  };

  const getWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (e) {
      console.log("Weather fetch failed", e);
    }
  };

  const getSeason = (month: number) => {
    if ([12, 1, 2].includes(month)) return "Winter";
    if ([3, 4].includes(month)) return "Spring";
    if ([5, 6].includes(month)) return "Summer";
    if ([7, 8].includes(month)) return "Monsoon";
    if ([9, 10].includes(month)) return "Autumn";
    if ([11].includes(month)) return "Late Autumn";
  };

  const getSuggestions = () => {
    const m = parseInt(month);
    if (isNaN(m) || m < 1 || m > 12) {
      Alert.alert("Enter valid month (1-12)");
      return;
    }
    const season = getSeason(m);
    const monthCrops = cropsByMonth[m];
    if (!monthCrops) return;

    // pick 5 random crops from the 10
    const shuffled = monthCrops.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const formatted = selected.map((crop) => ({
      ...crop,
      season,
      weather: weather ? `${weather.temperature}°C` : "Unknown",
    }));

    setSuggestions(formatted);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.cropContainer, { width: itemWidth }]}>
      <Image source={{ uri: item.imageUrl || fallbackImage }} style={styles.cropImage} />
      <Text style={styles.cropItem}>{item.name}</Text>
      <Text style={styles.cropInfo}>Season: {item.season}</Text>
      <Text style={styles.cropInfo}>Temp: {item.weather}</Text>
      <Text style={styles.cropInfo}>Soil: {item.soil}</Text>
      <Text style={styles.cropInfo}>Water: {item.water}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Crop Advisor</Text>
        <Text style={styles.subtitle}>Seasonal picks based on your month and weather</Text>
      </View>
      <View style={styles.formRow}>
        <TextInput
          placeholder="Month (1-12)"
          placeholderTextColor="#8aa3b2"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
          style={[styles.input, { flex: 1 }]}
        />
        <View style={{ width: 10 }} />
        <TouchableOpacity onPress={getSuggestions} style={styles.cta}>
          <Text style={styles.ctaText}>Suggest</Text>
        </TouchableOpacity>
      </View>

      {location && <Text style={styles.info}>📍 Location detected</Text>}
      {weather && <Text style={styles.info}>🌦 Temp: {weather.temperature}°C</Text>}

      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginTop: 15 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#071024" },
  header: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "800", color: "#e6eef3" },
  subtitle: { color: "#9fb1be", marginTop: 4, fontSize: 13 },
  formRow: { flexDirection: "row", marginTop: 8, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#1e293b",
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
  },
  cta: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#051013", fontWeight: "900" },
  info: { textAlign: "center", marginTop: 8, color: "#aab8c2" },
  cropContainer: {
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
  },
  cropImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 10 },
  cropItem: { fontSize: 16, fontWeight: "800", textAlign: "center", color: "#e6eef3" },
  cropInfo: { fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 2 },
});
