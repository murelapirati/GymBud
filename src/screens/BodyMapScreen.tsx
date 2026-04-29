import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Body from 'react-native-body-highlighter';
import { useTheme } from '../context/ThemeContext';
import { useBodyMap } from '../context/BodyMapContext';
import { rankColors } from '../utils/theme';
import { MuscleGroup, RankTier } from '../types';

interface BodyMapScreenProps {
  onOpenSettings: () => void;
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
  'dirt', 'wood', 'iron', 'bronze', 
  'gold', 'diamond', 'emerald', 'master', 'olympian'
];

const CATEGORIES = [
  { name: 'Upper Body', muscles: ['chest', 'front_delts', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'forearms'] as MuscleGroup[] },
  { name: 'Back', muscles: ['upper_back', 'lats', 'lower_back'] as MuscleGroup[] },
  { name: 'Core', muscles: ['abs', 'obliques'] as MuscleGroup[] },
  { name: 'Lower Body', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] as MuscleGroup[] },
];

export default function BodyMapScreen({ onOpenSettings }: BodyMapScreenProps) {
  const { theme } = useTheme();
  const { muscleStatuses, gender } = useBodyMap();
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [showVisual, setShowVisual] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // The library only has a single 'deltoids' slug — no separate paths for
  // front/side/rear heads. We use the median rank index so one overdeveloped
  // head doesn't skew the color unfairly.
  const deltMuscles: MuscleGroup[] = ['front_delts', 'side_delts', 'rear_delts'];
  const deltRankIndices = deltMuscles
    .map(m => {
      const status = muscleStatuses[m];
      return status ? RANK_ORDER.indexOf(status.rank) : 0;
    })
    .sort((a, b) => a - b);
  const bestDeltRankIndex = deltRankIndices[Math.floor(deltRankIndices.length / 2)];

  // Build the list, skipping the individual delt muscles (they'd all map to 'deltoids')
  const DELT_MUSCLES = new Set<MuscleGroup>(['front_delts', 'side_delts', 'rear_delts']);
  const highlightedMuscles = Object.keys(MUSCLE_SLUG_MAPPING)
    .filter(m => !DELT_MUSCLES.has(m as MuscleGroup))
    .map((m) => {
      const muscle = m as MuscleGroup;
      const status = muscleStatuses[muscle];
      const rankIndex = status ? RANK_ORDER.indexOf(status.rank) : 0;
      return {
        slug: MUSCLE_SLUG_MAPPING[muscle] as any,
        intensity: rankIndex + 1,
      };
    });

  // Add the merged deltoids entry
  highlightedMuscles.push({
    slug: 'deltoids' as any,
    intensity: bestDeltRankIndex + 1,
  });

  // Adductors follow quad rank
  highlightedMuscles.push({
    slug: 'adductors' as any,
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Ranks</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onOpenSettings} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={theme.primary} />
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
                  defaultFill={theme.card}
                  colors={rankPalette}
                  defaultStroke={theme.text + '40'}
                  defaultStrokeWidth={1}
                  hiddenParts={['triceps', 'trapezius', 'neck'] as any}
                />
              </View>
              <View style={styles.bodyPage}>
                <Body 
                  data={highlightedMuscles}
                  gender={gender}
                  side="back"
                  scale={1.6}
                  defaultFill={theme.card}
                  colors={rankPalette}
                  defaultStroke={theme.text + '40'}
                  defaultStrokeWidth={1}
                  hiddenParts={['biceps', 'chest', 'abs', 'obliques'] as any}
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
                  Your muscles are highlighted based on your current strength rank.{' '}
                  Keep training to level up!
                </Text>
                <Text style={[styles.deltNote, { color: theme.textTertiary }]}>
                  ⚠️ Delts are shown as a combined color using your best delt rank.
                  Switch to list view for individual scores.
                </Text>
             </View>
          )}
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  deltNote: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
