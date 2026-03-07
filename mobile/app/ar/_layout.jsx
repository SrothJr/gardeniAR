// app/ar/_layout.jsx
import { Stack } from "expo-router";

export default function ARLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#071024" },
        headerTintColor: "#e6eef3",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#071024" },
      }}
    >
      <Stack.Screen name="PlantTracker" options={{ headerShown: false }} />
      <Stack.Screen name="DiseaseDetection" options={{ headerShown: false }} />
      <Stack.Screen name="CropSuggestions" options={{ title: "Crop Suggestions" }} />
    </Stack>
  );
}