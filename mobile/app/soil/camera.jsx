

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { BACKEND } from "../../config";

export default function SoilCamera() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

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

  const captureAndAnalyze = async () => {
    if (!cameraRef || loading) {
      Alert.alert("Camera not ready", "Please wait a moment.");
      return;
    }

    try {
      setLoading(true);


      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error("No photo URI");
      }

  
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1024 } }],
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );


      const form = new FormData();
      form.append("image", {
        uri: resized.uri,
        name: "soil.jpg",
        type: "image/jpeg",
      });

 
      const resp = await fetch(`${BACKEND}/api/soil/analyze-file`, {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        throw new Error(`Server error ${resp.status}`);
      }

      const json = await resp.json();


      router.push({
        pathname: "/soil/result",
        params: {
          uri: resized.uri,
          analysis: JSON.stringify(json.analysis ?? json),
        },
      });
    } catch (err) {
      console.error("captureAndAnalyze error:", err);
      Alert.alert("Error", "Could not capture or analyze soil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={(ref) => {
          cameraRef = ref;
        }}
        style={styles.camera}
        facing="back"
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.btnSmall}
          onPress={captureAndAnalyze}
          disabled={loading}
        >
          <Text style={styles.btnTextSmall}>
            {loading ? "Analyzing..." : "Scan Soil"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnSmall, styles.outline]}
          onPress={() => router.back()}
        >
          <Text style={styles.outlineText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071024" },
  camera: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#071024",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  hint: { color: "#cbd5e1" },
  btn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#10b981",
    borderRadius: 12,
  },
  btnText: { color: "#021019", fontWeight: "700" },
  controls: {
    position: "absolute",
    bottom: 28,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnSmall: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#10b981",
    borderRadius: 999,
  },
  btnTextSmall: { color: "#021019", fontWeight: "700" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9aa6b2",
  },
  outlineText: { color: "#cbd5e1" },
});
