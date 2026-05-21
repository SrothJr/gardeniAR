import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert, Image
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from '../../components/UserAvatar';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

export default function ForumList() {
  const { colors, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const SORT_OPTIONS = [t('forum.new'), t('forum.top'), t('forum.upvoted')];
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const router = useRouter();

  const fetchPosts = async (sortMode = sort) => {
    try {
      // Find the English key for the current translated sort option
      const sortKeyMap = {
        [t('forum.new')]: 'new',
        [t('forum.top')]: 'top',
        [t('forum.upvoted')]: 'upvoted'
      };
      const sortParam = sortKeyMap[sortMode] || 'new';
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
      Alert.alert(t('checklist.login_required'), t('forum.login_create'));
      router.push('/auth/login');
      return;
    }
    router.push('/forum/create');
  };

  const handleVote = async (postId, vote, e) => {
    e.stopPropagation();
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) { Alert.alert(t('checklist.login_required'), t('forum.login_vote')); return; }
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
    if (!userStr) { Alert.alert(t('checklist.login_required'), t('forum.login_save')); return; }
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
    const timeAgo = getTimeAgo(item.createdAt, t);

    return (
      <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={() => router.push(`/forum/${item._id}`)}>
        {/* Vote column */}
        <View style={styles.voteColumn}>
          <TouchableOpacity onPress={(e) => handleVote(item._id, 'up', e)} style={styles.voteBtn}>
            <Ionicons name="arrow-up" size={22} color={userVotedUp ? '#ff6314' : colors.textMuted} />
          </TouchableOpacity>
          <Text style={[styles.score, { color: colors.text }, userVotedUp && styles.scoreUp, userVotedDown && styles.scoreDown]}>
            {score}
          </Text>
          <TouchableOpacity onPress={(e) => handleVote(item._id, 'down', e)} style={styles.voteBtn}>
            <Ionicons name="arrow-down" size={22} color={userVotedDown ? '#7b68ee' : colors.textMuted} />
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
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {'  '}🌿 {t('forum.community_name')} • <Text style={[styles.metaAuthor, { color: colors.text }]}>{t('forum.author_prefix')}{item.author?.name || t('plant.unknown')}</Text> • {timeAgo}
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

          {/* Image thumbnail — shown only if post has images */}
          {item.images?.length > 0 ? (
            <View style={styles.thumbContainer}>
              <Image
                source={{ uri: item.images[0] }}
                style={styles.thumbImage}
                resizeMode="cover"
              />
              {item.images.length > 1 && (
                <View style={styles.thumbBadge}>
                  <Ionicons name="images-outline" size={12} color="#fff" />
                  <Text style={styles.thumbBadgeText}>{item.images.length}</Text>
                </View>
              )}
            </View>
          ) : (
            <Text numberOfLines={2} style={[styles.content, { color: colors.textMuted }]}>{item.content}</Text>
          )}

          {/* Footer actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerBtn} onPress={() => router.push(`/forum/${item._id}`)}>
              <Ionicons name="chatbubble-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }]}>{item.comments?.length || 0} {t('forum.comments')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerBtn} onPress={(e) => handleSave(item._id, e)}>
              <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={14} color={isSaved ? colors.primary : colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }, isSaved && { color: colors.primary }]}>{isSaved ? t('forum.saved') : t('forum.save')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerBtn}>
              <Ionicons name="share-social-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }]}>{t('forum.share')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.communityName, { color: colors.text }]}>{t('forum.community_name')}</Text>
            <Text style={[styles.communityDesc, { color: colors.textMuted }]}>{t('forum.community_desc')}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Sort bar */}
        <View style={styles.sortBar}>
          {SORT_OPTIONS.map((s, idx) => {
            const originalSorts = ['New', 'Top', 'Upvoted'];
            const originalS = originalSorts[idx];
            return (
              <TouchableOpacity
                key={s}
                style={[styles.sortBtn, sort === s && { backgroundColor: colors.primary + '25' }]}
                onPress={() => handleSortChange(s)}
              >
                <Ionicons
                  name={originalS === 'New' ? 'time-outline' : originalS === 'Top' ? 'trophy-outline' : 'arrow-up-outline'}
                  size={14}
                  color={sort === s ? colors.primary : colors.textMuted}
                />
                <Text style={[styles.sortText, { color: colors.textMuted }, sort === s && { color: colors.primary }]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.background }]} />}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('forum.empty')}</Text>}
        />
      )}

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={handleCreatePost}>
        <Ionicons name="add" size={30} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function getTimeAgo(dateStr, t) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('forum.just_now');
  if (mins < 60) return t('forum.mins_ago', { count: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('forum.hrs_ago', { count: hrs });
  const days = Math.floor(hrs / 24);
  if (days < 30) return t('forum.days_ago', { count: days });
  return new Date(dateStr).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1, paddingBottom: 8 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  communityName: { fontSize: 20, fontWeight: '900' },
  communityDesc: { fontSize: 12, marginTop: 2 },
  backBtn: { padding: 4 },
  notifBtn: { padding: 6 },
  sortBar: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 4 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  sortText: { fontSize: 13, fontWeight: '600', marginLeft: 4 },
  card: { flexDirection: 'row', paddingVertical: 10 },
  voteColumn: { width: 48, alignItems: 'center', paddingTop: 10, paddingHorizontal: 4 },
  voteBtn: { padding: 4 },
  score: { fontSize: 13, fontWeight: '700', marginVertical: 2 },
  scoreUp: { color: '#ff6314' },
  scoreDown: { color: '#7b68ee' },
  cardContent: { flex: 1, paddingRight: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  meta: { fontSize: 11, flex: 1, flexWrap: 'wrap' },
  metaAuthor: { fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6, lineHeight: 22 },
  content: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  thumbContainer: { position: 'relative', marginBottom: 8, borderRadius: 8, overflow: 'hidden' },
  thumbImage: { width: '100%', height: 160, borderRadius: 8 },
  thumbBadge: {
    position: 'absolute', bottom: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  thumbBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  footerText: { fontSize: 12, marginLeft: 4, fontWeight: '600' },
  separator: { height: 6 },
  fab: {
    position: 'absolute', bottom: 30, right: 20,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 5,
  },
  emptyText: { textAlign: 'center', marginTop: 60, fontSize: 16 },
});
