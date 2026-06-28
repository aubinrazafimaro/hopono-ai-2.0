import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AlohaButton from '@/components/AlohaButton';

export default function ComparisonScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        {/* Header Pill */}
        <View style={styles.headerContainer}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>🎁 7 days. on us.</Text>
          </View>
        </View>

        {/* Central Graphic Area */}
        <View style={styles.graphicContainer}>
          {/* Left Item: Inner Peace */}
          <View style={[styles.itemContainer, styles.itemLeft]}>
            <View style={styles.labelPill}>
              <Text style={styles.labelText}>🌺 your healing</Text>
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
              <Text style={styles.labelText}>☕ less than a coffee a week</Text>
            </View>
          </View>
        </View>

        {/* Bottom Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>try it free for 7 days. feel the difference.</Text>
          <Text style={styles.description}>
            if it doesn't change something in you, cancel anytime. no questions asked.
          </Text>
        </View>

        {/* Button */}
        <AlohaButton onPress={() => router.push('/onboarding/commitment')} text="I'm in" variant="secondary" />
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
    paddingBottom: 24,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 10, // Moved up to let the page breathe
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
    width: '100%',
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10, // Moved up slightly
    marginBottom: 10,
  },
  itemContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  itemLeft: {
    top: 10,
    left: 36, // Moved in to cluster centered, away from the screen edge
    transform: [{ rotate: '-8deg' }],
  },
  itemRight: {
    bottom: 10,
    right: 36, // Moved in to cluster centered, away from the screen edge
    transform: [{ rotate: '8deg' }],
  },
  iconWrapper: {
    marginVertical: 10,
  },
  hugeIcon: {
    fontSize: 100, // Premium large size matching the mockup proportions
  },
  labelPill: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  labelText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#1f2937',
  },
  vsBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#e86935',
  },
  textContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Nunito_700Bold', // Keep original app typography
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 28,
    textAlign: 'left', // Aligned to the left matching the mockup
    textTransform: 'lowercase',
  },
  description: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    textAlign: 'left', // Aligned to the left matching the mockup
    textTransform: 'lowercase',
  },
});
