import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function SearchBar({ value, onChangeText }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search plants..."
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, borderWidth: 1 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  input: { borderRadius: 12, padding: 12 }
});
