import { migrateWorkoutRecord } from '../migration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seedDefaultTemplates, DEFAULT_TEMPLATES_FOLDER_ID } from '../bootstrap';
import { DEFAULT_TEMPLATES } from '../../data/defaultTemplates';
import { STORAGE_KEYS, storage } from '../storage';

describe('bootstrap migrations', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('migrates legacy workout and exercise types without changing other data', () => {
    const migrated = migrateWorkoutRecord({
      id: 'workout-1',
      workoutType: 'gym',
      notes: 'keep this',
      exercises: [
        { id: 'exercise-1', type: 'calisthenics' },
        { id: 'exercise-2', type: 'cardio' },
      ],
    });

    expect(migrated).toEqual({
      id: 'workout-1',
      workoutType: 'strength',
      notes: 'keep this',
      exercises: [
        { id: 'exercise-1', type: 'strength' },
        { id: 'exercise-2', type: 'cardio' },
      ],
    });
  });

  it('creates the Default folder and assigns seeded templates to it', async () => {
    await seedDefaultTemplates();

    const templates = await storage.getItem<any[]>(STORAGE_KEYS.WORKOUT_TEMPLATES);
    const folders = await storage.getItem<any[]>(STORAGE_KEYS.LIBRARY_FOLDERS);

    expect(folders).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: DEFAULT_TEMPLATES_FOLDER_ID,
        name: 'Default',
        type: 'templates',
        isSystem: true,
      }),
    ]));
    expect(templates).toHaveLength(DEFAULT_TEMPLATES.length);
    expect(templates?.every(template => template.folderId === DEFAULT_TEMPLATES_FOLDER_ID)).toBe(true);
  });
});
