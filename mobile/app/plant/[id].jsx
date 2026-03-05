// mobile/app/plant/[id].jsx
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND } from "../../config"; // adjust path if config is elsewhere

export default function PlantDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BACKEND}/api/plants/${id}`)
      .then((r) => r.json())
      .then((data) => setPlant(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const addToGarden = async () => {
    setSaving(true);
    try {
      const raw = await AsyncStorage.getItem("myGarden");
      const arr = raw ? JSON.parse(raw) : [];
      if (!arr.includes(id)) {
        arr.push(id);
        await AsyncStorage.setItem("myGarden", JSON.stringify(arr));
      }
      alert("Added to My Garden");
    } catch (err) {
      console.error(err);
      alert("Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Plant not found</Text>
      </View>
    );
  }

  const difficulty = plant?.difficulty?.toLowerCase?.();
  const growthSpeed = plant?.growthSpeed?.toLowerCase?.();
  const heatTol = plant?.heatTolerance?.toLowerCase?.();
  const beginner = plant?.beginnerFriendly === true;

  return (
    <ScrollView style={styles.page}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
        <Ionicons name="arrow-back" size={20} color="#22c55e" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: plant.image || "https://picsum.photos/800/600" }}
        style={styles.hero}
      />

      <View style={styles.block}>
        <Text style={styles.name}>{plant.name}</Text>
        {plant.scientificName ? (
          <Text style={styles.scientific}>{plant.scientificName}</Text>
        ) : null}

        <View style={styles.row}>
          <View style={styles.smallTag}>
            <Text style={styles.smallTagText}>Sun: {plant.sunlight || "—"}</Text>
          </View>
          <View style={styles.smallTag}>
            <Text style={styles.smallTagText}>Water: {plant.water || "—"}</Text>
          </View>
          {plant?.type && (
            <View style={styles.smallTag}>
              <Text style={styles.smallTagText}>{plant.type}</Text>
            </View>
          )}
        </View>

        {(difficulty || growthSpeed || heatTol || beginner || plant?.season) && (
          <View style={styles.metaRow}>
            {beginner && (
              <View style={[styles.metaTag, styles.metaEasy]}>
                <Ionicons name="happy-outline" size={14} color="#022c22" />
                <Text style={styles.metaText}>Beginner friendly</Text>
              </View>
            )}

            {difficulty && (
              <View style={styles.metaTag}>
                <Ionicons name="leaf-outline" size={14} color="#bae6fd" />
                <Text style={styles.metaText}>
                  {difficulty === "easy"
                    ? "Easy care"
                    : difficulty === "hard"
                      ? "Advanced care"
                      : "Moderate care"}
                </Text>
              </View>
            )}

            {growthSpeed && (
              <View style={styles.metaTag}>
                <Ionicons name="speedometer-outline" size={14} color="#facc15" />
                <Text style={styles.metaText}>
                  {growthSpeed === "fast"
                    ? "Fast growth"
                    : growthSpeed === "slow"
                      ? "Slow growth"
                      : "Medium growth"}
                </Text>
              </View>
            )}

            {heatTol && (
              <View style={styles.metaTag}>
                <Ionicons name="flame-outline" size={14} color="#fb7185" />
                <Text style={styles.metaText}>
                  {heatTol === "high"
                    ? "Heat tolerant"
                    : heatTol === "low"
                      ? "Heat sensitive"
                      : "Normal heat tolerance"}
                </Text>
              </View>
            )}

            {plant?.season && (
              <View style={styles.metaTag}>
                <Ionicons name="calendar-outline" size={14} color="#a5b4fc" />
                <Text style={styles.metaText}>{plant.season}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Care Tips</Text>
        {plant.careTips && plant.careTips.length ? (
          plant.careTips.map((t, i) => (
            <Text key={i} style={styles.bullet}>
              • {t}
            </Text>
          ))
        ) : (
          <Text style={styles.note}>No care tips available.</Text>
        )}
      </View>

      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={styles.soilBtn}
          onPress={() => router.push("/soil")}
        >
          <Text style={styles.soilBtnText}>Run Soil Test</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16 }}>
        <TouchableOpacity style={styles.addBtn} onPress={addToGarden} disabled={saving}>
          <Text style={styles.addBtnText}>
            {saving ? "Adding..." : "Add to My Garden"}
          </Text>
        </TouchableOpacity>
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
  hero: { width: "100%", height: 300 },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  backText: { color: "#22c55e", fontSize: 14, fontWeight: "600" },
  block: { padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#0f1724" },
  name: { color: "#e6eef3", fontSize: 22, fontWeight: "700" },
  scientific: { color: "#9aa6b2", marginTop: 6, fontStyle: "italic" },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  smallTag: {
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#12323a",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  smallTagText: { color: "#cde7da", fontSize: 12 },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 6,
  },
  metaTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
  },
  metaEasy: {
    backgroundColor: "#4ade80",
    borderColor: "#16a34a",
  },
  metaText: { color: "#e5e7eb", fontSize: 11, fontWeight: "600" },
  blockTitle: { color: "#e6eef3", fontWeight: "700", marginBottom: 8 },
  bullet: { color: "#d4edd7", marginVertical: 6 },
  note: { color: "#9aa6b2" },
  addBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  addBtnText: { color: "#031018", fontWeight: "700" },
  soilBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  soilBtnText: { color: "#071024", fontWeight: "700" },
});
