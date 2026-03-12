// mobile/app/notifications.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../config';

const NOTIF_ICONS = {
  reply_post: { icon: 'chatbubble', color: '#10b981' },
  reply_comment: { icon: 'return-down-forward', color: '#3b82f6' },
  upvote_post: { icon: 'arrow-up-circle', color: '#ff6314' },
  upvote_comment: { icon: 'arrow-up-circle', color: '#ff6314' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) { setLoading(false); return; }
      const user = JSON.parse(userStr);
      const res = await fetch(`${BACKEND_URL}/api/users/notifications/${user._id}`);
      if (res.ok) setNotifications(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);
      await fetch(`${BACKEND_URL}/api/users/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) { console.error(e); }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const renderItem = ({ item }) => {
    const iconInfo = NOTIF_ICONS[item.type] || { icon: 'notifications', color: '#6b7280' };
    return (
      <TouchableOpacity
        style={[styles.notifCard, !item.read && styles.notifUnread]}
        onPress={() => item.postId && router.push(`/forum/${item.postId}`)}
      >
        <View style={[styles.iconCircle, { backgroundColor: iconInfo.color + '22' }]}>
          <Ionicons name={iconInfo.icon} size={20} color={iconInfo.color} />
        </View>
        <View style={styles.notifContent}>
          <Text style={styles.notifMessage}>{item.message}</Text>
          <Text style={styles.notifTime}>{getTimeAgo(item.createdAt)}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#f9fafb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, i) => item._id || String(i)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={48} color="#2d3748" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1923' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16,
    backgroundColor: '#1a2535', borderBottomWidth: 1, borderBottomColor: '#2d3748',
  },
  backBtn: { padding: 6 },
  headerTitle: { color: '#f9fafb', fontSize: 18, fontWeight: '800' },
  markReadBtn: { padding: 6 },
  markReadText: { color: '#10b981', fontSize: 13, fontWeight: '600' },
  notifCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a2535',
    borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2d3748',
  },
  notifUnread: { borderColor: '#10b98133', backgroundColor: '#1a2535' },
  iconCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notifContent: { flex: 1 },
  notifMessage: { color: '#f9fafb', fontSize: 14, fontWeight: '500', marginBottom: 3 },
  notifTime: { color: '#6b7280', fontSize: 12 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginLeft: 8 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#4b5563', fontSize: 16, marginTop: 16 },
});