// // mobile/app/forum/index.jsx
// import React, { useState, useCallback } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
// import { useRouter, useFocusEffect } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { BACKEND_URL } from '../../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function ForumList() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const router = useRouter();

//   const fetchPosts = async () => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/forum`);
//       const data = await response.json();
//       setPosts(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const checkUser = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem('user');
//       if (userStr) {
//         setCurrentUser(JSON.parse(userStr));
//       } else {
//         setCurrentUser(null);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       checkUser();
//       fetchPosts();
//     }, [])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchPosts();
//   };

//   const handleCreatePost = async () => {
//     const userStr = await AsyncStorage.getItem('user');
//     if (!userStr) {
//       Alert.alert('Login Required', 'Please log in to start a discussion.');
//       router.push('/auth/login');
//       return;
//     }
//     router.push('/forum/create');
//   };

//   const handleDeletePost = async (postId) => {
//     Alert.alert(
//       "Delete Post",
//       "Are you sure you want to delete this post?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const response = await fetch(`${BACKEND_URL}/api/forum/${postId}`, {
//                 method: 'DELETE',
//               });
//               if (response.ok) {
//                 fetchPosts(); // Refresh list
//               } else {
//                 Alert.alert("Error", "Failed to delete post");
//               }
//             } catch (error) {
//               console.error(error);
//               Alert.alert("Error", "Something went wrong");
//             }
//           }
//         }
//       ]
//     );
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.card} 
//       onPress={() => router.push(`/forum/${item._id}`)}
//     >
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.author}>{item.author?.name || 'Unknown'}</Text>
//           <Text style={styles.location}>
//             {item.author?.location?.city ? `📍 ${item.author.location.city}` : ''}
//           </Text>
//         </View>
//         {currentUser && item.author?._id === currentUser._id && (
//           <TouchableOpacity onPress={() => handleDeletePost(item._id)} style={styles.deleteBtn}>
//             <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
//           </TouchableOpacity>
//         )}
//       </View>
//       <Text style={styles.title}>{item.title}</Text>
//       <Text numberOfLines={2} style={styles.content}>{item.content}</Text>
//       <View style={styles.footer}>
//         <View style={styles.iconRow}>
//           <Ionicons name="chatbubble-outline" size={16} color="#aaa" style={styles.icon} />
//           <Text style={styles.footerText}>{item.comments?.length || 0} Comments</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(item) => item._id}
//           renderItem={renderItem}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
//           contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
//           ListEmptyComponent={<Text style={styles.emptyText}>No discussions yet. Start one!</Text>}
//         />
//       )}

//       <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
//         <Ionicons name="add" size={30} color="#000" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#071024',
//   },
//   card: {
//     backgroundColor: '#1a202c',
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#2d3748',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   author: {
//     color: '#10b981',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   location: {
//     color: '#a0aec0',
//     fontSize: 12,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   content: {
//     color: '#cbd5e0',
//     fontSize: 14,
//     marginBottom: 10,
//     lineHeight: 20,
//   },
//   footer: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#2d3748',
//     paddingTop: 10,
//   },
//   iconRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   icon: {
//     marginRight: 5,
//   },
//   footerText: {
//     color: '#aaa',
//     fontSize: 12,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 30,
//     right: 30,
//     backgroundColor: '#10b981',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   emptyText: {
//     color: '#aaa',
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//   },
//   deleteBtn: {
//     padding: 5,
//   }
// });

// mobile/app/forum/index.jsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from '../../components/UserAvatar';

const SORT_OPTIONS = ['New', 'Top', 'Upvoted'];

export default function ForumList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sort, setSort] = useState('New');
  const router = useRouter();

  const fetchPosts = async (sortMode = sort) => {
    try {
      const sortParam = sortMode.toLowerCase();
      const response = await fetch(`${BACKEND_URL}/api/forum?sort=${sortParam}`);
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
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
    } catch (e) { console.error(e); }
  };

  useFocusEffect(
    useCallback(() => {
      checkUser();
      fetchPosts();
    }, [sort])
  );

  const onRefresh = () => { setRefreshing(true); fetchPosts(); };

  const handleSortChange = (s) => {
    setSort(s);
    setLoading(true);
    fetchPosts(s);
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

  const handleVote = async (postId, vote, e) => {
    e.stopPropagation();
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) { Alert.alert('Login Required', 'Please log in to vote.'); return; }
    const user = JSON.parse(userStr);
    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, vote }),
      });
      if (res.ok) {
        const { upvotes, downvotes } = await res.json();
        setPosts(prev => prev.map(p =>
          p._id === postId ? { ...p, upvotes, downvotes } : p
        ));
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = async (postId, e) => {
    e.stopPropagation();
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) { Alert.alert('Login Required', 'Please log in to save posts.'); return; }
    const user = JSON.parse(userStr);
    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${postId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) {
        const { savedBy } = await res.json();
        setPosts(prev => prev.map(p =>
          p._id === postId ? { ...p, savedBy } : p
        ));
      }
    } catch (err) { console.error(err); }
  };

  const renderItem = ({ item }) => {
    const score = (item.upvotes?.length || 0) - (item.downvotes?.length || 0);
    const userVotedUp = currentUser && item.upvotes?.includes(currentUser._id);
    const userVotedDown = currentUser && item.downvotes?.includes(currentUser._id);
    const isSaved = currentUser && item.savedBy?.includes(currentUser._id);
    const timeAgo = getTimeAgo(item.createdAt);

    return (
      <TouchableOpacity style={styles.card} onPress={() => router.push(`/forum/${item._id}`)}>
        {/* Vote column */}
        <View style={styles.voteColumn}>
          <TouchableOpacity onPress={(e) => handleVote(item._id, 'up', e)} style={styles.voteBtn}>
            <Ionicons name="arrow-up" size={22} color={userVotedUp ? '#ff6314' : '#6b7280'} />
          </TouchableOpacity>
          <Text style={[styles.score, userVotedUp && styles.scoreUp, userVotedDown && styles.scoreDown]}>
            {score}
          </Text>
          <TouchableOpacity onPress={(e) => handleVote(item._id, 'down', e)} style={styles.voteBtn}>
            <Ionicons name="arrow-down" size={22} color={userVotedDown ? '#7b68ee' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.metaRow}>
            <UserAvatar
              userId={item.author?._id}
              name={item.author?.name}
              picture={item.author?.profilePicture}
              size={22}
            />
            <Text style={styles.meta}>
              {'  '}🌿 r/Gardening • <Text style={styles.metaAuthor}>u/{item.author?.name || 'Unknown'}</Text> • {timeAgo}
            </Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.content}>{item.content}</Text>

          {/* Footer actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerBtn} onPress={() => router.push(`/forum/${item._id}`)}>
              <Ionicons name="chatbubble-outline" size={14} color="#6b7280" />
              <Text style={styles.footerText}>{item.comments?.length || 0} Comments</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerBtn} onPress={(e) => handleSave(item._id, e)}>
              <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={14} color={isSaved ? '#10b981' : '#6b7280'} />
              <Text style={[styles.footerText, isSaved && { color: '#10b981' }]}>{isSaved ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerBtn}>
              <Ionicons name="share-social-outline" size={14} color="#6b7280" />
              <Text style={styles.footerText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.communityName}>🌿 r/Gardening</Text>
            <Text style={styles.communityDesc}>A community for garden lovers</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color="#10b981" />
          </TouchableOpacity>
        </View>

        {/* Sort bar */}
        <View style={styles.sortBar}>
          {SORT_OPTIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.sortBtn, sort === s && styles.sortBtnActive]}
              onPress={() => handleSortChange(s)}
            >
              <Ionicons
                name={s === 'New' ? 'time-outline' : s === 'Top' ? 'trophy-outline' : 'arrow-up-outline'}
                size={14}
                color={sort === s ? '#10b981' : '#6b7280'}
              />
              <Text style={[styles.sortText, sort === s && styles.sortTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No discussions yet. Start one!</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Ionicons name="add" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1923' },
  header: { backgroundColor: '#1a2535', borderBottomWidth: 1, borderBottomColor: '#2d3748', paddingBottom: 8 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  communityName: { color: '#fff', fontSize: 20, fontWeight: '900' },
  communityDesc: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  notifBtn: { padding: 6 },
  sortBar: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 4 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  sortBtnActive: { backgroundColor: 'rgba(16,185,129,0.15)' },
  sortText: { color: '#6b7280', fontSize: 13, fontWeight: '600', marginLeft: 4 },
  sortTextActive: { color: '#10b981' },
  card: { flexDirection: 'row', backgroundColor: '#1a2535', paddingVertical: 10 },
  voteColumn: { width: 48, alignItems: 'center', paddingTop: 10, paddingHorizontal: 4 },
  voteBtn: { padding: 4 },
  score: { color: '#d1d5db', fontSize: 13, fontWeight: '700', marginVertical: 2 },
  scoreUp: { color: '#ff6314' },
  scoreDown: { color: '#7b68ee' },
  cardContent: { flex: 1, paddingRight: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  meta: { color: '#6b7280', fontSize: 11, flex: 1, flexWrap: 'wrap' },
  metaAuthor: { color: '#9ca3af', fontWeight: '600' },
  title: { color: '#f3f4f6', fontSize: 16, fontWeight: '700', marginBottom: 4, lineHeight: 22 },
  content: { color: '#9ca3af', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  footerText: { color: '#6b7280', fontSize: 12, marginLeft: 4, fontWeight: '600' },
  separator: { height: 6, backgroundColor: '#0f1923' },
  fab: {
    position: 'absolute', bottom: 30, right: 20,
    backgroundColor: '#10b981', width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#10b981', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 5,
  },
  emptyText: { color: '#6b7280', textAlign: 'center', marginTop: 60, fontSize: 16 },
});