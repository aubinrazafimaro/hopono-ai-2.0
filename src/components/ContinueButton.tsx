import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, StyleProp, ViewStyle, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ContinueButtonProps {
  onPress: () => void;
  text?: string;
  style?: StyleProp<ViewStyle>;
  color?: string;
  textColor?: string;
  withGradient?: boolean;
  hideIcon?: boolean;
  disabled?: boolean;
}

export default function ContinueButton({ 
  onPress, 
  text = 'continue', 
  style, 
  color = '#e86935',
  textColor = '#ffffff',
  withGradient = true,
  hideIcon = false,
  disabled = false
}: ContinueButtonProps) {
  const button = (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: color, shadowColor: color }, 
        disabled && { opacity: 0.5 },
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      {!hideIcon && (
        <Ionicons name="arrow-forward" size={20} color={textColor} style={styles.icon} />
      )}
    </TouchableOpacity>
  );

  return <View style={styles.buttonWrapper}>{button}</View>;
}

const styles = StyleSheet.create({
  buttonWrapper: {
    paddingHorizontal: 32,
    paddingBottom: 40, // consistent spacing across all screens
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 100, // perfect pill shape
    width: '100%',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  text: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    lineHeight: 20,
    textTransform: 'lowercase',
  },
  icon: {
    marginLeft: 8,
  }
});
