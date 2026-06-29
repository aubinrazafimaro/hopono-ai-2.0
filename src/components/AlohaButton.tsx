import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AlohaButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AlohaButtonProps {
  onPress: () => void;
  text: string;
  variant?: AlohaButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export default function AlohaButton({
  onPress,
  text,
  variant = 'primary',
  disabled = false,
  style,
  icon,
}: AlohaButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const renderButton = () => {
    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={['#FF8C5A', '#e86935']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <View style={styles.contentRow}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, styles.textWhite]}>{text}</Text>
          </View>
        </LinearGradient>
      );
    }

    if (variant === 'secondary') {
      return (
        <View style={[styles.button, styles.buttonSecondary]}>
          <View style={styles.contentRow}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, styles.textOrange]}>{text}</Text>
          </View>
        </View>
      );
    }

    if (variant === 'ghost') {
      return (
        <View style={[styles.button, styles.buttonGhost]}>
          <View style={styles.contentRow}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, styles.textWhite]}>{text}</Text>
          </View>
        </View>
      );
    }
  };

  const bottomPadding = insets.bottom > 0 ? insets.bottom + 10 : 20;

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }, style]}>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }], width: '100%' }, disabled && { opacity: 0.4 }]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={disabled}
        >
          {renderButton()}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  buttonGhost: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowOpacity: 0,
    elevation: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    textTransform: 'lowercase',
  },
  textWhite: {
    color: '#ffffff',
  },
  textOrange: {
    color: '#e86935',
  },
});
