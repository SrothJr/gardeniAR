import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import '../i18n'; // Initialize i18n
import { useTranslation } from 'react-i18next';

function AppContent() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="care-guides/index" />
      <Stack.Screen name="care-guides/[id]" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="plant/[id]" />
      <Stack.Screen name="identify/index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="forum/index" />
      <Stack.Screen name="forum/create" />
      <Stack.Screen name="forum/[id]" />
      <Stack.Screen name="checklist/index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="premium" />
      <Stack.Screen name="companions/index" />
      <Stack.Screen name="growth/index" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="collections/seasonal" />
      <Stack.Screen name="routines/watering" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}