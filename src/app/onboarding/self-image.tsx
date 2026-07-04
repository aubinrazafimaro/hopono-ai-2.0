import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

const OPTIONS = [
  { label: "empty. like I wasted something precious", emoji: "🌑" },
  { label: "ashamed. I know I was avoiding something", emoji: "🌧️" },
  { label: "disconnected from who I want to be", emoji: "🌊" },
  { label: "a little guilty, but I move on", emoji: "🌤️" },
];

export default function SelfImageScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [selectedImpacts, setSelectedImpacts] = React.useState<string[]>(data.selfImageImpact || []);

  const toggleSelection = (option: string) => {
    let newImpacts = [...selectedImpacts];
    if (newImpacts.includes(option)) {
      newImpacts = newImpacts.filter(o => o !== option);
    } else {
      if (newImpacts.length < 3) {
        newImpacts.push(option);
      }
    }
    setSelectedImpacts(newImpacts);
    updateData({ selfImageImpact: newImpacts });
  };

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${5 / 8 * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.question}>
            when you put your phone down, how do you feel about yourself?
          </Text>
          <Text style={styles.subtitle}>choose what's true</Text>
          
          <View style={styles.scrollFrame}>
            <ScrollView contentContainerStyle={styles.optionsScrollList} showsVerticalScrollIndicator={false}>
              {OPTIONS.map((opt) => {
                const isSelected = selectedImpacts.includes(opt.label);
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.optionRow, isSelected && styles.optionRowActive]}
                    onPress={() => toggleSelection(opt.label)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{opt.emoji}  {opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <AlohaButton onPress={() => router.push('/onboarding/obstacles')} text="continue" variant="primary"  disabled={selectedImpacts.length === 0} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginTop: -24,
    marginBottom: 24,
  },
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
    marginBottom: 32,
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
});
