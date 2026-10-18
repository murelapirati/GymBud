import { reorderExercisesWithLinkClearing, ReorderableExercise } from '../exerciseReorder';

describe('reorderExercisesWithLinkClearing', () => {
  it('moves an exercise forward (down) in the list', () => {
    const list: ReorderableExercise[] = [
      { id: '1', name: 'Bench Press' },
      { id: '2', name: 'Incline Press' },
      { id: '3', name: 'Dips' },
    ];

    const result = reorderExercisesWithLinkClearing(list, 0, 2);
    expect(result.map(e => e.id)).toEqual(['2', '3', '1']);
  });

  it('moves an exercise backward (up) in the list', () => {
    const list: ReorderableExercise[] = [
      { id: '1', name: 'Bench Press' },
      { id: '2', name: 'Incline Press' },
      { id: '3', name: 'Dips' },
    ];

    const result = reorderExercisesWithLinkClearing(list, 2, 0);
    expect(result.map(e => e.id)).toEqual(['3', '1', '2']);
  });

  it('returns original list if fromIndex and toIndex are identical', () => {
    const list: ReorderableExercise[] = [
      { id: '1', name: 'Bench Press' },
      { id: '2', name: 'Incline Press' },
    ];

    const result = reorderExercisesWithLinkClearing(list, 1, 1);
    expect(result).toBe(list);
  });

  it('handles invalid out-of-bounds indices safely', () => {
    const list: ReorderableExercise[] = [{ id: '1', name: 'Bench' }, { id: '2', name: 'Squat' }];

    expect(reorderExercisesWithLinkClearing(list, -1, 1)).toBe(list);
    expect(reorderExercisesWithLinkClearing(list, 0, 5)).toBe(list);
    expect(reorderExercisesWithLinkClearing([], 0, 1)).toEqual([]);
  });

  it('preserves supersetWithNext when linked pair moves together or remains adjacent', () => {
    const list: ReorderableExercise[] = [
      { id: '1', name: 'Lateral Raise', supersetWithNext: true },
      { id: '2', name: 'Overhead Press' },
      { id: '3', name: 'Tricep Pushdown' },
    ];

    // Moving item 3 to index 0: [3, 1, 2] -> 1 is still directly followed by 2
    const result = reorderExercisesWithLinkClearing(list, 2, 0);
    expect(result.map(e => e.id)).toEqual(['3', '1', '2']);
    expect(result[1].supersetWithNext).toBe(true);
  });

  it('clears supersetWithNext when an exercise is inserted between a linked pair', () => {
    const list: ReorderableExercise[] = [
      { id: '1', name: 'Lateral Raise', supersetWithNext: true },
      { id: '2', name: 'Overhead Press' },
      { id: '3', name: 'Tricep Pushdown' },
    ];

    // Move item 3 between 1 and 2: [1, 3, 2]
    const result = reorderExercisesWithLinkClearing(list, 2, 1);
    expect(result.map(e => e.id)).toEqual(['1', '3', '2']);
    expect(result[0].supersetWithNext).toBeUndefined();
  });

  it('clears supersetWithNext when the linked exercise is moved away', () => {
    const list: ReorderableExercise[] = [
      { id: '1', name: 'Lateral Raise', supersetWithNext: true },
      { id: '2', name: 'Overhead Press' },
      { id: '3', name: 'Tricep Pushdown' },
    ];

    // Move 1 to index 2: [2, 3, 1]
    const result = reorderExercisesWithLinkClearing(list, 0, 2);
    expect(result.map(e => e.id)).toEqual(['2', '3', '1']);
    expect(result[2].supersetWithNext).toBeUndefined();
  });

  it('clears supersetWithNext if an exercise becomes the last item in the list', () => {
    const list: ReorderableExercise[] = [
      { id: '1', name: 'Bench' },
      { id: '2', name: 'Flyes', supersetWithNext: true },
      { id: '3', name: 'Pushups' },
    ];

    // Move 2 to the end: [1, 3, 2]
    const result = reorderExercisesWithLinkClearing(list, 1, 2);
    expect(result.map(e => e.id)).toEqual(['1', '3', '2']);
    expect(result[2].supersetWithNext).toBeUndefined();
  });
});
