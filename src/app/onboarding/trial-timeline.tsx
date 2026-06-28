import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePricing } from '@/hooks/usePricing';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';

export default function TrialTimelineScreen() {
  const router = useRouter();
  const pricing = usePricing();

  const handleNext = () => {
    router.push('/onboarding/trial-reminder');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Icon */}
        <View style={styles.headerIconContainer}>
          <View style={styles.appIconMock}>
            <Text style={{ fontSize: 40 }}>🕊️</Text>
          </View>
        </View>

        {/* Titles */}
        <Text style={styles.mainTitle}>it's not about more willpower</Text>
        <Text style={styles.subtitle}>it's about building a real mindfulness habit</Text>
        
        <Text style={styles.paragraph}>
          the foundation for everything you want to achieve is built in a state of inner peace. this is your guide back to that place.
        </Text>
        
        <Text style={styles.weekIntro}>here's what your first 7 days look like:</Text>

        {/* Timeline Items */}
        <View style={styles.timelineContainer}>
          
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={{ fontSize: 24 }}>🔑</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>day 1 - enter a peaceful state</Text>
              <Text style={styles.cardDesc}>
                complete your first ho'oponopono practice. feel the peace of putting your mind first, before the noise of the world.
              </Text>
            </View>
          </View>

          {/* Chat Bubble */}
          <View style={styles.chatBubbleContainer}>
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>the best treatment for the human mind is finding inner peace ❤️</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={{ fontSize: 24 }}>🛡️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>day 2 - overcome the resistance</Text>
              <Text style={styles.cardDesc}>
                building the habit will feel like an obstacle. we will push through together.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={{ fontSize: 24 }}>🕊️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>day 4 - feel the difference</Text>
              <Text style={styles.cardDesc}>
                start to feel the change: a calmer spirit, a clearer mind, and a real sense of peace.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={{ fontSize: 24 }}>📖</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>day 5 - see your story unfold</Text>
              <Text style={styles.cardDesc}>
                your journey isn't just a log, it's a testimony of your daily growth. look back and see how far you've come.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={{ fontSize: 24 }}>🚀</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>day 6 - watch your mindfulness grow</Text>
              <Text style={styles.cardDesc}>
                see your progress come to life. your stats are a powerful reminder of your consistency.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={{ fontSize: 24 }}>😌</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>day 7 - walk in peace</Text>
              <Text style={styles.cardDesc}>
                a full week of showing up. this is mindfulness in action. this is how you build a better life, one day at a time.
              </Text>
            </View>
          </View>

          <View style={[styles.card, styles.cardSolid]}>
            <View style={styles.cardIconContainer}>
              <Text style={{ fontSize: 24 }}>🔥</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, styles.textWhite]}>end of week one - the foundation is built</Text>
              <Text style={[styles.cardDesc, styles.textWhite]}>
                you've built the foundation. now the real transformation begins: experiencing peace as a daily reality.
              </Text>
            </View>
          </View>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomFixed}>
        <View style={styles.paymentDueContainer}>
          <Ionicons name="checkmark-sharp" size={18} color="#1f2937" style={{ marginRight: 6 }} />
          <Text style={styles.paymentDueText}>No Payment Due Now</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
          <Text style={styles.ctaButtonText}>try for $0.00</Text>
        </TouchableOpacity>
        
        <Text style={styles.priceSubtext}>
          just {pricing.yearlyPrice} per year ({pricing.weeklyEquivalent}/week)
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 180, // Space for the fixed bottom CTA
  },
  headerIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIconMock: {
    width: 80,
    height: 80,
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffedd5',
  },
  iconEmoji: {
    fontSize: 40,
  },
  mainTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  paragraph: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  weekIntro: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  timelineContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e86935',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSolid: {
    backgroundColor: '#e86935',
  },
  cardIconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  textWhite: {
    color: '#ffffff',
  },
  chatBubbleContainer: {
    alignItems: 'flex-start',
    paddingLeft: 32,
    marginVertical: 4,
  },
  chatBubble: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    maxWidth: '95%',
  },
  chatText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
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
