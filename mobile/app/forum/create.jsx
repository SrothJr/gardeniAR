// // mobile/app/forum/create.jsx
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BACKEND_URL } from '../../config';

// export default function CreatePost() {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleCreate = async () => {
//     if (!title || !content) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const userStr = await AsyncStorage.getItem('user');
//       if (!userStr) {
//         Alert.alert('Error', 'You must be logged in to post');
//         router.push('/auth/login');
//         return;
//       }
//       const user = JSON.parse(userStr);

//       const response = await fetch(`${BACKEND_URL}/api/forum`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title,
//           content,
//           authorId: user._id
//         }),
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Post created successfully');
//         router.back();
//       } else {
//         const data = await response.json();
//         Alert.alert('Error', data.message || 'Failed to create post');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Title</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="What's on your mind?"
//         placeholderTextColor="#aaa"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <Text style={styles.label}>Content</Text>
//       <TextInput
//         style={StyleSheet.flatten([styles.input, styles.textArea])}
//         placeholder="Share your gardening tips or questions..."
//         placeholderTextColor="#aaa"
//         value={content}
//         onChangeText={setContent}
//         multiline
//         textAlignVertical="top"
//       />

//       <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
//         {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Post</Text>}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#071024',
//   },
//   label: {
//     color: '#10b981',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#1a202c',
//     color: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#2d3748',
//     fontSize: 16,
//   },
//   textArea: {
//     height: 150,
//   },
//   button: {
//     backgroundColor: '#10b981',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });


// mobile/app/forum/create.jsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BACKEND_URL } from '../../config';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.6,
      base64: true,
    });
    if (!result.canceled) {
      const newImages = result.assets.map(a => `data:image/jpeg;base64,${a.base64}`);
      setImages(prev => [...prev, ...newImages].slice(0, 4)); // max 4 images
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in title and content');
      return;
    }
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        Alert.alert('Error', 'You must be logged in to post');
        router.push('/auth/login');
        return;
      }
      const user = JSON.parse(userStr);

      const response = await fetch(`${BACKEND_URL}/api/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, authorId: user._id, images }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Post created!');
        router.back();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
            <Ionicons name="chevron-back" size={24} color="#9ca3af" />
          </TouchableOpacity>
          <Text style={styles.heading}>Create Post</Text>
          <TouchableOpacity onPress={handleCreate} disabled={loading} style={styles.postBtn}>
            {loading
              ? <ActivityIndicator color="#000" size="small" />
              : <Text style={styles.postBtnText}>Post</Text>
            }
          </TouchableOpacity>
        </View>

      <View style={styles.communityTag}>
        <Text style={styles.communityTagText}>🌿 r/Gardening</Text>
      </View>

      <TextInput
        style={styles.titleInput}
        placeholder="An interesting title..."
        placeholderTextColor="#4b5563"
        value={title}
        onChangeText={setTitle}
        maxLength={300}
      />
      <Text style={styles.charCount}>{title.length}/300</Text>

      <TextInput
        style={styles.bodyInput}
        placeholder="Share your gardening tips, questions or stories..."
        placeholderTextColor="#4b5563"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      {/* Images preview */}
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewRow}>
          {images.map((img, i) => (
            <View key={i} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => removeImage(i)} style={styles.removeImageBtn}>
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add image button */}
      {images.length < 4 && (
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color="#10b981" />
          <Text style={styles.addImageText}>Add Images ({images.length}/4)</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1923' },
  scroll: { padding: 16, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  cancelBtn: { padding: 6 },
  cancelText: { color: '#9ca3af', fontSize: 15 },
  heading: { color: '#f9fafb', fontSize: 17, fontWeight: '800' },
  postBtn: { backgroundColor: '#10b981', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  postBtnText: { color: '#000', fontWeight: '800', fontSize: 14 },
  communityTag: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 20,
  },
  communityTagText: { color: '#10b981', fontSize: 13, fontWeight: '700' },
  titleInput: {
    color: '#f9fafb', fontSize: 20, fontWeight: '700',
    borderBottomWidth: 1, borderBottomColor: '#2d3748',
    paddingVertical: 10, marginBottom: 4,
  },
  charCount: { color: '#4b5563', fontSize: 11, marginBottom: 16, textAlign: 'right' },
  bodyInput: {
    color: '#d1d5db', fontSize: 15, lineHeight: 22,
    minHeight: 180, paddingVertical: 8,
  },
  imagePreviewRow: { marginTop: 16, marginBottom: 8 },
  imageWrapper: { position: 'relative', marginRight: 10 },
  previewImage: { width: 100, height: 100, borderRadius: 8 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8 },
  addImageBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2d3748', borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 14, marginTop: 16,
  },
  addImageText: { color: '#10b981', fontSize: 14, fontWeight: '600', marginLeft: 8 },
});