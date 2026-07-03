import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '@/context/OnboardingContext';
import AlohaButton from '@/components/AlohaButton';

const AGE_GROUPS = ['15-20', '21-25', '26-30', '31-40', '41-50', '50+'];
const GENDERS = ['female', 'male'];

export default function PresentationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPos = insets.bottom > 0 ? insets.bottom + 18 : 28;
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
            <Animated.Text style={[styles.transitionText, { opacity: text3Opacity, fontFamily: 'Nunito_800ExtraBold', fontSize: 26 }]}>
              aloha. 🌺
            </Animated.Text>
          </ScrollView>
          {showTransitionBtn && (
            <View style={[styles.bottomContainerLink, { bottom: bottomPos }]}>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={handleTransitionComplete}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.linkButtonText}>i'm ready</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6, transform: [{ translateY: 2 }] }} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.containerTransparent}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${1 / 8 * 100}%` }]} />
          </View>

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
                <View style={styles.scrollFrame}>
                  <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
                    {AGE_GROUPS.map((age) => (
                      <TouchableOpacity
                        key={age}
                        style={[styles.optionRow, data.age === age && styles.optionRowActive]}
                        onPress={() => handleAgeSelect(age)}
                      >
                        <Text style={[styles.optionText, data.age === age && styles.optionTextActive]}>{age}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
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
        </SafeAreaView>
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
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
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
  spacing: {
    height: 48,
  },
  bottomContainer: {
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  bottomContainerLink: {
    position: 'absolute',
    bottom: 28,
    right: 32,
  },
  linkButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  linkButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
});
