import { Workout, GymExercise, CalisthenicsExercise, MappedExercise, MuscleGroup, RankTier, MuscleStatus } from '../types';
import { PREDEFINED_EXERCISES } from '../data/exercises';
import { getTodayDate } from './date';

// Baseline thresholds for a "Standard" muscle group (e.g. Chest)
// Exponential scaling: fast early ranks for beginners, steep late-game climb
// Ranks: Dirt, Wood, Iron, Bronze, Gold, Diamond, Emerald, Master, Olympian
const BASE_THRESHOLDS: number[] = [0, 10, 25, 40, 55, 80, 115, 165, 225];

const RANK_ORDER: RankTier[] = [
  'dirt', 'wood', 'iron', 'bronze',
  'gold', 'diamond', 'emerald', 'master', 'olympian'
];

// Explicit thresholds for each muscle group based on empirical training standards (effective 1RM load)
// Tiers in order: Dirt, Wood, Iron, Bronze, Gold, Diamond, Emerald, Master, Olympian
export const MUSCLE_THRESHOLDS: Record<MuscleGroup, number[]> = {
  chest: [0, 10, 25, 40, 55, 80, 115, 165, 225],
  lats: [0, 8, 20, 35, 50, 75, 105, 145, 195],
  upper_back: [0, 8, 20, 35, 50, 75, 105, 145, 195],
  lower_back: [0, 15, 35, 60, 85, 125, 175, 240, 320],
  front_delts: [0, 8, 18, 30, 45, 65, 90, 125, 170],
  side_delts: [0, 2, 5, 10, 15, 25, 38, 55, 75],
  rear_delts: [0, 2, 5, 10, 15, 25, 38, 55, 75],
  biceps: [0, 3, 7, 12, 18, 28, 40, 55, 75],
  triceps: [0, 4, 10, 18, 28, 42, 60, 82, 110],
  forearms: [0, 3, 7, 12, 18, 28, 40, 55, 75],
  abs: [0, 2, 5, 9, 14, 20, 28, 38, 50],
  obliques: [0, 2, 5, 9, 14, 20, 28, 38, 50],
  quads: [0, 12, 30, 50, 75, 110, 155, 210, 280],
  hamstrings: [0, 10, 25, 40, 60, 90, 125, 170, 225],
  glutes: [0, 12, 30, 50, 75, 110, 155, 210, 280],
  calves: [0, 8, 20, 35, 55, 80, 115, 160, 220],
};

/**
 * Calculates Estimated 1RM using pure Epley formula.
 * Intensity is handled separately as a score multiplier in processWorkoutForRanks.
 */
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

/**
 * Gets the RankTier for a specific muscle score
 */
export const getRankForScore = (muscle: MuscleGroup, score: number): RankTier => {
  const thresholds = MUSCLE_THRESHOLDS[muscle] || MUSCLE_THRESHOLDS.chest;

  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    if (score >= thresholds[i]) {
      return RANK_ORDER[i];
    }
  }
  return 'dirt';
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
    // Standard secondary muscle progress factor from 0.50 to 0.25 (per user request)
    return 0.25;
  }
};

/**
 * Automatically calibrates/sanitizes the difficulty multiplier for exercises
 * to prevent rank inflation on isolation/accessory muscle groups (e.g. calves/triceps).
 */
export const getCalibratedMultiplier = (mapping: MappedExercise): number => {
  const multiplier = mapping.difficultyMultiplier || 1.0;
  
  if (mapping.primaryMuscles.length > 0) {
    // 1. Standard isolation/accessory check (biceps, triceps, forearms, abs, obliques, calves, side/rear delts)
    const isAccessoryOnly = mapping.primaryMuscles.every(m => 
      m === 'biceps' || 
      m === 'triceps' || 
      m === 'forearms' || 
      m === 'abs' || 
      m === 'obliques' || 
      m === 'calves' || 
      m === 'side_delts' || 
      m === 'rear_delts'
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
  bodyweight: number = 70
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
    const isDumbbell = mapping.equipment
      ? mapping.equipment === 'dumbbell'
      : (nameLower.includes('dumbbell') || nameLower.includes('dumbell')
        || /\bdb\b/.test(nameLower) || nameLower.includes('d.b.')
        || nameLower.includes('hammer curl'));

    const processSet = (weight: number, reps: number, completedAt?: Date) => {
      // Apply Dumbbell Rule: Dumbbell Weight * 2 * 1.1 for stability
      let effectiveWeight = weight;
      if (isDumbbell && mapping.type === 'gym') {
        effectiveWeight = weight * 2 * 1.1;
      }

      const oneRM = calculate1RM(effectiveWeight, reps);
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

    if (mapping.type === 'gym') {
      const gymEx = ex as unknown as GymExercise;
      gymEx.sets.forEach(set => {
        if (set.completed && set.weight && !(set as any).isWarmup) {
          processSet(set.weight, set.reps, set.completedAt);
        }
      });
    } else if (mapping.type === 'calisthenics') {
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
      sets.forEach((s, index) => {
        if (s === maxSet) return; // Already counted as the base score

        let isSuperset = false;
        // If the set was completed within 45 seconds of the previous set for this muscle
        if (index > 0 && s.time > 0 && sets[index - 1].time > 0) {
          const diffMs = s.time - sets[index - 1].time;
          // Valid rest time < 45s (dropsets/supersets). Ignore < 1s to prevent batch-log bugs
          if (diffMs > 1000 && diffMs <= 45000) {
            isSuperset = true;
          }
        }

        // Superset/Dropset gets 50% accumulation. Normal volume gets 10%
        if (isSuperset) {
          totalMuscleScore += s.score * 0.5;
        } else {
          totalMuscleScore += s.score * 0.1;
        }

        // Cross-exercise superset bonus (metabolic stress from back-to-back exercises)
        if (s.isCrossExerciseSuperset) {
          totalMuscleScore += s.score * 0.15;
        }
      });

      // Apply intensity multiplier (rewards training hard)
      totalMuscleScore *= intensityMultiplier;

      updateMuscleScore(updatedStatuses, muscle, totalMuscleScore, workout.date);
    }
  });

  return updatedStatuses;
};

const updateMuscleScore = (
  statuses: Record<MuscleGroup, MuscleStatus>,
  muscle: MuscleGroup,
  newScore: number,
  date: string
) => {
  if (!statuses[muscle]) {
    statuses[muscle] = {
      muscle,
      currentScore: 0,
      bestScore: 0,
      rank: 'dirt',
      lastTrained: date
    };
  }

  const status = statuses[muscle];

  // Update last trained date
  status.lastTrained = date;

  // If this workout set a new high for current score
  if (newScore > status.currentScore) {
    status.currentScore = newScore;

    // Check if it's an all-time best
    if (newScore > status.bestScore) {
      status.bestScore = newScore;
    }

    // Update rank
    status.rank = getRankForScore(muscle, status.currentScore);
  }
};

/**
 * Applies weekly decay to muscle scores
 * Should be called whenever the app starts to check for missed workouts
 */
export const applyDecay = (
  statuses: Record<MuscleGroup, MuscleStatus>
): Record<MuscleGroup, MuscleStatus> => {
  const updatedStatuses = { ...statuses };
  const today = new Date(getTodayDate());
  const GRACE_PERIOD_DAYS = 21;
  const DECAY_RATE_WEEKLY = 0.02;

  Object.keys(updatedStatuses).forEach(m => {
    const muscle = m as MuscleGroup;
    const status = updatedStatuses[muscle];

    const lastTrained = new Date(status.lastTrained);
    const diffTime = Math.abs(today.getTime() - lastTrained.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > GRACE_PERIOD_DAYS) {
      // Calculate how many weeks over the grace period
      const decayWeeks = (diffDays - GRACE_PERIOD_DAYS) / 7;
      // Compound decay: score = current * (1 - rate)^weeks
      const decayFactor = Math.pow(1 - DECAY_RATE_WEEKLY, decayWeeks);

      status.currentScore = status.currentScore * decayFactor;
      status.rank = getRankForScore(muscle, status.currentScore);
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
  score: number
): MuscleProgress => {
  const thresholds = MUSCLE_THRESHOLDS[muscle] || MUSCLE_THRESHOLDS.chest;
  const currentRank = getRankForScore(muscle, score);
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
  const progressPercent = range > 0
    ? Math.min(100, Math.max(0, ((score - currentThreshold) / range) * 100))
    : 100;
  const pointsRemaining = Math.max(0, nextThreshold - score);

  return {
    currentRank,
    nextRank,
    progressPercent,
    pointsRemaining,
  };
};
