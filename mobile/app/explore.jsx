// mobile/app/explore.jsx (working Explore screen)
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import SearchBar from '../components/SearchBar';
import PlantCard from '../components/PlantCard';
import { BACKEND } from '../config';

export default function ExplorePlants() {
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPlants = async (q = '') => {
    setLoading(true);
    try {
      const url = q ? `${BACKEND}/api/plants?search=${encodeURIComponent(q)}` : `${BACKEND}/api/plants`;
      const res = await fetch(url);
      const data = await res.json();
      setPlants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchPlants error', err);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlants(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPlants(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Explore Plants</Text>

      <SearchBar value={search} onChangeText={setSearch} />

      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item, index) => item._id ?? String(index)}
          renderItem={({ item }) => (
            <PlantCard plant={item} onPress={() => router.push(`/plant/${item._id}`)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={<Text style={styles.empty}>No plants found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#071024', padding: 16 },
  title: { color: '#e6eef3', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  empty: { color: '#94a3b8', marginTop: 20, textAlign: 'center' },
});
