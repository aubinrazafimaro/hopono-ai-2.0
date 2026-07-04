import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OnboardingBackButtonProps {
  light?: boolean;
}

export default function OnboardingBackButton({ light = false }: OnboardingBackButtonProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Dynamic top positioning to account for safe area
  const topPos = insets.top > 0 ? insets.top + 8 : 16;

  return (
    <TouchableOpacity
      style={[
        styles.backButton, 
        { 
          top: topPos,
          backgroundColor: light ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)'
        }
      ]}
      onPress={() => router.back()}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="chevron-back" 
        size={24} 
        color={light ? '#ffffff' : '#1f2937'} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
