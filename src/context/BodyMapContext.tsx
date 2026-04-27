import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { MuscleGroup, MuscleStatus, Workout, MappedExercise } from '../types';
import { processWorkoutForRanks, applyDecay } from '../utils/rankingEngine';

type BodyGender = 'male' | 'female';

interface BodyMapContextType {
  muscleStatuses: Record<MuscleGroup, MuscleStatus>;
  gender: BodyGender;
  setGender: (gender: BodyGender) => Promise<void>;
  updateRanksFromWorkout: (workout: Workout) => Promise<void>;
  refreshRanks: () => Promise<void>;
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const storedStatuses = await storage.getItem<Record<MuscleGroup, MuscleStatus>>(STORAGE_KEYS.MUSCLE_STATUS);
      if (storedStatuses) {
        const decayed = applyDecay(storedStatuses);
        setMuscleStatuses(decayed);
        await storage.setItem(STORAGE_KEYS.MUSCLE_STATUS, decayed);
      } else {
        setMuscleStatuses({} as any);
      }

      const storedGender = await storage.getItem<BodyGender>(STORAGE_KEYS.BODY_GENDER);
      if (storedGender) {
        setGenderState(storedGender);
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
      const newStatuses = processWorkoutForRanks(workout, muscleStatuses, customExercises);
      setMuscleStatuses(newStatuses);
      await storage.setItem(STORAGE_KEYS.MUSCLE_STATUS, newStatuses);
    } catch (error) {
      console.error('Error updating ranks from workout:', error);
    }
  };

  return (
    <BodyMapContext.Provider value={{ muscleStatuses, gender, setGender, updateRanksFromWorkout, refreshRanks, isLoading }}>
      {children}
    </BodyMapContext.Provider>
  );
};
