import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { nBACKEND } from "../../config"; // Changed to BACKEND
import SearchBar from "../../components/SearchBar";
import PlantCard from "../../components/PlantCard";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";

export default function CareGuidesList() {
  const router = useRouter();
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGuides = async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `${nBACKEND}/api/care-guide?search=${encodeURIComponent(query)}`
        : `${nBACKEND}/api/care-guide`;

      //console.log("Fetching:", url); // Check your terminal for this log!

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();

      // Handle { guides: [...] } OR [...]
      const data = json.guides || json;

      if (Array.isArray(data)) {
        setGuides(data);
      } else {
        console.error("Unexpected data format:", json);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Connection Error", error.message); // Show error on phone
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once on mount (and when search changes)
    // The previous code fetched twice.
    fetchGuides(search);
  }, [search]);

  return (
    <View style={styles.page}>
      <Text style={styles.header}>Tracker & Care Guides</Text>

      <SearchBar value={search} onChangeText={setSearch} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#22c55e"
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
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No guides found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#071024",
    padding: 16,
  },
  header: {
    color: "#e6eef3",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 30,
  },
});
