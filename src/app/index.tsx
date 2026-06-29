import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2 } from 'lucide-react-native'; // Changed Share to Share2 for the 3-dots connected share icon
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCheckIn, peaceStates, moodStates } from '@/context/CheckInContext';
import { useUser } from '@/context/UserContext';
import { useAppTheme } from '@/context/AppThemeContext';
import AlohaButton from '@/components/AlohaButton';
import { SPACING, RADIUS, COLORS, TYPOGRAPHY } from '@/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const practices = [
  { id: '21',     label: '21 repetitions',  desc: 'quick clearing',  emoji: '🌺' },
  { id: '99',     label: '99 repetitions',  desc: 'deep cleaning',   emoji: '🌊' },
  { id: '108',    label: '108 repetitions', desc: 'sacred cycle',    emoji: '🐢' },
  { id: 'custom', label: 'custom timer',    desc: 'free flow',       emoji: '🌿' },
];

export default function Home() {
  const { peaceIndex, moodIndex, history } = useCheckIn();
  const { userData } = useUser();
  const { palette } = useAppTheme();
  const currentPeace = peaceStates[peaceIndex];
  const currentMood  = moodStates[moodIndex];
  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()).toLowerCase();

  const [healingPlan, setHealingPlan] = useState<any>(null);

  useEffect(() => {
    const loadHealingPlan = async () => {
      try {
        const stored = await AsyncStorage.getItem('@hopono_healing_plan');
        if (stored) {
          setHealingPlan(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to load healing plan:", err);
      }
    };
    loadHealingPlan();
  }, []);

  // ── Goal Rotation State (Interval: 15 seconds) ──
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  useEffect(() => {
    if (userData?.lifeGoals && userData.lifeGoals.length > 1) {
      const interval = setInterval(() => {
        setCurrentGoalIndex((prev) => (prev + 1) % userData.lifeGoals.length);
      }, 15000); // Rotates every 15 seconds
      return () => clearInterval(interval);
    }
  }, [userData?.lifeGoals]);

  // ── Breathing Orb Animation for Dashboard ──
  const orbScale = useRef(new Animated.Value(1)).current;
  const orbOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 1.15, duration: 4000, useNativeDriver: true }),
          Animated.timing(orbOpacity, { toValue: 1, duration: 4000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 1, duration: 4000, useNativeDriver: true }),
          Animated.timing(orbOpacity, { toValue: 0.7, duration: 4000, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const [isMood, setIsMood] = useState(true);
  const moodOpacity  = useRef(new Animated.Value(1)).current;
  const peaceOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isMood) {
      Animated.timing(peaceOpacity, { toValue: 0, duration: 600, useNativeDriver: true }).start();
      Animated.timing(moodOpacity,  { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      Animated.timing(moodOpacity,  { toValue: 0, duration: 600, useNativeDriver: true }).start();
      Animated.timing(peaceOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [isMood]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Subtle top glow from Sunset */}
      <LinearGradient
        colors={['rgba(232, 105, 53, 0.18)', 'transparent']}
        style={styles.topGlow}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── HEADER (Enforced Nunito typography and aligned name text color) ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerGreeting}>aloha 🌺</Text>
              <Text style={[styles.headerName, { color: palette.textPrimary }]}>
                {userData?.name ? userData.name.toLowerCase() : 'friend'}
              </Text>
              {userData?.lifeGoals?.[currentGoalIndex] && (
                <Text style={[styles.headerGoal, { color: palette.primary }]}>
                  towards: {userData.lifeGoals[currentGoalIndex].toLowerCase()}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.profileBtn, { borderColor: palette.cardBorder }]}
              onPress={() => router.push('/settings')}
            >
              <Text style={{ fontSize: 20 }}>🌊</Text>
            </TouchableOpacity>
          </View>

          {/* ── TODAY CHECK-IN CARD ── */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsMood(!isMood)}
            style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}
          >
            <View style={styles.cardContent}>
              <View style={[styles.emojiBox, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                <Animated.Text style={[styles.bigEmoji, { opacity: moodOpacity }]}>
                  {currentMood.emoji}
                </Animated.Text>
                <Animated.Text style={[styles.bigEmoji, styles.absoluteCenter, { opacity: peaceOpacity }]}>
                  {currentPeace.emoji}
                </Animated.Text>
              </View>

              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Animated.Text style={[styles.cardTitle, { color: palette.textPrimary, opacity: moodOpacity }]}>
                    {currentMood.text}
                  </Animated.Text>
                  <Animated.Text style={[styles.cardTitle, styles.absoluteText, { color: palette.textPrimary, opacity: peaceOpacity }]}>
                    {currentPeace.text}
                  </Animated.Text>
                  <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                    <Text style={[styles.badgeText, { color: palette.textMuted }]}>today</Text>
                  </View>
                </View>

                <View style={styles.descContainer}>
                  <Animated.Text style={[styles.cardDesc, { color: palette.textMuted, opacity: moodOpacity }]}>
                    feeling {currentMood.text} today
                  </Animated.Text>
                  <Animated.Text style={[styles.cardDesc, styles.absoluteText, { color: palette.textMuted, opacity: peaceOpacity }]}>
                    peace is {currentPeace.text}
                  </Animated.Text>
                </View>

                <TouchableOpacity style={styles.editLink} onPress={() => router.push('/check-in-1')}>
                  <Text style={[styles.editLinkText, { color: palette.primary }]}>
                    edit check-in →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {healingPlan?.welcomingText && (
            <View style={[styles.welcomingCard, { backgroundColor: 'rgba(232, 105, 53, 0.08)', borderColor: 'rgba(232, 105, 53, 0.2)' }]}>
              <Text style={[styles.welcomingText, { color: palette.textPrimary }]}>
                ✨ {healingPlan.welcomingText}
              </Text>
            </View>
          )}

          {/* ── CENTRAL GLOWING ORB & BRAND NAME (Replaces Calendar) ── */}
          <View style={styles.borderlessOrbCard}>
            <View style={styles.dashboardOrbContainer}>
              <Animated.View style={[
                styles.dashboardOrb, 
                { 
                  transform: [{ scale: orbScale }],
                  opacity: orbOpacity 
                }
              ]}>
                <LinearGradient
                  colors={['#ffedd5', 'rgba(254, 215, 170, 0.5)', 'rgba(254, 215, 170, 0.2)', 'transparent']}
                  style={[StyleSheet.absoluteFill, { borderRadius: 110 }]}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>
              {/* Core sun */}
              <View style={styles.dashboardOrbCore} />
            </View>
            <Text style={[styles.brandTitleText, { color: palette.textPrimary }]}>
              hopono AI
            </Text>
            <Text style={[styles.brandSubtitleText, { color: palette.textMuted }]}>
              breathe in. clean inside. release.
            </Text>
          </View>

          {healingPlan && (
            <View style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder, marginBottom: SPACING.section }]}>
              <Text style={[styles.healingExplanationTitle, { color: palette.textPrimary }]}>your healing journey 🌺</Text>
              <Text style={[styles.healingExplanationText, { color: palette.textMuted }]}>{healingPlan.healingExplanation}</Text>
            </View>
          )}

          {healingPlan && (
            <>
              <Text style={[styles.sectionTitle, { color: palette.textMuted, marginBottom: SPACING.md }]}>
                your daily ritual 🕊️
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={{ paddingRight: SPACING.md }}
              >
                {healingPlan.programPhases.map((phase: any, index: number) => {
                  const timeLabel = index === 0 ? 'morning' : index === 1 ? 'midday' : 'evening';
                  const emoji = index === 0 ? '🌅' : index === 1 ? '☀️' : '🌙';
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.practiceCard, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}
                      activeOpacity={0.85}
                      onPress={() => router.push(`/practice/21`)}
                    >
                      <Text style={styles.practiceEmoji}>{emoji}</Text>
                      <Text style={[styles.practiceTitle, { color: palette.textPrimary }]}>{timeLabel} • {phase.weeks.toLowerCase()}</Text>
                      <Text style={[styles.practiceDesc, { color: palette.textMuted }]}>{phase.title.toLowerCase()}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}

          {/* ── YOUR DEVOTION (ex-streak) ── */}
          <Text style={[styles.sectionTitle, { color: palette.textMuted, marginBottom: SPACING.md }]}>
            your devotion 🌿
          </Text>

          {/* ── PRACTICE CATALOG ── */}
          <Text style={[styles.sectionTitle, { color: palette.textMuted, marginBottom: SPACING.md }]}>
            begin your practice
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={{ paddingRight: SPACING.md }}
          >
            {practices.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.practiceCard, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.id === 'custom') {
                    router.push('/timer-setup');
                  } else {
                    router.push(`/practice/${item.id}`);
                  }
                }}
              >
                <Text style={styles.practiceEmoji}>{item.emoji}</Text>
                <Text style={[styles.practiceTitle, { color: palette.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.practiceDesc, { color: palette.textMuted }]}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── CTA SHARE (Enforced Share2 3-dots icon) ── */}
          <AlohaButton
            onPress={() => {}}
            text="share"
            icon={<Share2 size={20} color="#ffffff" />}
            style={{ marginTop: SPACING.section }}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.horizontal,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.section,
  },
  headerGreeting: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: COLORS.textSandMuted,
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  headerName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
  },
  headerGoal: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    marginTop: 4,
    textTransform: 'lowercase',
  },
  profileBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: RADIUS.card,
    padding: SPACING.card,
    marginBottom: SPACING.section,
    borderWidth: 1.5,
    shadowColor: '#E86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiBox: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bigEmoji: {
    fontSize: 44,
  },
  absoluteCenter: {
    position: 'absolute',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
  },
  absoluteText: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginLeft: 'auto',
  },
  badgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    textTransform: 'lowercase',
  },
  descContainer: {
    height: 40,
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  editLink: {
    marginTop: 4,
  },
  editLinkText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    textTransform: 'lowercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    height: 24,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    textTransform: 'lowercase',
    letterSpacing: 1.2,
  },
  borderlessOrbCard: {
    paddingVertical: 12,
    marginBottom: SPACING.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardOrbContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardOrb: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dashboardOrbCore: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffedd5',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  brandTitleText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    marginBottom: 4,
    letterSpacing: 1.5,
    textTransform: 'lowercase',
  },
  brandSubtitleText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    textTransform: 'lowercase',
  },
  horizontalScroll: {
    marginHorizontal: -SPACING.horizontal,
    paddingHorizontal: SPACING.horizontal,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  practiceCard: {
    width: 168,
    height: 180,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 1.5,
    shadowColor: '#E86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 3,
    justifyContent: 'flex-end',
  },
  practiceEmoji: {
    fontSize: 36,
    marginBottom: 'auto',
  },
  practiceTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  practiceDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    textTransform: 'lowercase',
  },
  welcomingCard: {
    borderRadius: RADIUS.card,
    padding: SPACING.card,
    marginBottom: SPACING.section,
    borderWidth: 1.5,
  },
  welcomingText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  healingExplanationTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    marginBottom: 8,
    textTransform: 'lowercase',
  },
  healingExplanationText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'lowercase',
  },
});
