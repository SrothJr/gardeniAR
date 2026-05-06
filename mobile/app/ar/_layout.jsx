// app/ar/_layout.jsx
import { Stack } from "expo-router";

export default function ARLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PlantTracker" />
      <Stack.Screen name="DiseaseDetection" />
      <Stack.Screen name="CropSuggestions" />
    </Stack>
  );
}