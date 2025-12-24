// mobile/app/soil/index.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SoilTestScreen() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Soil test</Text>

      <View style={styles.card}>
        <View style={{ height: 180, borderRadius: 12, backgroundColor: '#0b1220', marginBottom: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#9aa8b7' }}>Tip: hold phone ~20–30 cm above the soil</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/soil/camera')}
        >
          <Text style={styles.primaryBtnText}>Scan Soil with Camera</Text>
        </TouchableOpacity>

        <Text style={styles.howItWorksTitle}>How it works</Text>
        <Text style={styles.howItWorks}>
          The camera captures the soil photo and the server-side AI analyzes texture, color, and moisture hints to estimate soil type and give short recommendations.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#071024', padding: 20 },
  title: { color: '#e6eef3', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#071826', padding: 16, borderRadius: 14 },
  primaryBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: { color: '#06150b', fontWeight: '700', fontSize: 16 },
  howItWorksTitle: { color: '#cfe7d4', fontWeight: '600', marginBottom: 6 },
  howItWorks: { color: '#9fb1be', lineHeight: 20 },
});
