import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Top spacer to handle status bar safe area */}
          <View style={styles.topSpacer} />

          {/* Header Icon: App logo changed from dove to a raw, large hibiscus (no border/container) */}
          <View style={styles.headerIconContainer}>
            <Text style={styles.largeLogo}>🌺</Text>
          </View>

          {/* Titles */}
          <Text style={styles.mainTitle}>healing is a practice, not a promise.</Text>
          <Text style={styles.subtitle}>here's what your first 7 days look like.</Text>
          
          <Text style={styles.paragraph}>
            you don't need to be ready. you just need to begin.
          </Text>
          
          <Text style={styles.weekIntro}>seven days. one shift at a time.</Text>

          {/* Timeline Items (Staggered layout matching mockup) */}
          <View style={styles.timelineContainer}>
            
            {/* Day 1: Left */}
            <View style={[styles.card, styles.alignLeft]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🔑</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>day 1 — your first breath of release</Text>
                <Text style={styles.cardDesc}>
                  four phrases. your voice. something shifts.
                </Text>
              </View>
            </View>

            {/* Chat Bubble: Left/Centered */}
            <View style={styles.chatBubbleContainer}>
              <View style={styles.chatBubble}>
                <Text style={styles.chatText}>ho'oponopono has been healing hearts for over 2,000 years. 🌺</Text>
              </View>
            </View>

            {/* Day 2: Right */}
            <View style={[styles.card, styles.alignRight]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🛡️</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>day 2 — the resistance shows up</Text>
                <Text style={styles.cardDesc}>
                  your mind will want to skip. show up anyway. that's where the healing lives.
                </Text>
              </View>
            </View>

            {/* Day 4: Left */}
            <View style={[styles.card, styles.alignLeft]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🕊️</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>day 4 — something feels different</Text>
                <Text style={styles.cardDesc}>
                  you can't quite name it yet. but something is lighter.
                </Text>
              </View>
            </View>

            {/* Day 5: Right */}
            <View style={[styles.card, styles.alignRight]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>📖</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>day 5 — you look back</Text>
                <Text style={styles.cardDesc}>
                  four days ago, you were just beginning. look at you now.
                </Text>
              </View>
            </View>

            {/* Day 6: Left */}
            <View style={[styles.card, styles.alignLeft]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🚀</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>day 6 — it's becoming yours</Text>
                <Text style={styles.cardDesc}>
                  not a habit yet. but something you choose. every single day.
                </Text>
              </View>
            </View>

            {/* Day 7: Right */}
            <View style={[styles.card, styles.alignRight]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>😌</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>day 7 — a full week</Text>
                <Text style={styles.cardDesc}>
                  you showed up seven times. that's seven votes for yourself.
                </Text>
              </View>
            </View>

            {/* Week One Complete: Left */}
            <View style={[styles.card, styles.cardSolid, styles.alignLeft]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>🔥</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, styles.textWhite]}>week one complete — you're different now.</Text>
                <Text style={[styles.cardDesc, styles.textWhite]}>
                  not completely healed. but no longer the same. keep going. 🌺
                </Text>
              </View>
            </View>

          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Fixed Bottom CTA: Positioned absolutely at the very bottom to bypass Safe Area constraints */}
        <View style={styles.bottomFixed}>
          <View style={styles.paymentDueContainer}>
            <Ionicons name="checkmark-sharp" size={18} color="#1f2937" style={{ marginRight: 6 }} />
            <Text style={styles.paymentDueText}>No Payment Due Now</Text>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
            <Text style={styles.ctaButtonText}>begin free — no card needed</Text>
          </TouchableOpacity>
          
          <Text style={styles.priceSubtext}>
            then just {pricing.weeklyEquivalent}/week after your free trial
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
  topSpacer: {
    height: 50, // Matches standard iOS status bar height
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 180, // Space for the fixed bottom CTA
  },
  headerIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  largeLogo: {
    fontSize: 72,
  },
  mainTitle: {
    fontFamily: 'Nunito_700Bold', // Uniform Nunito font family
    fontSize: 22,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'lowercase',
  },
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
    textTransform: 'lowercase',
  },
  paragraph: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    textTransform: 'lowercase',
  },
  weekIntro: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'lowercase',
  },
  timelineContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e86935',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSolid: {
    backgroundColor: '#e86935',
    borderWidth: 0,
  },
  alignLeft: {
    alignSelf: 'flex-start',
    width: '88%',
  },
  alignRight: {
    alignSelf: 'flex-end',
    width: '88%',
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 6,
    textTransform: 'lowercase',
  },
  cardDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textTransform: 'lowercase',
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
    textTransform: 'lowercase',
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 8,
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#ffffff',
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
