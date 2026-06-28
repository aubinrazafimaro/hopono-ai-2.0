import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ContinueButton from '@/components/ContinueButton';

const COMMITMENT_OPTIONS = [
  { id: '1', emoji: '🌺', label: 'fully. I need this.' },
  { id: '2', emoji: '🌊', label: 'very. I\'m tired of carrying this.' },
  { id: '3', emoji: '🌿', label: 'somewhat. I want to try.' },
  { id: '4', emoji: '🌱', label: 'a little. I\'m not sure yet.' },
  { id: '5', emoji: '🐢', label: 'just exploring for now.' },
];

export default function CommitmentScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleNext = () => {
    router.push('/onboarding/signature');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.header}>
          <Text style={styles.smallTitle}>one last thing.</Text>
          <Text style={styles.mainTitle}>
            how ready are you to let go?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
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
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <ContinueButton 
          onPress={handleNext} 
          text="this is my answer" 
          disabled={!selectedId}
        />
      </View>
    </SafeAreaView>
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
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
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
