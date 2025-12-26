// // mobile/app/explore.jsx (working Explore screen)
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';
// import SearchBar from '../components/SearchBar';
// import PlantCard from '../components/PlantCard';
// import { BACKEND } from '../config';
// import * as Location from 'expo-location';
// import { TouchableOpacity } from "react-native";


// export default function ExplorePlants() {
//   const router = useRouter();
//   const [plants, setPlants] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);


//   const fetchPlants = async (q = '') => {
//     setLoading(true);
//     try {
//       const url = q ? `${BACKEND}/api/plants?search=${encodeURIComponent(q)}` : `${BACKEND}/api/plants`;
//       const res = await fetch(url);
//       const data = await res.json();
//       setPlants(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('fetchPlants error', err);
//       setPlants([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWeatherAlert = async () => {
//   try {
//     setWeatherLoading(true);

//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') return;

//     const loc = await Location.getCurrentPositionAsync({});
//     const { latitude, longitude } = loc.coords;

//     const res = await fetch(
//       `${BACKEND}/api/weather/alert?lat=${latitude}&lon=${longitude}`
//     );
//     const data = await res.json();

//     setWeather(data);
//   } catch (err) {
//     console.error('fetchWeatherAlert error', err);
//   } finally {
//     setWeatherLoading(false);
//   }
// };

//   useEffect(() => { fetchPlants();
//     fetchWeatherAlert();
//    }, []);

//   useEffect(() => {
//     const t = setTimeout(() => fetchPlants(search), 300);
//     return () => clearTimeout(t);
//   }, [search]);

//   return (
//     <View style={styles.page}>
//       <Text style={styles.title}>Explore Plants</Text>
//       {weather && (
//         <View style={styles.weatherCard}>
//           <Text style={styles.weatherCity}>📍 {weather.city}</Text>

//           <Text style={styles.weatherTemp}>
//             🌡 {weather.temperature}°C | 💧 {weather.humidity}%
//           </Text>

//           <Text style={styles.weatherCondition}>
//             {weather.condition}
//           </Text>

//           <Text style={styles.weatherAlert}>
//             🧠 {weather.alertSummary}
//           </Text>

//           {weather.recommendations?.map((r, i) => (
//             <Text key={i} style={styles.weatherTip}>• {r}</Text>
//           ))}
//         </View>
//       )}


//       <SearchBar value={search} onChangeText={setSearch} />

//       {loading ? (
//         <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 24 }} />
//       ) : (
//         <FlatList
//           data={plants}
//           keyExtractor={(item, index) => item._id ?? String(index)}
//           renderItem={({ item }) => (
//             <PlantCard plant={item} onPress={() => router.push(`/plant/${item._id}`)} />
//           )}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 80 }}
//           ListEmptyComponent={<Text style={styles.empty}>No plants found.</Text>}
//         />
//       )}
//       <TouchableOpacity
//       onPress={() => router.push("/share/camera")}
//       style={{
//         position: "absolute",
//         bottom: 24,
//         right: 24,
//         backgroundColor: "#22c55e",
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text style={{ fontSize: 24 }}>📸</Text>
//     </TouchableOpacity>

//     <TouchableOpacity
//   onPress={() => router.push("/cart")}
//   style={{
//     position: "absolute",
//     bottom: 100, // slightly above camera
//     right: 24,
//     backgroundColor: "#fbbf24",
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   }}
// >
//   <Text style={{ fontSize: 24 }}>🛒</Text>
// </TouchableOpacity>

//     </View>
    
//   );
  
// }

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: '#071024', padding: 16 },
//   title: { color: '#e6eef3', fontSize: 24, fontWeight: '700', marginBottom: 12 },
//   empty: { color: '#94a3b8', marginTop: 20, textAlign: 'center' },

//   weatherCard: {
//   backgroundColor: '#0f172a',
//   borderRadius: 16,
//   padding: 16,
//   marginBottom: 16,
//   borderWidth: 1,
//   borderColor: '#1e293b'
// },
// weatherCity: {
//   color: '#e5e7eb',
//   fontSize: 16,
//   fontWeight: '700'
// },
// weatherTemp: {
//   color: '#93c5fd',
//   marginTop: 4
// },
// weatherCondition: {
//   color: '#a7f3d0',
//   marginTop: 4,
//   textTransform: 'capitalize'
// },
// weatherAlert: {
//   color: '#fbbf24',
//   marginTop: 8,
//   fontWeight: '600'
// },
// weatherTip: {
//   color: '#cbd5e1',
//   marginTop: 2,
//   fontSize: 13
// },

// fab: {
//   position: "absolute",
//   bottom: 24,
//   right: 24,
//   width: 60,
//   height: 60,
//   borderRadius: 30,
//   backgroundColor: "#22c55e",
//   justifyContent: "center",
//   alignItems: "center",
//   elevation: 6, // Android shadow
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 4 },
//   shadowOpacity: 0.3,
//   shadowRadius: 4,
// },


// });


// mobile/app/explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "../components/SearchBar";
import PlantCard from "../components/PlantCard";
import { BACKEND } from "../config";
import * as Location from "expo-location";

export default function ExplorePlants() {
  const router = useRouter();

  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none"); // none | low | high
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // ---------------- FETCH PLANTS ----------------
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

  // ---------------- WEATHER ----------------
  const fetchWeatherAlert = async () => {
    try {
      setWeatherLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const res = await fetch(
        `${BACKEND}/api/weather/alert?lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("fetchWeatherAlert error", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
    fetchWeatherAlert();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPlants(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ---------------- SORTED LIST ----------------
  const sortedPlants = useMemo(() => {
    if (!Array.isArray(plants)) return [];

    if (sort === "low") {
      return [...plants].sort(
        (a, b) => (a.price ?? 0) - (b.price ?? 0)
      );
    }

    if (sort === "high") {
      return [...plants].sort(
        (a, b) => (b.price ?? 0) - (a.price ?? 0)
      );
    }

    return plants;
  }, [plants, sort]);

  // ---------------- UI ----------------
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Explore Plants</Text>

      {/* WEATHER CARD */}
      {weather && weather.weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherCity}>
            📍 {weather.weather.city}
          </Text>

          <Text style={styles.weatherTemp}>
            🌡 {weather.weather.temperature}°C | 💧 {weather.weather.humidity}%
          </Text>

          <Text style={styles.weatherCondition}>
            {weather.weather.condition}
          </Text>

          <Text style={styles.weatherAlert}>
            🧠 Weather-based gardening advice
          </Text>

          <Text style={styles.weatherTip}>
            {weather.alert}
          </Text>
        </View>
      )}

      <SearchBar value={search} onChangeText={setSearch} />

      {/* PRICE FILTER */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={[styles.sortBtn, sort === "none" && styles.sortActive]}
          onPress={() => setSort("none")}
        >
          <Text style={styles.sortText}>Default</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortBtn, sort === "low" && styles.sortActive]}
          onPress={() => setSort("low")}
        >
          <Text style={styles.sortText}>Low → High</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortBtn, sort === "high" && styles.sortActive]}
          onPress={() => setSort("high")}
        >
          <Text style={styles.sortText}>High → Low</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#22c55e"
          style={{ marginTop: 24 }}
        />
      ) : (
        <FlatList
          data={sortedPlants}
          keyExtractor={(item, index) => item._id ?? String(index)}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              onPress={() => router.push(`/plant/${item._id}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No plants found.</Text>
          }
        />
      )}

      {/* CAMERA FAB */}
      <TouchableOpacity
        onPress={() => router.push("/share/camera")}
        style={styles.cameraFab}
      >
        <Text style={{ fontSize: 24 }}>📸</Text>
      </TouchableOpacity>

      {/* CART FAB */}
      <TouchableOpacity
        onPress={() => router.push("/cart")}
        style={styles.cartFab}
      >
        <Text style={{ fontSize: 24 }}>🛒</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#071024", padding: 16 },
  title: {
    color: "#e6eef3",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  empty: { color: "#94a3b8", marginTop: 20, textAlign: "center" },

  /* WEATHER */
  weatherCard: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  weatherCity: { color: "#e5e7eb", fontWeight: "700" },
  weatherTemp: { color: "#93c5fd", marginTop: 4 },
  weatherCondition: {
    color: "#a7f3d0",
    marginTop: 4,
    textTransform: "capitalize",
  },
  weatherAlert: {
    color: "#fbbf24",
    marginTop: 8,
    fontWeight: "600",
  },
  weatherTip: { color: "#cbd5e1", fontSize: 13 },

  /* SORT */
  sortRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  sortActive: {
    backgroundColor: "#22c55e",
  },
  sortText: {
    color: "#e6eef3",
    fontSize: 12,
    fontWeight: "600",
  },

  /* FABs */
  cameraFab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#22c55e",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cartFab: {
    position: "absolute",
    bottom: 100,
    right: 24,
    backgroundColor: "#fbbf24",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
