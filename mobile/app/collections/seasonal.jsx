import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SEASONAL_SETS = [
  {
    id: "easy-starters",
    title: "Easy starters",
    description: "Low-maintenance plants that forgive missed watering.",
    tags: ["Beginner", "Balcony", "Low water"],
  },
  {
    id: "fast-growers",
    title: "Fast growers",
    description: "Quick wins you can see growing in days.",
    tags: ["Kids", "Kitchen", "Fun"],
  },
  {
    id: "heat-friendly",
    title: "Heat-friendly picks",
    description: "Plants that stay happy in strong sun.",
    tags: ["Full sun", "Summer", "Resilient"],
  },
];

export default function SeasonalCollectionScreen() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#e5e7eb" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Seasonal picks</Text>
          <Text style={styles.subtitle}>Curated sets of plants to try now.</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {SEASONAL_SETS.map((set) => (
          <TouchableOpacity
            key={set.id}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/explore",
                params: { fromSeasonal: set.id },
              })
            }
          >
            <View style={styles.cardIcon}>
              <Ionicons name="leaf-outline" size={20} color="#052e16" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{set.title}</Text>
              <Text style={styles.cardDesc}>{set.description}</Text>
              <View style={styles.tagRow}>
                {set.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}

        <View style={styles.hintBox}>
          <Ionicons name="bulb-outline" size={18} color="#a5b4fc" />
          <Text style={styles.hintText}>
            These collections are just shortcuts – you can always explore all plants from the home
            screen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  title: {
    color: "#e5e7eb",
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: "#9ca3af",
    marginTop: 2,
    fontSize: 13,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    marginBottom: 12,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#4ade80",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#e5e7eb",
    fontWeight: "700",
    fontSize: 15,
  },
  cardDesc: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.18)",
  },
  tagText: {
    color: "#bbf7d0",
    fontSize: 11,
    fontWeight: "600",
  },
  hintBox: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(30,64,175,0.35)",
    borderWidth: 1,
    borderColor: "rgba(129,140,248,0.6)",
    marginTop: 8,
  },
  hintText: {
    flex: 1,
    color: "#e0e7ff",
    fontSize: 12,
  },
});

