// import React from 'react';
// import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

// export default function PlantCard({ plant, onPress }) {
//   const imageUri = plant?.image || 'https://picsum.photos/seed/plant/800/600';

//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
//       <Image source={{ uri: imageUri }} style={styles.image} />
//       <View style={styles.info}>
//         <Text style={styles.name}>{plant?.name ?? 'Unknown'}</Text>
//         <View style={styles.tags}>
//           {plant?.sunlight ? <Text style={styles.tag}>{plant.sunlight}</Text> : null}
//           {plant?.water ? <Text style={styles.tag}>{plant.water}</Text> : null}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#0b1220', borderWidth: 1, borderColor: '#12202b' },
//   image: { width: '100%', height: 180, backgroundColor: '#0f1724' },
//   info: { padding: 12 },
//   name: { color: '#e6eef3', fontWeight: '700', fontSize: 18 },
//   tags: { flexDirection: 'row', marginTop: 8 },
//   tag: { color: '#cde7da', marginRight: 10, backgroundColor: '#0b1220', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 12 }
// });


//mobile/components/PlantCard.jsx
import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND } from "../config";
export default function PlantCard({ plant, onPress }) {
  const imageUri = plant?.image || "https://picsum.photos/seed/plant/800/600";

  const difficulty = plant?.difficulty?.toLowerCase?.();
  const growthSpeed = plant?.growthSpeed?.toLowerCase?.();
  const heatTol = plant?.heatTolerance?.toLowerCase?.();
  const beginner = plant?.beginnerFriendly === true;

  return (
    <View style={styles.wrapper}>
      {/* MAIN CARD — tap goes to plant detail */}
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: imageUri }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name}>{plant?.name ?? "Unknown"}</Text>

          <View style={styles.tags}>
            {plant?.sunlight ? <Text style={styles.tag}>{plant.sunlight}</Text> : null}
            {plant?.water ? <Text style={styles.tag}>{plant.water}</Text> : null}
          </View>

          {(difficulty || growthSpeed || heatTol || beginner) && (
            <View style={styles.metaRow}>
              {beginner && (
                <View style={[styles.metaTag, styles.metaEasy]}>
                  <Ionicons name="happy-outline" size={12} color="#022c22" />
                  <Text style={styles.metaText}>Beginner</Text>
                </View>
              )}

              {difficulty && (
                <View style={styles.metaTag}>
                  <Ionicons name="leaf-outline" size={12} color="#bae6fd" />
                  <Text style={styles.metaText}>
                    {difficulty === "easy"
                      ? "Easy care"
                      : difficulty === "hard"
                        ? "Advanced"
                        : "Moderate"}
                  </Text>
                </View>
              )}

              {growthSpeed && (
                <View style={styles.metaTag}>
                  <Ionicons name="speedometer-outline" size={12} color="#facc15" />
                  <Text style={styles.metaText}>
                    {growthSpeed === "fast"
                      ? "Fast growth"
                      : growthSpeed === "slow"
                        ? "Slow growth"
                        : "Medium growth"}
                  </Text>
                </View>
              )}

              {heatTol && (
                <View style={styles.metaTag}>
                  <Ionicons name="flame-outline" size={12} color="#fb7185" />
                  <Text style={styles.metaText}>
                    {heatTol === "high"
                      ? "Heat tolerant"
                      : heatTol === "low"
                        ? "Heat sensitive"
                        : "Normal heat"}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* 💰 PRICE (read-only, subtle) */}
          {plant?.price !== undefined && (
            <Text style={styles.price}>Tk {plant.price}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* ➕ ADD TO CART BUTTON (separate touch) */}
      {plant?.price !== undefined && (
        <TouchableOpacity
          style={styles.plus}
          activeOpacity={0.8}
          onPress={async () => {
            try {
              const res = await fetch(`${BACKEND}/api/cart`);
              const data = await res.json();
              const items = Array.isArray(data.items) ? data.items : [];

              const existing = items.find((i) => i._id === plant._id);

              let updated;
              if (existing) {
                updated = items.map((i) =>
                  i._id === plant._id ? { ...i, quantity: i.quantity + 1 } : i
                );
              } else {
                updated = [
                  ...items,
                  {
                    _id: plant._id,
                    name: plant.name,
                    price: plant.price,
                    quantity: 1,
                  },
                ];
              }

              await fetch(`${BACKEND}/api/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: updated }),
              });

              Alert.alert("Added to cart", plant.name);
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Could not add to cart");
            }
          }}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginBottom: 16,
  },

  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#12202b",
  },

  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#0f1724",
  },

  info: {
    padding: 12,
  },

  name: {
    color: "#e6eef3",
    fontWeight: "700",
    fontSize: 18,
  },

  tags: {
    flexDirection: "row",
    marginTop: 8,
    flexWrap: "wrap",
  },

  tag: {
    color: "#cde7da",
    marginRight: 10,
    marginBottom: 4,
    backgroundColor: "#0b1220",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    gap: 6,
  },
  metaTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
  },
  metaEasy: {
    backgroundColor: "#4ade80",
    borderColor: "#16a34a",
  },
  metaText: {
    color: "#e5e7eb",
    fontSize: 11,
    fontWeight: "600",
  },

  /* 💰 PRICE */
  price: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#a7f3d0",
  },

  /* ➕ BUTTON */
  plus: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },

  plusText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#022c22",
  },
});
