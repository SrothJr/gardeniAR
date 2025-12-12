// mobile/app/(tabs)/_layout.tsx  (or mobile/app/_layout.tsx)
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#05060a', borderTopColor: '#0f1724' },
      }}
    >
      {/* Only expose the Explore tab (pointing to app/explore.jsx) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Ionicons name="paper-plane" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
