import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import { router, useLocalSearchParams } from 'expo-router';
import { useCheckIn, moodStates as states } from '@/context/CheckInContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckInStep2() {
  const { moodIndex, setMoodIndex } = useCheckIn();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [sliderValue, setSliderValue] = useState(moodIndex);
  const animatedValue = useRef(new Animated.Value(moodIndex)).current;

  // Whenever the slider moves, animate the background color
  const handleValueChange = (val: number) => {
    const index = Math.round(val);
    setSliderValue(index);
    
    Animated.timing(animatedValue, {
      toValue: val,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  // Aligned exactly to the moodStates colors defined in CheckInContext
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [
      '#7f1d1d', // carrying a lot
      '#9a3412', // struggling
      '#ca8a04', // holding on
      '#0d9488', // breathing easier
      '#0891b2', // at peace
    ],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [
      '#ffffff', // White on dark red
      '#ffffff', // White on burnt orange
      '#333333', // Dark text on warm yellow (holding on)
      '#ffffff', // White on teal (breathing easier)
      '#ffffff', // White on cyan (at peace)
    ],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* TOP TITLE */}
        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, { color: textColor }]}>
            how are you{'\n'}feeling today?
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
            step={0.1}
            value={2}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#ffffff"
          />
        </View>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity 
          style={styles.button}
          onPress={async () => {
            setMoodIndex(sliderValue);
            try {
              const todayStr = new Date().toISOString().split('T')[0];
              await AsyncStorage.setItem('@last_checkin_date', todayStr);
            } catch (err) {
              console.warn('Failed to save check-in date:', err);
            }
            if (from === 'ritual') {
              let reps = 3;
              try {
                const storedPlan = await AsyncStorage.getItem('@hopono_healing_plan');
                if (storedPlan) {
                  const plan = JSON.parse(storedPlan);
                  if (plan.morningReps) reps = plan.morningReps;
                }
              } catch (e) {
                console.warn('Failed to read morning reps from storage', e);
              }
              router.replace(`/practice/${reps}?type=morning`);
            } else {
              router.push('/');
            }
          }}
        >
          <Animated.Text style={[styles.buttonText, { color: backgroundColor }]}>
            continue
          </Animated.Text>
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
    width: '78%',
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
    textTransform: 'lowercase',
  },
});
