import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '@/context/OnboardingContext';
import AlohaButton from '@/components/AlohaButton';
import OnboardingBackButton from '@/components/OnboardingBackButton';

const AGE_GROUPS = ['15-20', '21-25', '26-30', '31-40', '41-50', '50+'];
const GENDERS = ['female', 'male'];

export default function PresentationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPos = insets.bottom > 0 ? insets.bottom + 6 : 14;
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
      {step !== 1 && (
        <OnboardingBackButton light={false} onPress={step === 2 ? () => setStep(0) : step === 3 ? () => setStep(2) : undefined} />
      )}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.containerTransparent}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${1 / 8 * 100}%` }]} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                  {AGE_GROUPS.map((age) => {
                    const isSelected = data.age === age;
                    return (
                      <TouchableOpacity
                        key={age}
                        style={[styles.compactOptionRow, isSelected && styles.compactOptionRowActive]}
                        onPress={() => handleAgeSelect(age)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionContent}>
                          <View style={[styles.checkboxIndicator, isSelected && styles.checkboxIndicatorActive]}>
                            {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                          </View>
                          <Text style={[styles.compactOptionText, isSelected && styles.compactOptionTextActive]}>{age}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.subtitle}>this helps us personalize your practice</Text>
                <Text style={styles.question}>how do you identify?</Text>
                <View style={styles.optionsList}>
                  {GENDERS.map((gender) => {
                    const isSelected = data.gender === gender;
                    return (
                      <TouchableOpacity
                        key={gender}
                        style={[styles.compactOptionRow, isSelected && styles.compactOptionRowActive]}
                        onPress={() => handleGenderSelect(gender)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionContent}>
                          <View style={[styles.checkboxIndicator, isSelected && styles.checkboxIndicatorActive]}>
                            {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                          </View>
                          <Text style={[styles.compactOptionText, isSelected && styles.compactOptionTextActive]}>{gender}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
        {step === 0 && (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)', '#ffe8db']}
            locations={[0, 0.4, 1]}
            style={styles.bottomFixedContainer}
          >
            <AlohaButton onPress={() => setStep(1)} text="continue" variant="primary"  disabled={data.name.trim().length === 0} />
          </LinearGradient>
        )}
        {step === 2 && (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)', '#ffe8db']}
            locations={[0, 0.4, 1]}
            style={styles.bottomFixedContainer}
          >
            <AlohaButton onPress={() => setStep(3)} text="continue" variant="primary"  disabled={!data.age} />
          </LinearGradient>
        )}
        {step === 3 && (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)', '#ffe8db']}
            locations={[0, 0.4, 1]}
            style={styles.bottomFixedContainer}
          >
            <AlohaButton onPress={() => router.push('/onboarding/screentime')} text="continue" variant="primary"  disabled={!data.gender} />
          </LinearGradient>
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
  compactOptionRow: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    width: '100%',
  },
  compactOptionRowActive: {
    borderBottomColor: '#e86935',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxIndicator: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkboxIndicatorActive: {
    borderColor: '#e86935',
    backgroundColor: '#e86935',
  },
  compactOptionText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#4b5563',
    flex: 1,
  },
  compactOptionTextActive: {
    fontFamily: 'Nunito_700Bold',
    color: '#e86935',
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
  bottomFixedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
  },
  bottomContainerLink: {
    position: 'absolute',
    bottom: 24,
    right: 24,
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
