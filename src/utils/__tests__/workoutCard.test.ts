import {
  getSetNumbering,
  getLastWorkoutTopSet,
  formatTopSetDisplay,
} from '../workoutCard';

describe('workoutCard getSetNumbering and warmup toggling', () => {
  it('re-calculates numbering when first set is toggled between warm-up and working', () => {
    // Initial 3 working sets: 1, 2, 3
    const sets = [
      { id: 's1', reps: 10, weight: 50, isWarmup: false },
      { id: 's2', reps: 8, weight: 60, isWarmup: false },
      { id: 's3', reps: 6, weight: 70, isWarmup: false },
    ];
    let numbering = getSetNumbering(sets);
    expect(numbering.map(n => n.label)).toEqual(['1', '2', '3']);

    // Toggle first set to warmup -> W, 1, 2
    sets[0].isWarmup = true;
    numbering = getSetNumbering(sets);
    expect(numbering.map(n => n.label)).toEqual(['W', '1', '2']);
    expect(numbering[0].isWarmup).toBe(true);
    expect(numbering[1].isWarmup).toBe(false);
    expect(numbering[2].isWarmup).toBe(false);

    // Toggle first set back to working set -> 1, 2, 3
    sets[0].isWarmup = false;
    numbering = getSetNumbering(sets);
    expect(numbering.map(n => n.label)).toEqual(['1', '2', '3']);
  });

  it('re-calculates numbering when middle set is toggled between warm-up and working', () => {
    const sets = [
      { id: 's1', reps: 10, weight: 50, isWarmup: false },
      { id: 's2', reps: 8, weight: 60, isWarmup: false },
      { id: 's3', reps: 6, weight: 70, isWarmup: false },
    ];

    // Toggle middle set to warmup -> 1, W, 2
    sets[1].isWarmup = true;
    let numbering = getSetNumbering(sets);
    expect(numbering.map(n => n.label)).toEqual(['1', 'W', '2']);
    expect(numbering[0].isWarmup).toBe(false);
    expect(numbering[1].isWarmup).toBe(true);
    expect(numbering[2].isWarmup).toBe(false);

    // Toggle middle set back -> 1, 2, 3
    sets[1].isWarmup = false;
    numbering = getSetNumbering(sets);
    expect(numbering.map(n => n.label)).toEqual(['1', '2', '3']);
  });

  it('re-calculates numbering when last set is toggled between warm-up and working', () => {
    const sets = [
      { id: 's1', reps: 10, weight: 50, isWarmup: false },
      { id: 's2', reps: 8, weight: 60, isWarmup: false },
      { id: 's3', reps: 6, weight: 70, isWarmup: false },
    ];

    // Toggle last set to warmup -> 1, 2, W
    sets[2].isWarmup = true;
    let numbering = getSetNumbering(sets);
    expect(numbering.map(n => n.label)).toEqual(['1', '2', 'W']);
    expect(numbering[0].isWarmup).toBe(false);
    expect(numbering[1].isWarmup).toBe(false);
    expect(numbering[2].isWarmup).toBe(true);

    // Toggle last set back -> 1, 2, 3
    sets[2].isWarmup = false;
    numbering = getSetNumbering(sets);
    expect(numbering.map(n => n.label)).toEqual(['1', '2', '3']);
  });
});
