import { Stack } from "expo-router";

export default function ShareLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#071024" },
        headerTintColor: "#e6eef3",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="camera"
        options={{ title: "Garden Snapshot" }}
      />
      <Stack.Screen
        name="preview"
        options={{ title: "Preview & Share" }}
      />
    </Stack>
  );
}
