import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import ContinueButton from '@/components/ContinueButton';

export default function ReassuranceScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  
  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;
  const text3Opacity = useRef(new Animated.Value(0)).current;
  const text4Opacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(text1Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(text2Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(text3Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(text4Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.delay(500),
    ]).start(() => {
      setShowBtn(true);
      Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    });
  }, []);

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.iconTop}>🌺</Text>
          <Text style={styles.title}>
            it takes <Text style={styles.highlight}>courage</Text> to look inside, {data.name || 'friend'}.
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.Text style={[styles.bodyText, { opacity: text1Opacity }]}>
            reaching for your phone when something hurts — that's not weakness. that's what we all do.
          </Animated.Text>
          
          <Animated.Text style={[styles.bodyText, { opacity: text2Opacity }]}>
            for over 2,000 years, hawaiian healers knew this truth: we all carry wounds that need tending.
          </Animated.Text>

          <Animated.Text style={[styles.bodyText, { opacity: text3Opacity }]}>
            you are not broken. you are human.
          </Animated.Text>

          <Animated.Text style={[styles.bodyText, { opacity: text4Opacity }]}>
            <Text style={styles.highlight}>ho'oponopono</Text> offers something rare — a way to release what you carry, not just manage it.
          </Animated.Text>

        </ScrollView>
        {showBtn && (
          <Animated.View style={{ opacity: btnOpacity, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <ContinueButton 
              onPress={() => router.push('/onboarding/final-recap')} 
              color="#ffffff" 
              textColor="#e86935" 
              withGradient={false} 
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 32,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  iconTop: {
    fontSize: 40,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#1f2937',
    lineHeight: 38,
  },
  highlight: {
    color: '#e86935',
  },
  content: {
    flexGrow: 1,
    marginTop: 20,
    paddingBottom: 140,
    gap: 32,
  },
  bodyText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#4b5563',
    lineHeight: 28,
  },
  bottomContainer: {
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#e86935',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  continueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#ffffff',
    textTransform: 'lowercase',
  },
});
