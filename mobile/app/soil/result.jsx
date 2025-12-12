// mobile/app/soil/result.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function SoilResult() {
  const params = useLocalSearchParams();
  let uri = params?.uri || '';

  // if the param got encoded in query string, decode
  try {
    uri = decodeURIComponent(uri);
  } catch (e) {
    // ignore decode errors
  }

  return (
    <ScrollView style={styles.page}>
      <Text style={styles.title}>Soil Result</Text>
      {uri ? (
        <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <Text style={styles.no}>No image received.</Text>
      )}

      <View style={styles.block}>
        <Text style={styles.label}>Tip</Text>
        <Text style={styles.text}>This screen will later show soil analysis results returned by the backend AI service.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: '#071024' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  preview: { width: '100%', height: 320, borderRadius: 12, marginBottom: 12 },
  no: { color: '#cbd5e1' },
  block: { marginTop: 12, backgroundColor: '#071a27', padding: 12, borderRadius: 8 },
  label: { color: '#9ae6b4', fontWeight: '700', marginBottom: 6 },
  text: { color: '#cbd5e1' },
});
