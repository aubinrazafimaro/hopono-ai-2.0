import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCheckIn } from '@/context/CheckInContext';

const { width } = Dimensions.get('window');

// Format time into Days + Hours if > 24, else just Hours
const formatTime = (totalHours: number) => {
  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24);
    const remainingHours = Math.floor(totalHours % 24);
    return `${days} day${days > 1 ? 's' : ''} ${remainingHours > 0 ? `& ${remainingHours} hr${remainingHours > 1 ? 's' : ''}` : ''}`;
  }
  return `${Math.floor(totalHours)} hours`;
};

// Mock data for Hawaiian Milestones
const MILESTONES = [
  { id: 1, name: 'Hoʻomau', meaning: 'perseverance', requiredHours: 10, icon: 'leaf' },
  { id: 2, name: 'Ikaika', meaning: 'strength', requiredHours: 50, icon: 'flame' },
  { id: 3, name: 'Mālamalama', meaning: 'enlightenment', requiredHours: 100, icon: 'planet' },
];

export default function TimeSavedScreen() {
  const router = useRouter();
  const { getAverages } = useCheckIn();
  
  // Get lifetime time saved
  const lifetimeStats = getAverages(365);
  // Consistent calculation: 0.5h per session
  const totalHours = lifetimeStats.totalSessions * 0.5;

  const timeDisplay = formatTime(totalHours);

  const unlockedMilestones = MILESTONES.filter(m => totalHours >= m.requiredHours);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/insights')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* Celebration Title */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="time" size={48} color="#5ba4e6" />
          </View>
          <Text style={styles.heroTitle}>you have reclaimed</Text>
          <Text style={styles.heroTime}>{timeDisplay}</Text>
          <Text style={styles.heroSubtitle}>of your life back from doomscrolling.</Text>
        </View>

        {/* AI Insight Card based on User Goal */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={16} color="#eab308" style={{ marginRight: 6 }} />
            <Text style={styles.aiTitle}>Hopono AI Insight</Text>
          </View>
          <Text style={styles.aiText}>
            During onboarding, you mentioned wanting to <Text style={styles.highlightText}>launch a YouTube channel</Text>. 
            With {timeDisplay} of focused time, you could have scripted, recorded, and fully edited at least 3 high-quality videos!
          </Text>
        </View>

        {/* Milestones Path */}
        <Text style={styles.sectionTitle}>your journey milestones</Text>
        <View style={styles.milestonesContainer}>
          {MILESTONES.map((milestone, index) => {
            const isUnlocked = totalHours >= milestone.requiredHours;
            const progress = isUnlocked ? 100 : Math.min(100, Math.max(0, (totalHours / milestone.requiredHours) * 100));
            
            return (
              <View key={milestone.id} style={styles.milestoneRow}>
                {/* Visual Line */}
                <View style={styles.pathLine}>
                  {index !== MILESTONES.length - 1 && (
                    <View style={[styles.connectingLine, isUnlocked && styles.connectingLineActive]} />
                  )}
                  <View style={[styles.node, isUnlocked && styles.nodeActive]}>
                    <Ionicons 
                      name={isUnlocked ? milestone.icon as any : 'lock-closed'}
                      size={16} 
                      color={isUnlocked ? '#ffffff' : '#94a3b8'} 
                    />
                  </View>
                </View>

                {/* Milestone Info */}
                <View style={[styles.milestoneContent, !isUnlocked && styles.milestoneContentLocked]}>
                  <Text style={[styles.milestoneName, isUnlocked && styles.milestoneNameActive]}>
                    {milestone.name} <Text style={styles.milestoneMeaning}>({milestone.meaning})</Text>
                  </Text>
                  <Text style={styles.milestoneReq}>{milestone.requiredHours} hours of focus</Text>
                  
                  {/* Progress Bar (Only show if not fully unlocked but is the current working milestone) */}
                  {!isUnlocked && progress > 0 && (
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social" size={22} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.shareButtonText}>share your triumph</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Theme consistency: pure white
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f7ff', // Very soft blue matching Time Saved
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 8,
  },
  heroTime: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 36,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  aiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(232, 105, 53, 0.05)',
    shadowColor: '#e86935', // Theme orange shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#eab308',
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  aiText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  highlightText: {
    color: '#e86935',
    fontFamily: 'Nunito_700Bold',
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'lowercase',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  milestonesContainer: {
    marginBottom: 32,
  },
  milestoneRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  pathLine: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeActive: {
    backgroundColor: '#5ba4e6', // Blue of Time Saved
    shadowColor: '#5ba4e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  connectingLine: {
    position: 'absolute',
    top: 32,
    width: 2,
    height: 60,
    backgroundColor: '#f1f5f9',
    zIndex: 1,
  },
  connectingLineActive: {
    backgroundColor: '#5ba4e6',
  },
  milestoneContent: {
    flex: 1,
    paddingTop: 4,
  },
  milestoneContentLocked: {
    opacity: 0.5,
  },
  milestoneName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#6b7280',
    textTransform: 'lowercase',
    marginBottom: 4,
  },
  milestoneNameActive: {
    color: '#333333',
  },
  milestoneMeaning: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  milestoneReq: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#9ca3af',
  },
  progressBarBg: {
    marginTop: 12,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5ba4e6',
    borderRadius: 3,
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e86935',
    paddingVertical: 18,
    borderRadius: 30,
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
