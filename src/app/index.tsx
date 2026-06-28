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
import { Droplet, Leaf, Infinity as InfinityIcon, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCheckIn, peaceStates, moodStates } from '@/context/CheckInContext';
import { useUser } from '@/context/UserContext';
import { useAppTheme } from '@/context/AppThemeContext';
import AlohaButton from '@/components/AlohaButton';
import { SPACING, RADIUS, COLORS, TYPOGRAPHY } from '@/theme';

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

  // Calendar: Last 30 days (oldest → today)
  const calendarDays = history.slice(0, 30).reverse().map((dayData, i) => {
    const isToday = i === 29;
    const dayNum  = new Date(dayData.date).getDate();
    if (isToday) {
      return { day: dayNum, past: true, moodEmoji: currentMood.emoji, peaceEmoji: currentPeace.emoji };
    }
    if (dayData.hasCheckIn) {
      return { day: dayNum, past: true, moodEmoji: moodStates[dayData.moodIndex].emoji, peaceEmoji: peaceStates[dayData.peaceIndex].emoji };
    }
    return { day: dayNum, past: false };
  });

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

          {/* ── HEADER ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerGreeting}>aloha 🌺</Text>
              <Text style={styles.headerName}>
                {userData?.name ? userData.name.toLowerCase() : 'friend'}
              </Text>
              {userData?.lifeGoals?.[0] && (
                <Text style={[styles.headerGoal, { color: palette.primary }]}>
                  towards: {userData.lifeGoals[0]}
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

          {/* ── MONTHLY CALENDAR ── */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleRow}>
              <Animated.Text style={[styles.sectionTitle, { color: palette.textMuted, opacity: moodOpacity }]}>
                rhythm of {currentMonthName}
              </Animated.Text>
              <Animated.Text style={[styles.sectionTitle, styles.absoluteText, { color: palette.textMuted, opacity: peaceOpacity }]}>
                harmony of {currentMonthName}
              </Animated.Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.viewCalendarText, { color: palette.primary }]}>view calendar</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}>
            <View style={styles.calendarHeader}>
              {['m','t','w','t','f','s','s'].map((day, idx) => (
                <Text key={idx} style={[styles.dayText, { color: palette.textMuted }]}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarDays.map((item, idx) => {
                if (!item.past) {
                  return (
                    <View key={idx} style={styles.calCell}>
                      <View style={[styles.emptyCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
                      <Text style={[styles.calDateText, { color: palette.textMuted }]}>{item.day}</Text>
                    </View>
                  );
                }
                return (
                  <View key={idx} style={styles.calCell}>
                    <View style={[styles.emojiCircle, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                      <Animated.Text style={[styles.smallEmoji, { opacity: moodOpacity }]}>
                        {item.moodEmoji}
                      </Animated.Text>
                      <Animated.Text style={[styles.smallEmoji, styles.absoluteCenter, { opacity: peaceOpacity }]}>
                        {item.peaceEmoji}
                      </Animated.Text>
                    </View>
                    <Text style={[styles.calDateText, { color: palette.textMuted }]}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
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

          {/* ── CTA SHARE ── */}
          <AlohaButton
            onPress={() => {}}
            label="share with a friend · kākou 🤝"
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
    ...TYPOGRAPHY.label,
    color: COLORS.textSandMuted,
    marginBottom: 4,
  },
  headerName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textSand,
  },
  headerGoal: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    marginTop: 4,
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
  viewCalendarText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    textTransform: 'lowercase',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: 4,
  },
  dayText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    width: 30,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  smallEmoji: {
    fontSize: 20,
  },
  emptyCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.pill,
    marginBottom: 6,
  },
  calDateText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
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
