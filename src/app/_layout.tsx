import { DefaultTheme, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { CheckInProvider } from '@/context/CheckInContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [loaded, error] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <CheckInProvider>
      <ThemeProvider value={DefaultTheme}>
        <AppTabs />
        {/* We overlay the AnimatedSplashOverlay on top of the first screen to create a seamless transition */}
        <AnimatedSplashOverlay />
      </ThemeProvider>
    </CheckInProvider>
  );
}
