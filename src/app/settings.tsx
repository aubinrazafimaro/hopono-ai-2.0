import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
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
  const [isNotificationsActive, setIsNotificationsActive] = useState(true);
  const [isHapticsActive, setIsHapticsActive] = useState(true);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const notif = await AsyncStorage.getItem('@hopono_notifications_enabled');
        if (notif !== null) {
          setIsNotificationsActive(notif === 'true');
        }
        const hapt = await AsyncStorage.getItem('@hopono_haptics_enabled');
        if (hapt !== null) {
          setIsHapticsActive(hapt === 'true');
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }
    };
    loadSettings();
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    setIsNotificationsActive(value);
    try {
      await AsyncStorage.setItem('@hopono_notifications_enabled', value.toString());
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleHaptics = async (value: boolean) => {
    setIsHapticsActive(value);
    try {
      await AsyncStorage.setItem('@hopono_haptics_enabled', value.toString());
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRestartOnboarding = () => {
    Alert.alert(
      "restart onboarding",
      "would you like to re-answer the questions and generate a new healing plan?",
      [
        { text: "cancel", style: "cancel" },
        { 
          text: "yes, restart", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.setItem('hasCompletedOnboarding', 'false');
              router.replace('/onboarding');
            } catch (e) {
              console.warn('Failed to reset onboarding:', e);
            }
          }
        }
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "clear all history",
      "this will permanently delete all your daily check-ins, practice history, progress, and onboarding data. this cannot be undone. would you like to proceed?",
      [
        { text: "cancel", style: "cancel" },
        { 
          text: "clear everything", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              router.replace('/onboarding');
            } catch (e) {
              console.warn('Failed to clear app data:', e);
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient 
      colors={[palette.gradientTop, palette.gradientMid, palette.gradientBot]} 
      locations={[0, 0.4, 1]}
      style={styles.safeArea}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <SimpleLineIcons name="arrow-left" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionHeader}>preferences</Text>
        <View style={[styles.cardBlock, { shadowColor: palette.primary }]}>
          <SettingsItem 
            icon="bell" 
            title="daily reminder" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            rightElement={
              <Switch
                value={isNotificationsActive}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#e2e8f0', true: palette.primary }}
              />
            }
          />
          <SettingsItem 
            icon="control-play" 
            title="haptic breathing beats" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            isLast={true}
            rightElement={
              <Switch
                value={isHapticsActive}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: '#e2e8f0', true: palette.primary }}
              />
            }
          />
        </View>

        <Text style={styles.sectionHeader}>account & data</Text>
        <View style={[styles.cardBlock, { shadowColor: palette.primary }]}>
          <SettingsItem 
            icon="refresh" 
            title="restart onboarding" 
            iconBgColor={palette.cardBg} 
            iconColor={palette.primary}
            onPress={handleRestartOnboarding}
          />
          <SettingsItem 
            icon="trash" 
            title="clear all history" 
            iconBgColor={palette.cardBg} 
            iconColor="#ef4444"
            isLast={true}
            onPress={handleClearAllData}
          />
        </View>

        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  backBtn: {
    padding: 4,
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
