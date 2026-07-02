import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert,
  Platform,
  AppState,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { useGlobalDate } from '../context/GlobalDateContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { healthService } from '../utils/healthService';
import { useMeasurementSystem } from '../hooks/useMeasurementSystem';
import { convertWeightToStorage, convertWeightForDisplay } from '../utils/measurements';
import { getTodayDate } from '../utils/date';
import ActivityRings from '../components/ActivityRings';
import MiniActivityRings from '../components/MiniActivityRings';
import { ActivityRingsCard } from '../components/workout/ActivityRingsCard';
import { StepCounterCard } from '../components/workout/StepCounterCard';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { EditNotesModal } from '../components/workout/EditNotesModal';
import { EditWorkoutModal } from '../components/workout/EditWorkoutModal';
import { CalendarModal } from '../components/workout/CalendarModal';
import { ActiveWorkoutModal } from '../components/workout/ActiveWorkoutModal';
import { WorkoutTypeSelectionModal, type WorkoutType } from '../components/workout/WorkoutTypeSelectionModal';
import { WorkoutStartOptionsModal } from '../components/workout/WorkoutStartOptionsModal';
import { TemplateSelectionModal } from '../components/workout/TemplateSelectionModal';

interface WorkoutsScreenProps {
  onOpenSettings: () => void;
  onStartWorkout: () => void;
}

interface WorkoutSet {
  id: string;
  reps: number;
  weight?: number;
  completed: boolean;
  completedAt?: number; // timestamp
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  restTimer?: number; // seconds
  previousWeight?: number; // from last workout
  previousReps?: number;
}

interface WorkoutSession {
  id: string;
  date: string;
  title?: string;
  workoutType?: WorkoutType;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number;
  intensity?: number; // 0-10 scale
  startTime?: number;
  endTime?: number;
}

interface WorkoutHistory {
  [date: string]: WorkoutSession[]; // Changed to array to support multiple workouts per day
}

interface DailyActivityData {
  date: string;
  steps: number;
  exerciseMinutes: number;
  caloriesBurned: number;
  lastUpdated?: number; // Timestamp of when this data was last saved
}

interface DailyActivityHistory {
  [date: string]: DailyActivityData;
}



export default function WorkoutsScreen({ onOpenSettings, onStartWorkout }: WorkoutsScreenProps) {
  const { theme } = useTheme();
  const { startWorkout: contextStartWorkout, startWorkoutFromTemplate, isWorkoutActive, workoutDuration } = useActiveWorkout();
  const { measurementSystem } = useMeasurementSystem();
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory>({});
  const [dailyActivityHistory, setDailyActivityHistory] = useState<DailyActivityHistory>({});
  const [showWorkoutTypeModal, setShowWorkoutTypeModal] = useState(false);
  const [showStartOptionsModal, setShowStartOptionsModal] = useState(false);
  const [showTemplateSelectionModal, setShowTemplateSelectionModal] = useState(false);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<WorkoutType | null>(null);
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(false);
  const [editingWorkoutIndex, setEditingWorkoutIndex] = useState<number>(0); // Track which workout in array
  const [editNotesText, setEditNotesText] = useState('');
  const [editWorkoutTitle, setEditWorkoutTitle] = useState('');
  const [editWorkoutExercises, setEditWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [addingSetToExerciseId, setAddingSetToExerciseId] = useState<string | null>(null);
  const [newSetReps, setNewSetReps] = useState('');
  const [newSetWeight, setNewSetWeight] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [restMinutes, setRestMinutes] = useState(1);
  const [restSeconds, setRestSeconds] = useState(30);
  const [notes, setNotes] = useState('');
  const [currentExercises, setCurrentExercises] = useState<WorkoutExercise[]>([]);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [activeRestTimer, setActiveRestTimer] = useState<number | null>(null);
  const [restTimerInterval, setRestTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [todaySteps, setTodaySteps] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [exerciseMinutesGoal, setExerciseMinutesGoal] = useState(30);
  const [caloriesBurnedGoal, setCaloriesBurnedGoal] = useState(300);
  const [todayExerciseMinutes, setTodayExerciseMinutes] = useState(0);
  const [todayCaloriesBurned, setTodayCaloriesBurned] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [useHealthAPI, setUseHealthAPI] = useState(false);
  const [stepMultiplier, setStepMultiplier] = useState(1.33);
  const [multiplierLoaded, setMultiplierLoaded] = useState(false);
  
  // Calendar state
  const { selectedDate, setSelectedDate } = useGlobalDate();
  const now = new Date();
  const [viewingMonth, setViewingMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

  useEffect(() => {
    loadWorkoutHistory();
    loadDailyActivityHistory();
    loadWorkoutGoals();
    loadStepMultiplier();
    initializeHealthAPI();
  }, []);

  // Sync workout duration to daily activity after history loads
  useEffect(() => {
    // Always sync, even if workoutHistory is empty, to clear stale data
    syncWorkoutToActivity();
  }, [workoutHistory]);

  // Reload workout history when workout finishes
  useEffect(() => {
    if (!isWorkoutActive) {
      loadWorkoutHistory();
      loadDailyActivityHistory();
    }
  }, [isWorkoutActive]);

  // Load today's exercise minutes from daily activity history
  useEffect(() => {
    const today = getTodayDate();
    const todayActivity = dailyActivityHistory[today];
    if (todayActivity) {
      setTodayExerciseMinutes(todayActivity.exerciseMinutes || 0);
      setTodayCaloriesBurned(todayActivity.caloriesBurned || 0);
    }
  }, [dailyActivityHistory]);

  useEffect(() => {
    // Only setup tracking after multiplier is loaded
    if (!multiplierLoaded) return;
    
    setupStepTracking();

    // Initial update after a short delay
    const initialTimeout = setTimeout(() => {
      updateStepCount();
    }, 500);

    // Set up AppState listener
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        updateStepCount();
      }
    });

    // Set up interval to check every 30 seconds
    const intervalId = setInterval(() => {
      updateStepCount();
    }, 30 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [multiplierLoaded, stepMultiplier]);

  // Auto-save today's activity data
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      const today = getTodayDate();
      saveDailyActivity(today, todaySteps, todayExerciseMinutes, todayCaloriesBurned);
    }, 2000); // Debounce saves by 2 seconds

    return () => clearTimeout(saveTimer);
  }, [todaySteps, todayExerciseMinutes, todayCaloriesBurned]);

  const loadStepMultiplier = async () => {
    try {
      const multiplier = await storage.getItem<number>(STORAGE_KEYS.STEP_MULTIPLIER);
      if (multiplier !== null) {
        setStepMultiplier(multiplier);
      }
      setMultiplierLoaded(true);
    } catch (error) {
      console.error('Error loading step multiplier:', error);
      setMultiplierLoaded(true);
    }
  };

  const initializeHealthAPI = async () => {
    try {
      const initialized = await healthService.initialize();
      setUseHealthAPI(initialized);
      console.log('Health API available:', initialized);
    } catch (error) {
      console.log('Health API init failed:', error);
      setUseHealthAPI(false);
    }
  };

  const updateStepCount = async () => {
    try {
      let rawSteps = 0;

      // Try Health API first
      if (useHealthAPI) {
        rawSteps = await healthService.getTodaySteps();
        console.log('Steps from Health API:', rawSteps);
      }
      
      // Fallback to Pedometer if Health API fails or returns 0
      if (rawSteps === 0) {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (isAvailable) {
          const permission = await Pedometer.getPermissionsAsync();
          
          if (permission.status === 'granted') {
            const end = new Date();
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const pastStepsResult = await Pedometer.getStepCountAsync(start, end);
            if (pastStepsResult) {
              rawSteps = pastStepsResult.steps;
              console.log('Steps from Pedometer:', rawSteps);
            }
          }
        }
      }

      // Apply multiplier to compensate for health API inaccuracy
      const adjustedSteps = Math.round(rawSteps * stepMultiplier);
      setTodaySteps(adjustedSteps);
    } catch (error) {
      console.error('Error updating step count:', error);
    }
  };

  const setupStepTracking = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (isAvailable) {
        const permission = await Pedometer.requestPermissionsAsync();
        
        if (permission.status === 'granted') {
          updateStepCount();
        } else {
          Alert.alert(
            'Permission Required',
            'Please grant permission to access your step data in Settings.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error setting up step tracking:', error);
    }
  };

  const loadWorkoutHistory = async () => {
    try {
      const history = await storage.getItem<WorkoutHistory>(STORAGE_KEYS.WORKOUT_HISTORY);
      if (history) {
        // Migrate old format (single workout per day) to new format (array of workouts)
        const migratedHistory: WorkoutHistory = {};
        for (const [date, workouts] of Object.entries(history)) {
          if (Array.isArray(workouts)) {
            // Ensure each workout has an ID
            migratedHistory[date] = workouts.map((workout, index) => ({
              ...workout,
              id: workout.id || `${date}-${index}-${Date.now()}`,
            }));
          } else {
            // Old format: single workout object, convert to array and ensure ID
            const workout = workouts as any;
            migratedHistory[date] = [{
              ...workout,
              id: workout.id || `${date}-0-${Date.now()}`,
            }];
          }
        }
        setWorkoutHistory(migratedHistory);
        // Save migrated format back to storage
        if (JSON.stringify(history) !== JSON.stringify(migratedHistory)) {
          await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, migratedHistory);
        }
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
    }
  };

  const loadDailyActivityHistory = async () => {
    try {
      const history = await storage.getItem<DailyActivityHistory>(STORAGE_KEYS.DAILY_ACTIVITY);
      if (history) {
        setDailyActivityHistory(history);
        // Restore today's data from storage (including steps)
        const today = getTodayDate();
        const todayActivity = history[today];
        if (todayActivity) {
          setTodaySteps(todayActivity.steps || 0);
          setTodayExerciseMinutes(todayActivity.exerciseMinutes || 0);
          setTodayCaloriesBurned(todayActivity.caloriesBurned || 0);
        }
      }
    } catch (error) {
      console.error('Error loading daily activity history:', error);
    }
  };

  const syncWorkoutToActivity = async () => {
    try {
      const today = getTodayDate();
      
      // Get current activity history
      const activityHistory = await storage.getItem<DailyActivityHistory>(STORAGE_KEYS.DAILY_ACTIVITY) || {};
      
      // Sync ALL days in workout history, not just today
      Object.keys(workoutHistory).forEach(dateString => {
        const dayWorkouts = workoutHistory[dateString];
        
        // Initialize activity for this day if it doesn't exist, preserving any existing data
        if (!activityHistory[dateString]) {
          activityHistory[dateString] = {
            date: dateString,
            steps: 0,
            exerciseMinutes: 0,
            caloriesBurned: 0,
            lastUpdated: Date.now(),
          };
        }
        
        if (dayWorkouts && dayWorkouts.length > 0) {
          // Sum up all workouts for this day
          let totalMinutes = 0;
          let totalCalories = 0;
          
          dayWorkouts.forEach(workout => {
            if (workout.duration) {
              totalMinutes += workout.duration;
              const caloriesPerMinute = workout.intensity !== undefined 
                ? (3 + workout.intensity * 0.7) 
                : 5;
              totalCalories += Math.floor(workout.duration * caloriesPerMinute);
            }
          });
          
          // Update exercise minutes from workout duration (preserve existing steps)
          activityHistory[dateString].exerciseMinutes = totalMinutes;
          activityHistory[dateString].caloriesBurned = totalCalories;
        } else {
          // No workouts for this day, reset exercise minutes and calories to 0 (preserve steps)
          activityHistory[dateString].exerciseMinutes = 0;
          activityHistory[dateString].caloriesBurned = 0;
        }
      });
      
      // Always ensure today is processed, even if there are no workouts for today
      if (!workoutHistory[today]) {
        // Initialize today if it doesn't exist
        if (!activityHistory[today]) {
          activityHistory[today] = {
            date: today,
            steps: 0,
            exerciseMinutes: 0,
            caloriesBurned: 0,
            lastUpdated: Date.now(),
          };
        } else {
          // Today exists in activity history but has no workouts - clear exercise data but preserve steps
          activityHistory[today].exerciseMinutes = 0;
          activityHistory[today].caloriesBurned = 0;
          activityHistory[today].lastUpdated = Date.now();
        }
      }
      
      await storage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, activityHistory);
      
      // Update state
      setDailyActivityHistory({ ...activityHistory });
      
      // Update today's values for the UI
      const todayActivity = activityHistory[today];
      if (todayActivity) {
        setTodayExerciseMinutes(todayActivity.exerciseMinutes);
        setTodayCaloriesBurned(todayActivity.caloriesBurned);
      }
    } catch (error) {
      console.error('Error syncing workout to activity:', error);
    }
  };

  const saveDailyActivity = async (date: string, steps: number, exerciseMinutes: number, caloriesBurned: number) => {
    try {
      const activityData: DailyActivityData = {
        date,
        steps,
        exerciseMinutes,
        caloriesBurned,
        lastUpdated: Date.now(), // Save timestamp of when this data was recorded
      };

      const updatedHistory = {
        ...dailyActivityHistory,
        [date]: activityData, // This REPLACES the existing data for this date
      };

      await storage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, updatedHistory);
      setDailyActivityHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving daily activity:', error);
    }
  };

  const loadWorkoutGoals = async () => {
    try {
      const goals = await storage.getItem<{ dailySteps: number; exerciseMinutes: number; caloriesBurned: number }>(STORAGE_KEYS.WORKOUT_GOALS);
      if (goals) {
        if (goals.dailySteps) setStepGoal(goals.dailySteps);
        if (goals.exerciseMinutes) setExerciseMinutesGoal(goals.exerciseMinutes);
        if (goals.caloriesBurned) setCaloriesBurnedGoal(goals.caloriesBurned);
      }
    } catch (error) {
      console.error('Error loading workout goals:', error);
    }
  };

  const addExercise = () => {
    if (!exerciseName.trim()) {
      Alert.alert('Missing Info', 'Please enter an exercise name');
      return;
    }

    // Find this exercise from previous workout for reference
    const previousWorkout = getLastWorkoutWithExercise(exerciseName.trim());
    
    const totalRestSeconds = restMinutes * 60 + restSeconds;
    
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: exerciseName.trim(),
      sets: [],
      restTimer: totalRestSeconds,
      previousWeight: previousWorkout?.weight,
      previousReps: previousWorkout?.reps,
    };

    setCurrentExercises([...currentExercises, newExercise]);
    setActiveExerciseId(newExercise.id);
    setExerciseName('');
    setReps('');
    setWeight('');
  };

  const logSet = () => {
    if (!activeExerciseId) {
      Alert.alert('No Active Exercise', 'Please add an exercise first');
      return;
    }

    if (!reps) {
      Alert.alert('Missing Info', 'Please enter reps for this set');
      return;
    }

    const newSet: WorkoutSet = {
      id: `${Date.now()}`,
      reps: parseInt(reps) || 0,
      weight: weight ? convertWeightToStorage(parseFloat(weight), measurementSystem) : undefined,
      completed: true,
      completedAt: Date.now(),
    };

    const totalRestSeconds = restMinutes * 60 + restSeconds;

    setCurrentExercises(prevExercises =>
      prevExercises.map(ex => {
        if (ex.id === activeExerciseId) {
          return {
            ...ex,
            sets: [...ex.sets, newSet],
            restTimer: totalRestSeconds,
          };
        }
        return ex;
      })
    );

    // Start rest timer
    startRestTimer(totalRestSeconds);
    
    // Clear inputs for next set
    setReps('');
    setWeight('');
  };

  const editSet = (exerciseId: string, setId: string) => {
    const exercise = currentExercises.find(ex => ex.id === exerciseId);
    const set = exercise?.sets.find(s => s.id === setId);
    
    if (set) {
      setReps(set.reps.toString());
      const displayWeight = convertWeightForDisplay(set.weight, measurementSystem);
      setWeight(displayWeight !== undefined ? displayWeight.toString() : '');
      setEditingSetId(setId);
    }
  };

  const updateSet = (exerciseId: string, setId: string, newReps: number, newWeight?: number) => {
    setCurrentExercises(prevExercises =>
      prevExercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set =>
              set.id === setId
                ? { ...set, reps: newReps, weight: newWeight }
                : set
            ),
          };
        }
        return ex;
      })
    );
    setEditingSetId(null);
    setReps('');
    setWeight('');
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    Alert.alert(
      'Delete Set',
      'Remove this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCurrentExercises(prevExercises =>
              prevExercises.map(ex => {
                if (ex.id === exerciseId) {
                  return {
                    ...ex,
                    sets: ex.sets.filter(set => set.id !== setId),
                  };
                }
                return ex;
              })
            );
          },
        },
      ]
    );
  };

  const finishExercise = () => {
    if (!activeExerciseId) return;
    
    cancelRestTimer();
    setActiveExerciseId(null);
    setReps('');
    setWeight('');
  };

 const getLastWorkoutWithExercise = (exerciseName: string) => {
    const dates = Object.keys(workoutHistory).sort((a, b) => b.localeCompare(a));
    
    for (const date of dates) {
      const workouts = workoutHistory[date];
      if (!workouts || !Array.isArray(workouts)) continue;
      // Iterate through all workouts for this date
      for (const workout of workouts) {
        const exercise = workout.exercises.find(ex => 
          ex.name.toLowerCase() === exerciseName.toLowerCase()
        );
        
        if (exercise && exercise.sets.length > 0) {
          // Return the first set's data as reference
          return {
            weight: exercise.sets[0].weight,
            reps: exercise.sets[0].reps,
          };
        }
      }
    }
    
    return null;
  };

  const startWorkout = () => {
    setSelectedWorkoutType('strength');
    setShowStartOptionsModal(true);
  };

  const handleStartBlankWorkout = () => {
    if (selectedWorkoutType) {
      contextStartWorkout(selectedWorkoutType);
      setShowStartOptionsModal(false);
      setSelectedWorkoutType(null);
      onStartWorkout();
    }
  };

  const handleStartFromTemplate = () => {
    setShowStartOptionsModal(false);
    setShowTemplateSelectionModal(true);
  };

  const handleSelectTemplate = async (template: any) => {
    try {
      // Close ALL modals first
      setShowTemplateSelectionModal(false);
      setShowStartOptionsModal(false);
      setShowWorkoutTypeModal(false);
      setSelectedWorkoutType(null);
      
      // Wait for modals to close
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await startWorkoutFromTemplate(template);
      
      // Wait a bit more to ensure state propagates
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onStartWorkout();
    } catch (error) {
      console.error('Error selecting template:', error);
      Alert.alert('Error', 'Failed to start workout from template');
      setShowTemplateSelectionModal(false);
      setShowStartOptionsModal(false);
      setShowWorkoutTypeModal(false);
      setSelectedWorkoutType(null);
    }
  };

  const handleCloseStartOptions = () => {
    setShowStartOptionsModal(false);
    setSelectedWorkoutType(null);
  };

  const handleCloseTemplateSelection = () => {
    setShowTemplateSelectionModal(false);
    setShowStartOptionsModal(true);
  };

  const handleEditNotes = (workoutIndex: number = 0) => {
    const todayWorkouts = getTodayWorkout();
    if (todayWorkouts && todayWorkouts[workoutIndex]) {
      setEditingWorkoutIndex(workoutIndex);
      setEditNotesText(todayWorkouts[workoutIndex].notes || '');
      setEditingNotes(true);
    }
  };

  const handleEditWorkout = (workoutIndex: number = 0) => {
    const todayWorkouts = getTodayWorkout();
    if (todayWorkouts && todayWorkouts[workoutIndex]) {
      setEditingWorkoutIndex(workoutIndex);
      setEditWorkoutTitle(todayWorkouts[workoutIndex].title || '');
      // Ensure exercises defaults to empty array and has valid sets
      const exercises = todayWorkouts[workoutIndex].exercises || [];
      setEditWorkoutExercises(exercises);
      setEditNotesText(todayWorkouts[workoutIndex].notes || '');
      setEditingWorkout(true);
    }
  };

  const handleSaveNotes = async () => {
    const todayWorkouts = getTodayWorkout();
    if (!todayWorkouts || !todayWorkouts[editingWorkoutIndex]) return;

    try {
      const today = getTodayDate();
      const updatedWorkouts = [...todayWorkouts];
      updatedWorkouts[editingWorkoutIndex] = {
        ...updatedWorkouts[editingWorkoutIndex],
        notes: editNotesText.trim() || undefined,
      };

      const history = workoutHistory;
      history[today] = updatedWorkouts;
      await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, history);
      setWorkoutHistory({ ...history });
      setEditingNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleSaveWorkout = async () => {
    const todayWorkouts = getTodayWorkout();
    if (!todayWorkouts || !todayWorkouts[editingWorkoutIndex]) return;

    try {
      const today = getTodayDate();
      const updatedWorkouts = [...todayWorkouts];
      updatedWorkouts[editingWorkoutIndex] = {
        ...updatedWorkouts[editingWorkoutIndex],
        title: editWorkoutTitle.trim() || undefined,
        exercises: editWorkoutExercises,
        notes: editNotesText.trim() || undefined,
      };

      const history = workoutHistory;
      history[today] = updatedWorkouts;
      await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, history);
      setWorkoutHistory({ ...history });
      
      // Update daily activity with workout duration
      const workout = updatedWorkouts[editingWorkoutIndex];
      if (workout.duration) {
        // Recalculate total for all workouts
        await syncWorkoutToActivity();
      }
      
      setEditingWorkout(false);
      setAddingSetToExerciseId(null);
      setNewSetReps('');
      setNewSetWeight('');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleDeleteExerciseFromEdit = (exerciseId: string) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEditWorkoutExercises(prev => prev.filter(ex => ex.id !== exerciseId));
          },
        },
      ]
    );
  };

  const handleDeleteSetFromEdit = (exerciseId: string, setId: string) => {
    setEditWorkoutExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.filter(s => s.id !== setId),
        };
      }
      return ex;
    }));
  };

  const handleAddSetToExercise = (exerciseId: string) => {
    if (!newSetReps) return;

    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      reps: parseInt(newSetReps),
      weight: newSetWeight ? parseFloat(newSetWeight) : undefined,
      completed: true,
      completedAt: Date.now(),
    };

    setEditWorkoutExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: [...ex.sets, newSet],
        };
      }
      return ex;
    }));

    setAddingSetToExerciseId(null);
    setNewSetReps('');
    setNewSetWeight('');
  };

  const handleEditExerciseName = (exerciseId: string, newName: string) => {
    setEditWorkoutExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, name: newName };
      }
      return ex;
    }));
  };

  const startRestTimer = (seconds: number) => {
    // Clear existing timer
    if (restTimerInterval) {
      clearInterval(restTimerInterval);
    }
    
    setActiveRestTimer(seconds);
    
    const interval = setInterval(() => {
      setActiveRestTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    setRestTimerInterval(interval);
  };

  const cancelRestTimer = () => {
    if (restTimerInterval) {
      clearInterval(restTimerInterval);
      setRestTimerInterval(null);
    }
    setActiveRestTimer(null);
  };

  const removeExercise = (id: string) => {
    if (id === activeExerciseId) {
      setActiveExerciseId(null);
      setReps('');
      setWeight('');
      cancelRestTimer();
    }
    setCurrentExercises(currentExercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = async () => {
    if (currentExercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise');
      return;
    }

    // Show notes dialog before saving
    Alert.prompt(
      'Workout Complete!',
      'Add notes about your workout (optional)',
      [
        {
          text: 'Skip',
          onPress: () => finalizeSaveWorkout(''),
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: (text?: string) => finalizeSaveWorkout(text || ''),
        },
      ],
      'plain-text',
      notes
    );
  };

  const finalizeSaveWorkout = async (workoutNotes: string) => {
    const endTime = Date.now();
    const duration = workoutStartTime ? Math.floor((endTime - workoutStartTime) / 1000 / 60) : 0; // minutes

    const todayDate = getTodayDate();
    const newWorkout: WorkoutSession = {
      id: Date.now().toString(),
      date: todayDate,
      exercises: currentExercises,
      notes: workoutNotes.trim() || undefined,
      duration,
      startTime: workoutStartTime || undefined,
      endTime,
    };

    const updatedHistory = { ...workoutHistory };
    if (!updatedHistory[todayDate] || !Array.isArray(updatedHistory[todayDate])) {
      updatedHistory[todayDate] = [];
    }
    updatedHistory[todayDate].push(newWorkout);

    await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, updatedHistory);
    setWorkoutHistory(updatedHistory);
    
    // Update exercise minutes for activity tracking
    setTodayExerciseMinutes(prev => prev + duration);
    
    // Simple calorie calculation: ~5 calories per minute of strength training
    const caloriesBurned = Math.floor(duration * 5);
    setTodayCaloriesBurned(prev => prev + caloriesBurned);
    
    // Reset state
    setCurrentExercises([]);
    setActiveExerciseId(null);
    setExerciseName('');
    setReps('');
    setWeight('');
    setNotes('');
    setWorkoutStartTime(null);
    cancelRestTimer();
    setShowAddWorkoutModal(false);
    
    Alert.alert('Success', `Workout saved! ${duration} minutes, ~${caloriesBurned} calories burned`);
  };

  const cancelWorkout = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure? All progress will be lost.',
      [
        { text: 'Keep Working Out', style: 'cancel' },
        {
          text: 'Cancel Workout',
          style: 'destructive',
          onPress: () => {
            setCurrentExercises([]);
            setActiveExerciseId(null);
            setExerciseName('');
            setReps('');
            setWeight('');
            setNotes('');
            setWorkoutStartTime(null);
            cancelRestTimer();
            setShowAddWorkoutModal(false);
          },
        },
      ]
    );
  };

  const deleteWorkout = async (date: string, workoutId: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedHistory = { ...workoutHistory };
            const dayWorkouts = updatedHistory[date];
            
            if (dayWorkouts && dayWorkouts.length > 0) {
              // Filter out the workout with matching ID
              const filteredWorkouts = dayWorkouts.filter(w => w.id !== workoutId);
              
              if (filteredWorkouts.length === 0) {
                // If no workouts left, remove the date entry
                delete updatedHistory[date];
              } else {
                // Otherwise, update with remaining workouts
                updatedHistory[date] = filteredWorkouts;
              }
              
              await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, updatedHistory);
              setWorkoutHistory(updatedHistory);
              
              // Resync activity data for this date
              await syncWorkoutToActivity();
            }
          },
        },
      ]
    );
  };

  const getTodayWorkout = () => {
    const today = getTodayDate();
    return workoutHistory[today] || []; // Return array of workouts
  };

  const getSelectedDateWorkout = () => {
    return workoutHistory[selectedDate] || []; // Return array of workouts
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  const changeMonth = (delta: number) => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    setViewingMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const selectedDateWorkout = getSelectedDateWorkout();
  const isToday = selectedDate === getTodayDate();

  // Get activity data for the selected date
  const selectedDateActivity = dailyActivityHistory[selectedDate];
  const displaySteps = isToday ? todaySteps : (selectedDateActivity?.steps || 0);
  const displayExerciseMinutes = isToday 
    ? todayExerciseMinutes
    : (selectedDateActivity?.exerciseMinutes || 0);
  const displayCaloriesBurned = isToday ? todayCaloriesBurned : (selectedDateActivity?.caloriesBurned || 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Workouts</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setShowHistoryModal(true)} style={styles.iconButton}>
            <Ionicons name="calendar-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenSettings} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isToday && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={startWorkout}
          >
            <Ionicons name="barbell-outline" size={24} color="white" />
            <Text style={styles.addButtonText}>Start Workout</Text>
          </TouchableOpacity>
        )}

        {/* Activity Rings Card */}
        <ActivityRingsCard
          theme={theme}
          todaySteps={displaySteps}
          stepGoal={stepGoal}
          todayExerciseMinutes={displayExerciseMinutes}
          exerciseMinutesGoal={exerciseMinutesGoal}
          todayCaloriesBurned={displayCaloriesBurned}
          caloriesBurnedGoal={caloriesBurnedGoal}
        />

        {/* Step Counter Card */}
        {isPedometerAvailable && (
          <StepCounterCard
            theme={theme}
            todaySteps={displaySteps}
            stepGoal={stepGoal}
          />
        )}


        {/* Back to Today button */}
        {!isToday && (
          <TouchableOpacity
            style={[styles.backToTodayButton, { backgroundColor: theme.primary }]}
            onPress={() => setSelectedDate(getTodayDate())}
          >
            <Ionicons name="today-outline" size={20} color="white" />
            <Text style={styles.backToTodayText}>Back to Today</Text>
          </TouchableOpacity>
        )}

        {selectedDateWorkout && selectedDateWorkout.length > 0 ? (
          <>
            {selectedDateWorkout.map((workout, workoutIndex) => {
              // Ensure workout has valid data
              if (!workout) return null;
              const workoutId = workout.id || `${selectedDate}-${workoutIndex}`;
              const showTitle = selectedDateWorkout.length > 1 
                ? `Workout ${workoutIndex + 1}` 
                : (isToday ? "Today's Workout" : 'Workout');
              
              return (
                <WorkoutCard
                  key={workoutId}
                  workout={workout}
                  workoutIndex={workoutIndex}
                  totalWorkouts={selectedDateWorkout.length}
                  theme={theme}
                  isToday={isToday}
                  showTitle={showTitle}
                  onEdit={isToday ? () => handleEditWorkout(workoutIndex) : undefined}
                  onDelete={() => deleteWorkout(selectedDate, workoutId)}
                  onAddNotes={isToday ? () => handleEditWorkout(workoutIndex) : undefined}
                />
              );
            })}
          </>
        ) : (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {isToday ? 'No workout logged for today' : `No workout logged for ${formatDate(selectedDate)}`}
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Workout Start Options Modal */}
      <WorkoutStartOptionsModal
        visible={showStartOptionsModal}
        workoutType={selectedWorkoutType}
        onClose={handleCloseStartOptions}
        onStartBlank={handleStartBlankWorkout}
        onStartFromTemplate={handleStartFromTemplate}
      />

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        visible={showTemplateSelectionModal}
        workoutType={selectedWorkoutType}
        onClose={handleCloseTemplateSelection}
        onSelectTemplate={handleSelectTemplate}
      />


      {/* Edit Notes Modal */}
      <EditNotesModal
        visible={editingNotes}
        notes={editNotesText}
        onNotesChange={setEditNotesText}
        onClose={() => setEditingNotes(false)}
        onSave={handleSaveNotes}
        theme={theme}
      />

      {/* Edit Workout Modal */}
      <EditWorkoutModal
        visible={editingWorkout}
        exercises={editWorkoutExercises}
        workoutTitle={editWorkoutTitle}
        notes={editNotesText}
        addingSetToExerciseId={addingSetToExerciseId}
        newSetReps={newSetReps}
        newSetWeight={newSetWeight}
        onClose={() => setEditingWorkout(false)}
        onSave={handleSaveWorkout}
        onWorkoutTitleChange={setEditWorkoutTitle}
        onNotesChange={setEditNotesText}
        onExerciseNameChange={handleEditExerciseName}
        onDeleteExercise={handleDeleteExerciseFromEdit}
        onDeleteSet={handleDeleteSetFromEdit}
        onAddSetClick={setAddingSetToExerciseId}
        onAddSetCancel={() => {
          setAddingSetToExerciseId(null);
          setNewSetReps('');
          setNewSetWeight('');
        }}
        onAddSet={handleAddSetToExercise}
        onNewSetRepsChange={setNewSetReps}
        onNewSetWeightChange={setNewSetWeight}
        theme={theme}
      />

      {/* Active Workout Modal */}
      <ActiveWorkoutModal
        visible={showAddWorkoutModal}
        currentExercises={currentExercises}
        activeExerciseId={activeExerciseId}
        workoutStartTime={workoutStartTime}
        exerciseName={exerciseName}
        reps={reps}
        weight={weight}
        restMinutes={restMinutes}
        restSeconds={restSeconds}
        editingSetId={editingSetId}
        activeRestTimer={activeRestTimer}
        onClose={cancelWorkout}
        onFinishExercise={finishExercise}
        onRemoveExercise={removeExercise}
        onEditSet={editSet}
        onDeleteSet={deleteSet}
        onUpdateSet={updateSet}
        onLogSet={logSet}
        onAddExercise={addExercise}
        onSaveWorkout={saveWorkout}
        onCancelRestTimer={cancelRestTimer}
        onExerciseNameChange={setExerciseName}
        onRepsChange={setReps}
        onWeightChange={setWeight}
        onRestMinutesChange={setRestMinutes}
        onRestSecondsChange={setRestSeconds}
        onCancelEdit={() => {
          setEditingSetId(null);
          setReps('');
          setWeight('');
        }}
        theme={theme}
      />

      {/* History Modal */}
      <CalendarModal
        visible={showHistoryModal}
        viewingMonth={viewingMonth}
        selectedDate={selectedDate}
        workoutHistory={workoutHistory}
        dailyActivityHistory={dailyActivityHistory}
        todaySteps={todaySteps}
        todayExerciseMinutes={todayExerciseMinutes}
        todayCaloriesBurned={todayCaloriesBurned}
        stepGoal={stepGoal}
        exerciseMinutesGoal={exerciseMinutesGoal}
        caloriesBurnedGoal={caloriesBurnedGoal}
        isWorkoutActive={isWorkoutActive}
        workoutDuration={workoutDuration}
        getTodayDate={getTodayDate}
        onClose={() => setShowHistoryModal(false)}
        onMonthChange={changeMonth}
        onDateSelect={setSelectedDate}
        onViewingMonthChange={setViewingMonth}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  topBarTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteWorkoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  editNotesIconButton: {
    padding: 4,
  },
  // Shared modal styles (used by Edit Workout Modal)
  editNotesTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  editNotesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 120,
  },
  editNotesButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editNotesModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editNotesButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  editNotesSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  editNotesLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  backToTodayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  backToTodayText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },


  historyDetailCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDetailDate: {
    fontSize: 16,
    fontWeight: '700',
  },
  historyExerciseItem: {
    paddingVertical: 6,
  },
  historyNotes: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },

  dayDetailModalContent: {
    borderRadius: 24,
    padding: 20,
    width: '95%',
    maxWidth: 700,
    maxHeight: '85%',
  },
  dayDetailScroll: {
    flex: 1,
  },
  dayDetailContent: {
    paddingBottom: 20,
  },
  bodyMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  bodyMapIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bodyMapTextContainer: {
    flex: 1,
  },
  bodyMapTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  bodyMapSubtitle: {
    fontSize: 13,
  },
});
