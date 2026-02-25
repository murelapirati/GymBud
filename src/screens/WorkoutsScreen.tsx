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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import ActivityRings from '../components/ActivityRings';
import MiniActivityRings from '../components/MiniActivityRings';

interface WorkoutsScreenProps {
  onOpenSettings: () => void;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface WorkoutSession {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number;
}

interface WorkoutHistory {
  [date: string]: WorkoutSession;
}

const getTodayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export default function WorkoutsScreen({ onOpenSettings }: WorkoutsScreenProps) {
  const { theme } = useTheme();
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory>({});
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [currentExercises, setCurrentExercises] = useState<WorkoutExercise[]>([]);
  const [todaySteps, setTodaySteps] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [exerciseMinutesGoal, setExerciseMinutesGoal] = useState(30);
  const [caloriesBurnedGoal, setCaloriesBurnedGoal] = useState(300);
  const [todayExerciseMinutes, setTodayExerciseMinutes] = useState(0);
  const [todayCaloriesBurned, setTodayCaloriesBurned] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepOffset, setStepOffset] = useState(300);
  const [offsetLoaded, setOffsetLoaded] = useState(false);
  
  // Calendar state
  const now = new Date();
  const [viewingMonth, setViewingMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

  useEffect(() => {
    loadWorkoutHistory();
    loadWorkoutGoals();
    loadStepOffset();
  }, []);

  useEffect(() => {
    // Only setup tracking after offset is loaded
    if (!offsetLoaded) return;
    
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

    // Set up interval to check every 10 seconds
    const intervalId = setInterval(() => {
      updateStepCount();
    }, 10 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [offsetLoaded]);

  const updateStepCount = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const permission = await Pedometer.getPermissionsAsync();
        
        if (permission.status === 'granted') {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          const pastStepsResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepsResult) {
            // Add offset to match Health app aggregated data
            const adjustedSteps = pastStepsResult.steps + stepOffset;
            console.log('Pedometer:', pastStepsResult.steps, '+ offset:', stepOffset, '=', adjustedSteps);
            setTodaySteps(adjustedSteps);
          }
        }
      }
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
        setWorkoutHistory(history);
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
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

  const loadStepOffset = async () => {
    try {
      const offset = await storage.getItem<number>(STORAGE_KEYS.STEP_OFFSET);
      if (offset !== null) {
        setStepOffset(offset);
      }
      setOffsetLoaded(true);
    } catch (error) {
      console.error('Error loading step offset:', error);
      setOffsetLoaded(true);
    }
  };

  const addExercise = () => {
    if (!exerciseName.trim() || !sets || !reps) {
      Alert.alert('Missing Info', 'Please fill in exercise name, sets, and reps');
      return;
    }

    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: exerciseName.trim(),
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: weight ? parseFloat(weight) : undefined,
    };

    setCurrentExercises([...currentExercises, newExercise]);
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const removeExercise = (id: string) => {
    setCurrentExercises(currentExercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = async () => {
    if (currentExercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise');
      return;
    }

    const todayDate = getTodayDate();
    const newWorkout: WorkoutSession = {
      id: Date.now().toString(),
      date: todayDate,
      exercises: currentExercises,
      notes: notes.trim() || undefined,
    };

    const updatedHistory = {
      ...workoutHistory,
      [todayDate]: newWorkout,
    };

    await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, updatedHistory);
    setWorkoutHistory(updatedHistory);
    setCurrentExercises([]);
    setNotes('');
    setShowAddWorkoutModal(false);
    Alert.alert('Success', 'Workout saved!');
  };

  const deleteWorkout = async (date: string) => {
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
            delete updatedHistory[date];
            await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, updatedHistory);
            setWorkoutHistory(updatedHistory);
          },
        },
      ]
    );
  };

  const getTodayWorkout = () => {
    const today = getTodayDate();
    return workoutHistory[today];
  };

  const getHistoryDates = () => {
    return Object.keys(workoutHistory).sort((a, b) => b.localeCompare(a));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMonthName = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const changeMonth = (delta: number) => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    setViewingMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const canGoNextMonth = () => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const viewDate = new Date(year, month - 1, 1);
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return viewDate < currentMonth;
  };

  const getCalendarMonths = () => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    
    return dates;
  };

  const todayWorkout = getTodayWorkout();
  const historyDates = getHistoryDates();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
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
      
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Track your exercises</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Activity Rings Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.activityHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Activity</Text>
          </View>
          <View style={styles.ringsContainer}>
            <ActivityRings
              steps={todaySteps}
              stepsGoal={stepGoal}
              exerciseMinutes={todayExerciseMinutes}
              exerciseGoal={exerciseMinutesGoal}
              caloriesBurned={todayCaloriesBurned}
              caloriesGoal={caloriesBurnedGoal}
              size={180}
            />
          </View>
          <View style={styles.ringLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#5383B8' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                {todaySteps.toLocaleString()} / {stepGoal.toLocaleString()} steps
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                {todayExerciseMinutes} / {exerciseMinutesGoal} min
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                {todayCaloriesBurned.toLocaleString()} / {caloriesBurnedGoal.toLocaleString()} cal
              </Text>
            </View>
          </View>
        </View>

        {/* Step Counter Card */}
        {isPedometerAvailable && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.stepsHeader}>
              <View style={styles.stepsTitleContainer}>
                <Ionicons name="walk" size={24} color={theme.primary} />
                <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 0, marginLeft: 8 }]}>Today's Steps</Text>
              </View>
            </View>
            <View style={styles.stepsContent}>
              <Text style={[styles.stepsCount, { color: theme.primary }]}>
                {todaySteps.toLocaleString()}
              </Text>
              <Text style={[styles.stepsLabel, { color: theme.textSecondary }]}>steps</Text>
            </View>
            <View style={styles.stepsProgressBar}>
              <View style={[styles.stepsProgressBackground, { backgroundColor: theme.border }]}>
                <View 
                  style={[
                    styles.stepsProgressFill,
                    { 
                      backgroundColor: theme.primary,
                      width: `${Math.min((todaySteps / stepGoal) * 100, 100)}%`
                    }
                  ]}
                />
              </View>
              <View style={styles.stepsGoalRow}>
                <Text style={[styles.stepsGoalText, { color: theme.textSecondary }]}>0</Text>
                <Text style={[styles.stepsGoalText, { color: theme.textSecondary }]}>{stepGoal.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {todayWorkout ? (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Workout</Text>
            {todayWorkout.exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, { color: theme.text }]}>{exercise.name}</Text>
                  <Text style={[styles.exerciseDetails, { color: theme.textSecondary }]}>
                    {exercise.sets} sets × {exercise.reps} reps
                    {exercise.weight ? ` @ ${exercise.weight} lbs` : ''}
                  </Text>
                </View>
              </View>
            ))}
            {todayWorkout.notes && (
              <View style={styles.notesContainer}>
                <Text style={[styles.notesLabel, { color: theme.textSecondary }]}>Notes:</Text>
                <Text style={[styles.notesText, { color: theme.text }]}>{todayWorkout.notes}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No workout logged for today
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddWorkoutModal(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>Log Workout</Text>
        </TouchableOpacity>

        {historyDates.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Workouts</Text>
            {historyDates.slice(0, 3).map((date) => {
              const workout = workoutHistory[date];
              return (
                <View key={date} style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
                    {formatDate(date)}
                  </Text>
                  <Text style={[styles.historyExerciseCount, { color: theme.text }]}>
                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Workout Modal */}
      <Modal
        visible={showAddWorkoutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddWorkoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Log Workout</Text>
              <TouchableOpacity onPress={() => setShowAddWorkoutModal(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Exercise Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="e.g., Bench Press"
                placeholderTextColor={theme.textSecondary}
                value={exerciseName}
                onChangeText={setExerciseName}
              />

              <View style={styles.inputRow}>
                <View style={styles.inputColumn}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Sets</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                    placeholder="3"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                    value={sets}
                    onChangeText={setSets}
                  />
                </View>

                <View style={styles.inputColumn}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Reps</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                    placeholder="10"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                    value={reps}
                    onChangeText={setReps}
                  />
                </View>

                <View style={styles.inputColumn}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Weight (lbs)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                    placeholder="135"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.addExerciseButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                onPress={addExercise}
              >
                <Ionicons name="add" size={20} color={theme.primary} />
                <Text style={[styles.addExerciseButtonText, { color: theme.primary }]}>Add Exercise</Text>
              </TouchableOpacity>

              {currentExercises.length > 0 && (
                <View style={styles.exercisesList}>
                  <Text style={[styles.exercisesListTitle, { color: theme.text }]}>
                    Exercises ({currentExercises.length})
                  </Text>
                  {currentExercises.map((exercise) => (
                    <View key={exercise.id} style={[styles.exerciseListItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <View style={styles.exerciseListInfo}>
                        <Text style={[styles.exerciseName, { color: theme.text }]}>{exercise.name}</Text>
                        <Text style={[styles.exerciseDetails, { color: theme.textSecondary }]}>
                          {exercise.sets} × {exercise.reps}
                          {exercise.weight ? ` @ ${exercise.weight} lbs` : ''}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                        <Ionicons name="trash-outline" size={20} color={theme.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <Text style={[styles.inputLabel, { color: theme.text, marginTop: 16 }]}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="How did the workout feel?"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={saveWorkout}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Workout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal
        visible={showHistoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.historyModalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Activity History</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.monthNavigation}>
              <TouchableOpacity 
                style={[styles.monthNavButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => changeMonth(-1)}
              >
                <Ionicons name="chevron-back" size={24} color={theme.text} />
              </TouchableOpacity>
              
              <Text style={[styles.monthTitle, { color: theme.text }]}>
                {getMonthName(viewingMonth)}
              </Text>

              <TouchableOpacity 
                style={[styles.monthNavButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => changeMonth(1)}
                disabled={!canGoNextMonth()}
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={canGoNextMonth() ? theme.text : theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.calendarScrollView}
              contentContainerStyle={styles.calendarScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.calendarGrid}>
                {getCalendarMonths().map((dateString) => {
                  const date = new Date(dateString + 'T00:00:00');
                  const hasWorkout = !!workoutHistory[dateString];
                  const isToday = dateString === getTodayDate();
                  const isFuture = new Date(dateString) > new Date(getTodayDate());
                  
                  // For now, use todaySteps for current day, 0 for others
                  // In future, load saved daily activity data
                  const daySteps = isToday ? todaySteps : 0;
                  const dayExerciseMinutes = isToday ? todayExerciseMinutes : 0;
                  const dayCalories = isToday ? todayCaloriesBurned : 0;
                  
                  const stepsProgress = (daySteps / stepGoal) * 100;
                  const exerciseProgress = (dayExerciseMinutes / exerciseMinutesGoal) * 100;
                  const caloriesProgress = (dayCalories / caloriesBurnedGoal) * 100;

                  return (
                    <View
                      key={dateString}
                      style={[
                        styles.calendarDay,
                        { backgroundColor: theme.surface },
                        isToday && { borderColor: theme.primary, borderWidth: 2 },
                        isFuture && { opacity: 0.3 },
                      ]}
                    >
                      <Text style={[styles.calendarDayNumber, { color: theme.text }]}>
                        {date.getDate()}
                      </Text>
                      <Text style={[styles.calendarDayName, { color: theme.textSecondary }]}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      
                      <View style={styles.miniRingsContainer}>
                        {(hasWorkout || daySteps > 0 || dayExerciseMinutes > 0 || dayCalories > 0) && !isFuture ? (
                          <MiniActivityRings 
                            stepsProgress={stepsProgress}
                            exerciseProgress={exerciseProgress}
                            caloriesProgress={caloriesProgress}
                            size={32}
                          />
                        ) : (
                          <View style={[styles.emptyMiniRings, { borderColor: theme.border }]} />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  activityHeader: {
    marginBottom: 16,
  },
  ringsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  ringLegend: {
    marginTop: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  historyCard: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 13,
    marginBottom: 4,
  },
  historyExerciseCount: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: '100%',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  inputColumn: {
    flex: 1,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 2,
  },
  addExerciseButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  exercisesList: {
    marginTop: 20,
  },
  exercisesListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  exerciseListInfo: {
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historyDetailCard: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  historyDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDetailDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyExerciseItem: {
    paddingVertical: 6,
  },
  historyNotes: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepsContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsCount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  stepsLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  stepsProgressBar: {
    gap: 8,
  },
  stepsProgressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stepsProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepsGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepsGoalText: {
    fontSize: 12,
  },
  historyModalContent: {
    borderRadius: 20,
    padding: 20,
    width: '95%',
    maxWidth: 700,
    maxHeight: '85%',
    flex: 1,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  monthNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  calendarScrollView: {
    flex: 1,
  },
  calendarScrollContent: {
    paddingBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  calendarDay: {
    width: '13.5%',
    aspectRatio: 0.75,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  calendarDayNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarDayName: {
    fontSize: 9,
    textTransform: 'uppercase',
  },
  miniRingsContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  emptyMiniRings: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    opacity: 0.3,
  },
});
