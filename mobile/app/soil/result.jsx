// // mobile/app/soil/result.jsx
// import React from "react";
// import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
// import { useLocalSearchParams } from "expo-router";

// export default function SoilResult() {
//   const params = useLocalSearchParams();

//   let uri = decodeURIComponent(params?.uri || "");
//   let analysis = null;

//   try {
//     analysis = JSON.parse(decodeURIComponent(params?.analysis || ""));
//   } catch {
//     analysis = null;
//   }

//   return (
//     <ScrollView style={styles.page}>
//       <Text style={styles.title}>Soil Analysis Result</Text>

//       {uri ? (
//         <Image source={{ uri }} style={styles.image} />
//       ) : (
//         <Text style={styles.no}>No image found</Text>
//       )}

//       <View style={styles.card}>
//         {!analysis ? (
//           <Text style={styles.no}>No analysis available</Text>
//         ) : (
//           <>
//             <Text style={styles.label}>Soil Type</Text>
//             <Text style={styles.text}>{analysis.soilType}</Text>

//             <Text style={styles.label}>Color</Text>
//             <Text style={styles.text}>{analysis.color}</Text>

//             <Text style={styles.label}>Moisture</Text>
//             <Text style={styles.text}>{analysis.moisture}</Text>

//             <Text style={styles.label}>Contaminants</Text>
//             <Text style={styles.text}>
//               {analysis.contaminants?.length ? analysis.contaminants.join(", ") : "None"}
//             </Text>

//             <Text style={styles.label}>Recommendations</Text>
//             {analysis.recommendations?.map((rec, i) => (
//               <Text key={i} style={styles.text}>• {rec}</Text>
//             ))}

//             {analysis.notes ? (
//               <>
//                 <Text style={styles.label}>Notes</Text>
//                 <Text style={styles.text}>{analysis.notes}</Text>
//               </>
//             ) : null}
//           </>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: "#071024", padding: 16 },
//   title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 14 },
//   image: { width: "100%", height: 300, borderRadius: 12, marginBottom: 12 },
//   no: { color: "#cbd5e1", textAlign: "center" },
//   card: { backgroundColor: "#071a27", padding: 16, borderRadius: 10 },
//   label: { color: "#9ae6b4", fontWeight: "700", marginTop: 10 },
//   text: { color: "#cbd5e1", marginTop: 4 },
// });



import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function SoilResult() {
  const params = useLocalSearchParams();
  let uri = params?.uri || "";
  let analysis = null;

  try {
    analysis = params?.analysis ? JSON.parse(params.analysis) : null;
  } catch (err) {
    console.log("Failed parsing analysis JSON:", err);
  }

  return (
    <ScrollView style={styles.page}>
      <Text style={styles.title}>Soil Result</Text>

      {uri ? (
        <Image source={{ uri }} style={styles.preview} />
      ) : (
        <Text style={styles.no}>No image received.</Text>
      )}

      <View style={styles.block}>
        <Text style={styles.label}>AI Analysis</Text>

        {!analysis && (
          <Text style={styles.text}>No analysis data received.</Text>
        )}

        {analysis && (
          <>
            <Text style={styles.text}>Type: {analysis.soilType}</Text>
            <Text style={styles.text}>pH: {analysis.ph}</Text>
            <Text style={styles.text}>Fertility: {analysis.fertility}</Text>
            <Text style={styles.text}>{analysis.description}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#071024" },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 12 },
  preview: { width: "100%", height: 300, borderRadius: 12, marginBottom: 12 },
  no: { color: "#cbd5e1" },
  block: {
    backgroundColor: "#071a27",
    padding: 12,
    borderRadius: 8
  },
  label: { color: "#9ae6b4", fontWeight: "700", marginBottom: 6 },
  text: { color: "#cbd5e1", marginBottom: 4 }
});

