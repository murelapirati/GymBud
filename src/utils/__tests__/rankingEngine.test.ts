import { calculate1RM, getRankForScore, processWorkoutForRanks, applyDecay, getMuscleProgress, recalculateAllScoresFromHistory } from '../rankingEngine';
import { MuscleGroup, MuscleStatus, Workout } from '../../types';
import { getTodayDate } from '../date';

jest.mock('../date', () => ({
  getTodayDate: jest.fn(),
}));

describe('rankingEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getTodayDate as jest.Mock).mockReturnValue('2026-04-28');
  });

  describe('calculate1RM', () => {
    it('returns 0 for 0 reps', () => {
      expect(calculate1RM(100, 0)).toBe(0);
    });

    it('returns the weight for 1 rep', () => {
      expect(calculate1RM(100, 1)).toBe(100);
    });

    it('calculates 1RM using pure Epley formula for >1 reps', () => {
      // 100 * (1 + 10/30) = 100 * 1.333 = 133.333...
      expect(calculate1RM(100, 10)).toBeCloseTo(133.33, 1);
    });

    it('scales linearly with weight', () => {
      // 60 * (1 + 8/30) = 60 * 1.267 = 76.0
      expect(calculate1RM(60, 8)).toBeCloseTo(76.0, 1);
    });
  });

  describe('getRankForScore', () => {
    it('returns dirt for a score of 0', () => {
      expect(getRankForScore('chest', 0)).toBe('dirt');
    });

    it('returns wood for a score of 10 (chest is 1.0 factor)', () => {
      // New thresholds: [0, 10, 25, 40, 55, 80, 115, 165, 225]
      expect(getRankForScore('chest', 10)).toBe('wood');
      expect(getRankForScore('chest', 24)).toBe('wood');
    });

    it('returns iron for a score of 25 (chest)', () => {
      expect(getRankForScore('chest', 25)).toBe('iron');
    });

    it('returns correct rank for muscles with different thresholds (e.g. biceps)', () => {
      // Biceps wood threshold is 3.
      expect(getRankForScore('biceps', 3.1)).toBe('wood');
      
      // Biceps diamond threshold is 28.
      expect(getRankForScore('biceps', 29)).toBe('diamond');
    });
  });

  describe('applyDecay', () => {
    it('does not apply decay if within grace period (21 days)', () => {
      const statuses: Record<MuscleGroup, MuscleStatus> = {
        chest: {
          muscle: 'chest',
          currentScore: 100,
          bestScore: 100,
          rank: 'diamond',
          lastTrained: '2026-04-10', // 18 days ago
        }
      } as Record<MuscleGroup, MuscleStatus>;

      const decayed = applyDecay(statuses);
      expect(decayed.chest.currentScore).toBe(100);
    });

    it('applies decay if outside grace period', () => {
      const statuses: Record<MuscleGroup, MuscleStatus> = {
        chest: {
          muscle: 'chest',
          currentScore: 100,
          bestScore: 100,
          rank: 'diamond',
          lastTrained: '2026-03-01', // 58 days ago
        }
      } as Record<MuscleGroup, MuscleStatus>;

      // 58 days ago -> 58 - 21 = 37 days over grace period -> 37 / 7 = 5.28 weeks
      const decayed = applyDecay(statuses);
      expect(decayed.chest.currentScore).toBeLessThan(100);
    });
  });

  describe('processWorkoutForRanks', () => {
    it('applies 0.08 factor to secondary muscles instead of 0.25', () => {
      // Create a gym workout for chest (primary) and triceps/front_delts (secondary)
      // Barbell Bench Press: multiplier 1.0. Primary: chest, Secondary: front_delts, triceps.
      const workout: Workout = {
        id: 'w_1',
        date: '2026-04-28',
        intensity: 7, // 0.6 + Math.pow(7/10, 1.5) * 0.65 = 0.6 + 0.58564 * 0.65 = 0.98066
        exercises: [
          {
            id: 'we_1',
            name: 'Barbell Bench Press',
            type: 'gym',
            sets: [
              {
                id: 's_1',
                reps: 10,
                weight: 100, // 1RM = 100 * (1 + 10/30) = 133.33
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const updated = processWorkoutForRanks(workout, initialStatuses);

      // Intensity multiplier = 0.6 + Math.pow(7/10, 1.5) * 0.65 = 0.98066
      // Base score = 133.33 * 1.0 (multiplier) = 133.33
      // Primary (chest) factor = 1.0 -> score = 133.33 * 1.0 * 0.98066 = 130.75
      // Secondary (triceps) factor = 0.08 -> score = 133.33 * 0.08 * 0.98066 = 10.46
      expect(updated.chest.currentScore).toBeCloseTo(130.75, 1);
      expect(updated.triceps.currentScore).toBeCloseTo(10.46, 1);
    });

    it('scales calisthenics using biomechanical load and custom compound contribution for Dips', () => {
      // Dips: difficultyMultiplier 0.8. Type: calisthenics.
      // Primary: chest, triceps. Secondary: front_delts.
      // Dips bodyweight factor = 0.85. Base bodyweight = 70.
      // Effective bodyweight = 70 * 0.85 = 59.5.
      // Workout with 10 reps, 10kg extra weight.
      // Total effective weight = 59.5 + 10 = 69.5.
      // 1RM = 69.5 * (1 + 10/30) = 92.67.
      // Base score = 92.67 * 0.8 = 74.13.
      // Workout intensity = 10 (multiplier = 0.6 + 1.0 * 0.65 = 1.25).
      // Overall set score = 74.13.
      // Primary contribution: chest = 0.70, triceps = 0.50.
      // Chest score = 74.13 * 0.70 * 1.25 = 64.86.
      // Triceps score = 74.13 * 0.50 * 1.25 = 46.33.
      const workout: Workout = {
        id: 'w_2',
        date: '2026-04-28',
        intensity: 10,
        exercises: [
          {
            id: 'we_2',
            name: 'Dips',
            type: 'calisthenics',
            sets: [
              {
                id: 's_2',
                reps: 10,
                extraWeight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const updated = processWorkoutForRanks(workout, initialStatuses);

      expect(updated.chest.currentScore).toBeCloseTo(64.86, 1);
      expect(updated.triceps.currentScore).toBeCloseTo(46.33, 1);
    });

    it('uses the custom bodyweight parameter when provided for calisthenics scaling', () => {
      // Dips with bodyweight 100 kg instead of default 70 kg.
      // Dips bodyweight factor = 0.85. Custom bodyweight = 100.
      // Effective bodyweight = 100 * 0.85 = 85.
      // Workout with 10 reps, 10kg extra weight.
      // Total effective weight = 85 + 10 = 95.
      // 1RM = 95 * (1 + 10/30) = 126.67.
      // Base score = 126.67 * 0.8 = 101.33.
      // Workout intensity = 10 (multiplier = 1.25).
      // Primary contribution: chest = 0.70, triceps = 0.50.
      // Chest score = 101.33 * 0.70 * 1.25 = 88.66.
      // Triceps score = 101.33 * 0.50 * 1.25 = 63.33.
      const workout: Workout = {
        id: 'w_3',
        date: '2026-04-28',
        intensity: 10,
        exercises: [
          {
            id: 'we_3',
            name: 'Dips',
            type: 'calisthenics',
            sets: [
              {
                id: 's_3',
                reps: 10,
                extraWeight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const updated = processWorkoutForRanks(workout, initialStatuses, [], 100);

      expect(updated.chest.currentScore).toBeCloseTo(88.66, 1);
      expect(updated.triceps.currentScore).toBeCloseTo(63.33, 1);
    });

    it('applies a lower 0.10 factor to secondary stabilizers (abs, obliques, lower_back, forearms)', () => {
      // Barbell Squat: multiplier 1.1. Primary: quads, glutes. Secondary: hamstrings, lower_back, abs.
      // Abs and lower_back are stabilizers, so they should get 0.10. Hamstrings is standard secondary, so 0.08.
      const workout: Workout = {
        id: 'w_4',
        date: '2026-04-28',
        intensity: 10, // multiplier = 1.25
        exercises: [
          {
            id: 'we_4',
            name: 'Barbell Squat',
            type: 'gym',
            sets: [
              {
                id: 's_4',
                reps: 10,
                weight: 100, // 1RM = 100 * 1.33 = 133.33. Score = 133.33 * 1.1 = 146.67
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const updated = processWorkoutForRanks(workout, initialStatuses);

      // Score = 146.67 * 1.25 = 183.33
      // Hamstrings (secondary) factor = 0.08 -> score = 183.33 * 0.08 = 14.67
      // Abs (secondary stabilizer) factor = 0.10 -> score = 183.33 * 0.10 = 18.33
      // Lower back (secondary stabilizer) factor = 0.10 -> score = 183.33 * 0.10 = 18.33
      expect(updated.hamstrings.currentScore).toBeCloseTo(14.67, 1);
      expect(updated.abs.currentScore).toBeCloseTo(18.33, 1);
      expect(updated.lower_back.currentScore).toBeCloseTo(18.33, 1);
    });

    it('clamps custom exercise difficulty multiplier to 0.5 (or 0.4 for calves) when they are accessory/isolation only', () => {
      const customCalvesEx = {
        id: 'custom_calves',
        name: 'Custom Calf Press',
        type: 'gym',
        primaryMuscles: ['calves'],
        secondaryMuscles: [],
        difficultyMultiplier: 1.0, // inflated! Should clamp to 0.4
      } as any;

      const customTricepsEx = {
        id: 'custom_triceps',
        name: 'Custom Tricep Pushdown',
        type: 'gym',
        primaryMuscles: ['triceps'],
        secondaryMuscles: [],
        difficultyMultiplier: 1.0, // inflated! Should clamp to 0.5
      } as any;

      const customCompoundEx = {
        id: 'custom_compound',
        name: 'Custom Overhead Press',
        type: 'gym',
        primaryMuscles: ['front_delts', 'chest'], // Chest is compound, so not accessory-only!
        secondaryMuscles: [],
        difficultyMultiplier: 1.0, // Should NOT clamp
      } as any;

      const workout: Workout = {
        id: 'w_custom',
        date: '2026-04-28',
        intensity: 5, // multiplier = 1.0 (approx, specifically intensity 5 is 0.6 + (0.5^1.5)*0.65 = 0.83)
        exercises: [
          {
            id: 'we_c1',
            name: 'Custom Calf Press',
            type: 'gym',
            sets: [
              {
                id: 's_c1',
                reps: 10,
                weight: 100, // 1RM = 100 * 1.33 = 133.33
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          },
          {
            id: 'we_c2',
            name: 'Custom Tricep Pushdown',
            type: 'gym',
            sets: [
              {
                id: 's_c2',
                reps: 10,
                weight: 100, // 1RM = 133.33
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          },
          {
            id: 'we_c3',
            name: 'Custom Overhead Press',
            type: 'gym',
            sets: [
              {
                id: 's_c3',
                reps: 10,
                weight: 100, // 1RM = 133.33
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const customExercises = [customCalvesEx, customTricepsEx, customCompoundEx];
      const updated = processWorkoutForRanks(workout, initialStatuses, customExercises);

      // Verify that Calf Press got clamped to 0.4 difficultyMultiplier
      // 1RM = 133.33. Clamped Multiplier = 0.4. Score = 133.33 * 0.4 = 53.33. Intensity mult = 0.83.
      // Total score = 53.33 * 0.83 = 44.25
      expect(updated.calves.currentScore).toBeCloseTo(44.25, 0.5);

      // Verify that Tricep Pushdown got clamped to 0.5 difficultyMultiplier
      // 1RM = 133.33. Clamped Multiplier = 0.5. Score = 133.33 * 0.5 = 66.67. Intensity mult = 0.83.
      // Total score = 66.67 * 0.83 = 55.33
      expect(updated.triceps.currentScore).toBeCloseTo(55.33, 0.5);

      // Verify that Custom Compound got 1.0 difficultyMultiplier (unclamped)
      // 1RM = 133.33. Multiplier = 1.0. Score = 133.33 * 1.0 = 133.33. Intensity mult = 0.83.
      // Total score = 133.33 * 0.83 = 110.66
      expect(updated.chest.currentScore).toBeCloseTo(110.66, 0.5);
    });

    it('clamps leg isolation custom exercises (quads-only, hamstrings-only to 0.5, glutes-only to 0.6)', () => {
      const customQuadsEx = {
        id: 'custom_quads',
        name: 'Custom Leg Extension',
        type: 'gym',
        primaryMuscles: ['quads'],
        secondaryMuscles: [],
        difficultyMultiplier: 1.0, // Should clamp to 0.5
      } as any;

      const customGlutesEx = {
        id: 'custom_glutes',
        name: 'Custom Glute Kickback',
        type: 'gym',
        primaryMuscles: ['glutes'],
        secondaryMuscles: [],
        difficultyMultiplier: 1.0, // Should clamp to 0.6
      } as any;

      const workout: Workout = {
        id: 'w_custom_leg',
        date: '2026-04-28',
        intensity: 5, // multiplier = 0.83
        exercises: [
          {
            id: 'we_cl1',
            name: 'Custom Leg Extension',
            type: 'gym',
            sets: [
              {
                id: 's_cl1',
                reps: 10,
                weight: 100, // 1RM = 133.33
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          },
          {
            id: 'we_cl2',
            name: 'Custom Glute Kickback',
            type: 'gym',
            sets: [
              {
                id: 's_cl2',
                reps: 10,
                weight: 100, // 1RM = 133.33
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const customExercises = [customQuadsEx, customGlutesEx];
      const updated = processWorkoutForRanks(workout, initialStatuses, customExercises);

      // Quads: clamped to 0.5. Score = 133.33 * 0.5 = 66.67 * 0.83 = 55.33
      expect(updated.quads.currentScore).toBeCloseTo(55.33, 0.5);

      // Glutes: clamped to 0.6. Score = 133.33 * 0.6 = 80.00 * 0.83 = 66.40
      expect(updated.glutes.currentScore).toBeCloseTo(66.40, 0.5);
    });

    it('applies superset bonus only to shared muscles when isolation is followed by compound', () => {
      // Dips is compound (chest, triceps, front_delts).
      // Flyes is isolation (chest).
      // Case A: Chest Flyes -> Dips in 30s. Shared muscle = chest.
      // Chest Flyes: intensity 5 (mult = 0.83). reps 10, weight 10. 1RM = 13.33. difficultyMultiplier = 0.65.
      // Dips: extraWeight 10, bodyweight 70. factor = 0.85. effective = 59.5 + 10 = 69.5. reps 10. 1RM = 92.67. difficultyMultiplier = 0.8.
      // Dips chest score = 92.67 * 0.8 * 0.70 = 51.89.
      // Flyes chest score = 13.33 * 0.65 = 8.66.
      // They share chest, flyes (isolation) is first, dips (compound) is second.
      // So chest gets the superset bonus: dips (maxSet) * 1.15 + flyes * 0.15 = 51.89 * 1.15 + 8.66 * 0.15 = 59.67 + 1.30 = 60.97.
      // Intensity multiplier = 0.83 -> 60.97 * 0.83 = 50.6.
      // Triceps (trained by Dips) is NOT shared. So it does NOT get any superset bonus.
      const workout: Workout = {
        id: 'w_ss_1',
        date: '2026-04-28',
        intensity: 5,
        exercises: [
          {
            id: 'we_ss1',
            name: 'Chest Flyes (Dumbbell/Cable)',
            type: 'gym',
            sets: [
              {
                id: 's_ss1',
                reps: 10,
                weight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          },
          {
            id: 'we_ss2',
            name: 'Dips',
            type: 'calisthenics',
            sets: [
              {
                id: 's_ss2',
                reps: 10,
                extraWeight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:30Z'), // 30s later
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const updated = processWorkoutForRanks(workout, initialStatuses);

      expect(updated.chest.currentScore).toBeGreaterThan(0);
      // Triceps score should be normal: 1RM=92.67. difficultyMultiplier=0.8. triceps factor=0.5.
      // base = 92.67 * 0.8 * 0.50 = 37.07. intensity = 0.83 -> 37.07 * 0.83 = 30.76.
      expect(updated.triceps.currentScore).toBeCloseTo(30.76, 1.0);
    });

    it('does not apply superset bonus when compound is followed by isolation', () => {
      // Dips -> Chest Flyes. Earlier is compound, later is isolation. No bonus.
      const workout: Workout = {
        id: 'w_ss_2',
        date: '2026-04-28',
        intensity: 5,
        exercises: [
          {
            id: 'we_ss3',
            name: 'Dips',
            type: 'calisthenics',
            sets: [
              {
                id: 's_ss3',
                reps: 10,
                extraWeight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          },
          {
            id: 'we_ss4',
            name: 'Chest Flyes (Dumbbell/Cable)',
            type: 'gym',
            sets: [
              {
                id: 's_ss4',
                reps: 10,
                weight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:30Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const initialStatuses = {} as Record<MuscleGroup, MuscleStatus>;
      const updated = processWorkoutForRanks(workout, initialStatuses);

      // Chest score without cross-exercise superset bonus:
      // Dips chest score = 92.67 * 0.8 * 0.70 = 51.89 (maxSet).
      // Flyes chest score = (10 * 2 * 1.1) * 1.33 * 0.65 = 19.07.
      // Flyes is superset volume (within 45s) -> 19.07 * 0.15 = 2.86.
      // Total = 51.89 + 2.86 = 54.75.
      // Intensity = 0.83 -> 54.75 * 0.83 = 45.43.
      expect(updated.chest.currentScore).toBeCloseTo(45.43, 1.0);
    });

    it('scales calisthenics score based on bodyweight', () => {
      const workout: Workout = {
        id: 'w_bw_1',
        date: '2026-04-28',
        intensity: 5,
        exercises: [
          {
            id: 'we_bw1',
            name: 'Push-ups',
            type: 'calisthenics',
            sets: [
              {
                id: 's_bw1',
                reps: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const updatedLighter = processWorkoutForRanks(workout, {} as any, [], 60);
      const updatedHeavier = processWorkoutForRanks(workout, {} as any, [], 90);

      expect(updatedHeavier.chest.currentScore).toBeGreaterThan(updatedLighter.chest.currentScore);
    });

    it('calculates getMuscleProgress correctly', () => {
      // Chest thresholds: [0, 10, 25, 40, 55, 80, 115, 165, 225]
      // For score 30: index should be iron (25). next rank is bronze (40).
      // Percent = (30 - 25) / (40 - 25) = 5 / 15 = 33.33%
      // Remaining = 40 - 30 = 10 pts.
      const progress = getMuscleProgress('chest', 30);
      expect(progress.currentRank).toBe('iron');
      expect(progress.nextRank).toBe('bronze');
      expect(progress.progressPercent).toBeCloseTo(33.33, 1);
      expect(progress.pointsRemaining).toBe(10);
    });

    it('applies dumbbell weight scaling (Weight * 2 * 1.1) for dumbbell equipment typed exercises and name-sniffing fallback', () => {
      // Exercise A: Dumbbell Curl (equipment: 'dumbbell' in exercises.ts)
      // reps: 10, weight: 10.
      // Since it is dumbbell, effective weight = 10 * 2 * 1.1 = 22.
      // 1RM = 22 * (1 + 10/30) = 29.33.
      // Biceps multiplier = 0.45. Score = 29.33 * 0.45 = 13.2.
      // Intensity 5 -> mult = 0.83.
      // Expected biceps score = 13.2 * 0.83 = 10.95.
      const workout: Workout = {
        id: 'w_db_1',
        date: '2026-04-28',
        intensity: 5,
        exercises: [
          {
            id: 'we_db1',
            name: 'Dumbbell Curl',
            type: 'gym',
            sets: [
              {
                id: 's_db1',
                reps: 10,
                weight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const updated = processWorkoutForRanks(workout, {} as any);
      expect(updated.biceps.currentScore).toBeCloseTo(10.95, 0.5);

      // Exercise B: Custom exercise with no equipment field but name has 'db'
      const customDbEx = {
        id: 'custom_db_ex',
        name: 'Hammer DB Press',
        type: 'gym',
        primaryMuscles: ['chest'],
        secondaryMuscles: [],
        difficultyMultiplier: 1.0,
      } as any;

      const workout2: Workout = {
        id: 'w_db_2',
        date: '2026-04-28',
        intensity: 5,
        exercises: [
          {
            id: 'we_db2',
            name: 'Hammer DB Press',
            type: 'gym',
            sets: [
              {
                id: 's_db2',
                reps: 10,
                weight: 10,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const updated2 = processWorkoutForRanks(workout2, {} as any, [customDbEx]);
      // Should fallback to name-sniffing and apply dumbbell mult
      // Weight = 10 * 2 * 1.1 = 22. 1RM = 29.33. Score = 29.33 * 1.0 * 0.83 = 24.34.
      expect(updated2.chest.currentScore).toBeCloseTo(24.34, 0.5);
    });

    it('applies exponential decay for volume (diminishing returns) on successive sets', () => {
      // 3 sets of bench press (100kg x 10 reps). All completed 2 minutes apart (no superset).
      // 1RM = 133.33. Score = 133.33 * 1.0 = 133.33.
      // Intensity 5 -> mult = 0.83.
      // maxSet score = 133.33.
      // Extra set 1 (index 1): score = 133.33. decayBonus = 0.15 * Math.pow(0.4, 0) = 0.15.
      // Extra set 2 (index 2): score = 133.33. decayBonus = 0.15 * Math.pow(0.4, 1) = 0.06.
      // Total score before intensity = 133.33 * (1 + 0.15 + 0.06) = 133.33 * 1.21 = 161.33.
      // Total score = 161.33 * 0.83 = 133.9.
      const workout: Workout = {
        id: 'w_vol_decay',
        date: '2026-04-28',
        intensity: 5,
        exercises: [
          {
            id: 'we_vol_1',
            name: 'Barbell Bench Press',
            type: 'gym',
            sets: [
              {
                id: 's_v1',
                reps: 10,
                weight: 100,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              },
              {
                id: 's_v2',
                reps: 10,
                weight: 100,
                completed: true,
                completedAt: new Date('2026-04-28T10:02:00Z'),
              },
              {
                id: 's_v3',
                reps: 10,
                weight: 100,
                completed: true,
                completedAt: new Date('2026-04-28T10:04:00Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const updated = processWorkoutForRanks(workout, {} as any);
      expect(updated.chest.currentScore).toBeCloseTo(133.9, 1.0);
    });

    it('correctly detects index 0 as superset if followed by a compound/same-muscle set within 45s', () => {
      // Let's do Bench Press set 1 (100kg x 10 reps) at 10:00:00 and Bench Press set 2 (100kg x 10 reps) at 10:00:30.
      // Both sets should be marked as superset.
      // Set 1 (maxSet): 133.33.
      // Set 2 (extra set): 133.33. decayBonus = 0.15 (because it is superset).
      // Total score before intensity = 133.33 * 1.15 = 153.33.
      // Intensity 5 -> 153.33 * 0.83 = 127.2.
      const workout: Workout = {
        id: 'w_ss_index0',
        date: '2026-04-28',
        intensity: 5,
        exercises: [
          {
            id: 'we_ss_i1',
            name: 'Barbell Bench Press',
            type: 'gym',
            sets: [
              {
                id: 's_ss_i1',
                reps: 10,
                weight: 100,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:00Z'),
              },
              {
                id: 's_ss_i2',
                reps: 10,
                weight: 100,
                completed: true,
                completedAt: new Date('2026-04-28T10:00:30Z'),
              }
            ]
          }
        ]
      } as unknown as Workout;

      const updated = processWorkoutForRanks(workout, {} as any);
      expect(updated.chest.currentScore).toBeCloseTo(127.2, 1.0);
    });
  });

  describe('recalculateAllScoresFromHistory', () => {
    it('correctly recalculates scores chronologically from history', () => {
      // Workout 1: Bench Press on 2026-04-01
      // Workout 2: Bench Press on 2026-04-25 (24 days later -> decay should be applied)
      const workouts: Workout[] = [
        {
          id: 'w_h1',
          date: '2026-04-25',
          intensity: 5,
          exercises: [
            {
              id: 'we_h1',
              name: 'Barbell Bench Press',
              type: 'gym',
              sets: [
                {
                  id: 's_h1',
                  reps: 10,
                  weight: 100,
                  completed: true,
                  completedAt: new Date('2026-04-25T10:00:00Z'),
                }
              ]
            }
          ]
        },
        {
          id: 'w_h2',
          date: '2026-04-01',
          intensity: 5,
          exercises: [
            {
              id: 'we_h2',
              name: 'Barbell Bench Press',
              type: 'gym',
              sets: [
                {
                  id: 's_h2',
                  reps: 10,
                  weight: 100,
                  completed: true,
                  completedAt: new Date('2026-04-01T10:00:00Z'),
                }
              ]
            }
          ]
        }
      ] as unknown as Workout[];

      // Mock date is 2026-04-28.
      // Recalculating should:
      // 1. Sort workouts: 2026-04-01 first, then 2026-04-25.
      // 2. Process 2026-04-01: Bench press chest score = 133.33 * 0.83 = 110.66.
      // 3. Process 2026-04-25:
      //    a. Apply decay: last trained 2026-04-01. reference date 2026-04-25.
      //       diffDays = 24 days. grace period = 21 days.
      //       over grace period = 3 days = 3/7 = 0.428 weeks.
      //       decayFactor = Math.pow(0.98, 0.428) = 0.991.
      //       decayedScore = 110.66 * 0.991 = 109.66.
      //    b. Process workout: Bench press chest score = 110.66.
      //       It is higher than decayedScore (109.66), so chest score is updated to 110.66.
      // 4. Final decay to 2026-04-28 (today):
      //    last trained 2026-04-25. today 2026-04-28.
      //    diffDays = 3 days. Within grace period (21 days), so no decay.
      //    Final chest score = 110.66.
      const statuses = recalculateAllScoresFromHistory(workouts, [], 70);
      expect(statuses.chest.currentScore).toBeCloseTo(110.66, 1.0);
    });
  });
});
