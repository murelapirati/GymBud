import { convertWeightForDisplay, MeasurementSystem } from './measurements';

export interface SetNumberInfo {
  label: string;
  isWarmup: boolean;
  workingIndex?: number;
}

/**
 * Computes labels for sets. Warm-up sets are labeled 'W' and do not increment
 * working set numbering (e.g. two warmups then first working set is '1').
 */
export function getSetNumbering(
  sets: Array<{ isWarmup?: boolean }>
): SetNumberInfo[] {
  let workingCount = 0;
  return sets.map((set) => {
    const isWarmup = Boolean(set.isWarmup);
    if (isWarmup) {
      return { label: 'W', isWarmup: true };
    }
    workingCount += 1;
    return {
      label: String(workingCount),
      isWarmup: false,
      workingIndex: workingCount,
    };
  });
}

export interface TopSetInfo {
  weight: number; // in stored unit (lbs)
  reps: number;
}

/**
 * Finds the top working set of an exercise from the most recent completed workout in history.
 * A working set is one where isWarmup is false/undefined and reps > 0.
 * Top set is determined by highest weight (and highest reps on tie).
 */
export function getLastWorkoutTopSet(
  exerciseName: string,
  historyRecord: Record<string, any[]> | any[] | null | undefined
): TopSetInfo | null {
  if (!historyRecord || !exerciseName) return null;

  let workouts: any[] = [];
  if (Array.isArray(historyRecord)) {
    workouts = [...historyRecord].sort((w1, w2) => {
      const t1 = w1.endTime || w1.startTime || 0;
      const t2 = w2.endTime || w2.startTime || 0;
      return t2 - t1;
    });
  } else {
    // History keyed by date 'YYYY-MM-DD'
    const sortedDates = Object.keys(historyRecord).sort((a, b) => b.localeCompare(a));
    for (const date of sortedDates) {
      const dayWorkouts = historyRecord[date];
      if (Array.isArray(dayWorkouts)) {
        const sortedDay = [...dayWorkouts].sort((w1, w2) => {
          const t1 = w1.endTime || w1.startTime || 0;
          const t2 = w2.endTime || w2.startTime || 0;
          return t2 - t1;
        });
        workouts.push(...sortedDay);
      }
    }
  }

  const targetName = exerciseName.trim().toLowerCase();

  for (const workout of workouts) {
    if (!workout || !Array.isArray(workout.exercises)) continue;

    const ex = workout.exercises.find(
      (e: any) => e?.name && e.name.trim().toLowerCase() === targetName
    );

    if (ex && Array.isArray(ex.sets) && ex.sets.length > 0) {
      const workingSets = ex.sets.filter((s: any) => !s.isWarmup && Number(s.reps) > 0);
      if (workingSets.length === 0) continue;

      let topSet: TopSetInfo | null = null;
      for (const s of workingSets) {
        const w = Number(s.weight ?? s.extraWeight ?? 0);
        const r = Number(s.reps ?? 0);
        if (!topSet) {
          topSet = { weight: w, reps: r };
        } else if (w > topSet.weight || (w === topSet.weight && r > topSet.reps)) {
          topSet = { weight: w, reps: r };
        }
      }

      if (topSet) {
        return topSet;
      }
    }
  }

  return null;
}

/**
 * Formats a top set into a clean string like "60 kg x 10" or "135 lbs x 10".
 */
export function formatTopSetDisplay(
  topSet: TopSetInfo | null,
  system: MeasurementSystem
): string | null {
  if (!topSet) return null;
  const unit = system === 'metric' ? 'kg' : 'lbs';
  const displayWeight = convertWeightForDisplay(topSet.weight, system);
  if (displayWeight === undefined) return null;

  const rounded = Number.isInteger(displayWeight)
    ? displayWeight.toString()
    : displayWeight.toFixed(1);

  return `${rounded} ${unit} x ${topSet.reps}`;
}
