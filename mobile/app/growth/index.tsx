import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import Svg, { Path, Line, Circle } from "react-native-svg";
import axios from "axios";
import { router } from "expo-router";

/* 🌱 STAGE IMAGES — KEEPING YOUR PATHS */
const stageImages = {
  seed: require("../../assets/images/seed.png"),
  child: require("../../assets/images/child.png"),
  medium: require("../../assets/images/medium.png"),
  adult: require("../../assets/images/adult.png"),
  fruit: require("../../assets/images/fruit.png"),
};

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

export default function Index() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [growth, setGrowth] = useState(10);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.192:5000/api/growth"
      );
      setPlants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plants:", error);
      setLoading(false);
    }
  };

  /* 📈 FANCY GROWTH GRAPH */
  const renderGrowthGraph = () => {
    const width = 320;
    const height = 140;
    const step = 10;

    const points: { x: number; y: number }[] = [];

    for (let i = 0; i <= 100; i += step) {
      const x = (i / 100) * width;
      const y =
        height -
        height * Math.pow(i / 100, 1.7) * (growth / 100);
      points.push({ x, y });
    }

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      path += ` Q ${prev.x},${prev.y} ${midX},${midY}`;
    }

    // Area under curve
    const areaPath = `${path} L ${width},${height} L 0,${height} Z`;

    return (
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Svg width={width} height={height}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <Line
              key={v}
              x1="0"
              y1={(v / 100) * height}
              x2={width}
              y2={(v / 100) * height}
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          ))}

          {/* Axes */}
          <Line
            x1="0"
            y1={height}
            x2={width}
            y2={height}
            stroke="#BDBDBD"
            strokeWidth="2"
          />
          <Line
            x1="0"
            y1="0"
            x2="0"
            y2={height}
            stroke="#BDBDBD"
            strokeWidth="2"
          />

          {/* Area fill */}
          <Path d={areaPath} fill="rgba(76, 175, 80, 0.18)" />

          {/* Curve */}
          <Path
            d={path}
            fill="none"
            stroke="#2E7D32"
            strokeWidth="4"
          />

          {/* Points */}
          {points.map((p, index) => (
            <Circle
              key={index}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#66BB6A"
              stroke="#2E7D32"
              strokeWidth="1"
            />
          ))}
        </Svg>

        <Text style={{ marginTop: 6, color: "#555", fontSize: 14 }}>
          Plant Growth Curve
        </Text>
      </View>
    );
  };

  /* 🌿 STAGE ICON LOGIC */
  const getStageIcons = () => {
    if (growth <= 15) return ["seed"];
    if (growth <= 30) return ["seed", "child"];
    if (growth <= 50) return ["seed", "child", "medium"];
    if (growth <= 75) return ["seed", "child", "medium", "adult"];
    return ["seed", "child", "medium", "adult", "fruit"];
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Plants</Text>

      <FlatList
        data={plants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/growth/PlantDetails",
                params: { plant: JSON.stringify(item) },
              })
            }
          >
            <Text style={styles.plantName}>{item.plantName}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.subTitle}>Growth Simulation</Text>

      <Slider
        value={growth}
        onValueChange={(v) => setGrowth(v[0] as number)}
        minimumValue={0}
        maximumValue={100}
        step={1}
        containerStyle={{ marginTop: 10 }}
        minimumTrackTintColor="#4CAF50"
        thumbTintColor="#2E7D32"
      />

      <Text style={styles.percent}>{Math.round(growth)}%</Text>

      {renderGrowthGraph()}

      {/* 🌱 STAGE IMAGES */}
      <View style={styles.stageRow}>
        {getStageIcons().map((stage, index) => (
          <Image
            key={index}
            source={stageImages[stage as keyof typeof stageImages]}
            style={styles.stageImage}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "600",
  },
  percent: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#E0F7FA",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
  },
  plantName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#00796B",
  },
  stageRow: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },
  stageImage: {
    width: 45,
    height: 45,
    marginRight: 10,
    resizeMode: "contain",
  },
});

