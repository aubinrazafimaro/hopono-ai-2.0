import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/context/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Removed obtrusive default header back button
          gestureEnabled: true, // Enable native swipe gesture to slide pages backward
          animation: 'fade', // Smooth transitions between questions
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="pain" />
        <Stack.Screen name="savior" />
        <Stack.Screen name="presentation" />
        <Stack.Screen name="screentime" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="guilt" />
        <Stack.Screen name="self-image" />
        <Stack.Screen name="obstacles" />
        <Stack.Screen name="deep-pain" />
        <Stack.Screen name="reassurance" />
        <Stack.Screen name="recap" />
        <Stack.Screen name="final-recap" />
      </Stack>
    </OnboardingProvider>
  );
}
