import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ContinueButton from '@/components/ContinueButton';

export default function ComparisonScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header Pill */}
        <View style={styles.headerContainer}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>🎁 fair trial policy</Text>
          </View>
        </View>

        {/* Central Graphic Area */}
        <View style={styles.graphicContainer}>
          {/* Left Item: Inner Peace */}
          <View style={[styles.itemContainer, styles.itemLeft]}>
            <View style={styles.labelPill}>
              <Text style={styles.labelText}>🙏 inner peace</Text>
            </View>
            <View style={styles.iconWrapper}>
              <Text style={styles.hugeIcon}>🕊️</Text>
            </View>
          </View>

          {/* VS Badge */}
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Right Item: Coffee */}
          <View style={[styles.itemContainer, styles.itemRight]}>
            <View style={styles.iconWrapper}>
              <Text style={styles.hugeIcon}>☕</Text>
            </View>
            <View style={styles.labelPill}>
              <Text style={styles.labelText}>☕ the cost of one coffee a month</Text>
            </View>
          </View>
        </View>

        {/* Bottom Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>hopono ai is free for you to try.</Text>
          <Text style={styles.description}>
            we depend on support from users like you to keep building a tool that helps our generation find peace and stay mindful.
          </Text>
        </View>

        {/* Button */}
        <ContinueButton 
          onPress={() => router.push('/onboarding/commitment')}
          text="sounds good"
          color="#ffffff"
          textColor="#e86935"
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e86935',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  pill: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pillText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#e86935',
  },
  graphicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: 300,
  },
  itemContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  itemLeft: {
    top: '15%',
    left: '5%',
    transform: [{ rotate: '-8deg' }],
  },
  itemRight: {
    bottom: '15%',
    right: '5%',
    transform: [{ rotate: '8deg' }],
  },
  iconWrapper: {
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  hugeIcon: {
    fontSize: 70,
  },
  labelPill: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  labelText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#1f2937',
  },
  vsBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  vsText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#e86935',
  },
  textContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});
