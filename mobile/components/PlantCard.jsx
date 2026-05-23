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
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function PlantCard({ plant, onPress }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const imageUri = plant?.image || "https://picsum.photos/seed/plant/800/600";

  const difficulty = plant?.difficulty?.toLowerCase?.();
  const growthSpeed = plant?.growthSpeed?.toLowerCase?.();
  const heatTol = plant?.heatTolerance?.toLowerCase?.();
  const beginner = plant?.beginnerFriendly === true;

  const translateTag = (val) => {
    if (!val) return null;
    const lower = val.toLowerCase();
    if (lower.includes("full")) return t("plant.full");
    if (lower.includes("partial")) return t("plant.partial");
    if (lower.includes("shade")) return t("plant.shade");
    if (lower.includes("low")) return t("plant.low");
    if (lower.includes("medium")) return t("plant.medium");
    if (lower.includes("high")) return t("plant.high");
    return val;
  };

  const translateDB = (val) => {
    if (!val) return val;
    const key = val.toLowerCase().replace(/ /g, "_");
    const trans = t(`db.${key}`);
    return trans === `db.${key}` ? val : trans;
  };

  return (
    <View style={styles.wrapper}>
      {/* MAIN CARD — tap goes to plant detail */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: imageUri }} style={[styles.image, { backgroundColor: colors.background }]} />

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{translateDB(plant?.name) ?? t("plant.unknown")}</Text>

          <View style={styles.tags}>
            {plant?.sunlight ? <Text style={[styles.tag, { color: colors.primary, backgroundColor: colors.background }]}>{translateTag(plant.sunlight)}</Text> : null}
            {plant?.water ? <Text style={[styles.tag, { color: colors.primary, backgroundColor: colors.background }]}>{translateTag(plant.water)}</Text> : null}
          </View>

          {(difficulty || growthSpeed || heatTol || beginner) && (
            <View style={styles.metaRow}>
              {beginner && (
                <View style={[styles.metaTag, styles.metaEasy]}>
                  <Ionicons name="happy-outline" size={12} color="#022c22" />
                  <Text style={styles.metaText}>{t("plant.beginner")}</Text>
                </View>
              )}

              {difficulty && (
                <View style={[styles.metaTag, { backgroundColor: colors.background + '80', borderColor: colors.border }]}>
                  <Ionicons name="leaf-outline" size={12} color={colors.primary} />
                  <Text style={[styles.metaText, { color: colors.text }]}>
                    {difficulty === "easy"
                      ? t("plant.easy_care")
                      : difficulty === "hard"
                        ? t("plant.advanced_care")
                        : t("plant.moderate_care")}
                  </Text>
                </View>
              )}

              {growthSpeed && (
                <View style={[styles.metaTag, { backgroundColor: colors.background + '80', borderColor: colors.border }]}>
                  <Ionicons name="speedometer-outline" size={12} color="#facc15" />
                  <Text style={[styles.metaText, { color: colors.text }]}>
                    {growthSpeed === "fast"
                      ? t("plant.fast_growth")
                      : growthSpeed === "slow"
                        ? t("plant.slow_growth")
                        : t("plant.medium_growth")}
                  </Text>
                </View>
              )}

              {heatTol && (
                <View style={[styles.metaTag, { backgroundColor: colors.background + '80', borderColor: colors.border }]}>
                  <Ionicons name="flame-outline" size={12} color="#fb7185" />
                  <Text style={[styles.metaText, { color: colors.text }]}>
                    {heatTol === "high"
                      ? t("plant.heat_tolerant")
                      : heatTol === "low"
                        ? t("plant.heat_sensitive")
                        : t("plant.normal_heat")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* 💰 PRICE (read-only, subtle) */}
          {plant?.price !== undefined && (
            <Text style={[styles.price, { color: colors.primary }]}>{t("plant.price_tk", { price: plant.price })}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* ➕ ADD TO CART BUTTON (separate touch) */}
      {plant?.price !== undefined && (
        <TouchableOpacity
          style={[styles.plus, { backgroundColor: colors.primary }]}
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

              Alert.alert(t("plant.added_to_cart"), plant.name);
            } catch (err) {
              console.error(err);
              Alert.alert(t("plant.error"), t("plant.could_not_add_to_cart"));
            }
          }}
        >
          <Text style={[styles.plusText, { color: '#000' }]}>+</Text>
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
    borderWidth: 1,
  },

  image: {
    width: "100%",
    height: 180,
  },

  info: {
    padding: 12,
  },

  name: {
    fontWeight: "700",
    fontSize: 18,
  },

  tags: {
    flexDirection: "row",
    marginTop: 8,
    flexWrap: "wrap",
  },

  tag: {
    marginRight: 10,
    marginBottom: 4,
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
    borderWidth: 1,
  },
  metaEasy: {
    backgroundColor: "#4ade80",
    borderColor: "#16a34a",
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
  },

  /* 💰 PRICE */
  price: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
  },

  /* ➕ BUTTON */
  plus: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  plusText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
