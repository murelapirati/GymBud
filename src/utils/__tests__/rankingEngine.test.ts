import { calculate1RM, getRankForScore, processWorkoutForRanks, applyDecay } from '../rankingEngine';
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

    it('calculates 1RM using Epley formula for >1 reps', () => {
      // 100 * (1 + 10/30) = 100 * (1 + 0.333...) = 133.333...
      expect(calculate1RM(100, 10)).toBeCloseTo(133.33, 1);
    });
  });

  describe('getRankForScore', () => {
    it('returns dirt for a score of 0', () => {
      expect(getRankForScore('chest', 0)).toBe('dirt');
    });

    it('returns wood for a score of 20 (chest is 1.0 factor)', () => {
      expect(getRankForScore('chest', 20)).toBe('wood');
    });

    it('returns correct rank for muscles with different factors (e.g. biceps 0.45)', () => {
      // Biceps factor is 0.45.
      // Base wood threshold is 20. Biceps wood threshold is 20 * 0.45 = 9.
      expect(getRankForScore('biceps', 9)).toBe('wood');
      
      // Base diamond threshold is 100. Biceps diamond threshold is 100 * 0.45 = 45.
      expect(getRankForScore('biceps', 45)).toBe('diamond');
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
});
