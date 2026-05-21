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
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

type Plant = {
  name: string;
  companions: string[];
  avoided: string[];
};

export default function Index() {
  const { colors } = useTheme();
  const { t } = useTranslation();
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
      Alert.alert(t('companion.size_error'));
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
      Alert.alert(t('companion.select_first'), t('companion.select_hint'));
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
    if (warningMessage) Alert.alert(t('companion.bad_companion'), warningMessage);

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
    if (!plant) return colors.border;
    const neighbors = [
      [row - 1, col], [row + 1, col],
      [row, col - 1], [row, col + 1],
    ];
    for (let [r, c] of neighbors) {
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        const neighbor = grid[r][c];
        if (neighbor) {
          if (plant.avoided.includes(neighbor.name)) return '#ef4444';
          if (plant.companions.includes(neighbor.name)) return colors.primary;
        }
      }
    }
    return colors.textMuted;
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.title, { color: colors.text }]}>{t('companion.title')}</Text>

      {/* Grid size controls */}
      <View style={[styles.controlsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.controlsTitle, { color: colors.textMuted }]}>{t('companion.garden_size')}</Text>
        <View style={styles.controlsRow}>
          <View style={styles.inputGroup}>
            <Text style={[styles.controlLabel, { color: colors.textMuted }]}>{t('companion.rows')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              keyboardType="numeric"
              value={String(rows)}
              onChangeText={(t) => setRows(Number(t))}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.controlLabel, { color: colors.textMuted }]}>{t('companion.cols')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              keyboardType="numeric"
              value={String(cols)}
              onChangeText={(t) => setCols(Number(t))}
            />
          </View>
          <TouchableOpacity style={[styles.generateBtn, { backgroundColor: colors.primary }]} onPress={generateGrid}>
            <Text style={[styles.generateText, { color: '#000' }]}>{t('companion.apply')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textMuted }]}>{t('companion.good_companion')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={[styles.legendText, { color: colors.textMuted }]}>{t('companion.bad_companion')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.textMuted }]} />
          <Text style={[styles.legendText, { color: colors.textMuted }]}>{t('companion.neutral')}</Text>
        </View>
      </View>

      {/* Garden Grid */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('companion.grid_title')}</Text>
      <View style={styles.gridWrap}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const borderColor = checkStatus(rowIndex, colIndex);
              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[styles.cell, { borderColor, backgroundColor: colors.surface }]}
                  onPress={() => placePlant(rowIndex, colIndex)}
                  onLongPress={() => clearCell(rowIndex, colIndex)}
                >
                  {cell ? (
                    <>
                      <Image source={getPlantImage(cell.name)} style={styles.cellImage} />
                      <Text style={[styles.cellText, { color: colors.textMuted }]} numberOfLines={1}>{cell.name}</Text>
                    </>
                  ) : (
                    <Text style={[styles.cellPlus, { color: colors.border }]}>+</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <Text style={[styles.hint, { color: colors.textMuted }]}>{t('companion.grid_hint')}</Text>

      {/* Plant List */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('companion.plant_list')}</Text>
      <View style={styles.plantGrid}>
        {plants.map((plant) => {
          const isSelected = selectedPlant?.name === plant.name;
          return (
            <TouchableOpacity
              key={plant.name}
              style={[
                styles.plantCard, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => selectPlant(plant)}
            >
              <Image source={getPlantImage(plant.name)} style={styles.plantImage} />
              <Text style={[styles.plantName, { color: colors.text }, isSelected && { color: '#000' }]}>
                {plant.name}
              </Text>
              {isSelected && <View style={[styles.selectedDot, { backgroundColor: '#000' }]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Info Box */}
      {selectedPlant && (
        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>{t('companion.guide_title', { name: selectedPlant.name })}</Text>

          <Text style={[styles.goodTitle, { color: colors.primary }]}>{t('companion.good_title')}</Text>
          <View style={styles.tagRow}>
            {selectedPlant.companions.map((c) => (
              <Text key={c} style={[styles.goodTag, { backgroundColor: colors.primary + '15', color: colors.primary, borderColor: colors.primary + '30' }]}>{c}</Text>
            ))}
          </View>

          <Text style={styles.badTitle}>{t('companion.bad_title')}</Text>
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
  container: { flex: 1, padding: 16 },

  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 },

  // Controls
  controlsCard: { borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1 },
  controlsTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  inputGroup: { alignItems: 'center', gap: 4 },
  controlLabel: { fontSize: 11 },
  input: { width: 52, paddingVertical: 6, borderRadius: 8, textAlign: 'center', fontSize: 15, fontWeight: '700', borderWidth: 1 },
  generateBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginLeft: 'auto' },
  generateText: { fontWeight: '800', fontSize: 13 },

  // Legend
  legend: { flexDirection: 'row', gap: 14, marginBottom: 12, paddingHorizontal: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 99 },
  legendText: { fontSize: 11 },

  sectionTitle: { fontSize: 15, fontWeight: '700', marginVertical: 10, letterSpacing: 0.2 },

  // Grid
  gridWrap: { alignItems: 'center' },
  row: { flexDirection: 'row' },
  cell: {
    width: 58, height: 58, borderWidth: 2, margin: 3,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 10,
  },
  cellImage: { width: 28, height: 28 },
  cellText: { fontSize: 7, marginTop: 2, maxWidth: 54, textAlign: 'center' },
  cellPlus: { fontSize: 20, fontWeight: '300' },
  hint: { fontSize: 11, textAlign: 'center', marginTop: 6, marginBottom: 4 },

  // Plant picker
  plantGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  plantCard: {
    width: '30%', paddingVertical: 12, paddingHorizontal: 6,
    borderRadius: 14, alignItems: 'center',
    borderWidth: 1,
  },
  selectedPlantCard: { },
  plantImage: { width: 44, height: 44 },
  plantName: { fontSize: 11, fontWeight: '700', marginTop: 6 },
  selectedDot: { width: 6, height: 6, borderRadius: 99, marginTop: 4 },

  // Info box
  infoBox: { marginTop: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  infoTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  goodTitle: { fontWeight: '700', fontSize: 13 },
  badTitle: { color: '#f87171', fontWeight: '700', marginTop: 10, fontSize: 13 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6, gap: 6 },
  goodTag: { borderWidth: 1, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 99, fontSize: 12 },
  badTag: { backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 99, fontSize: 12, color: '#f87171' },
});