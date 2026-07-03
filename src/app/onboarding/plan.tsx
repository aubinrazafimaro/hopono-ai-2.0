import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function PlanScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [showBtn, setShowBtn] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    if (contentHeight > 0 && scrollViewHeight > 0 && contentHeight <= scrollViewHeight + 50) {
      setShowBtn(true);
    }
  }, [contentHeight, scrollViewHeight]);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 50;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  // Calculate the date 21 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 21);
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(targetDate).toLowerCase();

  const name = data.name && data.name.trim() !== '' ? data.name.trim().toLowerCase() : 'friend';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={400}
        onContentSizeChange={(width, height) => setContentHeight(height)}
        onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setShowBtn(true);
          }
        }}
      >
        
        {/* Main Commitment Card */}
        <View style={styles.commitmentCard}>
          <Text style={styles.commitmentTitle}>
            {name}, imagine waking up on
          </Text>
          
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          {/* Goal 1 Card (Shape: Centered Goal Card) */}
          <View style={styles.goalCard}>
            <Text style={styles.goalEmoji}>✨</Text>
            <Text style={styles.goalText}>free from what weighs you down</Text>
          </View>

          {/* Goal 2 Card (Shape: Row Metric Card) */}
          <View style={styles.metricCard}>
            <Text style={styles.metricEmoji}>🧘‍♀️</Text>
            <Text style={styles.metricText}>lighter. clearer. finally yourself.</Text>
          </View>
        </View>

        {/* How we'll get there */}
        <Text style={styles.sectionTitle}>your path to get there:</Text>

        {/* Feature 1 */}
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

        {/* Feature 2 */}
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
      {showBtn && (
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
      )}
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
    paddingTop: 24, // Reduced from 56 for zero-scroll
    paddingBottom: 120, // space for fixed button
  },
  commitmentCard: {
    borderWidth: 2,
    borderColor: '#e86935',
    borderRadius: 24,
    padding: 16, // Reduced from 24
    alignItems: 'center',
    marginBottom: 16, // Reduced from 32
    backgroundColor: '#ffffff',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  commitmentTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18, // Reduced from 20
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 10,
  },
  datePill: {
    borderWidth: 1.5,
    borderColor: '#e86935',
    borderRadius: 20,
    paddingVertical: 5, // Reduced from 8
    paddingHorizontal: 16,
    marginBottom: 14, // Reduced from 20
  },
  dateText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15, // Reduced from 18
    color: '#1f2937',
  },
  goalCard: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 10, // Reduced from 16
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  goalEmoji: {
    fontSize: 20, // Reduced from 24
    marginBottom: 4,
  },
  goalText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13, // Reduced from 15
    color: '#1f2937',
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Reduced from 14
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '85%', // Shrunk width relative to goalCard
    alignSelf: 'center', // Center aligned
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  metricEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  metricText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12.5, // Reduced from 14
    color: '#1f2937',
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16, // Reduced from 18
    color: '#1f2937',
    marginBottom: 10, // Reduced from 20
    textTransform: 'lowercase',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 12, // Reduced from 20
    borderRadius: 20,
    marginBottom: 10, // Reduced from 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  featureIconContainer: {
    width: 36, // Reduced from 44
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Reduced from 16
  },
  featureEmoji: {
    fontSize: 18, // Reduced from 24
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14, // Reduced from 16
    color: '#1f2937',
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  featureDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12, // Reduced from 14
    color: '#9ca3af',
    lineHeight: 17, // Reduced from 22
    textTransform: 'lowercase',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  transformButton: {
    backgroundColor: '#e86935',
    borderRadius: 16, // rounded rectangle like mockup (slightly rounded, not pill)
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#ffffff',
    textTransform: 'lowercase',
  }
});
