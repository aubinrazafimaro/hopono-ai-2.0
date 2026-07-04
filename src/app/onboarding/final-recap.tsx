import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from '@/context/OnboardingContext';
import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPos = insets.bottom > 0 ? insets.bottom + 14 : 24;
  const { data } = useOnboarding();
  const { refreshUserData } = useUser();
  const [showBtn, setShowBtn] = useState(false);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      await refreshUserData();
      
      router.push('/onboarding/power');
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
      router.push('/onboarding/power'); 
    }
  };

  const getResolutionEmoji = (goal: string) => {
    switch (goal) {
      // Resolutions
      case "free the mind from blockages, pain, and trauma": return "🧠";
      case "overcome persistent emotional pain": return "❤️‍🩹";
      case "resolve a conflict or restore broken harmony": return "🤝";
      case "process the need for forgiveness": return "🕊️";
      // Life Goals
      case "find my other half, my soulmate": return "💍";
      case "travel the world": return "✈️";
      case "build my empire": return "👑";
      case "build my dream body": return "💪";
      case "launch my youtube channel": return "🎥";
      default: return "🌺";
    }
  };

  const getSelfImageEmoji = (label: string) => {
    switch (label) {
      case "empty. like I wasted something precious": return "🌑";
      case "ashamed. I know I was avoiding something": return "🌧️";
      case "disconnected from who I want to be": return "🌊";
      case "a little guilty, but I move on": return "🌤️";
      default: return "🌤️";
    }
  };

  const getObstacleEmoji = (label: string) => {
    switch (label) {
      case "I numb the pain instead of facing it": return "📱";
      case "my mind won't stop overthinking": return "🌊";
      case "I'm scared of what I might feel": return "🛡️";
      case "I don't believe I can truly change": return "🌑";
      case "I never have time for myself": return "⏱️";
      default: return "📱";
    }
  };

  const displayGoal = data.resolutionGoal && data.resolutionGoal.length > 0 ? data.resolutionGoal[0] : (data.lifeGoals.length > 0 ? data.lifeGoals[0] : "live a fulfilling life");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerTransparent}>
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              setShowBtn(true);
            }
          }}
          scrollEventThrottle={400}
        >
          
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
              {data.selfImageImpact && data.selfImageImpact.length > 0 ? (
                data.selfImageImpact.map((impact, idx) => (
                  <Text key={idx} style={[styles.cardValue, { marginBottom: idx < data.selfImageImpact.length - 1 ? 8 : 0 }]}>
                    {getSelfImageEmoji(impact)} {impact}
                  </Text>
                ))
              ) : (
                <Text style={styles.cardValue}>
                  🌤️ guilt level is at {data.guiltLevel}/7
                </Text>
              )}
            </View>

            {/* Card 3: What's standing in the way */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>what we'll work through</Text>
              </View>
              {data.obstacles.length > 0 ? (
                data.obstacles.map((obs, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <Text style={styles.bulletEmoji}>{getObstacleEmoji(obs)}</Text>
                    <Text style={styles.bulletText}>{obs}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.bulletRow}>
                  <Text style={styles.bulletEmoji}>📱</Text>
                  <Text style={styles.bulletText}>phone & social media escapism</Text>
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
        {showBtn && (
          <View style={[styles.bottomContainerLink, { bottom: bottomPos }]}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleFinish}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.linkButtonText}>continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6, transform: [{ translateY: 2 }] }} />
              </View>
            </TouchableOpacity>
          </View>
        )}
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
    fontFamily: 'Nunito_800ExtraBold',
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
  bulletEmoji: {
    fontSize: 18,
    marginRight: 12,
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
  bottomContainerLink: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  linkButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  linkButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
});
