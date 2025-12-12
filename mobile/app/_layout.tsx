import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#000' },
      tabBarActiveTintColor: '#22c55e'
    }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paper-plane" size={size} color={color} />
          ),
        }}
      />

      {/* 🚫 hide plant/[id] from the tab bar */}
      <Tabs.Screen
        name="plant"
        options={{ href: null }}
      />
    </Tabs>
  );
}
