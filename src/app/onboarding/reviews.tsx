import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';
import AlohaButton from '@/components/AlohaButton';

const LaurelBranch = ({ isLeft }: { isLeft: boolean }) => {
  return (
    <Svg
      width={32}
      height={48}
      viewBox="0 0 32 48"
      style={{ transform: [{ scaleX: isLeft ? 1 : -1 }] }}
    >
      <Path
        d="M4,44 Q16,30 20,4"
        fill="none"
        stroke="#f59e0b"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Leaves along the branch */}
      <Path d="M6,36 Q10,32 14,35 Q8,41 6,36" fill="#f59e0b" />
      <Path d="M8,27 Q13,23 17,26 Q11,32 8,27" fill="#f59e0b" />
      <Path d="M12,18 Q17,14 21,17 Q15,23 12,18" fill="#f59e0b" />
      <Path d="M15,9 Q20,6 23,10 Q17,15 15,9" fill="#f59e0b" />
      <Path d="M19,1 Q22,0 23,4 Q20,6 19,1" fill="#f59e0b" />
    </Svg>
  );
};

export default function ReviewsScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/trial-timeline');
  };

  return (
    <View style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <Text style={styles.title}>
            hopono was designed{'\n'}for <Text style={styles.titleHighlight}>hearts like you.</Text>
          </Text>
          <Text style={styles.subtitle}>early feedback from our beta community.</Text>

          {/* Award Block with Laurel Wreaths */}
          <View style={styles.awardSection}>
            <View style={styles.awardContainer}>
              <LaurelBranch isLeft={true} />
              <View style={styles.awardTextContainer}>
                <Text style={styles.awardText}>the #1 emotional</Text>
                <Text style={styles.awardText}>healing app</Text>
              </View>
              <LaurelBranch isLeft={false} />
            </View>

            {/* Stars under the Award Wreath */}
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={16} color="#f59e0b" />
                ))}
              </View>
              {/* Emojis matching the mockup layout + social proof */}
              <Text style={styles.peopleText}>🙏 🥺 🙌 early beta community</Text>
            </View>
          </View>

          {/* Centered Reviews List (Scaled down to real size, left-aligned like App Store) */}
          <View style={styles.reviewsList}>
            {/* Review 1 */}
            <View style={styles.reviewCard}>
              <View style={styles.starsContainerCard}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={14} color="#f59e0b" style={{ marginRight: 2 }} />
                ))}
              </View>
              <Text style={styles.reviewTitle}>I CRIED SITTING IN PEACE.</Text>
              <Text style={styles.reviewBody}>
                I didn't expect to feel so much so fast. the mantras hit different when you actually mean them. something released in me.
              </Text>
            </View>

            {/* Review 2 */}
            <View style={styles.reviewCard}>
              <View style={styles.starsContainerCard}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={14} color="#f59e0b" style={{ marginRight: 2 }} />
                ))}
              </View>
              <Text style={styles.reviewTitle}>MY MIND FINALLY QUIETED.</Text>
              <Text style={styles.reviewBody}>
                after 8 months of obsessing, I did 3 sessions in a row and something just... quieted. I don't know how to explain it but it worked.
              </Text>
            </View>
            
            {/* Review 3 */}
            <View style={styles.reviewCard}>
              <View style={styles.starsContainerCard}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={14} color="#f59e0b" style={{ marginRight: 2 }} />
                ))}
              </View>
              <Text style={styles.reviewTitle}>MY THERAPIST RECOMMENDS IT.</Text>
              <Text style={styles.reviewBody}>
                she asked what I was doing differently. I told her about hopono. now she recommends it to her other clients.
              </Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Footer with primary button */}
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
    paddingTop: 64, // Top spacer for status bar
    paddingBottom: 120, // Space for footer button
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 32,
    textTransform: 'lowercase',
  },
  titleHighlight: {
    color: '#e86935',
  },
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 20,
    textTransform: 'lowercase',
  },
  awardSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  awardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    lineHeight: 20,
    textTransform: 'lowercase',
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
    borderWidth: 1.2,
    borderColor: '#f1f5f9',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    alignItems: 'flex-start',
  },
  starsContainerCard: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 6,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  reviewBody: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    textAlign: 'left',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
});
