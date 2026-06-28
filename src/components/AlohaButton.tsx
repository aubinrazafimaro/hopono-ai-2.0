import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/theme';

type AlohaButtonProps = {
  onPress: () => void;
  label: string;
  gradientColors?: readonly [string, string, string];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

/**
 * AlohaButton — The primary CTA of Hopono AI.
 *
 * Uses the Sunset gradient by default (#E86935 → #FF6B6B → #FF8E53).
 * Touch animation: scale 0.97 over 600ms ease-in-out. No bounce. Like a wave.
 */
export default function AlohaButton({
  onPress,
  label,
  gradientColors = ['#E86935', '#FF6B6B', '#FF8E53'],
  style,
  textStyle,
  disabled = false,
}: AlohaButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.wrapper,
          { transform: [{ scale }], opacity: disabled ? 0.5 : 1 },
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={[styles.label, textStyle]}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.button,
    overflow: 'hidden',
    shadowColor: '#E86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: SPACING.card,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...(TYPOGRAPHY.body as object),
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    textTransform: 'lowercase',
  },
});
