import { Workout, GymExercise, CalisthenicsExercise, MappedExercise, MuscleGroup, RankTier, MuscleStatus } from '../types';
import { PREDEFINED_EXERCISES } from '../data/exercises';
import { getTodayDate } from './date';

// Baseline thresholds for a "Standard" muscle group (e.g. Chest)
// Ranks: Dirt, Wood, Iron, Bronze, Gold, Diamond, Emerald, Master, Olympian
const BASE_THRESHOLDS: number[] = [0, 20, 40, 60, 80, 100, 125, 150, 175];

const RANK_ORDER: RankTier[] = [
  'dirt', 'wood', 'iron', 'bronze',
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
 * Calculates Estimated 1RM using Epley formula with RPE/RIR adjustment
 */
export const calculate1RM = (weight: number, reps: number, intensity: number = 5): number => {
  if (reps === 0) return 0;

  // RIR (Reps in Reserve) Adjusted Max
  // e.g. 10/10 effort = 0 RIR, 9/10 = 1 RIR, etc.
  const rir = Math.max(0, 10 - intensity);
  const effectiveReps = reps + rir;

  if (effectiveReps === 1) return weight;
  return weight * (1 + effectiveReps / 30);
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

  // Intensity factor (baseline is 5/10)
  const intensity = workout.intensity || 5;
  const intensityFactor = 1.0; // We now use RIR inside calculate1RM instead of multiplying score

  // Collect all set scores chronologically to detect rest times
  interface ScoredSet {
    muscles: { muscle: MuscleGroup, factor: number }[];
    score: number;
    time: number;
  }
  const allSets: ScoredSet[] = [];

  workout.exercises.forEach((ex) => {
    // Find exercise definition to get muscle mapping and multiplier
    const mapping = allAvailableExercises.find(m => m.name === ex.name);
    if (!mapping) return;

    const multiplier = mapping.difficultyMultiplier || 1.0;
    const isDumbbell = mapping.name.toLowerCase().includes('dumbbell') || mapping.name.toLowerCase().includes('dumbell');

    const processSet = (weight: number, reps: number, completedAt?: Date) => {
      // Apply Dumbbell Rule: Dumbbell Weight * 2 * 1.1 for stability
      let effectiveWeight = weight;
      if (isDumbbell && mapping.type === 'gym') {
        effectiveWeight = weight * 2 * 1.1;
      }

      const oneRM = calculate1RM(effectiveWeight, reps, intensity);
      const score = oneRM * multiplier;

      if (score > 0) {
        const musclesToUpdate: { muscle: MuscleGroup, factor: number }[] = [];
        mapping.primaryMuscles.forEach(m => musclesToUpdate.push({ muscle: m, factor: 1.0 }));
        mapping.secondaryMuscles.forEach(m => musclesToUpdate.push({ muscle: m, factor: 0.5 }));

        allSets.push({
          muscles: musclesToUpdate,
          score,
          time: completedAt ? new Date(completedAt).getTime() : 0
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
      const BASE_BODYWEIGHT = 70;
      caliEx.sets.forEach(set => {
        if (set.completed && !(set as any).isWarmup) {
          const effectiveWeight = BASE_BODYWEIGHT + (set.extraWeight || 0);
          processSet(effectiveWeight, set.reps, set.completedAt);
        }
      });
    }
  });

  // Sort sets chronologically
  allSets.sort((a, b) => a.time - b.time);

  // Group by muscle group
  const muscleScores: Partial<Record<MuscleGroup, { score: number, time: number }[]>> = {};
  allSets.forEach(s => {
    s.muscles.forEach(({ muscle, factor }) => {
      if (!muscleScores[muscle]) muscleScores[muscle] = [];
      muscleScores[muscle]!.push({ score: s.score * factor, time: s.time });
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
      });

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
