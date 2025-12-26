import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';

type Plant = {
  name: string;
  companions: string[];
  avoided: string[];
};

const GRID_SIZE = 5;

export default function Index() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [grid, setGrid] = useState<(Plant | null)[][]>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null))
  );

  const API_URL = 'http://192.168.0.103:5000/api/companions';

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await axios.get(API_URL);
      setPlants(res.data);
    } catch (err) {
      console.log('Error fetching plants', err);
    }
  };

  const selectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setModalVisible(false);
  };

  const placePlant = (row: number, col: number) => {
    if (!selectedPlant) {
      Alert.alert('Select a plant from the plant list first');
      return;
    }

    const neighbors = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];

    let warningMessage = '';

    for (let [r, c] of neighbors) {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        const neighbor = grid[r][c];
        if (neighbor && selectedPlant.avoided.includes(neighbor.name)) {
          warningMessage = `⚠️ Warning: ${selectedPlant.name} should not be placed next to ${neighbor.name} because both are susceptible to the same devastating diseases. Consider choosing a different plant or location.`;
          break;
        }
      }
    }

    if (warningMessage) {
      Alert.alert('Bad Companion Warning', warningMessage);
    }

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = selectedPlant;
    setGrid(newGrid);
  };

  const checkStatus = (row: number, col: number) => {
    const plant = grid[row][col];
    if (!plant) return '#ccc';

    const neighbors = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];

    for (let [r, c] of neighbors) {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        const neighbor = grid[r][c];
        if (neighbor) {
          if (plant.avoided.includes(neighbor.name)) return 'red';
          if (plant.companions.includes(neighbor.name)) return 'green';
        }
      }
    }
    return '#999';
  };

  const getPlantImage = (name: string) => {
    switch (name) {
      case 'Tomato':
        return require('../../assets/images/tomato.png');
      case 'Basil':
        return require('../../assets/images/basil.png');
      case 'Carrot':
        return require('../../assets/images/carrot.png');
      case 'Lettuce':
        return require('../../assets/images/lettuce.png');
      case 'Potato':
        return require('../../assets/images/potato.png');
      case 'Cucumber':
        return require('../../assets/images/cucumber.png');
      case 'Pepper':
        return require('../../assets/images/pepper.png');
      default:
        return require('../../assets/images/tomato.png');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌱 Garden Planner</Text>

      {/* 🧩 Garden Grid */}
      <Text style={styles.sectionTitle}>🧩 Garden Grid (5 × 5)</Text>

      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.cell,
                { borderColor: checkStatus(rowIndex, colIndex) },
              ]}
              onPress={() => placePlant(rowIndex, colIndex)}
            >
              {cell && (
                <>
                  <Image
                    source={getPlantImage(cell.name)}
                    style={styles.cellImage}
                  />
                  <Text style={styles.cellText}>{cell.name}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* 🌼 Plant List */}
      <Text style={styles.sectionTitle}>🌼 Plant List</Text>

      <View style={styles.plantGrid}>
        {plants.map((plant) => {
          const isSelected = selectedPlant?.name === plant.name;

          return (
            <TouchableOpacity
              key={plant.name}
              style={[
                styles.plantCard,
                isSelected && styles.selectedPlantCard,
              ]}
              onPress={() => selectPlant(plant)}
            >
              <Image
                source={getPlantImage(plant.name)}
                style={styles.plantImage}
              />
              <Text style={styles.plantName}>{plant.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🌿 Companion & Avoid Info */}
      {selectedPlant && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            🌱 {selectedPlant.name} Planting Guide
          </Text>

          <Text style={styles.goodTitle}>🟢 Good Companions</Text>
          <View style={styles.tagRow}>
            {selectedPlant.companions.map((c) => (
              <Text key={c} style={styles.goodTag}>
                {c}
              </Text>
            ))}
          </View>

          <Text style={styles.badTitle}>🔴 Avoid Planting With</Text>
          <View style={styles.tagRow}>
            {selectedPlant.avoided.map((a) => (
              <Text key={a} style={styles.badTag}>
                {a}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Modal (optional) */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={plants}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.plantItem}
                onPress={() => selectPlant(item)}
              >
                <Text style={styles.plantItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F1F8E9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 60,
    height: 60,
    borderWidth: 3,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cellImage: {
    width: 30,
    height: 30,
  },
  cellText: {
    fontSize: 8,
  },
  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  plantCard: {
    width: '30%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  selectedPlantCard: {
    backgroundColor: '#FFEB3B',
    borderColor: '#FBC02D',
    borderWidth: 2,
  },
  plantImage: {
    width: 45,
    height: 45,
  },
  plantName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goodTitle: {
    color: 'green',
    fontWeight: 'bold',
  },
  badTitle: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  goodTag: {
    backgroundColor: '#C8E6C9',
    padding: 6,
    borderRadius: 15,
    margin: 4,
    fontSize: 12,
  },
  badTag: {
    backgroundColor: '#FFCDD2',
    padding: 6,
    borderRadius: 15,
    margin: 4,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  plantItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  plantItemText: {
    fontSize: 16,
  },
});