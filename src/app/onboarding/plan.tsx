import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlanScreen() {
  const router = useRouter();
  const { data } = useOnboarding();

  // Calculate the date 21 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 21);
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(targetDate).toLowerCase();

  const name = data.name && data.name.trim() !== '' ? data.name.trim().toLowerCase() : 'friend';
  const goal = data.resolutionGoal && data.resolutionGoal.length > 0 
    ? data.resolutionGoal[0].toLowerCase() 
    : (data.lifeGoals && data.lifeGoals.length > 0 ? data.lifeGoals[0].toLowerCase() : 'heal from your past');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Commitment Card */}
        <View style={styles.commitmentCard}>
          <Text style={styles.commitmentTitle}>
            {name}, imagine waking up on
          </Text>
          
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          <View style={styles.goalPill}>
            <Text style={styles.goalEmoji}>✨</Text>
            <Text style={styles.goalText}>free from what weighs you down</Text>
          </View>

          <View style={styles.goalPill}>
            <Text style={styles.goalEmoji}>🧘‍♀️</Text>
            <Text style={styles.goalText}>lighter. clearer. finally yourself.</Text>
          </View>
        </View>

        {/* How we'll get there */}
        <Text style={styles.sectionTitle}>your path to get there:</Text>

        <View style={styles.featureCard}>
          <View style={styles.featureIconContainer}>
            <Text style={styles.featureEmoji}>🌺</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>a daily practice made for you.</Text>
            <Text style={styles.featureDesc}>
              each session is tailored to what you're carrying. four phrases. your pain. your release.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIconContainer}>
            <Text style={styles.featureEmoji}>🛡️</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>a ritual, not a chore.</Text>
            <Text style={styles.featureDesc}>
              hopono meets you where you are — even when life is loud. a few minutes a day is all it takes to begin shifting what you feel.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Button */}
      <LinearGradient 
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
        locations={[0, 0.4, 1]}
        style={styles.bottomContainer}
      >
        <TouchableOpacity 
          style={styles.transformButton}
          onPress={() => router.push('/onboarding/comparison')}
        >
          <Text style={styles.transformButtonText}>this is my moment 🌺</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120, // space for fixed button
  },
  commitmentCard: {
    borderWidth: 2,
    borderColor: '#e86935',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  commitmentTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 30,
  },
  datePill: {
    borderWidth: 1.5,
    borderColor: '#e86935',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dateText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#1f2937',
  },
  goalPill: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  goalEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  goalText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#1f2937',
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: '#1f2937',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  featureIconContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 6,
  },
  featureDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#9ca3af', // Light gray
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 32, // More padding to account for the gradient fade
    paddingBottom: 40,
  },
  transformButton: {
    backgroundColor: '#e86935',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  transformButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#ffffff',
  }
});
