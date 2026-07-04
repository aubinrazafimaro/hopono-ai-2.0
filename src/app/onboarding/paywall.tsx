import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePricing } from '@/hooks/usePricing';
import Svg, { Path } from 'react-native-svg';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';
import AlohaButton from '@/components/AlohaButton';



const { height } = Dimensions.get('window');

export default function PaywallScreen() {
  const router = useRouter();
  const pricing = usePricing();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  // Calculate dates
  const today = new Date();
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleStartTrial = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
      
        {/* Header (No refresh button, only back button and central award) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.awardContainer}>
            <View style={styles.awardTextContainer}>
              <Text style={styles.awardText}>the #1 emotional</Text>
              <Text style={styles.awardText}>healing app</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={10} color="#e86935" />
                ))}
              </View>
            </View>
          </View>

          {/* Spacer to balance the back button */}
          <View style={[styles.headerIcon, { opacity: 0 }]} pointerEvents="none">
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </View>
        </View>

        {/* Scrollable content fitted to one screen to let the page breathe without overflow */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>
            you deserve to feel free. try it for 7 days.
          </Text>

          {/* Compact Timeline for 1-screen fit */}
          <View style={styles.timeline}>
            {/* Vertical Line */}
            <View style={styles.timelineLine} />

            {/* Today */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, styles.iconOrange]}>
                <Ionicons name="lock-open" size={16} color="#ffffff" />
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
                <Ionicons name="notifications" size={16} color="#ffffff" />
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
                <Ionicons name="star" size={16} color="#ffffff" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>day 7</Text>
                <Text style={styles.timelineDesc}>
                  if hopono changed something in you, stay. if not, cancel — no questions. charged on {formatDate(in7Days)} only if you choose to continue.
                </Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Fixed Bottom Checkout: Lowered to very bottom screen edge */}
        <View style={styles.bottomFixed}>
          
          {/* Plan Toggles: Row layout with checkboxes on the right to prevent overlapping */}
          <View style={styles.togglesContainer}>
            
            {/* Monthly Card */}
            <TouchableOpacity 
              style={[styles.toggleBtn, selectedPlan === 'monthly' && styles.toggleBtnActive]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleSubtitle}>monthly</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
                    <Text style={styles.toggleTitle}>{pricing.monthlyPrice}</Text>
                    <Text style={styles.togglePeriod}>/month</Text>
                  </View>
                </View>
                <View style={[styles.radio, selectedPlan === 'monthly' && styles.radioActive]}>
                  {selectedPlan === 'monthly' && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                </View>
              </View>
            </TouchableOpacity>

            {/* Yearly Card */}
            <TouchableOpacity 
              style={[styles.toggleBtn, styles.toggleBtnYearly, selectedPlan === 'yearly' && styles.toggleBtnActive]}
              onPress={() => setSelectedPlan('yearly')}
            >
              {/* Free Trial Badge positioned on top */}
              <View style={styles.badgeFreeTrial}>
                <Text style={styles.badgeFreeTrialText}>7-day free trial</Text>
              </View>
              
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleSubtitle}>yearly</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
                    <Text style={styles.toggleTitle}>{pricing.weeklyEquivalent}</Text>
                    <Text style={styles.togglePeriod}>/week</Text>
                  </View>
                </View>
                <View style={[styles.radio, selectedPlan === 'yearly' && styles.radioActive]}>
                  {selectedPlan === 'yearly' && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Payment due spacer to completely prevent layout shifts when switching */}
          <View style={styles.paymentDueContainer}>
            {selectedPlan === 'yearly' ? (
              <>
                <Ionicons name="checkmark-sharp" size={18} color="#16a34a" style={{ marginRight: 6 }} />
                <Text style={styles.paymentDueText}>nothing to pay today</Text>
              </>
            ) : (
              <View style={styles.paymentDueSpacer} />
            )}
          </View>

          <AlohaButton
            onPress={handleStartTrial}
            text={selectedPlan === 'yearly' ? 'begin my healing — free' : 'continue'}
            variant="primary"
            style={{ paddingBottom: 0 }}
          />
          
          <Text style={styles.priceSubtext}>
            {selectedPlan === 'yearly' 
              ? `7 days free. then ${pricing.weeklyEquivalent}/week — less than a coffee.`
              : `${pricing.monthlyPrice}/month — cancel anytime, no questions.`}
          </Text>

          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => Linking.openURL('https://hopono.ai/privacy')}>
              <Text style={styles.footerLink}>privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://hopono.ai/terms')}>
              <Text style={styles.footerLink}>terms</Text>
            </TouchableOpacity>
          </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54, // Adjusted for status bar height
    paddingBottom: 16,
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
    fontFamily: 'Nunito_700Bold', // Uniform typography (Nunito Bold)
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'center',
  },

  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 260, // Space for bottom fixed container
    flexGrow: 1,
    justifyContent: 'center', // Centers the content container vertically
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24, // Balanced spacing
    lineHeight: 32,
    textTransform: 'lowercase',
  },
  timeline: {
    position: 'relative',
    paddingLeft: 12,
    marginBottom: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: 28, // center of the icon
    top: 20,
    bottom: 30,
    width: 6,
    backgroundColor: '#fed7aa',
    borderRadius: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20, // Compact margin to avoid scroll
  },
  timelineIcon: {
    width: 36, // Smaller size matching mockup details
    height: 36,
    borderRadius: 18,
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
    paddingTop: 0,
  },
  timelineTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  timelineDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    textTransform: 'lowercase',
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingTop: 8,
    paddingBottom: 20, // Lowered closer to bottom screen edge
    paddingHorizontal: 24, // Added to prevent touching left/right borders
  },
  togglesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    height: 96, // Increased height to hold the vertical stack beautifully
  },
  toggleBtnYearly: {
    borderColor: '#fdba74',
  },
  toggleBtnActive: {
    borderColor: '#e86935',
    backgroundColor: '#fff7ed',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextContainer: {
    flex: 1,
  },
  badgeFreeTrial: {
    position: 'absolute',
    top: -12,
    left: 12,
    backgroundColor: '#e86935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeFreeTrialText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#ffffff',
    textTransform: 'lowercase',
  },
  toggleSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 2,
    textTransform: 'lowercase',
  },
  toggleTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18, // Large price number to prevent any bad faith accusations
    color: '#1f2937',
  },
  togglePeriod: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    textTransform: 'lowercase',
  },
  radio: {
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
    height: 24, // Fixed height to prevent layout shifts when toggling plan
    marginBottom: 12,
  },
  paymentDueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#1f2937',
    textTransform: 'lowercase',
  },
  paymentDueSpacer: {
    height: 24,
  },

  priceSubtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'lowercase',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#cbd5e1',
    textTransform: 'lowercase',
  },
});
