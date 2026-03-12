// mobile/components/UserAvatar.jsx
import React, { useState } from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Consistent color per username so each user always gets the same color
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
function colorForName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

/**
 * UserAvatar
 * Props:
 *   userId   – the user's _id (string)
 *   name     – display name (string)
 *   picture  – profilePicture URI or base64 data URI (string|undefined)
 *   size     – avatar diameter in px (default 32)
 *   showName – render username text beside avatar (default false)
 *   style    – extra style for the outer wrapper
 */
export default function UserAvatar({ userId, name, picture, size = 32, showName = false, style }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const handlePress = async () => {
    if (!userId) return;
    const userStr = await AsyncStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    if (currentUser?._id === userId) {
      router.push('/profile');
    } else {
      router.push(`/user/${userId}`);
    }
  };

  const initial = (name || '?')[0].toUpperCase();
  const fontSize = Math.max(10, Math.floor(size * 0.42));
  const color = colorForName(name);
  const hasImage = picture && picture.length > 0 && !imgError;

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.wrapper, style]} activeOpacity={0.75}>
      {hasImage ? (
        <Image
          source={{ uri: picture }}
          style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: color }}
          onError={() => setImgError(true)}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '22', borderColor: color }
          ]}
        >
          <Text style={[styles.initial, { fontSize, color }]}>{initial}</Text>
        </View>
      )}
      {showName && (
        <Text style={[styles.name, { color }]} numberOfLines={1}>
          u/{name || 'Unknown'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center' },
  placeholder: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontWeight: '800' },
  name: { fontSize: 13, fontWeight: '700', marginLeft: 7 },
});