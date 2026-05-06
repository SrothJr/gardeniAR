import { Stack } from "expo-router";

export default function ShareLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="camera"
        options={{ title: "Garden Snapshot", headerShown: false }}
      />
      <Stack.Screen
        name="preview"
        options={{ title: "Preview & Share", headerShown: false }}
      />
    </Stack>
  );
}
