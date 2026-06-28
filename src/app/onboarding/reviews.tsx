import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ContinueButton from '@/components/ContinueButton';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';

export default function ReviewsScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/trial-timeline');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Text style={styles.title}>
          hopono ai was designed for <Text style={styles.titleHighlight}>people like you.</Text>
        </Text>
        <Text style={styles.subtitle}>reviews from people using hopono ai.</Text>

        {/* Award Section */}
        <View style={styles.awardContainer}>
          <Ionicons name="leaf" size={24} color="#f59e0b" style={styles.laurelLeft} />
          <View style={styles.awardTextContainer}>
            <Text style={styles.awardText}>the #1 mindfulness</Text>
            <Text style={styles.awardText}>habit app</Text>
          </View>
          <Ionicons name="leaf" size={24} color="#f59e0b" style={styles.laurelRight} />
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={18} color="#f59e0b" />
            ))}
          </View>
          <Text style={styles.peopleText}>🕊️ 🧘 ✨ + 50,000 people</Text>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {/* Review 1 */}
          <View style={styles.reviewCard}>
            <View style={styles.starsContainerCard}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={14} color="#f59e0b" />
              ))}
            </View>
            <Text style={styles.reviewTitle}>GAME CHANGER.</Text>
            <Text style={styles.reviewBody}>
              no joke, this app is the only thing that's actually helped me find peace consistently. the guided mantras are genius.
            </Text>
          </View>

          {/* Review 2 */}
          <View style={styles.reviewCard}>
            <View style={styles.starsContainerCard}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={14} color="#f59e0b" />
              ))}
            </View>
            <Text style={styles.reviewTitle}>FINALLY!!</Text>
            <Text style={styles.reviewBody}>
              finally an app that gets it. i was so sick of my phone owning my mind and my anxiety taking over. now inner peace gets the first word.
            </Text>
          </View>
          
          {/* Review 3 */}
          <View style={styles.reviewCard}>
            <View style={styles.starsContainerCard}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={14} color="#f59e0b" />
              ))}
            </View>
            <Text style={styles.reviewTitle}>JUST WOW.</Text>
            <Text style={styles.reviewBody}>
              practicing ho'oponopono daily has literally shifted my entire day. i feel so much lighter and less stressed out.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.bottomContainer}>
        <ContinueButton 
          onPress={handleNext} 
          text="join hopono ai 🕊️"
        />
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
    paddingBottom: 120, // space for button
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 38,
  },
  titleHighlight: {
    color: '#e86935',
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 30,
  },
  awardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  awardTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  awardText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
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
    marginBottom: 40,
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
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  starsContainerCard: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 12,
  },
  reviewTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
  },
  reviewBody: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent', // Let ContinueButton handle its own padding/background if necessary, wait ContinueButton has no background, it sits at bottom 0
  },
});
