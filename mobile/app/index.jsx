// mobile/app/index.jsx
import { Link, Redirect } from "expo-router";
import { View, StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GardeniAR</Text>
      <Link href="/care-guides/" style={styles.link}>
        <Text style={styles.linkText}>Water & Fertilizer Tracker</Text>
      </Link>
      <Link href="/explore" style={styles.link}>
        <Text style={styles.linkText}>Explore Plants</Text>
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071024",
    gap: 20,
  },
  title: {
    fontSize: 32,
    color: "#22c55e",
    marginBottom: 40,
    fontWeight: "bold",
  },
  link: {
    padding: 15,
    backgroundColor: "#10b981",
    borderRadius: 10,
    width: 250,
    textAlign: "center",
  },
  linkText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
