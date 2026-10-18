import {
  getSetNumbering,
  getLastWorkoutTopSet,
  formatTopSetDisplay,
} from '../workoutCardHelpers';

describe('workoutCardHelpers', () => {
  describe('getSetNumbering', () => {
    it('returns empty array for empty sets', () => {
      expect(getSetNumbering([])).toEqual([]);
    });

    it('numbers sequential working sets starting from 1', () => {
      const sets = [
        { isWarmup: false },
        { isWarmup: false },
        { isWarmup: undefined },
      ];
      const result = getSetNumbering(sets);
      expect(result).toEqual([
        { label: '1', isWarmup: false, workingIndex: 1 },
        { label: '2', isWarmup: false, workingIndex: 2 },
        { label: '3', isWarmup: false, workingIndex: 3 },
      ]);
    });

    it('labels warmups with W and does not increment working set numbers', () => {
      const sets = [
        { isWarmup: true },
        { isWarmup: true },
        { isWarmup: false },
        { isWarmup: false },
      ];
      const result = getSetNumbering(sets);
      expect(result).toEqual([
        { label: 'W', isWarmup: true },
        { label: 'W', isWarmup: true },
        { label: '1', isWarmup: false, workingIndex: 1 },
        { label: '2', isWarmup: false, workingIndex: 2 },
      ]);
    });

    it('handles interleaved warmup sets correctly', () => {
      const sets = [
        { isWarmup: false },
        { isWarmup: true },
        { isWarmup: false },
      ];
      const result = getSetNumbering(sets);
      expect(result).toEqual([
        { label: '1', isWarmup: false, workingIndex: 1 },
        { label: 'W', isWarmup: true },
        { label: '2', isWarmup: false, workingIndex: 2 },
      ]);
    });
  });

  describe('getLastWorkoutTopSet', () => {
    it('returns null for null, undefined, or empty history', () => {
      expect(getLastWorkoutTopSet('Bench Press', null)).toBeNull();
      expect(getLastWorkoutTopSet('Bench Press', undefined)).toBeNull();
      expect(getLastWorkoutTopSet('Bench Press', {})).toBeNull();
      expect(getLastWorkoutTopSet('Bench Press', [])).toBeNull();
    });

    it('returns null if the exercise is not present in history', () => {
      const history = {
        '2026-10-10': [
          {
            id: 'w1',
            date: '2026-10-10',
            exercises: [
              { name: 'Squat', sets: [{ reps: 5, weight: 200, isWarmup: false }] },
            ],
          },
        ],
      };
      expect(getLastWorkoutTopSet('Bench Press', history)).toBeNull();
    });

    it('ignores warmups and returns null if there are no working sets', () => {
      const history = {
        '2026-10-10': [
          {
            id: 'w1',
            date: '2026-10-10',
            exercises: [
              {
                name: 'Bench Press',
                sets: [
                  { reps: 10, weight: 100, isWarmup: true },
                  { reps: 5, weight: 135, isWarmup: true },
                ],
              },
            ],
          },
        ],
      };
      expect(getLastWorkoutTopSet('Bench Press', history)).toBeNull();
    });

    it('picks the most recent workout and finds the top working set by weight', () => {
      const history = {
        '2026-10-01': [
          {
            id: 'w_old',
            date: '2026-10-01',
            exercises: [
              {
                name: 'Bench Press',
                sets: [{ reps: 10, weight: 250, isWarmup: false }],
              },
            ],
          },
        ],
        '2026-10-10': [
          {
            id: 'w_recent',
            date: '2026-10-10',
            exercises: [
              {
                name: 'Bench Press',
                sets: [
                  { reps: 10, weight: 135, isWarmup: true },
                  { reps: 8, weight: 185, isWarmup: false },
                  { reps: 5, weight: 205, isWarmup: false },
                  { reps: 8, weight: 185, isWarmup: false },
                ],
              },
            ],
          },
        ],
      };

      const topSet = getLastWorkoutTopSet('Bench Press', history);
      expect(topSet).toEqual({ weight: 205, reps: 5 });
    });

    it('breaks ties in weight with higher reps', () => {
      const history = {
        '2026-10-10': [
          {
            id: 'w1',
            date: '2026-10-10',
            exercises: [
              {
                name: 'Overhead Press',
                sets: [
                  { reps: 6, weight: 135, isWarmup: false },
                  { reps: 8, weight: 135, isWarmup: false },
                  { reps: 5, weight: 135, isWarmup: false },
                ],
              },
            ],
          },
        ],
      };

      const topSet = getLastWorkoutTopSet('overhead press', history);
      expect(topSet).toEqual({ weight: 135, reps: 8 });
    });
  });

  describe('formatTopSetDisplay', () => {
    it('returns null if topSet is null', () => {
      expect(formatTopSetDisplay(null, 'metric')).toBeNull();
    });

    it('formats imperial weight properly', () => {
      expect(formatTopSetDisplay({ weight: 135, reps: 10 }, 'imperial')).toBe('135 lbs x 10');
    });

    it('formats metric weight converted from internal lbs storage', () => {
      // 132.277 lbs approx 60 kg (lbsToKg = 132.277 * 0.453592)
      // 60 / 0.453592 = 132.2773
      const weightLbs = 60 / 0.453592;
      expect(formatTopSetDisplay({ weight: weightLbs, reps: 8 }, 'metric')).toBe('60 kg x 8');
    });
  });
});
