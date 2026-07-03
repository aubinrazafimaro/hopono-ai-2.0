import { ViewStyle, TextStyle } from 'react-native';

// ─────────────────────────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────────────────────────
export const SPACING = {
  horizontal: 24,
  card: 24,
  section: 32,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// ─────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────
export const RADIUS = {
  card: 24,
  button: 32,
  pill: 999,
  sm: 12,
  md: 16,
} as const;

// ─────────────────────────────────────────────────────────────────
// COLORS — Full palette including legacy Lava Night variables for backwards compatibility
// ─────────────────────────────────────────────────────────────────
export const COLORS = {
  // Legacy Lava & Dark mode variables (needed by non-onboarding screens)
  lava: '#0F0A06',
  lavaDark: '#07040300',
  lavaWarm: '#1A0F0A',
  textSand: '#F5EED8',
  textSandMuted: '#A89070',
  textTeal: '#E8F5F5',
  textTealMuted: '#7AABAB',
  cardBg: 'rgba(255, 255, 255, 0.06)',
  cardBorder: 'rgba(255, 255, 255, 0.10)',
  errorBg: 'rgba(255, 107, 107, 0.10)',

  // Canonical light Hawaiian theme tokens
  orange: '#e86935',
  orangeLight: '#ff8e53',
  sunsetStart: '#E86935',
  sunsetMid: '#FF6B6B',
  sunsetEnd: '#FF8E53',

  // Secondary (Ocean)
  turquoise: '#0abfbc',
  green: '#2ecc71',
  oceanStart: '#0ABFBC',
  oceanMid: '#2ECC71',
  oceanEnd: '#1A6B6B',

  // Neutrals / Sands
  sandLight: '#fff5f0',
  sandDark: '#ffe8db',
  white: '#ffffff',
  textDark: '#1f2937',
  textMuted: '#64748b',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',

  // Semantic
  error: '#FF6B6B',
  success: '#22c55e',
} as const;

// ─────────────────────────────────────────────────────────────────
// MOTION
// ─────────────────────────────────────────────────────────────────
export const MOTION = {
  duration: 600,
  breathIn: 4000,
  breathOut: 4000,
} as const;

// ─────────────────────────────────────────────────────────────────
// TYPOGRAPHY — Nunito (headlines & body)
// ─────────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  h1: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    color: COLORS.textDark,
    lineHeight: 40,
  } as TextStyle,
  h2: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 26,
    color: COLORS.textDark,
    lineHeight: 34,
  } as TextStyle,
  h3: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: COLORS.textDark,
    lineHeight: 28,
  } as TextStyle,
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: COLORS.textMuted,
    lineHeight: 26,
  } as TextStyle,
  body: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
  } as TextStyle,
  bodySmall: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  } as TextStyle,
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: 'lowercase' as const,
    letterSpacing: 1.2,
  } as TextStyle,
} as const;

// ─────────────────────────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────────────────────────
export const SHADOWS = {
  soft: {
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  } as ViewStyle,
  medium: {
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  } as ViewStyle,
  heavy: {
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
} as const;

// ─────────────────────────────────────────────────────────────────
// HAWAIIAN VOCABULARY
// ─────────────────────────────────────────────────────────────────
export const HAWAIIAN = {
  greeting: 'Aloha',
  gratitude: 'Mahalo',
  ritual: "Ho'oponopono",
  again: 'Hana hou',
  selfCare: 'Mālama',
  together: 'Kākou',
  celebration: "Ho'omaika'i",
} as const;
