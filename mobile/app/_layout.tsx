import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#05060a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
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
    </Stack>
  );
}