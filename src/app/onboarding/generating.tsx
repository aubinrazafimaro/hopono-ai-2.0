import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { useOnboarding } from '@/context/OnboardingContext';
import ConfettiCannon from 'react-native-confetti-cannon';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LOADING_STEPS = [
  "listening to what you shared...",
  "sensing where the pain lives...",
  "crafting your personal mantras...",
  "preparing your 21-day healing path...",
  "adding the final touches, just for you...",
  "your healing begins now. 🌺"
];

export default function GeneratingScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [percentage, setPercentage] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimFinal = useRef(new Animated.Value(0)).current;
  
  const radius = 100;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progressAnim.addListener((state) => {
      const val = Math.round(state.value);
      setPercentage(val);
      
      // Update step index based on progress
      if (val === 100) {
        setStepIndex(5);
      } else if (val >= 80) {
        setStepIndex(4);
      } else if (val >= 60) {
        setStepIndex(3);
      } else if (val >= 40) {
        setStepIndex(2);
      } else if (val >= 20) {
        setStepIndex(1);
      } else {
        setStepIndex(0);
      }
    });

    // Make it take about 18 seconds to feel substantial and deep
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 18000,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start(() => {
      setIsFinished(true);
      Animated.timing(fadeAnimFinal, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      progressAnim.removeAllListeners();
    };
  }, []);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  if (isFinished) {
    return (
      <View style={[styles.container, styles.successBackground]}>
        <ConfettiCannon
          count={250}
          origin={{ x: 200, y: -50 }}
          autoStart={true}
          fadeOut={true}
          explosionSpeed={350}
          fallSpeed={3000}
        />
        <SafeAreaView style={styles.containerTransparent}>
          <Animated.View style={[styles.center, { opacity: fadeAnimFinal }]}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-sharp" size={40} color="#e86935" />
            </View>
            <Text style={styles.successTitle}>
              {data.name && data.name.trim() !== '' ? `${data.name.trim()},` : ''} something beautiful{'\n'}was made for you. 🌺
            </Text>
          </Animated.View>

          <Animated.View style={[styles.bottomContainerAbsolute, { opacity: fadeAnimFinal }]}>
            <TouchableOpacity 
              style={styles.whiteButton}
              onPress={() => router.push('/onboarding/power')}
            >
              <Text style={styles.whiteButtonText}>I'm ready</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        
        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <Svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
            {/* Track Circle */}
            <Circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Animated Progress Circle */}
            <AnimatedCircle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              stroke="#e86935"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              originX={radius + strokeWidth}
              originY={radius + strokeWidth}
            />
          </Svg>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>

        {/* Checkmarks row */}
        <View style={styles.checksContainer}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const isCompleted = stepIndex >= i && percentage > 0;
            return (
              <View 
                key={i} 
                style={[
                  styles.checkCircle, 
                  isCompleted ? styles.checkCircleActive : styles.checkCircleInactive
                ]}
              >
                {isCompleted && <Ionicons name="checkmark" size={14} color="#ffffff" />}
              </View>
            );
          })}
        </View>

        {/* Loading Text */}
        <Text style={styles.loadingText}>
          {LOADING_STEPS[stepIndex]}
        </Text>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 48,
    color: '#1e293b',
  },
  checksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#22c55e', // Success green
  },
  checkCircleInactive: {
    backgroundColor: '#e2e8f0', // Light gray
  },
  loadingText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 28,
  },
  containerTransparent: {
    flex: 1,
  },
  successBackground: {
    backgroundColor: '#e86935',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  successTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 36,
  },
  bottomContainerAbsolute: {
    position: 'absolute',
    bottom: 40,
    left: 32,
    right: 32,
  },
  whiteButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  whiteButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#e86935',
  }
});
