import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vibration, Alert } from 'react-native';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { WorkoutTemplate, TemplateExercise, Workout } from '../types';
import { useBodyMap } from './BodyMapContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WorkoutType = 'gym' | 'cardio' | 'calisthenics' | 'stretching';

// Gym workout: sets x reps x weight
interface GymSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  completedAt?: Date;
  restTime?: number;
  isWarmup?: boolean;
}

// Calisthenics: sets x reps + optional extra weight
interface CalisthenicsSet {
  id: string;
  reps: number;
  extraWeight?: number;
  completed: boolean;
  completedAt?: Date;
  restTime?: number;
  isWarmup?: boolean;
}

// Cardio entry: duration, distance (optional), heart rate (optional)
interface CardioActivity {
  id: string;
  name: string;
  duration: number; // in seconds
  distance?: number; // in km
  heartRate?: number; // avg BPM
  notes?: string;
  startTime?: Date; // when this cardio started
  isActive?: boolean; // is timer running
}

// Stretching entry: exercise name + duration
interface StretchingActivity {
  id: string;
  name: string;
  duration: number; // in seconds (target duration)
  notes?: string;
  completed?: boolean;
}

// Generic exercise structure that can hold any type
interface WorkoutExercise {
  id: string;
  name: string;
  type: 'gym' | 'calisthenics' | 'cardio' | 'stretching';
  // For gym and calisthenics
  sets?: (GymSet | CalisthenicsSet)[];
  restTimer?: number;
  // For cardio
  duration?: number;
  distance?: number;
  heartRate?: number;
  startTime?: Date;
  isActive?: boolean; // is cardio timer running
  isPaused?: boolean; // is cardio paused
  pausedDuration?: number; // accumulated time when paused
  // For stretching
  completed?: boolean;
  // Common
  notes?: string;
}

interface ActiveWorkoutContextType {
  isWorkoutActive: boolean;
  workoutStartTime: Date | null;
  workoutDuration: number;
  workoutType: WorkoutType | null;
  exercises: WorkoutExercise[];
  activeRestTimer: number | null;
  restTimerEndTime: Date | null;
  restTimerInitialSeconds: number;
  restTimerCompleted: boolean;
  activeRestExerciseId: string | null;
  activeRestSetId: string | null;
  activeStretchTimer: number | null; // For stretching countdown
  stretchTimerEndTime: Date | null;
  stretchTimerCompleted: boolean;
  activeStretchId: string | null; // Which stretch is timing
  clearRestTimerCompleted: () => void;
  clearStretchTimerCompleted: () => void;
  startWorkout: (type: WorkoutType) => void;
  startWorkoutFromTemplate: (template: WorkoutTemplate) => Promise<void>;
  finishWorkout: (notes?: string, intensity?: number) => void;
  cancelWorkout: () => void;
  // Gym & Calisthenics
  addExercise: (name: string, restTimer: number) => void;
  logSet: (exerciseId: string, reps: number, weight?: number, restTime?: number, isWarmup?: boolean) => string;
  updateSet: (exerciseId: string, setId: string, reps: number, weight?: number) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  toggleSetWarmup: (exerciseId: string, setId: string) => void;
  // Cardio & Stretching
  addCardioActivity: (name: string) => void;
  startCardioTimer: (id: string) => void;
  pauseCardioTimer: (id: string) => void;
  resumeCardioTimer: (id: string) => void;
  finishCardioActivity: (id: string, distance?: number, heartRate?: number) => void;
  addStretchingActivity: (name: string, duration: number) => void;
  startStretchTimer: (id: string, duration: number) => void;
  completeStretch: (id: string) => void;
  updateCardioActivity: (id: string, name: string, duration: number, distance?: number, heartRate?: number) => void;
  updateStretchingActivity: (id: string, name: string, duration: number) => void;
  // Common
  deleteExercise: (exerciseId: string) => void;
  moveExercise: (exerciseId: string, direction: 'up' | 'down') => void;
  startRestTimer: (seconds: number, exerciseId?: string, setId?: string) => void;
  addExtraRestTime: (seconds: number) => void;
  cancelRestTimer: () => void;
  finishExercise: (exerciseId: string) => void;
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextType | undefined>(undefined);

export const useActiveWorkout = () => {
  const context = useContext(ActiveWorkoutContext);
  if (!context) {
    throw new Error('useActiveWorkout must be used within ActiveWorkoutProvider');
  }
  return context;
};

interface ActiveWorkoutProviderProps {
  children: ReactNode;
}

export const ActiveWorkoutProvider: React.FC<ActiveWorkoutProviderProps> = ({ children }) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [activeRestTimer, setActiveRestTimer] = useState<number | null>(null);
  const [restTimerEndTime, setRestTimerEndTime] = useState<Date | null>(null);
  const [restTimerInitialSeconds, setRestTimerInitialSeconds] = useState(0);
  const [restTimerCompleted, setRestTimerCompleted] = useState(false);
  const [activeRestExerciseId, setActiveRestExerciseId] = useState<string | null>(null);
  const [activeRestSetId, setActiveRestSetId] = useState<string | null>(null);
  
  // Stretching timer state
  const [activeStretchTimer, setActiveStretchTimer] = useState<number | null>(null);
  const [stretchTimerEndTime, setStretchTimerEndTime] = useState<Date | null>(null);
  const [stretchTimerCompleted, setStretchTimerCompleted] = useState(false);
  const [activeStretchId, setActiveStretchId] = useState<string | null>(null);
  
  const { updateRanksFromWorkout } = useBodyMap();

  // Update workout duration every second
  useEffect(() => {
    if (!isWorkoutActive || !workoutStartTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - workoutStartTime.getTime()) / 1000);
      setWorkoutDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutActive, workoutStartTime]);

  // Update rest timer countdown
  useEffect(() => {
    if (activeRestTimer === null || !restTimerEndTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.floor((restTimerEndTime.getTime() - now.getTime()) / 1000);
      
      if (remaining <= 0) {
        if (activeRestExerciseId && activeRestSetId) {
          setExercises(prev => prev.map(ex => {
            if (ex.id === activeRestExerciseId && ex.sets) {
              return {
                ...ex,
                sets: ex.sets.map(s => s.id === activeRestSetId ? { ...s, restTime: restTimerInitialSeconds } : s),
              };
            }
            return ex;
          }));
        }

        setActiveRestTimer(null);
        setRestTimerEndTime(null);
        setRestTimerInitialSeconds(0);
        setRestTimerCompleted(true);
        setActiveRestExerciseId(null);
        setActiveRestSetId(null);
        // Vibration pattern: vibrate 5 times (500ms vibrate, 200ms pause)
        Vibration.vibrate([0, 500, 200, 500, 200, 500, 200, 500, 200, 500]);
      } else {
        setActiveRestTimer(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeRestTimer, restTimerEndTime, activeRestExerciseId, activeRestSetId, restTimerInitialSeconds]);

  // Update stretch timer countdown
  useEffect(() => {
    if (activeStretchTimer === null || !stretchTimerEndTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.floor((stretchTimerEndTime.getTime() - now.getTime()) / 1000);
      
      if (remaining <= 0) {
        setActiveStretchTimer(null);
        setStretchTimerEndTime(null);
        setStretchTimerCompleted(true);
        // Complete the stretch
        if (activeStretchId) {
          setExercises(prev => prev.map(ex => 
            ex.id === activeStretchId ? { ...ex, completed: true } : ex
          ));
        }
        // Vibration pattern: vibrate 3 times
        Vibration.vibrate([0, 500, 200, 500, 200, 500]);
      } else {
        setActiveStretchTimer(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeStretchTimer, stretchTimerEndTime, activeStretchId]);

  // Update active cardio timers
  useEffect(() => {
    const interval = setInterval(() => {
      setExercises(prev => prev.map(ex => {
        if (ex.type === 'cardio' && ex.isActive && !ex.isPaused && ex.startTime) {
          const elapsed = Math.floor((Date.now() - ex.startTime.getTime()) / 1000);
          const totalDuration = (ex.pausedDuration || 0) + elapsed;
          return { ...ex, duration: totalDuration };
        }
        return ex;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startWorkout = (type: WorkoutType) => {
    setIsWorkoutActive(true);
    setWorkoutStartTime(new Date());
    setWorkoutDuration(0);
    setWorkoutType(type);
    setExercises([]);
    setActiveRestTimer(null);
    setRestTimerEndTime(null);
    setActiveRestExerciseId(null);
    setActiveRestSetId(null);
  };

  const startWorkoutFromTemplate = async (template: WorkoutTemplate) => {
    try {
      if (!template || !template.exercises || !Array.isArray(template.exercises)) {
        throw new Error('Invalid template data');
      }

      if (template.exercises.length === 0) {
        Alert.alert('Empty Template', 'This template has no exercises');
        return;
      }

      // Convert template exercises to workout exercises based on workout type
      const baseTimestamp = Date.now();
      const workoutExercises: WorkoutExercise[] = template.exercises.map((te, index) => {
        const uniqueId = `${baseTimestamp}_${index}`;
        
        const baseExercise = {
          id: uniqueId,
          name: te.name,
          type: template.workoutType, // Always set type from template
        };

        if (template.workoutType === 'gym' || template.workoutType === 'calisthenics') {
          return {
            ...baseExercise,
            sets: [],
            restTimer: te.restTimer || 90,
          } as WorkoutExercise;
        } else if (template.workoutType === 'cardio') {
          return {
            ...baseExercise,
            duration: 0,
            isActive: false,
            isPaused: false,
            pausedDuration: 0,
          } as WorkoutExercise;
        } else if (template.workoutType === 'stretching') {
          return {
            ...baseExercise,
            duration: te.duration || 30,
            completed: false,
          } as WorkoutExercise;
        }

        // Fallback (should never reach here)
        return {
          ...baseExercise,
          sets: [],
          restTimer: 90,
        } as WorkoutExercise;
      });

      // Validate the converted exercises
      if (!workoutExercises.every(ex => ex && ex.id && ex.name && ex.type)) {
        throw new Error('Failed to convert template exercises');
      }

      // Start the workout with pre-filled exercises
      setIsWorkoutActive(true);
      setWorkoutStartTime(new Date());
      setWorkoutDuration(0);
      setWorkoutType(template.workoutType);
      setExercises(workoutExercises);
      setActiveRestTimer(null);
      setRestTimerEndTime(null);
      setActiveRestExerciseId(null);
      setActiveRestSetId(null);

      // Update template's lastUsed timestamp
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TEMPLATES);
      if (stored) {
        const templates: WorkoutTemplate[] = JSON.parse(stored);
        const updated = templates.map(t => 
          t.id === template.id ? { ...t, lastUsed: Date.now() } : t
        );
        await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error starting workout from template:', error);
      // Still start the workout even if template update fails
      setIsWorkoutActive(false);
      alert('Error loading template. Please try again.');
    }
  };

  const finishWorkout = async (notes?: string, intensity?: number) => {
    if (!workoutStartTime) return;

    try {
      const endTime = new Date();
      const durationMinutes = Math.floor((endTime.getTime() - workoutStartTime.getTime()) / 1000 / 60);
      const dateStr = `${endTime.getFullYear()}-${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')}`;

      // Create workout session
      const workoutSession = {
        id: Date.now().toString(),
        date: dateStr,
        workoutType: workoutType || 'gym',
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          type: ex.type,
          sets: ex.sets,
          restTimer: ex.restTimer,
          duration: ex.duration,
          distance: ex.distance,
          heartRate: ex.heartRate,
          notes: ex.notes,
        })),
        notes: notes || undefined,
        intensity: intensity,
        duration: durationMinutes,
        startTime: workoutStartTime.getTime(),
        endTime: endTime.getTime(),
      };

      // Update Muscle Ranks
      await updateRanksFromWorkout(workoutSession as any as Workout);

      // Save to workout history
      const history = await storage.getItem<any>(STORAGE_KEYS.WORKOUT_HISTORY) || {};
      // Support multiple workouts per day - store as array
      if (!history[dateStr] || !Array.isArray(history[dateStr])) {
        history[dateStr] = [];
      }
      history[dateStr].push(workoutSession);
      await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, history);

      // Update daily activity
      const dailyActivity = await storage.getItem<any>(STORAGE_KEYS.DAILY_ACTIVITY) || {};
      const existingActivity = dailyActivity[dateStr] || {
        date: dateStr,
        steps: 0,
        exerciseMinutes: 0,
        caloriesBurned: 0,
      };
      existingActivity.exerciseMinutes += durationMinutes;
      // Calorie calculation based on intensity: 3-10 cal/min (3 + intensity*0.7)
      const caloriesPerMinute = intensity !== undefined ? (3 + intensity * 0.7) : 5;
      existingActivity.caloriesBurned += Math.floor(durationMinutes * caloriesPerMinute);
      existingActivity.lastUpdated = Date.now(); // Track when this was saved
      dailyActivity[dateStr] = existingActivity;
      await storage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, dailyActivity);
    } catch (error) {
      console.error('Error saving workout:', error);
    }

    setIsWorkoutActive(false);
    setWorkoutStartTime(null);
    setWorkoutDuration(0);
    setWorkoutType(null);
    setExercises([]);
    setActiveRestTimer(null);
    setRestTimerEndTime(null);
    setRestTimerInitialSeconds(0);
    setActiveRestExerciseId(null);
    setActiveRestSetId(null);
  };

  const cancelWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutStartTime(null);
    setWorkoutDuration(0);
    setWorkoutType(null);
    setExercises([]);
    setActiveRestTimer(null);
    setRestTimerEndTime(null);
    setActiveRestExerciseId(null);
    setActiveRestSetId(null);
  };

  const addExercise = (name: string, restTimer: number) => {
    const type = workoutType === 'gym' ? 'gym' : workoutType === 'calisthenics' ? 'calisthenics' : 'gym';
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name,
      type,
      sets: [],
      restTimer,
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const logSet = (exerciseId: string, reps: number, weight?: number, restTime?: number, isWarmup?: boolean) => {
    const setId = Date.now().toString();
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newSet: GymSet | CalisthenicsSet = ex.type === 'gym'
          ? {
              id: setId,
              reps,
              weight: weight || 0,
              completed: true,
              completedAt: new Date(),
              restTime,
              isWarmup: isWarmup || false,
            }
          : {
              id: setId,
              reps,
              extraWeight: weight,
              completed: true,
              completedAt: new Date(),
              restTime,
              isWarmup: isWarmup || false,
            };
        return { ...ex, sets: [...(ex.sets || []), newSet] };
      }
      return ex;
    }));
    return setId;
  };

  const toggleSetWarmup = (exerciseId: string, setId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId && ex.sets) {
        return {
          ...ex,
          sets: ex.sets.map(s =>
            s.id === setId ? { ...s, isWarmup: !s.isWarmup } : s
          ),
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, reps: number, weight?: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId && ex.sets) {
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id === setId) {
              if (ex.type === 'gym') {
                return { ...s, reps, weight: weight || 0 } as GymSet;
              } else {
                return { ...s, reps, extraWeight: weight } as CalisthenicsSet;
              }
            }
            return s;
          }),
        };
      }
      return ex;
    }));
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId && ex.sets) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    }));
  };

  // Cardio methods
  const addCardioActivity = (name: string) => {
    const newActivity: WorkoutExercise = {
      id: Date.now().toString(),
      name,
      type: 'cardio',
      duration: 0,
      isActive: false,
      isPaused: false,
    };
    setExercises(prev => [...prev, newActivity]);
  };

  const startCardioTimer = (id: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id && ex.type === 'cardio') {
        return {
          ...ex,
          isActive: true,
          isPaused: false,
          startTime: new Date(),
          pausedDuration: ex.pausedDuration || 0,
        };
      }
      return ex;
    }));
  };

  const pauseCardioTimer = (id: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id && ex.type === 'cardio' && ex.isActive) {
        return {
          ...ex,
          isPaused: true,
          pausedDuration: ex.duration,
        };
      }
      return ex;
    }));
  };

  const resumeCardioTimer = (id: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id && ex.type === 'cardio' && ex.isPaused) {
        return {
          ...ex,
          isPaused: false,
          startTime: new Date(),
        };
      }
      return ex;
    }));
  };

  const finishCardioActivity = (id: string, distance?: number, heartRate?: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id && ex.type === 'cardio') {
        return {
          ...ex,
          isActive: false,
          isPaused: false,
          distance,
          heartRate,
        };
      }
      return ex;
    }));
  };

  // Stretching methods
  const addStretchingActivity = (name: string, duration: number) => {
    const newActivity: WorkoutExercise = {
      id: Date.now().toString(),
      name,
      type: 'stretching',
      duration, // target duration in seconds
      completed: false,
    };
    setExercises(prev => [...prev, newActivity]);
  };

  const startStretchTimer = (id: string, duration: number) => {
    const endTime = new Date(Date.now() + duration * 1000);
    setActiveStretchTimer(duration);
    setStretchTimerEndTime(endTime);
    setActiveStretchId(id);
    setStretchTimerCompleted(false);
  };

  const completeStretch = (id: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id && ex.type === 'stretching') {
        return { ...ex, completed: true };
      }
      return ex;
    }));
    if (activeStretchId === id) {
      setActiveStretchTimer(null);
      setStretchTimerEndTime(null);
      setActiveStretchId(null);
    }
  };

  const updateCardioActivity = (id: string, name: string, duration: number, distance?: number, heartRate?: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id && ex.type === 'cardio') {
        return { ...ex, name, duration, distance, heartRate };
      }
      return ex;
    }));
  };

  const updateStretchingActivity = (id: string, name: string, duration: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === id && ex.type === 'stretching') {
        return { ...ex, name, duration };
      }
      return ex;
    }));
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const moveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    setExercises(prev => {
      const currentIndex = prev.findIndex(ex => ex.id === exerciseId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Check bounds
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      // Swap exercises
      const newExercises = [...prev];
      [newExercises[currentIndex], newExercises[newIndex]] = [newExercises[newIndex], newExercises[currentIndex]];
      
      return newExercises;
    });
  };

  const startRestTimer = (seconds: number, exerciseId?: string, setId?: string) => {
    if (seconds > 0) {
      const endTime = new Date(Date.now() + seconds * 1000);
      setActiveRestTimer(seconds);
      setRestTimerEndTime(endTime);
      setRestTimerInitialSeconds(seconds);
      setRestTimerCompleted(false);
      setActiveRestExerciseId(exerciseId || null);
      setActiveRestSetId(setId || null);
    }
  };

  const addExtraRestTime = (seconds: number) => {
    if (activeRestTimer !== null && restTimerEndTime) {
      const newEndTime = new Date(restTimerEndTime.getTime() + seconds * 1000);
      setActiveRestTimer(activeRestTimer + seconds);
      setRestTimerEndTime(newEndTime);
      setRestTimerInitialSeconds(restTimerInitialSeconds + seconds);
    }
  };

  const cancelRestTimer = () => {
    if (activeRestExerciseId && activeRestSetId) {
      const actualRest = restTimerInitialSeconds - (activeRestTimer || 0);
      setExercises(prev => prev.map(ex => {
        if (ex.id === activeRestExerciseId && ex.sets) {
          return {
            ...ex,
            sets: ex.sets.map(s => s.id === activeRestSetId ? { ...s, restTime: actualRest } : s),
          };
        }
        return ex;
      }));
    }

    setActiveRestTimer(null);
    setRestTimerEndTime(null);
    setRestTimerInitialSeconds(0);
    setRestTimerCompleted(false);
    setActiveRestExerciseId(null);
    setActiveRestSetId(null);
  };

  const finishExercise = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, completed: true };
      }
      return ex;
    }));
  };

  const clearRestTimerCompleted = () => {
    setRestTimerCompleted(false);
  };

  const clearStretchTimerCompleted = () => {
    setStretchTimerCompleted(false);
  };

  return (
    <ActiveWorkoutContext.Provider
      value={{
        isWorkoutActive,
        workoutStartTime,
        workoutDuration,
        workoutType,
        exercises,
        activeRestTimer,
        restTimerEndTime,
        restTimerInitialSeconds,
        restTimerCompleted,
        activeStretchTimer,
        stretchTimerEndTime,
        stretchTimerCompleted,
        activeStretchId,
        clearRestTimerCompleted,
        clearStretchTimerCompleted,
        startWorkout,
        startWorkoutFromTemplate,
        finishWorkout,
        cancelWorkout,
        addExercise,
        logSet,
        updateSet,
        deleteSet,
        toggleSetWarmup,
        deleteExercise,
        moveExercise,
        addCardioActivity,
        startCardioTimer,
        pauseCardioTimer,
        resumeCardioTimer,
        finishCardioActivity,
        addStretchingActivity,
        startStretchTimer,
        completeStretch,
        updateCardioActivity,
        updateStretchingActivity,
        startRestTimer,
        addExtraRestTime,
        cancelRestTimer,
        finishExercise,
      }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
};
