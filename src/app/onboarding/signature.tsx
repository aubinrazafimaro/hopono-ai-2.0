import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlohaButton from '@/components/AlohaButton';

export default function SignatureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPos = insets.bottom > 0 ? insets.bottom + 6 : 14;
  
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [hasSigned, setHasSigned] = useState(false);

  // Staggered animations
  const [showSignature, setShowSignature] = useState(false);
  const bullet1Opacity = useRef(new Animated.Value(0)).current;
  const bullet2Opacity = useRef(new Animated.Value(0)).current;
  const bullet3Opacity = useRef(new Animated.Value(0)).current;
  const bullet4Opacity = useRef(new Animated.Value(0)).current;
  
  const signatureOpacity = useRef(new Animated.Value(0)).current;
  const signatureScale = useRef(new Animated.Value(0.9)).current;

  const startAnimation = () => {
    // Reset values
    bullet1Opacity.setValue(0);
    bullet2Opacity.setValue(0);
    bullet3Opacity.setValue(0);
    bullet4Opacity.setValue(0);
    signatureOpacity.setValue(0);
    signatureScale.setValue(0.9);
    setShowSignature(false);

    // Sequence for bullet fade-ins with gentle, slow delays matching the app's spirit
    Animated.sequence([
      Animated.timing(bullet1Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(bullet2Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(bullet3Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(bullet4Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.delay(1000),
    ]).start(() => {
      // Trigger signature section animation: very slow, dreamy fade-in
      Animated.parallel([
        Animated.timing(signatureOpacity, {
          toValue: 1,
          duration: 2500, // 2.5 seconds for a dreamy, gradual reveal
          useNativeDriver: true,
        }),
        Animated.spring(signatureScale, {
          toValue: 1,
          friction: 8,
          tension: 25,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowSignature(true);
      });
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTintColor: '#ffffff' }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} scrollEnabled={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.mainTitle}>seal your intention.</Text>
            <Text style={styles.subTitle}>from this moment, i choose:</Text>
            
            <View style={styles.bulletsContainer}>
              {/* Bullet 1 */}
              <Animated.View style={[styles.bulletRow, { opacity: bullet1Opacity }]}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>to heal, not to hide</Text>
              </Animated.View>
              {/* Bullet 2 */}
              <Animated.View style={[styles.bulletRow, { opacity: bullet2Opacity }]}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>to feel, not to flee</Text>
              </Animated.View>
              {/* Bullet 3 */}
              <Animated.View style={[styles.bulletRow, { opacity: bullet3Opacity }]}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>to show up for myself, daily</Text>
              </Animated.View>
              {/* Bullet 4 */}
              <Animated.View style={[styles.bulletRow, { opacity: bullet4Opacity }]}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>to give love — starting with myself</Text>
              </Animated.View>
            </View>
          </View>

          {/* Always rendered, starts invisible and fades in very gradually like a dream */}
          <Animated.View 
            pointerEvents={showSignature ? 'auto' : 'none'}
            style={[
              styles.signatureSection, 
              { 
                opacity: signatureOpacity, 
                transform: [{ scale: signatureScale }] 
              }
            ]}
          >
            {/* Single reset button positioned elegantly just above the signature pad on the right */}
            <View style={styles.signatureHeader}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={handleClear} style={styles.resetButton}>
                <Ionicons name="refresh" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <View 
              style={styles.signaturePad}
              onStartShouldSetResponder={() => true}
              onStartShouldSetResponderCapture={() => true}
              onMoveShouldSetResponderCapture={() => true}
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
                  <Text style={styles.placeholderText}>your name, your promise</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.signatureFooter}>
              this is between you and yourself. 🌺
            </Text>
          </Animated.View>
        </ScrollView>
        {/* Bottom Button */}
        <View style={[styles.bottomContainerLink, { bottom: bottomPos }]}>
          <TouchableOpacity 
            style={[styles.linkButton, !hasSigned && { opacity: 0.5 }]}
            onPress={handleNext}
            disabled={!hasSigned}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.linkButtonText}>i commit</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6, transform: [{ translateY: 2 }] }} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subTitle: {
    fontFamily: 'Nunito_800ExtraBold',
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
    fontFamily: 'Nunito_700Bold',
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
    marginTop: 36, // Lowered the pad to push it closer to the bottom section
  },
  signatureHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8, // Elegant space above signature pad
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
