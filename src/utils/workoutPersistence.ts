import { WorkoutType } from '../types';
import { STORAGE_KEYS, storage } from './storage';

export interface CompletedWorkoutRecord {
  id: string;
  date: string;
  workoutType: WorkoutType;
  exercises: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface DailyActivityRecord {
  date: string;
  steps: number;
  exerciseMinutes: number;
  caloriesBurned: number;
  lastUpdated?: number;
}

export type DailyActivityHistory = Record<string, DailyActivityRecord>;

export const persistCompletedWorkout = async (
  workout: CompletedWorkoutRecord,
  durationMinutes: number,
  intensity?: number,
): Promise<void> => {
  const history =
    (await storage.getItem<Record<string, CompletedWorkoutRecord[]>>(
      STORAGE_KEYS.WORKOUT_HISTORY,
    )) || {};
  history[workout.date] = Array.isArray(history[workout.date])
    ? history[workout.date]
    : [];
  history[workout.date].push(workout);
  await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, history);

  const dailyActivity =
    (await storage.getItem<DailyActivityHistory>(
      STORAGE_KEYS.DAILY_ACTIVITY,
    )) || {};
  const activity = dailyActivity[workout.date] || {
    date: workout.date,
    steps: 0,
    exerciseMinutes: 0,
    caloriesBurned: 0,
  };
  activity.exerciseMinutes += durationMinutes;
  const caloriesPerMinute = intensity !== undefined ? 3 + intensity * 0.7 : 5;
  activity.caloriesBurned += Math.floor(durationMinutes * caloriesPerMinute);
  activity.lastUpdated = Date.now();
  dailyActivity[workout.date] = activity;
  await storage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, dailyActivity);
};
