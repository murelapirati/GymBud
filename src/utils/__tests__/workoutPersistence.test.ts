import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage';
import { persistCompletedWorkout } from '../workoutPersistence';

describe('workout persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('appends completed workouts and updates daily activity', async () => {
    await persistCompletedWorkout(
      {
        id: 'workout-1',
        date: '2026-10-09',
        workoutType: 'strength',
        exercises: [],
      },
      30,
      5,
    );

    const history = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY)) || '{}',
    );
    const activity = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY)) || '{}',
    );

    expect(history['2026-10-09']).toHaveLength(1);
    expect(activity['2026-10-09']).toMatchObject({
      exerciseMinutes: 30,
      caloriesBurned: 195,
    });
  });

  it('persists repeated exercise names as separate entries with independent sets', async () => {
    await persistCompletedWorkout(
      {
        id: 'workout-duplicate-exercise',
        date: '2026-10-10',
        workoutType: 'strength',
        exercises: [
          {
            id: 'exercise-1',
            name: 'Lateral Raises',
            type: 'gym',
            sets: [{ id: 'set-1', reps: 12, weight: 8, completed: true }],
          },
          {
            id: 'exercise-2',
            name: 'Lateral Raises',
            type: 'gym',
            sets: [{ id: 'set-2', reps: 10, weight: 10, completed: true }],
          },
        ],
      },
      20,
      5,
    );

    const history = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY)) || '{}',
    );
    const savedWorkout = history['2026-10-10'][0];

    expect(savedWorkout.exercises).toHaveLength(2);
    expect(savedWorkout.exercises.map((exercise: { id: string }) => exercise.id)).toEqual([
      'exercise-1',
      'exercise-2',
    ]);
    expect(savedWorkout.exercises.map((exercise: { sets: { id: string }[] }) => exercise.sets[0].id)).toEqual([
      'set-1',
      'set-2',
    ]);
  });
});
