
// // growth/index.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
// } from "react-native";
// import { Slider } from "@miblanchard/react-native-slider";
// import Svg, { Path, Line, Circle, Text as SvgText } from "react-native-svg";
// import { router } from "expo-router";
// import { BACKEND } from "../../config"; // ✅ fixed

// /* 🌱 STAGE IMAGES */
// const stageImages = {
//   seed: require("../../assets/images/seed.png"),
//   child: require("../../assets/images/child.png"),
//   medium: require("../../assets/images/medium.png"),
//   adult: require("../../assets/images/adult.png"),
//   fruit: require("../../assets/images/fruit.png"),
// };

// type Stage = { stage: string; month: number; height: number };
// type Plant = { _id: string; plantName: string; growthRate?: string; spread?: string; stages?: Stage[] };

// export default function Index() {
//   const [plants, setPlants] = useState<Plant[]>([]);
//   // allPlants holds the full plants collection for name→_id lookup
//   const [allPlants, setAllPlants] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [growth, setGrowth] = useState(10);
//   const [navigating, setNavigating] = useState<string | null>(null);

//   useEffect(() => {
//     fetchPlants();
//     fetchAllPlants();
//   }, []);

//   // Fetch growth data
//   const fetchPlants = async () => {
//     try {
//       const res = await fetch(`${BACKEND}/api/growth`);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const data = await res.json();
//       setPlants(data);
//     } catch (error) {
//       console.error("Error fetching growth plants:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch ALL plants collection upfront so we can do name → _id lookup instantly
//   const fetchAllPlants = async () => {
//     try {
//       const res = await fetch(`${BACKEND}/api/plants`);
//       if (!res.ok) return;
//       const data = await res.json();
//       setAllPlants(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching all plants:", err);
//     }
//   };

//   // Find the correct plant _id from plants collection by matching name
//   const navigateToPlant = (plantName: string) => {
//     setNavigating(plantName);
//     const match = allPlants.find(
//       (p: any) => p.name?.toLowerCase().trim() === plantName.toLowerCase().trim()
//     );
//     if (match) {
//       router.push(`/plant/${match._id}`);
//     } else {
//       console.warn(`No match found in plants collection for: "${plantName}"`);
//       console.log("Available plant names:", allPlants.map((p: any) => p.name));
//     }
//     setNavigating(null);
//   };

//   /* 📈 GROWTH GRAPH WITH AXIS VALUES */
//   const renderGrowthGraph = () => {
//     const width = 320;
//     const height = 140;
//     const step = 10;
//     const leftPadding = 30;
//     const points: { x: number; y: number }[] = [];

//     for (let i = 0; i <= 100; i += step) {
//       points.push({
//         x: (i / 100) * width,
//         y: height - height * Math.pow(i / 100, 1.7) * (growth / 100),
//       });
//     }

//     let path = `M ${points[0].x + leftPadding},${points[0].y}`;
//     for (let i = 1; i < points.length; i++) {
//       const prev = points[i - 1];
//       const curr = points[i];
//       const midX = (prev.x + curr.x) / 2 + leftPadding;
//       const midY = (prev.y + curr.y) / 2;
//       path += ` Q ${prev.x + leftPadding},${prev.y} ${midX},${midY}`;
//     }
//     const areaPath = `${path} L ${width + leftPadding},${height} L ${leftPadding},${height} Z`;

//     return (
//       <View style={{ alignItems: "center", marginTop: 10 }}>
//         <Svg width={width + leftPadding + 10} height={height + 40}>
//           {[0, 25, 50, 75, 100].map((v) => {
//             const y = height - (v / 100) * height;
//             return (
//               <React.Fragment key={v}>
//                 <Line x1={leftPadding} y1={y} x2={width + leftPadding} y2={y} stroke="#E0E0E0" strokeWidth="1" />
//                 <SvgText x="5" y={y + 8} fontSize="10" fill="#FFFFFF">{v}</SvgText>
//               </React.Fragment>
//             );
//           })}
//           {[0, 20, 40, 60, 80, 100].map((v) => (
//             <SvgText key={v} x={leftPadding + (v / 100) * width - 8} y={height + 18} fontSize="10" fill="#FFFFFF">{v}</SvgText>
//           ))}
//           <Line x1={leftPadding} y1={height} x2={width + leftPadding} y2={height} stroke="#BDBDBD" strokeWidth="2" />
//           <Line x1={leftPadding} y1="0" x2={leftPadding} y2={height} stroke="#BDBDBD" strokeWidth="2" />
//           <Path d={areaPath} fill="rgba(106, 110, 128, 0.18)" />
//           <Path d={path} fill="none" stroke="#0b3b0e" strokeWidth="4" />
//           {points.map((p, index) => (
//             <Circle key={index} cx={p.x + leftPadding} cy={p.y} r="4" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
//           ))}
//         </Svg>
//         <Text style={{ marginTop: 6, color: "#bbb", fontSize: 14 }}>Growth (%) vs Time (Days)</Text>
//       </View>
//     );
//   };

//   const getStageIcons = () => {
//     if (growth <= 15) return ["seed"];
//     if (growth <= 30) return ["seed", "child"];
//     if (growth <= 50) return ["seed", "child", "medium"];
//     if (growth <= 75) return ["seed", "child", "medium", "adult"];
//     return ["seed", "child", "medium", "adult", "fruit"];
//   };

//   if (loading) {
//     return <View style={styles.center}><ActivityIndicator size="large" color="#033204" /></View>;
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       <Text style={styles.title}>My Plants</Text>

//       {plants.map((item) => (
//         <TouchableOpacity
//           key={item._id}
//           style={[styles.card, navigating === item.plantName && { opacity: 0.6 }]}
//           onPress={() => navigateToPlant(item.plantName)}
//           activeOpacity={0.75}
//         >
//           <Text style={styles.plantName}>{item.plantName}</Text>
//           <Text style={styles.cardArrow}>›</Text>
//         </TouchableOpacity>
//       ))}

//       <Text style={styles.subTitle}>Growth Simulation</Text>

//       <Slider
//         value={growth}
//         onValueChange={(v) => setGrowth(v[0] as number)}
//         minimumValue={0} maximumValue={100} step={1}
//         containerStyle={{ marginTop: 10 }}
//         minimumTrackTintColor="#114072"
//         thumbTintColor="#2e4f7d"
//       />

//       <Text style={styles.percent}>{Math.round(growth)}%</Text>

//       {renderGrowthGraph()}

//       <View style={styles.stageRow}>
//         {getStageIcons().map((stage, index) => (
//           <Image key={index} source={stageImages[stage as keyof typeof stageImages]} style={styles.stageImage} />
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#071024" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#FFFFFF" },
//   subTitle: { fontSize: 18, marginTop: 20, fontWeight: "600", color: "#FFFFFF" },
//   percent: { textAlign: "center", fontSize: 16, marginTop: 4, color: "#555" },
//   card: { backgroundColor: "#0e1c37", padding: 16, marginBottom: 12, borderRadius: 12, elevation: 3, flexDirection: "row", alignItems: "center" },
//   plantName: { fontSize: 20, fontWeight: "600", color: "#f7f6fb", flex: 1 },
//   cardArrow: { fontSize: 22, color: "#22c55e", fontWeight: "300" },
//   stageRow: { flexDirection: "row", marginTop: 15, alignItems: "center" },
//   stageImage: { width: 65, height: 45, marginRight: 10, resizeMode: "contain" },
// });



// growth/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import Svg, { Path, Line, Circle, Text as SvgText } from "react-native-svg";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND } from "../../config";
import { usePremium } from "../../hooks/usePremium";

/* 🌱 STAGE IMAGES */
const stageImages = {
  seed: require("../../assets/images/seed.png"),
  child: require("../../assets/images/child.png"),
  medium: require("../../assets/images/medium.png"),
  adult: require("../../assets/images/adult.png"),
  fruit: require("../../assets/images/fruit.png"),
};

type Stage = { stage: string; month: number; height: number };
type Plant = { _id: string; plantName: string; growthRate?: string; spread?: string; stages?: Stage[] };

export default function Index() {
  const { isPremium, loaded } = usePremium();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [allPlants, setAllPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [growth, setGrowth] = useState(10);
  const [navigating, setNavigating] = useState<string | null>(null);

  useEffect(() => {
    fetchPlants();
    fetchAllPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/growth`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setPlants(data);
    } catch (error) {
      console.error("Error fetching growth plants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlants = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/plants`);
      if (!res.ok) return;
      const data = await res.json();
      setAllPlants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching all plants:", err);
    }
  };

  const navigateToPlant = (plantName: string) => {
    setNavigating(plantName);
    const match = allPlants.find(
      (p: any) => p.name?.toLowerCase().trim() === plantName.toLowerCase().trim()
    );
    if (match) {
      router.push(`/plant/${match._id}`);
    } else {
      console.warn(`No match found in plants collection for: "${plantName}"`);
    }
    setNavigating(null);
  };

  const renderGrowthGraph = () => {
    const width = 320;
    const height = 140;
    const step = 10;
    const leftPadding = 30;
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i <= 100; i += step) {
      points.push({
        x: (i / 100) * width,
        y: height - height * Math.pow(i / 100, 1.7) * (growth / 100),
      });
    }

    let path = `M ${points[0].x + leftPadding},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2 + leftPadding;
      const midY = (prev.y + curr.y) / 2;
      path += ` Q ${prev.x + leftPadding},${prev.y} ${midX},${midY}`;
    }
    const areaPath = `${path} L ${width + leftPadding},${height} L ${leftPadding},${height} Z`;

    return (
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Svg width={width + leftPadding + 10} height={height + 40}>
          {[0, 25, 50, 75, 100].map((v) => {
            const y = height - (v / 100) * height;
            return (
              <React.Fragment key={v}>
                <Line x1={leftPadding} y1={y} x2={width + leftPadding} y2={y} stroke="#E0E0E0" strokeWidth="1" />
                <SvgText x="5" y={y + 8} fontSize="10" fill="#FFFFFF">{v}</SvgText>
              </React.Fragment>
            );
          })}
          {[0, 20, 40, 60, 80, 100].map((v) => (
            <SvgText key={v} x={leftPadding + (v / 100) * width - 8} y={height + 18} fontSize="10" fill="#FFFFFF">{v}</SvgText>
          ))}
          <Line x1={leftPadding} y1={height} x2={width + leftPadding} y2={height} stroke="#BDBDBD" strokeWidth="2" />
          <Line x1={leftPadding} y1="0" x2={leftPadding} y2={height} stroke="#BDBDBD" strokeWidth="2" />
          <Path d={areaPath} fill="rgba(106, 110, 128, 0.18)" />
          <Path d={path} fill="none" stroke="#0b3b0e" strokeWidth="4" />
          {points.map((p, index) => (
            <Circle key={index} cx={p.x + leftPadding} cy={p.y} r="4" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
          ))}
        </Svg>
        <Text style={{ marginTop: 6, color: "#bbb", fontSize: 14 }}>Growth (%) vs Time (Days)</Text>
      </View>
    );
  };

  const getStageIcons = () => {
    if (growth <= 15) return ["seed"];
    if (growth <= 30) return ["seed", "child"];
    if (growth <= 50) return ["seed", "child", "medium"];
    if (growth <= 75) return ["seed", "child", "medium", "adult"];
    return ["seed", "child", "medium", "adult", "fruit"];
  };

  // --- Loading states ---
  if (!loaded || loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#22c55e" /></View>;
  }

  // --- Premium gate ---
  if (!isPremium) {
    return (
      <View style={styles.gateContainer}>
        <View style={styles.blobA} />
        <View style={styles.blobB} />
        <View style={styles.gateCard}>
          <View style={styles.gateLockWrap}>
            <Ionicons name="lock-closed" size={32} color="#22c55e" />
          </View>
          <Text style={styles.gateTitle}>Premium Feature</Text>
          <Text style={styles.gateSub}>
            Plant Growth Tracking is available exclusively for Premium subscribers.
          </Text>
          <View style={styles.gateFeatureList}>
            {["Track growth milestones & stages", "Interactive growth graph", "Plant-by-plant timeline"].map((f, i) => (
              <View key={i} style={styles.gateFeatureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.gateFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.gateBtn} onPress={() => router.push("/premium")} activeOpacity={0.88}>
            <Ionicons name="rocket-outline" size={18} color="#051013" />
            <Text style={styles.gateBtnText}>Upgrade to Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.gateBack}>
            <Text style={styles.gateBackText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>My Plants</Text>

      {plants.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={[styles.card, navigating === item.plantName && { opacity: 0.6 }]}
          onPress={() => navigateToPlant(item.plantName)}
          activeOpacity={0.75}
        >
          <Text style={styles.plantName}>{item.plantName}</Text>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subTitle}>Growth Simulation</Text>

      <Slider
        value={growth}
        onValueChange={(v) => setGrowth(v[0] as number)}
        minimumValue={0} maximumValue={100} step={1}
        containerStyle={{ marginTop: 10 }}
        minimumTrackTintColor="#114072"
        thumbTintColor="#2e4f7d"
      />

      <Text style={styles.percent}>{Math.round(growth)}%</Text>

      {renderGrowthGraph()}

      <View style={styles.stageRow}>
        {getStageIcons().map((stage, index) => (
          <Image key={index} source={stageImages[stage as keyof typeof stageImages]} style={styles.stageImage} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#071024" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#071024" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#FFFFFF" },
  subTitle: { fontSize: 18, marginTop: 20, fontWeight: "600", color: "#FFFFFF" },
  percent: { textAlign: "center", fontSize: 16, marginTop: 4, color: "#555" },
  card: { backgroundColor: "#0e1c37", padding: 16, marginBottom: 12, borderRadius: 12, elevation: 3, flexDirection: "row", alignItems: "center" },
  plantName: { fontSize: 20, fontWeight: "600", color: "#f7f6fb", flex: 1 },
  cardArrow: { fontSize: 22, color: "#22c55e", fontWeight: "300" },
  stageRow: { flexDirection: "row", marginTop: 15, alignItems: "center" },
  stageImage: { width: 65, height: 45, marginRight: 10, resizeMode: "contain" },

  // Gate styles
  gateContainer: { flex: 1, backgroundColor: "#071024", justifyContent: "center", alignItems: "center", padding: 24 },
  blobA: { position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.1)" },
  blobB: { position: "absolute", bottom: -100, left: -80, width: 240, height: 240, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.07)" },
  gateCard: { backgroundColor: "rgba(15,23,42,0.98)", borderWidth: 1, borderColor: "rgba(148,163,184,0.16)", borderRadius: 24, padding: 28, width: "100%", alignItems: "center" },
  gateLockWrap: { width: 68, height: 68, borderRadius: 22, backgroundColor: "rgba(34,197,94,0.12)", borderWidth: 1, borderColor: "rgba(34,197,94,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  gateTitle: { fontSize: 22, fontWeight: "900", color: "#f0fdf4", marginBottom: 8 },
  gateSub: { color: "#9fb1be", textAlign: "center", fontSize: 14, lineHeight: 20, marginBottom: 20 },
  gateFeatureList: { width: "100%", gap: 10, marginBottom: 24 },
  gateFeatureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  gateFeatureText: { color: "#cbd5e1", fontSize: 14 },
  gateBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#22c55e", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, width: "100%", justifyContent: "center", marginBottom: 12 },
  gateBtnText: { color: "#051013", fontWeight: "900", fontSize: 15 },
  gateBack: { paddingVertical: 8 },
  gateBackText: { color: "#4b5563", fontSize: 13 },
});