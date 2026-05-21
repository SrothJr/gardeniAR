import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { StatusBar } from "expo-status-bar";

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
  const { colors, resolvedTheme } = useTheme();

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Seasonal picks</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Curated sets of plants to try now.</Text>
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
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() =>
              router.push({
                pathname: "/explore",
                params: { fromSeasonal: set.id },
              })
            }
          >
            <View style={[styles.cardIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="leaf-outline" size={20} color="#000" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{set.title}</Text>
              <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{set.description}</Text>
              <View style={styles.tagRow}>
                {set.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={[styles.hintBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Ionicons name="bulb-outline" size={18} color={colors.primary} />
          <Text style={[styles.hintText, { color: colors.text }]}>
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 15,
  },
  cardDesc: {
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
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  hintBox: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
  },
});

