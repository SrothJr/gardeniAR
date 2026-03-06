// // mobile/app/plant/[id].jsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { BACKEND } from "../../config"; // adjust path if config is elsewhere

// export default function PlantDetail() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [plant, setPlant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     fetch(`${BACKEND}/api/plants/${id}`)
//       .then((r) => r.json())
//       .then((data) => setPlant(data))
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const addToGarden = async () => {
//     setSaving(true);
//     try {
//       const raw = await AsyncStorage.getItem("myGarden");
//       const arr = raw ? JSON.parse(raw) : [];
//       if (!arr.includes(id)) {
//         arr.push(id);
//         await AsyncStorage.setItem("myGarden", JSON.stringify(arr));
//       }
//       alert("Added to My Garden");
//     } catch (err) {
//       console.error(err);
//       alert("Could not save");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#22c55e" />
//       </View>
//     );
//   }

//   if (!plant) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff" }}>Plant not found</Text>
//       </View>
//     );
//   }

//   const difficulty = plant?.difficulty?.toLowerCase?.();
//   const growthSpeed = plant?.growthSpeed?.toLowerCase?.();
//   const heatTol = plant?.heatTolerance?.toLowerCase?.();
//   const beginner = plant?.beginnerFriendly === true;

//   return (
//     <ScrollView style={styles.page}>
//       <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
//         <Ionicons name="arrow-back" size={20} color="#22c55e" />
//         <Text style={styles.backText}>Back</Text>
//       </TouchableOpacity>

//       <Image
//         source={{ uri: plant.image || "https://picsum.photos/800/600" }}
//         style={styles.hero}
//       />

//       <View style={styles.block}>
//         <Text style={styles.name}>{plant.name}</Text>
//         {plant.scientificName ? (
//           <Text style={styles.scientific}>{plant.scientificName}</Text>
//         ) : null}

//         <View style={styles.row}>
//           <View style={styles.smallTag}>
//             <Text style={styles.smallTagText}>Sun: {plant.sunlight || "—"}</Text>
//           </View>
//           <View style={styles.smallTag}>
//             <Text style={styles.smallTagText}>Water: {plant.water || "—"}</Text>
//           </View>
//           {plant?.type && (
//             <View style={styles.smallTag}>
//               <Text style={styles.smallTagText}>{plant.type}</Text>
//             </View>
//           )}
//         </View>

//         {(difficulty || growthSpeed || heatTol || beginner || plant?.season) && (
//           <View style={styles.metaRow}>
//             {beginner && (
//               <View style={[styles.metaTag, styles.metaEasy]}>
//                 <Ionicons name="happy-outline" size={14} color="#022c22" />
//                 <Text style={styles.metaText}>Beginner friendly</Text>
//               </View>
//             )}

//             {difficulty && (
//               <View style={styles.metaTag}>
//                 <Ionicons name="leaf-outline" size={14} color="#bae6fd" />
//                 <Text style={styles.metaText}>
//                   {difficulty === "easy"
//                     ? "Easy care"
//                     : difficulty === "hard"
//                       ? "Advanced care"
//                       : "Moderate care"}
//                 </Text>
//               </View>
//             )}

//             {growthSpeed && (
//               <View style={styles.metaTag}>
//                 <Ionicons name="speedometer-outline" size={14} color="#facc15" />
//                 <Text style={styles.metaText}>
//                   {growthSpeed === "fast"
//                     ? "Fast growth"
//                     : growthSpeed === "slow"
//                       ? "Slow growth"
//                       : "Medium growth"}
//                 </Text>
//               </View>
//             )}

//             {heatTol && (
//               <View style={styles.metaTag}>
//                 <Ionicons name="flame-outline" size={14} color="#fb7185" />
//                 <Text style={styles.metaText}>
//                   {heatTol === "high"
//                     ? "Heat tolerant"
//                     : heatTol === "low"
//                       ? "Heat sensitive"
//                       : "Normal heat tolerance"}
//                 </Text>
//               </View>
//             )}

//             {plant?.season && (
//               <View style={styles.metaTag}>
//                 <Ionicons name="calendar-outline" size={14} color="#a5b4fc" />
//                 <Text style={styles.metaText}>{plant.season}</Text>
//               </View>
//             )}
//           </View>
//         )}
//       </View>

//       <View style={styles.block}>
//         <Text style={styles.blockTitle}>Care Tips</Text>
//         {plant.careTips && plant.careTips.length ? (
//           plant.careTips.map((t, i) => (
//             <Text key={i} style={styles.bullet}>
//               • {t}
//             </Text>
//           ))
//         ) : (
//           <Text style={styles.note}>No care tips available.</Text>
//         )}
//       </View>

//       <View style={{ padding: 16 }}>
//         <TouchableOpacity
//           style={styles.soilBtn}
//           onPress={() => router.push("/soil")}
//         >
//           <Text style={styles.soilBtnText}>Run Soil Test</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ padding: 16 }}>
//         <TouchableOpacity style={styles.addBtn} onPress={addToGarden} disabled={saving}>
//           <Text style={styles.addBtnText}>
//             {saving ? "Adding..." : "Add to My Garden"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: "#071024" },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#071024",
//   },
//   hero: { width: "100%", height: 300 },
//   backRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     gap: 6,
//   },
//   backText: { color: "#22c55e", fontSize: 14, fontWeight: "600" },
//   block: { padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#0f1724" },
//   name: { color: "#e6eef3", fontSize: 22, fontWeight: "700" },
//   scientific: { color: "#9aa6b2", marginTop: 6, fontStyle: "italic" },
//   row: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 10,
//     flexWrap: "wrap",
//   },
//   smallTag: {
//     backgroundColor: "#0b1220",
//     borderWidth: 1,
//     borderColor: "#12323a",
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 8,
//     marginRight: 8,
//     marginBottom: 4,
//   },
//   smallTagText: { color: "#cde7da", fontSize: 12 },
//   metaRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 10,
//     gap: 6,
//   },
//   metaTag: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//     backgroundColor: "rgba(15,23,42,0.9)",
//     borderWidth: 1,
//     borderColor: "rgba(148,163,184,0.4)",
//   },
//   metaEasy: {
//     backgroundColor: "#4ade80",
//     borderColor: "#16a34a",
//   },
//   metaText: { color: "#e5e7eb", fontSize: 11, fontWeight: "600" },
//   blockTitle: { color: "#e6eef3", fontWeight: "700", marginBottom: 8 },
//   bullet: { color: "#d4edd7", marginVertical: 6 },
//   note: { color: "#9aa6b2" },
//   addBtn: {
//     backgroundColor: "#10b981",
//     paddingVertical: 14,
//     borderRadius: 999,
//     alignItems: "center",
//   },
//   addBtnText: { color: "#031018", fontWeight: "700" },
//   soilBtn: {
//     backgroundColor: "#22c55e",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   soilBtnText: { color: "#071024", fontWeight: "700" },
// });

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
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { BACKEND, nBACKEND } from "../../config";

const STAGES = ["Seedling", "Vegetative", "Flowering"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export default function PlantDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeStage, setActiveStage] = useState("Vegetative");
  const [activeSeason, setActiveSeason] = useState("Summer");

  const [todayAdvice, setTodayAdvice] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Auto-detect current season
  useEffect(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setActiveSeason("Spring");
    else if (month >= 5 && month <= 7) setActiveSeason("Summer");
    else if (month >= 8 && month <= 10) setActiveSeason("Autumn");
    else setActiveSeason("Winter");
  }, []);

  // Fetch plant first, then fetch ALL care guides and match by name
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`${BACKEND}/api/plants/${id}`)
      .then((r) => r.json())
      .then(async (plantData) => {
        let guideData = {};
        try {
          // Fetch all care guides (same call care-guides/index.jsx uses)
          // and find the one whose name matches the plant name
          const res = await fetch(`${nBACKEND}/api/care-guide`);
          const raw = await res.json();
          const list = raw.guides || (Array.isArray(raw) ? raw : []);
          const match = list.find(
            (g) => g.name?.toLowerCase().trim() === plantData.name?.toLowerCase().trim()
          );
          if (match) {
            // Now fetch the full guide by its own _id to get all arrays
            const fullRes = await fetch(`${nBACKEND}/api/care-guide/${match._id}`);
            const fullRaw = await fullRes.json();
            guideData = fullRaw.guide || fullRaw;
          }
        } catch (e) {
          console.log("care-guide fetch failed:", e.message);
        }

        setPlant({
          ...guideData,
          ...plantData,
          waterConfig:      guideData.waterConfig      || plantData.waterConfig,
          fertilizerConfig: guideData.fertilizerConfig || plantData.fertilizerConfig,
          stageImages:      guideData.stageImages      || plantData.stageImages,
        });
      })
      .catch((err) => console.error("plant fetch failed:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Care guide rule resolver
  const getRule = (list) => {
    if (!list || list.length === 0) return null;
    const has = (r, season) =>
      Array.isArray(r.season) ? r.season.includes(season) : r.season === season;
    return (
      list.find((r) => r.lifeStage === activeStage && has(r, activeSeason)) ||
      list.find((r) => r.lifeStage === activeStage && has(r, "All Year")) ||
      list.find((r) => r.lifeStage === "General" && has(r, activeSeason)) ||
      list.find((r) => r.lifeStage === "General" && has(r, "All Year")) ||
      null
    );
  };

  // Add to garden
  const addToGarden = async () => {
    setSaving(true);
    try {
      const raw = await AsyncStorage.getItem("myGarden");
      const arr = raw ? JSON.parse(raw) : [];
      if (!arr.includes(id)) {
        arr.push(id);
        await AsyncStorage.setItem("myGarden", JSON.stringify(arr));
      }
      Alert.alert("🌱 Added", "Plant saved to My Garden!");
    } catch (err) {
      Alert.alert("Error", "Could not save plant.");
    } finally {
      setSaving(false);
    }
  };

  // AI weather advice
  const handleForToday = async () => {
    setAnalyzing(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is needed.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const waterRule = getRule(plant?.waterConfig);
      const fertRule  = getRule(plant?.fertilizerConfig);

      const res = await fetch(`${nBACKEND}/api/weather/care-adjustment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          plantName: plant.name,
          lifeStage: activeStage,
          generalWater: waterRule ? `${waterRule.amount} ${waterRule.frequency}` : "Standard",
          generalFert:  fertRule  ? `${fertRule.dosage} ${fertRule.frequency}`  : "Standard",
        }),
      });
      const data = await res.json();
      if (res.ok) setTodayAdvice(data);
      else Alert.alert("Error", data.error || "Failed to get advice.");
    } catch (e) {
      Alert.alert("Error", "Could not fetch weather advice.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Loading / error
  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }
  if (!plant) {
    return (
      <View style={s.center}>
        <Text style={{ color: "#fff" }}>Plant not found</Text>
      </View>
    );
  }

  const difficulty  = plant?.difficulty?.toLowerCase?.();
  const growthSpeed = plant?.growthSpeed?.toLowerCase?.();
  const heatTol     = plant?.heatTolerance?.toLowerCase?.();
  const beginner    = plant?.beginnerFriendly === true;
  const waterRule   = getRule(plant?.waterConfig);
  const fertRule    = getRule(plant?.fertilizerConfig);
  const heroImage   =
    plant?.stageImages?.[activeStage.toLowerCase()] ||
    plant?.image ||
    "https://picsum.photos/800/600";

  const hasCareGuide =
    plant?.waterConfig?.length > 0 || plant?.fertilizerConfig?.length > 0;

  return (
    <ScrollView style={s.page} contentContainerStyle={{ paddingBottom: 48 }}>

      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={s.backRow}>
        <Ionicons name="arrow-back" size={20} color="#22c55e" />
        <Text style={s.backText}>Back</Text>
      </TouchableOpacity>

      {/* Hero */}
      <Image source={{ uri: heroImage }} style={s.hero} />

      {/* Name + tags */}
      <View style={s.block}>
        <Text style={s.name}>{plant.name}</Text>
        {!!plant.scientificName && (
          <Text style={s.scientific}>{plant.scientificName}</Text>
        )}

        <View style={s.tagRow}>
          {!!plant.sunlight && (
            <View style={s.tag}>
              <Ionicons name="sunny-outline" size={12} color="#fbbf24" />
              <Text style={s.tagText}>{plant.sunlight}</Text>
            </View>
          )}
          {!!plant.water && (
            <View style={s.tag}>
              <Ionicons name="water-outline" size={12} color="#60a5fa" />
              <Text style={s.tagText}>{plant.water}</Text>
            </View>
          )}
          {!!plant.type && (
            <View style={s.tag}>
              <Ionicons name="leaf-outline" size={12} color="#34d399" />
              <Text style={s.tagText}>{plant.type}</Text>
            </View>
          )}
        </View>

        {/* Meta badges */}
        {(difficulty || growthSpeed || heatTol || beginner || plant?.season) && (
          <View style={s.metaRow}>
            {beginner && (
              <View style={[s.metaTag, s.metaEasy]}>
                <Ionicons name="happy-outline" size={13} color="#022c22" />
                <Text style={[s.metaText, { color: "#022c22" }]}>Beginner friendly</Text>
              </View>
            )}
            {!!difficulty && (
              <View style={s.metaTag}>
                <Ionicons name="leaf-outline" size={13} color="#bae6fd" />
                <Text style={s.metaText}>
                  {difficulty === "easy" ? "Easy care" : difficulty === "hard" ? "Advanced care" : "Moderate care"}
                </Text>
              </View>
            )}
            {!!growthSpeed && (
              <View style={s.metaTag}>
                <Ionicons name="speedometer-outline" size={13} color="#facc15" />
                <Text style={s.metaText}>
                  {growthSpeed === "fast" ? "Fast growth" : growthSpeed === "slow" ? "Slow growth" : "Medium growth"}
                </Text>
              </View>
            )}
            {!!heatTol && (
              <View style={s.metaTag}>
                <Ionicons name="flame-outline" size={13} color="#fb7185" />
                <Text style={s.metaText}>
                  {heatTol === "high" ? "Heat tolerant" : heatTol === "low" ? "Heat sensitive" : "Normal heat tolerance"}
                </Text>
              </View>
            )}
            {!!plant?.season && (
              <View style={s.metaTag}>
                <Ionicons name="calendar-outline" size={13} color="#a5b4fc" />
                <Text style={s.metaText}>{plant.season}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Care Tips */}
      {plant.careTips?.length > 0 && (
        <View style={s.block}>
          <Text style={s.blockTitle}>🌿 Care Tips</Text>
          {plant.careTips.map((t, i) => (
            <Text key={i} style={s.bullet}>• {t}</Text>
          ))}
        </View>
      )}

      {/* Stage + Season selectors */}
      <View style={s.block}>
        <Text style={s.blockTitle}>📅 Life Stage & Season</Text>

        <Text style={s.selectorLabel}>Life Stage</Text>
        <View style={s.pillRow}>
          {STAGES.map((stage) => (
            <TouchableOpacity
              key={stage}
              style={[s.pill, activeStage === stage && s.pillActive]}
              onPress={() => { setActiveStage(stage); setTodayAdvice(null); }}
            >
              <Text style={[s.pillText, activeStage === stage && s.pillTextActive]}>
                {stage}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[s.selectorLabel, { marginTop: 10 }]}>Season</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={s.pillRow}>
            {SEASONS.map((season) => (
              <TouchableOpacity
                key={season}
                style={[s.pill, activeSeason === season && s.pillActive]}
                onPress={() => { setActiveSeason(season); setTodayAdvice(null); }}
              >
                <Text style={[s.pillText, activeSeason === season && s.pillTextActive]}>
                  {season}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* AI Weather button */}
      <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
        <TouchableOpacity style={s.aiBtn} onPress={handleForToday} disabled={analyzing}>
          {analyzing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="sunny" size={18} color="#000" />
              <Text style={s.aiBtnText}>Today's AI Weather Advice</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Today's Advice card */}
      {!!todayAdvice && (
        <View style={[s.card, s.adviceCard]}>
          <View style={s.cardHeader}>
            <Ionicons name="sparkles" size={20} color="#facc15" />
            <Text style={[s.cardTitle, { color: "#facc15" }]}>Today's Advice</Text>
          </View>
          <Text style={s.adviceWeather}>
            {todayAdvice.weather.condition} · {Math.round(todayAdvice.weather.temperature)}°C
          </Text>
          <View style={{ marginTop: 10, gap: 8 }}>
            <Text style={[s.label, { color: "#60a5fa" }]}>💧 Water</Text>
            <Text style={s.adviceValue}>{todayAdvice.adjustment.waterAdvice}</Text>
            <Text style={[s.label, { color: "#22c55e", marginTop: 6 }]}>🌱 Fertilizer</Text>
            <Text style={s.adviceValue}>{todayAdvice.adjustment.fertilizerAdvice}</Text>
            <Text style={s.adviceReasoning}>{todayAdvice.adjustment.reasoning}</Text>
          </View>
        </View>
      )}

      {/* Watering card */}
      {hasCareGuide ? (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="water" size={20} color="#3b82f6" />
            <Text style={s.cardTitle}>Watering</Text>
          </View>
          {waterRule ? (
            <>
              <View style={s.cardRow}>
                <Text style={s.label}>Amount</Text>
                <Text style={s.value}>{waterRule.amount}</Text>
              </View>
              <View style={s.cardRow}>
                <Text style={s.label}>Frequency</Text>
                <Text style={s.value}>{waterRule.frequency}</Text>
              </View>
              {!!waterRule.description && (
                <Text style={s.cardDesc}>{waterRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={s.missing}>No data for {activeStage} in {activeSeason}</Text>
          )}
        </View>
      ) : (
        <View style={[s.card, { borderColor: "#854d0e" }]}>
          <View style={s.cardHeader}>
            <Ionicons name="water" size={20} color="#3b82f6" />
            <Text style={s.cardTitle}>Watering</Text>
          </View>
          <Text style={s.missing}>
            No care guide found for "{plant.name}".{"\n"}
            <Text style={{ color: "#64748b", fontSize: 11 }}>
              Add a care guide in the Care Guides section to see watering details.
            </Text>
          </Text>
        </View>
      )}

      {/* Fertilizer card */}
      {hasCareGuide ? (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="leaf" size={20} color="#22c55e" />
            <Text style={s.cardTitle}>Fertilizer</Text>
          </View>
          {fertRule ? (
            <>
              <View style={s.cardRow}>
                <Text style={s.label}>Type</Text>
                <Text style={s.value}>{fertRule.type || fertRule.name || "General"}</Text>
              </View>
              <View style={s.cardRow}>
                <Text style={s.label}>Dosage</Text>
                <Text style={s.value}>{fertRule.dosage}</Text>
              </View>
              <View style={s.cardRow}>
                <Text style={s.label}>Frequency</Text>
                <Text style={s.value}>{fertRule.frequency}</Text>
              </View>
              {!!fertRule.description && (
                <Text style={s.cardDesc}>{fertRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={s.missing}>No data for {activeStage} in {activeSeason}</Text>
          )}
        </View>
      ) : (
        <View style={[s.card, { borderColor: "#166534" }]}>
          <View style={s.cardHeader}>
            <Ionicons name="leaf" size={20} color="#22c55e" />
            <Text style={s.cardTitle}>Fertilizer</Text>
          </View>
          <Text style={s.missing}>
            No care guide found for "{plant.name}".{"\n"}
            <Text style={{ color: "#64748b", fontSize: 11 }}>
              Add a care guide in the Care Guides section to see fertilizer details.
            </Text>
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={s.actions}>
        <TouchableOpacity style={s.soilBtn} onPress={() => router.push("/soil")}>
          <Ionicons name="color-wand-outline" size={18} color="#071024" />
          <Text style={s.soilBtnText}>Run Soil Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.addBtn} onPress={addToGarden} disabled={saving}>
          <Ionicons name="add-circle-outline" size={18} color="#031018" />
          <Text style={s.addBtnText}>{saving ? "Adding…" : "Add to My Garden"}</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#071024" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#071024" },

  backRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  backText: { color: "#22c55e", fontSize: 14, fontWeight: "600" },

  hero: { width: "100%", height: 280 },

  block: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#0f172a" },
  name: { color: "#e6eef3", fontSize: 24, fontWeight: "800" },
  scientific: { color: "#9aa6b2", marginTop: 4, fontStyle: "italic", fontSize: 14 },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  tag: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#0b1220", borderWidth: 1, borderColor: "#12323a",
    paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8,
  },
  tagText: { color: "#cde7da", fontSize: 12 },

  metaRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 6 },
  metaTag: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)", borderWidth: 1, borderColor: "rgba(148,163,184,0.35)",
  },
  metaEasy: { backgroundColor: "#4ade80", borderColor: "#16a34a" },
  metaText: { color: "#e5e7eb", fontSize: 11, fontWeight: "600" },

  blockTitle: { color: "#e6eef3", fontWeight: "700", fontSize: 15, marginBottom: 10 },
  bullet: { color: "#d4edd7", marginVertical: 5, lineHeight: 20 },

  selectorLabel: { color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
    backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1e293b",
  },
  pillActive: { backgroundColor: "#22c55e", borderColor: "#22c55e" },
  pillText: { color: "#94a3b8", fontSize: 13, fontWeight: "600" },
  pillTextActive: { color: "#071024", fontWeight: "800" },

  aiBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#facc15", paddingVertical: 13, borderRadius: 14,
  },
  aiBtnText: { color: "#000", fontWeight: "800", fontSize: 15 },

  card: {
    backgroundColor: "#0f172a", borderRadius: 16, padding: 16,
    marginHorizontal: 16, marginBottom: 12,
    borderWidth: 1, borderColor: "#1e293b",
  },
  adviceCard: { borderColor: "#facc15" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  cardTitle: { color: "#e6eef3", fontSize: 16, fontWeight: "800" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { color: "#94a3b8", fontSize: 13 },
  value: { color: "#e6eef3", fontWeight: "600", fontSize: 13, maxWidth: "60%", textAlign: "right" },
  cardDesc: {
    color: "#cbd5e1", fontSize: 13, fontStyle: "italic",
    borderTopWidth: 1, borderTopColor: "#1e293b", paddingTop: 8, marginTop: 4,
  },
  missing: { color: "#64748b", fontStyle: "italic", textAlign: "center", paddingVertical: 8 },

  adviceWeather: { color: "#94a3b8", fontSize: 13 },
  adviceValue: { color: "#e6eef3", fontWeight: "600", fontSize: 14 },
  adviceReasoning: {
    color: "#cbd5e1", fontSize: 13, fontStyle: "italic",
    borderTopWidth: 1, borderTopColor: "rgba(250,204,21,0.2)", paddingTop: 8, marginTop: 6,
  },

  actions: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  soilBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#22c55e", paddingVertical: 13, borderRadius: 14,
  },
  soilBtnText: { color: "#071024", fontWeight: "800", fontSize: 15 },
  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#10b981", paddingVertical: 13, borderRadius: 14,
  },
  addBtnText: { color: "#031018", fontWeight: "800", fontSize: 15 },
});