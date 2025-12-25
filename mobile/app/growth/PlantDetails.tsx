// import React from "react";
// import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
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

//   if (!plant) return <Text style={{ padding: 20 }}>No plant provided</Text>;

//   return (
//     <ScrollView style={styles.container}>
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
//               {item.stage} - Month {item.month} - Height {item.height} cm
//             </Text>
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 30 }}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#F0F8FF" },
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
//   infoLabel: { fontSize: 18, fontWeight: "600", color: "#333" },
//   infoValue: { fontSize: 18, fontWeight: "400", color: "#555" },
//   subtitle: { fontSize: 24, fontWeight: "bold", marginTop: 25, marginBottom: 15 },
//   stageCard: {
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   stageText: { fontSize: 16, fontWeight: "500", color: "#333" },
// });


import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";

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

// Assign colors based on stage type
const stageColors: Record<string, string> = {
  Seed: "#FFECB3",
  Child: "#C8E6C9",
  Medium: "#BBDEFB",
  Adult: "#FFE0B2",
  Flower: "#F8BBD0",
  Fruit: "#FFCDD2",
};

export default function PlantDetails() {
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
    return <Text style={{ padding: 20 }}>No plant provided</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plant.plantName}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Growth Rate:</Text>
        <Text style={styles.infoValue}>{plant.growthRate || "N/A"}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Spread:</Text>
        <Text style={styles.infoValue}>{plant.spread || "N/A"}</Text>
      </View>

      <Text style={styles.subtitle}>Growth Stages:</Text>

      <FlatList
        data={plant.stages || []}
        keyExtractor={(item) => item.stage}
        renderItem={({ item }) => (
          <View
            style={[
              styles.stageCard,
              { backgroundColor: stageColors[item.stage] || "#E0E0E0" },
            ]}
          >
            <Text style={styles.stageText}>
              {item.stage} – Month {item.month} – Height {item.height} cm
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 15,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "400",
    color: "#555",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },
  stageCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  stageText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
