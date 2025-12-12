import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet 
} from 'react-native';
import { BACKEND } from '../../config';
import { Ionicons } from '@expo/vector-icons';

const STAGES = ['Seedling', 'Vegetative', 'Flowering'];

export default function CareGuideDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState('Vegetative');

  useEffect(() => {
    if (!id) return;
    fetch(`${BACKEND}/api/care-guide/${id}`)
      .then(r => r.json())
      .then(data => {
        // Handle { guide: {...} } OR direct {...}
        const plantData = data.guide || data;
        setGuide(plantData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Guide not found</Text>
      </View>
    );
  }

  // Helper to find rule for current stage
  // If no specific rule for "Vegetative", try finding "General" or fallback to first item
  const getRule = (list) => {
    if (!list || list.length === 0) return null;
    return list.find(r => r.lifeStage === activeStage) 
        || list.find(r => r.lifeStage === 'General') 
        || list[0];
  };

  const waterRule = getRule(guide.waterConfig);
  const fertRule = getRule(guide.fertilizerConfig);

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Image */}
      <Image source={{ uri: guide.image || 'https://picsum.photos/800/600' }} style={styles.hero} />
      
      <View style={styles.content}>
        {/* Title Section */}
        <Text style={styles.name}>{guide.name}</Text>
        <Text style={styles.scientific}>{guide.scientificName}</Text>

        {/* Stage Selector */}
        <Text style={styles.sectionTitle}>Select Life Stage</Text>
        <View style={styles.stageContainer}>
          {STAGES.map(stage => (
            <TouchableOpacity 
              key={stage} 
              style={[styles.stageBtn, activeStage === stage && styles.stageBtnActive]}
              onPress={() => setActiveStage(stage)}
            >
              <Text style={[styles.stageText, activeStage === stage && styles.stageTextActive]}>
                {stage}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Water Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="water" size={24} color="#3b82f6" />
            <Text style={styles.cardTitle}>Watering</Text>
          </View>
          
          {waterRule ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Amount:</Text>
                <Text style={styles.value}>{waterRule.amount}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Frequency:</Text>
                <Text style={styles.value}>{waterRule.frequency}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Season:</Text>
                <Text style={styles.value}>{Array.isArray(waterRule.season) ? waterRule.season.join(', ') : waterRule.season}</Text>
              </View>
              {waterRule.description && (
                <Text style={styles.desc}>{waterRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={styles.missing}>No specific data for {activeStage}</Text>
          )}
        </View>

        {/* Fertilizer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="leaf" size={24} color="#22c55e" />
            <Text style={styles.cardTitle}>Fertilizer</Text>
          </View>

          {fertRule ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Type:</Text>
                <Text style={styles.value}>{fertRule.type || fertRule.name || 'General'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Dosage:</Text>
                <Text style={styles.value}>{fertRule.dosage}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Frequency:</Text>
                <Text style={styles.value}>{fertRule.frequency}</Text>
              </View>
              {fertRule.description && (
                <Text style={styles.desc}>{fertRule.description}</Text>
              )}
            </>
          ) : (
            <Text style={styles.missing}>No specific data for {activeStage}</Text>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#071024' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#071024' },
  hero: { width: '100%', height: 250 },
  content: { padding: 20, marginTop: -20, backgroundColor: '#071024', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  
  name: { fontSize: 28, fontWeight: 'bold', color: '#e6eef3' },
  scientific: { fontSize: 16, color: '#94a3b8', fontStyle: 'italic', marginBottom: 20 },
  errorText: { color: '#ef4444', fontSize: 18 },

  sectionTitle: { color: '#e6eef3', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 10 },
  
  stageContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, backgroundColor: '#0f1724', padding: 4, borderRadius: 12 },
  stageBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  stageBtnActive: { backgroundColor: '#22c55e' },
  stageText: { color: '#94a3b8', fontWeight: '600' },
  stageTextActive: { color: '#071024', fontWeight: 'bold' },

  card: { backgroundColor: '#0f1724', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#e6eef3' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#94a3b8', fontSize: 14 },
  value: { color: '#e6eef3', fontWeight: '600', fontSize: 14, maxWidth: '60%', textAlign: 'right' },
  desc: { color: '#cbd5e1', marginTop: 8, fontSize: 13, fontStyle: 'italic', borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 8 },
  missing: { color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: 10 }
});
