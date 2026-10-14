import { Workout, GymExercise, CalisthenicsExercise, MappedExercise, MuscleGroup, RankTier, MuscleStatus } from '../types';
import { PREDEFINED_EXERCISES } from '../data/exercises';
import { getTodayDate } from './date';
import {
  calculate1RM,
  getRankForScore,
  getMuscleThresholds,
  MUSCLE_THRESHOLDS,
  RankingGender,
  RANK_ORDER,
} from './rankingRules';

export { calculate1RM, getRankForScore, getMuscleThresholds, MUSCLE_THRESHOLDS };

export interface StrengthPointChange {
  muscle: MuscleGroup;
  before: number;
  after: number;
  delta: number;
  previousRank: RankTier;
  currentRank: RankTier;
}

export const getStrengthPointChanges = (
  before: Record<MuscleGroup, MuscleStatus>,
  after: Record<MuscleGroup, MuscleStatus>,
): StrengthPointChange[] => {
  const muscles = new Set<MuscleGroup>([
    ...Object.keys(before) as MuscleGroup[],
    ...Object.keys(after) as MuscleGroup[],
  ]);

  return [...muscles]
    .map(muscle => {
      const previous = before[muscle];
      const current = after[muscle];
      const beforeScore = previous?.currentScore || 0;
      const afterScore = current?.currentScore || 0;
      return {
        muscle,
        before: beforeScore,
        after: afterScore,
        delta: afterScore - beforeScore,
        previousRank: previous?.rank || 'dirt',
        currentRank: current?.rank || 'dirt',
      };
    })
    .filter(change => change.delta !== 0 || change.previousRank !== change.currentRank)
    .sort((a, b) => b.delta - a.delta);
};

const ROLLING_WINDOW_SIZE = 5;
const VOLUME_BONUS_CAP = 0.30;
const VOLUME_DECAY = 0.4;

export const ONERM_FORMULAS = {
  epley: (w: number, r: number) => w * (1 + r / 30),
  brzycki: (w: number, r: number) => w * 36 / (37 - r),
  lombardi: (w: number, r: number) => w * Math.pow(r, 0.1),
  oconner: (w: number, r: number) => w * (1 + r / 40),
  mayhew: (w: number, r: number) => (w * 100) / (52.2 + 41.9 * Math.exp(-0.055 * r)),
  wathan: (w: number, r: number) => (w * 100) / (48.8 + 53.8 * Math.exp(-0.075 * r)),
  lander: (w: number, r: number) => (w * 100) / (101.3 - 2.67123 * r),
} as const;

export const ONERM_WEIGHTS = {
  epley: { base: 0.95, dropStart: 6, dropRate: 0.12, floor: 0.4 },
  brzycki: { base: 1.1, dropStart: 8, dropRate: 0.18, floor: 0.3 },
  lombardi: { base: 0.85, dropStart: 5, dropRate: 0.1, floor: 0.4 },
  oconner: { base: 0.9, dropStart: 6, dropRate: 0.12, floor: 0.4 },
  mayhew: { base: 0.95, dropStart: 8, dropRate: 0.1, floor: 0.5 },
  wathan: { base: 0.9, dropStart: 7, dropRate: 0.12, floor: 0.4 },
  lander: { base: 0.85, dropStart: 7, dropRate: 0.15, floor: 0.35 },
} as const;

export const REP_CAP = 15;

export function estimate1RM(weight: number, reps: number): number | null {
  if (weight <= 0 || reps < 1 || reps > REP_CAP) return null;
  if (reps === 1) return weight;

  let total = 0;
  let wsum = 0;
  for (const [name, fn] of Object.entries(ONERM_FORMULAS)) {
    const cfg = ONERM_WEIGHTS[name as keyof typeof ONERM_WEIGHTS];
    const drop = reps <= cfg.dropStart
      ? 1
      : Math.max(cfg.floor, 1 - (reps - cfg.dropStart) * cfg.dropRate);
    const w = cfg.base * drop;
    total += fn(weight, reps) * w;
    wsum += w;
  }
  const result = total / wsum;
  return Number.isFinite(result) && result > 0 ? Number((Math.round(result * 10) / 10).toFixed(1)) : null;
}

const MUSCLE_HALF_LIFE_MS: Record<string, number> = {
  side_delts: 24 * 60 * 60 * 1000,
  rear_delts: 24 * 60 * 60 * 1000,
  front_delts: 24 * 60 * 60 * 1000,
  biceps: 24 * 60 * 60 * 1000,
  triceps: 24 * 60 * 60 * 1000,
  abs: 24 * 60 * 60 * 1000,
  chest: 30 * 60 * 60 * 1000,
  lats: 30 * 60 * 60 * 1000,
  upper_back: 30 * 60 * 60 * 1000,
  traps: 30 * 60 * 60 * 1000,
  quads: 48 * 60 * 60 * 1000,
  hamstrings: 48 * 60 * 60 * 1000,
  glutes: 48 * 60 * 60 * 1000,
  lower_back: 48 * 60 * 60 * 1000,
  calves: 48 * 60 * 60 * 1000,
};
const DEFAULT_HALF_LIFE_MS = 30 * 60 * 60 * 1000;

const muscleDecayFactor = (muscle: string, elapsedMs: number): number => {
  const halfLife = MUSCLE_HALF_LIFE_MS[muscle] ?? DEFAULT_HALF_LIFE_MS;
  return Math.pow(0.5, elapsedMs / halfLife);
};

/**
 * Gets the biomechanical load percentage of bodyweight moved during a calisthenics movement.
 */
const getCalisthenicsBodyweightFactor = (exerciseName: string): number => {
  const name = exerciseName.toLowerCase();
  if (name.includes('pull-up') || name.includes('pullup') || name.includes('chin-up') || name.includes('chinup')) {
    return 0.90; // Pull-ups move ~90% of bodyweight
  }
  if (name.includes('dip')) {
    return 0.85; // Dips move ~85% of bodyweight
  }
  if (name.includes('push-up') || name.includes('pushup')) {
    return 0.65; // Push-ups move ~65% of bodyweight
  }
  if (name.includes('pistol squat') || name.includes('single-leg squat')) {
    return 1.0; // Pistol squats move ~100% of bodyweight
  }
  if (name.includes('crunch') || name.includes('plank') || name.includes('leg raise') || name.includes('twist')) {
    return 0.15; // Core movements move very little percentage of total bodyweight directly
  }
  return 0.70; // Default factor for general bodyweight movements
};

/**
 * Gets the muscle contribution factor for an exercise (primary/secondary split tuning).
 */
const getMuscleContributionFactor = (exerciseName: string, muscle: MuscleGroup, isPrimary: boolean): number => {
  const name = exerciseName.toLowerCase();
  
  if (isPrimary) {
    // For Dips, chest and triceps are primary, but chest does the major work and triceps is smaller.
    // Scale triceps down to 0.5 and chest to 0.7 to avoid inflation.
    if (name.includes('dip')) {
      if (muscle === 'triceps') return 0.50;
      if (muscle === 'chest') return 0.70;
    }
    return 1.0; // Default primary contribution
  } else {
    // Core and stabilizers receive lower contribution when acting as secondary muscles
    if (muscle === 'abs' || muscle === 'obliques' || muscle === 'lower_back' || muscle === 'forearms') {
      return 0.10;
    }
    // Standard secondary muscle progress factor from 0.25 to 0.08 (per user request)
    return 0.08;
  }
};

/**
 * Automatically calibrates/sanitizes the difficulty multiplier for exercises
 * to prevent rank inflation on isolation/accessory muscle groups (e.g. calves/triceps).
 */
export const getCalibratedMultiplier = (mapping: MappedExercise): number => {
  const multiplier = mapping.difficultyMultiplier || 1.0;
  
  if (mapping.primaryMuscles.length > 0) {
    // 1. Standard isolation/accessory check (biceps, triceps, forearms, abs, obliques, calves, side/rear/front delts)
    const isAccessoryOnly = mapping.primaryMuscles.every(m => 
      m === 'biceps' || 
      m === 'triceps' || 
      m === 'forearms' || 
      m === 'abs' || 
      m === 'obliques' || 
      m === 'calves' || 
      m === 'side_delts' || 
      m === 'rear_delts' ||
      m === 'front_delts'
    );
    
    if (isAccessoryOnly && multiplier > 0.5) {
      if (mapping.primaryMuscles.includes('calves')) {
        return 0.4; // Calves clamp
      }
      return 0.5; // Arms/Core/Delts clamp
    }

    // 2. Leg isolation check (quads-only, hamstrings-only, glutes-only)
    if (mapping.primaryMuscles.length === 1) {
      const singleMuscle = mapping.primaryMuscles[0];
      if ((singleMuscle === 'quads' || singleMuscle === 'hamstrings') && multiplier > 0.5) {
        return 0.5; // Clamp leg extensions / curls to accessory level (0.5)
      }
      if (singleMuscle === 'glutes' && multiplier > 0.6) {
        return 0.6; // Clamp glute isolation/kickbacks to glute bridge level (0.6)
      }
    }
  }
  
  return multiplier;
};

/**
 * Processes a completed workout and updates muscle rankings
 */
export const processWorkoutForRanks = (
  workout: Workout,
  currentStatuses: Record<MuscleGroup, MuscleStatus>,
  customExercises: MappedExercise[] = [],
  bodyweight: number = 70,
  gender: RankingGender = 'male',
): Record<MuscleGroup, MuscleStatus> => {
  const updatedStatuses = { ...currentStatuses };
  const allAvailableExercises = [...PREDEFINED_EXERCISES, ...customExercises];

  // Intensity multiplier: rewards training hard (power curve for steeper top-end)
  // 0/10 → 0.60x, 5/10 → 0.83x, 7/10 → 0.98x, 9/10 → 1.16x, 10/10 → 1.25x
  const intensity = workout.intensity || 5;
  const intensityMultiplier = 0.6 + Math.pow(intensity / 10, 1.5) * 0.65;

  // Collect all set scores chronologically to detect rest times
  interface ScoredSet {
    muscles: { muscle: MuscleGroup, factor: number }[];
    score: number;
    time: number;
    exerciseName: string;
    supersettedMuscles: Set<MuscleGroup>;
  }
  const allSets: ScoredSet[] = [];

  workout.exercises.forEach((ex) => {
    // Find exercise definition to get muscle mapping and multiplier
    const mapping = allAvailableExercises.find(m => m.name === ex.name);
    if (!mapping) return;

    const multiplier = getCalibratedMultiplier(mapping);
    const nameLower = mapping.name.toLowerCase();
    const mappingType = (mapping as any).type as string | undefined;
    const isDumbbell =
      mapping.equipment === 'dumbbell' ||
      (!!mapping.dumbbellLoad && /db|dumbbell/i.test(mapping.name));
    const supportsStrengthType = mappingType === 'strength' || mappingType === 'gym';
    const supportsBodyweightType = mappingType === 'calisthenics' || mapping.equipment === 'bodyweight';

    const processSet = (weight: number, reps: number, completedAt?: Date) => {
      // Apply Dumbbell Rule: Dumbbell Weight * 2 * 1.1 for stability
      let effectiveWeight = weight;
      if (
        isDumbbell &&
        mapping.dumbbellLoad === 'per_hand' &&
        supportsStrengthType
      ) {
        effectiveWeight = weight * 2;
      }

      const oneRM = estimate1RM(effectiveWeight, reps) ?? 0;
      const score = oneRM * multiplier;

      if (score > 0) {
        const musclesToUpdate: { muscle: MuscleGroup, factor: number }[] = [];
        mapping.primaryMuscles.forEach(m => {
          musclesToUpdate.push({ 
            muscle: m, 
            factor: getMuscleContributionFactor(mapping.name, m, true) 
          });
        });
        mapping.secondaryMuscles.forEach(m => {
          musclesToUpdate.push({ 
            muscle: m, 
            factor: getMuscleContributionFactor(mapping.name, m, false) 
          });
        });

        allSets.push({
          muscles: musclesToUpdate,
          score,
          time: completedAt ? new Date(completedAt).getTime() : 0,
          exerciseName: mapping.name,
          supersettedMuscles: new Set<MuscleGroup>()
        });
      }
    };

    const isBodyweight = mapping.equipment === 'bodyweight' || mappingType === 'calisthenics';

    if (!isBodyweight && supportsStrengthType) {
      const gymEx = ex as unknown as GymExercise;
      gymEx.sets.forEach(set => {
        if (set.completed && set.weight && !(set as any).isWarmup) {
          processSet(set.weight, set.reps, set.completedAt);
        }
      });
    } else if (isBodyweight || supportsBodyweightType) {
      const caliEx = ex as unknown as CalisthenicsExercise;
      const BASE_BODYWEIGHT = bodyweight;
      const bodyweightFactor = getCalisthenicsBodyweightFactor(mapping.name);
      caliEx.sets.forEach(set => {
        if (set.completed && !(set as any).isWarmup) {
          const effectiveWeight = (BASE_BODYWEIGHT * bodyweightFactor) + (set.extraWeight || 0);
          processSet(effectiveWeight, set.reps, set.completedAt);
        }
      });
    }
  });

  // Sort sets chronologically
  allSets.sort((a, b) => a.time - b.time);

  // Detect cross-exercise supersets (different exercises within 45s)
  // Flag shared muscles only, and only if earlier is isolation and later is compound
  for (let i = 1; i < allSets.length; i++) {
    const prev = allSets[i - 1];
    const curr = allSets[i];
    if (prev.time > 0 && curr.time > 0) {
      const diffMs = curr.time - prev.time;
      if (diffMs > 1000 && diffMs <= 45000 && prev.exerciseName !== curr.exerciseName) {
        const prevMapping = allAvailableExercises.find(m => m.name === prev.exerciseName);
        const currMapping = allAvailableExercises.find(m => m.name === curr.exerciseName);
        if (prevMapping && currMapping) {
          const prevMechanic = prevMapping.mechanic;
          const currMechanic = currMapping.mechanic;
          if (prevMechanic === 'isolation' && currMechanic === 'compound') {
            const prevMuscles = [...prevMapping.primaryMuscles, ...prevMapping.secondaryMuscles];
            const currMuscles = [...currMapping.primaryMuscles, ...currMapping.secondaryMuscles];
            const shared = prevMuscles.filter(m => currMuscles.includes(m));
            if (shared.length > 0) {
              shared.forEach(m => {
                prev.supersettedMuscles.add(m);
                curr.supersettedMuscles.add(m);
              });
            }
          }
        }
      }
    }
  }

  // Group by muscle group
  const muscleScores: Partial<Record<MuscleGroup, { score: number, time: number, isCrossExerciseSuperset: boolean }[]>> = {};
  allSets.forEach(s => {
    s.muscles.forEach(({ muscle, factor }) => {
      if (!muscleScores[muscle]) muscleScores[muscle] = [];
      const isSupersetForMuscle = s.supersettedMuscles.has(muscle);
      muscleScores[muscle]!.push({ score: s.score * factor, time: s.time, isCrossExerciseSuperset: isSupersetForMuscle });
    });
  });

  // Calculate final score for each trained muscle 
  Object.keys(muscleScores).forEach((m) => {
    const muscle = m as MuscleGroup;
    const sets = muscleScores[muscle]!;

    if (sets.length > 0) {
      // Find the best set
      const maxSet = sets.reduce((prev, current) => (prev.score > current.score) ? prev : current);
      let totalMuscleScore = maxSet.score;

      // If the best set was part of a cross-exercise superset, boost it
      // (e.g. pre-exhaustion: flyes → bench press — the bench is harder under fatigue)
      if (maxSet.isCrossExerciseSuperset) {
        totalMuscleScore *= 1.15;
      }

      // Add volume bonuses
      let extraSetIndex = 0;
      let volumeBonusUsed = 0;
      sets.forEach((s, index) => {
        if (s === maxSet) return; // Already counted as the base score

        // Within-muscle-group timing check for dropsets/same-exercise supersets
        let isSuperset = false;
        if (s.time > 0) {
          if (index > 0 && sets[index - 1].time > 0) {
            const diffMs = s.time - sets[index - 1].time;
            if (diffMs > 1000 && diffMs <= 45000) {
              isSuperset = true;
            }
          }
          if (index < sets.length - 1 && sets[index + 1].time > 0) {
            const diffMs = sets[index + 1].time - s.time;
            if (diffMs > 1000 && diffMs <= 45000) {
              isSuperset = true;
            }
          }
        }

        let decayBonus;
        if (isSuperset) {
          decayBonus = 0.15;
        } else {
          decayBonus = 0.15 * Math.pow(VOLUME_DECAY, extraSetIndex);
          extraSetIndex++;
        }

        const availableVolumeBonus = Math.max(0, VOLUME_BONUS_CAP - volumeBonusUsed);
        const appliedVolumeBonus = Math.min(decayBonus, availableVolumeBonus);
        totalMuscleScore += s.score * appliedVolumeBonus;
        volumeBonusUsed += appliedVolumeBonus;

        // Cross-exercise superset bonus still applies on top
        if (s.isCrossExerciseSuperset) {
          totalMuscleScore += s.score * 0.15;
        }
      });

      // Apply intensity multiplier (rewards training hard)
      totalMuscleScore *= intensityMultiplier;

      updateMuscleScore(updatedStatuses, muscle, totalMuscleScore, workout.date, gender);
    }
  });

  return updatedStatuses;
};

const updateMuscleScore = (
  statuses: Record<MuscleGroup, MuscleStatus>,
  muscle: MuscleGroup,
  newScore: number,
  date: string,
  gender: RankingGender = 'male',
) => {
  if (!statuses[muscle]) {
    statuses[muscle] = {
      muscle,
      currentScore: 0,
      bestScore: 0,
      rank: 'dirt',
      lastTrained: date,
      lastWorkedAt: new Date(date).getTime(),
    };
  }

  const status = statuses[muscle];

  // Update last trained date
  status.lastTrained = date;
  status.lastWorkedAt = new Date(date).getTime();

  const history = [...(status.scoreHistory || []), { date, score: newScore }]
    .slice(-ROLLING_WINDOW_SIZE);
  const weightedTotal = history.reduce((total, entry, index) => {
    const weight = index + 1;
    return total + entry.score * weight;
  }, 0);
  const totalWeight = history.reduce((total, _entry, index) => total + index + 1, 0);
  const rollingScore = weightedTotal / totalWeight;

  status.scoreHistory = history;
  status.lastScoreChange = rollingScore - status.currentScore;
  status.currentScore = rollingScore;
  status.bestScore = Math.max(status.bestScore, newScore);
  status.rank = getRankForScore(muscle, status.currentScore, gender);
};

/**
 * Applies weekly decay to muscle scores
 * Should be called whenever the app starts to check for missed workouts
 */
export const applyDecay = (
  statuses: Record<MuscleGroup, MuscleStatus>,
  referenceDate?: string,
  gender: RankingGender = 'male',
): Record<MuscleGroup, MuscleStatus> => {
  const updatedStatuses = Object.fromEntries(
    Object.entries(statuses).map(([muscle, status]) => [
      muscle,
      { ...status, scoreHistory: status.scoreHistory ? [...status.scoreHistory] : undefined },
    ]),
  ) as Record<MuscleGroup, MuscleStatus>;
  const today = referenceDate ? new Date(referenceDate) : new Date(getTodayDate());
  const GRACE_PERIOD_DAYS = 21;

  Object.keys(updatedStatuses).forEach(m => {
    const muscle = m as MuscleGroup;
    const status = updatedStatuses[muscle];

    const lastWorkedAt = status.lastWorkedAt ?? new Date(status.lastTrained).getTime();
    const diffMs = Math.abs(today.getTime() - lastWorkedAt);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > GRACE_PERIOD_DAYS) {
      const decayFactor = muscleDecayFactor(muscle, diffMs);
      status.currentScore = status.currentScore * decayFactor;
      status.rank = getRankForScore(muscle, status.currentScore, gender);
    }
  });

  return updatedStatuses;
};

export interface MuscleProgress {
  currentRank: RankTier;
  nextRank: RankTier | null;
  progressPercent: number;
  pointsRemaining: number;
}

export const getMuscleProgress = (
  muscle: MuscleGroup,
  score: number,
  gender: RankingGender = 'male',
): MuscleProgress => {
  const thresholds = getMuscleThresholds(muscle, gender);
  const currentRank = getRankForScore(muscle, score, gender);
  const currentIndex = RANK_ORDER.indexOf(currentRank);

  if (currentIndex === RANK_ORDER.length - 1) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      pointsRemaining: 0,
    };
  }

  const nextRank = RANK_ORDER[currentIndex + 1];
  const currentThreshold = thresholds[currentIndex];
  const nextThreshold = thresholds[currentIndex + 1];

  const range = nextThreshold - currentThreshold;
  const rawProgressPercent = range > 0
    ? Math.max(0, ((score - currentThreshold) / range) * 100)
    : 100;
  const progressPercent = score < nextThreshold
    ? Math.min(99.9, rawProgressPercent)
    : 100;
  const pointsRemaining = Math.max(0, nextThreshold - score);

  return {
    currentRank,
    nextRank,
    progressPercent,
    pointsRemaining,
  };
};

/**
 * Recalculates all muscle scores from workout history starting from a clean slate.
 */
export const recalculateAllScoresFromHistory = (
  workouts: Workout[],
  customExercises: MappedExercise[],
  bodyweight: number,
  gender: RankingGender = 'male',
): Record<MuscleGroup, MuscleStatus> => {
  let statuses = {} as Record<MuscleGroup, MuscleStatus>;
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  for (const workout of sortedWorkouts) {
    statuses = applyDecay(statuses, workout.date, gender);
    statuses = processWorkoutForRanks(workout, statuses, customExercises, bodyweight, gender);
  }
  return applyDecay(statuses, undefined, gender);
};
