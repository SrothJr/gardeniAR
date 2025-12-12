import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

export default function PlantCard({ plant, onPress }) {
  const imageUri = plant?.image || 'https://picsum.photos/seed/plant/800/600';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{plant?.name ?? 'Unknown'}</Text>
        <View style={styles.tags}>
          {plant?.sunlight ? <Text style={styles.tag}>{plant.sunlight}</Text> : null}
          {plant?.water ? <Text style={styles.tag}>{plant.water}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#0b1220', borderWidth: 1, borderColor: '#12202b' },
  image: { width: '100%', height: 180, backgroundColor: '#0f1724' },
  info: { padding: 12 },
  name: { color: '#e6eef3', fontWeight: '700', fontSize: 18 },
  tags: { flexDirection: 'row', marginTop: 8 },
  tag: { color: '#cde7da', marginRight: 10, backgroundColor: '#0b1220', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 12 }
});
