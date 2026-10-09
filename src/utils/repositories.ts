import { MappedExercise, MuscleGroup, MuscleStatus, Workout, WorkoutTemplate } from '../types';
import { STORAGE_KEYS, storage } from './storage';

export type StoredWorkout = Omit<Workout, 'exercises'> & {
  exercises: Array<Record<string, unknown>>;
};

export type WorkoutHistory = Record<string, StoredWorkout[]>;

export const workoutRepository = {
  getHistory: () => storage.getItem<WorkoutHistory>(STORAGE_KEYS.WORKOUT_HISTORY),
  setHistory: (history: WorkoutHistory) =>
    storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, history),
  getTemplates: () =>
    storage.getItem<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_TEMPLATES),
  setTemplates: (templates: WorkoutTemplate[]) =>
    storage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, templates),
};

export const exerciseRepository = {
  getCustomExercises: () =>
    storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES),
  setCustomExercises: (exercises: MappedExercise[]) =>
    storage.setItem(STORAGE_KEYS.CUSTOM_EXERCISES, exercises),
};

export const rankingRepository = {
  getStatuses: () =>
    storage.getItem<Record<MuscleGroup, MuscleStatus>>(STORAGE_KEYS.MUSCLE_STATUS),
  setStatuses: (statuses: Record<MuscleGroup, MuscleStatus>) =>
    storage.setItem(STORAGE_KEYS.MUSCLE_STATUS, statuses),
  getVersion: () => storage.getItem<string>(STORAGE_KEYS.RANKING_VERSION),
  setVersion: (version: string) =>
    storage.setItem(STORAGE_KEYS.RANKING_VERSION, version),
  getBodyweight: async () =>
    (await storage.getItem<number>(STORAGE_KEYS.USER_BODYWEIGHT)) || 70,
};
