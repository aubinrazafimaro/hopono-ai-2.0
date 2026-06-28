import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePricing } from '@/hooks/usePricing';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';
import AlohaButton from '@/components/AlohaButton';

export default function PaywallScreen() {
  const router = useRouter();
  const pricing = usePricing();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  // Calculate dates
  const today = new Date();
  const in4Days = new Date(today);
  in4Days.setDate(today.getDate() + 4);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleStartTrial = () => {
    // In a real app, call RevenueCat here
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.awardContainer}>
          <Ionicons name="leaf" size={16} color="#f59e0b" style={styles.laurelLeft} />
          <View style={styles.awardTextContainer}>
            <Text style={styles.awardText}>the #1 emotional</Text>
            <Text style={styles.awardText}>healing app</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={10} color="#f59e0b" />
              ))}
            </View>
          </View>
          <Ionicons name="leaf" size={16} color="#f59e0b" style={styles.laurelRight} />
        </View>

        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="refresh" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.title}>
          you deserve to feel free. try it for 7 days.
        </Text>

        {/* Timeline */}
        <View style={styles.timeline}>
          {/* Vertical Line */}
          <View style={styles.timelineLine} />

          {/* Today */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIcon, styles.iconOrange]}>
              <Ionicons name="lock-open" size={20} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>today</Text>
              <Text style={styles.timelineDesc}>
                your healing begins. access your personalized practice, your AI companion, and everything hopono has for you.
              </Text>
            </View>
          </View>

          {/* In 4 Days */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIcon, styles.iconOrange]}>
              <Ionicons name="notifications" size={20} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>day 4</Text>
              <Text style={styles.timelineDesc}>
                we'll gently remind you — so nothing catches you off guard.
              </Text>
            </View>
          </View>

          {/* In 7 Days */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIcon, styles.iconOrange]}>
              <Ionicons name="star" size={20} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>day 7</Text>
              <Text style={styles.timelineDesc}>
                if hopono changed something in you, stay. if not, cancel — no questions, no friction. charged on {formatDate(in7Days)} only if you choose to continue.
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Checkout */}
      <View style={styles.bottomFixed}>
        
        {/* Toggles */}
        <View style={styles.togglesContainer}>
          
          <TouchableOpacity 
            style={[styles.toggleBtn, selectedPlan === 'monthly' && styles.toggleBtnActive]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <Text style={styles.toggleSubtitle}>monthly</Text>
            <Text style={styles.toggleTitle}>{pricing.monthlyPrice}/month</Text>
            <View style={[styles.radio, selectedPlan === 'monthly' && styles.radioActive]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toggleBtn, styles.toggleBtnYearly, selectedPlan === 'yearly' && styles.toggleBtnActive]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.badgeFreeTrial}>
              <Text style={styles.badgeFreeTrialText}>7-day free trial</Text>
            </View>
            <Text style={styles.toggleSubtitle}>yearly</Text>
            <Text style={styles.toggleTitle}>{pricing.weeklyEquivalent}/week</Text>
            <View style={[styles.radio, selectedPlan === 'yearly' && styles.radioActive]}>
              {selectedPlan === 'yearly' && <Ionicons name="checkmark" size={16} color="#ffffff" />}
            </View>
          </TouchableOpacity>
        </View>

        {selectedPlan === 'yearly' && (
          <View style={styles.paymentDueContainer}>
            <Ionicons name="checkmark-sharp" size={18} color="#16a34a" style={{ marginRight: 6 }} />
            <Text style={styles.paymentDueText}>nothing to pay today</Text>
          </View>
        )}

        <TouchableOpacity style={styles.ctaButton} onPress={handleStartTrial}>
          <Text style={styles.ctaButtonText}>
            {selectedPlan === 'yearly' ? 'begin my healing — free' : 'continue'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.priceSubtext}>
          {selectedPlan === 'yearly' 
            ? `7 days free. then ${pricing.weeklyEquivalent}/week — less than a coffee.`
            : `${pricing.monthlyPrice}/month — cancel anytime, no questions.`}
        </Text>

        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>privacy</Text>
          <Text style={styles.footerLink}>terms</Text>
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerIcon: {
    padding: 8,
  },
  awardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  awardTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  awardText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'center',
  },
  laurelLeft: {
    transform: [{ rotateY: '180deg' }, { rotateZ: '20deg' }],
  },
  laurelRight: {
    transform: [{ rotateZ: '20deg' }],
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 280, // space for bottom fixed area
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 26,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 34,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 16,
  },
  timelineLine: {
    position: 'absolute',
    left: 36, // center of the icon
    top: 20,
    bottom: 40,
    width: 6,
    backgroundColor: '#fed7aa',
    borderRadius: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  timelineIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    zIndex: 2,
  },
  iconOrange: {
    backgroundColor: '#e86935',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 6,
  },
  timelineDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  togglesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  toggleBtnYearly: {
    borderColor: '#fdba74',
  },
  toggleBtnActive: {
    borderColor: '#e86935',
    backgroundColor: '#fff7ed',
  },
  badgeFreeTrial: {
    position: 'absolute',
    top: -12,
    right: 12,
    backgroundColor: '#e86935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeFreeTrialText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#ffffff',
  },
  toggleSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
  toggleTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#1f2937',
  },
  radio: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    backgroundColor: '#e86935',
    borderColor: '#e86935',
  },
  paymentDueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentDueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
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
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#cbd5e1',
  },
});
