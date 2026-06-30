import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCheckIn, peaceStates, moodStates } from '@/context/CheckInContext';
import { useUser } from '@/context/UserContext';
import { generateCompletionFeedback } from '@/services/ai';
import { completeSession, saveSessionToHistory } from '@/services/history';

export default function PracticeScreen() {
  const { id, time, type } = useLocalSearchParams<{ id: string; time?: string; type?: 'morning' | 'midday' | 'evening' }>();
  
  // Is it the timer mode or repetition mode?
  const isTimerMode = id === 'custom';
  const targetCount = isTimerMode ? 0 : parseInt(id || '21', 10);
  const initialTime = time ? parseInt(time, 10) : 300;

  const { peaceIndex, moodIndex, history } = useCheckIn();
  const { userData } = useUser();
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const aiFeedbackRef = useRef<string>('');

  useEffect(() => {
    const prefetchFeedback = async () => {
      if (!type) return;
      try {
        const todayPeace = peaceStates[peaceIndex].text;
        const todayMood = moodStates[moodIndex].text;
        
        const yesterday = history[1];
        const yesterdayPeace = yesterday ? peaceStates[yesterday.peaceIndex].text : 'unknown';
        const yesterdayMood = yesterday ? moodStates[yesterday.moodIndex].text : 'unknown';
        
        const histEntries = history.slice(0, 5).map(h => 
          `- ${h.date}: checked in feeling "${moodStates[h.moodIndex].text}" (mood) and "${peaceStates[h.peaceIndex].text}" (peace)`
        ).join('\n');

        const feedback = await generateCompletionFeedback({
          onboardingData: userData,
          sessionType: type,
          reps: targetCount,
          todayPeace,
          todayMood,
          yesterdayPeace,
          yesterdayMood,
          recentHistory: histEntries
        });
        setAiFeedback(feedback);
        aiFeedbackRef.current = feedback;
      } catch (err) {
        console.warn('Failed to prefetch AI completion feedback:', err);
      }
    };
    prefetchFeedback();
  }, [type, userData, peaceIndex, moodIndex, history, targetCount]);

  // State
  const [count, setCount] = useState(1);
  const countRef = useRef(1);
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Synchronize timeLeft when the query parameter resolves asynchronously from Expo Router
  useEffect(() => {
    if (time) {
      const parsedTime = parseInt(time, 10);
      if (!isNaN(parsedTime) && parsedTime > 0) {
        setTimeLeft(parsedTime);
      }
    }
  }, [time]);
  
  // Mantra State
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const isFinishedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [userName, setUserName] = useState('friend');

  // Animations
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

  // Timer Mode Logic
  useEffect(() => {
    if (!isTimerMode || isFinished || !hasStarted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerMode, isFinished, hasStarted]);

  const handleFinish = async () => {
    setIsFinished(true);
    isFinishedRef.current = true;

    const finalFeedback = aiFeedbackRef.current || `thank you for completing your ${type || 'session'} practice. you are doing beautifully.`;
    
    if (type) {
      try {
        await completeSession(type);
        const todayPeace = peaceStates[peaceIndex].text;
        const todayMood = moodStates[moodIndex].text;
        await saveSessionToHistory(type, todayPeace, todayMood, finalFeedback);
      } catch (err) {
        console.warn('Failed to save session completion status:', err);
      }
    }
    
    // Instantly redirect to the Celebration screen
    const practiceType = isTimerMode ? 'timer' : 'repetition';
    const val = isTimerMode ? initialTime : targetCount;
    router.push(`/completion?type=${practiceType}&value=${val}&feedback=${encodeURIComponent(finalFeedback)}`);
  };

  const [phrasesList, setPhrasesList] = useState<string[]>([]);

  useEffect(() => {
    const loadCustomMantra = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        let name = 'friend';
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (userObj.name) name = userObj.name.trim().toLowerCase();
        }
        setUserName(name);

        setPhrasesList([
          `${name}, i am sorry`,
          "please forgive me",
          "thank you",
          "i love you"
        ]);
        setIsLoaded(true);
      } catch (err) {
        console.warn("Failed to load user name for mantra, using default", err);
        setPhrasesList([
          "i am sorry",
          "please forgive me",
          "thank you",
          "i love you"
        ]);
        setIsLoaded(true);
      }
    };
    loadCustomMantra();
  }, [type]);

  // Auto-play the sequence
  useEffect(() => {
    if (!isLoaded || phrasesList.length === 0 || !hasStarted) return;
    
    isFinishedRef.current = false;
    playPhrase(0);
    
    return () => {
      isFinishedRef.current = true; // Stop loops on unmount
    };
  }, [isLoaded, phrasesList, hasStarted]);

  const playPhrase = (index: number) => {
    if (isFinishedRef.current) return;

    if (index >= phrasesList.length) {
      // Sequence finished (one repetition done)
      if (!isTimerMode) {
        if (countRef.current >= targetCount) {
          handleFinish();
          return;
        }
        countRef.current += 1;
        setCount(countRef.current);
      }
      
      // Loop again after a brief pause
      setTimeout(() => {
        playPhrase(0);
      }, 500);
      return;
    }

    setCurrentPhraseIndex(index);
    
    // Fade in text
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished || isFinishedRef.current) return;
      
      // Hold for a moment, then fade out
      setTimeout(() => {
        if (isFinishedRef.current) return;
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (!finished || isFinishedRef.current) return;
          // Play next phrase
          playPhrase(index + 1);
        });
      }, 1500); // Time the text stays fully visible
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!hasStarted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#ffffff', '#fff7ed']} 
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.backButton}>
          <SimpleLineIcons name="close" size={28} color="#94a3b8" onPress={() => router.push('/')} />
        </View>

        <View style={styles.greetingCenterContainer}>
          <Text style={styles.greetingEmoji}>🌺</Text>
          <Text style={styles.greetingTitle}>aloha, {userName}</Text>
          <Text style={styles.greetingText}>
            happy to see you again for this beautiful day. if you are ready, tap below to begin your clearing.
          </Text>
        </View>

        <View style={styles.greetingBottomContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={() => setHasStarted(true)}
          >
            <Text style={styles.startText}>start</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Soft Background Gradient */}
      <LinearGradient
        colors={['#ffffff', '#fff7ed']} // White to very pale orange
        style={StyleSheet.absoluteFill}
      />

      {/* Back Button */}
      <View style={styles.backButton}>
        <SimpleLineIcons name="close" size={28} color="#94a3b8" onPress={() => {
          isFinishedRef.current = true;
          router.push('/');
        }} />
      </View>

      {/* TOP: Counter or Timer */}
      <View style={styles.topContainer}>
        {isFinished ? (
          <Text style={styles.finishText}>mahalo</Text>
        ) : isTimerMode ? (
          <Text style={styles.counterText}>{formatTime(timeLeft)}</Text>
        ) : (
          <Text style={styles.counterText}>{count}</Text>
        )}
      </View>

      {/* MIDDLE: Glowing Orb */}
      <View style={styles.orbContainer}>
        <Animated.View style={[
          styles.orb, 
          { 
            transform: [{ scale: orbScale }],
            opacity: orbOpacity 
          }
        ]}>
          <LinearGradient
            colors={['#ffedd5', 'rgba(254, 215, 170, 0.5)', 'rgba(254, 215, 170, 0.2)', 'transparent']}
            style={[StyleSheet.absoluteFill, { borderRadius: 150 }]}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        {/* Core sun */}
        <View style={styles.orbCore} />
      </View>

      {/* BOTTOM: Mantra Text */}
      <View style={styles.bottomContainer}>
        {currentPhraseIndex !== -1 && !isFinished ? (
          <Animated.Text style={[styles.mantraText, { opacity: textOpacity }]}>
            {phrasesList[currentPhraseIndex]}
          </Animated.Text>
        ) : null}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  greetingCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 40,
  },
  greetingEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  greetingTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#1e293b',
    textTransform: 'lowercase',
    marginBottom: 12,
  },
  greetingText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    textTransform: 'lowercase',
  },
  greetingBottomContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 60,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#e86935',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  startText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#ffffff',
    textTransform: 'lowercase',
  },
  topContainer: {
    marginTop: 120,
    alignItems: 'center',
    height: 80,
  },
  counterText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 72,
    color: '#94a3b8', // Soft slate gray
    fontWeight: '300',
  },
  finishText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 48,
    color: '#f97316',
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
    overflow: 'hidden',
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
  bottomContainer: {
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
  hintText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 18,
    color: '#cbd5e1',
    letterSpacing: 1,
  },
});
