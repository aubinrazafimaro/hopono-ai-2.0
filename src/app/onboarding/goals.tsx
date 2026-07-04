import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

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
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${3 / 8 * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
        
        {step === 0 ? (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>what's weighing on your heart?</Text>
            <Text style={styles.subtitle}>choose what feels true</Text>
            <View style={styles.scrollFrame}>
              <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
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
              </ScrollView>
            </View>
          </View>
        ) : (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>when you're free, what becomes possible?</Text>
            <Text style={styles.subtitle}>choose your vision</Text>
            
            <View style={styles.scrollFrame}>
              <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
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
              </ScrollView>
            </View>
          </View>
        )}
        </ScrollView>
      </SafeAreaView>
      {step === 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <AlohaButton onPress={() => setStep(1)} text="continue" variant="primary"  disabled={selectedResolutions.length === 0} />
        </View>
      )}

      {step === 1 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <AlohaButton onPress={handleFinishGoals} text="continue" variant="primary"  disabled={selectedLifeGoals.length === 0} />
        </View>
      )}
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
    fontFamily: 'Nunito_800ExtraBold',
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
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 76,
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
    maxHeight: 352,
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
});
