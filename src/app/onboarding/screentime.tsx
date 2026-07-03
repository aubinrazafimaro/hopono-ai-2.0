import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

const TIME_OPTIONS = [
  { label: 'less than 1h', emoji: '🌿' },
  { label: '1-2h', emoji: '🌊' },
  { label: '3-4h', emoji: '🌑' },
  { label: '5-6h', emoji: '🔥' },
  { label: '6h+', emoji: '🌋' }
];

export default function ScreenTimeScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [step, setStep] = useState(0);
  const [showBtn, setShowBtn] = useState(false);

  // Transition animations
  const t1 = useRef(new Animated.Value(0)).current;
  const t2 = useRef(new Animated.Value(0)).current;
  const r1 = useRef(new Animated.Value(0)).current;
  const r2 = useRef(new Animated.Value(0)).current;
  const r3 = useRef(new Animated.Value(0)).current;
  const btn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === 1) {
      Animated.sequence([
        Animated.timing(t1, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.delay(800),
        Animated.timing(t2, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.delay(1500),
        Animated.timing(r1, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(r2, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(r3, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]).start(() => {
        setShowBtn(true);
        Animated.timing(btn, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    }
  }, [step]);

  const handleSelectTime = (time: string) => {
    updateData({ screenTime: time });
  };

  // Calculations
  const getDailyHours = (timeStr: string) => {
    if (timeStr === 'less than 1h') return 1;
    if (timeStr === '1-2h') return 2;
    if (timeStr === '3-4h') return 4;
    if (timeStr === '5-6h') return 6;
    if (timeStr === '6h+') return 8;
    return 2; // fallback
  };

  const getAgeLowerBound = (ageStr: string) => {
    if (ageStr === '15-20') return 15;
    if (ageStr === '21-25') return 21;
    if (ageStr === '26-30') return 26;
    if (ageStr === '31-40') return 31;
    if (ageStr === '41-50') return 41;
    if (ageStr === '50+') return 50;
    return 25; // fallback
  };

  const dailyH = getDailyHours(data.screenTime);
  const yearlyH = dailyH * 365;
  const yearlyDays = Math.round(yearlyH / 24);
  const ageBound = getAgeLowerBound(data.age);
  const remainingYears = Math.max(0, 80 - ageBound); // assume 80y lifespan
  const lifetimeMonths = Math.round((yearlyDays * remainingYears) / 30);

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
        {step === 0 && (
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${2 / 8 * 100}%` }]} />
          </View>
        )}
        {step === 0 ? (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>let's be honest.</Text>
              <Text style={styles.subtitle}>this is just between you and hopono.</Text>
            </View>
            
            <Text style={styles.question}>how many hours a day does your phone take from you?</Text>
            
            <View style={styles.scrollFrame}>
              <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
                {TIME_OPTIONS.map((time) => (
                  <TouchableOpacity
                    key={time.label}
                    style={[styles.optionRow, data.screenTime === time.label && styles.optionRowActive]}
                    onPress={() => handleSelectTime(time.label)}
                  >
                    <Text style={[styles.optionText, data.screenTime === time.label && styles.optionTextActive]}>{time.emoji}  {time.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={[styles.content, { justifyContent: 'center' }]}>
            <View style={styles.guiltSection}>
              <Animated.Text style={[styles.bodyText, { opacity: t1 }]}>
                {data.screenTime} a day. that's {yearlyH} hours this year.
              </Animated.Text>
              <Animated.Text style={[styles.bodyText, { opacity: t2, color: '#e86935', fontFamily: 'Nunito_600SemiBold' }]}>
                {yearlyDays} days. {lifetimeMonths} months of your life.
              </Animated.Text>
            </View>

            <View style={styles.reassureSection}>
              <Animated.Text style={[styles.bodyText, { opacity: r1 }]}>
                that time belongs to you, {data.name}.
              </Animated.Text>
              <Animated.Text style={[styles.bodyText, { opacity: r2 }]}>
                hopono turns those moments into healing.
              </Animated.Text>
              <Animated.Text style={[styles.bodyText, { opacity: r3 }]}>
                every minute you reclaim is a minute you give back to yourself.
              </Animated.Text>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
      {step === 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <AlohaButton onPress={() => setStep(1)} text="continue" variant="primary" disabled={!data.screenTime} />
        </View>
      )}
      {step === 1 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <AlohaButton onPress={() => router.push('/onboarding/goals')} text="continue" variant="primary" disabled={!showBtn} />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerTransparent: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 32,
    paddingHorizontal: 32,
    paddingBottom: 140,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: '#e86935',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#4b5563',
  },
  question: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: '#1f2937',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsList: {
    gap: 16,
  },
  optionRow: {
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 20,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 64,
    justifyContent: 'center',
    marginVertical: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginHorizontal: 32,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#e86935',
    borderRadius: 3,
  },
  scrollFrame: {
    maxHeight: 310,
    borderRadius: 24,
    backgroundColor: 'rgba(241, 245, 249, 0.4)',
    padding: 8,
    width: '100%',
  },
  optionsScrollList: {
    gap: 8,
  },
  optionRowActive: {
    backgroundColor: '#fff5f0',
    borderColor: '#e86935',
    shadowColor: '#e86935',
    shadowOpacity: 0.15,
  },
  optionText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#4b5563',
  },
  optionTextActive: {
    color: '#e86935',
  },
  guiltSection: {
    gap: 16,
    marginBottom: 40,
  },
  reassureSection: {
    gap: 16,
  },
  bodyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 18,
    color: '#1f2937',
    lineHeight: 28,
  },
  bottomContainer: {
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
});
