import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePricing } from '@/hooks/usePricing';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';
import AlohaButton from '@/components/AlohaButton';

export default function TrialReminderScreen() {
  const router = useRouter();
  const pricing = usePricing();

  const handleNext = () => {
    router.push('/onboarding/paywall');
  };

  return (
    <View style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>
            we'll remind you before anything changes.
          </Text>

          <View style={styles.bellContainer}>
            <Ionicons name="notifications" size={160} color="#e2e8f0" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
        </View>

        {/* Fixed Bottom CTA: Positioned absolutely at the bottom to bypass Safe Area constraints */}
        <View style={styles.bottomFixed}>
          <View style={styles.paymentDueContainer}>
            <Ionicons name="checkmark-sharp" size={18} color="#1f2937" style={{ marginRight: 6 }} />
            <Text style={styles.paymentDueText}>nothing to pay today</Text>
          </View>

          <AlohaButton
            onPress={handleNext}
            text="begin my 7 days free 🌺"
            variant="primary"
            style={{ paddingBottom: 0 }}
          />
          
          <Text style={styles.priceSubtext}>
            then {pricing.weeklyEquivalent}/week — cancel anytime, no questions.
          </Text>
        </View>
      </AnimatedFadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center', // Vertically center the title and bell
    paddingBottom: 150, // Avoid overlapping the fixed bottom CTA
  },
  title: {
    fontFamily: 'Nunito_700Bold', // Uniform Nunito font family
    fontSize: 28,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 36,
    textTransform: 'lowercase',
  },
  bellContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#dc2626',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#ffffff',
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingTop: 8, // Compact padding
    paddingBottom: 20, // Sit lower on screen
  },
  paymentDueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentDueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
    textTransform: 'lowercase',
  },
  priceSubtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    textTransform: 'lowercase',
  },
});
