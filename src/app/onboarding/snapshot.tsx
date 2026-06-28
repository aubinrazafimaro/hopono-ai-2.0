import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';
import ContinueButton from '@/components/ContinueButton';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';
import { LinearGradient } from 'expo-linear-gradient';

export default function SnapshotScreen() {
  const router = useRouter();
  const { data } = useOnboarding();

  const handleContinue = () => {
    router.push('/onboarding/reviews');
  };

  // Derive some dynamic data based on user context
  let dailyHours = 2; // default
  if (data.screenTime === 'less than 1h') dailyHours = 1;
  else if (data.screenTime === '1-2h') dailyHours = 2;
  else if (data.screenTime === '3-4h') dailyHours = 4;
  else if (data.screenTime === '5-6h') dailyHours = 6;
  else if (data.screenTime === '6h+') dailyHours = 8;

  const monthlyHours = dailyHours * 30;
  
  // Calculate a "habit level" bar width
  const habitPercent = Math.min(100, Math.max(20, (dailyHours / 8) * 100));

  // Motivation level derived from guiltLevel (1-7)
  const getMotivationPercent = (guilt: number) => {
    switch(guilt) {
      case 7: return 98;
      case 6: return 92;
      case 5: return 85;
      case 4: return 75;
      case 3: return 65;
      case 2: return 50;
      case 1: return 40;
      default: return 90;
    }
  };
  const motivationLevel = getMotivationPercent(data.guiltLevel);

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

        <View style={styles.header}>
          <Text style={styles.title}>🕊️ your personalized mindfulness snapshot</Text>
          <Text style={styles.subtitle}>based on your answers, here's where you're at:</Text>
          <Text style={styles.socialProof}>you're now part of 50,000 users putting mindfulness over their phones</Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Card 1 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🔄</Text>
              <Text style={styles.cardTitle}>current phone habit</Text>
            </View>
            <View style={styles.barBackground}>
              <LinearGradient
                colors={['#fdba74', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.barFill, { width: `${habitPercent}%` }]}
              />
              <View style={styles.barLabels}>
                <Text style={styles.barLabelText}>low</Text>
                <Text style={styles.barLabelText}>high</Text>
              </View>
            </View>
            <Text style={styles.cardFooterText}>{data.screenTime || '1-2h'} / day</Text>
          </View>

          {/* Card 2 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>⏳</Text>
              <Text style={styles.cardTitle}>monthly time on phone</Text>
            </View>
            <Text style={styles.cardSubtext}>estimated from {dailyHours} hrs/day</Text>
            <Text style={styles.bigStat}>{monthlyHours} hours</Text>
          </View>

          {/* Card 3 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🔥</Text>
              <Text style={styles.cardTitle}>motivation level</Text>
            </View>
            <View style={styles.barBackground}>
              <LinearGradient
                colors={['#fca5a5', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.barFill, { width: `${motivationLevel}%` }]}
              />
              <View style={styles.barLabels}>
                <Text style={styles.barLabelTextWhite}>low</Text>
                <Text style={styles.barLabelTextWhite}>high</Text>
              </View>
            </View>
            <Text style={styles.cardFooterText}>{motivationLevel}% (ready to change)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❤️ strengths</Text>
          
          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>you're self-aware</Text>
            <Text style={styles.itemDesc}>
              you know what gets in the way. that honesty makes it easier to build a plan that actually works.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>you're highly motivated</Text>
            <Text style={styles.itemDesc}>
              your desire to change is high. we'll provide the structure to turn that motivation into a real habit.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>you're being real about it</Text>
            <Text style={styles.itemDesc}>
              it's normal to feel overwhelmed sometimes. having a structure helps bridge the gap on tough days.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌱 areas for exploration</Text>

          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>tackling phone distraction</Text>
            <Text style={styles.itemDesc}>
              practicing ho'oponopono creates a peaceful zone so you can actually focus on your well-being instead of scrolling.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>improving inner peace</Text>
            <Text style={styles.itemDesc}>
              short, guided mantras will help keep your mind from wandering and bring you back to the present moment.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>managing anxiety</Text>
            <Text style={styles.itemDesc}>
              the app includes deep breathing and ho'oponopono prompts to ground you whenever you feel anxious or overwhelmed.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomFixed}>
        <ContinueButton onPress={handleContinue} text="continue" />
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
    paddingBottom: 140, // Space for continue button
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
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 16,
  },
  socialProof: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  card: {
    borderWidth: 1.5,
    borderColor: '#e86935',
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  cardTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#1f2937',
  },
  cardSubtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  bigStat: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: '#1f2937',
  },
  barBackground: {
    height: 32,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 8,
  },
  barFill: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  barLabelText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#94a3b8',
  },
  barLabelTextWhite: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardFooterText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  itemTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 8,
  },
  itemDesc: {
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
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
});
