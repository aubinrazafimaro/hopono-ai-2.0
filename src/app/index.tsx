import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCheckIn, peaceStates, moodStates } from '@/context/CheckInContext';

// --- MOCK DATA ---
const currentMonth = 'june';

const practices = [
  { id: '21', title: '21 repetitions', desc: 'quick clearing', icon: 'water' },
  { id: '99', title: '99 repetitions', desc: 'deep cleaning', icon: 'leaf' },
  { id: '108', title: '108 repetitions', desc: 'sacred cycle', icon: 'infinite' },
  { id: 'custom', title: 'custom timer', desc: 'free flow', icon: 'time' },
];

export default function Home() {
  const { peaceIndex, moodIndex, history } = useCheckIn();
  const currentPeace = peaceStates[peaceIndex];
  const currentMood = moodStates[moodIndex];

  // Calendar: Last 30 days including today. history is index 0 = today, index 1 = yesterday.
  // We reverse to get chronological order (oldest first, today last).
  const calendarDays = history.slice(0, 30).reverse().map((dayData, i) => {
    const isToday = i === 29;
    const dayNum = new Date(dayData.date).getDate();

    // TODAY
    if (isToday) {
      return {
        day: dayNum,
        past: true,
        moodEmoji: currentMood.emoji,
        peaceEmoji: currentPeace.emoji,
      };
    }

    // Past days from context
    if (dayData.hasCheckIn) {
      return {
        day: dayNum,
        past: true,
        moodEmoji: moodStates[dayData.moodIndex].emoji,
        peaceEmoji: peaceStates[dayData.peaceIndex].emoji,
      };
    } else {
      // Missed day
      return {
        day: dayNum,
        past: false,
      };
    }
  });

  // State to track if we are showing 'mood' (true) or 'peace' (false)
  const [isMood, setIsMood] = useState(true);

  // Animation values
  const moodOpacity = useRef(new Animated.Value(1)).current;
  const peaceOpacity = useRef(new Animated.Value(0)).current;

  // No more automatic interval, the user will toggle it manually

  useEffect(() => {
    if (isMood) {
      Animated.timing(peaceOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start();
      Animated.timing(moodOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    } else {
      Animated.timing(moodOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start();
      Animated.timing(peaceOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }
  }, [isMood]);

  return (
    <LinearGradient 
      colors={['#ffd8c4', '#fff0e6', '#ffffff']} 
      locations={[0, 0.4, 1]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>aloha aubin</Text>
          <View style={styles.profilePlaceholder}>
            <Ionicons name="person" size={20} color="#e86935" />
          </View>
        </View>



        {/* TODAY CHECK-IN CARD */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => setIsMood(!isMood)}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            
            {/* Animated Emoji Box */}
            <View style={styles.emojiBox}>
              <Animated.Text style={[styles.bigEmoji, { opacity: moodOpacity }]}>
                {currentMood.emoji}
              </Animated.Text>
              <Animated.Text style={[styles.bigEmoji, styles.absoluteCenter, { opacity: peaceOpacity }]}>
                {currentPeace.emoji}
              </Animated.Text>
            </View>

            {/* Animated Texts */}
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                {/* Mood Title */}
                <Animated.Text style={[styles.cardTitle, { opacity: moodOpacity }]}>
                  {currentMood.text}
                </Animated.Text>
                {/* Peace Title */}
                <Animated.Text style={[styles.cardTitle, styles.absoluteText, { opacity: peaceOpacity }]}>
                  {currentPeace.text}
                </Animated.Text>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>today</Text>
                </View>
              </View>

              {/* Descriptions */}
              <View style={styles.descContainer}>
                <Animated.Text style={[styles.cardDesc, { opacity: moodOpacity }]}>
                  feeling {currentMood.text} today
                </Animated.Text>
                <Animated.Text style={[styles.cardDesc, styles.absoluteText, { opacity: peaceOpacity }]}>
                  peace is {currentPeace.text}
                </Animated.Text>
              </View>

              <TouchableOpacity 
                style={styles.editLink}
                onPress={() => router.push('/check-in-1')}
              >
                <Text style={styles.editLinkText}>edit check-in →</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>

        {/* MONTHLY CALENDAR PATTERNS */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <Animated.Text style={[styles.sectionTitle, { opacity: moodOpacity }]}>
              {currentMonth} mood
            </Animated.Text>
            <Animated.Text style={[styles.sectionTitle, styles.absoluteText, { opacity: peaceOpacity }]}>
              {currentMonth} peace
            </Animated.Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewCalendarText}>view calendar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {/* Days Header */}
          <View style={styles.calendarHeader}>
            {['m', 't', 'w', 't', 'f', 's', 's'].map((day, idx) => (
              <Text key={idx} style={styles.dayText}>{day}</Text>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, idx) => {
              if (!item.past) {
                // Future day
                return (
                  <View key={idx} style={styles.calCell}>
                    <View style={styles.emptyCircle} />
                    <Text style={styles.calDateText}>{item.day}</Text>
                  </View>
                );
              }

              // Past day with emoji
              return (
                <View key={idx} style={styles.calCell}>
                  <View style={styles.emojiCircle}>
                    <Animated.Text style={[styles.smallEmoji, { opacity: moodOpacity }]}>
                      {item.moodEmoji}
                    </Animated.Text>
                    <Animated.Text style={[styles.smallEmoji, styles.absoluteCenter, { opacity: peaceOpacity }]}>
                      {item.peaceEmoji}
                    </Animated.Text>
                  </View>
                  <Text style={styles.calDateText}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* PRACTICE CATALOG */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>practices</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {practices.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.practiceCard}
              onPress={() => {
                if (item.id === 'custom') {
                  router.push('/timer-setup');
                } else {
                  router.push(`/practice/${item.id}`);
                }
              }}
            >
              <View style={styles.practiceIconBox}>
                <Ionicons name={item.icon as any} size={26} color="#e86935" />
              </View>
              <Text style={styles.practiceTitle}>{item.title}</Text>
              <Text style={styles.practiceDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SHARE BUTTON */}
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={22} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.shareButtonText}>share with friends</Text>
        </TouchableOpacity>

        {/* Bottom padding */}
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
    color: '#1e293b', // Deep warm slate instead of harsh black
  },
  profilePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff1ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // More transparent glass
    borderRadius: 28,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15, // Much more visible shadow
    shadowRadius: 30,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 245, 240, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  bigEmoji: {
    fontSize: 48,
  },
  absoluteCenter: {
    position: 'absolute',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22, // Slightly larger
    color: '#1e293b',
  },
  absoluteText: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto', // pushes badge to right
  },
  badgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'lowercase',
  },
  descContainer: {
    height: 40, // fixed height to accommodate two absolute lines wrapping
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  editLink: {
    marginTop: 4,
  },
  editLinkText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#e86935',
    textTransform: 'lowercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    height: 24, // Keep height stable despite absolute title
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  viewCalendarText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#e86935',
    textTransform: 'lowercase',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dayText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#9ca3af',
    width: 30,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%', // 100/7
    alignItems: 'center',
    marginBottom: 16,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff5f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  smallEmoji: {
    fontSize: 20,
  },
  emptyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    marginBottom: 8,
  },
  calDateText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  horizontalScroll: {
    marginHorizontal: -20, // Negative margin to allow full bleed scroll
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  practiceCard: {
    width: 170, 
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // Glassmorphism
    borderRadius: 24,
    padding: 16,
    marginRight: 16,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12, // Visible shadow
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  practiceIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff5f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  practiceTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  practiceDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'lowercase',
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#e86935',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
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
});
