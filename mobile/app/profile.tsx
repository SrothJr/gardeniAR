import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../config";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setName(userData.name || "");
        setCity(userData.location?.city || "");
        setProfilePicture(userData.profilePicture || "");
      }
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your gallery to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfilePicture(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          name,
          location: { ...user.location, city },
          profilePicture,
        }),
      });

      const updatedUser = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", updatedUser.message || "Failed to update profile.");
      }
    } catch (e) {
      console.error("Update profile error:", e);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", data.message || "Failed to change password.");
      }
    } catch (e) {
      console.error("Change password error:", e);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Please log in to view your profile.</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push("/auth/login")}>
            <Text style={styles.loginBtnText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#e6eef3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.avatar} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.placeholderText}>
                    {name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.email}>{user.email}</Text>
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>✨ Premium Member</Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#64748b"
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Your City"
            placeholderTextColor="#64748b"
          />

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#051013" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#64748b"
            secureTextEntry
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#64748b"
            secureTextEntry
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#64748b"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: "#334155" }, changingPassword && { opacity: 0.7 }]}
            onPress={handleChangePassword}
            disabled={changingPassword}
          >
            {changingPassword ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.saveBtnText, { color: "#fff" }]}>Update Password</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Account Info</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joined on</Text>
              <Text style={styles.infoValue}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Subscription</Text>
              <Text style={[styles.infoValue, user.isPremium && { color: "#22c55e", fontWeight: "800" }]}>
                {user.isPremium ? "Premium Plan" : "Free Plan"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071024" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#071024" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: "#e6eef3", fontSize: 18, fontWeight: "800" },
  backBtn: { padding: 8 },
  scroll: { padding: 20 },
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatarContainer: { position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#22c55e" },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#334155",
  },
  placeholderText: { color: "#f8fafc", fontSize: 36, fontWeight: "900" },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#22c55e",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#071024",
  },
  email: { color: "#94a3b8", fontSize: 14, marginTop: 12 },
  premiumBadge: {
    marginTop: 10,
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  premiumText: { color: "#22c55e", fontSize: 12, fontWeight: "800" },
  form: { marginBottom: 32 },
  sectionTitle: { color: "#e6eef3", fontSize: 18, fontWeight: "800", marginBottom: 20, marginTop: 10 },
  label: { color: "#94a3b8", fontSize: 14, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    color: "#e6eef3",
    fontSize: 15,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: "#051013", fontWeight: "900", fontSize: 16 },
  infoSection: { marginBottom: 40 },
  infoTitle: { color: "#e6eef3", fontSize: 16, fontWeight: "800", marginBottom: 12 },
  infoCard: { backgroundColor: "#0f172a", borderRadius: 16, borderWidth: 1, borderColor: "#1e293b", overflow: "hidden" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  infoLabel: { color: "#94a3b8", fontSize: 14 },
  infoValue: { color: "#e6eef3", fontSize: 14, fontWeight: "600" },
  errorText: { color: "#94a3b8", fontSize: 16, marginBottom: 20 },
  loginBtn: { backgroundColor: "#22c55e", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: "#051013", fontWeight: "800" },
});
