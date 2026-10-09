import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { MuscleGroup, MuscleStatus, Workout } from '../types';
import { getStrengthPointChanges, processWorkoutForRanks, applyDecay, recalculateAllScoresFromHistory, StrengthPointChange } from '../utils/rankingEngine';
import { RankingGender } from '../utils/rankingRules';
import { exerciseRepository, rankingRepository, workoutRepository } from '../utils/repositories';

// Bump this version whenever ranking engine logic changes to trigger recalculation
const CURRENT_RANKING_VERSION = '13';

type BodyGender = RankingGender;

interface BodyMapContextType {
  muscleStatuses: Record<MuscleGroup, MuscleStatus>;
  gender: BodyGender;
  setGender: (gender: BodyGender) => Promise<void>;
  updateRanksFromWorkout: (workout: Workout) => Promise<StrengthPointChange[]>;
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
  const recalculateAllRanks = async (selectedGender: BodyGender = gender) => {
    try {
      console.log('[BodyMap] Recalculating all ranks from workout history...');
      const history = await workoutRepository.getHistory() || {};
      const customExercises = await exerciseRepository.getCustomExercises() || [];

      // Collect all workouts and sort by date
      const allWorkouts: Workout[] = [];
      Object.keys(history).sort().forEach(date => {
        const dayWorkouts = history[date];
        if (Array.isArray(dayWorkouts)) {
          dayWorkouts.forEach(w => allWorkouts.push(w as unknown as Workout));
        }
      });

      // Start from a clean slate and reprocess every workout
      const rawBodyweight = await rankingRepository.getBodyweight();
      const statuses = recalculateAllScoresFromHistory(allWorkouts, customExercises, rawBodyweight, selectedGender);

      // Save recalculated statuses and update version
      await rankingRepository.setStatuses(statuses);
      await rankingRepository.setVersion(CURRENT_RANKING_VERSION);
      setMuscleStatuses(statuses);

      console.log(`[BodyMap] Recalculated ranks from ${allWorkouts.length} workouts. Version: ${CURRENT_RANKING_VERSION}`);
    } catch (error) {
      console.error('Error recalculating ranks:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const storedGender = await storage.getItem<BodyGender>(STORAGE_KEYS.BODY_GENDER) || 'male';
      setGenderState(storedGender);
      // Check if ranking engine version has changed
      const storedVersion = await rankingRepository.getVersion();

      if (storedVersion !== CURRENT_RANKING_VERSION) {
        // Engine changed — full recalculation from workout history
        console.log(`[BodyMap] Ranking engine updated (${storedVersion} → ${CURRENT_RANKING_VERSION}). Recalculating...`);
        await recalculateAllRanks(storedGender);
      } else {
        // Version matches — load stored statuses normally
        const storedStatuses = await rankingRepository.getStatuses();
        if (storedStatuses) {
          const decayed = applyDecay(storedStatuses, undefined, storedGender);
          setMuscleStatuses(decayed);
          await rankingRepository.setStatuses(decayed);
        } else {
          setMuscleStatuses({} as any);
        }
      }

      if (__DEV__) {
        // Triggers debug dump to the Python helper server
        try {
          const history = await workoutRepository.getHistory() || {};
          const customExercises = await exerciseRepository.getCustomExercises() || [];
          const rawBodyweight = await rankingRepository.getBodyweight();
          const currentStatuses = await rankingRepository.getStatuses() || {};
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
    await recalculateAllRanks(newGender);
  };

  const updateRanksFromWorkout = async (workout: Workout) => {
    try {
      const previousStatuses = muscleStatuses;
      const customExercises = await exerciseRepository.getCustomExercises() || [];
      const rawBodyweight = await rankingRepository.getBodyweight();
      const newStatuses = processWorkoutForRanks(workout, muscleStatuses, customExercises, rawBodyweight, gender);
      setMuscleStatuses(newStatuses);
      await rankingRepository.setStatuses(newStatuses);
      return getStrengthPointChanges(previousStatuses, newStatuses);
    } catch (error) {
      console.error('Error updating ranks from workout:', error);
      return [];
    }
  };

  return (
    <BodyMapContext.Provider value={{ muscleStatuses, gender, setGender, updateRanksFromWorkout, refreshRanks, recalculateAllRanks, isLoading }}>
      {children}
    </BodyMapContext.Provider>
  );
};
