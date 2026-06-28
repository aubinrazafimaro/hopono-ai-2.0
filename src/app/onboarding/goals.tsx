import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import ContinueButton from '@/components/ContinueButton';

const RESOLUTION_OPTIONS = [
  { label: "free the mind from blockages, pain, and trauma", emoji: "🧠" },
  { label: "overcome persistent emotional pain", emoji: "❤️‍🩹" },
  { label: "resolve a conflict or restore broken harmony", emoji: "🤝" },
  { label: "process the need for forgiveness", emoji: "🕊️" }
];

const BIG_GOALS = [
  { label: "find my other half, my soulmate", emoji: "💍" },
  { label: "travel the world", emoji: "✈️" },
  { label: "build my empire", emoji: "👑" },
  { label: "build my dream body", emoji: "💪" },
  { label: "launch my youtube channel", emoji: "🎥" }
];

export default function GoalsScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [step, setStep] = useState(0);
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>(data.resolutionGoal || []);
  const [selectedLifeGoals, setSelectedLifeGoals] = useState<string[]>([]);

  const toggleResolutionGoal = (res: string) => {
    let newRes = [...selectedResolutions];
    if (newRes.includes(res)) {
      newRes = newRes.filter(r => r !== res);
    } else {
      if (newRes.length < 3) {
        newRes.push(res);
      }
    }
    setSelectedResolutions(newRes);
    updateData({ resolutionGoal: newRes });
  };

  const toggleLifeGoal = (goal: string) => {
    let newGoals = [...selectedLifeGoals];
    if (newGoals.includes(goal)) {
      newGoals = newGoals.filter(g => g !== goal);
    } else {
      if (newGoals.length < 3) {
        newGoals.push(goal);
      }
    }
    setSelectedLifeGoals(newGoals);
  };

  const handleFinishGoals = () => {
    updateData({ lifeGoals: selectedLifeGoals });
    router.push('/onboarding/recap');
  };

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
        <ScrollView contentContainerStyle={styles.content}>
        
        {step === 0 ? (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>what's weighing on your heart?</Text>
            <Text style={styles.subtitle}>choose what feels true</Text>
            <View style={styles.optionsList}>
              {RESOLUTION_OPTIONS.map((res) => {
                const isSelected = selectedResolutions.includes(res.label);
                return (
                  <TouchableOpacity
                    key={res.label}
                    style={[styles.optionRow, isSelected && styles.optionRowActive]}
                    onPress={() => toggleResolutionGoal(res.label)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{res.emoji}  {res.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>when you're free, what becomes possible?</Text>
            <Text style={styles.subtitle}>choose your vision</Text>
            
            <View style={styles.optionsList}>
              {BIG_GOALS.map((goal) => {
                const isSelected = selectedLifeGoals.includes(goal.label);
                return (
                  <TouchableOpacity
                    key={goal.label}
                    style={[styles.optionRow, isSelected && styles.optionRowActive]}
                    onPress={() => toggleLifeGoal(goal.label)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{goal.emoji}  {goal.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        </ScrollView>
        {step === 0 && selectedResolutions.length > 0 && (
          <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <ContinueButton onPress={() => setStep(1)} />
          </Animated.View>
        )}

        {step === 1 && selectedLifeGoals.length > 0 && (
          <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <ContinueButton onPress={handleFinishGoals} />
          </Animated.View>
        )}
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
  content: {
    flexGrow: 1,
    paddingTop: 32,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingBottom: 140,
  },
  stepContainer: {
    gap: 16,
  },
  question: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 24,
    color: '#1f2937',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginTop: -8,
    marginBottom: 16,
  },
  optionsList: {
    gap: 12,
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
    lineHeight: 24,
  },
  optionTextActive: {
    color: '#e86935',
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
});
