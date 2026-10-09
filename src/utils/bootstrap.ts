import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, storage } from './storage';
import { LegacyWorkoutRecord, migrateWorkoutRecord } from './migration';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { LibraryFolder, WorkoutTemplate } from '../types';

export const WORKOUT_TYPE_MIGRATION_VERSION = '1';
const MIGRATION_FLAG_KEY = '@gymapp_workouttype_migration_v1';
const DEFAULT_TEMPLATES_SEED_KEY = '@gymapp_default_templates_seeded_v1';
export const DEFAULT_TEMPLATES_FOLDER_ID = 'system-default-workouts';

export type WorkoutHistoryRecords = Record<string, LegacyWorkoutRecord[]>;

export const migrateWorkoutTypes = async (): Promise<void> => {
  const alreadyMigrated = await AsyncStorage.getItem(MIGRATION_FLAG_KEY);
  if (alreadyMigrated === WORKOUT_TYPE_MIGRATION_VERSION) return;

  const workouts =
    (await storage.getItem<LegacyWorkoutRecord[]>(STORAGE_KEYS.WORKOUTS)) || [];
  await storage.setItem(
    STORAGE_KEYS.WORKOUTS,
    workouts.map(migrateWorkoutRecord),
  );

  const history =
    (await storage.getItem<WorkoutHistoryRecords>(
      STORAGE_KEYS.WORKOUT_HISTORY,
    )) || {};
  const migratedHistory: WorkoutHistoryRecords = Object.fromEntries(
    Object.entries(history).map(([date, sessions]) => [
      date,
      (sessions || []).map(migrateWorkoutRecord),
    ]),
  );
  await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, migratedHistory);

  const templates =
    (await storage.getItem<LegacyWorkoutRecord[]>(
      STORAGE_KEYS.WORKOUT_TEMPLATES,
    )) || [];
  await storage.setItem(
    STORAGE_KEYS.WORKOUT_TEMPLATES,
    templates.map(migrateWorkoutRecord),
  );

  const customExercises =
    (await storage.getItem<LegacyWorkoutRecord[]>(
      STORAGE_KEYS.CUSTOM_EXERCISES,
    )) || [];
  await storage.setItem(
    STORAGE_KEYS.CUSTOM_EXERCISES,
    customExercises.map(exercise => ({
      ...exercise,
      type:
        exercise.type === 'gym' || exercise.type === 'calisthenics'
          ? 'strength'
          : exercise.type,
    })),
  );

  await AsyncStorage.setItem(
    MIGRATION_FLAG_KEY,
    WORKOUT_TYPE_MIGRATION_VERSION,
  );

  await seedDefaultTemplates();
};

export const seedDefaultTemplates = async (): Promise<void> => {
  const alreadySeeded = await AsyncStorage.getItem(DEFAULT_TEMPLATES_SEED_KEY);

  const existingTemplates =
    (await storage.getItem<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_TEMPLATES)) || [];
  const existingFolders =
    (await storage.getItem<LibraryFolder[]>(STORAGE_KEYS.LIBRARY_FOLDERS)) || [];
  const defaultFolder: LibraryFolder = {
    id: DEFAULT_TEMPLATES_FOLDER_ID,
    name: 'Default',
    type: 'templates',
    createdAt: 0,
    isSystem: true,
  };
  const folders = existingFolders.some(folder => folder.id === DEFAULT_TEMPLATES_FOLDER_ID)
    ? existingFolders
    : [defaultFolder, ...existingFolders];
  const existingIds = new Set(existingTemplates.map(template => template.id));
  const merged = [
    ...DEFAULT_TEMPLATES
      .filter(template => !existingIds.has(template.id))
      .map(template => ({ ...template, folderId: DEFAULT_TEMPLATES_FOLDER_ID })),
    ...existingTemplates.map(template =>
      template.id.startsWith('default_')
        ? { ...template, folderId: DEFAULT_TEMPLATES_FOLDER_ID }
        : template
    ),
  ];

  await storage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, merged);
  await storage.setItem(STORAGE_KEYS.LIBRARY_FOLDERS, folders);
  if (!alreadySeeded) {
    await AsyncStorage.setItem(DEFAULT_TEMPLATES_SEED_KEY, 'true');
  }
};
