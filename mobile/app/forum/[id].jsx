import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  const fetchPost = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/forum`); // Currently fetching all, better to add getById endpoint later
      const data = await response.json();
      const foundPost = data.find(p => p._id === id); // Temporary client-side filtering
      setPost(foundPost);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    checkUser();
    fetchPost();
  }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        Alert.alert('Login Required', 'Please log in to comment.');
        router.push('/auth/login');
        return;
      }
      const user = JSON.parse(userStr);

      const response = await fetch(`${BACKEND_URL}/api/forum/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: comment,
          authorId: user._id
        }),
      });

      if (response.ok) {
        setComment('');
        fetchPost(); // Refresh
      } else {
        Alert.alert('Error', 'Failed to add comment');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
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
              const response = await fetch(`${BACKEND_URL}/api/forum/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                router.replace('/forum');
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

  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${commentId}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                fetchPost(); // Refresh
              } else {
                Alert.alert("Error", "Failed to delete comment");
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;
  if (!post) return <View style={styles.center}><Text style={styles.errorText}>Post not found</Text></View>;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Post Header */}
        <View style={styles.postCard}>
          <View style={styles.header}>
            <View>
              <Text style={styles.author}>{post.author?.name || 'Unknown'}</Text>
              <Text style={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</Text>
            </View>
            {currentUser && post.author?._id === currentUser._id && (
              <TouchableOpacity onPress={handleDeletePost}>
                <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.content}>{post.content}</Text>
        </View>

        {/* Comments Section */}
        <Text style={styles.sectionTitle}>Comments ({post.comments?.length || 0})</Text>
        {post.comments?.map((c, index) => (
          <View key={index} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{c.author?.name || 'User'}</Text>
              {currentUser && c.author?._id === currentUser._id && (
                <TouchableOpacity onPress={() => handleDeleteComment(c._id)}>
                   <Ionicons name="trash-outline" size={16} color="#ff4d4d" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>
        ))}
        {post.comments?.length === 0 && (
          <Text style={styles.emptyText}>Be the first to comment!</Text>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#aaa"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleComment} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#10b981" />
          ) : (
            <Ionicons name="send" size={24} color="#10b981" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071024',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#071024',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 18,
  },
  postCard: {
    backgroundColor: '#1a202c',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  author: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  date: {
    color: '#a0aec0',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    color: '#cbd5e0',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  commentCard: {
    backgroundColor: '#2d3748',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  emptyText: {
    color: '#aaa',
    fontStyle: 'italic',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#2d3748',
    backgroundColor: '#1a202c',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    backgroundColor: '#071024',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
});