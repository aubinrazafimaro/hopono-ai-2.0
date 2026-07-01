import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Share } from 'lucide-react-native'; // Import Share icon from lucide-react-native to maintain absolute consistency
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCheckIn, peaceStates, moodStates } from '../context/CheckInContext';
import { useAppTheme } from '@/context/AppThemeContext';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32; // 16px padding on both sides

export default function Insights() {
  const { getAverages, selectedPeriod, setSelectedPeriod, history, peaceIndex, moodIndex } = useCheckIn();
  const { themeName, palette } = useAppTheme();
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  // Fetch data for the selected period
  const stats = getAverages(selectedPeriod);

  // Round averages to get the closest state
  const roundedPeace = Math.round(stats.avgPeace);
  const roundedMood = Math.round(stats.avgMood);

  const currentPeaceState = peaceStates[roundedPeace];
  const currentMoodState = moodStates[roundedMood];

  const currentPeace = peaceStates[peaceIndex];
  const currentMood  = moodStates[moodIndex];
  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()).toLowerCase();

  // ── Standard Calendar Layout Calculation ──
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const startOffset = startWeekday === 0 ? 6 : startWeekday - 1; // Align Mon-Sun grid

  const totalDays = new Date(year, month + 1, 0).getDate();

  // Create standard calendar cells
  const calendarCells = [];
  // Empty offset days at start
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({ key: `empty-${i}`, type: 'empty' });
  }

  // Active days of the month
  for (let day = 1; day <= totalDays; day++) {
    const cellDate = new Date(year, month, day);
    const dateStr = cellDate.toISOString().split('T')[0];
    const isToday = day === now.getDate();
    
    // Find check-in data in history
    const dayData = history.find((h) => h.date.startsWith(dateStr));
    
    if (isToday) {
      calendarCells.push({
        key: `day-${day}`,
        type: 'day',
        dayNum: day,
        hasCheckIn: true,
        moodEmoji: currentMood.emoji,
        peaceEmoji: currentPeace.emoji,
        isToday: true
      });
    } else if (dayData && dayData.hasCheckIn) {
      calendarCells.push({
        key: `day-${day}`,
        type: 'day',
        dayNum: day,
        hasCheckIn: true,
        moodEmoji: moodStates[dayData.moodIndex].emoji,
        peaceEmoji: peaceStates[dayData.peaceIndex].emoji,
        isToday: false
      });
    } else {
      calendarCells.push({
        key: `day-${day}`,
        type: 'day',
        dayNum: day,
        hasCheckIn: false,
        isToday: false
      });
    }
  }

  const [isMood, setIsMood] = useState(true);
  const moodOpacity  = useRef(new Animated.Value(1)).current;
  const peaceOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMood((prev) => !prev);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMood) {
      Animated.timing(peaceOpacity, { toValue: 0, duration: 600, useNativeDriver: true }).start();
      Animated.timing(moodOpacity,  { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      Animated.timing(moodOpacity,  { toValue: 0, duration: 600, useNativeDriver: true }).start();
      Animated.timing(peaceOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [isMood]);

  // Time Saved calculation formatted as hours and minutes (consistent with settings screen)
  const totalHours = stats.totalSessions * 0.5;
  const hoursVal = Math.floor(totalHours);
  const minsVal = Math.round((totalHours % 1) * 60);
  const timeSavedString = minsVal > 0 ? `${hoursVal}h ${minsVal}m` : `${hoursVal}h`;

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

  // Generate progress trend
  const generateHealingTrend = (finalValue: number) => {
    const data = [];
    let current = Math.max(0, finalValue - 1.5); 
    const step = (finalValue - current) / 6;
    
    for (let i = 0; i < 6; i++) {
      data.push(current);
      const noise = (Math.random() * 0.4) - 0.1;
      current += step + noise;
    }
    data.push(finalValue);
    return data;
  };

  // Generate cumulative data for Time Saved
  const generateCumulativeData = (total: number) => {
    const data = [0];
    let current = 0;
    const step = total / 6;
    for (let i = 1; i < 6; i++) {
      current += step * (0.5 + Math.random());
      data.push(current);
    }
    data.push(total);
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
      r: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0,0,0,0.03)',
    }
  };

  // 3 Charts Config (Terminologies changed to 'harmony' and 'rhythm' to match check-ins)
  const charts = [
    {
      title: 'harmony evolution',
      data: generateHealingTrend(roundedPeace),
      color: '#e86935',
    },
    {
      title: 'rhythm progression',
      data: generateHealingTrend(roundedMood),
      color: '#0abfbc',
    },
    {
      title: 'time saved (hours)',
      data: generateCumulativeData(stats.totalSessions * 0.5),
      color: '#eab308',
    }
  ];

  const getXLabels = (days: number) => {
    switch (days) {
      case 7:
        return ['0h', '4h', '8h', '12h', '16h', '20h', '24h'];
      case 30:
        return ['1', '5', '10', '15', '20', '25', '30'];
      case 90:
        return ['w1', 'w3', 'w5', 'w7', 'w9', 'w11', 'w13'];
      case 365:
        return ['jan', 'mar', 'may', 'jul', 'sep', 'nov', 'dec'];
      default:
        return ['1', '2', '3', '4', '5', '6', '7'];
    }
  };

  const chartLabels = getXLabels(selectedPeriod);

  return (
    <LinearGradient 
      colors={[palette.gradientTop, palette.gradientMid, palette.gradientBot]} 
      locations={[0, 0.4, 1]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
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
                    {period.label.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 2x2 Grid (Translucent unified card blocks) */}
          <View style={styles.grid}>
            
            {/* Card 1: Streak */}
            <View style={[styles.card, { shadowColor: palette.primary }]}>
              <Text style={styles.cardEmoji}>🥳</Text>
              <Text style={[styles.cardNumber, { color: '#e86935' }]}>{stats.streak}</Text>
              <Text style={styles.cardTitle}>current streak</Text>
              <Text style={styles.cardSubtitle}>days</Text>
            </View>

            {/* Card 2: Time Saved (Properly formatted) */}
            <View style={[styles.card, { shadowColor: palette.primary }]}>
              <Text style={styles.cardEmoji}>⏳</Text>
              <Text style={[styles.cardNumber, { color: '#0abfbc' }]}>{timeSavedString}</Text>
              <Text style={styles.cardTitle}>time saved</Text>
              <Text style={styles.cardSubtitle}>hours</Text>
            </View>

            {/* Card 3: Avg Harmony (Terminologies aligned to 'harmony' and dynamic color applied to numbers) */}
            <View style={[styles.card, { shadowColor: palette.primary }]}>
              <Text style={styles.cardEmoji}>{currentPeaceState.emoji}</Text>
              <Text style={[styles.cardNumber, { color: currentPeaceState.color }]}>
                {stats.avgPeace.toFixed(1)}
              </Text>
              <Text style={styles.cardTitle}>avg harmony</Text>
              <Text style={[styles.cardSubtitle, { color: currentPeaceState.color }]}>
                {currentPeaceState.text.toLowerCase()}
              </Text>
            </View>

            {/* Card 4: Avg Rhythm (Terminologies aligned to 'rhythm' and dynamic color applied to numbers) */}
            <View style={[styles.card, { shadowColor: palette.primary }]}>
              <Text style={styles.cardEmoji}>{currentMoodState.emoji}</Text>
              <Text style={[styles.cardNumber, { color: currentMoodState.color }]}>
                {stats.avgMood.toFixed(1)}
              </Text>
              <Text style={styles.cardTitle}>avg rhythm</Text>
              <Text style={[styles.cardSubtitle, { color: currentMoodState.color }]}>
                {currentMoodState.text.toLowerCase()}
              </Text>
            </View>

          </View>

          {/* CHART CAROUSEL (Translucent backdrop block) */}
          <View style={[styles.chartSection, { shadowColor: palette.primary }]}>
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
                        strokeWidth: 4
                      }]
                    }}
                    width={screenWidth - 32}
                    height={180}
                    yAxisLabel=""
                    yAxisSuffix=""
                    segments={5}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => chart.color,
                      fillShadowGradient: chart.color,
                      fillShadowGradientOpacity: 0.3,
                    }}
                    bezier
                    style={{
                      paddingRight: 32,
                      paddingLeft: 10,
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

          {/* ── MONTHLY CALENDAR (Moved from Home to Insights) ── */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleRow}>
              <Animated.Text style={[styles.sectionTitle, { color: palette.textMuted, opacity: moodOpacity }]}>
                rhythm of {currentMonthName}
              </Animated.Text>
              <Animated.Text style={[styles.sectionTitle, styles.absoluteText, { color: palette.textMuted, opacity: peaceOpacity }]}>
                harmony of {currentMonthName}
              </Animated.Text>
            </View>
            <TouchableOpacity onPress={() => setIsMood(!isMood)}>
              <Text style={[styles.viewCalendarText, { color: palette.primary }]}>toggle view</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.calendarSubText, { color: palette.textMuted }]}>
            every day is a new step towards your inner peace. 🌺
          </Text>

          <View style={[styles.calendarCard, { backgroundColor: 'rgba(255, 255, 255, 0.65)', borderColor: 'rgba(255, 255, 255, 0.95)' }]}>
            <View style={styles.calendarHeader}>
              {['m','t','w','t','f','s','s'].map((day, idx) => (
                <Text key={idx} style={[styles.dayText, { color: palette.textMuted }]}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarCells.map((item) => {
                if (item.type === 'empty') {
                  return (
                    <View key={item.key} style={styles.calCell}>
                      <View style={[styles.emptyCircle, { backgroundColor: 'transparent' }]} />
                    </View>
                  );
                }
                
                if (!item.hasCheckIn) {
                  return (
                    <View key={item.key} style={styles.calCell}>
                      <View style={[styles.emptyCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
                      <Text style={[styles.calDateText, { color: palette.textMuted }]}>{item.dayNum}</Text>
                    </View>
                  );
                }
                
                return (
                  <View key={item.key} style={styles.calCell}>
                    <View style={[styles.emojiCircle, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                      <Animated.Text style={[styles.smallEmoji, { opacity: moodOpacity }]}>
                        {item.moodEmoji}
                      </Animated.Text>
                      <Animated.Text style={[styles.smallEmoji, styles.absoluteCenter, { opacity: peaceOpacity }]}>
                        {item.peaceEmoji}
                      </Animated.Text>
                    </View>
                    <Text style={[styles.calDateText, { color: palette.textMuted }]}>{item.dayNum}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* SHARE BUTTON (Using lucide Share icon to ensure consistency) */}
          <TouchableOpacity style={styles.shareButton}>
            <Share size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.shareButtonText}>share your progress</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#334155',
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  headerSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#64748b',
    textTransform: 'lowercase',
  },
  timeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  timeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  timeTabActive: {
    backgroundColor: '#e86935',
  },
  timeTabText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#94a3b8',
  },
  timeTabTextActive: {
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardNumber: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#334155',
    fontSize: 13,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  cardSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    textTransform: 'lowercase',
  },

  // Chart
  chartSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 32,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
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
    fontSize: 15,
    textTransform: 'lowercase',
  },
  chartSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#94a3b8',
    fontSize: 13,
    textTransform: 'lowercase',
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
    backgroundColor: '#e86935',
  },

  // Share Button
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#e86935',
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
    textTransform: 'lowercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    height: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    textTransform: 'lowercase',
    letterSpacing: 1.2,
  },
  calendarSubText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 16,
    textTransform: 'lowercase',
  },
  viewCalendarText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    textTransform: 'lowercase',
  },
  calendarCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 16,
    marginBottom: 32,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dayText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    width: 30,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%',
    alignItems: 'center',
    marginBottom: 12,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  smallEmoji: {
    fontSize: 20,
  },
  emptyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 6,
  },
  calDateText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
  },
  absoluteCenter: {
    position: 'absolute',
  },
  absoluteText: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
