import { Link, useRouter, useFocusEffect } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      checkUser();
    }, [])
  );

  const checkUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GardeniAR</Text>
      <Link href="/care-guides/" style={styles.link}>
        <Text style={styles.linkText}>Water & Fertilizer Tracker</Text>
      </Link>
      <Link href="/explore" style={styles.link}>
        <Text style={styles.linkText}>Explore Plants</Text>
      </Link>
      <Link href="/share/camera" style={styles.shareLink}>
        <Text style={styles.shareText}>Share Your Garden</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071024",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    color: "#22c55e",
    fontWeight: "bold",
    marginBottom: 10,
  },
  welcome: {
    color: "#a0aec0",
    fontSize: 18,
  },
  menu: {
    gap: 15,
    width: "100%",
    alignItems: "center",
  },
  footer: {
    marginBottom: 40,
    alignItems: "center",
    width: "100%",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#10b981",
    borderRadius: 12,
    width: "100%",
    maxWidth: 300,
    justifyContent: "flex-start",
    paddingLeft: 30,
  },
  icon: {
    marginRight: 15,
  },
  linkText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  shareLink: {
  padding: 15,
  backgroundColor: "#10b981",
  borderRadius: 10,
  width: 250,
  
},
shareText: {
  color: "#071024",
  fontWeight: "bold",
  fontSize: 16,
  textAlign: "center",
},

});
