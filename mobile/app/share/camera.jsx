
// //share/camera.jsx
// import React, { useState, useRef } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useRouter } from "expo-router";

// export default function ShareCamera() {
//   const router = useRouter();
//   const [permission, requestPermission] = useCameraPermissions();
//   const [capturing, setCapturing] = useState(false);

//   let cameraRef = null;

//   if (!permission) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.hint}>Checking camera permission…</Text>
//       </View>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.title}>Camera permission required</Text>
//         <TouchableOpacity style={styles.btn} onPress={requestPermission}>
//           <Text style={styles.btnText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const takePhoto = async () => {
//     if (!cameraRef || capturing) return;

//     try {
//       setCapturing(true);

//       const photo = await cameraRef.takePictureAsync({
//         quality: 0.8,
//       });

//       router.push({
//         pathname: "/share/preview",
//         params: { uri: photo.uri },
//       });
//     } catch (e) {
//       console.error("Capture failed:", e);
//     } finally {
//       setCapturing(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <CameraView
//         ref={(ref) => {
//           cameraRef = ref;
//         }}
//         style={{ flex: 1 }}
//         facing="back"
//       />

//       <View style={styles.captureContainer}>
//         <TouchableOpacity style={styles.btn} onPress={takePhoto}>
//           {capturing ? <ActivityIndicator /> : <Text style={styles.btnText}>Capture</Text>}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     backgroundColor: "#071024",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
//   hint: { color: "#cbd5e1" },
//   captureContainer: {
//     position: "absolute",
//     bottom: 40,
//     width: "100%",
//     alignItems: "center",
//   },
//   btn: {
//     backgroundColor: "#22c55e",
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 40,
//   },
//   btnText: {
//     color: "#021019",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });


// share/camera.jsx
import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePremium, FREE_SHARE_LIMIT } from "../../hooks/usePremium";

export default function ShareCamera() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { isPremium, shareCount, sharesLeft, canShare, loaded, incrementShare } = usePremium();

  const cameraRef = useRef(null);

  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#22c55e" />
      </View>
    );
  }

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
    if (!isCameraReady || !cameraRef.current || capturing) return;

    // — Premium gate for Share —
    if (!canShare) {
      Alert.alert(
        "Free Limit Reached",
        `You've used all ${FREE_SHARE_LIMIT} free shares. Upgrade to Premium for unlimited sharing.`,
        [
          { text: "Not now", style: "cancel" },
          { text: "Upgrade →", onPress: () => router.push("/premium") },
        ]
      );
      return;
    }

    try {
      setCapturing(true);
      const newCount = await incrementShare();
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

      // Warn user if this was their last free share
      if (!isPremium && newCount === FREE_SHARE_LIMIT) {
        Alert.alert(
          "Last Free Share Used",
          "You've used all your free shares. Upgrade to Premium for unlimited sharing.",
          [
            { text: "Maybe later", style: "cancel" },
            { text: "Upgrade →", onPress: () => router.push("/premium") },
          ]
        );
      }

      router.push({ pathname: "/share/preview", params: { uri: photo.uri } });
    } catch (e) {
      console.error("Capture failed:", e);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />

      {/* Share usage banner (free users only) */}
      {!isPremium && (
        <View style={styles.usageBanner}>
          <View style={styles.usageLeft}>
            <Ionicons name="share-social-outline" size={16} color={sharesLeft === 0 ? "#ef4444" : "#22c55e"} />
            <Text style={[styles.usageText, sharesLeft === 0 && { color: "#ef4444" }]}>
              {sharesLeft === 0 ? "No free shares left" : `${sharesLeft} free share${sharesLeft !== 1 ? "s" : ""} remaining`}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/premium")} style={styles.upgradePill}>
            <Text style={styles.upgradePillText}>Upgrade ✦</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={[styles.btn, (!canShare || !isCameraReady) && styles.btnBlocked]}
          onPress={takePhoto}
          activeOpacity={0.85}
          disabled={!isCameraReady}
        >
          {capturing ? (
            <ActivityIndicator color="#021019" />
          ) : (
            <Text style={styles.btnText}>
              {!canShare ? "🔒 Upgrade to Share" : "Capture"}
            </Text>
          )}
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

  usageBanner: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: "rgba(7,16,36,0.92)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  usageLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  usageText: { color: "#e6eef3", fontSize: 13, fontWeight: "600" },
  upgradePill: {
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  upgradePillText: { color: "#22c55e", fontWeight: "800", fontSize: 12 },

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
    minWidth: 180,
    alignItems: "center",
  },
  btnBlocked: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1.5,
    borderColor: "rgba(148,163,184,0.25)",
  },
  btnText: {
    color: "#021019",
    fontWeight: "700",
    fontSize: 16,
  },
});
