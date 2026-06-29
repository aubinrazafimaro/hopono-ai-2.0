import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import AnimatedFadeIn from '@/components/AnimatedFadeIn';
import { LinearGradient } from 'expo-linear-gradient';
import AlohaButton from '@/components/AlohaButton';

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

  // Motivation level derived from commitmentLevel (readiness to let go) or guiltLevel (1-7)
  const getMotivationPercent = () => {
    if (data.commitmentLevel) {
      switch (data.commitmentLevel) {
        case '1': return 100;
        case '2': return 85;
        case '3': return 65;
        case '4': return 40;
        case '5': return 15;
        default: return 50;
      }
    }
    switch(data.guiltLevel) {
      case 7: return 100;
      case 6: return 85;
      case 5: return 70;
      case 4: return 55;
      case 3: return 40;
      case 2: return 25;
      case 1: return 10;
      default: return 50;
    }
  };
  const motivationLevel = getMotivationPercent();

  // Derive strength messages from collected data
  const getStrengths = () => {
    const strengths = [];
    
    // Always add this one — they made it this far
    strengths.push({
      title: 'you showed up',
      desc: 'most people never get this far. you did.'
    });

    // Based on guilt level — high guilt = high motivation
    if (data.guiltLevel >= 5) {
      strengths.push({
        title: 'you feel it deeply',
        desc: 'that heaviness you carry? it means you care. and caring is where change begins.'
      });
    } else {
      strengths.push({
        title: 'you were honest',
        desc: 'you named your pain. that alone is courage.'
      });
    }

    // Based on deep pain — they identified something real
    if (data.deepPain && data.deepPain.length > 0) {
      strengths.push({
        title: 'you know what hurts',
        desc: 'naming your pain is the first act of healing. you\'ve already begun.'
      });
    } else {
      strengths.push({
        title: 'you want more',
        desc: 'something in you knows life can feel lighter. trust that.'
      });
    }

    return strengths.slice(0, 3);
  };

  // Derive work areas from deep pain and obstacles
  const getWorkAreas = () => {
    const areas = [];

    if (data.deepPain && data.deepPain.includes("a heartbreak I haven't let go of")) {
      areas.push({
        title: 'releasing what you still hold',
        desc: 'ho\'oponopono was built for exactly this — letting go of someone without losing yourself.'
      });
    }

    if (data.deepPain && data.deepPain.includes("anxiety that never fully leaves")) {
      areas.push({
        title: 'quieting the anxious mind',
        desc: 'the four phrases create a rhythm your nervous system can follow. repetition becomes calm.'
      });
    }

    if (data.deepPain && data.deepPain.includes("guilt I carry alone")) {
      areas.push({
        title: 'forgiving yourself first',
        desc: '"I am sorry. please forgive me." — said to yourself, these words change everything.'
      });
    }

    if (data.deepPain && data.deepPain.includes("a loneliness I can't explain")) {
      areas.push({
        title: 'coming back to yourself',
        desc: 'loneliness often means disconnection from within. ho\'oponopono brings you home.'
      });
    }

    if (data.deepPain && data.deepPain.includes("anger toward someone I loved")) {
      areas.push({
        title: 'transforming anger into release',
        desc: 'anger held too long becomes a prison. the practice gives you a way out.'
      });
    }

    if (data.obstacles && data.obstacles.includes("I numb the pain instead of facing it")) {
      areas.push({
        title: 'meeting the pain directly',
        desc: 'hopono intercepts the moment you reach for your phone — and offers something better.'
      });
    }

    // Fallback if nothing matched
    if (areas.length === 0) {
      areas.push({
        title: 'finding stillness again',
        desc: 'not the absence of pain — but peace that coexists with it.'
      });
      areas.push({
        title: 'coming back to yourself',
        desc: 'the version of you that isn\'t running from anything.'
      });
    }

    return areas.slice(0, 3);
  };

  const strengths = getStrengths();
  const workAreas = getWorkAreas();

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedFadeIn style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Icon: Large hibiscus logo (no card container) */}
          <View style={styles.headerIconContainer}>
            <Text style={styles.largeLogo}>🌺</Text>
          </View>

          {/* Title and Intro */}
          <View style={styles.header}>
            <Text style={styles.title}>here's what we see in you</Text>
            <Text style={styles.subtitle}>you were honest. this is what that honesty reveals.</Text>
            <Text style={styles.socialProof}>you're not alone. 50,000 people chose to heal.</Text>
          </View>

          {/* Cards Block */}
          <View style={styles.cardsContainer}>
            {/* Card 1 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🔄</Text>
                <Text style={styles.cardTitle}>time lost to the pain</Text>
              </View>
              <View style={styles.barBackground}>
                <LinearGradient
                  colors={['#fdba74', '#ea580c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.barFill, { width: `${habitPercent}%` }]}
                />
                <View style={styles.barLabels}>
                  <Text style={styles.barLabelTextLeft}>low</Text>
                  <Text style={styles.barLabelTextRight}>high</Text>
                </View>
              </View>
              <Text style={styles.cardFooterText}>{data.screenTime || '1-2h'} / day</Text>
            </View>

            {/* Card 2 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>⏳</Text>
                <Text style={styles.cardTitle}>hours spent escaping</Text>
              </View>
              <Text style={styles.cardSubtext}>that's {dailyHours} hours a day away from yourself</Text>
              <Text style={styles.bigStat}>{monthlyHours} hours / month</Text>
            </View>

            {/* Card 3 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🔥</Text>
                <Text style={styles.cardTitle}>your readiness to heal</Text>
              </View>
              <View style={styles.barBackground}>
                <LinearGradient
                  colors={['#fca5a5', '#dc2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.barFill, { width: `${motivationLevel}%` }]}
                />
                <View style={styles.barLabels}>
                  <Text style={styles.barLabelTextLeft}>low</Text>
                  <Text style={styles.barLabelTextRight}>high</Text>
                </View>
              </View>
              <Text style={styles.cardFooterText}>{motivationLevel}% — you're ready.</Text>
            </View>
          </View>

          {/* Section: Strengths */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>❤️ what makes you ready</Text>
            {strengths.map((item, index) => (
              <View key={index} style={styles.listItemCard}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>

          {/* Section: Work Areas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌱 where hopono will take you</Text>
            {workAreas.map((item, index) => (
              <View key={index} style={styles.listItemCard}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Fixed Bottom CTA */}
        <View style={styles.bottomFixed}>
          <AlohaButton onPress={handleContinue} text="continue" variant="primary" />
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
    marginBottom: 16,
    marginTop: 20,
  },
  largeLogo: {
    fontSize: 72,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Nunito_700Bold', // Typography aligned to initial choice (Nunito Bold)
    fontSize: 32,
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 38,
    textTransform: 'lowercase',
  },
  subtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 16,
    textTransform: 'lowercase',
  },
  socialProof: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
    textTransform: 'lowercase',
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#1f2937',
    textTransform: 'lowercase',
  },
  cardSubtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'lowercase',
  },
  bigStat: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32, // Enlarged as requested
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 16,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  barLabelTextLeft: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#ffffff', // Overlay text inside filled bar
  },
  barLabelTextRight: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#94a3b8', // Gray text on unfilled area
  },
  cardFooterText: {
    fontFamily: 'Nunito_700Bold', // Styled as bold & larger matching mockup
    fontSize: 16,
    color: '#1f2937',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 20,
    textTransform: 'lowercase',
  },
  listItemCard: {
    backgroundColor: '#ffffff', // White card matching mockup shapes
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  itemTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 8,
    textTransform: 'lowercase',
  },
  itemDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
    textTransform: 'lowercase',
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 32,
  },
});
