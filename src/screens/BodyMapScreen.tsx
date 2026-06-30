import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Body from 'react-native-body-highlighter';
import { useTheme } from '../context/ThemeContext';
import { useBodyMap } from '../context/BodyMapContext';
import { rankColors } from '../utils/theme';
import { MuscleGroup, RankTier } from '../types';
import { MUSCLE_THRESHOLDS, getMuscleProgress } from '../utils/rankingEngine';

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
  const [expandedMuscle, setExpandedMuscle] = useState<MuscleGroup | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // The library only has a single 'deltoids' slug — no separate paths for
  // front/side/rear heads. We average the two highest heads so that
  // developing front + side delts (very common) shows up as high intensity
  // even if rear delts are lagging.
  const deltMuscles: MuscleGroup[] = ['front_delts', 'side_delts', 'rear_delts'];
  const deltRankIndices = deltMuscles
    .map(m => {
      const status = muscleStatuses[m];
      return status ? RANK_ORDER.indexOf(status.rank) : 0;
    })
    .sort((a, b) => a - b);
  // deltRankIndices is sorted ascending. Index 1 and 2 are the two highest heads.
  const bestDeltRankIndex = Math.round((deltRankIndices[1] + deltRankIndices[2]) / 2);

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
    const isExpanded = expandedMuscle === muscle;
    const thresholds = MUSCLE_THRESHOLDS[muscle] || MUSCLE_THRESHOLDS.chest;

    return (
      <TouchableOpacity 
        key={muscle} 
        activeOpacity={0.85}
        onPress={() => setExpandedMuscle(isExpanded ? null : muscle)}
        style={[
          styles.muscleCard, 
          { 
            backgroundColor: theme.card, 
            borderColor: color + '22',
            borderLeftWidth: 5,
            borderLeftColor: color,
          }
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.muscleName, { color: theme.text }]}>{MUSCLE_LABELS[muscle]}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.rankBadge, { backgroundColor: color + '15', borderColor: color + '30', borderWidth: 1, marginRight: 8 }]}>
                <Text style={[styles.rankText, { color: color }]}>{status.rank}</Text>
              </View>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={theme.textTertiary} 
              />
            </View>
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

          {(() => {
            const progress = getMuscleProgress(muscle, status.currentScore);
            return progress.nextRank ? (
              <View style={{ marginTop: 8 }}>
                <View style={[styles.progressBarContainer, { backgroundColor: theme.border + '30' }]}>
                  <View style={[styles.progressBarActive, { backgroundColor: color, width: `${progress.progressPercent}%` }]} />
                </View>
                <View style={styles.progressTextRow}>
                  <Text style={[styles.progressText, { color: theme.textTertiary }]}>
                    {progress.progressPercent.toFixed(0)}% to {progress.nextRank}
                  </Text>
                  <Text style={[styles.progressText, { color: color }]}>
                    {Math.round(progress.pointsRemaining)} pts left
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 8 }}>
                <View style={[styles.progressBarContainer, { backgroundColor: theme.border + '30' }]}>
                  <View style={[styles.progressBarActive, { backgroundColor: color, width: '100%' }]} />
                </View>
                <View style={styles.progressTextRow}>
                  <Text style={[styles.progressText, { color: color, fontWeight: '800' }]}>
                    MAX RANK REACHED (OLYMPIAN)
                  </Text>
                </View>
              </View>
            );
          })()}

          {isExpanded && (
            <View style={[styles.thresholdsTable, { borderTopWidth: 1, borderTopColor: theme.border + '50', marginTop: 12, paddingTop: 12 }]}>
              <Text style={[styles.thresholdsTitle, { color: theme.textSecondary }]}>
                Rank Thresholds (Power / XP)
              </Text>
              <View style={styles.thresholdsGrid}>
                {RANK_ORDER.map((rank, i) => {
                  const reqScore = thresholds[i];
                  const hasAchieved = status.currentScore >= reqScore;
                  const rankColor = rankColors[rank as keyof typeof rankColors];
                  return (
                    <View key={rank} style={styles.thresholdRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', width: '45%' }}>
                        <View style={[styles.miniDot, { backgroundColor: rankColor }]} />
                        <Text style={[styles.thresholdRankName, { color: rankColor }]}>
                          {rank}
                        </Text>
                      </View>
                      <Text style={[styles.thresholdScoreVal, { color: theme.textSecondary }]}>
                        {reqScore}
                      </Text>
                      <View style={{ width: '30%', alignItems: 'flex-end' }}>
                        {hasAchieved ? (
                          <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
                        ) : (
                          <Text style={{ fontSize: 10, color: theme.textTertiary, fontWeight: '600' }}>
                            -{Math.round(reqScore - status.currentScore)}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
          <View style={[styles.legendContainer, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <Text style={[styles.legendTitle, { color: theme.textSecondary }]}>Rank Tiers</Text>
            <View style={styles.legendGrid}>
              {RANK_ORDER.map((rank) => {
                const color = rankColors[rank as keyof typeof rankColors];
                return (
                  <View key={rank} style={[styles.legendItem, { backgroundColor: color + '12', borderColor: color + '25', borderWidth: 1 }]}>
                    <View style={[styles.legendDot, { backgroundColor: color }]} />
                    <Text style={[styles.legendText, { color: theme.text }]}>{rank}</Text>
                  </View>
                );
              })}
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
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    width: '31%',
    gap: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
  thresholdsTable: {
    width: '100%',
  },
  thresholdsTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    opacity: 0.6,
  },
  thresholdsGrid: {
    gap: 6,
  },
  thresholdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  thresholdRankName: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  thresholdScoreVal: {
    fontSize: 12,
    fontWeight: '700',
    width: '25%',
    textAlign: 'right',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
    width: '100%',
  },
  progressBarActive: {
    height: '100%',
    borderRadius: 3,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
