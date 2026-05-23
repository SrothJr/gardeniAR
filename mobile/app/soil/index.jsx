import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

export default function SoilTestScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('soil.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={{ height: 180, borderRadius: 12, backgroundColor: colors.background, marginBottom: 16, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: colors.textMuted, textAlign: 'center' }}>{t('soil.tip')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/soil/camera')}
        >
          <Text style={[styles.primaryBtnText, { color: "#000" }]}>{t('soil.scan_btn')}</Text>
        </TouchableOpacity>

        <Text style={[styles.howItWorksTitle, { color: colors.text }]}>{t('soil.how_it_works')}</Text>
        <Text style={[styles.howItWorks, { color: colors.textMuted }]}>
          {t('soil.how_it_works_desc')}
        </Text>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  backBtn: {
    padding: 4,
  },
  container: { padding: 20 },
  card: { padding: 16, borderRadius: 14 },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: { fontWeight: '700', fontSize: 16 },
  howItWorksTitle: { fontWeight: '600', marginBottom: 6 },
  howItWorks: { lineHeight: 20 },
});
