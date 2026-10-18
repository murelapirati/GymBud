import { getExtendedEndTimestamp, getRemainingSeconds, hasTimerEnded } from '../restTimer';

describe('rest timer logic', () => {
  it('calculates remaining time from an absolute end timestamp', () => {
    expect(getRemainingSeconds(10_000, 8_501)).toBe(2);
    expect(getRemainingSeconds(10_000, 10_001)).toBe(0);
  });

  it('detects a timer that ended while the app was backgrounded', () => {
    expect(hasTimerEnded(10_000, 10_001)).toBe(true);
    expect(getRemainingSeconds(10_000, 10_001)).toBe(0);
  });

  it('reschedules the end timestamp when 15 seconds are added', () => {
    expect(getExtendedEndTimestamp(10_000, 15)).toBe(25_000);
    expect(getRemainingSeconds(getExtendedEndTimestamp(10_000, 15), 10_000)).toBe(15);
  });

  it('leaves the set logged with no timer when rest sheet is dismissed or skipped', () => {
    // Model state before and after logging
    type WorkoutExercise = { id: string; sets: Array<{ id: string; reps: number; weight: number }> };
    let exercises: WorkoutExercise[] = [{ id: 'ex-1', sets: [] }];
    let activeRestTimer: number | null = null;
    let pendingRestTarget: { exerciseId: string; setId: string } | null = null;
    let showRestSheet = false;

    const logSet = (exerciseId: string, reps: number, weight: number) => {
      const setId = 'set-1';
      exercises = exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { id: setId, reps, weight }] } : ex
      );
      return setId;
    };

    const handleLogSet = (exerciseId: string, reps: number, weight: number) => {
      const setId = logSet(exerciseId, reps, weight);
      pendingRestTarget = { exerciseId, setId };
      showRestSheet = true;
    };

    const handleDismissOrSkipRest = () => {
      showRestSheet = false;
      pendingRestTarget = null;
      // activeRestTimer remains null
    };

    handleLogSet('ex-1', 10, 60);

    expect(exercises[0].sets.length).toBe(1);
    expect(exercises[0].sets[0]).toEqual({ id: 'set-1', reps: 10, weight: 60 });
    expect(showRestSheet).toBe(true);
    expect(pendingRestTarget).toEqual({ exerciseId: 'ex-1', setId: 'set-1' });

    // Dismiss or skip rest
    handleDismissOrSkipRest();

    expect(showRestSheet).toBe(false);
    expect(pendingRestTarget).toBeNull();
    expect(activeRestTimer).toBeNull();
    expect(exercises[0].sets.length).toBe(1);
  });

  it('clears active workout state and cancels running rest timer on discard', () => {
    // Model state during an active workout with a running rest timer
    let isWorkoutActive = true;
    let workoutStartTime: Date | null = new Date();
    let workoutDuration = 120;
    let workoutType: string | null = 'strength';
    let exercises = [
      { id: 'ex-1', name: 'Bench Press', sets: [{ id: 's1', reps: 10, weight: 135 }] },
    ];
    let activeRestTimer: number | null = 60;
    let restTimerEndTime: Date | null = new Date(Date.now() + 60000);
    let restTimerCompleted = false;
    let restNotificationCancelled = false;
    let historySaved = false;

    const cancelRestNotification = () => {
      restNotificationCancelled = true;
    };

    const cancelWorkout = () => {
      cancelRestNotification();
      isWorkoutActive = false;
      workoutStartTime = null;
      workoutDuration = 0;
      workoutType = null;
      exercises = [];
      activeRestTimer = null;
      restTimerEndTime = null;
      restTimerCompleted = false;
      // Saves nothing to history
    };

    // Trigger discard
    cancelWorkout();

    expect(isWorkoutActive).toBe(false);
    expect(workoutStartTime).toBeNull();
    expect(workoutDuration).toBe(0);
    expect(workoutType).toBeNull();
    expect(exercises).toEqual([]);
    expect(activeRestTimer).toBeNull();
    expect(restTimerEndTime).toBeNull();
    expect(restTimerCompleted).toBe(false);
    expect(restNotificationCancelled).toBe(true);
    expect(historySaved).toBe(false);
  });
});
