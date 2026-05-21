import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Image,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../hooks/useTheme';
import { BACKEND_URL } from '../config';
import { useTranslation } from 'react-i18next';

const TABS = ['Posts', 'Comments', 'Saved'];

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Activity data
  const [activeTab, setActiveTab] = useState('Posts');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notifications
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setName(userData.name || '');
        setCity(userData.location?.city || '');
        setBio(userData.bio || '');
        setProfilePicture(userData.profilePicture || '');
        
        // Load additional data
        await Promise.all([
          loadActivity(userData._id),
          loadNotifications(userData._id)
        ]);
      }
    } catch (e) {
      console.error('loadUser error:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadActivity = async (userId: string) => {
    setActivityLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/profile/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setComments(data.comments || []);
        setSavedPosts(data.savedPosts || []);
        
        // Update karma if available
        if (data.user && typeof data.user.karma !== 'undefined') {
          setUser((prev: any) => prev ? { ...prev, karma: data.user.karma } : null);
        }
      }
    } catch (e) {
      console.error('loadActivity error:', e);
    } finally {
      setActivityLoading(false);
    }
  };

  const loadNotifications = async (userId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const unread = data.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (e) {
      console.error('loadNotifications error:', e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64 = result.assets[0].base64;
      if (base64) {
        setProfilePicture(`data:image/jpeg;base64,${base64}`);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id,
          name,
          location: { ...(user?.location || {}), city },
          profilePicture,
          bio
        }),
      });
      const updated = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
        Alert.alert('Success', 'Profile updated!');
      } else {
        Alert.alert('Error', updated.message || 'Failed to update profile.');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Password updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', data.message || 'Failed to change password.');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setChangingPassword(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Please log in to view your profile.</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginBtnText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderActivityItem = (item: any, type: string) => (
    <TouchableOpacity
      key={item._id}
      style={styles.activityItem}
      onPress={() => {
        // Only navigate if the post exists (original forum might not have detail pages)
        // router.push(`/forum/${type === 'comment' ? item.postId : item._id}`);
      }}
      disabled={true} // Reverted forum doesn't have detail pages yet
    >
      <Text style={styles.activityTitle} numberOfLines={2}>
        {type === 'comment' ? `💬 ${item.text}` : item.title}
      </Text>
      {type === 'comment' && <Text style={styles.activitySub}>on: {item.postTitle}</Text>}
      <View style={styles.activityMeta}>
        <View style={styles.metaChip}>
          <Ionicons name="leaf-outline" size={12} color="#10b981" />
          <Text style={styles.metaChipText}>{(item.upvotes?.length || 0) - (item.downvotes?.length || 0)}</Text>
        </View>
        {type !== 'comment' && (
          <View style={styles.metaChip}>
            <Ionicons name="chatbubble-outline" size={12} color="#6b7280" />
            <Text style={styles.metaChipText}>{item.comments?.length || 0}</Text>
          </View>
        )}
        <Text style={styles.activityDate}>{getTimeAgo(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + karma */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.avatar} />
              ) : (
                <View style={[styles.placeholderAvatar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.placeholderText, { color: colors.text }]}>{name.slice(0, 1).toUpperCase() || '?'}</Text>
                </View>
              )}
              <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.displayName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.email, { color: colors.textMuted }]}>{user.email}</Text>
          <View style={styles.karmaRow}>
            <Ionicons name="leaf" size={14} color={colors.primary} />
            <Text style={[styles.karma, { color: colors.primary }]}>{user.karma || 0} {t('profile.karma')}</Text>
          </View>
          {user.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
              <Text style={[styles.premiumText, { color: colors.primary }]}>✨ {t('profile.premium_member')}</Text>
            </View>
          )}
        </View>

        {/* Appearance Settings Link */}
        <TouchableOpacity 
          style={[styles.settingLink, { backgroundColor: colors.surface, borderColor: colors.border }]} 
          onPress={() => router.push('/appearance')}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{t('appearance.title')}</Text>
            <Text style={[styles.settingSub, { color: colors.textMuted }]}>{t('appearance.amoled_sub')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Edit profile form */}
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.edit_profile')}</Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>{t('profile.full_name')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={name} 
            onChangeText={setName} 
            placeholder={t('profile.full_name')} 
            placeholderTextColor={colors.textMuted} 
          />

          <Text style={[styles.label, { color: colors.textMuted }]}>{t('profile.bio')}</Text>
          <TextInput
            style={[styles.input, styles.bioInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={bio} 
            onChangeText={setBio}
            placeholder={t('profile.bio_placeholder')} 
            placeholderTextColor={colors.textMuted}
            multiline 
            textAlignVertical="top"
          />

          <Text style={[styles.label, { color: colors.textMuted }]}>{t('profile.city')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={city} 
            onChangeText={setCity} 
            placeholder={t('profile.city')} 
            placeholderTextColor={colors.textMuted} 
          />

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: colors.primary }, saving && { opacity: 0.7 }]} 
            onPress={handleSave} 
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#000" /> : <Text style={[styles.saveBtnText, { color: '#000' }]}>{t('profile.save_changes')}</Text>}
          </TouchableOpacity>
        </View>

        {/* Activity tabs */}
        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.activity')}</Text>
          <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
            {TABS.map(t_key => (
              <TouchableOpacity 
                key={t_key} 
                style={[styles.tab, activeTab === t_key && { backgroundColor: colors.primary }]} 
                onPress={() => setActiveTab(t_key)}
              >
                <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === t_key && { color: '#000' }]}>
                  {t(`profile.${t_key.toLowerCase()}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activityLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.activityList}>
              {activeTab === 'Posts' && (
                posts.length === 0
                  ? <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('profile.posts')} - {t('common.see_all')}</Text>
                  : posts.map(p => renderActivityItem(p, 'post'))
              )}
              {activeTab === 'Comments' && (
                comments.length === 0
                  ? <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('profile.comments')} - {t('common.see_all')}</Text>
                  : comments.map(c => renderActivityItem(c, 'comment'))
              )}
              {activeTab === 'Saved' && (
                savedPosts.length === 0
                  ? <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('profile.saved')} - {t('common.see_all')}</Text>
                  : savedPosts.map(p => renderActivityItem(p, 'post'))
              )}
            </View>
          )}
        </View>

        {/* Change password */}
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.change_password')}</Text>
          <Text style={[styles.label, { color: colors.textMuted }]}>{t('profile.current_password')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={currentPassword} 
            onChangeText={setCurrentPassword} 
            placeholder={t('profile.current_password')} 
            placeholderTextColor={colors.textMuted} 
            secureTextEntry 
          />
          <Text style={[styles.label, { color: colors.textMuted }]}>{t('profile.new_password')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={newPassword} 
            onChangeText={setNewPassword} 
            placeholder={t('profile.new_password')} 
            placeholderTextColor={colors.textMuted} 
            secureTextEntry 
          />
          <Text style={[styles.label, { color: colors.textMuted }]}>{t('profile.confirm_password')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            placeholder={t('profile.confirm_password')} 
            placeholderTextColor={colors.textMuted} 
            secureTextEntry 
          />
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.surface, borderColor: colors.border }, changingPassword && { opacity: 0.7 }]}
            onPress={handleChangePassword} 
            disabled={changingPassword}
          >
            {changingPassword ? <ActivityIndicator color={colors.text} /> : <Text style={[styles.saveBtnText, { color: colors.text }]}>{t('profile.update_password')}</Text>}
          </TouchableOpacity>
        </View>

        {/* Account info */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.account_info')}</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t('profile.joined')}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t('profile.subscription')}</Text>
              <Text style={[styles.infoValue, user.isPremium && { color: colors.primary, fontWeight: '800' }, !user.isPremium && { color: colors.text }]}>
                {user.isPremium ? t('common.premium') : t('appearance.light')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f1923' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1923' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#1a2535', borderBottomWidth: 1, borderBottomColor: '#2d3748' },
  headerTitle: { color: '#f9fafb', fontSize: 18, fontWeight: '800' },
  backBtn: { padding: 8 },
  notifBtn: { padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#ef4444', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#10b981' },
  placeholderAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#334155' },
  placeholderText: { color: '#f8fafc', fontSize: 36, fontWeight: '900' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#10b981', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#0f1923' },
  displayName: { color: '#f9fafb', fontSize: 22, fontWeight: '900' },
  email: { color: '#6b7280', fontSize: 13, marginTop: 4 },
  karmaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  karma: { color: '#10b981', fontSize: 14, fontWeight: '700' },
  premiumBadge: { marginTop: 10, backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  premiumText: { color: '#22c55e', fontSize: 12, fontWeight: '800' },
  settingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2535',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: { color: '#f9fafb', fontSize: 16, fontWeight: '700' },
  settingSub: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  form: { marginBottom: 32 },
  sectionTitle: { color: '#f9fafb', fontSize: 16, fontWeight: '800', marginBottom: 16 },
  label: { color: '#6b7280', fontSize: 13, fontWeight: '600', marginBottom: 6, marginLeft: 2 },
  input: { backgroundColor: '#1a2535', borderWidth: 1, borderColor: '#2d3748', borderRadius: 10, padding: 13, color: '#f9fafb', fontSize: 14, marginBottom: 16 },
  bioInput: { height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  saveBtnText: { color: '#051013', fontWeight: '900', fontSize: 15 },
  activitySection: { marginBottom: 32 },
  tabBar: { flexDirection: 'row', backgroundColor: '#1a2535', borderRadius: 10, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#10b981' },
  tabText: { color: '#6b7280', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#000' },
  activityList: {},
  activityItem: { backgroundColor: '#1a2535', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#2d3748' },
  activityTitle: { color: '#f9fafb', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  activitySub: { color: '#6b7280', fontSize: 12, marginBottom: 6 },
  activityMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaChipText: { color: '#9ca3af', fontSize: 12 },
  activityDate: { color: '#4b5563', fontSize: 11, marginLeft: 'auto' },
  emptyText: { color: '#4b5563', fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  infoSection: { marginBottom: 40 },
  infoCard: { backgroundColor: '#1a2535', borderRadius: 12, borderWidth: 1, borderColor: '#2d3748', overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: '#2d3748' },
  infoLabel: { color: '#6b7280', fontSize: 14 },
  infoValue: { color: '#f9fafb', fontSize: 14, fontWeight: '600' },
  errorText: { color: '#6b7280', fontSize: 16, marginBottom: 20 },
  loginBtn: { backgroundColor: '#10b981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  loginBtnText: { color: '#051013', fontWeight: '800' },
});
