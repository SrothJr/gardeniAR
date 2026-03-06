import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { BACKEND } from '../../config';

type Plant = {
  name: string;
  companions: string[];
  avoided: string[];
};

export default function Index() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [grid, setGrid] = useState<(Plant | null)[][]>(
    Array(5).fill(null).map(() => Array(5).fill(null))
  );

  useEffect(() => {
    fetchPlants();
  }, []);

  // ✅ Uses BACKEND from config — same as the working old file
  const fetchPlants = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/companions`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      console.log('Error fetching plants', err);
    }
  };

  const selectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
  };

  // ✅ Dynamic grid size from new file — but keeps existing plants if they fit
  const generateGrid = () => {
    const r = Number(rows);
    const c = Number(cols);
    if (r <= 0 || c <= 0 || r > 10 || c > 10) {
      Alert.alert('Enter values between 1 and 10');
      return;
    }
    // Preserve existing plants that still fit in new dimensions
    const newGrid = Array(r).fill(null).map((_, ri) =>
      Array(c).fill(null).map((_, ci) =>
        ri < grid.length && ci < grid[0].length ? grid[ri][ci] : null
      )
    );
    setGrid(newGrid);
  };

  const placePlant = (row: number, col: number) => {
    if (!selectedPlant) {
      Alert.alert('Select a plant first', 'Tap a plant from the Plant List below.');
      return;
    }
    const neighbors = [
      [row - 1, col], [row + 1, col],
      [row, col - 1], [row, col + 1],
    ];
    let warningMessage = '';
    for (let [r, c] of neighbors) {
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        const neighbor = grid[r][c];
        if (neighbor && selectedPlant.avoided.includes(neighbor.name)) {
          warningMessage = `⚠️ Warning: ${selectedPlant.name} should not be placed next to ${neighbor.name} because both are susceptible to the same devastating diseases. Consider choosing a different plant or location.`;
          break;
        }
      }
    }
    if (warningMessage) Alert.alert('Bad Companion Warning', warningMessage);

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = selectedPlant;
    setGrid(newGrid);
  };

  const clearCell = (row: number, col: number) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = null;
    setGrid(newGrid);
  };

  const checkStatus = (row: number, col: number) => {
    const plant = grid[row][col];
    if (!plant) return '#1e293b';
    const neighbors = [
      [row - 1, col], [row + 1, col],
      [row, col - 1], [row, col + 1],
    ];
    for (let [r, c] of neighbors) {
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        const neighbor = grid[r][c];
        if (neighbor) {
          if (plant.avoided.includes(neighbor.name)) return '#ef4444';
          if (plant.companions.includes(neighbor.name)) return '#22c55e';
        }
      }
    }
    return '#475569';
  };

  // ✅ Same getPlantImage as old working file
  const getPlantImage = (name: string) => {
    switch (name) {
      case 'Tomato':   return require('../../assets/images/tomato.png');
      case 'Basil':    return require('../../assets/images/basil.png');
      case 'Carrot':   return require('../../assets/images/carrot.png');
      case 'Lettuce':  return require('../../assets/images/lettuce.png');
      case 'Potato':   return require('../../assets/images/potato.png');
      case 'Cucumber': return require('../../assets/images/cucumber.png');
      case 'Pepper':   return require('../../assets/images/pepper.png');
      default:         return require('../../assets/images/tomato.png');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>🌱 Garden Planner</Text>

      {/* Grid size controls */}
      <View style={styles.controlsCard}>
        <Text style={styles.controlsTitle}>Garden Size</Text>
        <View style={styles.controlsRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.controlLabel}>Rows</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(rows)}
              onChangeText={(t) => setRows(Number(t))}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.controlLabel}>Columns</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(cols)}
              onChangeText={(t) => setCols(Number(t))}
            />
          </View>
          <TouchableOpacity style={styles.generateBtn} onPress={generateGrid}>
            <Text style={styles.generateText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>Good companion</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Bad companion</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#475569' }]} />
          <Text style={styles.legendText}>Neutral</Text>
        </View>
      </View>

      {/* Garden Grid */}
      <Text style={styles.sectionTitle}>🧩 Garden Grid</Text>
      <View style={styles.gridWrap}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const borderColor = checkStatus(rowIndex, colIndex);
              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[styles.cell, { borderColor }]}
                  onPress={() => placePlant(rowIndex, colIndex)}
                  onLongPress={() => clearCell(rowIndex, colIndex)}
                >
                  {cell ? (
                    <>
                      <Image source={getPlantImage(cell.name)} style={styles.cellImage} />
                      <Text style={styles.cellText} numberOfLines={1}>{cell.name}</Text>
                    </>
                  ) : (
                    <Text style={styles.cellPlus}>+</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <Text style={styles.hint}>Long press a cell to remove a plant</Text>

      {/* Plant List */}
      <Text style={styles.sectionTitle}>🌼 Plant List</Text>
      <View style={styles.plantGrid}>
        {plants.map((plant) => {
          const isSelected = selectedPlant?.name === plant.name;
          return (
            <TouchableOpacity
              key={plant.name}
              style={[styles.plantCard, isSelected && styles.selectedPlantCard]}
              onPress={() => selectPlant(plant)}
            >
              <Image source={getPlantImage(plant.name)} style={styles.plantImage} />
              <Text style={[styles.plantName, isSelected && { color: '#071024' }]}>
                {plant.name}
              </Text>
              {isSelected && <View style={styles.selectedDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Info Box */}
      {selectedPlant && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🌱 {selectedPlant.name} Planting Guide</Text>

          <Text style={styles.goodTitle}>🟢 Good Companions</Text>
          <View style={styles.tagRow}>
            {selectedPlant.companions.map((c) => (
              <Text key={c} style={styles.goodTag}>{c}</Text>
            ))}
          </View>

          <Text style={styles.badTitle}>🔴 Avoid Planting With</Text>
          <View style={styles.tagRow}>
            {selectedPlant.avoided.map((a) => (
              <Text key={a} style={styles.badTag}>{a}</Text>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071024', padding: 16 },

  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 16, color: '#e6eef3', letterSpacing: -0.5 },

  // Controls
  controlsCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#1e293b' },
  controlsTitle: { color: '#94a3b8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  inputGroup: { alignItems: 'center', gap: 4 },
  controlLabel: { color: '#64748b', fontSize: 11 },
  input: { backgroundColor: '#1e293b', color: '#e5e7eb', width: 52, paddingVertical: 6, borderRadius: 8, textAlign: 'center', fontSize: 15, fontWeight: '700', borderWidth: 1, borderColor: '#334155' },
  generateBtn: { backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginLeft: 'auto' },
  generateText: { color: '#071024', fontWeight: '800', fontSize: 13 },

  // Legend
  legend: { flexDirection: 'row', gap: 14, marginBottom: 12, paddingHorizontal: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 99 },
  legendText: { color: '#64748b', fontSize: 11 },

  sectionTitle: { fontSize: 15, fontWeight: '700', marginVertical: 10, color: '#e2e8f0', letterSpacing: 0.2 },

  // Grid
  gridWrap: { alignItems: 'center' },
  row: { flexDirection: 'row' },
  cell: {
    width: 58, height: 58, borderWidth: 2, margin: 3,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0f172a', borderRadius: 10,
  },
  cellImage: { width: 28, height: 28 },
  cellText: { fontSize: 7, color: '#94a3b8', marginTop: 2, maxWidth: 54, textAlign: 'center' },
  cellPlus: { fontSize: 20, color: '#1e293b', fontWeight: '300' },
  hint: { color: '#334155', fontSize: 11, textAlign: 'center', marginTop: 6, marginBottom: 4 },

  // Plant picker
  plantGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  plantCard: {
    width: '30%', paddingVertical: 12, paddingHorizontal: 6,
    borderRadius: 14, alignItems: 'center',
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
  },
  selectedPlantCard: { backgroundColor: '#22c55e', borderColor: '#16a34a' },
  plantImage: { width: 44, height: 44 },
  plantName: { fontSize: 11, fontWeight: '700', color: '#e5e7eb', marginTop: 6 },
  selectedDot: { width: 6, height: 6, borderRadius: 99, backgroundColor: '#071024', marginTop: 4 },

  // Info box
  infoBox: { marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b' },
  infoTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10, color: '#e5e7eb' },
  goodTitle: { color: '#4ade80', fontWeight: '700', fontSize: 13 },
  badTitle: { color: '#f87171', fontWeight: '700', marginTop: 10, fontSize: 13 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6, gap: 6 },
  goodTag: { backgroundColor: 'rgba(34,197,94,0.15)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 99, fontSize: 12, color: '#4ade80' },
  badTag: { backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 99, fontSize: 12, color: '#f87171' },
});