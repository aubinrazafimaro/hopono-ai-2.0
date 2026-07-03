import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

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
          {/* Left Item: Dove */}
          <View style={[styles.itemContainer, styles.itemLeft]}>
            <View style={styles.labelPill}>
              <Text style={styles.labelText}>🌺 your healing</Text>
            </View>
            <View style={[styles.iconWrapper, styles.doveIconWrapper]}>
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
            <View style={[styles.labelPill, styles.coffeeLabelPill]}>
              <Text style={styles.labelText}>☕ less than a{'\n'}coffee a week</Text>
            </View>
          </View>
        </View>

        {/* Bottom Section containing text and button naturally in a column */}
        <View style={styles.bottomSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>try it free for 7 days.{'\n'}feel the difference.</Text>
            <Text style={styles.description}>
              if it doesn't change something in you, cancel anytime. no questions asked.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/onboarding/commitment')}
          >
            <Text style={styles.actionButtonText}>i'm in</Text>
          </TouchableOpacity>
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
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 10,
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
    marginTop: 10,
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
    height: 290,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 160,
  },
  itemLeft: {
    top: 20,
    left: 10,
    transform: [{ rotate: '-8deg' }],
  },
  itemRight: {
    bottom: 20,
    right: 10,
    transform: [{ rotate: '8deg' }],
  },
  iconWrapper: {
    marginVertical: 3,
  },
  doveIconWrapper: {
    marginTop: -10,
  },
  coffeeLabelPill: {
    marginTop: -10,
  },
  hugeIcon: {
    fontSize: 125,
  },
  labelPill: {
    backgroundColor: '#ffffff',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 5,
  },
  labelText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 17,
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
  bottomSection: {
    width: '100%',
    alignItems: 'stretch',
  },
  textContainer: {
    paddingHorizontal: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 32,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  description: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 22,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    width: '100%',
    marginBottom: 20,
  },
  actionButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#e86935',
    textTransform: 'lowercase',
  },
});
