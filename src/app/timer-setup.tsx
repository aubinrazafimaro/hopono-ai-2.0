import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TimerSetupScreen() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  const applyPreset = (m: number) => {
    setMinutes(m);
    setSeconds(0);
  };

  const startPractice = () => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 0) {
      router.push(`/practice/custom?time=${totalSeconds}`);
    }
  };

  // Generate arrays for minutes (0-60) and seconds (0-59)
  const minutesArray = Array.from({ length: 61 }, (_, i) => i);
  const secondsArray = Array.from({ length: 60 }, (_, i) => i);

  return (
    <LinearGradient 
      colors={['#ffd8c4', '#fff0e6', '#ffffff']} 
      locations={[0, 0.4, 1]}
      style={styles.safeArea}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <SimpleLineIcons name="arrow-left" size={24} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.title}>set your time</Text>
          <View style={{ width: 28 }} /> {/* Spacer to center title */}
        </View>

        {/* PRESETS */}
        <View style={styles.presetContainer}>
          {[3, 6, 9].map((m) => (
            <TouchableOpacity 
              key={m} 
              style={[styles.presetBtn, minutes === m && seconds === 0 && styles.presetBtnActive]}
              onPress={() => applyPreset(m)}
            >
              <Text style={[styles.presetText, minutes === m && seconds === 0 && styles.presetTextActive]}>
                {m} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TIME MACHINE (PICKER) */}
        <View style={styles.pickerContainer}>
          {/* Minutes Picker */}
          <View style={styles.pickerColumn}>
            <Picker
              selectedValue={minutes}
              onValueChange={(itemValue) => setMinutes(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {minutesArray.map((m) => (
                <Picker.Item key={`m-${m}`} label={m.toString().padStart(2, '0')} value={m} />
              ))}
            </Picker>
            <Text style={styles.pickerLabel}>min</Text>
          </View>

          <Text style={styles.pickerColon}>:</Text>

          {/* Seconds Picker */}
          <View style={styles.pickerColumn}>
            <Picker
              selectedValue={seconds}
              onValueChange={(itemValue) => setSeconds(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {secondsArray.map((s) => (
                <Picker.Item key={`s-${s}`} label={s.toString().padStart(2, '0')} value={s} />
              ))}
            </Picker>
            <Text style={styles.pickerLabel}>sec</Text>
          </View>
        </View>

        {/* START BUTTON */}
        <TouchableOpacity style={styles.button} onPress={startPractice}>
          <Text style={styles.buttonText}>start practice</Text>
        </TouchableOpacity>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#334155',
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  presetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  presetBtnActive: {
    backgroundColor: '#e86935', // Warm orange
    borderColor: '#e86935',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  presetText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  presetTextActive: {
    color: '#ffffff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 40,
  },
  pickerColumn: {
    alignItems: 'center',
    width: 100,
  },
  picker: {
    width: 120,
    height: 200,
  },
  pickerItem: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 32,
    color: '#334155',
  },
  pickerLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#94a3b8',
    marginTop: -20,
  },
  pickerColon: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 32,
    color: '#cbd5e1',
    marginHorizontal: 10,
    marginTop: -40,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 18,
    borderRadius: 30,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#e86935',
  },
});
