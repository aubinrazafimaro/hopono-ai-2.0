import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { SimpleLineIcons } from '@expo/vector-icons';
import ContinueButton from '@/components/ContinueButton';

export default function RecapScreen() {
  const router = useRouter();
  const { data } = useOnboarding();

  const handleFinish = () => {
    // This is now an intermediate break screen
    router.push('/onboarding/guilt');
  };

  const getInterpretationText = (goal: string) => {
    switch (goal) {
      case "free the mind from blockages, pain, and trauma":
        return "we will use a special ho'oponopono program designed to release mental blocks and cleanse deeply rooted trauma, making space for new, healthy thoughts.";
      case "overcome persistent emotional pain":
        return "our guided ho'oponopono sessions will focus on emotional release, soothing your heart and gradually dissolving the pain holding you back.";
      case "resolve a conflict or restore broken harmony":
        return "through ho'oponopono's ancestral principles of reconciliation, we will work on restoring inner harmony and finding peace with the outside world.";
      case "process the need for forgiveness":
        return "we will walk you through the powerful ho'oponopono forgiveness protocol, helping you let go of resentment and truly liberate yourself.";
      default:
        return "we will use a special ho'oponopono program to cleanse your mind and restore your inner balance.";
    }
  };

  const getResolutionEmoji = (goal: string) => {
    switch (goal) {
      case "free the mind from blockages, pain, and trauma": return "🧠";
      case "overcome persistent emotional pain": return "❤️‍🩹";
      case "resolve a conflict or restore broken harmony": return "🤝";
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
          <Text style={styles.cardTitle}>where you're headed</Text>
          <Text style={styles.destinationText}>🎯 {displayGoal}</Text>
          <Text style={styles.statText}>
            over 82% of users who committed to this journey achieved their exact destination with hopono ai.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.bottomTitle}>you're in the right place</Text>
          <Text style={styles.bottomText}>
            tens of thousands have started with the same goals, and hopono ai helped them get there.
          </Text>
        </View>
        </ScrollView>

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <ContinueButton 
            onPress={handleFinish} 
            color="#ffffff" 
            textColor="#e86935" 
          />
        </View>
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
    fontFamily: 'Nunito_700Bold',
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
    fontFamily: 'Nunito_700Bold',
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
    fontFamily: 'Nunito_700Bold',
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
});
