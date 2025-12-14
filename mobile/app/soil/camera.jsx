// // app/soil/camera.jsx
// import React, { useRef } from "react";
// import { View, Text, TouchableOpacity, Alert, Linking, StyleSheet } from "react-native";
// import * as Camera from "expo-camera";
// import { useRouter } from "expo-router";

// /** simple renderable check */
// function isRenderable(x) {
//   if (!x) return false;
//   if (typeof x === "function" || typeof x === "string") return true;
//   if (typeof x === "object" && x !== null) {
//     if (x.$$typeof) return true;
//   }
//   return false;
// }

// export default function SoilCamera() {
//   const router = useRouter();
//   const cameraRef = useRef(null);

//   // Use the hook directly (preferred API in your environment)
//   const hook = Camera.useCameraPermissions?.();
//   // hook may be undefined if not available — guard against that
//   const permission = Array.isArray(hook) ? hook[0] : null;
//   const requestPermission = Array.isArray(hook) ? hook[1] : null;

//   // Resolve the real Camera component (prefer CameraView, then Camera)
//   const candidate = (Camera.CameraView && isRenderable(Camera.CameraView) ? Camera.CameraView : null)
//     || (Camera.Camera && isRenderable(Camera.Camera) ? Camera.Camera : null)
//     || (Camera.default && Camera.default.Camera && isRenderable(Camera.default.Camera) ? Camera.default.Camera : null)
//     || null;

//   console.log("DEBUG expo-camera keys:", Object.keys(Camera || {}));
//   console.log("DEBUG candidate typeof:", candidate ? typeof candidate : "null");

//   const openSettings = () => {
//     Linking.openSettings().catch(() => {
//       Alert.alert("Open Settings", "Could not open settings. Please enable Camera permission manually.");
//     });
//   };

//   // If the hook isn't present and there's no permission API, show helpful message
//   if (!hook && !Camera.getCameraPermissionsAsync && !Camera.requestCameraPermissionsAsync) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.title}>Permissions API unavailable</Text>
//         <Text style={styles.hint}>expo-camera exports: {JSON.stringify(Object.keys(Camera || {}))}</Text>
//         <Text style={styles.hint}>Try: update Expo Go or use a dev client (npx expo run:android).</Text>
//       </View>
//     );
//   }

//   // While hook is initializing, permission may be null
//   if (permission === null) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.hint}>Checking camera permission…</Text>
//       </View>
//     );
//   }

//   // Permission not granted
//   if (!permission.granted) {
//     const status = permission.status ?? String(permission.granted);
//     return (
//       <View style={styles.center}>
//         <Text style={styles.title}>Camera permission</Text>
//         <Text style={styles.hint}>Permission status: {status}</Text>

//         <TouchableOpacity
//           style={styles.btn}
//           onPress={async () => {
//             try {
//               if (!requestPermission) {
//                 Alert.alert("Permissions API unavailable", "Cannot request camera permission in this environment.");
//                 return;
//               }
//               const result = await requestPermission();
//               console.log("DEBUG request result:", result);
//               // hook will update permission automatically; we log result for debugging
//               if (result && result.granted === false && result.canAskAgain === false) {
//                 Alert.alert(
//                   "Permission blocked",
//                   "Camera permission has been blocked. Open settings to allow it.",
//                   [
//                     { text: "Cancel", style: "cancel" },
//                     { text: "Open Settings", onPress: () => Linking.openSettings() },
//                   ]
//                 );
//               }
//             } catch (err) {
//               console.error("requestPermission error", err);
//               Alert.alert("Error", "Could not request permission.");
//             }
//           }}
//         >
//           <Text style={styles.btnText}>Request Camera Permission</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.btn, styles.outline]} onPress={openSettings}>
//           <Text style={styles.outlineText}>Open App Settings</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.link} onPress={() => router.back()}>
//           <Text style={styles.linkText}>Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Permission granted — ensure we have a renderable component
//   if (!candidate) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.title}>Camera component not renderable</Text>
//         <Text style={styles.hint}>expo-camera exports: {JSON.stringify(Object.keys(Camera || {}))}</Text>
//         <Text style={styles.hint}>Try: update Expo Go or use a dev client (npx expo run:android).</Text>
//       </View>
//     );
//   }

//   const CameraView = candidate;
//   const cameraType = Camera.CameraType?.back ?? Camera.Constants?.Type?.back ?? 1;

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={styles.camera} type={cameraType} ratio="16:9" />

//       <View style={styles.controls}>
//         <TouchableOpacity
//           style={styles.btnSmall}
//           onPress={async () => {
//             try {
//               if (!cameraRef.current || typeof cameraRef.current.takePictureAsync !== "function") {
//                 Alert.alert("Camera not ready", "Try again.");
//                 return;
//               }
//               const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
//               router.push(`/soil/result?uri=${encodeURIComponent(photo.uri)}`);
//             } catch (e) {
//               console.error("capture error", e);
//               Alert.alert("Capture failed", e.message || "Unknown error");
//             }
//           }}
//         >
//           <Text style={styles.btnTextSmall}>Scan Soil</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.btnSmall, styles.outline]} onPress={() => router.back()}>
//           <Text style={styles.outlineText}>Back</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#071024" },
//   camera: { flex: 1 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#071024" },
//   title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
//   hint: { color: "#cbd5e1", textAlign: "center", marginBottom: 12 },
//   btn: { marginTop: 12, paddingVertical: 12, paddingHorizontal: 18, backgroundColor: "#10b981", borderRadius: 12 },
//   btnText: { color: "#021019", fontWeight: "700" },
//   outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#9aa6b2", marginTop: 8 },
//   outlineText: { color: "#cbd5e1" },
//   controls: { position: "absolute", bottom: 28, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" },
//   btnSmall: { paddingVertical: 12, paddingHorizontal: 18, backgroundColor: "#10b981", borderRadius: 999 },
//   btnTextSmall: { color: "#021019", fontWeight: "700" },
//   link: { marginTop: 8 },
//   linkText: { color: "#94a3b8" },
// });



// mobile/app/soil/camera.jsx
// mobile/app/soil/camera.jsx
import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as Camera from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { BACKEND } from '../../config';

//const BACKEND = "http://192.168.0.192:5000"; // 

export default function SoilCamera() {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [permission, requestPermission] = Camera.useCameraPermissions();

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
    try {
      setLoading(true);

      if (!cameraRef.current || typeof cameraRef.current.takePictureAsync !== "function") {
        Alert.alert("Camera not ready", "Try again.");
        return;
      }

      // 1) capture (no base64)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: true,
      });
      if (!photo?.uri) throw new Error("No photo URI");

      console.log("DEBUG photo", Object.keys(photo));

      
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log("DEBUG manipResult", Object.keys(manipResult || {}));

      const uriToSend = manipResult.uri || photo.uri;
      // 3) build FormData
      const form = new FormData();
      form.append("image", {
        uri: uriToSend,
        name: "soil.jpg",
        type: "image/jpeg",
      });

      
      const resp = await fetch(`${BACKEND}/api/soil/analyze-file`, {
        method: "POST",
        body: form,
        
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("Server error", resp.status, txt);
        Alert.alert("Analysis failed", `Server returned ${resp.status}`);
        return;
      }

      const json = await resp.json();
      const analysis = json.analysis ?? json;

      
      router.push({
        pathname: "/soil/result",
        params: {
          uri: uriToSend,
          analysis: JSON.stringify(analysis),
        },
      });
    } catch (err) {
      console.error("captureAndAnalyze error:", err);
      Alert.alert("Error", "Could not capture or analyze soil");
    } finally {
      setLoading(false);
    }
  };

  const CameraView = Camera.CameraView ?? Camera.Camera;

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type={Camera.CameraType?.back ?? Camera.Constants?.Type?.back ?? 1}
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.btnSmall} onPress={captureAndAnalyze} disabled={loading}>
          <Text style={styles.btnTextSmall}>{loading ? "Analyzing..." : "Scan Soil"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnSmall, styles.outline]} onPress={() => router.back()}>
          <Text style={styles.outlineText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071024" },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#071024" },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  hint: { color: "#cbd5e1" },
  btn: { marginTop: 12, paddingVertical: 12, paddingHorizontal: 18, backgroundColor: "#10b981", borderRadius: 12 },
  btnText: { color: "#021019", fontWeight: "700" },
  controls: { position: "absolute", bottom: 28, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" },
  btnSmall: { paddingVertical: 14, paddingHorizontal: 20, backgroundColor: "#10b981", borderRadius: 999 },
  btnTextSmall: { color: "#021019", fontWeight: "700" },
  outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#9aa6b2" },
  outlineText: { color: "#cbd5e1" },
});


