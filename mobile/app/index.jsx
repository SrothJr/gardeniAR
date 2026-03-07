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
// import { Ionicons } from "@expo/vector-icons";
// import SearchBar from "../components/SearchBar";
// import PlantCard from "../components/PlantCard";
// import WeatherPanel from "../components/WeatherPanel";
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
//   weatherCity: { color: "#e5e7eb", fontWeight: "700", textAlign: "right" },
//   weatherTemp: { color: "#93c5fd", marginTop: 4, textAlign: "right" },
//   weatherCondition: { color: "#a7f3d0", marginTop: 4, textTransform: "capitalize", textAlign: "right" },
//   weatherAlert: { color: "#fbbf24", marginTop: 8, fontWeight: "600" },
//   weatherTip: { color: "#cbd5e1", fontSize: 13 },

//   cameraFab: { position: "absolute", bottom: 24, right: 24, backgroundColor: "#22c55e", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
//   cartFab: { position: "absolute", bottom: 100, right: 24, backgroundColor: "#fbbf24", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
// });

//3/7/2026
// index.jsx
// import { Link, useRouter, useFocusEffect } from "expo-router";
// import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useState, useCallback } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import WeatherPanel from "../components/WeatherPanel";
// import { BACKEND } from "../config";
// import * as Location from "expo-location";

// export default function Index() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);
//   const [weatherPanelOpen, setWeatherPanelOpen] = useState(false);

//   useFocusEffect(
//     useCallback(() => {
//       checkUser();
//       fetchWeather();
//     }, [])
//   );

//   const checkUser = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem("user");
//       setUser(userStr ? JSON.parse(userStr) : null);
//     } catch {
//       setUser(null);
//     }
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("user");
//     setUser(null);
//     router.replace("/auth/login");
//   };

//   const handleBellPress = async () => {
//     setWeatherPanelOpen(true);
//     // Fetch fresh weather each time the panel is opened if not already loaded
//     if (!weather && !weatherLoading) {
//       fetchWeather();
//     }
//   };

//   const fetchWeather = async () => {
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
//       console.error("fetchWeather error", err);
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   const firstName = user?.name?.split?.(" ")?.[0] ?? "Guest";

//   const ServiceTile = ({ icon, label, sub, href, tone = "mint" }) => {
//     const toneStyles =
//       tone === "blue"
//         ? styles.toneBlue
//         : tone === "amber"
//           ? styles.toneAmber
//           : tone === "rose"
//             ? styles.toneRose
//             : styles.toneMint;

//     return (
//       <Link href={href} asChild>
//         <TouchableOpacity activeOpacity={0.92} style={styles.serviceTile}>
//           <View style={[styles.serviceIconWrap, toneStyles]}>
//             <Ionicons name={icon} size={20} color="#051013" />
//           </View>
//           <Text style={styles.serviceLabel} numberOfLines={1}>
//             {label}
//           </Text>
//           {!!sub && (
//             <Text style={styles.serviceSub} numberOfLines={1}>
//               {sub}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </Link>
//     );
//   };

//   const FeaturedCard = ({ title, subtitle, icon, href, imageSource }) => (
//     <Link href={href} asChild>
//       <TouchableOpacity activeOpacity={0.92} style={styles.featuredCard}>
//         <View style={styles.featuredTop}>
//           <View style={styles.featuredIcon}>
//             <Ionicons name={icon} size={18} color="#06150b" />
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.featuredTitle} numberOfLines={1}>
//               {title}
//             </Text>
//             <Text style={styles.featuredSubtitle} numberOfLines={2}>
//               {subtitle}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.featuredBottom}>
//           <Text style={styles.featuredCta}>Open</Text>
//           <Ionicons name="chevron-forward" size={18} color="#9fb1be" />
//         </View>

//         {!!imageSource && (
//           <Image source={imageSource} style={styles.featuredImage} resizeMode="contain" />
//         )}
//       </TouchableOpacity>
//     </Link>
//   );

//   return (
//     <SafeAreaView style={styles.safe} edges={["top"]}>
//       <StatusBar style="light" />

//       <View style={styles.bgBlobA} />
//       <View style={styles.bgBlobB} />

//       {/* Weather Panel modal */}
//       <WeatherPanel
//         visible={weatherPanelOpen}
//         onClose={() => setWeatherPanelOpen(false)}
//         weather={weather}
//         weatherLoading={weatherLoading}
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.headerRow}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.brand}>GardeniAR</Text>
//             <Text style={styles.greeting} numberOfLines={1}>
//               {user ? `Welcome back, ${firstName}` : "Grow smarter, every day"}
//             </Text>
//           </View>

//           {/* Bell button — opens weather panel */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             style={[styles.iconBtn, weather && styles.iconBtnActive]}
//             accessibilityRole="button"
//             onPress={handleBellPress}
//           >
//             <Ionicons
//               name="notifications-outline"
//               size={20}
//               color={weather ? "#22c55e" : "#e5e7eb"}
//             />
//             {weather && <View style={styles.bellDot} />}
//           </TouchableOpacity>

//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {user ? firstName?.slice?.(0, 1)?.toUpperCase?.() ?? "U" : "?"}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.featuredRow}>
//           <FeaturedCard
//             title="Weed Scanner"
//             subtitle="Point your camera and get AI identification"
//             icon="scan-outline"
//             href="/identify"
//             imageSource={require("../assets/images/basil.png")}
//           />
//           <FeaturedCard
//             title="Soil Test"
//             subtitle="Scan soil color & texture for quick tips"
//             icon="color-wand-outline"
//             href="/soil"
//             imageSource={require("../assets/images/seed.png")}
//           />
//         </View>

//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Services</Text>
//           <Link href="/explore" asChild>
//             <TouchableOpacity activeOpacity={0.8} style={styles.sectionLink}>
//               <Text style={styles.sectionLinkText}>See all</Text>
//               <Ionicons name="chevron-forward" size={16} color="#93c5fd" />
//             </TouchableOpacity>
//           </Link>
//         </View>

//         <View style={styles.servicesGrid}>
//           <ServiceTile icon="search-outline" label="Explore" sub="Plants & tips" href="/explore" tone="blue" />
//           <ServiceTile icon="cube-outline" label="Plant Tracker" sub="AR & crops" href="/ar" tone="mint" />
//           <ServiceTile icon="water-outline" label="Care Guides" sub="Water & feed" href="/care-guides" tone="mint" />
//           <ServiceTile icon="leaf-outline" label="Companions" sub="Plant buddies" href="/companions" tone="amber" />
//           <ServiceTile icon="trending-up-outline" label="Growth" sub="Track plants" href="/growth" tone="mint" />
//           <ServiceTile icon="camera-outline" label="Share" sub="Garden posts" href="/share/camera" tone="rose" />
//           <ServiceTile icon="checkbox-outline" label="Tasks" sub="Daily checklist" href="/checklist" tone="amber" />
//           <ServiceTile icon="chatbubbles-outline" label="Forum" sub="Ask & help" href="/forum" tone="blue" />
//           <ServiceTile icon="cart-outline" label="Cart" sub="Your items" href="/cart" tone="rose" />
//         </View>

//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>For you</Text>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.promoRow}
//         >
//           <Link href="/collections/seasonal" asChild>
//             <TouchableOpacity activeOpacity={0.92} style={styles.promoCard}>
//               <View style={styles.promoTextWrap}>
//                 <Text style={styles.promoTitle}>Seasonal picks</Text>
//                 <Text style={styles.promoSub}>Easy plants to start this week</Text>
//               </View>
//               <Image
//                 source={require("../assets/images/lettuce.png")}
//                 style={styles.promoImage}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </Link>

//           <Link href="/routines/watering" asChild>
//             <TouchableOpacity activeOpacity={0.92} style={[styles.promoCard, styles.promoAlt]}>
//               <View style={styles.promoTextWrap}>
//                 <Text style={styles.promoTitle}>Watering routine</Text>
//                 <Text style={styles.promoSub}>Simple schedule for healthier growth</Text>
//               </View>
//               <Image
//                 source={require("../assets/images/cucumber.png")}
//                 style={styles.promoImage}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </Link>
//         </ScrollView>

//         <View style={styles.authCard}>
//           {user ? (
//             <View style={styles.authRow}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.authTitle} numberOfLines={1}>
//                   Signed in as {firstName}
//                 </Text>
//                 <Text style={styles.authSub}>You'll get personalized recommendations</Text>
//               </View>
//               <TouchableOpacity activeOpacity={0.9} style={styles.logoutBtn} onPress={handleLogout}>
//                 <Ionicons name="log-out-outline" size={18} color="#fff" />
//                 <Text style={styles.authBtnText}>Log out</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.authRow}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.authTitle}>Sign in</Text>
//                 <Text style={styles.authSub}>Sync your garden and track progress</Text>
//               </View>
//               <Link href="/auth/login" asChild>
//                 <TouchableOpacity activeOpacity={0.9} style={styles.loginBtn}>
//                   <Ionicons name="log-in-outline" size={18} color="#051013" />
//                   <Text style={[styles.authBtnText, { color: "#051013" }]}>Log in</Text>
//                 </TouchableOpacity>
//               </Link>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#071024" },
//   scrollContent: { paddingHorizontal: 18, paddingBottom: 24 },

//   bgBlobA: { position: "absolute", top: -120, right: -120, width: 240, height: 240, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.18)" },
//   bgBlobB: { position: "absolute", bottom: -140, left: -120, width: 260, height: 260, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.12)" },

//   headerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 10, paddingBottom: 12 },
//   brand: { color: "#e6eef3", fontSize: 26, fontWeight: "800", letterSpacing: 0.2 },
//   greeting: { color: "#9fb1be", marginTop: 3, fontSize: 14 },
//   iconBtn: {
//     width: 40, height: 40, borderRadius: 12,
//     alignItems: "center", justifyContent: "center",
//     backgroundColor: "rgba(15, 23, 42, 0.95)",
//     borderWidth: 1, borderColor: "rgba(148,163,184,0.15)",
//   },
//   iconBtnActive: {
//     borderColor: "rgba(34,197,94,0.4)",
//     backgroundColor: "rgba(34,197,94,0.1)",
//   },
//   bellDot: {
//     position: "absolute", top: 8, right: 8,
//     width: 7, height: 7, borderRadius: 99,
//     backgroundColor: "#22c55e",
//     borderWidth: 1.5, borderColor: "#071024",
//   },
//   avatar: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(34,197,94,0.18)", borderWidth: 1, borderColor: "rgba(34,197,94,0.35)" },
//   avatarText: { color: "#cfe7d4", fontWeight: "800" },

//   featuredRow: { flexDirection: "row", gap: 12, marginTop: 8 },
//   featuredCard: { flex: 1, minHeight: 132, borderRadius: 18, padding: 14, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", overflow: "hidden", ...Platform.select({ android: { elevation: 3 }, ios: { shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } } }) },
//   featuredTop: { flexDirection: "row", gap: 10, alignItems: "center" },
//   featuredIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "rgba(34,197,94,0.95)", alignItems: "center", justifyContent: "center" },
//   featuredTitle: { color: "#e6eef3", fontWeight: "800", fontSize: 15 },
//   featuredSubtitle: { color: "#9fb1be", marginTop: 2, fontSize: 12, lineHeight: 16 },
//   featuredBottom: { position: "absolute", bottom: 12, left: 14, right: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   featuredCta: { color: "#cbd5e1", fontWeight: "700" },
//   featuredImage: { position: "absolute", right: -10, bottom: -10, width: 92, height: 92, opacity: 0.9 },

//   sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },
//   sectionTitle: { color: "#cbd5e1", fontSize: 16, fontWeight: "800" },
//   sectionLink: { flexDirection: "row", alignItems: "center", gap: 2, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.12)", borderWidth: 1, borderColor: "rgba(59,130,246,0.18)" },
//   sectionLinkText: { color: "#93c5fd", fontWeight: "700", fontSize: 13 },

//   servicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
//   serviceTile: { width: "48.5%", padding: 14, borderRadius: 18, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)" },
//   serviceIconWrap: { width: 36, height: 36, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
//   serviceLabel: { color: "#e6eef3", fontWeight: "800", fontSize: 14 },
//   serviceSub: { color: "#94a3b8", fontSize: 12, marginTop: 3 },
//   toneMint: { backgroundColor: "rgba(34,197,94,0.9)" },
//   toneBlue: { backgroundColor: "rgba(59,130,246,0.92)" },
//   toneAmber: { backgroundColor: "rgba(245,158,11,0.92)" },
//   toneRose: { backgroundColor: "rgba(244,63,94,0.9)" },

//   promoRow: { gap: 12, paddingBottom: 6 },
//   promoCard: { width: 260, minHeight: 110, borderRadius: 18, padding: 14, backgroundColor: "rgba(34,197,94,0.16)", borderWidth: 1, borderColor: "rgba(34,197,94,0.22)", overflow: "hidden" },
//   promoAlt: { backgroundColor: "rgba(59,130,246,0.14)", borderColor: "rgba(59,130,246,0.20)" },
//   promoTextWrap: { paddingRight: 88 },
//   promoTitle: { color: "#e6eef3", fontWeight: "900", fontSize: 15 },
//   promoSub: { color: "#b3c4cf", marginTop: 4, fontSize: 12, lineHeight: 16 },
//   promoImage: { position: "absolute", right: 8, bottom: -8, width: 90, height: 90, opacity: 0.95 },

//   authCard: { marginTop: 16, borderRadius: 18, padding: 14, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)" },
//   authRow: { flexDirection: "row", alignItems: "center", gap: 12 },
//   authTitle: { color: "#e6eef3", fontWeight: "900", fontSize: 14 },
//   authSub: { color: "#9fb1be", marginTop: 3, fontSize: 12 },
//   loginBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(34,197,94,0.92)" },
//   logoutBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(239,68,68,0.92)" },
//   authBtnText: { color: "#fff", fontWeight: "900" },
// });


// //app/index.jsx
// import { Link, useRouter, useFocusEffect } from "expo-router";
// import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useState, useCallback } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import WeatherPanel from "../components/WeatherPanel";
// import { BACKEND } from "../config";
// import * as Location from "expo-location";

// export default function Index() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);
//   const [weatherPanelOpen, setWeatherPanelOpen] = useState(false);

//   useFocusEffect(
//     useCallback(() => {
//       checkUser();
//       fetchWeather();
//     }, [])
//   );

//   const checkUser = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem("user");
//       setUser(userStr ? JSON.parse(userStr) : null);
//     } catch {
//       setUser(null);
//     }
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("user");
//     setUser(null);
//     router.replace("/auth/login");
//   };

//   const handleBellPress = async () => {
//     setWeatherPanelOpen(true);
//     if (!weather && !weatherLoading) {
//       fetchWeather();
//     }
//   };

//   const fetchWeather = async () => {
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
//       console.error("fetchWeather error", err);
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   const firstName = user?.name?.split?.(" ")?.[0] ?? "Guest";

//   const ServiceTile = ({ icon, label, sub, href, tone = "mint" }) => {
//     const toneStyles =
//       tone === "blue"
//         ? styles.toneBlue
//         : tone === "amber"
//           ? styles.toneAmber
//           : tone === "rose"
//             ? styles.toneRose
//             : styles.toneMint;

//     return (
//       <Link href={href} asChild>
//         <TouchableOpacity activeOpacity={0.92} style={styles.serviceTile}>
//           <View style={[styles.serviceIconWrap, toneStyles]}>
//             <Ionicons name={icon} size={20} color="#051013" />
//           </View>
//           <Text style={styles.serviceLabel} numberOfLines={1}>
//             {label}
//           </Text>
//           {!!sub && (
//             <Text style={styles.serviceSub} numberOfLines={1}>
//               {sub}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </Link>
//     );
//   };

//   const FeaturedCard = ({ title, subtitle, icon, href, imageSource }) => (
//     <Link href={href} asChild>
//       <TouchableOpacity activeOpacity={0.92} style={styles.featuredCard}>
//         <View style={styles.featuredTop}>
//           <View style={styles.featuredIcon}>
//             <Ionicons name={icon} size={18} color="#06150b" />
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.featuredTitle} numberOfLines={1}>
//               {title}
//             </Text>
//             <Text style={styles.featuredSubtitle} numberOfLines={2}>
//               {subtitle}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.featuredBottom}>
//           <Text style={styles.featuredCta}>Open</Text>
//           <Ionicons name="chevron-forward" size={18} color="#9fb1be" />
//         </View>

//         {!!imageSource && (
//           <Image source={imageSource} style={styles.featuredImage} resizeMode="contain" />
//         )}
//       </TouchableOpacity>
//     </Link>
//   );

//   return (
//     <SafeAreaView style={styles.safe} edges={["top"]}>
//       <StatusBar style="light" />

//       <View style={styles.bgBlobA} />
//       <View style={styles.bgBlobB} />

//       {/* Weather Panel modal */}
//       <WeatherPanel
//         visible={weatherPanelOpen}
//         onClose={() => setWeatherPanelOpen(false)}
//         weather={weather}
//         weatherLoading={weatherLoading}
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.headerRow}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.brand}>GardeniAR</Text>
//             <Text style={styles.greeting} numberOfLines={1}>
//               {user ? `Welcome back, ${firstName}` : "Grow smarter, every day"}
//             </Text>
//           </View>

//           {/* Bell button — opens weather panel */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             style={[styles.iconBtn, weather && styles.iconBtnActive]}
//             accessibilityRole="button"
//             onPress={handleBellPress}
//           >
//             <Ionicons
//               name="notifications-outline"
//               size={20}
//               color={weather ? "#22c55e" : "#e5e7eb"}
//             />
//             {weather && <View style={styles.bellDot} />}
//           </TouchableOpacity>

//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {user ? firstName?.slice?.(0, 1)?.toUpperCase?.() ?? "U" : "?"}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.featuredRow}>
//           <FeaturedCard
//             title="Weed Scanner"
//             subtitle="Point your camera and get AI identification"
//             icon="scan-outline"
//             href="/identify"
//             imageSource={require("../assets/images/basil.png")}
//           />
//           <FeaturedCard
//             title="Soil Test"
//             subtitle="Scan soil color & texture for quick tips"
//             icon="color-wand-outline"
//             href="/soil"
//             imageSource={require("../assets/images/seed.png")}
//           />
//         </View>

//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Services</Text>
//           <Link href="/explore" asChild>
//             <TouchableOpacity activeOpacity={0.8} style={styles.sectionLink}>
//               <Text style={styles.sectionLinkText}>See all</Text>
//               <Ionicons name="chevron-forward" size={16} color="#93c5fd" />
//             </TouchableOpacity>
//           </Link>
//         </View>

//         <View style={styles.servicesGrid}>
//           <ServiceTile icon="search-outline" label="Explore" sub="Plants & tips" href="/explore" tone="blue" />
//           <ServiceTile icon="cube-outline" label="Plant Tracker" sub="AR & crops" href="/ar/PlantTracker" tone="mint" />
//           <ServiceTile icon="water-outline" label="Care Guides" sub="Water & feed" href="/care-guides" tone="mint" />
//           <ServiceTile icon="leaf-outline" label="Companions" sub="Plant buddies" href="/companions" tone="amber" />
//           <ServiceTile icon="trending-up-outline" label="Growth" sub="Track plants" href="/growth" tone="mint" />
//           <ServiceTile icon="camera-outline" label="Share" sub="Garden posts" href="/share/camera" tone="rose" />
//           <ServiceTile icon="checkbox-outline" label="Tasks" sub="Daily checklist" href="/checklist" tone="amber" />
//           <ServiceTile icon="chatbubbles-outline" label="Forum" sub="Ask & help" href="/forum" tone="blue" />
//           <ServiceTile icon="cart-outline" label="Cart" sub="Your items" href="/cart" tone="rose" />
//         </View>

//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>For you</Text>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.promoRow}
//         >
//           <Link href="/collections/seasonal" asChild>
//             <TouchableOpacity activeOpacity={0.92} style={styles.promoCard}>
//               <View style={styles.promoTextWrap}>
//                 <Text style={styles.promoTitle}>Seasonal picks</Text>
//                 <Text style={styles.promoSub}>Easy plants to start this week</Text>
//               </View>
//               <Image
//                 source={require("../assets/images/lettuce.png")}
//                 style={styles.promoImage}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </Link>

//           <Link href="/routines/watering" asChild>
//             <TouchableOpacity activeOpacity={0.92} style={[styles.promoCard, styles.promoAlt]}>
//               <View style={styles.promoTextWrap}>
//                 <Text style={styles.promoTitle}>Watering routine</Text>
//                 <Text style={styles.promoSub}>Simple schedule for healthier growth</Text>
//               </View>
//               <Image
//                 source={require("../assets/images/cucumber.png")}
//                 style={styles.promoImage}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </Link>
//         </ScrollView>

//         <View style={styles.authCard}>
//           {user ? (
//             <View style={styles.authRow}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.authTitle} numberOfLines={1}>
//                   Signed in as {firstName}
//                 </Text>
//                 <Text style={styles.authSub}>You'll get personalized recommendations</Text>
//               </View>
//               <TouchableOpacity activeOpacity={0.9} style={styles.logoutBtn} onPress={handleLogout}>
//                 <Ionicons name="log-out-outline" size={18} color="#fff" />
//                 <Text style={styles.authBtnText}>Log out</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.authRow}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.authTitle}>Sign in</Text>
//                 <Text style={styles.authSub}>Sync your garden and track progress</Text>
//               </View>
//               <Link href="/auth/login" asChild>
//                 <TouchableOpacity activeOpacity={0.9} style={styles.loginBtn}>
//                   <Ionicons name="log-in-outline" size={18} color="#051013" />
//                   <Text style={[styles.authBtnText, { color: "#051013" }]}>Log in</Text>
//                 </TouchableOpacity>
//               </Link>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#071024" },
//   scrollContent: { paddingHorizontal: 18, paddingBottom: 24 },

//   bgBlobA: { position: "absolute", top: -120, right: -120, width: 240, height: 240, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.18)" },
//   bgBlobB: { position: "absolute", bottom: -140, left: -120, width: 260, height: 260, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.12)" },

//   headerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 10, paddingBottom: 12 },
//   brand: { color: "#e6eef3", fontSize: 26, fontWeight: "800", letterSpacing: 0.2 },
//   greeting: { color: "#9fb1be", marginTop: 3, fontSize: 14 },
//   iconBtn: {
//     width: 40, height: 40, borderRadius: 12,
//     alignItems: "center", justifyContent: "center",
//     backgroundColor: "rgba(15, 23, 42, 0.95)",
//     borderWidth: 1, borderColor: "rgba(148,163,184,0.15)",
//   },
//   iconBtnActive: {
//     borderColor: "rgba(34,197,94,0.4)",
//     backgroundColor: "rgba(34,197,94,0.1)",
//   },
//   bellDot: {
//     position: "absolute", top: 8, right: 8,
//     width: 7, height: 7, borderRadius: 99,
//     backgroundColor: "#22c55e",
//     borderWidth: 1.5, borderColor: "#071024",
//   },
//   avatar: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(34,197,94,0.18)", borderWidth: 1, borderColor: "rgba(34,197,94,0.35)" },
//   avatarText: { color: "#cfe7d4", fontWeight: "800" },

//   featuredRow: { flexDirection: "row", gap: 12, marginTop: 8 },
//   featuredCard: { flex: 1, minHeight: 132, borderRadius: 18, padding: 14, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", overflow: "hidden", ...Platform.select({ android: { elevation: 3 }, ios: { shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } } }) },
//   featuredTop: { flexDirection: "row", gap: 10, alignItems: "center" },
//   featuredIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "rgba(34,197,94,0.95)", alignItems: "center", justifyContent: "center" },
//   featuredTitle: { color: "#e6eef3", fontWeight: "800", fontSize: 15 },
//   featuredSubtitle: { color: "#9fb1be", marginTop: 2, fontSize: 12, lineHeight: 16 },
//   featuredBottom: { position: "absolute", bottom: 12, left: 14, right: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   featuredCta: { color: "#cbd5e1", fontWeight: "700" },
//   featuredImage: { position: "absolute", right: -10, bottom: -10, width: 92, height: 92, opacity: 0.9 },

//   sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },
//   sectionTitle: { color: "#cbd5e1", fontSize: 16, fontWeight: "800" },
//   sectionLink: { flexDirection: "row", alignItems: "center", gap: 2, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.12)", borderWidth: 1, borderColor: "rgba(59,130,246,0.18)" },
//   sectionLinkText: { color: "#93c5fd", fontWeight: "700", fontSize: 13 },

//   servicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
//   serviceTile: { width: "48.5%", padding: 14, borderRadius: 18, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)" },
//   serviceIconWrap: { width: 36, height: 36, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
//   serviceLabel: { color: "#e6eef3", fontWeight: "800", fontSize: 14 },
//   serviceSub: { color: "#94a3b8", fontSize: 12, marginTop: 3 },
//   toneMint: { backgroundColor: "rgba(34,197,94,0.9)" },
//   toneBlue: { backgroundColor: "rgba(59,130,246,0.92)" },
//   toneAmber: { backgroundColor: "rgba(245,158,11,0.92)" },
//   toneRose: { backgroundColor: "rgba(244,63,94,0.9)" },

//   promoRow: { gap: 12, paddingBottom: 6 },
//   promoCard: { width: 260, minHeight: 110, borderRadius: 18, padding: 14, backgroundColor: "rgba(34,197,94,0.16)", borderWidth: 1, borderColor: "rgba(34,197,94,0.22)", overflow: "hidden" },
//   promoAlt: { backgroundColor: "rgba(59,130,246,0.14)", borderColor: "rgba(59,130,246,0.20)" },
//   promoTextWrap: { paddingRight: 88 },
//   promoTitle: { color: "#e6eef3", fontWeight: "900", fontSize: 15 },
//   promoSub: { color: "#b3c4cf", marginTop: 4, fontSize: 12, lineHeight: 16 },
//   promoImage: { position: "absolute", right: 8, bottom: -8, width: 90, height: 90, opacity: 0.95 },

//   authCard: { marginTop: 16, borderRadius: 18, padding: 14, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)" },
//   authRow: { flexDirection: "row", alignItems: "center", gap: 12 },
//   authTitle: { color: "#e6eef3", fontWeight: "900", fontSize: 14 },
//   authSub: { color: "#9fb1be", marginTop: 3, fontSize: 12 },
//   loginBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(34,197,94,0.92)" },
//   logoutBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(239,68,68,0.92)" },
//   authBtnText: { color: "#fff", fontWeight: "900" },
// });

// app/index.jsx
import { Link, useRouter, useFocusEffect } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import WeatherPanel from "../components/WeatherPanel";
import { BACKEND } from "../config";
import * as Location from "expo-location";
import { usePremium } from "../hooks/usePremium";

export default function Index() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { isPremium, sharesLeft } = usePremium();

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherPanelOpen, setWeatherPanelOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkUser();
      fetchWeather();
    }, [])
  );

  const checkUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      setUser(userStr ? JSON.parse(userStr) : null);
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/auth/login");
  };

  const handleBellPress = async () => {
    setWeatherPanelOpen(true);
    if (!weather && !weatherLoading) fetchWeather();
  };

  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const res = await fetch(`${BACKEND}/api/weather/alert?lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("fetchWeather error", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const firstName = user?.name?.split?.(" ")?.[0] ?? "Guest";

  // Service tiles — premiumLocked = fully locked, shareGated = 2 free uses then locked
  const ServiceTile = ({ icon, label, sub, href, tone = "mint", premiumLocked = false, shareGated = false }) => {
    const toneStyles =
      tone === "blue" ? styles.toneBlue
      : tone === "amber" ? styles.toneAmber
      : tone === "rose" ? styles.toneRose
      : styles.toneMint;

    const isLocked = premiumLocked && !isPremium;
    // Share is never hard-locked from the home tile — the gate lives inside camera.jsx
    const showLockIcon = isLocked;

    const handlePress = () => {
      if (isLocked) {
        router.push("/premium");
        return;
      }
      router.push(href);
    };

    // For share tile: show how many free uses remain
    const subLabel = isLocked
      ? "Premium only"
      : shareGated && !isPremium
        ? `${sharesLeft} free use${sharesLeft !== 1 ? "s" : ""} left`
        : sub;

    return (
      <TouchableOpacity activeOpacity={0.92} style={[styles.serviceTile, isLocked && styles.serviceTileLocked]} onPress={handlePress}>
        <View style={[styles.serviceIconWrap, toneStyles, isLocked && styles.serviceIconLocked]}>
          <Ionicons name={icon} size={20} color={isLocked ? "#4b5563" : "#051013"} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={[styles.serviceLabel, isLocked && styles.serviceLabelLocked]} numberOfLines={1}>
            {label}
          </Text>
          {showLockIcon && (
            <Ionicons name="lock-closed" size={12} color="#6b7280" />
          )}
        </View>
        {!!subLabel && (
          <Text
            style={[
              styles.serviceSub,
              isLocked && { color: "#374151" },
              shareGated && !isPremium && sharesLeft === 0 && { color: "#ef4444" },
            ]}
            numberOfLines={1}
          >
            {subLabel}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const FeaturedCard = ({ title, subtitle, icon, href, imageSource }) => (
    <Link href={href} asChild>
      <TouchableOpacity activeOpacity={0.92} style={styles.featuredCard}>
        <View style={styles.featuredTop}>
          <View style={styles.featuredIcon}>
            <Ionicons name={icon} size={18} color="#06150b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.featuredTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.featuredSubtitle} numberOfLines={2}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.featuredBottom}>
          <Text style={styles.featuredCta}>Open</Text>
          <Ionicons name="chevron-forward" size={18} color="#9fb1be" />
        </View>
        {!!imageSource && (
          <Image source={imageSource} style={styles.featuredImage} resizeMode="contain" />
        )}
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.bgBlobA} />
      <View style={styles.bgBlobB} />

      <WeatherPanel
        visible={weatherPanelOpen}
        onClose={() => setWeatherPanelOpen(false)}
        weather={weather}
        weatherLoading={weatherLoading}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>GardeniAR</Text>
            <Text style={styles.greeting} numberOfLines={1}>
              {user ? `Welcome back, ${firstName}` : "Grow smarter, every day"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.iconBtn, weather && styles.iconBtnActive]}
            onPress={handleBellPress}
          >
            <Ionicons name="notifications-outline" size={20} color={weather ? "#22c55e" : "#e5e7eb"} />
            {weather && <View style={styles.bellDot} />}
          </TouchableOpacity>

          {/* Premium chip — opens subscription info if premium, upgrade page if free */}
          <TouchableOpacity
            style={[styles.premiumChip, isPremium && styles.premiumChipActive]}
            onPress={() => router.push(isPremium ? "/my-subscription" : "/premium")}
            activeOpacity={0.85}
          >
            <Text style={[styles.premiumChipText, isPremium && styles.premiumChipTextActive]}>
              {isPremium ? "✨ Premium" : "Upgrade"}
            </Text>
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? firstName?.slice?.(0, 1)?.toUpperCase?.() ?? "U" : "?"}
            </Text>
          </View>
        </View>

        {/* Free-user info strip */}
        {!isPremium && (
          <TouchableOpacity style={styles.freeStrip} onPress={() => router.push("/premium")} activeOpacity={0.85}>
            <Ionicons name="information-circle-outline" size={15} color="#9fb1be" />
            <Text style={styles.freeStripText}>
              Share Garden: <Text style={{ color: sharesLeft === 0 ? "#ef4444" : "#22c55e", fontWeight: "700" }}>{sharesLeft} free use{sharesLeft !== 1 ? "s" : ""} left</Text>
              {"  ·  "}
              <Text style={{ color: "#93c5fd" }}>Growth, Disease & AR locked 🔒</Text>
            </Text>
            <Ionicons name="chevron-forward" size={13} color="#6b7280" />
          </TouchableOpacity>
        )}

        <View style={styles.featuredRow}>
          <FeaturedCard
            title="Weed Scanner"
            subtitle="Point your camera and get AI identification"
            icon="scan-outline"
            href="/identify"
            imageSource={require("../assets/images/basil.png")}
          />
          <FeaturedCard
            title="Soil Test"
            subtitle="Scan soil color & texture for quick tips"
            icon="color-wand-outline"
            href="/soil"
            imageSource={require("../assets/images/seed.png")}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <Link href="/explore" asChild>
            <TouchableOpacity activeOpacity={0.8} style={styles.sectionLink}>
              <Text style={styles.sectionLinkText}>See all</Text>
              <Ionicons name="chevron-forward" size={16} color="#93c5fd" />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.servicesGrid}>
          <ServiceTile icon="search-outline"      label="Explore"        sub="Plants & tips"   href="/explore"          tone="blue" />
          <ServiceTile icon="water-outline"       label="Care Guides"    sub="Water & feed"    href="/care-guides"      tone="mint" />
          <ServiceTile icon="leaf-outline"        label="Companions"     sub="Plant buddies"   href="/companions"       tone="amber" />
          <ServiceTile icon="checkbox-outline"    label="Tasks"          sub="Daily checklist" href="/checklist"        tone="amber" />
          <ServiceTile icon="chatbubbles-outline" label="Forum"          sub="Ask & help"      href="/forum"            tone="blue" />
          <ServiceTile icon="cart-outline"        label="Cart"           sub="Your items"      href="/cart"             tone="rose" />
          {/* 🔒 Premium locked tiles */}
          <ServiceTile icon="trending-up-outline" label="Growth"         sub="Track plants"    href="/growth"           tone="mint"  premiumLocked />
          <ServiceTile icon="cube-outline"        label="Plant Tracker"  sub="AR & Disease"    href="/ar/PlantTracker"  tone="mint"  premiumLocked />
          <ServiceTile icon="camera-outline"      label="Share"          sub="2 free uses"     href="/share/camera"     tone="rose"  shareGated />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For you</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoRow}>
          <Link href="/collections/seasonal" asChild>
            <TouchableOpacity activeOpacity={0.92} style={styles.promoCard}>
              <View style={styles.promoTextWrap}>
                <Text style={styles.promoTitle}>Seasonal picks</Text>
                <Text style={styles.promoSub}>Easy plants to start this week</Text>
              </View>
              <Image source={require("../assets/images/lettuce.png")} style={styles.promoImage} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
          <Link href="/routines/watering" asChild>
            <TouchableOpacity activeOpacity={0.92} style={[styles.promoCard, styles.promoAlt]}>
              <View style={styles.promoTextWrap}>
                <Text style={styles.promoTitle}>Watering routine</Text>
                <Text style={styles.promoSub}>Simple schedule for healthier growth</Text>
              </View>
              <Image source={require("../assets/images/cucumber.png")} style={styles.promoImage} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
        </ScrollView>

        <View style={styles.authCard}>
          {user ? (
            <View style={styles.authRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.authTitle} numberOfLines={1}>Signed in as {firstName}</Text>
                <Text style={styles.authSub}>You'll get personalized recommendations</Text>
              </View>
              <TouchableOpacity activeOpacity={0.9} style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={18} color="#fff" />
                <Text style={styles.authBtnText}>Log out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.authTitle}>Sign in</Text>
                <Text style={styles.authSub}>Sync your garden and track progress</Text>
              </View>
              <Link href="/auth/login" asChild>
                <TouchableOpacity activeOpacity={0.9} style={styles.loginBtn}>
                  <Ionicons name="log-in-outline" size={18} color="#051013" />
                  <Text style={[styles.authBtnText, { color: "#051013" }]}>Log in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071024" },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 24 },
  bgBlobA: { position: "absolute", top: -120, right: -120, width: 240, height: 240, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.18)" },
  bgBlobB: { position: "absolute", bottom: -140, left: -120, width: 260, height: 260, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.12)" },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 10, paddingBottom: 12 },
  brand: { color: "#e6eef3", fontSize: 26, fontWeight: "800", letterSpacing: 0.2 },
  greeting: { color: "#9fb1be", marginTop: 3, fontSize: 14 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.15)" },
  iconBtnActive: { borderColor: "rgba(34,197,94,0.4)", backgroundColor: "rgba(34,197,94,0.1)" },
  bellDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 99, backgroundColor: "#22c55e", borderWidth: 1.5, borderColor: "#071024" },
  avatar: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(34,197,94,0.18)", borderWidth: 1, borderColor: "rgba(34,197,94,0.35)" },
  avatarText: { color: "#cfe7d4", fontWeight: "800" },

  premiumChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  premiumChipActive: { backgroundColor: "rgba(34,197,94,0.15)", borderColor: "rgba(34,197,94,0.35)" },
  premiumChipText: { color: "#9fb1be", fontWeight: "700", fontSize: 12 },
  premiumChipTextActive: { color: "#22c55e" },

  freeStrip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(15,23,42,0.8)", borderWidth: 1, borderColor: "rgba(148,163,184,0.12)", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 12 },
  freeStripText: { flex: 1, color: "#9fb1be", fontSize: 12 },

  featuredRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  featuredCard: { flex: 1, minHeight: 132, borderRadius: 18, padding: 14, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)", overflow: "hidden", ...Platform.select({ android: { elevation: 3 }, ios: { shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } } }) },
  featuredTop: { flexDirection: "row", gap: 10, alignItems: "center" },
  featuredIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "rgba(34,197,94,0.95)", alignItems: "center", justifyContent: "center" },
  featuredTitle: { color: "#e6eef3", fontWeight: "800", fontSize: 15 },
  featuredSubtitle: { color: "#9fb1be", marginTop: 2, fontSize: 12, lineHeight: 16 },
  featuredBottom: { position: "absolute", bottom: 12, left: 14, right: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  featuredCta: { color: "#cbd5e1", fontWeight: "700" },
  featuredImage: { position: "absolute", right: -10, bottom: -10, width: 92, height: 92, opacity: 0.9 },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },
  sectionTitle: { color: "#cbd5e1", fontSize: 16, fontWeight: "800" },
  sectionLink: { flexDirection: "row", alignItems: "center", gap: 2, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.12)", borderWidth: 1, borderColor: "rgba(59,130,246,0.18)" },
  sectionLinkText: { color: "#93c5fd", fontWeight: "700", fontSize: 13 },

  servicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  serviceTile: { width: "48.5%", padding: 14, borderRadius: 18, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)" },
  serviceTileLocked: { borderColor: "rgba(75,85,99,0.2)", backgroundColor: "rgba(15,23,42,0.6)" },
  serviceIconWrap: { width: 36, height: 36, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  serviceIconLocked: { backgroundColor: "rgba(55,65,81,0.6)" },
  serviceLabel: { color: "#e6eef3", fontWeight: "800", fontSize: 14 },
  serviceLabelLocked: { color: "#6b7280" },
  serviceSub: { color: "#94a3b8", fontSize: 12, marginTop: 3 },
  toneMint: { backgroundColor: "rgba(34,197,94,0.9)" },
  toneBlue: { backgroundColor: "rgba(59,130,246,0.92)" },
  toneAmber: { backgroundColor: "rgba(245,158,11,0.92)" },
  toneRose: { backgroundColor: "rgba(244,63,94,0.9)" },

  promoRow: { gap: 12, paddingBottom: 6 },
  promoCard: { width: 260, minHeight: 110, borderRadius: 18, padding: 14, backgroundColor: "rgba(34,197,94,0.16)", borderWidth: 1, borderColor: "rgba(34,197,94,0.22)", overflow: "hidden" },
  promoAlt: { backgroundColor: "rgba(59,130,246,0.14)", borderColor: "rgba(59,130,246,0.20)" },
  promoTextWrap: { paddingRight: 88 },
  promoTitle: { color: "#e6eef3", fontWeight: "900", fontSize: 15 },
  promoSub: { color: "#b3c4cf", marginTop: 4, fontSize: 12, lineHeight: 16 },
  promoImage: { position: "absolute", right: 8, bottom: -8, width: 90, height: 90, opacity: 0.95 },

  authCard: { marginTop: 16, borderRadius: 18, padding: 14, backgroundColor: "rgba(15, 23, 42, 0.95)", borderWidth: 1, borderColor: "rgba(148,163,184,0.14)" },
  authRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  authTitle: { color: "#e6eef3", fontWeight: "900", fontSize: 14 },
  authSub: { color: "#9fb1be", marginTop: 3, fontSize: 12 },
  loginBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(34,197,94,0.92)" },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(239,68,68,0.92)" },
  authBtnText: { color: "#fff", fontWeight: "900" },
});
