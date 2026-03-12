// mobile/app/user/[id].jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, ActivityIndicator, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../../config';

const TABS = ['Posts', 'Comments'];

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Posts');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) setCurrentUser(JSON.parse(userStr));
      fetchProfile();
    };
    init();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/profile/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setPosts(data.posts || []);
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#10b981" />
    </View>
  );

  if (!profile) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>User not found</Text>
    </View>
  );

  const isOwnProfile = currentUser?._id === id;

  const renderPost = (item) => (
    <TouchableOpacity
      key={item._id}
      style={styles.activityItem}
      onPress={() => router.push(`/forum/${item._id}`)}
    >
      <Text style={styles.activityTitle} numberOfLines={2}>{item.title}</Text>
      <View style={styles.activityMeta}>
        <View style={styles.metaChip}>
          <Ionicons name="arrow-up" size={12} color="#10b981" />
          <Text style={styles.metaChipText}>
            {(item.upvotes?.length || 0) - (item.downvotes?.length || 0)}
          </Text>
        </View>
        <View style={styles.metaChip}>
          <Ionicons name="chatbubble-outline" size={12} color="#6b7280" />
          <Text style={styles.metaChipText}>{item.comments?.length || 0}</Text>
        </View>
        <Text style={styles.activityDate}>{getTimeAgo(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderComment = (item) => (
    <TouchableOpacity
      key={item._id}
      style={styles.activityItem}
      onPress={() => router.push(`/forum/${item.postId}`)}
    >
      <Text style={styles.activityTitle} numberOfLines={2}>💬 {item.text}</Text>
      <Text style={styles.activitySub} numberOfLines={1}>on: {item.postTitle}</Text>
      <View style={styles.activityMeta}>
        <View style={styles.metaChip}>
          <Ionicons name="arrow-up" size={12} color="#10b981" />
          <Text style={styles.metaChipText}>
            {(item.upvotes?.length || 0) - (item.downvotes?.length || 0)}
          </Text>
        </View>
        <Text style={styles.activityDate}>{getTimeAgo(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#f9fafb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>u/{profile.name}</Text>
        {isOwnProfile ? (
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.editBtn}>
            <Ionicons name="settings-outline" size={22} color="#10b981" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            {profile.profilePicture ? (
              <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.placeholderText}>
                  {profile.name?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.displayName}>{profile.name}</Text>

          {/* Karma + join date */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="leaf" size={16} color="#10b981" />
              <Text style={styles.statValue}>{profile.karma || 0}</Text>
              <Text style={styles.statLabel}>Karma</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
              <Text style={styles.statValue}>
                {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="document-text-outline" size={16} color="#6b7280" />
              <Text style={styles.statValue}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>

          {/* Bio */}
          {profile.bio ? (
            <View style={styles.bioBox}>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          ) : (
            <Text style={styles.noBio}>
              {isOwnProfile ? 'Add a bio in your profile settings.' : 'This user has no bio yet.'}
            </Text>
          )}

          {/* City */}
          {profile.location?.city && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text style={styles.locationText}>{profile.location.city}</Text>
            </View>
          )}

          {/* Own profile button */}
          {isOwnProfile && (
            <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('/profile')}>
              <Ionicons name="pencil-outline" size={15} color="#000" />
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Activity tabs */}
        <View style={styles.tabBar}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
              <Text style={[styles.tabCount, activeTab === t && styles.tabCountActive]}>
                {t === 'Posts' ? posts.length : comments.length}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity list */}
        <View style={styles.activityList}>
          {activeTab === 'Posts' && (
            posts.length === 0
              ? <Text style={styles.emptyText}>No posts yet 🌱</Text>
              : posts.map(renderPost)
          )}
          {activeTab === 'Comments' && (
            comments.length === 0
              ? <Text style={styles.emptyText}>No comments yet</Text>
              : comments.map(renderComment)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f1923' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1923' },
  errorText: { color: '#ef4444', fontSize: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#1a2535', borderBottomWidth: 1, borderBottomColor: '#2d3748',
  },
  headerTitle: { color: '#f9fafb', fontSize: 16, fontWeight: '800' },
  backBtn: { padding: 6 },
  editBtn: { padding: 6 },
  scroll: { padding: 16, paddingBottom: 60 },

  profileCard: {
    backgroundColor: '#1a2535', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#2d3748', alignItems: 'center', marginBottom: 20,
  },
  avatarWrapper: { marginBottom: 12 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: '#10b981',
  },
  placeholderAvatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#0f1923', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#2d3748',
  },
  placeholderText: { color: '#f9fafb', fontSize: 32, fontWeight: '900' },
  displayName: { color: '#f9fafb', fontSize: 22, fontWeight: '900', marginBottom: 16 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0f1923', borderRadius: 12, padding: 14,
    width: '100%', marginBottom: 16,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 36, backgroundColor: '#2d3748' },
  statValue: { color: '#f9fafb', fontSize: 14, fontWeight: '800' },
  statLabel: { color: '#6b7280', fontSize: 11 },

  bioBox: {
    backgroundColor: '#0f1923', borderRadius: 10, padding: 12,
    width: '100%', marginBottom: 12,
  },
  bioText: { color: '#d1d5db', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  noBio: { color: '#4b5563', fontSize: 13, fontStyle: 'italic', marginBottom: 12 },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  locationText: { color: '#6b7280', fontSize: 13 },

  editProfileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#10b981', paddingHorizontal: 20, paddingVertical: 9,
    borderRadius: 20, marginTop: 4,
  },
  editProfileBtnText: { color: '#000', fontWeight: '800', fontSize: 14 },

  tabBar: {
    flexDirection: 'row', backgroundColor: '#1a2535',
    borderRadius: 12, padding: 4, marginBottom: 16,
    borderWidth: 1, borderColor: '#2d3748',
  },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
  tabActive: { backgroundColor: '#10b981' },
  tabText: { color: '#6b7280', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#000' },
  tabCount: { color: '#4b5563', fontSize: 12, fontWeight: '700', backgroundColor: '#0f1923', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabCountActive: { color: '#000', backgroundColor: 'rgba(0,0,0,0.2)' },

  activityList: {},
  activityItem: {
    backgroundColor: '#1a2535', borderRadius: 10, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#2d3748',
  },
  activityTitle: { color: '#f9fafb', fontSize: 14, fontWeight: '600', marginBottom: 4, lineHeight: 20 },
  activitySub: { color: '#6b7280', fontSize: 12, marginBottom: 6 },
  activityMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaChipText: { color: '#9ca3af', fontSize: 12 },
  activityDate: { color: '#4b5563', fontSize: 11, marginLeft: 'auto' },
  emptyText: { color: '#4b5563', fontStyle: 'italic', textAlign: 'center', paddingVertical: 30, fontSize: 15 },
});