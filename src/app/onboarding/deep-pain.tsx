import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

const OPTIONS = [
  { label: "a heartbreak I haven't let go of", emoji: "💔" },
  { label: "anxiety that never fully leaves", emoji: "🌊" },
  { label: "guilt I carry alone", emoji: "⚓" },
  { label: "a loneliness I can't explain", emoji: "🌑" },
  { label: "the feeling of never being enough", emoji: "🕊️" },
  { label: "anger toward someone I loved", emoji: "🌋" },
  { label: "grief I haven't processed", emoji: "🌿" },
];

export default function DeepPainScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (opt: string) => {
    let newSelected = [...selected];
    if (newSelected.includes(opt)) {
      newSelected = newSelected.filter(item => item !== opt);
    } else {
      newSelected.push(opt);
    }
    setSelected(newSelected);
  };

  const handleContinue = () => {
    updateData({ deepPain: selected });
    router.push('/onboarding/reassurance');
  };

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.question}>
            beneath the scrolling, something hurts. what is it?
          </Text>
          <Text style={styles.subtitle}>choose all that feel true</Text>
          
          <View style={styles.optionsList}>
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
    paddingBottom: 180,
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
