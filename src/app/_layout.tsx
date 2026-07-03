import { DefaultTheme, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { CheckInProvider } from '@/context/CheckInContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { UserProvider } from '@/context/UserContext';
import { AppThemeProvider } from '@/context/AppThemeContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [loaded, error] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasCompletedOnboarding');
        const isCompleted = value === 'true';
        setHasCompletedOnboarding(isCompleted);
        
        if (!isCompleted) {
          router.replace('/onboarding');
        }
      } catch (e) {
        setHasCompletedOnboarding(false);
        router.replace('/onboarding');
      }
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      if (hasCompletedOnboarding !== null) {
        SplashScreen.hideAsync();
      }
    }
  }, [loaded, error, hasCompletedOnboarding]);

  if (!loaded && !error) {
    return null;
  }

  if (hasCompletedOnboarding === null) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }

  return (
    <AppThemeProvider>
      <UserProvider>
        <CheckInProvider>
        <OnboardingProvider>
          <ThemeProvider value={DefaultTheme}>
            <AppTabs />
            {/* We overlay the AnimatedSplashOverlay on top of the first screen to create a seamless transition */}
            <AnimatedSplashOverlay />
          </ThemeProvider>
        </OnboardingProvider>
      </CheckInProvider>
    </UserProvider>
    </AppThemeProvider>
  );
}
