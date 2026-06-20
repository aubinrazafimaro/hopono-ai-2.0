import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useCheckIn } from '@/context/CheckInContext';

// Helper component for Settings Item
const SettingsItem = ({ 
  icon, 
  title, 
  iconBgColor, 
  iconColor, 
  onPress, 
  isLast = false,
  rightElement
}: { 
  icon: any, 
  title: string, 
  iconBgColor: string, 
  iconColor: string, 
  onPress?: () => void,
  isLast?: boolean,
  rightElement?: React.ReactNode
}) => (
  <TouchableOpacity 
    style={[styles.itemContainer, isLast && styles.itemContainerLast]} 
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View style={styles.itemLeft}>
      <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={styles.itemTitle}>{title}</Text>
    </View>
    {rightElement ? rightElement : <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { getAverages } = useCheckIn();
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isBlockerActive, setIsBlockerActive] = useState(false);
  
  useEffect(() => {
    import('expo-app-blocker').then(({ getPermissionStatus }) => {
      getPermissionStatus().then((status) => {
        setHasPermissions(status.allGranted);
      }).catch(console.warn);
    }).catch(console.warn);
  }, []);

  const handleToggleBlocker = async (value: boolean) => {
    try {
      const { requestPermissions } = await import('expo-app-blocker');
      if (value && !hasPermissions) {
        const result = await requestPermissions();
        setHasPermissions(result.allGranted);
        if (!result.allGranted) return;
      }
      setIsBlockerActive(value);
    } catch (e) {
      console.warn("App Blocker is not available. Please compile the native app.", e);
    }
  };
  
  // Lifetime stats for settings overview
  const lifetimeStats = getAverages(365);
  
  // Convert sessions to hours (0.5 hours per session for mockup)
  const totalHours = lifetimeStats.totalSessions * 0.5;
  const hours = Math.floor(totalHours);
  const mins = (totalHours % 1) * 60;
  const timeSavedString = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;

  return (
    <LinearGradient 
      colors={['#ffd8c4', '#fff0e6', '#ffffff']} 
      locations={[0, 0.4, 1]}
      style={styles.safeArea}
    >
      <SafeAreaView style={{ flex: 1 }}>
      
      {/* TOP TABS (Segmented Control Placeholder) */}
      <View style={styles.topTabsContainer}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity style={styles.tabInactive}>
            <Text style={styles.tabTextInactive}>ACTIVITY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabTextActive}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* STATS CARDS */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TIME SAVED</Text>
            <Text style={styles.statValue}>{timeSavedString}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>BEST STREAK</Text>
            <Text style={styles.statValue}>{lifetimeStats.bestStreak} Days</Text>
          </View>
        </View>

        {/* SECTION 1: APP BLOCKER */}
        <Text style={styles.sectionHeader}>APP BLOCKER</Text>
        <View style={styles.cardBlock}>
          <SettingsItem 
            icon="shield-checkmark" 
            title="Enable Blocker" 
            iconBgColor="#dcfce7" 
            iconColor="#22c55e" // Green for safe/enabled
            rightElement={
              <Switch
                value={isBlockerActive}
                onValueChange={handleToggleBlocker}
                trackColor={{ false: '#e2e8f0', true: '#f97316' }}
              />
            }
          />
          <SettingsItem 
            icon="lock-closed" 
            title="Lock List" 
            iconBgColor="#ffedd5" 
            iconColor="#f97316" // Orange
            isLast={true}
            onPress={() => {
              if (hasPermissions || isBlockerActive) {
                router.push('/lock-list');
              } else {
                handleToggleBlocker(true);
              }
            }}
          />
        </View>

        {/* SECTION 2: PRACTICE EXPERIENCE */}
        <Text style={styles.sectionHeader}>PRACTICE EXPERIENCE</Text>
        <View style={styles.cardBlock}>
          <SettingsItem 
            icon="options" 
            title="Practice Mode" 
            iconBgColor="#e0f2fe" 
            iconColor="#0ea5e9" // Light Blue
          />
          <SettingsItem 
            icon="language" 
            title="Mantra Language" 
            iconBgColor="#dcfce7" 
            iconColor="#22c55e" // Green
            isLast={true}
          />
        </View>

        {/* SECTION 3: ACCOUNT SETTINGS */}
        <Text style={styles.sectionHeader}>ACCOUNT SETTINGS</Text>
        <View style={styles.cardBlock}>
          <SettingsItem 
            icon="notifications" 
            title="Notifications" 
            iconBgColor="#fef08a" 
            iconColor="#eab308" // Yellow
          />
          <SettingsItem 
            icon="shield-checkmark" 
            title="Privacy & Security" 
            iconBgColor="#fee2e2" 
            iconColor="#ef4444" // Red
            isLast={true}
          />
        </View>

        <View style={{ height: 40 }} /> {/* Bottom padding */}
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  
  // Top Tabs
  topTabsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 30,
    padding: 4,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  tabActive: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabInactive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTextActive: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#334155',
    letterSpacing: 1,
  },
  tabTextInactive: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#94a3b8',
    letterSpacing: 1,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  statLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: '#334155',
  },

  // Sections
  sectionHeader: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  cardBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },

  // List Item
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(241, 245, 249, 0.4)',
  },
  itemContainerLast: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#334155',
  },
});
