import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemePresets, ThemePresetName } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  preset: ThemePresetName;
  setPreset: (preset: ThemePresetName) => void;
  amoled: boolean;
  setAmoled: (enabled: boolean) => void;
  resolvedTheme: 'light' | 'dark';
  colors: typeof ThemePresets.Default.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [preset, setPresetState] = useState<ThemePresetName>('Default');
  const [amoled, setAmoledState] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedTheme, savedPreset, savedAmoled] = await Promise.all([
          AsyncStorage.getItem('user_theme_mode'),
          AsyncStorage.getItem('user_theme_preset'),
          AsyncStorage.getItem('user_theme_amoled'),
        ]);
        if (savedTheme) setThemeModeState(savedTheme as ThemeMode);
        if (savedPreset) setPresetState(savedPreset as ThemePresetName);
        if (savedAmoled) setAmoledState(savedAmoled === 'true');
      } catch (e) {
        console.error('Failed to load theme settings', e);
      }
    };
    loadSettings();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('user_theme_mode', mode);
    } catch (e) {
      console.error('Failed to save theme mode', e);
    }
  };

  const setPreset = async (newPreset: ThemePresetName) => {
    setPresetState(newPreset);
    try {
      await AsyncStorage.setItem('user_theme_preset', newPreset);
    } catch (e) {
      console.error('Failed to save theme preset', e);
    }
  };

  const setAmoled = async (enabled: boolean) => {
    setAmoledState(enabled);
    try {
      await AsyncStorage.setItem('user_theme_amoled', String(enabled));
    } catch (e) {
      console.error('Failed to save amoled setting', e);
    }
  };

  const resolvedTheme = themeMode === 'system' 
    ? (deviceColorScheme || 'light') 
    : themeMode;

  const currentPreset = ThemePresets[preset] || ThemePresets.Default;
  let colors = { ...currentPreset[resolvedTheme] };

  // Apply AMOLED pure black if enabled and in dark mode
  if (resolvedTheme === 'dark' && amoled) {
    colors.background = '#000000';
  }

  return (
    <ThemeContext.Provider value={{ 
      themeMode, setThemeMode, 
      preset, setPreset, 
      amoled, setAmoled,
      resolvedTheme, colors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
