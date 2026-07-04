import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText, G } from 'react-native-svg';
import { AntDesign, Feather } from '@expo/vector-icons';
import AlohaButton from '@/components/AlohaButton';

const { width } = Dimensions.get('window');
const cardWidth = width - 48;
const chartHeight = 220;

export default function PowerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setIsModalMounted(true);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalMounted(false);
    });
  };

  useEffect(() => {
    if (modalVisible) {
      modalScale.setValue(0.8);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

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
        <Text style={styles.mainTitle}>show up every day. watch what happens.</Text>

        {/* Card containing the chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>your inner peace over time</Text>
            <Text style={{ fontSize: 16, marginLeft: 8 }}>🔒</Text>
          </View>
          
          <Text style={styles.cardSubtitle}><Text style={styles.redX}>✕</Text> — day you skipped</Text>

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
                d={`M 20 180 C 50 160, 70 160, 100 170 C 130 180, 150 180, 180 172 C 210 164, 230 164, 260 176 C 290 182, ${w-50} 180, ${w-20} 180 L ${w-20} 194 L 20 194 Z`}
                fill="url(#redGradient)"
              />

              {/* Red Line (Distractions) */}
              <Path
                d={`M 20 180 C 50 160, 70 160, 100 170 C 130 180, 150 180, 180 172 C 210 164, 230 164, 260 176 C 290 182, ${w-50} 180, ${w-20} 180`}
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
                <Path d="M 81 162 L 89 170 M 89 162 L 81 170" />
                {/* X2 */}
                <Path d="M 136 173 L 144 181 M 144 173 L 136 181" />
                {/* X3 */}
                <Path d="M 191 164 L 199 172 M 199 164 L 191 172" />
                {/* X4 */}
                <Path d="M 236 166 L 244 174 M 244 166 L 236 174" />
              </G>

              {/* Texts */}
              <SvgText x={w-25} y="66" fill="#f59e0b" fontSize="10" fontFamily="Nunito_700Bold" textAnchor="end">
                with hopono ai
              </SvgText>

              <SvgText x="194" y="160" fill="#ef4444" fontSize="9" fontFamily="Nunito_600SemiBold" textAnchor="middle">
                I'll do it tomorrow
              </SvgText>
              
              <SvgText x={w-25} y="161" fill="#ef4444" fontSize="10" fontFamily="Nunito_700Bold" textAnchor="end">
                without it
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
            every session is a vote for the version of you that is free.
          </Text>
        </View>

        <TouchableOpacity onPress={openModal} style={styles.learnMoreBtn}>
          <Text style={styles.learnMoreText}>see how it works <Feather name="arrow-right" size={14} /></Text>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isModalMounted}
          onRequestClose={closeModal}
        >
          <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
            <Animated.View style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}>
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Feather name="x-circle" size={24} color="#9ca3af" />
              </TouchableOpacity>
              
              <Text style={{ fontSize: 32, marginBottom: 12 }}>🔒</Text>

              <Text style={styles.modalTitle}>three steps. that's it.</Text>

              <View style={styles.stepsContainer}>
                <View style={styles.stepRow}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>1</Text>
                  </View>
                  <Text style={styles.stepText}>name what you're carrying today</Text>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={styles.stepText}>let ho'oponopono do its work</Text>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                  <Text style={styles.stepText}>return to your day — lighter</Text>
                </View>
              </View>

              <Text style={styles.modalSubtext}>
                five minutes. every day. everything shifts.
              </Text>

              <AlohaButton
                onPress={() => {
                  closeModal();
                  router.push('/onboarding/mini-practice');
                }}
                text="feel it for yourself 🌺"
                variant="primary"
                style={{ paddingBottom: 0, paddingHorizontal: 0 }}
              />
            </Animated.View>
          </Animated.View>
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
    fontSize: 26,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    textTransform: 'lowercase',
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
    fontFamily: 'Nunito_700Bold',
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: '90%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalIconContainer: {
    borderWidth: 2,
    borderColor: '#e86935',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: '#000000',
    marginBottom: 16,
    textTransform: 'lowercase',
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 16,
    paddingLeft: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberContainer: {
    backgroundColor: '#e86935',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#ffffff',
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
  },
  stepText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    textTransform: 'lowercase',
  },
  modalSubtext: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
    textTransform: 'lowercase',
  },
});
