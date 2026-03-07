import { Stack } from "expo-router";

export default function ARLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#05060a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#071024" },
      }}
    >
      <Stack.Screen name="PlantTracker" options={{ title: "Plant Tracker & AR" }} />
      <Stack.Screen name="DiseaseDetection" options={{ title: "Disease Detection" }} />
      <Stack.Screen name="CropSuggestions" options={{ title: "Crop Suggestions" }} />
    </Stack>
  );
}
