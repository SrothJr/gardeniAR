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
  StyleSheet, Text, View, Image, TouchableOpacity, 
  ScrollView, ActivityIndicator, Alert, SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// --- 2. THE FIX: IMPORT FROM THE LEGACY PATH ---
import * as FileSystem from 'expo-file-system/legacy'; 

import { GoogleGenAI } from '@google/genai'; 

// REPLACE WITH YOUR ACTUAL KEY
const API_KEY = "AIzaSyC776W-RtDCuJEuBDE4KGsccnu0EelhLdQ"; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeLeaf = async (uri) => {
    setLoading(true);
    setResult(null);

    try {
      // Use the legacy readAsStringAsync with the string 'base64'
      const base64 = await FileSystem.readAsStringAsync(uri, { 
        encoding: 'base64' 
      });

      // Gemini 2.0 Flash call
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              { text: "Act as a plant doctor. Identify the plant and disease in this image. Provide 3 organic remedies and 1 chemical remedy. Format the output with clear headings." },
              { inlineData: { data: base64, mimeType: 'image/jpeg' } }
            ]
          }
        ]
      });

      setResult(response.text);
    } catch (error) {
      console.error("AI Error:", error);
      Alert.alert("Analysis Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (useCamera = false) => {
    const { granted } = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync() 
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      Alert.alert("Permission Error", "Camera/Gallery access is required.");
      return;
    }

    const pickerResult = await (useCamera 
      ? ImagePicker.launchCameraAsync({ quality: 0.7 }) 
      : ImagePicker.launchImageLibraryAsync({ quality: 0.7 }));

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
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
              <Text style={styles.placeholderText}>Take a photo of a leaf to begin</Text>
            </View>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btn} onPress={() => pickImage(true)}>
              <Text style={styles.btnText}>📸 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => pickImage(false)}>
              <Text style={styles.btnText}>📁 Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={styles.statusBox}>
            <ActivityIndicator size="large" color="#2ecc71" />
            <Text style={styles.statusText}>AI is scanning for diseases...</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  scrollContent: { padding: 20, alignItems: 'center' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#1b5e20', marginVertical: 20 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 15, elevation: 5 },
  preview: { width: '100%', height: 300, borderRadius: 15 },
  placeholder: { width: '100%', height: 300, borderRadius: 15, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#81c784' },
  placeholderText: { color: '#666', textAlign: 'center' },
  btnRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  btn: { flex: 1, backgroundColor: '#2e7d32', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#455a64' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  statusBox: { marginTop: 30, alignItems: 'center' },
  statusText: { marginTop: 10, color: '#2e7d32', fontWeight: '600' },
  reportCard: { width: '100%', marginTop: 25, backgroundColor: '#fff', padding: 20, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#2e7d32' },
  reportTitle: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 10 },
  reportContent: { fontSize: 16, color: '#333', lineHeight: 24 }
});