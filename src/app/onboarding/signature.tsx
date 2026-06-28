import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import ContinueButton from '@/components/ContinueButton';

export default function SignatureScreen() {
  const router = useRouter();
  
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [hasSigned, setHasSigned] = useState(false);

  const handleResponderGrant = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;
    setCurrentPath(`M ${locationX} ${locationY}`);
    setHasSigned(true);
  };

  const handleResponderMove = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;
    setCurrentPath(prev => `${prev} L ${locationX} ${locationY}`);
  };

  const handleResponderRelease = () => {
    setPaths([...paths, currentPath]);
    setCurrentPath('');
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
    setHasSigned(false);
  };

  const handleNext = () => {
    router.push('/onboarding/snapshot');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.header}>
          <Text style={styles.mainTitle}>make your commitment</Text>
          <Text style={styles.subTitle}>from today forward, i choose to:</Text>
          
          <View style={styles.bulletsContainer}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>seek peace before my phone</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>practice mindfulness before scrolling</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>be intentional with my screen time</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>guard my heart and my mind</Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureHeader}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={handleClear} style={styles.resetButton}>
              <Ionicons name="refresh" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View 
            style={styles.signaturePad}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleResponderGrant}
            onResponderMove={handleResponderMove}
            onResponderRelease={handleResponderRelease}
          >
            <Svg style={StyleSheet.absoluteFill}>
              {paths.map((p, i) => (
                <Path 
                  key={i} 
                  d={p} 
                  stroke="#1f2937" 
                  strokeWidth={3} 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              ))}
              {currentPath ? (
                <Path 
                  d={currentPath} 
                  stroke="#1f2937" 
                  strokeWidth={3} 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              ) : null}
            </Svg>
            
            {!hasSigned && (
              <View style={styles.placeholderContainer} pointerEvents="none">
                <Text style={styles.placeholderText}>sign here</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.signatureFooter}>
            sign as a reminder of the promise you're making.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <ContinueButton 
          onPress={handleNext} 
          text="continue" 
          disabled={!hasSigned}
          color="rgba(255, 255, 255, 0.3)"
          textColor="#ffffff"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e86935',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 140, // Space for bottom button
  },
  header: {
    marginBottom: 40,
  },
  mainTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  bulletsContainer: {
    paddingLeft: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#ffffff',
    marginRight: 12,
    marginTop: -2,
  },
  bulletText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  signatureSection: {
    width: '100%',
    alignItems: 'center',
  },
  signatureHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -15, // Overlap slightly
    zIndex: 10,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signaturePad: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 24,
    color: '#cbd5e1',
    opacity: 0.5,
  },
  signatureFooter: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
