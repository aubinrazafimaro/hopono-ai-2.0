import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { peaceStates, moodStates } from '@/context/CheckInContext';
import { useOnboarding } from '@/context/OnboardingContext';
import ContinueButton from '@/components/ContinueButton';
import { Ionicons } from '@expo/vector-icons';

// --- STEP 1: INNER PEACE ---
const PeaceStep = ({ onNext }: { onNext: () => void }) => {
  const [sliderValue, setSliderValue] = useState(2);
  const animatedValue = useRef(new Animated.Value(2)).current;

  const handleValueChange = (val: number) => {
    const index = Math.round(val);
    setSliderValue(index);
    Animated.timing(animatedValue, {
      toValue: val,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ['#1e293b', '#64748b', '#e2e8f0', '#fdb878', '#e86935'],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ['#ffffff', '#ffffff', '#333333', '#ffffff', '#ffffff'],
  });

  return (
    <Animated.View style={[styles.stepContainer, { backgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, { color: textColor }]}>
            how does your{'\n'}inner peace feel right now?
          </Animated.Text>
        </View>

        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{peaceStates[sliderValue].emoji}</Text>
          <Animated.Text style={[styles.stateText, { color: textColor }]}>
            {peaceStates[sliderValue].text}
          </Animated.Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={4}
            step={0.1}
            value={2}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#ffffff"
          />
        </View>

          <ContinueButton 
            onPress={onNext} 
            color="#ffffff"
            textColor="#e86935"
          />
      </SafeAreaView>
    </Animated.View>
  );
};

// --- STEP 2: MOOD ---
const MoodStep = ({ onNext }: { onNext: () => void }) => {
  const [sliderValue, setSliderValue] = useState(2);
  const animatedValue = useRef(new Animated.Value(2)).current;

  const handleValueChange = (val: number) => {
    const index = Math.round(val);
    setSliderValue(index);
    Animated.timing(animatedValue, {
      toValue: val,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ['#7f1d1d', '#c2410c', '#eab308', '#14b8a6', '#06b6d4'],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ['#ffffff', '#ffffff', '#333333', '#ffffff', '#ffffff'],
  });

  return (
    <Animated.View style={[styles.stepContainer, { backgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, { color: textColor }]}>
            what is your{'\n'}heart carrying today?
          </Animated.Text>
        </View>

        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{moodStates[sliderValue].emoji}</Text>
          <Animated.Text style={[styles.stateText, { color: textColor }]}>
            {moodStates[sliderValue].text}
          </Animated.Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={4}
            step={0.1}
            value={2}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#ffffff"
          />
        </View>

        <ContinueButton 
          onPress={onNext} 
          color="#ffffff"
          textColor="#e86935"
        />
      </SafeAreaView>
    </Animated.View>
  );
};

// --- STEP 3: PRACTICE ---
const PracticeStep = ({ name, onNext }: { name: string, onNext: () => void }) => {
  const phrases = [
    name ? `${name}, I am sorry` : "I am sorry",
    "please, forgive me",
    "thank you",
    "I love you"
  ];
  
  const targetCount = 9;
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(-1);
  const countRef = useRef(1);
  const [currentCount, setCurrentCount] = useState(1);
  const isFinishedRef = useRef(false);
  const [isStarted, setIsStarted] = useState(false);

  const orbScale = useRef(new Animated.Value(1)).current;
  const orbOpacity = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Idle Orb Breathing Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 1.1, duration: 4000, useNativeDriver: true }),
          Animated.timing(orbOpacity, { toValue: 1, duration: 4000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 1, duration: 4000, useNativeDriver: true }),
          Animated.timing(orbOpacity, { toValue: 0.8, duration: 4000, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  // Auto-play sequence
  useEffect(() => {
    if (!isStarted) return;
    
    let timeoutId: ReturnType<typeof setTimeout>;

    const playPhrase = (index: number) => {
      if (isFinishedRef.current) return;

      if (index >= phrases.length) {
        if (countRef.current >= targetCount) {
          isFinishedRef.current = true;
          onNext(); // Move to congrats
          return;
        }
        countRef.current += 1;
        setCurrentCount(countRef.current);
        
        timeoutId = setTimeout(() => {
          playPhrase(0);
        }, 500);
        return;
      }

      setCurrentPhraseIndex(index);
      
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || isFinishedRef.current) return;
        
        timeoutId = setTimeout(() => {
          if (isFinishedRef.current) return;
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (!finished || isFinishedRef.current) return;
            playPhrase(index + 1);
          });
        }, 1500); 
      });
    };

    playPhrase(0);

    return () => {
      isFinishedRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [isStarted]);

  return (
    <View style={styles.practiceContainer}>
      <LinearGradient colors={['#ffffff', '#fff7ed']} style={StyleSheet.absoluteFill} />

      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orb, { transform: [{ scale: orbScale }], opacity: orbOpacity }]}>
          <Svg width="300" height="300" viewBox="0 0 300 300">
            <Defs>
              <RadialGradient id="practiceGlow" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="#fed7aa" stopOpacity="0.8" />
                <Stop offset="50%" stopColor="#ffedd5" stopOpacity="0.4" />
                <Stop offset="100%" stopColor="#ffedd5" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="150" cy="150" r="150" fill="url(#practiceGlow)" />
          </Svg>
        </Animated.View>
        <View style={styles.orbCore} />
      </View>

      <View style={[styles.practiceBottomContainer, !isStarted && { height: undefined, minHeight: 180, marginBottom: 50 }]}>
        {!isStarted ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Text style={styles.mantraText}>breathe. and repeat after me.</Text>
          </View>
        ) : (
          currentPhraseIndex !== -1 ? (
            <Animated.Text style={[styles.mantraText, { opacity: textOpacity }]}>
              {phrases[currentPhraseIndex]}
            </Animated.Text>
          ) : null
        )}
      </View>

      {!isStarted && (
        <View style={{ position: 'absolute', bottom: 40, right: 24 }}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
            onPress={() => setIsStarted(true)}
          >
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#e86935', textTransform: 'lowercase' }}>
              begin 🌺
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#e86935" style={{ marginLeft: 6, transform: [{ translateY: 1 }] }} />
          </TouchableOpacity>
        </View>
      )}
      
      {isStarted && (
        <View style={styles.dotsContainer}>
          {Array.from({ length: targetCount }).map((_, i) => (
            <View key={i} style={[styles.dot, i < currentCount ? styles.dotActive : null]} />
          ))}
        </View>
      )}
    </View>
  );
};

const getWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday
  const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - currentDay + i);
    week.push({
      dayName: days[i],
      dateNum: date.getDate(),
      isToday: i === currentDay,
    });
  }
  return week;
};

// --- STEP 4: CONGRATS ---
const CongratsStep = ({ onNext }: { onNext: () => void }) => {
  const emojiScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const flowerBreath = useRef(new Animated.Value(1)).current;
  const [weekDays] = useState(getWeekDays);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(emojiScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 1, duration: 600, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0, duration: 1200, useNativeDriver: true })
      ])
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flowerBreath, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
          Animated.timing(flowerBreath, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const finalEmojiScale = Animated.multiply(emojiScale, flowerBreath);

  return (
    <View style={styles.stepContainer}>
      <LinearGradient colors={['#e86935', '#d95a26']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.congratsMain}>
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
            <Animated.Text style={[styles.congratsEmoji, { transform: [{ scale: finalEmojiScale }] }]}>
              🌺
            </Animated.Text>
          </View>
          
          <Animated.View style={[styles.congratsTextWrapper, { opacity: contentOpacity }]}>
            <Text style={styles.congratsHuge}>hoʻomaikaʻi</Text>
            <Text style={styles.congratsSub}>(congratulations)</Text>
            <Text style={styles.congratsDesc}>something just shifted in you.</Text>
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

        <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: contentOpacity }}>
          <ContinueButton 
            onPress={onNext} 
            text="I felt it. what's next?"
            color="rgba(255, 255, 255, 0.25)"
            textColor="#ffffff"
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

// --- MAIN COMPONENT ---
export default function MiniPracticeScreen() {
  const { data } = useOnboarding();
  const name = data.name && data.name.trim() !== '' ? data.name.trim() : '';

  const [step, setStep] = useState<'peace' | 'mood' | 'practice' | 'congrats'>('peace');

  if (step === 'peace') return <PeaceStep onNext={() => setStep('mood')} />;
  if (step === 'mood') return <MoodStep onNext={() => setStep('practice')} />;
  if (step === 'practice') return <PracticeStep name={name} onNext={() => setStep('congrats')} />;
  if (step === 'congrats') return <CongratsStep onNext={() => router.push('/onboarding/plan')} />;

  return null;
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  // Check-ins
  titleContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    textTransform: 'lowercase',
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 100,
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
  },
  slider: {
    width: '85%',
    height: 40,
  },
  stateText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    marginTop: 16,
    textTransform: 'lowercase',
  },
  buttonWhite: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 30,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonTextOrange: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#e86935',
    textTransform: 'lowercase',
  },
  // Practice
  practiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  orbContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbCore: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffedd5',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
  practiceBottomContainer: {
    marginBottom: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mantraText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 28,
    color: '#334155',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fed7aa',
  },
  dotActive: {
    backgroundColor: '#e86935',
  },
  // Congrats
  congratsMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emojiGlowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  congratsTextWrapper: {
    alignItems: 'center',
    marginBottom: 16,
    transform: [{ translateY: -15 }],
  },
  congratsHuge: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 48,
    color: '#ffffff',
    textTransform: 'lowercase',
    marginBottom: 4,
    letterSpacing: -1,
  },
  congratsSub: {
    fontFamily: 'Nunito_400Regular',
    fontStyle: 'italic',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.65)',
    transform: [{ translateY: -8 }],
    marginBottom: 8,
  },
  congratsDesc: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#ffffff',
    textTransform: 'lowercase',
    marginTop: 50,
    marginBottom: 12,
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
    backgroundColor: '#ffffff',
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
    color: '#e86935',
  },
  bottomContainer: {
    paddingBottom: 40,
  },
  buttonTranslucent: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonTextWhite: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#ffffff',
    textTransform: 'lowercase',
  }
});
