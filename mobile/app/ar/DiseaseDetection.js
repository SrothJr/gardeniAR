// ar/DiseaseDetection.js
// --- 1. POLYFILLS (MUST BE AT THE VERY TOP) ---
import { Buffer } from 'buffer';

global.Buffer = Buffer;
if (!global.crypto) global.crypto = {};
if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePremium } from '../../hooks/usePremium';

const API_KEY =
  process.env.EXPO_PUBLIC_AR_GEMINI_API_KEY ||
  process.env.EXPO_PUBLIC_GENAI_API_KEY ||
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
  (Constants?.expoConfig?.extra &&
    (Constants.expoConfig.extra.AR_GEMINI_API_KEY ||
     Constants.expoConfig.extra.GENAI_API_KEY ||
     Constants.expoConfig.extra.GEMINI_API_KEY ||
     Constants.expoConfig.extra.GOOGLE_API_KEY)) ||
  '';
const GENAI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const GENAI_MODEL_PRIMARY = 'gemini-2.5-flash';
const GENAI_MODEL_FALLBACK = 'gemini-1.5-flash';

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isPremium, loaded } = usePremium();

  React.useEffect(() => {
    if (loaded && !isPremium) {
      router.replace('/premium');
    }
  }, [loaded, isPremium]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#071024', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#22c55e" size="large" />
      </View>
    );
  }

  const analyzeLeaf = async (uri) => {
    if (!API_KEY) {
      Alert.alert(
        'Configuration Error',
        'Missing GENAI API key. Set EXPO_PUBLIC_GENAI_API_KEY or extra.GENAI_API_KEY.'
      );
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      const body = {
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
      };

      const doCall = async (model) => {
        const url = `${GENAI_BASE}/${model}:generateContent?key=${API_KEY}`;
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        return r;
      };

      let res = await doCall(GENAI_MODEL_PRIMARY);
      if (!res.ok && res.status === 404) {
        res = await doCall(GENAI_MODEL_FALLBACK);
      }
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`GenAI error ${res.status}: ${txt}`);
      }
      const json = await res.json();
      const text =
        json?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || '')
          .join('')
          .trim() || 'No response';
      setResult(text);
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
    backgroundColor: '#071024',
  },

  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },

  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e6eef3',
    marginVertical: 10,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.16)',
    borderRadius: 16,
    padding: 14,
  },

  preview: {
    width: '100%',
    height: 300,
    borderRadius: 14,
  },

  placeholder: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    backgroundColor: 'rgba(34,197,94,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(34,197,94,0.35)',
  },

  placeholderText: {
    color: '#9fb1be',
    textAlign: 'center',
  },

  btnColumn: {
    marginTop: 15,
    width: '100%',
  },

  btnFull: {
    width: '100%',
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  btnSecondary: {
    backgroundColor: 'rgba(59,130,246,0.18)',
  },

  btnText: {
    color: '#051013',
    fontWeight: '900',
    fontSize: 15,
  },

  statusBox: {
    marginTop: 30,
    alignItems: 'center',
  },

  statusText: {
    marginTop: 10,
    color: '#93c5fd',
    fontWeight: '600',
  },

  reportCard: {
    width: '100%',
    marginTop: 25,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.16)',
    padding: 16,
    borderRadius: 16,
  },

  reportTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#e6eef3',
    marginBottom: 10,
  },

  reportContent: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
});
