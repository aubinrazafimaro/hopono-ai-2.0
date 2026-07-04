import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCheckIn, peaceStates, moodStates } from '@/context/CheckInContext';
import { useUser } from '@/context/UserContext';
import { useAppTheme } from '@/context/AppThemeContext';
import AlohaButton from '@/components/AlohaButton';
import { SPACING, RADIUS, COLORS, TYPOGRAPHY } from '@/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyProgress, DailyProgress } from '@/services/history';
import { generateLocalHealingPlan } from '@/services/ai';

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
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);

  useEffect(() => {
    const loadHealingPlan = async () => {
      try {
        const stored = await AsyncStorage.getItem('@hopono_healing_plan');
        if (stored) {
          const plan = JSON.parse(stored);
          if (!plan.morningTitle) {
            // Migrate old plan by merging it with new default daily fields
            const fallback = generateLocalHealingPlan(userData || {});
            const migratedPlan = { ...plan, ...fallback };
            await AsyncStorage.setItem('@hopono_healing_plan', JSON.stringify(migratedPlan));
            setHealingPlan(migratedPlan);
          } else {
            setHealingPlan(plan);
          }
        }
      } catch (err) {
        console.error("Failed to load healing plan:", err);
      }
    };
    loadHealingPlan();
  }, [userData]);

  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        const progress = await getDailyProgress();
        setDailyProgress(progress);
      };
      loadProgress();
    }, [healingPlan])
  );

  const getProgressDetails = () => {
    if (!dailyProgress) {
      return { percentage: 0, text: 'loading...', nextSession: null, reps: 0 };
    }
    
    let percentage = 0;
    let text = 'begin morning cleaning';
    let nextSession: 'morning' | 'midday' | 'evening' | null = 'morning';
    let reps = healingPlan?.morningReps || 3;
    
    if (dailyProgress.morningCompleted) {
      percentage = 30;
      text = 'begin midday pause';
      nextSession = 'midday';
      reps = healingPlan?.middayReps || 6;
    }
    
    if (dailyProgress.middayCompleted) {
      percentage = 60;
      text = 'begin evening release';
      nextSession = 'evening';
      reps = healingPlan?.eveningReps || 9;
    }
    
    if (dailyProgress.eveningCompleted) {
      percentage = 100;
      text = 'peace is complete 🌺';
      nextSession = null;
      reps = 0;
    }
    
    return { percentage, text, nextSession, reps };
  };

  const { percentage: progressPercent, text: progressText, nextSession, reps: nextReps } = getProgressDetails();

  const handleOrbPress = () => {
    if (!healingPlan || !nextSession) return;
    
    if (nextSession === 'morning') {
      router.push({
        pathname: '/check-in-1',
        params: { from: 'ritual' }
      });
      return;
    }
    
    router.push(`/practice/${nextReps}?type=${nextSession}`);
  };

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

  // Liquid/Fluid float animation values
  const floatAnimX = useRef(new Animated.Value(0)).current;
  const floatAnimY = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatAnimX, { toValue: 8, duration: 3500, useNativeDriver: true }),
          Animated.timing(floatAnimY, { toValue: -6, duration: 3500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(floatAnimX, { toValue: -8, duration: 4500, useNativeDriver: true }),
          Animated.timing(floatAnimY, { toValue: 8, duration: 4500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(floatAnimX, { toValue: 0, duration: 3500, useNativeDriver: true }),
          Animated.timing(floatAnimY, { toValue: 0, duration: 3500, useNativeDriver: true }),
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



          {/* ── CENTRAL GLOWING ORB & BRAND NAME (Replaces Calendar) ── */}
          <View style={styles.borderlessOrbCard}>
            <TouchableOpacity 
              activeOpacity={0.85} 
              onPress={handleOrbPress} 
              disabled={!nextSession || !healingPlan}
              style={styles.dashboardOrbContainer}
            >
              {/* Layer 1: Outer Halo */}
              <Animated.View style={[
                styles.orbOuterHalo,
                {
                  transform: [{ scale: orbScale }],
                }
              ]}>
                <LinearGradient
                  colors={['rgba(232, 105, 53, 0.35)', 'rgba(254, 215, 170, 0.12)', 'rgba(254, 215, 170, 0.02)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>

              {/* Layers 2-5: The 3D Liquid Breathing Base Sphere */}
              <Animated.View style={[
                styles.orbBase,
                {
                  transform: [{ scale: orbScale }],
                  opacity: orbOpacity,
                }
              ]}>
                {/* Sphere Base Gradient */}
                <LinearGradient
                  colors={['#e86935', '#f97316', '#fdba74']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Liquid/Fluid Accent 1 (Pinkish Glow) */}
                <Animated.View style={[
                  styles.orbLiquidAccentPink,
                  {
                    transform: [
                      { translateX: floatAnimX },
                      { translateY: floatAnimY },
                    ],
                  }
                ]}>
                  <LinearGradient
                    colors={['rgba(244, 63, 94, 0.75)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>

                {/* Liquid/Fluid Accent 2 (Purple Glow) */}
                <Animated.View style={[
                  styles.orbLiquidAccentPurple,
                  {
                    transform: [
                      { translateX: Animated.multiply(floatAnimX, -1) },
                      { translateY: Animated.multiply(floatAnimY, -1) },
                    ],
                  }
                ]}>
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.65)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>

                {/* Glass 3D Reflection Highlight */}
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
                  style={styles.orbReflection}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.7, y: 0.7 }}
                />
              </Animated.View>
            </TouchableOpacity>
            
            <Text style={[styles.brandTitleText, { color: '#ffffff' }]}>
              hopono AI
            </Text>

            {healingPlan && (
              <Text style={[styles.progressPercentLabel, { color: 'rgba(255, 255, 255, 0.6)' }]}>
                personalized plan • {progressPercent}% completed
              </Text>
            )}
            
            {healingPlan ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleOrbPress}
                disabled={!nextSession}
                style={[
                  styles.progressButton, 
                  { 
                    backgroundColor: nextSession ? palette.primary : 'rgba(255,255,255,0.06)', 
                    borderColor: 'rgba(255,255,255,0.1)' 
                  }
                ]}
              >
                <Text style={[styles.progressButtonText, { color: nextSession ? '#ffffff' : 'rgba(255,255,255,0.4)' }]}>
                  {progressText}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.brandSubtitleText, { color: 'rgba(255, 255, 255, 0.5)' }]}>
                breathe in. clean inside. release.
              </Text>
            )}
          </View>



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
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: SPACING.section,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090d16', // Deep dark space background for stunning contrast
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(232, 105, 53, 0.15)', // Subtle glowing primary border
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 8,
  },
  dashboardOrbContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  orbOuterHalo: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
  },
  orbBase: {
    width: 170,
    height: 170,
    borderRadius: 85,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  orbLiquidAccentPink: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    top: -20,
    left: -20,
  },
  orbLiquidAccentPurple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -20,
    right: -20,
  },
  orbReflection: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    top: 0,
    left: 0,
  },
  progressPercentLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
    textTransform: 'lowercase',
  },
  progressButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1.5,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  progressButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    textTransform: 'lowercase',
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

});
