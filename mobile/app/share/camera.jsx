// import React, { useRef } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useRouter } from "expo-router";

// export default function ShareCamera() {
//   const cameraRef = useRef(null);
//   const router = useRouter();
//   const [permission, requestPermission] = useCameraPermissions();

//   // Permission loading
//   if (!permission) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff" }}>Checking camera permission…</Text>
//       </View>
//     );
//   }

//   // Permission denied
//   if (!permission.granted) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff", marginBottom: 12 }}>
//           Camera permission required
//         </Text>
//         <TouchableOpacity style={styles.captureButton} onPress={requestPermission}>
//           <Text style={styles.captureText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Take photo
//   const takePhoto = async () => {
//     if (!cameraRef.current) return;

//     const photo = await cameraRef.current.takePictureAsync({
//       quality: 0.8,
//       base64: true,
//     });

//     router.push({
//       pathname: "/share/preview",
//       params: {
//         uri: photo.uri,
//         base64: photo.base64,
//       },
//     });
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <CameraView
//         ref={cameraRef}
//         style={{ flex: 1 }}
//         facing="back"
//       />

//       {/* Capture Button */}
//       <View style={styles.captureContainer}>
//         <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
//           <Text style={styles.captureText}>Capture</Text>
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
//   captureContainer: {
//     position: "absolute",
//     bottom: 40,
//     width: "100%",
//     alignItems: "center",
//   },
//   captureButton: {
//     backgroundColor: "#22c55e",
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 40,
//   },
//   captureText: {
//     color: "#021019",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });


import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function ShareCamera() {
  const cameraRef = useRef(null);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", marginBottom: 12 }}>
          Camera permission required
        </Text>
        <TouchableOpacity style={styles.captureButton} onPress={requestPermission}>
          <Text style={styles.captureText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return;

    try {
      setCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      router.push({
        pathname: "/share/preview",
        params: {
          uri: photo.uri, // ✅ URI ONLY
        },
      });
    } catch (err) {
      console.error("Capture failed", err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={[styles.captureButton, capturing && { opacity: 0.6 }]}
          onPress={takePhoto}
          disabled={capturing}
        >
          {capturing ? (
            <ActivityIndicator color="#021019" />
          ) : (
            <Text style={styles.captureText}>Capture</Text>
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
  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 40,
  },
  captureText: {
    color: "#021019",
    fontWeight: "700",
    fontSize: 16,
  },
});
