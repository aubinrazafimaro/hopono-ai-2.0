import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

const OPTIONS = [
  { label: "I numb the pain instead of facing it", emoji: "📱" },
  { label: "my mind won't stop overthinking", emoji: "🌊" },
  { label: "I'm scared of what I might feel", emoji: "🛡️" },
  { label: "I don't believe I can truly change", emoji: "🌑" },
  { label: "I never have time for myself", emoji: "⏱️" },
];

export default function ObstaclesScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (opt: string) => {
    let newSelected = [...selected];
    if (newSelected.includes(opt)) {
      newSelected = newSelected.filter(item => item !== opt);
    } else {
      if (newSelected.length < 3) {
        newSelected.push(opt);
      }
    }
    setSelected(newSelected);
  };

  const handleContinue = () => {
    updateData({ obstacles: selected });
    router.push('/onboarding/deep-pain');
  };

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${6 / 8 * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.question}>
            what keeps pulling you away from healing?
          </Text>
          <Text style={styles.subtitle}>choose up to 3</Text>
          
          <View style={styles.scrollFrame}>
            <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
              {OPTIONS.map((opt) => {
                const isSelected = selected.includes(opt.label);
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.optionRow, isSelected && styles.optionRowActive]}
                    onPress={() => toggleOption(opt.label)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                      {opt.emoji}  {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <AlohaButton onPress={handleContinue} text="continue" variant="primary"  disabled={selected.length === 0} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  containerTransparent: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingBottom: 140,
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
    marginBottom: 24,
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
