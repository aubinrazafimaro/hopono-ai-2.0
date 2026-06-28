import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';
import AlohaButton from '@/components/AlohaButton';

export default function ReviewsScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/trial-timeline');
  };

  return (
    <View style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header (Raised up, no duplicate back button or Expo settings gear) */}
          <Text style={styles.title}>
            they felt what you feel. <Text style={styles.titleHighlight}>then something shifted.</Text>
          </Text>
          <Text style={styles.subtitle}>reviews from people using hopono et AI.</Text>

          {/* Award Block with Laurel Wreaths (Raised up) */}
          <View style={styles.awardSection}>
            <View style={styles.awardContainer}>
              <Ionicons name="leaf" size={24} color="#e86935" style={styles.laurelLeft} />
              <View style={styles.awardTextContainer}>
                <Text style={styles.awardText}>the #1 emotional</Text>
                <Text style={styles.awardText}>healing app</Text>
              </View>
              <Ionicons name="leaf" size={24} color="#e86935" style={styles.laurelRight} />
            </View>

            {/* Stars under the Award Wreath */}
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={16} color="#e86935" />
                ))}
              </View>
              {/* Emojis matching the mockup layout + social proof */}
              <Text style={styles.peopleText}>🙏 🥺 🙌 + 50,000 people</Text>
            </View>
          </View>

          {/* Centered Reviews List (Scaled down to real size to avoid feeling crude) */}
          <View style={styles.reviewsList}>
            {/* Review 1 */}
            <View style={styles.reviewCard}>
              <View style={styles.starsContainerCard}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={14} color="#e86935" />
                ))}
              </View>
              <Text style={styles.reviewTitle}>I cried during my first session.</Text>
              <Text style={styles.reviewBody}>
                I didn't expect to feel so much so fast. the mantras hit different when you actually mean them. something released in me.
              </Text>
            </View>

            {/* Review 2 */}
            <View style={styles.reviewCard}>
              <View style={styles.starsContainerCard}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={14} color="#e86935" />
                ))}
              </View>
              <Text style={styles.reviewTitle}>I stopped thinking about my ex.</Text>
              <Text style={styles.reviewBody}>
                after 8 months of obsessing, I did 3 sessions in a row and something just... quieted. I don't know how to explain it but it worked.
              </Text>
            </View>
            
            {/* Review 3 */}
            <View style={styles.reviewCard}>
              <View style={styles.starsContainerCard}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={14} color="#e86935" />
                ))}
              </View>
              <Text style={styles.reviewTitle}>My therapist noticed the difference.</Text>
              <Text style={styles.reviewBody}>
                she asked what I was doing differently. I told her about hopono. now she recommends it to her other clients.
              </Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Footer with primary button: Lowered to screen bottom edge to optimize space utilization */}
        <View style={styles.bottomContainer}>
          <AlohaButton onPress={handleNext} text="begin my healing 🌺" variant="primary" />
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 54, // Top spacer for status bar
    paddingBottom: 100, // Space for lowered footer button
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 34,
    textTransform: 'lowercase',
  },
  titleHighlight: {
    color: '#e86935',
  },
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 24,
    textTransform: 'lowercase',
  },
  awardSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  awardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  awardTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  awardText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  laurelLeft: {
    transform: [{ rotateY: '180deg' }, { rotateZ: '20deg' }],
  },
  laurelRight: {
    transform: [{ rotateZ: '20deg' }],
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  peopleText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  starsContainerCard: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
    justifyContent: 'center',
  },
  reviewTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  reviewBody: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 18,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20, // Lowered closer to bottom screen edge
    paddingTop: 8,
    backgroundColor: '#ffffff',
  },
});
