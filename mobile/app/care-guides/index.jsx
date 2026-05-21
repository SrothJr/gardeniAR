// mobile/app/care-guides/index.jsx
import { useRouter, useFocusEffect } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import React, { useEffect, useState } from "react";
import { BACKEND } from "../../config";
import SearchBar from "../../components/SearchBar";
import PlantCard from "../../components/PlantCard";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function CareGuidesList() {
  const router = useRouter();
  const { colors } = useTheme();
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGuides = async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `${BACKEND}/api/care-guide?search=${encodeURIComponent(query)}`
        : `${BACKEND}/api/care-guide`;

      //console.log("Fetching:", url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();

      const data = json.guides || json;

      if (Array.isArray(data)) {
        setGuides(data);
      } else {
        console.error("Unexpected data format:", json);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Connection Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides(search);
  }, [search]);

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: colors.text }]}>Tracker & Care Guides</Text>
      </View>

      <SearchBar
        placeholder="Search care guides..."
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={guides}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              onPress={() => router.push(`/care-guides/${item._id}`)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>No guides found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 8,
  },
  backBtn: {
    marginRight: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
  },
});
