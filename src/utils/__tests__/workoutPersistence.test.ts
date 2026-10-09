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
});
