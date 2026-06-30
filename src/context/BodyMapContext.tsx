import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { MuscleGroup, MuscleStatus, Workout, MappedExercise } from '../types';
import { processWorkoutForRanks, applyDecay } from '../utils/rankingEngine';

// Bump this version whenever ranking engine logic changes to trigger recalculation
const CURRENT_RANKING_VERSION = '9';

type BodyGender = 'male' | 'female';

interface BodyMapContextType {
  muscleStatuses: Record<MuscleGroup, MuscleStatus>;
  gender: BodyGender;
  setGender: (gender: BodyGender) => Promise<void>;
  updateRanksFromWorkout: (workout: Workout) => Promise<void>;
  refreshRanks: () => Promise<void>;
  recalculateAllRanks: () => Promise<void>;
  isLoading: boolean;
}

const BodyMapContext = createContext<BodyMapContextType | undefined>(undefined);

export const useBodyMap = () => {
  const context = useContext(BodyMapContext);
  if (!context) {
    throw new Error('useBodyMap must be used within a BodyMapProvider');
  }
  return context;
};

export const BodyMapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [muscleStatuses, setMuscleStatuses] = useState<Record<MuscleGroup, MuscleStatus>>({} as any);
  const [gender, setGenderState] = useState<BodyGender>('male');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Reprocesses ALL workouts from history through the current ranking engine.
   * Called automatically when the ranking engine version changes.
   */
  const recalculateAllRanks = async () => {
    try {
      console.log('[BodyMap] Recalculating all ranks from workout history...');
      const history = await storage.getItem<Record<string, any[]>>(STORAGE_KEYS.WORKOUT_HISTORY) || {};
      const customExercises = await storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES) || [];

      // Collect all workouts and sort by date
      const allWorkouts: Workout[] = [];
      Object.keys(history).sort().forEach(date => {
        const dayWorkouts = history[date];
        if (Array.isArray(dayWorkouts)) {
          dayWorkouts.forEach(w => allWorkouts.push(w as Workout));
        }
      });

      // Start from a clean slate and reprocess every workout
      const rawBodyweight = await storage.getItem<number>(STORAGE_KEYS.USER_BODYWEIGHT) || 70;
      let statuses = {} as Record<MuscleGroup, MuscleStatus>;
      for (const workout of allWorkouts) {
        statuses = processWorkoutForRanks(workout, statuses, customExercises, rawBodyweight);
      }

      // Apply decay based on current date
      statuses = applyDecay(statuses);

      // Save recalculated statuses and update version
      await storage.setItem(STORAGE_KEYS.MUSCLE_STATUS, statuses);
      await storage.setItem(STORAGE_KEYS.RANKING_VERSION, CURRENT_RANKING_VERSION);
      setMuscleStatuses(statuses);

      console.log(`[BodyMap] Recalculated ranks from ${allWorkouts.length} workouts. Version: ${CURRENT_RANKING_VERSION}`);
    } catch (error) {
      console.error('Error recalculating ranks:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Check if ranking engine version has changed
      const storedVersion = await storage.getItem<string>(STORAGE_KEYS.RANKING_VERSION);

      if (storedVersion !== CURRENT_RANKING_VERSION) {
        // Engine changed — full recalculation from workout history
        console.log(`[BodyMap] Ranking engine updated (${storedVersion} → ${CURRENT_RANKING_VERSION}). Recalculating...`);
        await recalculateAllRanks();
      } else {
        // Version matches — load stored statuses normally
        const storedStatuses = await storage.getItem<Record<MuscleGroup, MuscleStatus>>(STORAGE_KEYS.MUSCLE_STATUS);
        if (storedStatuses) {
          const decayed = applyDecay(storedStatuses);
          setMuscleStatuses(decayed);
          await storage.setItem(STORAGE_KEYS.MUSCLE_STATUS, decayed);
        } else {
          setMuscleStatuses({} as any);
        }
      }

      const storedGender = await storage.getItem<BodyGender>(STORAGE_KEYS.BODY_GENDER);
      if (storedGender) {
        setGenderState(storedGender);
      }

      // Triggers debug dump to the Python helper server
      try {
        const history = await storage.getItem<Record<string, any[]>>(STORAGE_KEYS.WORKOUT_HISTORY) || {};
        const customExercises = await storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES) || [];
        const rawBodyweight = await storage.getItem<number>(STORAGE_KEYS.USER_BODYWEIGHT) || 70;
        const currentStatuses = await storage.getItem<Record<MuscleGroup, MuscleStatus>>(STORAGE_KEYS.MUSCLE_STATUS) || {};
        const payload = JSON.stringify({
          statuses: currentStatuses,
          history,
          customExercises,
          bodyweight: rawBodyweight,
        });

        // Try localhost (for web) and LAN IP (for physical phone)
        fetch('http://localhost:8082/dump', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        }).catch(() => {});

        fetch('http://172.29.1.162:8082/dump', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        }).catch(() => {});
      } catch (dumpErr) {
        console.log('[DebugDump] Error triggering dump:', dumpErr);
      }
    } catch (error) {
      console.error('Error loading body map data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load status and gender preference on mount
  useEffect(() => {
    loadData();
  }, []);

  const refreshRanks = async () => {
    await loadData();
  };

  const setGender = async (newGender: BodyGender) => {
    setGenderState(newGender);
    await storage.setItem(STORAGE_KEYS.BODY_GENDER, newGender);
  };

  const updateRanksFromWorkout = async (workout: Workout) => {
    try {
      const customExercises = await storage.getItem<MappedExercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES) || [];
      const rawBodyweight = await storage.getItem<number>(STORAGE_KEYS.USER_BODYWEIGHT) || 70;
      const newStatuses = processWorkoutForRanks(workout, muscleStatuses, customExercises, rawBodyweight);
      setMuscleStatuses(newStatuses);
      await storage.setItem(STORAGE_KEYS.MUSCLE_STATUS, newStatuses);
    } catch (error) {
      console.error('Error updating ranks from workout:', error);
    }
  };

  return (
    <BodyMapContext.Provider value={{ muscleStatuses, gender, setGender, updateRanksFromWorkout, refreshRanks, recalculateAllRanks, isLoading }}>
      {children}
    </BodyMapContext.Provider>
  );
};
