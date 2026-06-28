import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from '@/context/OnboardingContext';
import { useUser } from '@/context/UserContext';
import { SimpleLineIcons } from '@expo/vector-icons';
import AlohaButton from '@/components/AlohaButton';

export default function RecapScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { refreshUserData } = useUser();

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      await refreshUserData();
      
      router.push('/onboarding/generating');
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
      router.push('/onboarding/generating'); 
    }
  };

  const getResolutionEmoji = (goal: string) => {
    switch (goal) {
      case "free the mind from blockages, pain, and trauma": return "🌊";
      case "overcome persistent emotional pain": return "❤️‍🩹";
      case "resolve a conflict or restore broken harmony": return "🌺";
      case "process the need for forgiveness": return "🕊️";
      default: return "🌺";
    }
  };

  const displayGoal = data.resolutionGoal && data.resolutionGoal.length > 0 ? data.resolutionGoal[0] : (data.lifeGoals.length > 0 ? data.lifeGoals[0] : "live a fulfilling life");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerTransparent}>


        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.mainTitle}>
            we see you, {data.name || 'friend'}. 🌺
          </Text>
          <Text style={styles.subtitle}>
            here's what you came with. here's where you're going.
          </Text>

          <View style={styles.cardsContainer}>
            {/* Card 1: Where you want to go */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>your destination</Text>
              </View>
              <Text style={styles.cardValue}>
                {getResolutionEmoji(displayGoal)} {displayGoal}
              </Text>
            </View>

            {/* Card 2: Where you are now */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>where you stand today</Text>
              </View>
              <Text style={styles.cardValue}>
                {data.selfImageImpact && data.selfImageImpact.length > 0 ? data.selfImageImpact.join(', ') : "guilt level is at " + data.guiltLevel + "/7"}
              </Text>
            </View>

            {/* Card 3: What's standing in the way */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>what we'll work through</Text>
              </View>
              {data.obstacles.length > 0 ? (
                data.obstacles.map((obs, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.bulletText}>{obs}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.bulletRow}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.bulletText}>📱 phone & social media escapism</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.bottomText}>
              this is your starting point, {data.name || 'friend'}. not your identity. ho'oponopono will meet you exactly here — and walk with you forward.
            </Text>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <AlohaButton onPress={handleFinish} text="continue" variant="secondary" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e86935',
  },
  containerTransparent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 32,
    paddingBottom: 140,
  },
  mainTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 32,
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badge: {
    backgroundColor: '#fff5f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#e86935',
  },
  cardValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#1f2937',
    lineHeight: 26,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e86935',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
  bottomSection: {
    alignItems: 'center',
  },
  bottomText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 24,
  },
  finishButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  finishButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#e86935',
  },
});
