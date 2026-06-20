import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useCheckIn, peaceStates as states } from '@/context/CheckInContext';

export default function CheckInStep1() {
  const { peaceIndex, setPeaceIndex } = useCheckIn();
  const [sliderValue, setSliderValue] = useState(peaceIndex);
  const animatedValue = useRef(new Animated.Value(peaceIndex)).current;

  // Whenever the slider moves, animate the background color
  const handleValueChange = (val: number) => {
    // Snap to nearest integer
    const index = Math.round(val);
    setSliderValue(index);
    
    Animated.timing(animatedValue, {
      toValue: val,
      duration: 100,
      useNativeDriver: false, // Colors don't support native driver
    }).start();
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [
      '#1e293b', // Heavy dark blue/slate
      '#64748b', // Muted slate
      '#e2e8f0', // Neutral light gray/beige
      '#fdb878', // Warm peach
      '#e86935', // Vibrant aligned orange
    ],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [
      '#ffffff', // White on dark
      '#ffffff', // White on slate
      '#333333', // Dark text on light gray
      '#ffffff', // White on peach
      '#ffffff', // White on orange
    ],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* TOP TITLE */}
        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, { color: textColor }]}>
            how connected to your{'\n'}inner peace do you feel today?
          </Animated.Text>
        </View>

        {/* EMOJI & TEXT */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{states[sliderValue].emoji}</Text>
          <Animated.Text style={[styles.stateText, { color: textColor }]}>
            {states[sliderValue].text}
          </Animated.Text>
        </View>

        {/* SLIDER */}
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={4}
            step={0.1} // Smooth sliding, we snap the state but slide smoothly
            value={2} // Default middle
            onValueChange={handleValueChange}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#ffffff"
          />
        </View>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            setPeaceIndex(sliderValue);
            router.push('/check-in-2');
          }}
        >
          <Text style={styles.buttonText}>continue</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    textTransform: 'lowercase',
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 100,
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
  },
  slider: {
    width: '85%',
    height: 40,
  },
  stateText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    marginTop: 16,
    textTransform: 'lowercase',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 30,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#e86935',
    textTransform: 'lowercase',
  },
});
