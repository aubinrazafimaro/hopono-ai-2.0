import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SimpleLineIcons } from '@expo/vector-icons';

const phrases = [
  "Aubin, I am sorry",
  "please, forgive me",
  "thank you",
  "I love you"
];

export default function PracticeScreen() {
  const { id, time } = useLocalSearchParams<{ id: string, time?: string }>();
  
  // Is it the timer mode or repetition mode?
  const isTimerMode = id === 'custom';
  const targetCount = isTimerMode ? 0 : parseInt(id || '21', 10);
  const initialTime = time ? parseInt(time, 10) : 300;

  // State
  const [count, setCount] = useState(1);
  const countRef = useRef(1);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  // Mantra State
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const isFinishedRef = useRef(false);

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
    if (!isTimerMode || isFinished) return;
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
  }, [isTimerMode, isFinished]);

  const handleFinish = () => {
    setIsFinished(true);
    isFinishedRef.current = true;
    
    // Instantly redirect to the Celebration screen
    const type = isTimerMode ? 'timer' : 'repetition';
    const val = isTimerMode ? initialTime : targetCount;
    router.push(`/completion?type=${type}&value=${val}`);
  };

  // Auto-play the sequence
  useEffect(() => {
    playPhrase(0);
    
    return () => {
      isFinishedRef.current = true; // Stop loops on unmount
    };
  }, []);

  const playPhrase = (index: number) => {
    if (isFinishedRef.current) return;

    if (index >= phrases.length) {
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
            colors={['#ffedd5', '#fed7aa', 'rgba(254, 215, 170, 0)']}
            style={StyleSheet.absoluteFill}
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
            {phrases[currentPhraseIndex]}
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
    backgroundColor: 'rgba(255, 237, 213, 0.4)', // Pale orange glow
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
