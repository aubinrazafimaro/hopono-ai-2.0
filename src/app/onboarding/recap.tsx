import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

export default function RecapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data } = useOnboarding();

  const handleFinish = () => {
    // This is now an intermediate break screen
    router.push('/onboarding/guilt');
  };

  const getInterpretationText = (goal: string) => {
    switch (goal) {
      case "free the mind from blockages, pain, and trauma":
        return "your practice will be designed to loosen what's stuck. four phrases, repeated with intention, until something releases.";
      case "overcome persistent emotional pain":
        return "your sessions will meet the pain where it lives — and gently, daily, help it loosen its hold on you.";
      case "resolve a conflict or restore broken harmony":
        return "ho'oponopono was born for this. reconciliation starts inside. your practice will begin there.";
      case "process the need for forgiveness":
        return "forgiving doesn't mean forgetting. it means freeing yourself. your practice will guide you through that release.";
      default:
        return "your practice will be shaped around what you carry. four phrases. your words. your release.";
    }
  };

  const getResolutionEmoji = (goal: string) => {
    switch (goal) {
      case "free the mind from blockages, pain, and trauma": return "🌊";
      case "overcome persistent emotional pain": return "❤️‍🩹";
      case "resolve a conflict or restore broken harmony": return "🌺";
      case "process the need for forgiveness": return "🕊️";
      default: return "🤔";
    }
  };

  const displayGoal = data.lifeGoals.length > 0 ? data.lifeGoals[0] : "live a fulfilling life";

  const displayResolutionGoal = data.resolutionGoal.length > 0 ? data.resolutionGoal[0] : "free the mind from blockages, pain, and trauma";

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerTransparent}>


        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.card, { transform: [{ rotate: '-2deg' }] }]}>
          <Text style={styles.cardGoalTitle}>
            {getResolutionEmoji(displayResolutionGoal)} {displayResolutionGoal}
          </Text>
          <Text style={styles.cardText}>
            {getInterpretationText(displayResolutionGoal)}
          </Text>
        </View>

        <View style={[styles.card, { transform: [{ rotate: '1deg' }] }]}>
          <Text style={styles.cardTitle}>what becomes possible</Text>
          <Text style={styles.destinationText}>🎯 {displayGoal}</Text>
          <Text style={styles.statText}>
            82% of people who showed up daily felt a real shift within 21 days.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.bottomTitle}>mahalo for trusting us. 🌺</Text>
          <Text style={styles.bottomText}>
            thousands arrived here carrying exactly what you carry. they kept going. so can you.
          </Text>
        </View>
        </ScrollView>
        <LinearGradient
          colors={['rgba(232, 105, 53, 0)', 'rgba(232, 105, 53, 0.95)', '#e86935']}
          locations={[0, 0.4, 1]}
          style={styles.bottomFixedContainer}
        >
          <AlohaButton
            onPress={handleFinish}
            text="continue"
            variant="secondary"
          />
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e86935',
  },
  containerTransparent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 32,
    justifyContent: 'center',
    paddingBottom: 140,
    gap: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardGoalTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  cardTitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  destinationText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  statText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#e86935',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSection: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  bottomTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  bottomText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  finishButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  finishButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
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
