import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Platform-specific imports are done dynamically to prevent crashes on Expo Go

export default function LockList() {
  const router = useRouter();

  // --- iOS State ---
  const [selectionData, setSelectionData] = useState('');

  // --- Android State ---
  const [androidApps, setAndroidApps] = useState<{ packageName: string; name: string }[]>([]);
  const [androidBlocked, setAndroidBlocked] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // --- iOS Picker Component ---
  const [PickerComponent, setPickerComponent] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Load installed apps and current blocks on Android dynamically
      import('expo-app-blocker').then((AppBlocker) => {
        AppBlocker.getInstalledApps?.().then(apps => {
          setAndroidApps(apps.sort((a: any, b: any) => a.name.localeCompare(b.name)));
        }).catch(console.warn);

        const blocked = AppBlocker.getBlockedApps?.() || [];
        setAndroidBlocked(new Set(blocked));
      }).catch(console.warn);
    } else if (Platform.OS === 'ios') {
      import('expo-app-blocker').then((AppBlocker) => {
        if (AppBlocker.FamilyActivityPickerView) {
          setPickerComponent(() => AppBlocker.FamilyActivityPickerView);
        }
      }).catch(console.warn);
    }
  }, []);

  // --- iOS Handler ---
  const handleIosSelectionChange = async (event: any) => {
    setSelectionData(event.selectionData);
    try {
      const AppBlocker = await import('expo-app-blocker');
      if (event.items.length > 0) {
        await AppBlocker.setBlockConfiguration({ blockedItems: event.items, isActive: true });
      } else {
        AppBlocker.clearAllBlocks();
      }
    } catch (e) {
      console.warn("Failed to apply blocks", e);
    }
  };

  // --- Android Handler ---
  const toggleAndroidBlock = (packageName: string) => {
    setAndroidBlocked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageName)) {
        newSet.delete(packageName);
      } else {
        newSet.add(packageName);
      }
      // Apply immediately
      import('expo-app-blocker').then(AppBlocker => {
        AppBlocker.setBlockedApps?.(Array.from(newSet));
      }).catch(console.warn);
      
      return newSet;
    });
  };

  // --- Android Render Logic ---
  const filteredApps = androidApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAndroidAppItem = ({ item }: { item: { packageName: string; name: string } }) => {
    const isBlocked = androidBlocked.has(item.packageName);
    const initial = item.name.charAt(0).toUpperCase();

    return (
      <View style={styles.appRow}>
        <View style={styles.appInfo}>
          <View style={[styles.iconContainer, { backgroundColor: '#ffedd5' }]}>
            <Text style={styles.iconInitial}>{initial}</Text>
          </View>
          <Text style={styles.appName}>{item.name}</Text>
        </View>
        <Switch
          trackColor={{ false: '#e2e8f0', true: '#ffedd5' }}
          thumbColor={isBlocked ? '#e86935' : '#f8fafc'}
          onValueChange={() => toggleAndroidBlock(item.packageName)}
          value={isBlocked}
          style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
        />
      </View>
    );
  };

  return (
    <LinearGradient 
      colors={['#ffd8c4', '#fff0e6', '#ffffff']} 
      locations={[0, 0.4, 1]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header (Cross Platform) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <SimpleLineIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>lock list</Text>
            <Text style={styles.headerSubtitle}>choose what to pause</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {Platform.OS === 'ios' ? (
          /* iOS Native Screen Time Picker */
          <View style={styles.iosPickerContainer}>
            {PickerComponent ? (
              <PickerComponent
                initialSelection={selectionData}
                onSelectionChange={handleIosSelectionChange}
                theme="light"
                style={{ flex: 1 }}
              />
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>
                Loading Family Controls (or please compile native app).
              </Text>
            )}
          </View>
        ) : (
          /* Android Custom Picker */
          <>
            <View style={styles.searchContainer}>
              <SimpleLineIcons name="magnifier" size={20} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="search applications..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <SimpleLineIcons name="close" size={20} color="#cbd5e1" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.listContainer}>
              <FlatList
                data={filteredApps}
                keyExtractor={(item) => item.packageName}
                renderItem={renderAndroidAppItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="leaf-outline" size={48} color="#cbd5e1" />
                    <Text style={styles.emptyText}>Loading applications...</Text>
                  </View>
                }
              />
            </View>
          </>
        )}
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  iosPickerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#0f172a',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#e86935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconInitial: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#e86935',
  },
  appName: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
});
