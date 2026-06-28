import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Light Hawaiian Sky tab bar
const ACCENT     = '#0ABFBC'; // Ocean turquoise accent
const TEXT_MUTED = '#9CA3AF'; // Muted gray

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: TEXT_MUTED,
        tabBarStyle: {
          position: 'absolute', // Absolute positioning so page gradients show through
          borderTopWidth: 0, // Removed border line completely to avoid visual rupture
          elevation: 0, // Removed Android shadow
          shadowOpacity: 0, // Removed iOS shadow
          height: Platform.OS === 'ios' ? 72 : 54,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 6,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.98)']}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontFamily: 'Nunito_600SemiBold',
          textTransform: 'lowercase',
          fontSize: 11,
        },
        headerShown: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'home',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'insights',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🌊</Text>,
        }}
      />
      <Tabs.Screen
        name="lock-list"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'mālama',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🌺</Text>,
        }}
      />
      <Tabs.Screen
        name="check-in-1"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="check-in-2"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="practice/[id]"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="timer-setup"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="time-saved"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="completion"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
