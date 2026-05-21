import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch,
  Dimensions, Animated, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { ThemePresets, ThemePresetName } from '../constants/theme';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;

export default function AppearanceScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { 
    themeMode, setThemeMode, 
    preset, setPreset, 
    amoled, setAmoled,
    resolvedTheme, colors 
  } = useTheme();

  const currentLanguage = i18n.language || 'en';

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'বাংলা (Bangla)', value: 'bn' },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const themeOptions: { label: string; value: 'system' | 'light' | 'dark' }[] = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  const renderThemeCard = (key: string) => {
    const item = ThemePresets[key as ThemePresetName];
    const isSelected = preset === key;
    const itemColors = item[resolvedTheme];

    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.themeCard,
          { backgroundColor: itemColors.surface, borderColor: isSelected ? colors.primary : colors.border }
        ]}
        onPress={() => setPreset(key as ThemePresetName)}
        activeOpacity={0.8}
      >
        <View style={styles.previewContainer}>
          <View style={[styles.previewHeader, { backgroundColor: itemColors.background }]} />
          <View style={styles.previewContent}>
            <View style={[styles.previewAccent, { backgroundColor: itemColors.primary }]} />
            <View style={[styles.previewBar, { backgroundColor: colors.textMuted, opacity: 0.2, width: '60%' }]} />
            <View style={[styles.previewBar, { backgroundColor: colors.textMuted, opacity: 0.2, width: '40%' }]} />
          </View>
          <View style={[styles.previewFooter, { backgroundColor: itemColors.background }]}>
             <View style={[styles.previewCircle, { backgroundColor: itemColors.primary }]} />
             <View style={[styles.previewPill, { backgroundColor: colors.textMuted, opacity: 0.2 }]} />
          </View>
          {isSelected && (
            <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
          )}
        </View>
        <Text style={[styles.themeName, { color: isSelected ? colors.primary : colors.text }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('appearance.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Theme Mode Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('appearance.theme')}</Text>
          <View style={[styles.segmentedContainer, { backgroundColor: colors.surface }]}>
            {themeOptions.map((opt) => {
              const active = themeMode === opt.value;
              const isSystem = opt.value === 'system';
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.segment,
                    active && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => setThemeMode(opt.value)}
                >
                  <View style={styles.segmentInner}>
                    {active && <Ionicons name="checkmark" size={14} color={colors.primary} style={{ marginRight: 4 }} />}
                    <Text style={[
                      styles.segmentText, 
                      { color: active ? colors.primary : colors.textMuted }
                    ]}>
                      {opt.label}
                      {isSystem && (
                        <Text style={{ fontSize: 10, fontWeight: '400', textTransform: 'capitalize' }}>
                          {"\n"}({resolvedTheme})
                        </Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Theme Presets Carousel */}
        <View style={styles.section}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.carousel}
          >
            {Object.keys(ThemePresets).map(renderThemeCard)}
          </ScrollView>
        </View>

        {/* AMOLED Toggle */}
        <View style={styles.optionRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>{t('appearance.amoled')}</Text>
            <Text style={[styles.optionSub, { color: colors.textMuted }]}>{t('appearance.amoled_sub')}</Text>
          </View>
          <Switch
            value={amoled}
            onValueChange={setAmoled}
            disabled={resolvedTheme !== 'dark'}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : (amoled ? '#fff' : '#f4f3f4')}
          />
        </View>

        {/* Language Selection */}
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('appearance.language')}</Text>
          <View style={[styles.segmentedContainer, { backgroundColor: colors.surface }]}>
            {languages.map((lang) => {
              const active = currentLanguage.startsWith(lang.value);
              return (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.segment,
                    active && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => changeLanguage(lang.value)}
                >
                  <Text style={[
                    styles.segmentText, 
                    { color: active ? colors.primary : colors.textMuted }
                  ]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.simpleOption}>
          <Text style={[styles.simpleOptionText, { color: colors.text }]}>Display</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.simpleOption}>
          <Text style={[styles.simpleOptionText, { color: colors.text }]}>App language</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.simpleOption}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.simpleOptionText, { color: colors.text }]}>Tablet UI</Text>
            <Text style={[styles.simpleOptionSub, { color: colors.textMuted }]}>Auto</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.simpleOption}>
          <Text style={[styles.simpleOptionText, { color: colors.text }]}>Date format</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  backBtn: { padding: 8 },
  scroll: { paddingBottom: 40 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    height: 48,
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,
  },
  segmentInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentText: { fontSize: 14, fontWeight: '700' },

  carousel: { paddingLeft: 16, paddingRight: 8, paddingVertical: 12 },
  themeCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 20,
    borderWidth: 2,
    padding: 4,
    alignItems: 'center',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  previewHeader: { height: '15%', width: '100%' },
  previewContent: { flex: 1, padding: 12, gap: 8 },
  previewAccent: { width: 32, height: 20, borderRadius: 4 },
  previewBar: { height: 8, borderRadius: 4 },
  previewFooter: { height: '20%', width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  previewCircle: { width: 16, height: 16, borderRadius: 8 },
  previewPill: { flex: 1, height: 8, borderRadius: 4 },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  themeName: { fontSize: 13, fontWeight: '700', marginTop: 10, marginBottom: 4 },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 16,
  },
  optionTitle: { fontSize: 16, fontWeight: '600' },
  optionSub: { fontSize: 13, marginTop: 2 },

  divider: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginVertical: 16, marginHorizontal: 20 },
  
  simpleOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  simpleOptionText: { fontSize: 16, fontWeight: '500' },
  simpleOptionSub: { fontSize: 13, marginTop: 2 },
});
