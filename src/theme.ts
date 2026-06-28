import { ViewStyle, TextStyle } from 'react-native';

// ─────────────────────────────────────────────────────────────────
// SPACING — "l'Hawaï c'est l'espace, la respiration, l'horizon infini"
// ─────────────────────────────────────────────────────────────────
export const SPACING = {
  horizontal: 24,   // Marges horizontales globales
  card: 24,         // Padding interne des cards
  section: 32,      // Gap vertical entre sections
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// ─────────────────────────────────────────────────────────────────
// BORDER RADIUS — "Les vagues n'ont pas de coins"
// ─────────────────────────────────────────────────────────────────
export const RADIUS = {
  card: 24,       // Cards
  button: 32,     // Boutons CTA
  pill: 999,      // Pills / tags
  sm: 12,
  md: 16,
} as const;

// ─────────────────────────────────────────────────────────────────
// COLORS — Palette Lave de nuit + accents Hawaïens
// ─────────────────────────────────────────────────────────────────
export const COLORS = {
  // Lava Night (fond)
  lava: '#0F0A06',
  lavaDark: '#07040300',
  lavaWarm: '#1A0F0A',

  // Sunset gradient (action, ritual)
  sunsetStart: '#E86935',
  sunsetMid: '#FF6B6B',
  sunsetEnd: '#FF8E53',

  // Ocean gradient (calme, completion)
  oceanStart: '#0ABFBC',
  oceanMid: '#2ECC71',
  oceanEnd: '#1A6B6B',

  // Text
  textSand: '#F5EED8',       // Sable chaud (texte principal sur fond sombre)
  textSandMuted: '#A89070',  // Sable atténué (sous-texte)
  textTeal: '#E8F5F5',       // Blanc-turquoise pour le thème Ocean
  textTealMuted: '#7AABAB',  // Teal atténué

  // Surfaces (semi-opaques sur fond Lave)
  cardBg: 'rgba(255, 255, 255, 0.06)',
  cardBorder: 'rgba(255, 255, 255, 0.10)',

  // Error (coral doux, jamais rouge agressif)
  error: '#FF6B6B',
  errorBg: 'rgba(255, 107, 107, 0.10)',
} as const;

// ─────────────────────────────────────────────────────────────────
// MOTION — "Lent et organique. Comme une vague."
// ─────────────────────────────────────────────────────────────────
export const MOTION = {
  duration: 600,         // Durée standard
  breathIn: 4000,        // Inspire (orbe)
  breathOut: 4000,       // Expire (orbe)
  // Easing: 'ease-in-out' via React Native Easing.inOut(Easing.ease)
} as const;

// ─────────────────────────────────────────────────────────────────
// TYPOGRAPHY — Playfair Display (headlines) + Nunito (corps)
// ─────────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  h1: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: COLORS.textSand,
    lineHeight: 40,
  } as TextStyle,
  h2: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    color: COLORS.textSand,
    lineHeight: 34,
  } as TextStyle,
  h3: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: COLORS.textSand,
    lineHeight: 28,
  } as TextStyle,
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: COLORS.textSandMuted,
    lineHeight: 26,
  } as TextStyle,
  body: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: COLORS.textSandMuted,
    lineHeight: 24,
  } as TextStyle,
  bodySmall: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: COLORS.textSandMuted,
    lineHeight: 20,
  } as TextStyle,
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: COLORS.textSandMuted,
    textTransform: 'lowercase' as const,
    letterSpacing: 1.2,
  } as TextStyle,
} as const;

// ─────────────────────────────────────────────────────────────────
// SHADOWS — Teintées Sunset pour donner chaleur
// ─────────────────────────────────────────────────────────────────
export const SHADOWS = {
  soft: {
    shadowColor: '#E86935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  } as ViewStyle,
  medium: {
    shadowColor: '#E86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  } as ViewStyle,
  heavy: {
    shadowColor: '#E86935',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
} as const;

// ─────────────────────────────────────────────────────────────────
// HAWAIIAN VOCABULARY — Mots clés à intégrer dans le copy
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
