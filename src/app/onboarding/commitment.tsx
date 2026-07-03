import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import AlohaButton from '@/components/AlohaButton';

const COMMITMENT_OPTIONS = [
  { id: '1', emoji: '🌺', label: 'fully. I need this.' },
  { id: '2', emoji: '🌊', label: 'very. I\'m tired of carrying this.' },
  { id: '3', emoji: '🌿', label: 'somewhat. I want to try.' },
  { id: '4', emoji: '🌱', label: 'a little. I\'m not sure yet.' },
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
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.smallTitle}>one last thing.</Text>
            <Text style={styles.mainTitle}>how ready are you to let go?</Text>
          </View>

          <View style={styles.scrollFrame}>
            <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
              {COMMITMENT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    selectedId === option.id && styles.optionButtonSelected
                  ]}
                  onPress={() => setSelectedId(option.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.optionText,
                    selectedId === option.id && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <AlohaButton onPress={handleNext} text="this is my answer" variant="primary" disabled={!selectedId} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 140, // Space for bottom button
  },
  header: {
    marginBottom: 40,
  },
  smallTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#1f2937',
    marginBottom: 8,
  },
  mainTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: '#1f2937',
    lineHeight: 36,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 64,
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
  optionButtonSelected: {
    borderColor: '#e86935',
    borderWidth: 2,
    backgroundColor: '#fff7ed',
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#334155',
  },
  optionTextSelected: {
    color: '#e86935',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
