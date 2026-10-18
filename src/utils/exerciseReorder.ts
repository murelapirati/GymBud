export interface ReorderableExercise {
  id: string;
  supersetWithNext?: boolean;
  [key: string]: any;
}

/**
 * Reorders an exercise from fromIndex to toIndex, preserving or clearing supersetWithNext links.
 *
 * Rules:
 * - Only adjacent exercises can be linked.
 * - If exercises are moved so a linked pair is no longer adjacent in their original order,
 *   that link is cleared.
 * - If an exercise ends up at the end of the list, it cannot have supersetWithNext.
 */
export function reorderExercisesWithLinkClearing<T extends ReorderableExercise>(
  exercises: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (!Array.isArray(exercises) || exercises.length <= 1) {
    return exercises;
  }

  if (
    fromIndex < 0 ||
    fromIndex >= exercises.length ||
    toIndex < 0 ||
    toIndex >= exercises.length ||
    fromIndex === toIndex
  ) {
    return exercises;
  }

  // Record original target successor for each exercise that was linked
  const originalSuccessors = new Map<string, string>();
  for (let i = 0; i < exercises.length - 1; i++) {
    if (exercises[i].supersetWithNext) {
      originalSuccessors.set(exercises[i].id, exercises[i + 1].id);
    }
  }

  // Reorder array
  const reordered = [...exercises];
  const [movedItem] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedItem);

  // Validate each exercise's link in the new arrangement
  return reordered.map((exercise, index, array) => {
    if (!exercise.supersetWithNext) {
      return exercise;
    }

    // Last exercise in list cannot be linked to a next exercise
    if (index === array.length - 1) {
      const updated = { ...exercise };
      delete updated.supersetWithNext;
      return updated;
    }

    const expectedNextId = originalSuccessors.get(exercise.id);
    const actualNext = array[index + 1];

    if (actualNext && actualNext.id === expectedNextId) {
      return exercise;
    }

    // Link broken by reorder
    const updated = { ...exercise };
    delete updated.supersetWithNext;
    return updated;
  });
}
