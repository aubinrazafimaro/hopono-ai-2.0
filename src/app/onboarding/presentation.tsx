import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '@/context/OnboardingContext';
import AlohaButton from '@/components/AlohaButton';

const AGE_GROUPS = ['15-20', '21-25', '26-30', '30-40', '40-50', '50+'];
const GENDERS = ['male', 'female'];

export default function PresentationScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [step, setStep] = useState(0);

  // Animations for step 1 (Orange transition)
  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;
  const text3Opacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const [showTransitionBtn, setShowTransitionBtn] = useState(false);

  useEffect(() => {
    if (step === 1) {
      Animated.sequence([
        Animated.timing(text1Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(text2Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(text3Opacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.delay(800),
      ]).start(() => {
        setShowTransitionBtn(true);
        Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    }
  }, [step]);



  const handleTransitionComplete = () => {
    setStep(2);
  };

  const handleAgeSelect = (age: string) => {
    updateData({ age });
  };

  const handleGenderSelect = (gender: string) => {
    updateData({ gender });
  };

  if (step === 1) {
    // Orange Transition Screen
    return (
      <LinearGradient colors={['#ff8c5a', '#e86935']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.containerTransparent}>
          <ScrollView contentContainerStyle={styles.transitionContent}>
            <Animated.Text style={[styles.transitionText, { opacity: text1Opacity }]}>
              {data.name}, what you carry ends here.
            </Animated.Text>
            <Animated.Text style={[styles.transitionText, { opacity: text2Opacity }]}>
              this is your fresh start.
            </Animated.Text>
            <Animated.Text style={[styles.transitionText, { opacity: text3Opacity, fontFamily: 'Nunito_700Bold' }]}>
              aloha. 🌺
            </Animated.Text>
          </ScrollView>
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <AlohaButton onPress={handleTransitionComplete} text="I'm ready" variant="secondary"  disabled={!showTransitionBtn} />
            </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {step === 0 && (
            <View style={styles.stepContainer}>
              <Text style={styles.question}>what's your name?</Text>
              <TextInput
                style={styles.textInput}
                placeholder="your name"
                placeholderTextColor="#9ca3af"
                value={data.name}
                onChangeText={(text) => updateData({ name: text })}
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.question}>how old are you?</Text>
              <View style={styles.optionsList}>
                {AGE_GROUPS.map((age) => (
                  <TouchableOpacity
                    key={age}
                    style={[styles.optionRow, data.age === age && styles.optionRowActive]}
                    onPress={() => handleAgeSelect(age)}
                  >
                    <Text style={[styles.optionText, data.age === age && styles.optionTextActive]}>{age}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.subtitle}>this helps us personalize your practice</Text>
              <Text style={styles.question}>how do you identify?</Text>
              <View style={styles.optionsList}>
                {GENDERS.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[styles.optionRow, data.gender === gender && styles.optionRowActive]}
                    onPress={() => handleGenderSelect(gender)}
                  >
                    <Text style={[styles.optionText, data.gender === gender && styles.optionTextActive]}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          </ScrollView>
          {step === 0 && (
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <AlohaButton onPress={() => setStep(1)} text="continue" variant="primary"  disabled={data.name.trim().length === 0} />
            </View>
          )}
          {step === 2 && (
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <AlohaButton onPress={() => setStep(3)} text="continue" variant="primary"  disabled={!data.age} />
            </View>
          )}
          {step === 3 && (
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <AlohaButton onPress={() => router.push('/onboarding/screentime')} text="continue" variant="primary"  disabled={!data.gender} />
            </View>
          )}
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  scrollContent: {
    flexGrow: 1,
    paddingTop: 32,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingBottom: 140,
  },
  stepContainer: {
    width: '100%',
  },
  transitionContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 32,
  },
  transitionText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 20,
    color: '#ffffff',
    lineHeight: 28,
  },
  question: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  textInput: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e86935',
    color: '#1f2937',
    paddingVertical: 8,
  },
  optionsList: {
    gap: 16,
  },
  optionRow: {
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
  spacing: {
    height: 48,
  },
  bottomContainer: {
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  continueButton: {
    backgroundColor: '#e86935',
    paddingVertical: 14,
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
  continueButtonWhite: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  continueTextOrange: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#e86935',
    textTransform: 'lowercase',
  },
});
