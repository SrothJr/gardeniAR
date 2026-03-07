// --- 1. POLYFILLS (MUST BE AT THE VERY TOP) ---
import * as Crypto from 'expo-crypto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (byteArray) => {
      const randomBytes = Crypto.getRandomBytes(byteArray.length);
      for (let i = 0; i < byteArray.length; i++) {
        byteArray[i] = randomBytes[i];
      }
      return byteArray;
    },
  };
}

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { GoogleGenAI } from '@google/genai';

// 🔑 YOUR API KEY
const API_KEY = 'AIzaSyDWsBVYJgS6c18qCraYGv8ktfghbZ-vWvM';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeLeaf = async (uri) => {
    setLoading(true);
    setResult(null);

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  'Act as a plant doctor. Identify the plant and disease in this image. Provide 3 organic remedies and 1 chemical remedy. Format with clear headings.',
              },
              {
                inlineData: {
                  data: base64,
                  mimeType: 'image/jpeg',
                },
              },
            ],
          },
        ],
      });

      setResult(response.text);
    } catch (err) {
      console.error(err);
      Alert.alert('Analysis Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (useCamera = false) => {
    const { granted } = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      Alert.alert('Permission Required', 'Camera/Gallery access is required.');
      return;
    }

    const result = await (useCamera
      ? ImagePicker.launchCameraAsync({ quality: 0.7 })
      : ImagePicker.launchImageLibraryAsync({ quality: 0.7 }));

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      analyzeLeaf(uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>🌿 PlantDoctor AI</Text>

        <View style={styles.card}>
          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Take a photo of a leaf to begin
              </Text>
            </View>
          )}

          {/* BUTTONS */}
          <View style={styles.btnColumn}>
            <TouchableOpacity
              style={styles.btnFull}
              onPress={() => pickImage(true)}
            >
              <Text style={styles.btnText}>📸 Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnFull, styles.btnSecondary]}
              onPress={() => pickImage(false)}
            >
              <Text style={styles.btnText}>📁 Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={styles.statusBox}>
            <ActivityIndicator size="large" color="#2ecc71" />
            <Text style={styles.statusText}>
              AI is scanning for diseases...
            </Text>
          </View>
        )}

        {result && (
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>Diagnosis Report</Text>
            <Text style={styles.reportContent}>{result}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },

  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },

  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginVertical: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    elevation: 5,
  },

  preview: {
    width: '100%',
    height: 300,
    borderRadius: 15,
  },

  placeholder: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#81c784',
  },

  placeholderText: {
    color: '#666',
    textAlign: 'center',
  },

  btnColumn: {
    marginTop: 15,
    width: '100%',
  },

  btnFull: {
    width: '100%',
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  btnSecondary: {
    backgroundColor: '#455a64',
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  statusBox: {
    marginTop: 30,
    alignItems: 'center',
  },

  statusText: {
    marginTop: 10,
    color: '#2e7d32',
    fontWeight: '600',
  },

  reportCard: {
    width: '100%',
    marginTop: 25,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#2e7d32',
  },

  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 10,
  },

  reportContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
