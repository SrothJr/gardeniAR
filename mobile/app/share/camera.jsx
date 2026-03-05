

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function ShareCamera() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  let cameraRef = null;

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.hint}>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Camera permission required</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef || capturing) return;

    try {
      setCapturing(true);

      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
      });

      router.push({
        pathname: "/share/preview",
        params: { uri: photo.uri },
      });
    } catch (e) {
      console.error("Capture failed:", e);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={(ref) => {
          cameraRef = ref;
        }}
        style={{ flex: 1 }}
        facing="back"
      />

      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.btn} onPress={takePhoto}>
          {capturing ? <ActivityIndicator /> : <Text style={styles.btnText}>Capture</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#071024",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  hint: { color: "#cbd5e1" },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 40,
  },
  btnText: {
    color: "#021019",
    fontWeight: "700",
    fontSize: 16,
  },
});
