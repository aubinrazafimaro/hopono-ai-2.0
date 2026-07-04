import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { Ionicons } from '@expo/vector-icons';

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
      <OnboardingBackButton light={false} />
      <SafeAreaView style={styles.containerTransparent}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${87.5}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
                  style={[styles.compactOptionRow, isSelected && styles.compactOptionRowActive]}
                  onPress={() => toggleOption(opt.label)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.checkboxIndicator, isSelected && styles.checkboxIndicatorActive]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                    </View>
                    <Text style={[styles.compactOptionText, isSelected && styles.compactOptionTextActive]}>
                      {opt.emoji}  {opt.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
      
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)', '#ffe8db']}
        locations={[0, 0.4, 1]}
        style={styles.bottomFixedContainer}
      >
        <AlohaButton onPress={handleContinue} text="continue" variant="primary"  disabled={selected.length === 0} />
      </LinearGradient>
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
  bottomFixedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
  },
});
