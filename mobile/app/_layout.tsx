import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
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
    </Stack>
  );
}