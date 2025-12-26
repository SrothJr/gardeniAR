import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForumList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/forum`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const checkUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkUser();
      fetchPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleCreatePost = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) {
      Alert.alert('Login Required', 'Please log in to start a discussion.');
      router.push('/auth/login');
      return;
    }
    router.push('/forum/create');
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/forum/${postId}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                fetchPosts(); // Refresh list
              } else {
                Alert.alert("Error", "Failed to delete post");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Something went wrong");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/forum/${item._id}`)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.author}>{item.author?.name || 'Unknown'}</Text>
          <Text style={styles.location}>
            {item.author?.location?.city ? `📍 ${item.author.location.city}` : ''}
          </Text>
        </View>
        {currentUser && item.author?._id === currentUser._id && (
          <TouchableOpacity onPress={() => handleDeletePost(item._id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.content}>{item.content}</Text>
      <View style={styles.footer}>
        <View style={styles.iconRow}>
          <Ionicons name="chatbubble-outline" size={16} color="#aaa" style={styles.icon} />
          <Text style={styles.footerText}>{item.comments?.length || 0} Comments</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
          contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No discussions yet. Start one!</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Ionicons name="add" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071024',
  },
  card: {
    backgroundColor: '#1a202c',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  author: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 14,
  },
  location: {
    color: '#a0aec0',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    color: '#cbd5e0',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2d3748',
    paddingTop: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  footerText: {
    color: '#aaa',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#10b981',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  deleteBtn: {
    padding: 5,
  }
});