// // mobile/app/explore.jsx
// import React, { useEffect, useMemo, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   ScrollView,
// } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import SearchBar from "../components/SearchBar";
// import PlantCard from "../components/PlantCard";
// import { BACKEND } from "../config";
// import * as Location from "expo-location";

// // ─── Cascading Filter Dropdown ────────────────────────────────────────────────

// const FILTER_GROUPS = [
//   {
//     id: "type",
//     label: "🌿 Type",
//     options: [
//       { value: "all", label: "All" },
//       { value: "herb", label: "Herbs" },
//       { value: "vegetable", label: "Vegetables" },
//       { value: "houseplant", label: "Houseplants" },
//       { value: "other", label: "Other" },
//     ],
//   },
//   {
//     id: "care",
//     label: "☀️ Care & Weather",
//     options: [
//       { value: "all", label: "All" },
//       { value: "easy", label: "Easy" },
//       { value: "medium", label: "Medium" },
//       { value: "hard", label: "Hard" },
//       { value: "cool", label: "Cool Spots" },
//       { value: "warm", label: "Heat Lovers" },
//     ],
//   },
//   {
//     id: "price",
//     label: "💰 Price",
//     options: [
//       { value: "all", label: "Any Price" },
//       { value: "budget", label: "Budget  (< ৳35)" },
//       { value: "mid", label: "Mid  (৳35–70)" },
//       { value: "premium", label: "Premium  (> ৳70)" },
//     ],
//   },
// ];

// function CascadeDropdown({ typeFilter, setTypeFilter, difficultyFilter, setDifficultyFilter, heatFilter, setHeatFilter, priceBand, setPriceBand }) {
//   const [open, setOpen] = useState(false);
//   const [activeGroup, setActiveGroup] = useState(null); // 'type' | 'care' | 'price'

//   const dropAnim = useRef(new Animated.Value(0)).current;
//   const subAnim = useRef(new Animated.Value(0)).current;

//   const toggleOpen = () => {
//     if (open) {
//       // close everything
//       Animated.parallel([
//         Animated.timing(dropAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
//         Animated.timing(subAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
//       ]).start(() => { setOpen(false); setActiveGroup(null); });
//     } else {
//       setOpen(true);
//       Animated.timing(dropAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
//     }
//   };

//   const handleGroupPress = (groupId) => {
//     if (activeGroup === groupId) {
//       Animated.timing(subAnim, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => setActiveGroup(null));
//     } else {
//       setActiveGroup(groupId);
//       subAnim.setValue(0);
//       Animated.timing(subAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
//     }
//   };

//   const getActiveLabel = (groupId) => {
//     if (groupId === "type") return typeFilter !== "all" ? typeFilter : null;
//     if (groupId === "care") {
//       if (difficultyFilter !== "all") return difficultyFilter;
//       if (heatFilter !== "all") return heatFilter;
//       return null;
//     }
//     if (groupId === "price") return priceBand !== "all" ? priceBand : null;
//     return null;
//   };

//   const handleOptionPress = (groupId, value) => {
//     if (groupId === "type") setTypeFilter(value);
//     if (groupId === "care") {
//       const diffValues = ["all", "easy", "medium", "hard"];
//       const heatValues = ["cool", "warm"];
//       if (diffValues.includes(value)) setDifficultyFilter(value);
//       if (heatValues.includes(value)) { setHeatFilter(value); setDifficultyFilter("all"); }
//       if (value === "all") { setDifficultyFilter("all"); setHeatFilter("all"); }
//     }
//     if (groupId === "price") setPriceBand(value);
//   };

//   const getSelectedValue = (groupId) => {
//     if (groupId === "type") return typeFilter;
//     if (groupId === "care") {
//       if (heatFilter !== "all") return heatFilter;
//       return difficultyFilter;
//     }
//     if (groupId === "price") return priceBand;
//   };

//   // Build summary badge text for the main button
//   const activeSummary = useMemo(() => {
//     const parts = [];
//     if (typeFilter !== "all") parts.push(typeFilter);
//     if (difficultyFilter !== "all") parts.push(difficultyFilter);
//     if (heatFilter !== "all") parts.push(heatFilter);
//     if (priceBand !== "all") parts.push(priceBand);
//     return parts;
//   }, [typeFilter, difficultyFilter, heatFilter, priceBand]);

//   const dropTranslate = dropAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });
//   const subTranslate = subAnim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] });

//   return (
//     <View style={dd.wrapper}>
//       {/* ── Main trigger button ── */}
//       <TouchableOpacity style={dd.trigger} onPress={toggleOpen} activeOpacity={0.8}>
//         <Text style={dd.triggerIcon}>⚙️</Text>
//         <Text style={dd.triggerText}>Filters</Text>
//         {activeSummary.length > 0 && (
//           <View style={dd.badge}>
//             <Text style={dd.badgeText}>{activeSummary.length}</Text>
//           </View>
//         )}
//         <Text style={[dd.chevron, open && dd.chevronUp]}>›</Text>
//       </TouchableOpacity>

//       {/* ── Active filter chips (quick-clear) ── */}
//       {activeSummary.length > 0 && (
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dd.activeChipsRow}>
//           {activeSummary.map((label) => (
//             <View key={label} style={dd.activeChip}>
//               <Text style={dd.activeChipText}>{label}</Text>
//             </View>
//           ))}
//           <TouchableOpacity
//             onPress={() => { setTypeFilter("all"); setDifficultyFilter("all"); setHeatFilter("all"); setPriceBand("all"); }}
//             style={dd.clearChip}
//           >
//             <Text style={dd.clearChipText}>✕ Clear</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       {/* ── Dropdown panel ── */}
//       {open && (
//         <Animated.View style={[dd.panel, { opacity: dropAnim, transform: [{ translateY: dropTranslate }] }]}>
//           {FILTER_GROUPS.map((group) => {
//             const activeVal = getSelectedValue(group.id);
//             const isGroupActive = activeGroup === group.id;
//             const hasSelection = getActiveLabel(group.id) !== null;

//             return (
//               <View key={group.id}>
//                 {/* Group row */}
//                 <TouchableOpacity
//                   style={[dd.groupRow, isGroupActive && dd.groupRowActive]}
//                   onPress={() => handleGroupPress(group.id)}
//                   activeOpacity={0.75}
//                 >
//                   <Text style={[dd.groupLabel, hasSelection && dd.groupLabelSelected]}>
//                     {group.label}
//                     {hasSelection ? <Text style={dd.groupSelBadge}> • {getActiveLabel(group.id)}</Text> : ""}
//                   </Text>
//                   <Text style={[dd.groupChevron, isGroupActive && dd.groupChevronUp]}>›</Text>
//                 </TouchableOpacity>

//                 {/* Sub-options */}
//                 {isGroupActive && (
//                   <Animated.View style={[dd.subPanel, { opacity: subAnim, transform: [{ translateY: subTranslate }] }]}>
//                     {group.options.map((opt) => {
//                       const isSelected = activeVal === opt.value;
//                       return (
//                         <TouchableOpacity
//                           key={opt.value}
//                           style={[dd.optionRow, isSelected && dd.optionRowSelected]}
//                           onPress={() => handleOptionPress(group.id, opt.value)}
//                           activeOpacity={0.7}
//                         >
//                           <Text style={[dd.optionText, isSelected && dd.optionTextSelected]}>
//                             {opt.label}
//                           </Text>
//                           {isSelected && <Text style={dd.optionCheck}>✓</Text>}
//                         </TouchableOpacity>
//                       );
//                     })}
//                   </Animated.View>
//                 )}

//                 {/* Divider */}
//                 <View style={dd.divider} />
//               </View>
//             );
//           })}
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const dd = StyleSheet.create({
//   wrapper: { marginBottom: 10, zIndex: 100 },

//   trigger: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#0f172a",
//     borderWidth: 1,
//     borderColor: "#1e293b",
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     gap: 6,
//     alignSelf: "flex-start",
//   },
//   triggerIcon: { fontSize: 14 },
//   triggerText: { color: "#e5e7eb", fontSize: 13, fontWeight: "600" },
//   badge: {
//     backgroundColor: "#22c55e",
//     borderRadius: 99,
//     width: 18,
//     height: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   badgeText: { color: "#022c22", fontSize: 10, fontWeight: "800" },
//   chevron: {
//     color: "#94a3b8",
//     fontSize: 18,
//     lineHeight: 20,
//     transform: [{ rotate: "90deg" }],
//     marginLeft: 2,
//   },
//   chevronUp: { transform: [{ rotate: "270deg" }] },

//   activeChipsRow: { marginTop: 8, marginBottom: 2 },
//   activeChip: {
//     backgroundColor: "rgba(34,197,94,0.15)",
//     borderWidth: 1,
//     borderColor: "#22c55e",
//     borderRadius: 99,
//     paddingVertical: 3,
//     paddingHorizontal: 10,
//     marginRight: 6,
//   },
//   activeChipText: { color: "#22c55e", fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
//   clearChip: {
//     backgroundColor: "rgba(248,113,113,0.12)",
//     borderWidth: 1,
//     borderColor: "#f87171",
//     borderRadius: 99,
//     paddingVertical: 3,
//     paddingHorizontal: 10,
//     marginRight: 6,
//   },
//   clearChipText: { color: "#f87171", fontSize: 11, fontWeight: "600" },

//   panel: {
//     marginTop: 6,
//     backgroundColor: "#0f172a",
//     borderWidth: 1,
//     borderColor: "#1e293b",
//     borderRadius: 14,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOpacity: 0.5,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 8,
//   },

//   groupRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 13,
//     paddingHorizontal: 16,
//   },
//   groupRowActive: { backgroundColor: "rgba(34,197,94,0.07)" },
//   groupLabel: { color: "#e5e7eb", fontSize: 13, fontWeight: "600" },
//   groupLabelSelected: { color: "#22c55e" },
//   groupSelBadge: { color: "#22c55e", fontWeight: "700", textTransform: "capitalize" },
//   groupChevron: {
//     color: "#64748b",
//     fontSize: 18,
//     transform: [{ rotate: "90deg" }],
//   },
//   groupChevronUp: { transform: [{ rotate: "270deg" }] },

//   subPanel: {
//     backgroundColor: "rgba(2,44,34,0.18)",
//     borderTopWidth: 1,
//     borderTopColor: "#1e293b",
//   },
//   optionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 11,
//     paddingHorizontal: 28,
//   },
//   optionRowSelected: { backgroundColor: "rgba(34,197,94,0.12)" },
//   optionText: { color: "#94a3b8", fontSize: 13 },
//   optionTextSelected: { color: "#22c55e", fontWeight: "700" },
//   optionCheck: { color: "#22c55e", fontSize: 13, fontWeight: "800" },

//   divider: { height: 1, backgroundColor: "#1e293b", marginHorizontal: 0 },
// });

// // ─── Main Screen ──────────────────────────────────────────────────────────────

// export default function ExplorePlants() {
//   const router = useRouter();
//   const { fromSeasonal } = useLocalSearchParams();

//   const [plants, setPlants] = useState([]);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("none");
//   const [loading, setLoading] = useState(false);

//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);

//   const [typeFilter, setTypeFilter] = useState("all");
//   const [difficultyFilter, setDifficultyFilter] = useState("all");
//   const [heatFilter, setHeatFilter] = useState("all");
//   const [priceBand, setPriceBand] = useState("all");

//   const fetchPlants = async (q = "") => {
//     setLoading(true);
//     try {
//       const url = q
//         ? `${BACKEND}/api/plants?search=${encodeURIComponent(q)}`
//         : `${BACKEND}/api/plants`;
//       const res = await fetch(url);
//       const data = await res.json();
//       setPlants(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("fetchPlants error", err);
//       setPlants([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWeatherAlert = async () => {
//     try {
//       setWeatherLoading(true);
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;
//       const loc = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = loc.coords;
//       const res = await fetch(`${BACKEND}/api/weather/alert?lat=${latitude}&lon=${longitude}`);
//       const data = await res.json();
//       setWeather(data);
//     } catch (err) {
//       console.error("fetchWeatherAlert error", err);
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   useEffect(() => { fetchPlants(); fetchWeatherAlert(); }, []);
//   useEffect(() => { const t = setTimeout(() => fetchPlants(search), 300); return () => clearTimeout(t); }, [search]);

//   const sortedPlants = useMemo(() => {
//     if (!Array.isArray(plants)) return [];
//     if (sort === "low") return [...plants].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
//     if (sort === "high") return [...plants].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
//     return plants;
//   }, [plants, sort]);

//   const seasonalFilteredPlants = useMemo(() => {
//     const list = sortedPlants;
//     if (!fromSeasonal || !Array.isArray(list)) return list;
//     const key = Array.isArray(fromSeasonal) ? fromSeasonal[0] : fromSeasonal;
//     const hasTag = (plant, tag) => Array.isArray(plant.seasonalTags) && plant.seasonalTags.includes(tag);

//     if (key === "easy-starters") {
//       const subset = list.filter((p) => {
//         const water = (p.water || "").toLowerCase();
//         const type = (p.type || "").toLowerCase();
//         const season = (p.season || "").toLowerCase();
//         return hasTag(p, "easy-starters") || p.beginnerFriendly === true ||
//           (p.difficulty && p.difficulty.toLowerCase() === "easy") ||
//           water.includes("low") || water.includes("medium") ||
//           type.includes("houseplant") || season.includes("all");
//       });
//       return subset.length ? subset : list;
//     }
//     if (key === "fast-growers") {
//       const subset = list.filter((p) => {
//         const desc = (p.description || "").toLowerCase();
//         const tips = Array.isArray(p.careTips) ? p.careTips.join(" ").toLowerCase() : "";
//         return hasTag(p, "fast-growers") || (p.growthSpeed && p.growthSpeed.toLowerCase() === "fast") ||
//           desc.includes("fast") || desc.includes("quick") || desc.includes("rapid") ||
//           tips.includes("fast") || tips.includes("quick");
//       });
//       return subset.length ? subset : list;
//     }
//     if (key === "heat-friendly") {
//       const subset = list.filter((p) => {
//         const sun = (p.sunlight || "").toLowerCase();
//         const season = (p.season || "").toLowerCase();
//         const desc = (p.description || "").toLowerCase();
//         return hasTag(p, "heat-friendly") || (p.heatTolerance && p.heatTolerance.toLowerCase() === "high") ||
//           sun.includes("full") || sun.includes("direct") || season.includes("summer") ||
//           desc.includes("heat") || desc.includes("hot");
//       });
//       return subset.length ? subset : list;
//     }
//     return list;
//   }, [sortedPlants, fromSeasonal]);

//   const fullyFilteredPlants = useMemo(() => {
//     let list = seasonalFilteredPlants;
//     if (!Array.isArray(list)) return [];

//     if (typeFilter !== "all") {
//       list = list.filter((p) => {
//         const cat = (p.category || p.type || "").toLowerCase();
//         if (typeFilter === "herb") return cat.includes("herb");
//         if (typeFilter === "vegetable") return cat.includes("vegetable") || cat.includes("veg");
//         if (typeFilter === "houseplant") return cat.includes("house") || cat.includes("indoor") || cat.includes("succulent");
//         if (typeFilter === "other") return !cat.includes("herb") && !cat.includes("vegetable") && !cat.includes("veg") && !cat.includes("house") && !cat.includes("indoor") && !cat.includes("succulent");
//         return true;
//       });
//     }

//     if (difficultyFilter !== "all") {
//       list = list.filter((p) => {
//         const diff = (p.difficulty || "").toLowerCase();
//         if (difficultyFilter === "easy") return p.beginnerFriendly === true || diff === "easy";
//         if (difficultyFilter === "medium") return diff === "medium" || !diff;
//         if (difficultyFilter === "hard") return diff === "hard";
//         return true;
//       });
//     }

//     if (heatFilter !== "all") {
//       list = list.filter((p) => {
//         const heat = (p.heatTolerance || "").toLowerCase();
//         const sun = (p.sunlight || "").toLowerCase();
//         if (heatFilter === "cool") return heat === "low" || sun.includes("partial") || sun.includes("shade") || sun.includes("indirect");
//         if (heatFilter === "warm") return heat === "high" || sun.includes("full") || sun.includes("direct") || (p.season || "").toLowerCase().includes("summer");
//         return true;
//       });
//     }

//     if (priceBand !== "all") {
//       list = list.filter((p) => {
//         const price = typeof p.price === "number" ? p.price : null;
//         if (price == null) return priceBand === "all";
//         if (priceBand === "budget") return price < 35;
//         if (priceBand === "mid") return price >= 35 && price <= 70;
//         if (priceBand === "premium") return price > 70;
//         return true;
//       });
//     }

//     return list;
//   }, [seasonalFilteredPlants, typeFilter, difficultyFilter, heatFilter, priceBand]);

//   return (
//     <View style={styles.page}>
//       <Text style={styles.title}>Explore Plants</Text>

//       {weather && weather.weather && (
//         <View style={styles.weatherCard}>
//           <Text style={styles.weatherCity}>📍 {weather.weather.city}</Text>
//           <Text style={styles.weatherTemp}>🌡 {weather.weather.temperature}°C | 💧 {weather.weather.humidity}%</Text>
//           <Text style={styles.weatherCondition}>{weather.weather.condition}</Text>
//           <Text style={styles.weatherAlert}>🧠 Weather-based gardening advice</Text>
//           <Text style={styles.weatherTip}>{weather.alert}</Text>
//         </View>
//       )}

//       <SearchBar value={search} onChangeText={setSearch} />

//       {/* CASCADING FILTER DROPDOWN */}
//       <CascadeDropdown
//         typeFilter={typeFilter}
//         setTypeFilter={setTypeFilter}
//         difficultyFilter={difficultyFilter}
//         setDifficultyFilter={setDifficultyFilter}
//         heatFilter={heatFilter}
//         setHeatFilter={setHeatFilter}
//         priceBand={priceBand}
//         setPriceBand={setPriceBand}
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 24 }} />
//       ) : (
//         <FlatList
//           data={fullyFilteredPlants}
//           keyExtractor={(item, index) => item._id ?? String(index)}
//           renderItem={({ item }) => (
//             <PlantCard plant={item} onPress={() => router.push(`/plant/${item._id}`)} />
//           )}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 120 }}
//           ListEmptyComponent={<Text style={styles.empty}>No plants found.</Text>}
//         />
//       )}

//       <TouchableOpacity onPress={() => router.push("/share/camera")} style={styles.cameraFab}>
//         <Text style={{ fontSize: 24 }}>📸</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => router.push("/cart")} style={styles.cartFab}>
//         <Text style={{ fontSize: 24 }}>🛒</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: "#071024", padding: 16 },
//   title: { color: "#e6eef3", fontSize: 24, fontWeight: "700", marginBottom: 12 },
//   empty: { color: "#94a3b8", marginTop: 20, textAlign: "center" },

//   weatherCard: { backgroundColor: "#0f172a", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#1e293b" },
//   weatherCity: { color: "#e5e7eb", fontWeight: "700", textAlign: "left" },
//   weatherTemp: { color: "#93c5fd", marginTop: 4, textAlign: "left" },
//   weatherCondition: { color: "#a7f3d0", marginTop: 4, textTransform: "capitalize", textAlign: "left" },
//   weatherAlert: { color: "#fbbf24", marginTop: 8, fontWeight: "600" },
//   weatherTip: { color: "#cbd5e1", fontSize: 13 },

//   cameraFab: { position: "absolute", bottom: 24, right: 24, backgroundColor: "#22c55e", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
//   cartFab: { position: "absolute", bottom: 100, right: 24, backgroundColor: "#fbbf24", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
// });


// mobile/app/explore.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import PlantCard from "../components/PlantCard";
import WeatherPanel from "../components/WeatherPanel";
import { BACKEND } from "../config";
import * as Location from "expo-location";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

// ─── Cascading Filter Dropdown ─────────────────────────────────────────────
// (unchanged from original)

function CascadeDropdown({ typeFilter, setTypeFilter, difficultyFilter, setDifficultyFilter, heatFilter, setHeatFilter, priceBand, setPriceBand }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const dropAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;

  const FILTER_GROUPS = [
    {
      id: "type",
      label: `🌿 ${t("explore.type")}`,
      options: [
        { value: "all", label: t("explore.all") },
        { value: "herb", label: t("explore.herbs") },
        { value: "vegetable", label: t("explore.vegetables") },
        { value: "houseplant", label: t("explore.houseplants") },
        { value: "other", label: t("explore.other") },
      ],
    },
    {
      id: "care",
      label: `☀️ ${t("explore.care_weather")}`,
      options: [
        { value: "all", label: t("explore.all") },
        { value: "easy", label: t("explore.easy") },
        { value: "medium", label: t("explore.medium") },
        { value: "hard", label: t("explore.hard") },
        { value: "cool", label: t("explore.cool_spots") },
        { value: "warm", label: t("explore.heat_lovers") },
      ],
    },
    {
      id: "price",
      label: `💰 ${t("explore.price")}`,
      options: [
        { value: "all", label: t("explore.any_price") },
        { value: "budget", label: t("explore.budget") },
        { value: "mid", label: t("explore.mid") },
        { value: "premium", label: t("explore.premium") },
      ],
    },
  ];

  const toggleOpen = () => {
    if (open) {
      Animated.parallel([
        Animated.timing(dropAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(subAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
      ]).start(() => { setOpen(false); setActiveGroup(null); });
    } else {
      setOpen(true);
      Animated.timing(dropAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    }
  };

  const handleGroupPress = (groupId) => {
    if (activeGroup === groupId) {
      Animated.timing(subAnim, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => setActiveGroup(null));
    } else {
      setActiveGroup(groupId);
      subAnim.setValue(0);
      Animated.timing(subAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    }
  };

  const getActiveLabel = (groupId) => {
    const group = FILTER_GROUPS.find(g => g.id === groupId);
    const val = getSelectedValue(groupId);
    const opt = group?.options.find(o => o.value === val);
    return val !== "all" ? opt?.label : null;
  };

  const handleOptionPress = (groupId, value) => {
    if (groupId === "type") setTypeFilter(value);
    if (groupId === "care") {
      const diffValues = ["all", "easy", "medium", "hard"];
      const heatValues = ["cool", "warm"];
      if (diffValues.includes(value)) setDifficultyFilter(value);
      if (heatValues.includes(value)) { setHeatFilter(value); setDifficultyFilter("all"); }
      if (value === "all") { setDifficultyFilter("all"); setHeatFilter("all"); }
    }
    if (groupId === "price") setPriceBand(value);
  };

  const getSelectedValue = (groupId) => {
    if (groupId === "type") return typeFilter;
    if (groupId === "care") {
      if (heatFilter !== "all") return heatFilter;
      return difficultyFilter;
    }
    if (groupId === "price") return priceBand;
  };

  const activeSummary = useMemo(() => {
    const parts = [];
    if (typeFilter !== "all") {
      const opt = FILTER_GROUPS[0].options.find(o => o.value === typeFilter);
      if (opt) parts.push(opt.label);
    }
    if (difficultyFilter !== "all") {
      const opt = FILTER_GROUPS[1].options.find(o => o.value === difficultyFilter);
      if (opt) parts.push(opt.label);
    }
    if (heatFilter !== "all") {
      const opt = FILTER_GROUPS[1].options.find(o => o.value === heatFilter);
      if (opt) parts.push(opt.label);
    }
    if (priceBand !== "all") {
      const opt = FILTER_GROUPS[2].options.find(o => o.value === priceBand);
      if (opt) parts.push(opt.label);
    }
    return parts;
  }, [typeFilter, difficultyFilter, heatFilter, priceBand, FILTER_GROUPS]);

  const dropTranslate = dropAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });
  const subTranslate = subAnim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] });

  return (
    <View style={dd.wrapper}>
      <TouchableOpacity style={[dd.trigger, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={toggleOpen} activeOpacity={0.8}>
        <Text style={dd.triggerIcon}>⚙️</Text>
        <Text style={[dd.triggerText, { color: colors.text }]}>{t("explore.filters")}</Text>
        {activeSummary.length > 0 && (
          <View style={[dd.badge, { backgroundColor: colors.primary }]}>
            <Text style={[dd.badgeText, { color: '#000' }]}>{activeSummary.length}</Text>
          </View>
        )}
        <Text style={[dd.chevron, { color: colors.textMuted }, open && dd.chevronUp]}>›</Text>
      </TouchableOpacity>

      {activeSummary.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dd.activeChipsRow}>
          {activeSummary.map((label) => (
            <View key={label} style={[dd.activeChip, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
              <Text style={[dd.activeChipText, { color: colors.primary }]}>{label}</Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => { setTypeFilter("all"); setDifficultyFilter("all"); setHeatFilter("all"); setPriceBand("all"); }}
            style={[dd.clearChip, { backgroundColor: 'rgba(248,113,113,0.12)', borderColor: '#f87171' }]}
          >
            <Text style={[dd.clearChipText, { color: '#f87171' }]}>✕ {t("explore.clear")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {open && (
        <Animated.View style={[dd.panel, { backgroundColor: colors.surface, borderColor: colors.border, opacity: dropAnim, transform: [{ translateY: dropTranslate }] }]}>
          {FILTER_GROUPS.map((group) => {
            const activeVal = getSelectedValue(group.id);
            const isGroupActive = activeGroup === group.id;
            const hasSelection = getActiveLabel(group.id) !== null;
            return (
              <View key={group.id}>
                <TouchableOpacity
                  style={[dd.groupRow, isGroupActive && { backgroundColor: colors.primary + '10' }]}
                  onPress={() => handleGroupPress(group.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[dd.groupLabel, { color: colors.text }, hasSelection && { color: colors.primary }]}>
                    {group.label}
                    {hasSelection ? <Text style={{ color: colors.primary, fontWeight: '700' }}> • {getActiveLabel(group.id)}</Text> : ""}
                  </Text>
                  <Text style={[dd.groupChevron, { color: colors.textMuted }, isGroupActive && dd.groupChevronUp]}>›</Text>
                </TouchableOpacity>
                {isGroupActive && (
                  <Animated.View style={[dd.subPanel, { backgroundColor: colors.background + '50', borderTopColor: colors.border, opacity: subAnim, transform: [{ translateY: subTranslate }] }]}>
                    {group.options.map((opt) => {
                      const isSelected = activeVal === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[dd.optionRow, isSelected && { backgroundColor: colors.primary + '15' }]}
                          onPress={() => handleOptionPress(group.id, opt.value)}
                          activeOpacity={0.7}
                        >
                          <Text style={[dd.optionText, { color: colors.textMuted }, isSelected && { color: colors.primary, fontWeight: '700' }]}>{opt.label}</Text>
                          {isSelected && <Text style={{ color: colors.primary, fontWeight: '800' }}>✓</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </Animated.View>
                )}
                <View style={[dd.divider, { backgroundColor: colors.border }]} />
              </View>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

const dd = StyleSheet.create({
  wrapper: { marginBottom: 10, zIndex: 100 },
  trigger: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1,
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, gap: 6, alignSelf: "flex-start",
  },
  triggerIcon: { fontSize: 14 },
  triggerText: { fontSize: 13, fontWeight: "600" },
  badge: { borderRadius: 99, width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 10, fontWeight: "800" },
  chevron: { fontSize: 18, lineHeight: 20, transform: [{ rotate: "90deg" }], marginLeft: 2 },
  chevronUp: { transform: [{ rotate: "270deg" }] },
  activeChipsRow: { marginTop: 8, marginBottom: 2 },
  activeChip: { borderWidth: 1, borderRadius: 99, paddingVertical: 3, paddingHorizontal: 10, marginRight: 6 },
  activeChipText: { fontSize: 11, fontWeight: "600" },
  clearChip: { borderWidth: 1, borderRadius: 99, paddingVertical: 3, paddingHorizontal: 10, marginRight: 6 },
  clearChipText: { fontSize: 11, fontWeight: "600" },
  panel: { marginTop: 6, borderWidth: 1, borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  groupRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13, paddingHorizontal: 16 },
  groupRowActive: { },
  groupLabel: { fontSize: 13, fontWeight: "600" },
  groupLabelSelected: { },
  groupSelBadge: { fontWeight: "700" },
  groupChevron: { fontSize: 18, transform: [{ rotate: "90deg" }] },
  groupChevronUp: { transform: [{ rotate: "270deg" }] },
  subPanel: { borderTopWidth: 1 },
  optionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11, paddingHorizontal: 28 },
  optionRowSelected: { },
  optionText: { fontSize: 13 },
  optionTextSelected: { },
  optionCheck: { fontSize: 13, fontWeight: "800" },
  divider: { height: 1 },
});

// ─── Result count pill ──────────────────────────────────────────────────────
function ResultCount({ count, loading }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  if (loading) return null;
  return (
    <View style={rc.wrap}>
      <View style={[rc.dot, { backgroundColor: colors.primary }]} />
      <Text style={[rc.text, { color: colors.textMuted }]}>
        {count === 1 ? t("explore.plants_found_one", { count }) : t("explore.plants_found_many", { count })}
      </Text>
    </View>
  );
}
const rc = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 99 },
  text: { fontSize: 12, fontWeight: "600" },
});

// ─── Cart FAB with item count badge ────────────────────────────────────────
function CartFab({ onPress, itemCount }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
  };
  return (
    <TouchableOpacity onPress={() => { pulse(); onPress(); }} activeOpacity={1}>
      <Animated.View style={[fab.cartBtn, { backgroundColor: colors.primary, shadowColor: colors.primary, transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="cart-outline" size={24} color="#000" />
        {itemCount > 0 && (
          <View style={[fab.cartBadge, { borderColor: colors.background }]}>
            <Text style={fab.cartBadgeText}>{itemCount > 99 ? "99+" : itemCount}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}
const fab = StyleSheet.create({
  cartBtn: {
    width: 56, height: 56, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
    shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cartBadge: {
    position: "absolute", top: -6, right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 99, minWidth: 20, height: 20,
    paddingHorizontal: 4,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2,
  },
  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
});

// ─── Main Screen ────────────────────────────────────────────────────────────
export default function ExplorePlants() {
  const router = useRouter();
  const { fromSeasonal } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const { colors, resolvedTheme } = useTheme();

  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherPanelOpen, setWeatherPanelOpen] = useState(false);

  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [heatFilter, setHeatFilter] = useState("all");
  const [priceBand, setPriceBand] = useState("all");

  // Cart count from router state or local (lightweight)
  const [cartCount, setCartCount] = useState(0);

  const fetchPlants = async (q = "") => {
    setLoading(true);
    try {
      const url = q
        ? `${BACKEND}/api/plants?search=${encodeURIComponent(q)}`
        : `${BACKEND}/api/plants`;
      const res = await fetch(url);
      const data = await res.json();
      setPlants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchPlants error", err);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherAlert = async () => {
    try {
      setWeatherLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const res = await fetch(`${BACKEND}/api/weather/alert?lat=${latitude}&lon=${longitude}&lang=${i18n.language}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("fetchWeatherAlert error", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => { fetchPlants(); fetchWeatherAlert(); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchPlants(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const sortedPlants = useMemo(() => {
    if (!Array.isArray(plants)) return [];
    if (sort === "low") return [...plants].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "high") return [...plants].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return plants;
  }, [plants, sort]);

  const seasonalFilteredPlants = useMemo(() => {
    const list = sortedPlants;
    if (!fromSeasonal || !Array.isArray(list)) return list;
    const key = Array.isArray(fromSeasonal) ? fromSeasonal[0] : fromSeasonal;
    const hasTag = (plant, tag) => Array.isArray(plant.seasonalTags) && plant.seasonalTags.includes(tag);

    if (key === "easy-starters") {
      const subset = list.filter((p) => {
        const water = (p.water || "").toLowerCase();
        const type = (p.type || "").toLowerCase();
        const season = (p.season || "").toLowerCase();
        return hasTag(p, "easy-starters") || p.beginnerFriendly === true ||
          (p.difficulty && p.difficulty.toLowerCase() === "easy") ||
          water.includes("low") || water.includes("medium") ||
          type.includes("houseplant") || season.includes("all");
      });
      return subset.length ? subset : list;
    }
    if (key === "fast-growers") {
      const subset = list.filter((p) => {
        const desc = (p.description || "").toLowerCase();
        const tips = Array.isArray(p.careTips) ? p.careTips.join(" ").toLowerCase() : "";
        return hasTag(p, "fast-growers") || (p.growthSpeed && p.growthSpeed.toLowerCase() === "fast") ||
          desc.includes("fast") || desc.includes("quick") || desc.includes("rapid") ||
          tips.includes("fast") || tips.includes("quick");
      });
      return subset.length ? subset : list;
    }
    if (key === "heat-friendly") {
      const subset = list.filter((p) => {
        const sun = (p.sunlight || "").toLowerCase();
        const season = (p.season || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return hasTag(p, "heat-friendly") || (p.heatTolerance && p.heatTolerance.toLowerCase() === "high") ||
          sun.includes("full") || sun.includes("direct") || season.includes("summer") ||
          desc.includes("heat") || desc.includes("hot");
      });
      return subset.length ? subset : list;
    }
    return list;
  }, [sortedPlants, fromSeasonal]);

  const fullyFilteredPlants = useMemo(() => {
    let list = seasonalFilteredPlants;
    if (!Array.isArray(list)) return [];

    if (typeFilter !== "all") {
      list = list.filter((p) => {
        const cat = (p.category || p.type || "").toLowerCase();
        if (typeFilter === "herb") return cat.includes("herb");
        if (typeFilter === "vegetable") return cat.includes("vegetable") || cat.includes("veg");
        if (typeFilter === "houseplant") return cat.includes("house") || cat.includes("indoor") || cat.includes("succulent");
        if (typeFilter === "other") return !cat.includes("herb") && !cat.includes("vegetable") && !cat.includes("veg") && !cat.includes("house") && !cat.includes("indoor") && !cat.includes("succulent");
        return true;
      });
    }
    if (difficultyFilter !== "all") {
      list = list.filter((p) => {
        const diff = (p.difficulty || "").toLowerCase();
        if (difficultyFilter === "easy") return p.beginnerFriendly === true || diff === "easy";
        if (difficultyFilter === "medium") return diff === "medium" || !diff;
        if (difficultyFilter === "hard") return diff === "hard";
        return true;
      });
    }
    if (heatFilter !== "all") {
      list = list.filter((p) => {
        const heat = (p.heatTolerance || "").toLowerCase();
        const sun = (p.sunlight || "").toLowerCase();
        if (heatFilter === "cool") return heat === "low" || sun.includes("partial") || sun.includes("shade") || sun.includes("indirect");
        if (heatFilter === "warm") return heat === "high" || sun.includes("full") || sun.includes("direct") || (p.season || "").toLowerCase().includes("summer");
        return true;
      });
    }
    if (priceBand !== "all") {
      list = list.filter((p) => {
        const price = typeof p.price === "number" ? p.price : null;
        if (price == null) return priceBand === "all";
        if (priceBand === "budget") return price < 35;
        if (priceBand === "mid") return price >= 35 && price <= 70;
        if (priceBand === "premium") return price > 70;
        return true;
      });
    }
    return list;
  }, [seasonalFilteredPlants, typeFilter, difficultyFilter, heatFilter, priceBand]);

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{t('explore.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('explore.subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bellBtn, { backgroundColor: colors.surface, borderColor: colors.border }, weather && styles.bellBtnActive]}
          onPress={() => setWeatherPanelOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={20} color={weather ? colors.primary : colors.textMuted} />
          {weather && <View style={[styles.bellDot, { backgroundColor: colors.primary, borderColor: colors.background }]} />}
        </TouchableOpacity>
      </View>

      {/* ── Weather modal ── */}
      <WeatherPanel
        visible={weatherPanelOpen}
        onClose={() => setWeatherPanelOpen(false)}
        weather={weather}
        weatherLoading={weatherLoading}
      />

      {/* ── Search ── */}
      <SearchBar value={search} onChangeText={setSearch} placeholder={t('explore.search_placeholder')} />

      {/* ── Filters ── */}
      <CascadeDropdown
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        difficultyFilter={difficultyFilter} setDifficultyFilter={setDifficultyFilter}
        heatFilter={heatFilter} setHeatFilter={setHeatFilter}
        priceBand={priceBand} setPriceBand={setPriceBand}
      />

      {/* ── Result count ── */}
      <ResultCount count={fullyFilteredPlants.length} loading={loading} />

      {/* ── Plant list ── */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>{t("explore.finding_plants")}</Text>
        </View>
      ) : (
        <FlatList
          data={fullyFilteredPlants}
          keyExtractor={(item, index) => item._id ?? String(index)}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              onPress={() => router.push(`/plant/${item._id}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t("explore.no_plants_found")}</Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>{t("explore.adjust_filters")}</Text>
            </View>
          }
        />
      )}

      {/* ── FAB dock ── */}
      <View style={styles.fabDock}>
        {/* Camera */}
        <TouchableOpacity
          onPress={() => router.push("/share/camera")}
          style={[styles.cameraFab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <Ionicons name="camera-outline" size={22} color="#000" />
        </TouchableOpacity>

        {/* Cart with badge */}
        <CartFab
          onPress={() => router.push("/cart")}
          itemCount={cartCount}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, paddingTop: 40 },

  // ── Header
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 12, marginTop: 2, fontWeight: "500" },
  bellBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1,
    marginTop: 4,
  },
  bellBtnActive: { },
  bellDot: {
    position: "absolute", top: 8, right: 8,
    width: 7, height: 7, borderRadius: 99,
    borderWidth: 1.5,
  },

  // ── Loading
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 13 },

  // ── Empty state
  emptyWrap: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptySub: { fontSize: 13 },

  // ── List
  listContent: { paddingBottom: 120, gap: 0 },

  // ── FAB dock — side-by-side pill at bottom right
  fabDock: {
    position: "absolute",
    bottom: 28,
    right: 20,
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  cameraFab: {
    width: 56, height: 56, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
    shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});