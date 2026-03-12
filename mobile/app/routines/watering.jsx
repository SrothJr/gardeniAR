import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const STEPS = [
  {
    id: 1,
    title: "Morning check",
    body: "Lightly press the soil 2–3 cm deep. If it feels dry, today is a watering day.",
    icon: "sunny-outline",
  },
  {
    id: 2,
    title: "Water slowly",
    body: "Pour until water just starts to seep from the drainage holes, then stop.",
    icon: "water-outline",
  },
  {
    id: 3,
    title: "Leaf check",
    body: "Yellow, mushy leaves? Too much water. Crispy leaves? Increase frequency slightly.",
    icon: "leaf-outline",
  },
  {
    id: 4,
    title: "Weekly deep soak",
    body: "Once a week, give a deeper watering and let the pot fully drain.",
    icon: "calendar-outline",
  },
];

export default function WateringRoutineScreen() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#e5e7eb" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Watering routine</Text>
          <Text style={styles.subtitle}>A simple 4-step pattern you can follow.</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {STEPS.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={18} color="#022c22" />
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.primaryBtn}
            onPress={() => router.push("/explore")}
          >
            <Ionicons name="list-outline" size={18} color="#022c22" />
            <Text style={styles.primaryText}>Open plant guides</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.secondaryBtn}
            onPress={() => router.push("/checklist")}
          >
            <Ionicons name="checkbox-outline" size={18} color="#e5e7eb" />
            <Text style={styles.secondaryText}>Add to tasks</Text>
          </TouchableOpacity>
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
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.5)",
  },
  stepNumber: {
    color: "#bbf7d0",
    fontWeight: "800",
    fontSize: 13,
  },
  stepCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  stepIcon: {
    width: 26,
    height: 26,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ade80",
  },
  stepTitle: {
    color: "#e5e7eb",
    fontWeight: "700",
    fontSize: 14,
  },
  stepBody: {
    color: "#9ca3af",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#4ade80",
  },
  primaryText: {
    color: "#052e16",
    fontWeight: "800",
    fontSize: 13,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,1)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
  },
  secondaryText: {
    color: "#e5e7eb",
    fontWeight: "700",
    fontSize: 13,
  },
});

