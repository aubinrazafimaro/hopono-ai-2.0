import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useCheckIn } from '@/context/CheckInContext';
import { useAppTheme } from '@/context/AppThemeContext';

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
        <SimpleLineIcons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={styles.itemTitle}>{title}</Text>
    </View>
    {rightElement ? rightElement : <SimpleLineIcons name="arrow-right" size={16} color="#cbd5e1" />}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { getAverages } = useCheckIn();
  const { themeName, palette, setThemeName } = useAppTheme();
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
      colors={[palette.gradientTop, palette.gradientMid, palette.gradientBot]} 
      locations={[0, 0.4, 1]}
      style={styles.safeArea}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      
      {/* Removed Top Tabs as requested */}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>settings</Text>
        </View>
        
        {/* STATS CARDS */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>time saved</Text>
            <Text style={styles.statValue}>{timeSavedString}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>best streak</Text>
            <Text style={styles.statValue}>{lifetimeStats.bestStreak} days</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>app blocker</Text>
        <View style={[styles.cardBlock, { shadowColor: palette.primary }]}>
          <SettingsItem 
            icon="shield" 
            title="enable blocker" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            rightElement={
              <Switch
                value={isBlockerActive}
                onValueChange={handleToggleBlocker}
                trackColor={{ false: '#e2e8f0', true: palette.primary }}
              />
            }
          />
          <SettingsItem 
            icon="lock" 
            title="lock list" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
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

        <Text style={styles.sectionHeader}>practice experience</Text>
        <View style={[styles.cardBlock, { shadowColor: palette.primary }]}>
          <SettingsItem 
            icon="equalizer" 
            title="practice mode" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
          />
          <SettingsItem 
            icon="globe" 
            title="mantra language" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            isLast={true}
          />
        </View>

        <Text style={styles.sectionHeader}>account settings</Text>
        <View style={[styles.cardBlock, { shadowColor: palette.primary }]}>
          <SettingsItem 
            icon="bell" 
            title="notifications" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
          />
          <SettingsItem 
            icon="shield" 
            title="privacy & security" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            isLast={true}
          />
        </View>

        {/* SECTION 4: APPEARANCE */}
        <Text style={styles.sectionHeader}>appearance</Text>
        <View style={[styles.cardBlock, { shadowColor: palette.primary }]}>
          <SettingsItem 
            icon="drop" 
            title="ocean theme" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            isLast={true}
            rightElement={
              <Switch
                value={themeName === 'ocean'}
                onValueChange={(val) => setThemeName(val ? 'ocean' : 'sunset')}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: palette.primary }}
              />
            }
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
  
  // Header
  header: {
    marginBottom: 16,
    marginTop: 8,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#334155',
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
    // shadowColor is overridden dynamically
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
    // shadowColor is overridden dynamically
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
