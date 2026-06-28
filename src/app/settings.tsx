import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const { palette } = useAppTheme();
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

  const handleRestartOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'false');
      router.replace('/onboarding');
    } catch (e) {
      console.warn('Failed to reset onboarding state:', e);
    }
  };

  return (
    <LinearGradient 
      colors={[palette.gradientTop, palette.gradientMid, palette.gradientBot]} 
      locations={[0, 0.4, 1]}
      style={styles.safeArea}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>settings</Text>
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
          />
          <SettingsItem 
            icon="refresh" 
            title="restart onboarding" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            isLast={true}
            onPress={handleRestartOnboarding}
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
    textTransform: 'lowercase',
  },

  // Sections
  sectionHeader: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
    textTransform: 'lowercase',
  },
  cardBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
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
    textTransform: 'lowercase',
  },
});
