import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const affirmations = [
  "what a beautiful moment of peace. your mind and heart thank you.",
  "you are doing beautifully. thank you for taking this time for yourself.",
  "every breath brings you closer to your true self. so proud of you.",
  "a gentle step forward. thank you for honoring your peace today.",
  "you are cultivating such beautiful energy. keep shining.",
];

const getWeekDays = () => {
  const today = new Date();
  const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  
  const week = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    week.push({
      dayName: days[date.getDay()],
      dateNum: date.getDate(),
      isToday: i === 0,
    });
  }
  return week;
};

export default function CompletionScreen() {
  const { type, value, feedback } = useLocalSearchParams<{ type: string; value: string; feedback?: string }>();

  const [affirmation] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);
  const [weekDays] = useState(getWeekDays);

  const emojiScale = useRef(new Animated.Value(0)).current;
  const flowerBreath = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reward: Grant 15 minutes of unlock time for completing the practice
    import('expo-app-blocker')
      .then(({ temporaryUnlock }) => temporaryUnlock?.(15))
      .catch(console.warn);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(emojiScale, { 
          toValue: 1, 
          friction: 5, 
          tension: 40,
          useNativeDriver: true 
        }),
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        })
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, { 
          toValue: 1, 
          duration: 800, 
          useNativeDriver: true 
        }),
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true
        })
      ])
    ]).start(() => {
      // Start breathing loop after initial bloom
      Animated.loop(
        Animated.sequence([
          Animated.timing(flowerBreath, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
          Animated.timing(flowerBreath, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const handleDismiss = () => {
    router.push('/');
  };

  const formatValue = () => {
    if (type !== 'timer') return `you just completed ${value} repetitions.`;
    const secs = parseInt(value, 10);
    if (secs >= 60) {
      const mins = Math.floor(secs / 60);
      return `you just completed ${mins} minute${mins > 1 ? 's' : ''}.`;
    }
    return `you just completed ${secs} seconds.`;
  };

  const finalEmojiScale = Animated.multiply(emojiScale, flowerBreath);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#e86935', '#d95a26']} 
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.mainContent}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={[styles.emojiGlowContainer, { opacity: glowOpacity, transform: [{ scale: flowerBreath }] }]}>
            <Svg width="400" height="400" viewBox="0 0 400 400">
              <Defs>
                <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                  <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <Stop offset="20%" stopColor="#ffffff" stopOpacity="0.4" />
                  <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                  <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx="200" cy="200" r="200" fill="url(#glow)" />
            </Svg>
          </Animated.View>
          <Animated.Text style={[styles.emoji, { transform: [{ scale: finalEmojiScale }] }]}>
            🌺
          </Animated.Text>
        </View>
        
        <Animated.View style={[styles.textWrapper, { opacity: contentOpacity }]}>
          <Text style={styles.hugeWord}>hoʻomaikaʻi</Text>
          <Text style={styles.translationText}>(congratulations)</Text>
          <Text style={styles.streakText}>{formatValue()}</Text>
          <View style={{ maxHeight: 110, paddingHorizontal: 10, width: '100%', marginBottom: 12 }}>
            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ alignItems: 'center' }}>
              <Text style={styles.affirmationText}>
                {feedback ? decodeURIComponent(feedback) : affirmation}
              </Text>
            </ScrollView>
          </View>
        </Animated.View>

        <Animated.View style={[styles.calendarCard, { opacity: contentOpacity }]}>
          <View style={styles.daysRow}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayName}>{day.dayName}</Text>
                <View style={[
                  styles.dateCircle, 
                  day.isToday && styles.dateCircleActive
                ]}>
                  <Text style={[
                    styles.dateNum,
                    day.isToday && styles.dateNumActive
                  ]}>
                    {day.dateNum}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.bottomContainer, { opacity: contentOpacity }]}>
        <TouchableOpacity 
          style={styles.continueButton} 
          activeOpacity={0.8}
          onPress={handleDismiss}
        >
          <Text style={styles.continueText}>done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e86935',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
  },
  emojiGlowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 16, // Very close to the calendar
    transform: [{ translateY: -15 }], // Pushes the entire text block up as requested
  },
  hugeWord: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 48,
    color: '#ffffff',
    textTransform: 'lowercase',
    marginBottom: 4,
    letterSpacing: -1,
  },
  translationText: {
    fontFamily: 'Nunito_400Regular',
    fontStyle: 'italic',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.65)',
    transform: [{ translateY: -8 }], // Visually pulls it up without pushing the main word down in flex layout
    marginBottom: 8, // Balances the space below
  },
  streakText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#ffffff',
    textTransform: 'lowercase',
    marginTop: 50, // Huge gap between Title group and Message group
    marginBottom: 12,
  },
  affirmationText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'lowercase',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  calendarCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayName: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    textTransform: 'lowercase',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCircleActive: {
    backgroundColor: '#ffffff', // White circle for current day
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  dateNum: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateNumActive: {
    color: '#e86935', // Orange text for current day
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  continueButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Translucent white button
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  continueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#ffffff',
    textTransform: 'lowercase',
  }
});
