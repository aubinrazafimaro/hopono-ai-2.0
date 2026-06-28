import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ContinueButton from '@/components/ContinueButton';

export default function PainScreen() {
  const router = useRouter();
  
  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;
  const text3Opacity = useRef(new Animated.Value(0)).current;
  const text4Opacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(text1Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(text2Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(text3Opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(text4Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.delay(500),
    ]).start(() => {
      setShowBtn(true);
      Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    });
  }, []);

  return (
    <LinearGradient colors={['#ffffff', '#fff5f0', '#ffe8db']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>you are not the only one</Text>
          <Text style={styles.subtitle}>many are like you</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.Text style={[styles.bodyText, { opacity: text1Opacity }]}>
            don't you feel like your phone gets more attention than your inner well-being? or that you use your phone as an escape from what really hurts? like a shield against that thing that truly scares you? that responsibility you must face? or that business you need to launch?
          </Animated.Text>
          
          <Animated.Text style={[styles.bodyText, { opacity: text2Opacity }]}>
            know that you are not alone in this situation. thousands of people carry hidden pain or a massive responsibility they dare not assume, using social media as a refuge to numb the pain, hoping it passes with time
          </Animated.Text>

          <Animated.Text style={[styles.bodyText, { opacity: text3Opacity }]}>
            except that with time, these pains only accumulate and add to the remorse of having done nothing, and they will never disappear
          </Animated.Text>

          <Animated.Text style={[styles.bodyText, { opacity: text4Opacity, fontFamily: 'Nunito_700Bold', color: '#e86935', fontSize: 20 }]}>
            don't you think it's time to put an end to all this?
          </Animated.Text>
        </ScrollView>
        {showBtn && (
          <Animated.View style={{ opacity: btnOpacity, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <ContinueButton onPress={() => router.push('/onboarding/savior')} />
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 32,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#e86935',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#4b5563', // dark gray
  },
  content: {
    flexGrow: 1,
    marginTop: 40,
    paddingBottom: 140,
    gap: 32,
  },
  bodyText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#4b5563',
    lineHeight: 28,
  },
});
