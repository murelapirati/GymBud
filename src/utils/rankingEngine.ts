import { Workout, GymExercise, CalisthenicsExercise, MappedExercise, MuscleGroup, RankTier, MuscleStatus } from '../types';
import { PREDEFINED_EXERCISES } from '../data/exercises';
import { getTodayDate } from './date';

// Baseline thresholds for a "Standard" muscle group (e.g. Chest)
// Ranks: Dirt, Wood, Stone, Iron, Bronze, Gold, Diamond, Platinum, Master, Olympian
const BASE_THRESHOLDS: number[] = [0, 15, 30, 45, 60, 75, 95, 115, 135, 155];

const RANK_ORDER: RankTier[] = [
  'dirt', 'wood', 'stone', 'iron', 'bronze', 
  'gold', 'diamond', 'emerald', 'master', 'olympian'
];

// Potential factor for each muscle group relative to Chest
const MUSCLE_FACTORS: Record<MuscleGroup, number> = {
  chest: 1.0,
  lats: 1.1,
  upper_back: 1.1,
  lower_back: 1.2,
  front_delts: 0.8,
  side_delts: 0.6,
  rear_delts: 0.6,
  biceps: 0.45,
  triceps: 0.5,
  forearms: 0.4,
  abs: 0.4,
  obliques: 0.4,
  quads: 1.25,
  hamstrings: 1.1,
  glutes: 1.2,
  calves: 0.5,
};

/**
 * Calculates Estimated 1RM using Epley formula
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
  const factor = MUSCLE_FACTORS[muscle] || 1.0;
  
  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    if (score >= BASE_THRESHOLDS[i] * factor) {
      return RANK_ORDER[i];
    }
  }
  return 'dirt';
};

/**
 * Processes a completed workout and updates muscle rankings
 */
export const processWorkoutForRanks = (
  workout: Workout,
  currentStatuses: Record<MuscleGroup, MuscleStatus>,
  customExercises: MappedExercise[] = []
): Record<MuscleGroup, MuscleStatus> => {
  const updatedStatuses = { ...currentStatuses };
  const allAvailableExercises = [...PREDEFINED_EXERCISES, ...customExercises];
  
  // Intensity factor (baseline is 7/10)
  const intensity = workout.intensity || 7;
  const intensityFactor = 1.0 + (intensity - 7) * 0.05;

  workout.exercises.forEach((ex) => {
    // Find exercise definition to get muscle mapping and multiplier
    const mapping = allAvailableExercises.find(m => m.name === ex.name);
    if (!mapping) return;

    const multiplier = mapping.difficultyMultiplier || 1.0;
    let maxExerciseScore = 0;

    // Calculate max score for this exercise in this workout
    // Currently only gym and calisthenics contribute to strength rank
    if (mapping.type === 'gym') {
      const gymEx = ex as unknown as GymExercise;
      gymEx.sets.forEach(set => {
        if (set.completed && set.weight) {
          const oneRM = calculate1RM(set.weight, set.reps);
          const score = oneRM * multiplier * intensityFactor;
          if (score > maxExerciseScore) maxExerciseScore = score;
        }
      });
    } else if (mapping.type === 'calisthenics') {
      const caliEx = ex as unknown as CalisthenicsExercise;
      // For calisthenics, we assume a baseline weight of 70kg for calculations
      // plus any extra weight added.
      const BASE_BODYWEIGHT = 70;
      caliEx.sets.forEach(set => {
        if (set.completed) {
          const effectiveWeight = BASE_BODYWEIGHT + (set.extraWeight || 0);
          const oneRM = calculate1RM(effectiveWeight, set.reps);
          const score = oneRM * multiplier * intensityFactor;
          if (score > maxExerciseScore) maxExerciseScore = score;
        }
      });
    }

    if (maxExerciseScore > 0) {
      // Update primary muscles (100% contribution)
      mapping.primaryMuscles.forEach(muscle => {
        updateMuscleScore(updatedStatuses, muscle, maxExerciseScore, workout.date);
      });
      // Update secondary muscles (50% contribution)
      mapping.secondaryMuscles.forEach(muscle => {
        updateMuscleScore(updatedStatuses, muscle, maxExerciseScore * 0.5, workout.date);
      });
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
