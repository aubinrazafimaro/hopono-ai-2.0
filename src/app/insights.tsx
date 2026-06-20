import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';
import { useCheckIn, peaceStates, moodStates } from '../context/CheckInContext';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32; // 16px padding on both sides

export default function Insights() {
  const { getAverages, selectedPeriod, setSelectedPeriod } = useCheckIn();
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  // Fetch data for the selected period
  const stats = getAverages(selectedPeriod);

  // Round averages to get the closest state
  const roundedPeace = Math.round(stats.avgPeace);
  const roundedMood = Math.round(stats.avgMood);

  const currentPeaceState = peaceStates[roundedPeace];
  const currentMoodState = moodStates[roundedMood];

  // Using 30 mins per session for the metric
  const totalHours = stats.totalSessions * 0.5;

  const periods = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '3M', days: 90 },
    { label: '1Y', days: 365 },
  ];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / chartWidth);
    if (index !== currentChartIndex) {
      setCurrentChartIndex(index);
    }
  };

  // Generate a psychologically rewarding "healing trend" for Mood and Peace
  const generateHealingTrend = (finalValue: number) => {
    const data = [];
    // Start slightly lower in the past to show a satisfying progression
    let current = Math.max(0, finalValue - 1.5); 
    const step = (finalValue - current) / 6;
    
    for (let i = 0; i < 6; i++) {
      data.push(current);
      // Add very slight organic noise, but mostly keep it trending upwards
      const noise = (Math.random() * 0.4) - 0.1;
      current += step + noise;
    }
    data.push(finalValue); // End exactly on the current average today
    return data;
  };

  // Generate cumulative data for Time Saved (strictly increasing)
  const generateCumulativeData = (total: number) => {
    const data = [0];
    let current = 0;
    const step = total / 6;
    for (let i = 1; i < 6; i++) {
      current += step * (0.5 + Math.random());
      data.push(current);
    }
    data.push(total);
    // Sort to guarantee strictly increasing accumulation
    return data.sort((a, b) => a - b);
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1, 
    color: (opacity = 1) => `rgba(232, 105, 53, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0', // Hide dots for a smooth pure curve
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: 'rgba(0,0,0,0.03)',
    }
  };

  // 3 Charts Config
  const charts = [
    {
      title: 'inner peace evolution',
      data: generateHealingTrend(roundedPeace),
      color: '#e86935', // Orange for Inner Peace
    },
    {
      title: 'mood progression',
      data: generateHealingTrend(roundedMood),
      color: '#0891b2', // Cyan for Mood
    },
    {
      title: 'time saved (hours)',
      data: generateCumulativeData(stats.totalSessions * 0.5),
      color: '#eab308', // Yellow for Time Saved
    }
  ];

  // Generate dynamic X-axis labels based on period
  const getXLabels = (days: number) => {
    switch (days) {
      case 7:
        // 7D -> Heures (e.g., progression in a typical day or segments of hours)
        return ['0h', '4h', '8h', '12h', '16h', '20h', '24h'];
      case 30:
        // 30D -> Jours
        return ['1', '5', '10', '15', '20', '25', '30'];
      case 90:
        // 3M -> Semaines (Weeks)
        return ['W1', 'W3', 'W5', 'W7', 'W9', 'W11', 'W13'];
      case 365:
        // 1Y -> Mois
        return ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'];
      default:
        return ['1', '2', '3', '4', '5', '6', '7'];
    }
  };

  const chartLabels = getXLabels(selectedPeriod);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>your journey</Text>
          <Text style={styles.headerSubtitle}>tracking your focus progress</Text>
        </View>

        {/* Time Selector */}
        <View style={styles.timeSelector}>
          {periods.map((period) => {
            const isActive = period.days === selectedPeriod;
            return (
              <TouchableOpacity 
                key={period.label} 
                style={[styles.timeTab, isActive && styles.timeTabActive]}
                onPress={() => setSelectedPeriod(period.days)}
              >
                <Text style={[styles.timeTabText, isActive && styles.timeTabTextActive]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2x2 Grid */}
        <View style={styles.grid}>
          
          {/* Card 1: Streak */}
          <View style={[styles.card, { backgroundColor: '#e86935' }]}>
            <Text style={styles.cardEmoji}>🥳</Text>
            <Text style={styles.cardNumber}>{stats.streak}</Text>
            <Text style={styles.cardTitle}>current streak</Text>
            <Text style={styles.cardSubtitle}>days</Text>
          </View>

          {/* Card 2: Time Saved (Total Focus) */}
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#5ba4e6' }]}
            onPress={() => router.push('/time-saved')}
            activeOpacity={0.8}
          >
            <Text style={styles.cardEmoji}>⏳</Text>
            <Text style={styles.cardNumber}>{(stats.totalSessions * 0.5).toFixed(1)}</Text>
            <Text style={styles.cardTitle}>time saved</Text>
            <Text style={styles.cardSubtitle}>hours</Text>
          </TouchableOpacity>

          {/* Card 3: Avg Inner Peace */}
          <View style={[styles.card, { backgroundColor: currentPeaceState.color }]}>
            <Text style={styles.cardEmoji}>{currentPeaceState.emoji}</Text>
            <Text style={styles.cardNumber}>{stats.avgPeace.toFixed(1)}</Text>
            <Text style={[styles.cardTitle, { textAlign: 'center' }]}>avg inner peace</Text>
            <Text style={styles.cardSubtitle}>{currentPeaceState.text}</Text>
          </View>

          {/* Card 4: Avg Mood */}
          <View style={[styles.card, { backgroundColor: currentMoodState.color }]}>
            <Text style={styles.cardEmoji}>{currentMoodState.emoji}</Text>
            <Text style={styles.cardNumber}>{stats.avgMood.toFixed(1)}</Text>
            <Text style={styles.cardTitle}>avg mood</Text>
            <Text style={styles.cardSubtitle}>{currentMoodState.text}</Text>
          </View>

        </View>

        {/* CHART CAROUSEL */}
        <View style={styles.chartSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {charts.map((chart, index) => (
              <View key={index} style={{ width: chartWidth }}>
                <View style={styles.chartHeader}>
                  <Text style={[styles.chartTitle, { color: chart.color }]}>{chart.title}</Text>
                  <Text style={styles.chartSubtitle}>last {selectedPeriod} days</Text>
                </View>
                
                <LineChart
                  data={{
                    labels: chartLabels,
                    datasets: [{ 
                      data: chart.data,
                      strokeWidth: 4 // Thicker, more premium line
                    }]
                  }}
                  width={screenWidth - 32} // Match container width
                  height={180}
                  yAxisLabel=""
                  yAxisSuffix=""
                  segments={5} // More segments for smaller steps
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => chart.color, // Dynamically use the chart's theme color
                    fillShadowGradient: chart.color, // Use theme color for the gradient under the curve
                    fillShadowGradientOpacity: 0.3, // Soft gradient opacity
                  }}
                  bezier // Smooth curves!
                  style={{
                    paddingRight: 32, // Padding so the rightmost label doesn't get cut
                    paddingLeft: 10, // Padding to prevent Y-axis from being cut off
                    borderRadius: 16,
                  }}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withInnerLines={true}
                  withOuterLines={false}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  withShadow={true}
                  transparent={true}
                />
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {charts.map((_, i) => (
              <View 
                key={i} 
                style={[styles.dot, currentChartIndex === i && styles.dotActive]} 
              />
            ))}
          </View>
        </View>

        {/* SHARE BUTTON */}
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share" size={22} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.shareButtonText}>share your progress</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  timeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  timeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  timeTabActive: {
    backgroundColor: '#e86935',
  },
  timeTabText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#9ca3af',
  },
  timeTabTextActive: {
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    width: '48%',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardNumber: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 36,
    color: '#ffffff',
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Nunito_600SemiBold',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  cardSubtitle: {
    fontFamily: 'Nunito_400Regular',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },

  // Chart
  chartSection: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  chartSubtitle: {
    fontFamily: 'Nunito_400Regular',
    color: '#9ca3af',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 12,
    backgroundColor: '#e86935', // Accent color
  },

  // Share Button
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#e86935', // Orange accent color
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#ffffff',
  },
});
