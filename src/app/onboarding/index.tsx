import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const GREETINGS = ["hello pono", "aloha", "hey"];
const FADE_DURATION = 400; // snappier fade
const HOLD_DURATION = 1000; // slightly shorter hold

export default function HookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPos = insets.bottom > 0 ? insets.bottom + 14 : 24;
  const [greetingIndex, setGreetingIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;
  const [continueShown, setContinueShown] = useState(false);

  // Lightning & Logo animations
  const lightningOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial sequence: Lightning -> Logo -> Main Greetings
    Animated.sequence([
      // Flash lightning
      Animated.timing(lightningOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(lightningOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      
      // Flash logo briefly
      Animated.timing(logoOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      
      // Fade in greetings area
      Animated.timing(contentOpacity, { toValue: 1, duration: 800, useNativeDriver: true })
    ]).start(() => {
      startGreetingLoop(0);
    });
  }, []);

  const startGreetingLoop = (index: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: FADE_DURATION, useNativeDriver: true }),
      Animated.delay(HOLD_DURATION),
      Animated.timing(fadeAnim, { toValue: 0, duration: FADE_DURATION, useNativeDriver: true }),
      Animated.delay(300), // Rhythmic pause between words
    ]).start(() => {
      const nextIndex = (index + 1) % GREETINGS.length;
      setGreetingIndex(nextIndex);
      
      // Fade in continue button after first full cycle without disrupting the loop
      if (nextIndex === 0 && !continueShown) {
        setContinueShown(true);
        Animated.timing(continueOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      }
      
      startGreetingLoop(nextIndex);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.absoluteCenter} pointerEvents="none">
        <Animated.View style={{ opacity: lightningOpacity, position: 'absolute' }}>
          <Text style={{ fontSize: 120 }}>⚡️</Text>
        </Animated.View>
        <Animated.View style={{ opacity: logoOpacity, position: 'absolute' }}>
          <Text style={{ fontSize: 100 }}>🌺</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <View style={styles.centerContainer}>
          <Animated.Text style={[styles.greetingText, { opacity: fadeAnim }]}>
            {GREETINGS[greetingIndex]}
          </Animated.Text>
        </View>

        <Animated.View style={[styles.bottomContainer, { bottom: bottomPos, opacity: continueOpacity }]}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/onboarding/pain')}
            disabled={!continueShown}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.continueText}>begin</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6, transform: [{ translateY: 2 }] }} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e86935', // Main orange theme
  },
  absoluteCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 42,
    color: '#ffffff',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  continueButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  continueText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
});
