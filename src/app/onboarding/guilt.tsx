import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import ContinueButton from '@/components/ContinueButton';

export default function GuiltScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  
  const [guiltLevel, setGuiltLevel] = useState(4);
  
  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = screenWidth - 64; // 32px padding on each side
  const thumbSize = 32;
  const trackWidth = sliderWidth - thumbSize;
  
  // Initialize to value 4 (middle)
  const initialPercent = (4 - 1) / 6;
  const fillAnim = useRef(new Animated.Value(initialPercent * trackWidth)).current;

  const updateLevelFromX = (x: number) => {
    // x is the touch position relative to the track.
    // We adjust it by half the thumb size so that the center of the thumb follows the finger.
    const adjustedX = x - thumbSize / 2;
    const clampedX = Math.max(0, Math.min(adjustedX, trackWidth));
    const percentage = clampedX / trackWidth;
    const level = Math.round(percentage * 6) + 1;
    setGuiltLevel(level);
    
    Animated.spring(fillAnim, {
      toValue: percentage * trackWidth,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateLevelFromX(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updateLevelFromX(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const handleContinue = () => {
    updateData({ guiltLevel });
    router.push('/onboarding/self-image');
  };

  // Generate tick marks (1 to 7)
  const ticks = [1, 2, 3, 4, 5, 6, 7];

  return (
    <LinearGradient colors={['#ffffff', '#fdfbfb', '#fdfbfb']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerTransparent}>
        <View style={styles.content}>
          <Text style={styles.question}>
            how heavy is the weight of what you keep postponing?
          </Text>
          
          <View style={styles.valueContainer}>
            <Text style={styles.valueNumber}>{guiltLevel}</Text>
            <Text style={styles.valueText}> / 7</Text>
          </View>

          <View style={styles.sliderContainer}>
            {/* The touchable area for the slider */}
            <View style={styles.sliderTrackTouchable} {...panResponder.panHandlers}>
              <View style={styles.sliderTrack}>
                
                {/* Tick marks */}
                <View style={styles.ticksContainer} pointerEvents="none">
                   {ticks.map((tick, index) => {
                     // Don't show tick mark where the thumb is (roughly) or where filled
                     const isFilled = index < guiltLevel;
                     return (
                       <View 
                         key={tick} 
                         style={[
                           styles.tick, 
                           { left: (index / 6) * trackWidth + thumbSize/2 - 4 },
                           isFilled && { backgroundColor: 'transparent' } // hide if under the orange fill
                         ]} 
                       />
                     );
                   })}
                </View>

                {/* Orange filled portion */}
                <Animated.View 
                  style={[
                    styles.sliderFill, 
                    { width: Animated.add(fillAnim, thumbSize/2) }
                  ]} 
                  pointerEvents="none"
                />
                
                {/* Thumb */}
                <Animated.View 
                  style={[
                    styles.thumb,
                    { transform: [{ translateX: fillAnim }] }
                  ]}
                  pointerEvents="none"
                />
              </View>
            </View>
            
            <View style={styles.labelsContainer}>
              <Text style={styles.labelText}>light</Text>
              <Text style={styles.labelText}>crushing</Text>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32 }}>
          <ContinueButton onPress={handleContinue} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  containerTransparent: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
    paddingBottom: 140,
  },
  question: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 32,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 40,
  },
  valueNumber: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 56,
    color: '#000000',
  },
  valueText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 24,
    color: '#000000',
    marginLeft: 8,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sliderTrackTouchable: {
    width: '100%',
    height: 40, // Larger touch target
    justifyContent: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    justifyContent: 'center',
  },
  ticksContainer: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tick: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
  },
  sliderFill: {
    position: 'absolute',
    height: 20,
    backgroundColor: '#fa8231', 
    borderRadius: 10,
  },
  thumb: {
    position: 'absolute',
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    top: -6, // (32 - 20) / 2
  },
  labelsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  labelText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#9ca3af',
  },
  bottomContainer: {
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  continueButton: {
    backgroundColor: '#fa8231',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16, // matching the slightly less rounded look
    width: '100%',
    alignItems: 'center',
  },
  continueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#ffffff',
  },
});
