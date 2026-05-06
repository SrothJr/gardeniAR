import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#071024' },
      }}
    >
      {/* Home Screen (Menu) */}
      <Stack.Screen 
        name="index" 
        options={{ title: 'Home', headerShown: false }} 
      />

      {/* Care Guides List */}
      <Stack.Screen 
        name="care-guides/index" 
        options={{ title: 'Tracker' }} 
      />

      {/* Care Guide Detail */}
      <Stack.Screen 
        name="care-guides/[id]" 
        options={{ title: 'Plant Care' }} 
      />

      {/* Explore Page (Existing) */}
      <Stack.Screen 
        name="explore" 
        options={{ title: 'Explore' }} 
      />
      
      {/* Plant Detail (Existing) */}
      <Stack.Screen 
        name="plant/[id]" 
        options={{ title: 'Details' }} 
      />

      {/* Weed Identification (New) */}
      <Stack.Screen 
        name="identify/index" 
        options={{ title: 'Weed ID', headerShown: false }} 
      />

      {/* Auth Routes */}
      <Stack.Screen 
        name="auth/login" 
        options={{ title: 'Login', headerShown: false }} 
      />
      <Stack.Screen 
        name="auth/signup" 
        options={{ title: 'Sign Up', headerShown: false }} 
      />

      {/* Forum Routes */}
      <Stack.Screen 
        name="forum/index" 
        options={{ title: 'Community Forum' }} 
      />
      <Stack.Screen 
        name="forum/create" 
        options={{ title: 'New Post' }} 
      />
      <Stack.Screen 
        name="forum/[id]" 
        options={{ title: 'Discussion' }} 
      />

      {/* Checklist Route */}
      <Stack.Screen 
        name="checklist/index" 
        options={{ title: 'Garden Tasks' }} 
      />

      {/* Share Garden Route */}
      <Stack.Screen 
        name="share" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="share/camera" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="share/preview" 
        options={{ headerShown: false }} 
      />

      {/* AR Routes */}
      <Stack.Screen 
        name="ar" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ar/PlantTracker" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ar/DiseaseDetection" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ar/CropSuggestions" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}