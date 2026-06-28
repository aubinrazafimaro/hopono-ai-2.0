import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText, G } from 'react-native-svg';
import { AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width - 48;
const chartHeight = 220;

export default function PowerScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  // SVG dimensions
  const w = cardWidth;
  const h = chartHeight;

  return (
    <LinearGradient
      colors={['#f97316', '#ea580c']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        
        {/* Title */}
        <Text style={styles.mainTitle}>ho'oponopono is powerful</Text>

        {/* Card containing the chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>inner peace</Text>
            <View style={styles.iconContainer}>
              <Feather name="lock" size={16} color="#e86935" />
            </View>
          </View>
          
          <Text style={styles.cardSubtitle}><Text style={styles.redX}>x</Text> - skipped practice</Text>

          <View style={styles.chartContainer}>
            <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
              <Defs>
                {/* Gradient for the red bumpy area */}
                <SvgLinearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ef4444" stopOpacity="0.4" />
                  <Stop offset="1" stopColor="#ef4444" stopOpacity="0.0" />
                </SvgLinearGradient>
              </Defs>

              {/* Red Area Fill */}
              <Path
                d={`M 20 180 Q 50 160 80 170 T 140 180 Q 160 140 180 180 T 220 170 Q 240 150 260 180 T ${w-20} 180 L ${w-20} 190 L 20 190 Z`}
                fill="url(#redGradient)"
              />

              {/* Red Line (Distractions) */}
              <Path
                d={`M 20 180 Q 50 160 80 170 T 140 180 Q 160 140 180 180 T 220 170 Q 240 150 260 180 T ${w-20} 180`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
              />

              {/* Orange/Yellow Line (Journey) */}
              <Path
                d={`M 20 160 C 80 150 120 70 180 80 C 220 85 240 40 ${w-30} 40`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />

              {/* Start Circles */}
              <Circle cx="20" cy="160" r="4" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <Circle cx="20" cy="180" r="4" fill="none" stroke="#ef4444" strokeWidth="2" />
              
              {/* End Circle for Journey */}
              <Circle cx={w-30} cy="40" r="4" fill="#f59e0b" />
              {/* End Circle for Distractions */}
              <Circle cx={w-20} cy="180" r="4" fill="#ef4444" />

              {/* X Marks for skipped practice */}
              <G stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                {/* X1 */}
                <Path d="M 85 160 L 93 168 M 93 160 L 85 168" />
                {/* X2 */}
                <Path d="M 130 175 L 138 183 M 138 175 L 130 183" />
                {/* X3 */}
                <Path d="M 190 175 L 198 183 M 198 175 L 190 183" />
                {/* X4 */}
                <Path d="M 215 170 L 223 178 M 223 170 L 215 178" />
              </G>

              {/* Texts */}
              <SvgText x={w-25} y="60" fill="#f59e0b" fontSize="10" fontFamily="Nunito_700Bold" textAnchor="end">
                ho'oponopono
              </SvgText>
              <SvgText x={w-25} y="72" fill="#f59e0b" fontSize="10" fontFamily="Nunito_700Bold" textAnchor="end">
                journey
              </SvgText>

              <SvgText x="194" y="160" fill="#ef4444" fontSize="9" fontFamily="Nunito_600SemiBold" textAnchor="middle">
                I'll practice later
              </SvgText>
              
              <SvgText x={w-25} y="155" fill="#ef4444" fontSize="10" fontFamily="Nunito_700Bold" textAnchor="end">
                distractions
              </SvgText>
              <SvgText x={w-25} y="167" fill="#ef4444" fontSize="10" fontFamily="Nunito_700Bold" textAnchor="end">
                won again
              </SvgText>

              {/* Bottom Axis Line */}
              <Path d={`M 20 195 L ${w-20} 195`} stroke="#000" strokeWidth="1" />
              
              {/* Axis Labels */}
              <SvgText x="35" y="210" fill="#6b7280" fontSize="10" fontFamily="Nunito_400Regular" textAnchor="middle">
                week 1
              </SvgText>
              <SvgText x={w/2} y="210" fill="#6b7280" fontSize="10" fontFamily="Nunito_400Regular" textAnchor="middle">
                week 2
              </SvgText>
              <SvgText x={w-35} y="210" fill="#6b7280" fontSize="10" fontFamily="Nunito_400Regular" textAnchor="middle">
                week 3
              </SvgText>
            </Svg>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.descriptionText}>
            keep practicing, the more you show up, the more room you give peace to show up in your life
          </Text>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.learnMoreBtn}>
          <Text style={styles.learnMoreText}>learn how hopono ai works <Feather name="arrow-right" size={14} /></Text>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Feather name="x-circle" size={24} color="#9ca3af" />
              </TouchableOpacity>
              
              <View style={styles.modalIconContainer}>
                <Feather name="lock" size={24} color="#e86935" />
              </View>

              <Text style={styles.modalTitle}>how it works</Text>

              <View style={styles.stepsContainer}>
                <View style={styles.stepRow}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>1</Text>
                  </View>
                  <Text style={styles.stepText}>share how you're feeling today</Text>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={styles.stepText}>practice</Text>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                  <Text style={styles.stepText}>unlock your apps</Text>
                </View>
              </View>

              <Text style={styles.modalSubtext}>
                deepen your inner peace with just 5 minutes each day
              </Text>

              <TouchableOpacity 
                style={styles.getStartedBtn} 
                onPress={() => {
                  setModalVisible(false);
                  router.push('/onboarding/mini-practice');
                }}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#000000',
  },
  iconContainer: {
    backgroundColor: '#fff7ed',
    padding: 8,
    borderRadius: 12,
  },
  cardSubtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 4,
  },
  redX: {
    color: '#ef4444',
    fontFamily: 'Nunito_800ExtraBold',
  },
  chartContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  descriptionText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  learnMoreBtn: {
    position: 'absolute',
    bottom: 45, // Lowered slightly to match the exact visual center of the continue buttons
    right: 24, // Moved to the right
    padding: 10,
    zIndex: 10,
  },
  learnMoreText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  
  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  modalIconContainer: {
    borderWidth: 2,
    borderColor: '#e86935',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 30,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 30,
    paddingLeft: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepNumberContainer: {
    backgroundColor: '#e86935',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: {
    color: '#ffffff',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  stepText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  modalSubtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  getStartedBtn: {
    backgroundColor: '#e86935',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  getStartedText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#ffffff',
  },
});
