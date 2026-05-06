// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Share,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { BACKEND } from "../../config";

// export default function SharePreview() {
//   const router = useRouter();
//   const { uri } = useLocalSearchParams();

//   const [caption, setCaption] = useState("");
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const loadCaption = async () => {
//       try {
//         const res = await fetch(`${BACKEND}/api/ai/caption`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             context: "home garden plant photo",
//           }),
//         });

//         if (!res.ok) throw new Error("AI failed");

//         const data = await res.json();
//         if (!data?.caption) throw new Error("Invalid AI response");

//         setCaption(data.caption);
//       } catch (err) {
//         console.warn("⚠ AI unavailable, using fallback caption");

//         const hour = new Date().getHours();
//         const time =
//           hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

//         setCaption(
//           `🌿 A peaceful ${time} in my garden.\nWatching my plants grow day by day.\n\n#GardeniAR #HomeGarden #PlantLovers`
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCaption();
//   }, []);


//   const sharePost = async () => {
//     try {
//       await Share.share({
//         message: caption,
//         url: uri,
//       });
//     } catch (err) {
//       Alert.alert("Error", "Could not open share dialog");
//     }
//   };

//   if (!uri) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff" }}>No image received</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.page}>
//       <Image source={{ uri }} style={styles.image} />

//       {loading ? (
//         <ActivityIndicator size="large" color="#22c55e" />
//       ) : (
//         <>
//           <Text style={styles.label}>Caption</Text>

//           <TextInput
//             value={caption}
//             onChangeText={setCaption}
//             multiline
//             style={styles.input}
//           />

//           <TouchableOpacity style={styles.shareBtn} onPress={sharePost}>
//             <Text style={styles.shareText}>Share</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.backBtn}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.backText}>Retake</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: "#071024",
//     padding: 16,
//   },
//   image: {
//     width: "100%",
//     height: 300,
//     borderRadius: 16,
//     marginBottom: 16,
//   },
//   label: {
//     color: "#94a3b8",
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: "#0f172a",
//     color: "#e5e7eb",
//     borderRadius: 12,
//     padding: 12,
//     minHeight: 90,
//     textAlignVertical: "top",
//   },
//   shareBtn: {
//     backgroundColor: "#22c55e",
//     padding: 14,
//     borderRadius: 14,
//     marginTop: 16,
//   },
//   shareText: {
//     textAlign: "center",
//     fontWeight: "700",
//     color: "#021019",
//   },
//   backBtn: {
//     marginTop: 12,
//     padding: 12,
//   },
//   backText: {
//     color: "#94a3b8",
//     textAlign: "center",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#071024",
//   },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { BACKEND } from "../../config";

export default function SharePreview() {
  const router = useRouter();
  const { uri } = useLocalSearchParams();

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const loadCaption = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/ai/caption`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context: "home garden plant photo",
          }),
        });

        if (!res.ok) throw new Error("AI failed");

        const data = await res.json();
        if (!data?.caption) throw new Error("Invalid AI response");

        setCaption(data.caption);
      } catch (err) {
        console.warn("⚠ AI unavailable, using fallback caption");

        const hour = new Date().getHours();
        const time =
          hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

        setCaption(
          `🌿 A peaceful ${time} in my garden.\nWatching my plants grow day by day.\n\n#GardeniAR #HomeGarden #PlantLovers`
        );
      } finally {
        setLoading(false);
      }
    };

    loadCaption();
  }, []);


  const sharePost = async () => {
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert("Sharing not available on this device");
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Error", "Could not share image");
    }
  };


  if (!uri) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No image received</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>

      <Image source={{ uri }} style={styles.image} />

      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <>

          <Text style={styles.label}>Caption</Text>

          <TextInput
            value={caption}
            onChangeText={setCaption}
            multiline
            style={styles.input}
          />


          <TouchableOpacity style={styles.shareBtn} onPress={sharePost}>
            <Text style={styles.shareText}>Share Image</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>Retake</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#071024",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  label: {
    color: "#94a3b8",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
  },
  shareBtn: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  shareText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#021019",
  },
  backBtn: {
    marginTop: 12,
    padding: 12,
  },
  backText: {
    color: "#94a3b8",
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071024",
  },
});
