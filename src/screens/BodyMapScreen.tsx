import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Platform, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Body from 'react-native-body-highlighter';
import { useTheme } from '../context/ThemeContext';
import { useBodyMap } from '../context/BodyMapContext';
import { rankColors } from '../utils/theme';
import { MuscleGroup, RankTier } from '../types';

interface BodyMapScreenProps {
  onBack: () => void;
}

const { width } = Dimensions.get('window');

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  lats: 'Lats',
  upper_back: 'Upper Back',
  lower_back: 'Lower Back',
  front_delts: 'Front Delts',
  side_delts: 'Side Delts',
  rear_delts: 'Rear Delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
};

const MUSCLE_SLUG_MAPPING: Record<MuscleGroup, string> = {
  chest: 'chest',
  lats: 'upper-back',
  upper_back: 'upper-back',
  lower_back: 'lower-back',
  front_delts: 'deltoids',
  side_delts: 'deltoids',
  rear_delts: 'deltoids',
  biceps: 'biceps',
  triceps: 'triceps',
  forearms: 'forearm',
  abs: 'abs',
  obliques: 'obliques',
  quads: 'quadriceps',
  hamstrings: 'hamstring',
  glutes: 'gluteal',
  calves: 'calves',
};

const RANK_ORDER: RankTier[] = [
  'dirt', 'wood', 'stone', 'iron', 'bronze', 
  'gold', 'diamond', 'emerald', 'master', 'olympian'
];

const CATEGORIES = [
  { name: 'Upper Body', muscles: ['chest', 'front_delts', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'forearms'] as MuscleGroup[] },
  { name: 'Back', muscles: ['upper_back', 'lats', 'lower_back'] as MuscleGroup[] },
  { name: 'Core', muscles: ['abs', 'obliques'] as MuscleGroup[] },
  { name: 'Lower Body', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] as MuscleGroup[] },
];

export default function BodyMapScreen({ onBack }: BodyMapScreenProps) {
  const { theme } = useTheme();
  const { muscleStatuses, gender, setGender } = useBodyMap();
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [showVisual, setShowVisual] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Prepare data for the highlighter
  const highlightedMuscles = Object.keys(MUSCLE_SLUG_MAPPING).map((m) => {
    const muscle = m as MuscleGroup;
    const status = muscleStatuses[muscle];
    const rankIndex = status ? RANK_ORDER.indexOf(status.rank) : 0;
    
    return {
      slug: MUSCLE_SLUG_MAPPING[muscle],
      intensity: rankIndex + 1,
    };
  });

  highlightedMuscles.push({
    slug: 'adductors',
    intensity: RANK_ORDER.indexOf(muscleStatuses['quads']?.rank || 'dirt') + 1
  });

  const rankPalette = RANK_ORDER.map(rank => rankColors[rank as keyof typeof rankColors]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const side = xOffset > width / 2 ? 'back' : 'front';
    if (side !== activeSide) {
      setActiveSide(side);
    }
  };

  const scrollToSide = (side: 'front' | 'back') => {
    scrollViewRef.current?.scrollTo({
      x: side === 'front' ? 0 : width,
      animated: true,
    });
  };

  const renderMuscleCard = (muscle: MuscleGroup) => {
    const status = muscleStatuses[muscle] || {
      muscle,
      currentScore: 0,
      bestScore: 0,
      rank: 'dirt' as RankTier,
      lastTrained: 'Never'
    };

    const color = rankColors[status.rank as keyof typeof rankColors];

    return (
      <View key={muscle} style={[styles.muscleCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.rankIndicator, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.muscleName, { color: theme.text }]}>{MUSCLE_LABELS[muscle]}</Text>
            <Text style={[styles.rankText, { color: color, textTransform: 'capitalize' }]}>{status.rank}</Text>
          </View>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreLabel, { color: theme.textTertiary }]}>Power</Text>
              <Text style={[styles.scoreValue, { color: theme.textSecondary }]}>{Math.round(status.currentScore)}</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreLabel, { color: theme.textTertiary }]}>Best</Text>
              <Text style={[styles.scoreValue, { color: theme.textSecondary }]}>{Math.round(status.bestScore)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Body Map</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowVisual(!showVisual)} style={styles.iconButton}>
            <Ionicons name={showVisual ? "list" : "body"} size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        {showVisual && (
          <View style={styles.visualSection}>
            <View style={styles.sideToggle}>
              <TouchableOpacity 
                onPress={() => scrollToSide('front')}
                style={[styles.sideOption, activeSide === 'front' && { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}
              >
                <Text style={[styles.sideText, { color: activeSide === 'front' ? theme.primary : theme.textSecondary }]}>Front</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => scrollToSide('back')}
                style={[styles.sideOption, activeSide === 'back' && { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}
              >
                <Text style={[styles.sideText, { color: activeSide === 'back' ? theme.primary : theme.textSecondary }]}>Back</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.bodyScroll}
            >
              <View style={styles.bodyPage}>
                <Body 
                  data={highlightedMuscles}
                  gender={gender}
                  side="front"
                  scale={1.6}
                  baseColor={theme.card}
                  colors={rankPalette}
                  defaultStroke={theme.text + '40'}
                  defaultStrokeWidth={1}
                  hiddenParts={['triceps', 'trapezius', 'neck']}
                />
              </View>
              <View style={styles.bodyPage}>
                <Body 
                  data={highlightedMuscles}
                  gender={gender}
                  side="back"
                  scale={1.6}
                  baseColor={theme.card}
                  colors={rankPalette}
                  defaultStroke={theme.text + '40'}
                  defaultStrokeWidth={1}
                  hiddenParts={['biceps', 'chest', 'abs', 'obliques']}
                />
              </View>
            </ScrollView>
            
            <View style={styles.swipeHint}>
              <Ionicons name="swap-horizontal" size={16} color={theme.textTertiary} />
              <Text style={[styles.swipeText, { color: theme.textTertiary }]}>Swipe to rotate</Text>
            </View>
          </View>
        )}

        <View style={styles.contentContainer}>
          <View style={styles.legendContainer}>
            <Text style={[styles.legendTitle, { color: theme.textSecondary }]}>Rank Tiers</Text>
            <View style={styles.legendGrid}>
              {RANK_ORDER.map((rank) => (
                <View key={rank} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: rankColors[rank as keyof typeof rankColors] }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary, textTransform: 'capitalize' }]}>{rank}</Text>
                </View>
              ))}
            </View>
          </View>

          {!showVisual ? (
            CATEGORIES.map(category => (
              <View key={category.name} style={styles.categorySection}>
                <Text style={[styles.categoryTitle, { color: theme.primary }]}>{category.name}</Text>
                {category.muscles.map(muscle => renderMuscleCard(muscle))}
              </View>
            ))
          ) : (
             <View style={styles.visualInfo}>
                <Text style={[styles.visualHelpText, { color: theme.textSecondary }]}>
                  Your muscles are highlighted based on your current strength rank. 
                  Keep training to level up!
                </Text>
             </View>
          )}
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setSettingsVisible(false)}
        >
          <View style={[styles.settingsContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.settingsTitle, { color: theme.text }]}>Map Settings</Text>
            
            <View style={styles.settingsGroup}>
              <Text style={[styles.settingsLabel, { color: theme.textSecondary }]}>Body Type</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity 
                  onPress={() => setGender('male')}
                  style={[
                    styles.toggleBtn, 
                    { borderColor: theme.border },
                    gender === 'male' && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                >
                  <Ionicons name="male" size={18} color={gender === 'male' ? '#fff' : theme.textSecondary} />
                  <Text style={[styles.toggleBtnText, { color: gender === 'male' ? '#fff' : theme.textSecondary }]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setGender('female')}
                  style={[
                    styles.toggleBtn, 
                    { borderColor: theme.border },
                    gender === 'female' && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                >
                  <Ionicons name="female" size={18} color={gender === 'female' ? '#fff' : theme.textSecondary} />
                  <Text style={[styles.toggleBtnText, { color: gender === 'female' ? '#fff' : theme.textSecondary }]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setSettingsVisible(false)}
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
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
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    padding: 8,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  mainScrollView: {
    flex: 1,
  },
  visualSection: {
    alignItems: 'center',
    paddingTop: 10,
  },
  sideToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  sideOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sideText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bodyScroll: {
    width: width,
    height: 480,
  },
  bodyPage: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -10,
    marginBottom: 20,
    opacity: 0.6,
  },
  swipeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  legendContainer: {
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 16,
    borderRadius: 24,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  muscleCard: {
    flexDirection: 'row',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rankIndicator: {
    width: 8,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  muscleName: {
    fontSize: 17,
    fontWeight: '700',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 20,
  },
  scoreItem: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
    opacity: 0.5,
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  visualInfo: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  visualHelpText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  settingsContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 30,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingsGroup: {
    marginBottom: 24,
  },
  settingsLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  closeButton: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
