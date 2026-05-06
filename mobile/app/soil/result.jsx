import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function SoilResult() {
  const params = useLocalSearchParams();
  const router = useRouter();
  let uri = params?.uri || "";
  let analysis = null;

  try {
    analysis = params?.analysis ? JSON.parse(params.analysis) : null;
  } catch (err) {
    console.log("Failed parsing analysis JSON:", err);
  }

  return (
    <ScrollView style={styles.page}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Soil Result</Text>

      {uri ? (
        <Image source={{ uri }} style={styles.preview} />
      ) : (
        <Text style={styles.no}>No image received.</Text>
      )}

      <View style={styles.block}>
        <Text style={styles.label}>AI Analysis</Text>

        {!analysis && (
          <Text style={styles.text}>No analysis data received.</Text>
        )}

        {analysis && (
          <>
            <Text style={styles.text}>Type: {analysis.soilType}</Text>
            <Text style={styles.text}>pH: {analysis.ph}</Text>
            <Text style={styles.text}>Fertility: {analysis.fertility}</Text>
            <Text style={styles.text}>{analysis.description}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#071024" },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 12, marginTop: 40 },
  preview: { width: "100%", height: 300, borderRadius: 12, marginBottom: 12 },
  no: { color: "#cbd5e1" },
  block: {
    backgroundColor: "#071a27",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20
  },
  label: { color: "#22c55e", fontWeight: "700", marginBottom: 8, fontSize: 16 },
  text: { color: "#cbd5e1", marginBottom: 6, lineHeight: 20 },
  backBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40
  },
  backBtnText: { color: "#06150b", fontWeight: "700", fontSize: 16 },
});

