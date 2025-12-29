import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 60) / 2; // 20 padding + 20 spacing
const fallbackImage =
  "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";

// Crop suggestions for all 12 months
const cropByMonth: Record<number, any[]> = {
  1: [
    {
      name: "Tomato",
      season: "Winter",
      weather: "Cool",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://static.wixstatic.com/media/5a432c_652085d9b05a4271b76e39c0c8a8cb83~mv2.jpg/v1/fill/w_466,h_466,al_c,lg_1,q_80,enc_avif,quality_auto/5a432c_652085d9b05a4271b76e39c0c8a8cb83~mv2.jpg",
    },
    {
      name: "Cauliflower",
      season: "Winter",
      weather: "Cool",
      soil: "Fertile Loamy",
      water: "High",
      imageUrl:
        "https://www.eatfresh.com.hk/cdn/shop/products/2_eb6178c5-e064-41dc-981a-5546ceb22dbc_1024x1024.png?v=1551858275",
    },
  ],
  2: [
    {
      name: "Carrot",
      season: "Winter",
      weather: "Cool",
      soil: "Sandy Loam",
      water: "Moderate",
      imageUrl:
        "https://theseedcompany.ca/cdn/shop/files/crop_CARR1923_Carrot___Sweetness_Pelleted_Long.png?v=1720113309",
    },
    {
      name: "Peas",
      season: "Winter",
      weather: "Cool",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.onelovelylife.com/wp-content/uploads/2023/06/Frozen-Peas21-2.jpg",
    },
  ],
  3: [
    {
      name: "Spinach",
      season: "Spring",
      weather: "Mild",
      soil: "Loamy",
      water: "High",
      imageUrl:
        "https://static.wixstatic.com/media/5a432c_ff23b52b18ca4de992e67628670cc57a~mv2.jpg/v1/fill/w_333,h_333,al_c,q_85/5a432c_ff23b52b18ca4de992e67628670cc57a~mv2.jpg",
    },
    {
      name: "Radish",
      season: "Spring",
      weather: "Mild",
      soil: "Sandy Loam",
      water: "Moderate",
      imageUrl:
        "https://static.wixstatic.com/media/5a432c_6f7d98f07e6e4c12a94d48fb9f6b10b3~mv2.png/v1/fill/w_301,h_391,al_c,usm_0.66_1.00_0.01/5a432c_6f7d98f07e6e4c12a94d48fb9f6b10b3~mv2.png",
    },
  ],
  4: [
    {
      name: "Cucumber",
      season: "Spring",
      weather: "Warm",
      soil: "Sandy Loam",
      water: "High",
      imageUrl:
        "https://static.wixstatic.com/media/518c2e_bae03b5b794743a3b3ed21e25c6a9ec3~mv2.jpg/v1/fill/w_391,h_391,al_c,q_85,usm_0.66_1.00_0.01/518c2e_bae03b5b794743a3b3ed21e25c6a9ec3~mv2.jpg",
    },
    {
      name: "Brinjal",
      season: "Spring",
      weather: "Warm",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://static.wixstatic.com/media/5a432c_baf0ba6f30d04ef48911f220bb3c9816~mv2.jpg/v1/fill/w_466,h_466,al_c,lg_1,q_80,enc_avif,quality_auto/5a432c_baf0ba6f30d04ef48911f220bb3c9816~mv2.jpg",
    },
  ],
  5: [
    {
      name: "Okra",
      season: "Summer",
      weather: "Hot",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/premium-photo/fresh-okra-green-roselle-white-background_3568402.htm#fromView=search&page=1&position=8&uuid=678148bb-772a-45d6-a0fb-1f32e9a382e5&query=okra+transparent+background",
    },
    {
      name: "Pumpkin",
      season: "Summer",
      weather: "Hot",
      soil: "Loamy",
      water: "High",
      imageUrl:
        "https://www.freepik.com/free-photo/fresh-orange-pumpkin_2773440.htm#fromView=search&page=1&position=3&uuid=b593889e-7493-4f38-a82b-38b25290aa52&query=pumkin+transparent+background",
    },
  ],
  6: [
    {
      name: "Bitter Gourd",
      season: "Summer",
      weather: "Hot",
      soil: "Loamy",
      water: "High",
      imageUrl:
        "https://www.freepik.com/free-photo/chopped-bitter-gourd-put-dark-floor_11994921.htm#fromView=search&page=1&position=7&uuid=b2db88c8-a625-48f4-82c8-4b08011a58d4&query=bitter+gourd+transparent+background",
    },
    {
      name: "Corn",
      season: "Summer",
      weather: "Hot",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/free-photo/top-view-corns-white-surface_9096001.htm#fromView=search&page=1&position=5&uuid=25b9521e-bc2a-4904-8901-8854e241de3f&query=corn+gourd+transparent+background",
    },
  ],
  7: [
    {
      name: "Soybean",
      season: "Monsoon",
      weather: "Warm & Humid",
      soil: "Sandy Loam",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/free-psd/pile-yellow-lentils-healthy-food-nutrition-grains-legumes-dietary_406533803.htm#fromView=search&page=1&position=4&uuid=e1d2c0bb-b075-4433-b5c2-29b042e5b6c0&query=soyabean+transparent+background",
    },
    {
      name: "Yam",
      season: "Monsoon",
      weather: "Warm & Humid",
      soil: "Loamy",
      water: "High",
      imageUrl:
        "https://www.freepik.com/free-psd/freshly-harvested-sweet-potato-with-lush-green-leaves_406618472.htm#fromView=search&page=1&position=3&uuid=434c1c11-600d-43a7-a4f6-7349caa9ebcf&query=yam+transparent+background",
    },
  ],
  8: [
    {
      name: "Rice",
      season: "Monsoon",
      weather: "Humid",
      soil: "Clayey Loam",
      water: "High",
      imageUrl:
        "https://www.freepik.com/free-photo/nutrition-straw-plant-crop-agricultural_1047424.htm#fromView=search&page=1&position=1&uuid=bd67fb18-9727-4593-90c4-c66744a94596&query=paddy+transparent+background",
    },
    {
      name: "Lady Finger",
      season: "Monsoon",
      weather: "Humid",
      soil: "Loamy",
      water: "High",
      imageUrl:
        "https://www.freepik.com/premium-photo/garlic-roasted-okra-crispy-olive-oil-smoked-paprika-vibrant-green-served-bowl-culinary_297959221.htm#fromView=search&page=1&position=14&uuid=222f70e1-2cf7-4ee8-8a57-978ef695e170&query=lady+finger+transparent+background",
    },
  ],
  9: [
    {
      name: "Wheat",
      season: "Autumn",
      weather: "Mild",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/free-psd/golden-wheat-stalks-symbol-harvest-abundance_406618377.htm#fromView=search&page=1&position=2&uuid=44a64df8-7070-4451-a93b-6d15ced35ed7&query=wheat+transparent+background",
    },
    {
      name: "Beetroot",
      season: "Autumn",
      weather: "Mild",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/premium-photo/beetroots-isolated-white-background_16276286.htm#fromView=search&page=1&position=5&uuid=a1554e15-52c3-4010-8eb0-2b17c3355696&query=beetroot+transparent+background",
    },
  ],
  10: [
    {
      name: "Onion",
      season: "Autumn",
      weather: "Cool",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/free-photo/red-onion-whole-isolated-white_10181084.htm#fromView=search&page=1&position=0&uuid=6f03e5c1-06ba-491c-828b-6c3e8de2e822&query=onion+transparent+background",
    },
    {
      name: "Garlic",
      season: "Autumn",
      weather: "Cool",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/premium-photo/photo-garlic-cooking_18949051.htm#fromView=search&page=1&position=5&uuid=2b0103b2-f64e-49d8-9942-c1380e4af1c4&query=garlic+transparent+background",
    },
  ],
  11: [
    {
      name: "Lettuce",
      season: "Winter",
      weather: "Cool",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/free-photo/fresh-lettuce_1178423.htm#fromView=search&page=1&position=2&uuid=00dff440-2ee2-4198-bec9-7a6ad346e5c2&query=lettuce+transparent+background",
    },
    {
      name: "Cabbage",
      season: "Winter",
      weather: "Cool",
      soil: "Loamy",
      water: "High",
      imageUrl:
        "https://www.freepik.com/free-psd/single-fresh-head-green-cabbage-with-crisp-leaves-isolated-stark-black-background_424642518.htm#fromView=search&page=1&position=4&uuid=a5028ba3-9c13-4b5c-b1b8-123a8175cf8a&query=cabbage+transparent+background",
    },
  ],
  12: [
    {
      name: "Peas",
      season: "Winter",
      weather: "Cool",
      soil: "Loamy",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/premium-photo/green-peas-bowl_7017291.htm#fromView=search&page=1&position=5&uuid=4388344c-a74c-47fd-805c-f8285ff2c2bb&query=peas+transparent+background",
    },
    {
      name: "Carrot",
      season: "Winter",
      weather: "Cool",
      soil: "Sandy Loam",
      water: "Moderate",
      imageUrl:
        "https://www.freepik.com/premium-photo/carrot-vegetable-with-leaves-wood_9923141.htm#fromView=search&page=1&position=9&uuid=db4e4759-f47e-44ee-8d1d-711fed6e827d&query=carrot+transparent+background",
    },
  ],
};

export default function CropSuggestions() {
  const [month, setMonth] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const getSuggestions = () => {
    const m = parseInt(month);
    if (isNaN(m) || m < 1 || m > 12) {
      Alert.alert("Error", "Please enter a valid month (1-12)");
      setSuggestions([]);
      return;
    }

    const crops = cropByMonth[m];
    if (crops && crops.length > 0) {
      setSuggestions(crops);
    } else {
      Alert.alert("No suggestions", "No crops found for this month");
      setSuggestions([]);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.cropContainer, { width: itemWidth }]}>
      <Image
        source={{ uri: item.imageUrl || fallbackImage }}
        style={styles.cropImage}
        resizeMode="cover"
      />
      <Text style={styles.cropItem}>{item.name || "Unknown Crop"}</Text>
      <Text style={styles.cropInfo}>
        {item.season || "Season N/A"} • {item.weather || "Weather N/A"}
      </Text>
      <Text style={styles.cropInfo}>
        Soil: {item.soil || "N/A"} • Water: {item.water || "N/A"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crop Suggestions</Text>

      <TextInput
        placeholder="Enter Month (1-12)"
        value={month}
        onChangeText={setMonth}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Get Suggestions" onPress={getSuggestions} />

      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginTop: 15 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No suggestions yet
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  cropContainer: {
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  cropImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 8 },
  cropItem: { fontSize: 18, fontWeight: "500", padding: 5, textAlign: "center" },
  cropInfo: { fontSize: 12, color: "gray", textAlign: "center" },
});
