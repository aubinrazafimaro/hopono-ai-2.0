import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
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
    <SafeAreaView style={styles.container}>
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

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomFixed}>
        <View style={styles.paymentDueContainer}>
          <Ionicons name="checkmark-sharp" size={18} color="#1f2937" style={{ marginRight: 6 }} />
          <Text style={styles.paymentDueText}>nothing to pay today</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
          <Text style={styles.ctaButtonText}>begin my 7 days free 🌺</Text>
        </TouchableOpacity>
        
        <Text style={styles.priceSubtext}>
          then {pricing.weeklyEquivalent}/week — cancel anytime, no questions.
        </Text>
      </View>
      </AnimatedFadeIn>
    </SafeAreaView>
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
    paddingTop: 80,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 80,
    lineHeight: 36,
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
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    color: '#ffffff',
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  paymentDueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentDueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
  },
  ctaButton: {
    backgroundColor: '#e86935',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  ctaButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: '#ffffff',
  },
  priceSubtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
