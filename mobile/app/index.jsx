// import { Link, useRouter, useFocusEffect } from "expo-router";
// import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useState, useCallback } from "react";
// import { Ionicons } from "@expo/vector-icons";

// export default function Index() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useFocusEffect(
//     useCallback(() => {
//       checkUser();
//     }, [])
//   );

//   const checkUser = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem("user");
//       if (userStr) {
//         setUser(JSON.parse(userStr));
//       } else {
//         setUser(null);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("user");
//     setUser(null);
//     router.replace("/auth/login");
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>GardeniAR</Text>
//         {user && (
//           <Text style={styles.welcome}>
//             Hello, {user.name.split(" ")[0]}! 🌿
//           </Text>
//         )}
//       </View>

//       <View style={styles.menu}>
//         <Link href="/care-guides/" asChild>
//           <TouchableOpacity style={styles.link}>
//             <Ionicons
//               name="water-outline"
//               size={24}
//               color="black"
//               style={styles.icon}
//             />
//             <Text style={styles.linkText}>Water & Fertilizer Guide</Text>
//           </TouchableOpacity>
//         </Link>

//         <Link href="/explore" asChild>
//           <TouchableOpacity style={styles.link}>
//             <Ionicons
//               name="search-outline"
//               size={24}
//               color="black"
//               style={styles.icon}
//             />
//             <Text style={styles.linkText}>Explore Plants</Text>
//           </TouchableOpacity>
//         </Link>

//         {/* ✅ INTEGRATED FEATURE — FROM YOUR CODE */}
//         <Link href="/share/camera" asChild>
//           <TouchableOpacity style={styles.shareLink}>
//             <Ionicons
//               name="camera-outline"
//               size={24}
//               color="black"
//               style={styles.icon}
//             />
//             <Text style={styles.shareText}>Share Your Garden</Text>
//           </TouchableOpacity>
//         </Link>

//         <Link href="/identify" asChild>
//           <TouchableOpacity style={styles.link}>
//             <Ionicons
//               name="scan-outline"
//               size={24}
//               color="black"
//               style={styles.icon}
//             />
//             <Text style={styles.linkText}>Identify Weeds</Text>
//           </TouchableOpacity>
//         </Link>

//         <Link href="/forum" asChild>
//           <TouchableOpacity style={styles.link}>
//             <Ionicons
//               name="chatbubbles-outline"
//               size={24}
//               color="black"
//               style={styles.icon}
//             />
//             <Text style={styles.linkText}>Community Forum</Text>
//           </TouchableOpacity>
//         </Link>

//         <Link href="/checklist" asChild>
//           <TouchableOpacity style={styles.link}>
//             <Ionicons
//               name="checkbox-outline"
//               size={24}
//               color="black"
//               style={styles.icon}
//             />
//             <Text style={styles.linkText}>Garden Tasks</Text>
//           </TouchableOpacity>
//         </Link>
//       </View>

//       <View style={styles.footer}>
//         {user ? (
//           <TouchableOpacity
//             style={[styles.link, styles.logoutBtn]}
//             onPress={handleLogout}
//           >
//             <Ionicons
//               name="log-out-outline"
//               size={24}
//               color="white"
//               style={styles.icon}
//             />
//             <Text style={[styles.linkText, styles.logoutText]}>
//               Log Out
//             </Text>
//           </TouchableOpacity>
//         ) : (
//           <Link href="/auth/login" asChild>
//             <TouchableOpacity
//               style={[
//                 styles.link,
//                 { backgroundColor: "#3b82f6", marginTop: 10 },
//               ]}
//             >
//               <Ionicons
//                 name="log-in-outline"
//                 size={24}
//                 color="white"
//                 style={styles.icon}
//               />
//               <Text style={[styles.linkText, { color: "white" }]}>
//                 Log In
//               </Text>
//             </TouchableOpacity>
//           </Link>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#071024",
//     padding: 20,
//     justifyContent: "space-between",
//   },
//   header: {
//     marginTop: 40,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 36,
//     color: "#22c55e",
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   welcome: {
//     color: "#a0aec0",
//     fontSize: 18,
//   },
//   menu: {
//     gap: 15,
//     width: "100%",
//     alignItems: "center",
//   },
//   footer: {
//     marginBottom: 40,
//     alignItems: "center",
//     width: "100%",
//   },
//   link: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 18,
//     backgroundColor: "#10b981",
//     borderRadius: 12,
//     width: "100%",
//     maxWidth: 300,
//     justifyContent: "flex-start",
//     paddingLeft: 30,
//   },
//   icon: {
//     marginRight: 15,
//   },
//   linkText: {
//     color: "black",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   logoutBtn: {
//     backgroundColor: "#ef4444",
//   },
//   logoutText: {
//     color: "white",
//   },
//   loginBtn: {
//     backgroundColor: "#2563eb",
//   },

//   /* ✅ STYLES ADDED FROM YOUR FILE */
//   shareLink: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 18,
//     backgroundColor: "#10b981",
//     borderRadius: 14,
//     width: "100%",
//     maxWidth: 300,
//     paddingLeft: 30,
//   },
//   shareText: {
//     color: "black",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

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
      <View style={styles.header}>
        <Text style={styles.title}>GardeniAR</Text>
        {user && (
          <Text style={styles.welcome}>
            Hello, {user.name.split(" ")[0]}! 🌿
          </Text>
        )}
      </View>

      <View style={styles.menu}>
        {/* Water & Fertilizer */}
        <Link href="/care-guides/" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons name="water-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.linkText}>Water & Fertilizer Guide</Text>
          </TouchableOpacity>
        </Link>

        {/* Explore Plants */}
        <Link href="/explore" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons name="search-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.linkText}>Explore Plants</Text>
          </TouchableOpacity>
        </Link>

        {/* 🌱 Companion Planting (NEW FEATURE) */}
        <Link href="/companions" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons name="leaf-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.linkText}>Companion Planting</Text>
          </TouchableOpacity>
        </Link>

        {/* Share Your Garden */}
        <Link href="/share/camera" asChild>
          <TouchableOpacity style={styles.shareLink}>
            <Ionicons name="camera-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.shareText}>Share Your Garden</Text>
          </TouchableOpacity>
        </Link>

        {/* Identify Weeds */}
        <Link href="/identify" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons name="scan-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.linkText}>Identify Weeds</Text>
          </TouchableOpacity>
        </Link>

        {/* Community Forum */}
        <Link href="/forum" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons name="chatbubbles-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.linkText}>Community Forum</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/growth" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons
              name="trending-up-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.linkText}>Plant Growth Tracker</Text>
          </TouchableOpacity>
        </Link>

        {/* Garden Tasks */}
        <Link href="/checklist" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons name="checkbox-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.linkText}>Garden Tasks</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.footer}>
        {user ? (
          <TouchableOpacity
            style={StyleSheet.flatten([styles.link, styles.logoutBtn])}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" style={styles.icon} />
            <Text style={[styles.linkText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <Link href="/auth/login" asChild>
            <TouchableOpacity
              style={StyleSheet.flatten([
                styles.link,
                { backgroundColor: "#3b82f6", marginTop: 10 },
              ])}
            >
              <Ionicons name="log-in-outline" size={24} color="white" style={styles.icon} />
              <Text style={[styles.linkText, { color: "white" }]}>Log In</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
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
    marginTop: 40,
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
    justifyContent: "flex-start",
    paddingLeft: 30,
    marginBottom: 15, // Added margin here instead of gap
  },
  icon: {
    marginRight: 15,
  },
  linkText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
  },
  logoutText: {
    color: "white",
  },
  shareLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#10b981",
    borderRadius: 14,
    width: "100%",
    maxWidth: 300,
    paddingLeft: 30,
  },
  shareText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});
