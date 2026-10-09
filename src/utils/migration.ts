export interface LegacyWorkoutRecord {
  workoutType?: string;
  exercises?: Array<{ type?: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

export const migrateWorkoutRecord = <T extends LegacyWorkoutRecord>(record: T): T => ({
  ...record,
  workoutType:
    record.workoutType === 'gym' || record.workoutType === 'calisthenics'
      ? 'strength'
      : record.workoutType,
  exercises: (record.exercises || []).map(exercise => ({
    ...exercise,
    type:
      exercise.type === 'gym' || exercise.type === 'calisthenics'
        ? 'strength'
        : exercise.type,
  })),
});
