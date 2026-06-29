import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.iconTop}>🌺</Text>
            <Text style={styles.title}>
              it takes <Text style={styles.highlight}>courage</Text> to look inside, {data.name || 'friend'}.
            </Text>
          </View>

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
      </SafeAreaView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <AlohaButton onPress={() => router.push('/onboarding/final-recap')} text="continue" variant="primary"  disabled={!showBtn} />
      </View>
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
});
