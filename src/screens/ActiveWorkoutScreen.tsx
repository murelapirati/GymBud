import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Keyboard,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { useMeasurementSystem } from '../hooks/useMeasurementSystem';
import { formatWeight, getWeightLabel, convertWeightToStorage, convertWeightForDisplay } from '../utils/measurements';
import { storage, STORAGE_KEYS } from '../utils/storage';
import type { WorkoutTemplate, TemplateExercise } from '../types';

interface ActiveWorkoutScreenProps {
  onBack: () => void;
  collapsedExercises: Set<string>;
  setCollapsedExercises: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({ onBack, collapsedExercises, setCollapsedExercises }) => {
  const { theme } = useTheme();
  const { measurementSystem } = useMeasurementSystem();
  const {
    exercises,
    workoutDuration,
    workoutType,
    activeRestTimer,
    activeStretchTimer,
    stretchTimerCompleted,
    activeStretchId,
    clearStretchTimerCompleted,
    finishWorkout,
    cancelWorkout,
    addExercise,
    logSet,
    updateSet,
    deleteSet,
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
    cancelRestTimer,
    finishExercise,
  } = useActiveWorkout();

  const [exerciseName, setExerciseName] = useState('');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [showRestPicker, setShowRestPicker] = useState(false);
  const [pendingExerciseId, setPendingExerciseId] = useState<string | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishNotes, setFinishNotes] = useState('');
  const [finishIntensity, setFinishIntensity] = useState(5);
  const [restPickerMinutes, setRestPickerMinutes] = useState(3);
  const [restPickerSeconds, setRestPickerSeconds] = useState(0);
  
  // Template saving state
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [justFinishedExercises, setJustFinishedExercises] = useState<any[]>([]);
  const [justFinishedWorkoutType, setJustFinishedWorkoutType] = useState<string | null>(null);
  
  // Cardio-specific state
  const [cardioDuration, setCardioDuration] = useState('');
  const [cardioDistance, setCardioDistance] = useState('');
  const [cardioHeartRate, setCardioHeartRate] = useState('');
  
  // Stretching-specific state
  const [stretchingDuration, setStretchingDuration] = useState('');

  // Debug: Log exercises when they change
  useEffect(() => {
    console.log('ActiveWorkoutScreen: exercises updated', exercises?.length || 0);
    if (!exercises) {
      console.error('EXERCISES IS NULL/UNDEFINED!');
    }
  }, [exercises]);

  // Guard: Ensure exercises is always an array
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddExercise = () => {
    if (!exerciseName.trim()) return;
    
    // Rest timer will be set per-set now, so we'll use 0 as default
    addExercise(exerciseName.trim(), 0);
    setActiveExerciseId(null);
    setExerciseName('');
    Keyboard.dismiss();
  };

  const handleAddCardio = () => {
    if (!exerciseName.trim()) return;
    
    addCardioActivity(exerciseName.trim());
    setExerciseName('');
    Keyboard.dismiss();
  };

  const handleAddStretching = () => {
    if (!exerciseName.trim() || !stretchingDuration) return;
    
    const durationSeconds = parseInt(stretchingDuration) * 60; // convert minutes to seconds
    addStretchingActivity(exerciseName.trim(), durationSeconds);
    setExerciseName('');
    setStretchingDuration('');
    Keyboard.dismiss();
  };

  const handleLogSet = () => {
    if (!activeExerciseId || !reps) return;

    const repsNum = parseInt(reps);
    const weightInput = weight ? parseFloat(weight) : undefined;
    // Convert weight to lbs for storage
    const weightNum = weightInput ? convertWeightToStorage(weightInput, measurementSystem) : undefined;

    if (editingSetId) {
      updateSet(activeExerciseId, editingSetId, repsNum, weightNum);
      setEditingSetId(null);
      setReps('');
      setWeight('');
    } else {
      // Show rest timer picker after logging set
      setPendingExerciseId(activeExerciseId);
      setShowRestPicker(true);
    }
  };

  const handleRestTimerDone = () => {
    const totalSeconds = restPickerMinutes * 60 + restPickerSeconds;
    setShowRestPicker(false);
    
    if (pendingExerciseId && reps) {
      const repsNum = parseInt(reps);
      const weightInput = weight ? parseFloat(weight) : undefined;
      // Convert weight to lbs for storage
      const weightNum = weightInput ? convertWeightToStorage(weightInput, measurementSystem) : undefined;
      
      // Log the set with the selected rest time
      logSet(pendingExerciseId, repsNum, weightNum, totalSeconds);
      
      // Clear inputs
      setReps('');
      setWeight('');
      
      // Start timer if rest time > 0
      if (totalSeconds > 0) {
        startRestTimer(totalSeconds);
      }
    }
    
    setPendingExerciseId(null);
    // Reset picker to defaults
    setRestPickerMinutes(3);
    setRestPickerSeconds(0);
  };

  const handleRestTimerSkip = () => {
    setShowRestPicker(false);
    
    if (pendingExerciseId && reps) {
      const repsNum = parseInt(reps);
      const weightInput = weight ? parseFloat(weight) : undefined;
      // Convert weight to lbs for storage
      const weightNum = weightInput ? convertWeightToStorage(weightInput, measurementSystem) : undefined;
      
      // Log the set with no rest time
      logSet(pendingExerciseId, repsNum, weightNum, 0);
      
      // Clear inputs
      setReps('');
      setWeight('');
    }
    
    setPendingExerciseId(null);
    // Reset picker to defaults
    setRestPickerMinutes(3);
    setRestPickerSeconds(0);
  };

  const handleEditSet = (exerciseId: string, setId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    const set = exercise?.sets?.find(s => s.id === setId);
    if (set) {
      setActiveExerciseId(exerciseId);
      setEditingSetId(setId);
      setReps(String(set.reps));
      // Handle both gym (weight) and calisthenics (extraWeight)
      const weightValue = 'weight' in set ? set.weight : 'extraWeight' in set ? set.extraWeight : undefined;
      // Convert from storage (lbs) to display units
      const displayWeight = weightValue ? convertWeightForDisplay(weightValue, measurementSystem) : undefined;
      setWeight(displayWeight ? String(displayWeight.toFixed(1)) : '');
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    Alert.alert(
      'Delete Exercise',
      `Are you sure you want to delete "${exercise?.name}" and all its sets?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExercise(exerciseId);
            if (activeExerciseId === exerciseId) {
              setActiveExerciseId(null);
              setReps('');
              setWeight('');
            }
          },
        },
      ]
    );
  };

  const toggleCollapseExercise = (exerciseId: string) => {
    setCollapsedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const formatRestTime = (seconds?: number): string => {
    if (!seconds || seconds === 0) return 'No rest';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishWorkout = () => {
    setShowFinishModal(true);
  };

  const generateTemplateName = (exercises: any[]): string => {
    if (exercises.length === 0) return 'Workout Template';
    if (exercises.length === 1) return exercises[0].name;
    if (exercises.length === 2) return `${exercises[0].name}, ${exercises[1].name}`;
    // For 3+ exercises, show first two and count
    return `${exercises[0].name}, ${exercises[1].name} +${exercises.length - 2}`;
  };

  const saveWorkoutAsTemplate = async () => {
    if (!templateName.trim() || !justFinishedWorkoutType) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    try {
      // Load existing templates
      const templates = await storage.getItem<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_TEMPLATES) || [];
      
      // Convert exercises to template format (without sets data)
      const templateExercises: TemplateExercise[] = justFinishedExercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        restTimer: ex.restTimer,
        duration: ex.duration,
        type: ex.type,
      }));

      // Create new template
      const newTemplate: WorkoutTemplate = {
        id: Date.now().toString(),
        name: templateName.trim(),
        workoutType: justFinishedWorkoutType as any,
        exercises: templateExercises,
        createdAt: Date.now(),
      };

      // Add and save
      templates.push(newTemplate);
      await storage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, templates);

      Alert.alert('Success', 'Workout saved as template!');
      setShowSaveTemplateModal(false);
      setTemplateName('');
      setJustFinishedExercises([]);
      setJustFinishedWorkoutType(null);
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template');
    }
  };

  const confirmFinishWorkout = async () => {
    const currentExercises = [...exercises];
    const currentType = workoutType;
    
    // Finish the workout first
    finishWorkout(finishNotes.trim() || undefined, finishIntensity);
    setShowFinishModal(false);
    setFinishNotes('');
    setFinishIntensity(5);
    
    // Check if user wants to be prompted to save templates
    const shouldPrompt = await storage.getItem<boolean>(STORAGE_KEYS.PROMPT_SAVE_TEMPLATE);
    
    // If there are exercises and prompt is enabled, ask to save as template
    if (currentExercises.length > 0 && shouldPrompt) {
      setJustFinishedExercises(currentExercises);
      setJustFinishedWorkoutType(currentType);
      setTemplateName(generateTemplateName(currentExercises));
      
      // Show save template modal with a slight delay so finish modal closes first
      setTimeout(() => {
        Alert.alert(
          'Save Workout?',
          'Would you like to save this workout to your library for future use?',
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => {
                setJustFinishedExercises([]);
                setJustFinishedWorkoutType(null);
                onBack();
              },
            },
            {
              text: 'Yes',
              onPress: () => setShowSaveTemplateModal(true),
            },
          ],
          { cancelable: false }
        );
      }, 300);
    } else {
      onBack();
    }
  };

  const handleCancelWorkout = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel this workout? All progress will be lost.',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Cancel Workout',
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            onBack();
          },
        },
      ]
    );
  };
  const getWorkoutTypeInfo = () => {
    switch (workoutType) {
      case 'gym':
        return { icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap, label: 'Gym', color: '#FF6B6B' };
      case 'cardio':
        return { icon: 'heart-outline' as keyof typeof Ionicons.glyphMap, label: 'Cardio', color: '#4ECDC4' };
      case 'calisthenics':
        return { icon: 'body-outline' as keyof typeof Ionicons.glyphMap, label: 'Calisthenics', color: '#95E1D3' };
      case 'stretching':
        return { icon: 'fitness-outline' as keyof typeof Ionicons.glyphMap, label: 'Stretching', color: '#F38181' };
      default:
        return { icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap, label: 'Gym', color: '#FF6B6B' };
    }
  };

  const workoutTypeInfo = getWorkoutTypeInfo();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Debug: Test button to see if touches work at all */}
      <TouchableOpacity 
        onPress={() => {
          console.log('DEBUG: Touch detected!');
          Alert.alert('Touch Works', 'Touches are registering');
        }}
        style={{
          position: 'absolute',
          top: 100,
          right: 10,
          backgroundColor: 'red',
          padding: 10,
          zIndex: 9999,
          elevation: 9999,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>TEST</Text>
      </TouchableOpacity>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Active Workout</Text>
            <View style={[styles.workoutTypeBadge, { backgroundColor: workoutTypeInfo.color + '20', borderColor: workoutTypeInfo.color + '40' }]}>
              <Ionicons name={workoutTypeInfo.icon} size={14} color={workoutTypeInfo.color} />
              <Text style={[styles.workoutTypeText, { color: workoutTypeInfo.color }]}>
                {workoutTypeInfo.label}
              </Text>
            </View>
          </View>
          <Text style={[styles.headerTimer, { color: theme.textSecondary }]}>
            {formatTime(workoutDuration)}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleFinishWorkout} style={styles.finishButton}>
            <Ionicons name="checkmark-circle" size={28} color={theme.success} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelWorkout} style={styles.cancelButton}>
            <Ionicons name="close-circle" size={28} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Add Activity/Exercise Form - varies by workout type */}
          {workoutType === 'gym' || workoutType === 'calisthenics' ? (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Add Exercise
              </Text>
              
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Exercise name"
                placeholderTextColor={theme.textSecondary}
                value={exerciseName}
                onChangeText={setExerciseName}
              />

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={handleAddExercise}
              >
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          ) : workoutType === 'cardio' ? (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Add Cardio Activity
              </Text>
              
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Activity name (e.g., Running, Cycling)"
                placeholderTextColor={theme.textSecondary}
                value={exerciseName}
                onChangeText={setExerciseName}
              />

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={handleAddCardio}
              >
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Activity</Text>
              </TouchableOpacity>
            </View>
          ) : workoutType === 'stretching' ? (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Add Stretching/Pilates Exercise
              </Text>
              
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Exercise name (e.g., Hamstring Stretch)"
                placeholderTextColor={theme.textSecondary}
                value={exerciseName}
                onChangeText={setExerciseName}
              />

              <View style={styles.inputColumn}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Duration (minutes)*</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  placeholder="5"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="numeric"
                  value={stretchingDuration}
                  onChangeText={setStretchingDuration}
                />
              </View>

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={handleAddStretching}
              >
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Exercises List */}
          {Array.isArray(exercises) && exercises.length > 0 ? (
            <>
              <Text style={[{ color: theme.text, padding: 10 }]}>
                Rendering {exercises.length} exercises...
              </Text>
              {exercises.map((exercise, exerciseIndex) => {
                if (!exercise || !exercise.id) {
                  console.warn('Invalid exercise at index', exerciseIndex);
                  return null;
                }
                
                const isActive = exercise.id === activeExerciseId;
                const isCollapsed = collapsedExercises.has(exercise.id);

            // Render cardio activity
            if (exercise.type === 'cardio') {
              const formatDuration = (seconds: number) => {
                const hrs = Math.floor(seconds / 3600);
                const mins = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                if (hrs > 0) {
                  return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }
                return `${mins}:${secs.toString().padStart(2, '0')}`;
              };

              return (
                <View key={exercise.id || `cardio-${exerciseIndex}`} style={[styles.card, { backgroundColor: theme.card }]}>
                  <View style={styles.exerciseHeader}>
                    <Text style={[styles.exerciseName, { color: theme.text }]}>
                      {exercise.name}
                    </Text>
                    <View style={styles.exerciseActions}>
                      <TouchableOpacity 
                        onPress={() => moveExercise(exercise.id, 'up')}
                        disabled={exerciseIndex === 0}
                        style={{ opacity: exerciseIndex === 0 ? 0.3 : 1 }}
                      >
                        <Ionicons 
                          name="arrow-up" 
                          size={20} 
                          color={theme.textSecondary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => moveExercise(exercise.id, 'down')}
                        disabled={exerciseIndex === exercises.length - 1}
                        style={{ opacity: exerciseIndex === exercises.length - 1 ? 0.3 : 1 }}
                      >
                        <Ionicons 
                          name="arrow-down" 
                          size={20} 
                          color={theme.textSecondary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
                        <Ionicons name="close-circle" size={24} color={theme.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Live Timer Display */}
                  <View style={styles.cardioTimerContainer}>
                    <Text style={[styles.cardioTimerText, { color: theme.text }]}>
                      {formatDuration(exercise.duration || 0)}
                    </Text>
                    {exercise.isActive && !exercise.isPaused && (
                      <View style={[styles.liveIndicator, { backgroundColor: '#FF3B30' }]}>
                        <Text style={styles.liveIndicatorText}>LIVE</Text>
                      </View>
                    )}
                  </View>

                  {/* Timer Controls */}
                  <View style={styles.cardioControls}>
                    {!exercise.isActive && (exercise.duration || 0) === 0 ? (
                      <TouchableOpacity
                        style={[styles.cardioButton, { backgroundColor: theme.primary, flex: 1 }]}
                        onPress={() => startCardioTimer(exercise.id)}
                      >
                        <Ionicons name="play" size={20} color="white" />
                        <Text style={styles.cardioButtonText}>Start</Text>
                      </TouchableOpacity>
                    ) : exercise.isActive && !exercise.isPaused ? (
                      <>
                        <TouchableOpacity
                          style={[styles.cardioButton, { backgroundColor: '#FF9500', flex: 1 }]}
                          onPress={() => pauseCardioTimer(exercise.id)}
                        >
                          <Ionicons name="pause" size={20} color="white" />
                          <Text style={styles.cardioButtonText}>Pause</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.cardioButton, { backgroundColor: theme.success, flex: 1 }]}
                          onPress={() => {
                            finishCardioActivity(exercise.id);
                            // Could add modal here for distance/HR input
                          }}
                        >
                          <Ionicons name="checkmark" size={20} color="white" />
                          <Text style={styles.cardioButtonText}>Finish</Text>
                        </TouchableOpacity>
                      </>
                    ) : exercise.isPaused ? (
                      <>
                        <TouchableOpacity
                          style={[styles.cardioButton, { backgroundColor: theme.primary, flex: 1 }]}
                          onPress={() => resumeCardioTimer(exercise.id)}
                        >
                          <Ionicons name="play" size={20} color="white" />
                          <Text style={styles.cardioButtonText}>Resume</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.cardioButton, { backgroundColor: theme.success, flex: 1 }]}
                          onPress={() => finishCardioActivity(exercise.id)}
                        >
                          <Ionicons name="checkmark" size={20} color="white" />
                          <Text style={styles.cardioButtonText}>Finish</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.cardioInfo}>
                        <View style={styles.cardioInfoItem}>
                          <Ionicons name="time-outline" size={18} color={theme.primary} />
                          <Text style={[styles.cardioInfoText, { color: theme.text }]}>
                            {formatDuration(exercise.duration || 0)}
                          </Text>
                        </View>
                        {exercise.distance && (
                          <View style={styles.cardioInfoItem}>
                            <Ionicons name="navigate-outline" size={18} color={theme.primary} />
                            <Text style={[styles.cardioInfoText, { color: theme.text }]}>
                              {exercise.distance} km
                            </Text>
                          </View>
                        )}
                        {exercise.heartRate && (
                          <View style={styles.cardioInfoItem}>
                            <Ionicons name="heart-outline" size={18} color={theme.primary} />
                            <Text style={[styles.cardioInfoText, { color: theme.text }]}>
                              {exercise.heartRate} BPM
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              );
            }

            // Render stretching activity
            if (exercise.type === 'stretching') {
              const formatCountdown = (seconds: number) => {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins}:${secs.toString().padStart(2, '0')}`;
              };

              const isTimerActive = activeStretchId === exercise.id;

              return (
                <View key={exercise.id || `stretch-${exerciseIndex}`} style={[styles.card, { backgroundColor: theme.card }]}>
                  <View style={styles.exerciseHeader}>
                    <Text style={[styles.exerciseName, { color: theme.text }]}>
                      {exercise.name}
                      {exercise.completed && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.success} style={{ marginLeft: 8 }} />
                      )}
                    </Text>
                    <View style={styles.exerciseActions}>
                      <TouchableOpacity 
                        onPress={() => moveExercise(exercise.id, 'up')}
                        disabled={exerciseIndex === 0}
                        style={{ opacity: exerciseIndex === 0 ? 0.3 : 1 }}
                      >
                        <Ionicons 
                          name="arrow-up" 
                          size={20} 
                          color={theme.textSecondary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => moveExercise(exercise.id, 'down')}
                        disabled={exerciseIndex === exercises.length - 1}
                        style={{ opacity: exerciseIndex === exercises.length - 1 ? 0.3 : 1 }}
                      >
                        <Ionicons 
                          name="arrow-down" 
                          size={20} 
                          color={theme.textSecondary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
                        <Ionicons name="close-circle" size={24} color={theme.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Timer Display */}
                  <View style={styles.stretchTimerContainer}>
                    <Text style={[styles.stretchTimerText, { color: theme.text }]}>
                      {isTimerActive && activeStretchTimer !== null
                        ? formatCountdown(activeStretchTimer)
                        : formatCountdown(exercise.duration || 0)}
                    </Text>
                    <Text style={[styles.stretchTimerLabel, { color: theme.textSecondary }]}>
                      Target: {Math.floor((exercise.duration || 0) / 60)} min
                    </Text>
                  </View>

                  {/* Timer Controls */}
                  <View style={styles.stretchControls}>
                    {!exercise.completed && !isTimerActive && (
                      <TouchableOpacity
                        style={[styles.stretchButton, { backgroundColor: theme.primary, flex: 1 }]}
                        onPress={() => startStretchTimer(exercise.id, exercise.duration || 60)}
                      >
                        <Ionicons name="play" size={20} color="white" />
                        <Text style={styles.stretchButtonText}>Start Stretch</Text>
                      </TouchableOpacity>
                    )}
                    {isTimerActive && (
                      <TouchableOpacity
                        style={[styles.stretchButton, { backgroundColor: theme.success, flex: 1 }]}
                        onPress={() => completeStretch(exercise.id)}
                      >
                        <Ionicons name="checkmark" size={20} color="white" />
                        <Text style={styles.stretchButtonText}>Complete</Text>
                      </TouchableOpacity>
                    )}
                    {exercise.completed && !isTimerActive && (
                      <View style={[styles.completedBadge, { backgroundColor: theme.success + '20' }]}>
                        <Ionicons name="checkmark-circle" size={18} color={theme.success} />
                        <Text style={[styles.completedText, { color: theme.success }]}>Completed</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            }

            // Render gym/calisthenics exercise (with sets)
            return (
              <View key={exercise.id || `exercise-${exerciseIndex}`} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.exerciseHeader}>
                  <Text style={[styles.exerciseName, { color: theme.text }]}>
                    {exercise.name}
                    {exercise.sets && exercise.sets.length > 0 && (
                      <Text style={[styles.setCount, { color: theme.textSecondary }]}>
                        {' '}({exercise.sets.length})
                      </Text>
                    )}
                  </Text>
                  <View style={styles.exerciseActions}>
                    <TouchableOpacity 
                      onPress={() => moveExercise(exercise.id, 'up')}
                      disabled={exerciseIndex === 0}
                      style={{ opacity: exerciseIndex === 0 ? 0.3 : 1 }}
                    >
                      <Ionicons 
                        name="arrow-up" 
                        size={20} 
                        color={theme.textSecondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => moveExercise(exercise.id, 'down')}
                      disabled={exerciseIndex === exercises.length - 1}
                      style={{ opacity: exerciseIndex === exercises.length - 1 ? 0.3 : 1 }}
                    >
                      <Ionicons 
                        name="arrow-down" 
                        size={20} 
                        color={theme.textSecondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleCollapseExercise(exercise.id)}>
                      <Ionicons 
                        name={isCollapsed ? "chevron-down" : "chevron-up"} 
                        size={24} 
                        color={theme.textSecondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
                      <Ionicons name="close-circle" size={24} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                {!isCollapsed && (
                  <>
                    {/* Sets */}
                    {exercise.sets && exercise.sets.map((set, index) => {
                      const displayWeight = exercise.type === 'gym' 
                        ? (set as any).weight 
                        : (set as any).extraWeight;
                      const weightLabel = exercise.type === 'calisthenics' ? 'extra' : '';
                      const formattedWeight = displayWeight ? formatWeight(displayWeight, measurementSystem, 1) : '';

                      return (
                        <View key={set.id} style={[styles.setRow, { borderColor: theme.border }]}>
                          <View style={styles.setLeftSection}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                            <Text style={[styles.setText, { color: theme.textSecondary }]}>Set {index + 1}</Text>
                          </View>
                          <View style={styles.setMiddleSection}>
                            <Text style={[styles.setText, { color: theme.text }]}>
                              {set.reps} reps{formattedWeight ? ` × ${formattedWeight} ${weightLabel}` : ''}
                            </Text>
                            <Text style={[styles.restTimeText, { color: theme.textSecondary }]}>
                              {formatRestTime(set.restTime)}
                            </Text>
                          </View>
                          <View style={styles.setActions}>
                            <TouchableOpacity onPress={() => handleEditSet(exercise.id, set.id)}>
                              <Ionicons name="pencil" size={18} color={theme.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteSet(exercise.id, set.id)}>
                              <Ionicons name="trash" size={18} color={theme.error} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}

                {/* Log Set Form - Always Visible */}
                <View style={styles.logSetForm}>
                  <View style={styles.inputRow}>
                    <View style={styles.inputColumn}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>Reps</Text>
                      <TextInput
                        style={[styles.smallInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder="10"
                        placeholderTextColor={theme.textTertiary}
                        keyboardType="number-pad"
                        value={isActive ? reps : ''}
                        onChangeText={(text) => {
                          setActiveExerciseId(exercise.id);
                          setReps(text);
                        }}
                        onFocus={() => setActiveExerciseId(exercise.id)}
                      />
                    </View>
                    <View style={styles.inputColumn}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {getWeightLabel(measurementSystem, exercise.type === 'calisthenics')}
                      </Text>
                      <TextInput
                        style={[styles.smallInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder={exercise.type === 'calisthenics' ? '0' : (measurementSystem === 'metric' ? '60' : '135')}
                        placeholderTextColor={theme.textTertiary}
                        keyboardType="numeric"
                        value={isActive ? weight : ''}
                        onChangeText={(text) => {
                          setActiveExerciseId(exercise.id);
                          setWeight(text);
                        }}
                        onFocus={() => setActiveExerciseId(exercise.id)}
                      />
                    </View>
                  </View>

                  <View style={styles.logSetButtons}>
                    {editingSetId && (
                      <TouchableOpacity
                        style={[styles.logButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1, flex: 1 }]}
                        onPress={() => {
                          setEditingSetId(null);
                          setReps('');
                          setWeight('');
                          setActiveExerciseId(null);
                        }}
                      >
                        <Text style={[styles.logButtonText, { color: theme.text }]}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.logButton, { backgroundColor: theme.primary, flex: 1 }]}
                      onPress={handleLogSet}
                    >
                      <Ionicons name={editingSetId ? "checkmark" : "add-circle-outline"} size={20} color="white" />
                      <Text style={styles.logButtonText}>{editingSetId ? "Update Set" : "Log Set"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                  </>
                )}
              </View>
            );
          })}
            </>
          ) : (
            <View style={[styles.card, { backgroundColor: theme.card, padding: 20 }]}>
              <Text style={[{ color: theme.textSecondary, textAlign: 'center' }]}>
                No exercises yet. Add one to get started!
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Rest Timer Preset Picker */}
      {showRestPicker && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.restPickerOverlay}>
            <TouchableOpacity 
              style={styles.restPickerBackdrop} 
              onPress={() => {
                setShowRestPicker(false);
                setPendingExerciseId(null);
                setRestPickerMinutes(3);
                setRestPickerSeconds(0);
              }}
              activeOpacity={1}
            />
            <View style={[styles.restPickerContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.restPickerTitle, { color: theme.text }]}>Rest Time</Text>
              <Text style={[styles.restPickerSubtitle, { color: theme.textSecondary }]}>
                Timer will start automatically after clicking Done
              </Text>
              
              <View style={styles.restTimerPickerContainer}>
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>min</Text>
                  <Picker
                    selectedValue={restPickerMinutes}
                    onValueChange={setRestPickerMinutes}
                    style={styles.picker}
                    itemStyle={[styles.pickerItem, { color: theme.text }]}
                  >
                    {Array.from({ length: 16 }, (_, i) => (
                      <Picker.Item key={i} label={String(i)} value={i} color={theme.text} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>sec</Text>
                  <Picker
                    selectedValue={restPickerSeconds}
                    onValueChange={setRestPickerSeconds}
                    style={styles.picker}
                    itemStyle={[styles.pickerItem, { color: theme.text }]}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <Picker.Item key={i} label={String(i)} value={i} color={theme.text} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.restPickerButtons}>
                <TouchableOpacity
                  style={[styles.restPickerButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                  onPress={handleRestTimerSkip}
                >
                  <Text style={[styles.restPickerButtonText, { color: theme.text }]}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.restPickerButton, { backgroundColor: theme.primary }]}
                  onPress={handleRestTimerDone}
                >
                  <Text style={[styles.restPickerButtonText, { color: 'white' }]}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Finish Workout Modal */}
      <Modal
        visible={showFinishModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFinishModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.finishModal, { backgroundColor: theme.card }]}>
              <Text style={[styles.finishModalTitle, { color: theme.text }]}>Finish Workout</Text>
              
              {/* Intensity Rating */}
              <View style={styles.intensitySection}>
                <View style={styles.intensityHeader}>
                  <Text style={[styles.intensityLabel, { color: theme.text }]}>Workout Intensity</Text>
                  <Text style={[styles.intensityValue, { color: theme.primary }]}>{finishIntensity}/10</Text>
                </View>
                <Text style={[styles.intensityDescription, { color: theme.textSecondary }]}>
                  {finishIntensity === 0 ? 'Very Easy - Light activity or warmup' :
                   finishIntensity <= 3 ? 'Easy - Could do much more' :
                   finishIntensity <= 5 ? 'Moderate - Comfortable effort' :
                   finishIntensity <= 7 ? 'Hard - Challenging but sustainable' :
                   finishIntensity <= 9 ? 'Very Hard - Near maximum effort' :
                   'Maximum Effort - Took sets to failure'}
                </Text>
                <Slider
                  style={styles.intensitySlider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={finishIntensity}
                  onValueChange={setFinishIntensity}
                  minimumTrackTintColor={theme.primary}
                  maximumTrackTintColor={theme.border}
                  thumbTintColor={theme.primary}
                />
                <View style={styles.intensityScale}>
                  <Text style={[styles.intensityScaleText, { color: theme.textSecondary }]}>0 - Very Easy</Text>
                  <Text style={[styles.intensityScaleText, { color: theme.textSecondary }]}>10 - Failure</Text>
                </View>
              </View>

              {/* Notes */}
              <View style={styles.notesSection}>
                <Text style={[styles.notesLabel, { color: theme.text }]}>Workout Notes (Optional)</Text>
                <TextInput
                  style={[styles.notesInput, { 
                    backgroundColor: theme.surface, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  value={finishNotes}
                  onChangeText={setFinishNotes}
                  placeholder="How did it go? Any observations..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Buttons */}
              <View style={styles.finishModalButtons}>
                <TouchableOpacity
                  style={[styles.finishModalButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                  onPress={() => {
                    setShowFinishModal(false);
                    setFinishNotes('');
                    setFinishIntensity(5);
                  }}
                >
                  <Text style={[styles.finishModalButtonText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.finishModalButton, { backgroundColor: theme.primary }]}
                  onPress={confirmFinishWorkout}
                >
                  <Text style={[styles.finishModalButtonText, { color: 'white' }]}>Finish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Save as Template Modal */}
      <Modal
        visible={showSaveTemplateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowSaveTemplateModal(false);
          onBack();
        }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.finishModal, { backgroundColor: theme.card }]}>
              <Text style={[styles.finishModalTitle, { color: theme.text }]}>Save Workout</Text>
              
              <Text style={[styles.templateDescription, { color: theme.textSecondary }]}>
                Save this workout to your library to quickly start similar workouts in the future.
              </Text>

              <View style={styles.notesSection}>
                <Text style={[styles.notesLabel, { color: theme.text }]}>Workout Name</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.surface, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  value={templateName}
                  onChangeText={setTemplateName}
                  placeholder="Enter template name"
                  placeholderTextColor={theme.textTertiary}
                  autoFocus
                />
              </View>

              <View style={styles.finishModalButtons}>
                <TouchableOpacity
                  style={[styles.finishModalButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                  onPress={() => {
                    setShowSaveTemplateModal(false);
                    setTemplateName('');
                    setJustFinishedExercises([]);
                    setJustFinishedWorkoutType(null);
                    onBack();
                  }}
                >
                  <Text style={[styles.finishModalButtonText, { color: theme.text }]}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.finishModalButton, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    saveWorkoutAsTemplate();
                    onBack();
                  }}
                >
                  <Ionicons name="save-outline" size={20} color="white" />
                  <Text style={[styles.finishModalButtonText, { color: 'white', marginLeft: 8 }]}>Save Template</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  workoutTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  workoutTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerTimer: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  finishButton: {
    padding: 4,
  },
  cancelButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  setCount: {
    fontSize: 14,
    fontWeight: '400',
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  setLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setMiddleSection: {
    flex: 1,
    marginLeft: 12,
  },
  restTimeText: {
    fontSize: 12,
    marginTop: 2,
  },
  setText: {
    fontSize: 14,
  },
  setActions: {
    flexDirection: 'row',
    gap: 12,
  },
  logSetForm: {
    marginTop: 12,
    paddingTop: 12,
  },
  startSetButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  startSetText: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputColumn: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  smallInput: {
    padding: 10,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
  },
  logSetButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 8,
  },
  logButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  restPickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  restPickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  restPickerContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  restPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  restPickerSubtitle: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
  },
  restTimerPickerContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  picker: {
    width: '100%',
    height: 180,
  },
  pickerItem: {
    fontSize: 24,
    height: 180,
  },
  restPickerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  restPickerButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  restPickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  finishModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  finishModalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  intensitySection: {
    marginBottom: 24,
  },
  intensityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  intensityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  intensityValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  intensityDescription: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  intensitySlider: {
    width: '100%',
    height: 40,
  },
  intensityScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  intensityScaleText: {
    fontSize: 12,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
  },
  finishModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  finishModalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardioInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  cardioInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  cardioInfoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardioTimerContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  cardioTimerText: {
    fontSize: 48,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  liveIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  liveIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardioControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cardioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cardioButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  stretchTimerContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  stretchTimerText: {
    fontSize: 40,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  stretchTimerLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  stretchControls: {
    marginTop: 12,
  },
  stretchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  stretchButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ActiveWorkoutScreen;
