import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'sunset' | 'ocean';

export type GradientColors = readonly [string, string, string];

export type ThemePalette = {
  // The active accent (for active elements, highlights)
  primary: string;
  primaryLight: string;

  // Background: always the dark Lava base
  background: string;
  backgroundDeep: string;

  // Card surface (semi-opaque on dark)
  cardBg: string;
  cardBorder: string;

  // Text
  textPrimary: string;    // Warm white / sand for headlines
  textMuted: string;      // Dimmed for subtext

  // Gradient presets
  gradientSunset: GradientColors;   // Sunset — action, ritual, CTA
  gradientOcean: GradientColors;    // Ocean — calm, completion, dashboard
  gradientLava: GradientColors;     // Lava night — background base

  // Semantic aliases for screens using gradients
  gradientTop: string;
  gradientMid: string;
  gradientBot: string;
};

const sharedGradients = {
  gradientSunset: ['#E86935', '#FF6B6B', '#FF8E53'] as GradientColors,
  gradientOcean: ['#0ABFBC', '#2ECC71', '#1A6B6B'] as GradientColors,
  gradientLava: ['#0F0A06', '#1A0F0A', '#0F0A06'] as GradientColors,
};

const palettes: Record<ThemeType, ThemePalette> = {
  // Sunset: the active ritual theme (morning, high-energy)
  sunset: {
    primary: '#E86935',
    primaryLight: '#FF8E53',
    background: '#F0F9FA',      // Blanc turquoise / light Hawaiian sky
    backgroundDeep: '#E0F2F1',
    cardBg: '#FFFFFF',          // Solid white card
    cardBorder: '#D1D5DB',      // Light gray border
    textPrimary: '#1F2937',     // Dark slate for contrast
    textMuted: '#4B5563',       // Dimmed slate
    ...sharedGradients,
    gradientTop: '#F0F9FA',
    gradientMid: '#E6F8FA',
    gradientBot: '#D4F1F4',
  },
  // Ocean: the calm restoration theme (evening, completion)
  ocean: {
    primary: '#0ABFBC',
    primaryLight: '#2ECC71',
    background: '#E0F7FA',      // Slightly deeper turquoise white
    backgroundDeep: '#B2EBF2',
    cardBg: '#FFFFFF',
    cardBorder: '#CBD5E1',
    textPrimary: '#0F172A',
    textMuted: '#475569',
    ...sharedGradients,
    gradientTop: '#E0F7FA',
    gradientMid: '#B2EBF2',
    gradientBot: '#80DEEA',
  },
};

type AppThemeContextType = {
  themeName: ThemeType;
  palette: ThemePalette;
  setThemeName: (name: ThemeType) => Promise<void>;
};

const AppThemeContext = createContext<AppThemeContextType>({
  themeName: 'sunset',
  palette: palettes.sunset,
  setThemeName: async () => {},
});

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeState] = useState<ThemeType>('sunset');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('app_theme');
        if (storedTheme === 'ocean' || storedTheme === 'sunset') {
          setThemeState(storedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    };
    loadTheme();
  }, []);

  const setThemeName = async (name: ThemeType) => {
    setThemeState(name);
    try {
      await AsyncStorage.setItem('app_theme', name);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  return (
    <AppThemeContext.Provider value={{ themeName, palette: palettes[themeName], setThemeName }}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(AppThemeContext);
