// import React from "react";
// import { View, Text, StyleSheet, FlatList } from "react-native";
// import { useLocalSearchParams } from "expo-router";

// type Stage = {
//   stage: string;
//   month: number;
//   height: number;
// };

// type Plant = {
//   _id: string;
//   plantName: string;
//   growthRate?: string;
//   spread?: string;
//   stages?: Stage[];
// };

// // Assign colors based on stage type
// const stageColors: Record<string, string> = {
//   Seed: "#FFECB3",
//   Child: "#C8E6C9",
//   Medium: "#BBDEFB",
//   Adult: "#FFE0B2",
//   Flower: "#F8BBD0",
//   Fruit: "#FFCDD2",
// };

// export default function PlantDetails() {
//   const params = useLocalSearchParams<{ plant?: string }>();
//   let plant: Plant | undefined;

//   if (params.plant) {
//     try {
//       plant = JSON.parse(params.plant as string) as Plant;
//     } catch (err) {
//       console.warn("Failed to parse `plant` param:", err);
//     }
//   }

//   if (!plant) {
//     return <Text style={{ padding: 20 }}>No plant provided</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{plant.plantName}</Text>

//       <View style={styles.infoContainer}>
//         <Text style={styles.infoLabel}>Growth Rate:</Text>
//         <Text style={styles.infoValue}>{plant.growthRate || "N/A"}</Text>
//       </View>

//       <View style={styles.infoContainer}>
//         <Text style={styles.infoLabel}>Spread:</Text>
//         <Text style={styles.infoValue}>{plant.spread || "N/A"}</Text>
//       </View>

//       <Text style={styles.subtitle}>Growth Stages:</Text>

//       <FlatList
//         data={plant.stages || []}
//         keyExtractor={(item) => item.stage}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.stageCard,
//               { backgroundColor: stageColors[item.stage] || "#E0E0E0" },
//             ]}
//           >
//             <Text style={styles.stageText}>
//               {item.stage} – Month {item.month} – Height {item.height} cm
//             </Text>
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 30 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F0F8FF",
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   infoContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//     paddingHorizontal: 10,
//   },
//   infoLabel: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//   },
//   infoValue: {
//     fontSize: 18,
//     fontWeight: "400",
//     color: "#555",
//   },
//   subtitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginTop: 25,
//     marginBottom: 15,
//   },
//   stageCard: {
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   stageText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//   },
// });

// mobile/app/growth/PlantDetails.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Stage = {
  stage: string;
  month: number;
  height: number;
};

type Plant = {
  _id: string;
  plantName: string;
  growthRate?: string;
  spread?: string;
  stages?: Stage[];
};

const stageColors: Record<string, string> = {
  Seed:   "#0e1c37",
  Child:  "#0e1c37",
  Medium: "#0e1c37",
  Adult:  "#0e1c37",
  Flower: "#0e1c37",
  Fruit:  "#0e1c37",
};

const stageEmoji: Record<string, string> = {
  Seed: "🌰", Child: "🌱", Medium: "🪴", Adult: "🌿", Flower: "🌸", Fruit: "🍅",
};

export default function PlantDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ plant?: string }>();

  let plant: Plant | undefined;
  if (params.plant) {
    try {
      plant = JSON.parse(params.plant as string) as Plant;
    } catch (err) {
      console.warn("Failed to parse `plant` param:", err);
    }
  }

  if (!plant) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No plant provided</Text>
      </View>
    );
  }

  const stages = plant.stages || [];

  return (
    // ✅ ScrollView only — no FlatList inside
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 48 }}>

      {/* Back */}
      <View style={styles.backRow}>
        <Ionicons name="arrow-back" size={20} color="#22c55e" onPress={() => router.back()} />
        <Text style={styles.backText} onPress={() => router.back()}>Back</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{plant.plantName}</Text>

      {/* Info row */}
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Growth Rate</Text>
          <Text style={styles.infoValue}>{plant.growthRate || "N/A"}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Spread</Text>
          <Text style={styles.infoValue}>{plant.spread || "N/A"}</Text>
        </View>
      </View>

      {/* Growth stages — .map() instead of FlatList */}
      <Text style={styles.subtitle}>Growth Stages:</Text>
      {stages.map((item) => (
        <View
          key={item.stage}
          style={[styles.stageCard, { backgroundColor: stageColors[item.stage] || "#0e1c37" }]}
        >
          <Text style={styles.stageEmoji}>{stageEmoji[item.stage] || "🌿"}</Text>
          <View style={styles.stageInfo}>
            <Text style={styles.stageText}>{item.stage}</Text>
            <Text style={styles.stageMeta}>Month {item.month} · {item.height} cm</Text>
          </View>
        </View>
      ))}

      {stages.length === 0 && (
        <Text style={styles.empty}>No stage data available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#071024" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#071024" },
  errorText: { color: "#94a3b8", fontSize: 15 },

  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { color: "#22c55e", fontSize: 14, fontWeight: "600" },

  title: { fontSize: 28, fontWeight: "bold", color: "#fafafd", marginBottom: 20, textAlign: "center" },

  infoRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  infoCard: {
    flex: 1, backgroundColor: "#0f172a", borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: "#1e293b", alignItems: "center",
  },
  infoLabel: { fontSize: 11, color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
  infoValue: { fontSize: 18, fontWeight: "700", color: "#e2e8f0", marginTop: 4 },

  subtitle: { fontSize: 18, fontWeight: "700", color: "#e2e8f0", marginBottom: 12 },

  stageCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    padding: 16, marginBottom: 10, borderRadius: 12,
    borderWidth: 1, borderColor: "#1e293b",
    elevation: 3,
  },
  stageEmoji: { fontSize: 28 },
  stageInfo: { flex: 1 },
  stageText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  stageMeta: { fontSize: 13, color: "#64748b", marginTop: 2 },

  empty: { color: "#475569", textAlign: "center", marginTop: 20, fontStyle: "italic" },
});
