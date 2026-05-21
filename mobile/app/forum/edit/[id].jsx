// mobile/app/forum/edit/[id].jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BACKEND_URL } from '../../../config';

export default function EditPost() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/forum/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setImages(data.images || []);
      } catch (e) {
        Alert.alert('Error', 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true,
    });
    if (!result.canceled) {
      const newImg = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImages(prev => [...prev, newImg].slice(0, 4));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);
      const res = await fetch(`${BACKEND_URL}/api/forum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, images, userId: user._id }),
      });
      if (res.ok) {
        Alert.alert('Success', 'Post updated!');
        router.back();
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message || 'Failed to update post');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#10b981" /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
            <Ionicons name="chevron-back" size={24} color="#9ca3af" />
          </TouchableOpacity>
          <Text style={styles.heading}>Edit Post</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
            {saving ? <ActivityIndicator color="#000" size="small" /> : <Text style={styles.saveBtnText}>Save</Text>}
          </TouchableOpacity>
        </View>

      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Title..."
        placeholderTextColor="#4b5563"
        maxLength={300}
      />
      <TextInput
        style={styles.bodyInput}
        value={content}
        onChangeText={setContent}
        placeholder="Content..."
        placeholderTextColor="#4b5563"
        multiline
        textAlignVertical="top"
      />

      {images.length > 0 && (
        <ScrollView horizontal style={styles.imageRow}>
          {images.map((img, i) => (
            <View key={i} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => setImages(p => p.filter((_, idx) => idx !== i))} style={styles.removeBtn}>
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {images.length < 4 && (
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={18} color="#10b981" />
          <Text style={styles.addImageText}>Add Image</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1923' },
  scroll: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1923' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  cancelBtn: { padding: 6 },
  cancelText: { color: '#9ca3af', fontSize: 15 },
  heading: { color: '#f9fafb', fontSize: 17, fontWeight: '800' },
  saveBtn: { backgroundColor: '#10b981', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  saveBtnText: { color: '#000', fontWeight: '800', fontSize: 14 },
  titleInput: {
    color: '#f9fafb', fontSize: 20, fontWeight: '700',
    borderBottomWidth: 1, borderBottomColor: '#2d3748', paddingVertical: 10, marginBottom: 16,
  },
  bodyInput: {
    color: '#d1d5db', fontSize: 15, lineHeight: 22, minHeight: 180, paddingVertical: 8,
  },
  imageRow: { marginTop: 16 },
  imageWrapper: { position: 'relative', marginRight: 10 },
  previewImage: { width: 100, height: 100, borderRadius: 8 },
  removeBtn: { position: 'absolute', top: -8, right: -8 },
  addImageBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2d3748', borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 12, marginTop: 16,
  },
  addImageText: { color: '#10b981', fontSize: 14, fontWeight: '600', marginLeft: 6 },
});