import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

const COMMITMENT_OPTIONS = [
  { id: '1', emoji: '🌺', label: 'fully. i need this.' },
  { id: '2', emoji: '🌊', label: "very. i'm tired of carrying this." },
  { id: '3', emoji: '🌿', label: 'somewhat. i want to try.' },
  { id: '4', emoji: '🌱', label: "a little. i'm not sure yet." },
  { id: '5', emoji: '🐢', label: 'just exploring for now.' },
];

export default function CommitmentScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [selectedId, setSelectedId] = useState<string | null>(data.commitmentLevel || null);

  const handleNext = () => {
    updateData({ commitmentLevel: selectedId || '' });
    router.push('/onboarding/signature');
  };

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.question}>how ready are you to let go?</Text>
          <Text style={styles.subtitle}>one last thing</Text>

          <View style={styles.scrollFrame}>
            <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
              {COMMITMENT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionRow,
                    selectedId === option.id && styles.optionRowActive
                  ]}
                  onPress={() => setSelectedId(option.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, selectedId === option.id && styles.optionTextActive]}>
                    {option.emoji}  {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <AlohaButton onPress={handleNext} text="this is my answer" variant="primary" disabled={!selectedId} />
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
});
