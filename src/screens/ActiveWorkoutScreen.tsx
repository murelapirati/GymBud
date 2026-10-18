import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  PressableProps,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { useMeasurementSystem } from '../hooks/useMeasurementSystem';
import {
  formatWeight,
  getWeightUnit,
  convertWeightToStorage,
  convertWeightForDisplay,
} from '../utils/measurements';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { PREDEFINED_EXERCISES } from '../data/exercises';
import {
  getSetNumbering,
  getLastWorkoutTopSet,
  formatTopSetDisplay,
} from '../utils/workoutCard';
import type { WorkoutTemplate, TemplateExercise } from '../types';
import ExerciseSelectionModal from '../components/ExerciseSelectionModal';
import RestTimerStatusBar from '../components/RestTimerStatusBar';
import DraggableExerciseList, {
  DragErrorBoundary,
  GripHandle,
} from '../components/workout/DraggableExerciseList';

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
}

const PressableScale: React.FC<PressableScaleProps> = ({ children, style, ...props }) => {
  return (
    <Pressable
      {...props}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        state.pressed && { transform: [{ scale: 0.92 }] },
      ]}
    >
      {children}
    </Pressable>
  );
};

interface ActiveWorkoutScreenProps {
  onBack: () => void;
  collapsedExercises: Set<string>;
  setCollapsedExercises: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const REST_PRESETS = [
  { label: '1:00', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2:00', seconds: 120 },
  { label: '3:00', seconds: 180 },
  { label: '5:00', seconds: 300 },
  { label: '7:00', seconds: 420 },
];

const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { measurementSystem } = useMeasurementSystem();
  const {
    exercises,
    workoutDuration,
    workoutType,
    activeStretchTimer,
    activeStretchId,
    finishWorkout,
    cancelWorkout,
    addExercise,
    logSet,
    updateSet,
    deleteSet,
    toggleSetWarmup,
    deleteExercise,
    reorderExercises,
    startStretchTimer,
    completeStretch,
    startRestTimer,
  } = useActiveWorkout();

  // History for "Last: ..." top set lookup
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, any[]> | null>(null);

  useEffect(() => {
    storage.getItem<Record<string, any[]>>(STORAGE_KEYS.WORKOUT_HISTORY).then((h) => {
      if (h) setWorkoutHistory(h);
    });
  }, []);

  const [showExerciseSelection, setShowExerciseSelection] = useState(false);

  // Per-exercise draft entry inputs: { [exerciseId]: { weight: string, reps: string } }
  const [draftInputs, setDraftInputs] = useState<Record<string, { weight: string; reps: string }>>({});
  // Per-exercise warm-up pill toggle: { [exerciseId]: boolean }
  const [warmupToggles, setWarmupToggles] = useState<Record<string, boolean>>({});

  // Inline set editing: only one set across all exercises can be edited at once
  const [editingSet, setEditingSet] = useState<{
    exerciseId: string;
    setId: string;
    weight: string;
    reps: string;
  } | null>(null);

  // "..." exercise action menu
  const [menuExercise, setMenuExercise] = useState<any | null>(null);

  // Rest for bottom sheet
  const [showRestSheet, setShowRestSheet] = useState(false);
  const [restSheetCustomMode, setRestSheetCustomMode] = useState(false);
  const [customRestMinutes, setCustomRestMinutes] = useState(2);
  const [customRestSeconds, setCustomRestSeconds] = useState(0);
  const [pendingRestTarget, setPendingRestTarget] = useState<{ exerciseId: string; setId: string } | null>(null);

  // Finish workout modal
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishNotes, setFinishNotes] = useState('');
  const [finishIntensity, setFinishIntensity] = useState(5);

  // Template saving modal
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [justFinishedExercises, setJustFinishedExercises] = useState<any[]>([]);
  const [justFinishedWorkoutType, setJustFinishedWorkoutType] = useState<string | null>(null);

  // Fallback for manual reorder if drag fails
  const [manualReorderMode, setManualReorderMode] = useState(false);

  const safeExercises = Array.isArray(exercises) ? exercises : [];

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseMetadata = useCallback((name: string) => {
    const clean = name.trim().toLowerCase();
    const found = PREDEFINED_EXERCISES.find((e) => e.name.toLowerCase() === clean);
    return found || null;
  }, []);

  const getEquipmentBadgeColor = useCallback(
    (equipment?: string) => {
      const eq = equipment?.toLowerCase() || 'other';
      const map: Record<string, { bg: string; text: string; border: string }> = {
        dumbbell: { bg: '#3B82F622', text: '#60a5fa', border: '#3B82F644' },
        barbell: { bg: '#f5955422', text: '#f59554', border: '#f5955444' },
        bodyweight: { bg: '#34d39922', text: '#34d399', border: '#34d39944' },
        cable: { bg: theme.primary + '22', text: theme.primary, border: theme.primary + '44' },
        machine: { bg: theme.surface, text: theme.textSecondary, border: theme.border },
        kettlebell: { bg: '#8B5CF622', text: '#a78bfa', border: '#8B5CF644' },
        band: { bg: '#EC489922', text: '#f472b6', border: '#EC489944' },
        other: { bg: theme.surface, text: theme.textSecondary, border: theme.border },
      };
      return map[eq] || map.other;
    },
    [theme]
  );

  // Pre-fill calculation for an exercise's entry row
  const getEntryValues = useCallback(
    (exercise: any) => {
      const draft = draftInputs[exercise.id];
      if (draft !== undefined) {
        return draft;
      }
      // 1. Last logged set in this exercise this session
      if (exercise.sets && exercise.sets.length > 0) {
        const last = exercise.sets[exercise.sets.length - 1];
        const rawW = last.weight ?? last.extraWeight;
        const dispW = convertWeightForDisplay(rawW, measurementSystem);
        const wStr = dispW !== undefined ? (Number.isInteger(dispW) ? String(dispW) : dispW.toFixed(1)) : '';
        return { weight: wStr, reps: String(last.reps ?? '') };
      }
      // 2. Last session's top set from history
      const topSet = getLastWorkoutTopSet(exercise.name, workoutHistory);
      if (topSet) {
        const dispW = convertWeightForDisplay(topSet.weight, measurementSystem);
        const wStr = dispW !== undefined ? (Number.isInteger(dispW) ? String(dispW) : dispW.toFixed(1)) : '';
        return { weight: wStr, reps: String(topSet.reps ?? '') };
      }
      // 3. Empty default
      return { weight: '', reps: '' };
    },
    [draftInputs, measurementSystem, workoutHistory]
  );

  const handleLogSet = useCallback(
    (exerciseId: string) => {
      const exercise = safeExercises.find((e) => e.id === exerciseId);
      if (!exercise) return;

      const currentVals = getEntryValues(exercise);
      const repsNum = parseInt(currentVals.reps, 10);
      if (isNaN(repsNum) || repsNum <= 0) {
        Alert.alert('Invalid reps', 'Please enter a valid number of reps.');
        return;
      }

      const weightInput = currentVals.weight ? parseFloat(currentVals.weight) : undefined;
      const weightInLbs =
        weightInput !== undefined && !isNaN(weightInput)
          ? convertWeightToStorage(weightInput, measurementSystem)
          : undefined;

      const isWarmup = Boolean(warmupToggles[exerciseId]);

      // 1. Commit set immediately
      const setId = logSet(exerciseId, repsNum, weightInLbs, 0, isWarmup);

      // 2. Pre-fill next set with current values and reset warmup toggle
      setDraftInputs((prev) => ({
        ...prev,
        [exerciseId]: { weight: currentVals.weight, reps: currentVals.reps },
      }));
      setWarmupToggles((prev) => ({
        ...prev,
        [exerciseId]: false,
      }));

      // 3. Open "Rest for" bottom sheet
      setPendingRestTarget({ exerciseId, setId });
      setRestSheetCustomMode(false);
      setShowRestSheet(true);
    },
    [safeExercises, getEntryValues, measurementSystem, warmupToggles, logSet]
  );

  const handleStartRestTimer = (seconds: number) => {
    setShowRestSheet(false);
    if (pendingRestTarget && seconds > 0) {
      startRestTimer(seconds, pendingRestTarget.exerciseId, pendingRestTarget.setId);
    }
    setPendingRestTarget(null);
  };

  const handleSkipRest = () => {
    setShowRestSheet(false);
    setPendingRestTarget(null);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exercise = safeExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const hasSets = Boolean(exercise.sets && exercise.sets.length > 0);
    if (hasSets) {
      Alert.alert(
        'Delete Exercise',
        `Are you sure you want to delete "${exercise.name}" and its ${exercise.sets?.length || 0} logged set(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteExercise(exerciseId);
              setMenuExercise(null);
            },
          },
        ]
      );
    } else {
      deleteExercise(exerciseId);
      setMenuExercise(null);
    }
  };

  const handleDiscardWorkout = useCallback(() => {
    const totalSets = safeExercises.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0);
    if (totalSets === 0) {
      cancelWorkout();
      onBack();
      return;
    }
    Alert.alert(
      'Discard workout?',
      `${totalSets} set${totalSets > 1 ? 's' : ''} will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            onBack();
          },
        },
      ]
    );
  }, [safeExercises, cancelWorkout, onBack]);

  const generateTemplateName = (exList: any[]): string => {
    if (exList.length === 0) return 'Workout Template';
    if (exList.length === 1) return exList[0].name;
    if (exList.length === 2) return `${exList[0].name}, ${exList[1].name}`;
    return `${exList[0].name}, ${exList[1].name} +${exList.length - 2}`;
  };

  const saveWorkoutAsTemplate = async () => {
    if (!templateName.trim() || !justFinishedWorkoutType) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    try {
      const templates = (await storage.getItem<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_TEMPLATES)) || [];
      const templateExercises: TemplateExercise[] = justFinishedExercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        restTimer: ex.restTimer,
        duration: ex.duration,
        type: ex.type,
      }));

      const newTemplate: WorkoutTemplate = {
        id: Date.now().toString(),
        name: templateName.trim(),
        workoutType: justFinishedWorkoutType as any,
        exercises: templateExercises,
        createdAt: Date.now(),
      };

      templates.push(newTemplate);
      await storage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, templates);

      setShowSaveTemplateModal(false);
      setTemplateName('');
      setJustFinishedExercises([]);
      setJustFinishedWorkoutType(null);
      onBack();
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template');
    }
  };

  const confirmFinishWorkout = async () => {
    const currentExercises = [...safeExercises];
    const currentType = workoutType;

    finishWorkout(finishNotes.trim() || undefined, finishIntensity);
    setShowFinishModal(false);
    setFinishNotes('');
    setFinishIntensity(5);

    const shouldPrompt = await storage.getItem<boolean>(STORAGE_KEYS.PROMPT_SAVE_TEMPLATE);
    if (currentExercises.length > 0 && shouldPrompt) {
      setJustFinishedExercises(currentExercises);
      setJustFinishedWorkoutType(currentType);
      setTemplateName(generateTemplateName(currentExercises));

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

  const renderStrengthCard = (exercise: any) => {
    const meta = getExerciseMetadata(exercise.name);
    const mechLabel = meta?.mechanic
      ? meta.mechanic.charAt(0).toUpperCase() + meta.mechanic.slice(1)
      : '';
    const equipment = meta?.equipment || (exercise.type === 'strength' ? 'other' : undefined);
    const badgeColors = getEquipmentBadgeColor(equipment);
    const topSet = getLastWorkoutTopSet(exercise.name, workoutHistory);
    const lastDisplay = formatTopSetDisplay(topSet, measurementSystem);
    const isWarmupActive = Boolean(warmupToggles[exercise.id]);
    const entryVals = getEntryValues(exercise);
    const unitLabel = getWeightUnit(measurementSystem);
    const setNumbers = getSetNumbering(exercise.sets || []);

    return (
      <View key={exercise.id} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {/* Header row: Grip, Name, Equipment Badge, ... Menu */}
        <View style={styles.cardHeader}>
          <GripHandle theme={theme} />
          <Text style={[styles.cardExerciseName, { color: theme.text }]} numberOfLines={1}>
            {exercise.name}
          </Text>
          {equipment ? (
            <View
              style={[
                styles.eqBadge,
                { backgroundColor: badgeColors.bg, borderColor: badgeColors.border },
              ]}
            >
              <Text style={[styles.eqBadgeText, { color: badgeColors.text }]}>
                {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setMenuExercise(exercise)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Sub-line: Mechanic - Last: ... [Warm-up pill] */}
        <View style={styles.subLine}>
          <View style={styles.subLineLeft}>
            {mechLabel ? <Text style={[styles.subLineText, { color: theme.textSecondary }]}>{mechLabel}</Text> : null}
            {mechLabel && lastDisplay ? (
              <Text style={[styles.subLineText, { color: theme.textSecondary }]}> - </Text>
            ) : null}
            {lastDisplay ? (
              <Text style={[styles.subLineText, { color: theme.textSecondary }]}>
                Last: {lastDisplay}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[
              styles.warmupPill,
              isWarmupActive
                ? { backgroundColor: '#F59E0B22', borderColor: '#F59E0B' }
                : { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() =>
              setWarmupToggles((prev) => ({
                ...prev,
                [exercise.id]: !prev[exercise.id],
              }))
            }
          >
            <Text
              style={[
                styles.warmupPillText,
                { color: isWarmupActive ? '#F59E0B' : theme.textSecondary },
              ]}
            >
              Warm-up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logged Sets: plain lines with inline expansion */}
        {exercise.sets && exercise.sets.length > 0 && (
          <View style={styles.loggedSetsContainer}>
            {exercise.sets.map((set: any, idx: number) => {
              const numInfo = setNumbers[idx];
              const activeEdit =
                editingSet && editingSet.exerciseId === exercise.id && editingSet.setId === set.id
                  ? editingSet
                  : null;

              const displayWeight = convertWeightForDisplay(set.weight ?? set.extraWeight, measurementSystem);
              const formattedWeight =
                displayWeight !== undefined
                  ? Number.isInteger(displayWeight)
                    ? String(displayWeight)
                    : displayWeight.toFixed(1)
                  : '';

              if (activeEdit) {
                return (
                  <View
                    key={set.id}
                    style={[styles.inlineEditRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  >
                    <PressableScale
                      style={styles.setLabelTapArea}
                      onPress={() => toggleSetWarmup(exercise.id, set.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <View
                        style={[
                          styles.setLabelBadge,
                          {
                            backgroundColor: numInfo.isWarmup ? '#F59E0B20' : theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.setLabelText,
                            { color: numInfo.isWarmup ? '#F59E0B' : theme.text },
                          ]}
                        >
                          {numInfo.label}
                        </Text>
                      </View>
                    </PressableScale>
                    <View style={styles.inlineInputs}>
                      <TextInput
                        style={[styles.inlineInput, { color: theme.text, borderColor: theme.border }]}
                        value={activeEdit.weight}
                        onChangeText={(txt) => setEditingSet((prev) => prev && { ...prev, weight: txt })}
                        placeholder={unitLabel.toUpperCase()}
                        placeholderTextColor={theme.textTertiary}
                        keyboardType="numeric"
                      />
                      <TextInput
                        style={[styles.inlineInput, { color: theme.text, borderColor: theme.border }]}
                        value={activeEdit.reps}
                        onChangeText={(txt) => setEditingSet((prev) => prev && { ...prev, reps: txt })}
                        placeholder="REPS"
                        placeholderTextColor={theme.textTertiary}
                        keyboardType="number-pad"
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.inlineSaveBtn, { backgroundColor: theme.primary }]}
                      onPress={() => {
                        const r = parseInt(activeEdit.reps, 10);
                        const w = activeEdit.weight ? parseFloat(activeEdit.weight) : undefined;
                        const wInLbs =
                          w !== undefined && !isNaN(w) ? convertWeightToStorage(w, measurementSystem) : undefined;
                        if (!isNaN(r) && r > 0) {
                          updateSet(exercise.id, set.id, r, wInLbs);
                        }
                        setEditingSet(null);
                      }}
                    >
                      <Text style={styles.inlineSaveBtnText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.inlineDeleteBtn}
                      onPress={() => {
                        deleteSet(exercise.id, set.id);
                        setEditingSet(null);
                      }}
                    >
                      <Ionicons name="trash-outline" size={18} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <View key={set.id} style={styles.loggedSetLineContainer}>
                  <PressableScale
                    style={styles.setLabelTapArea}
                    onPress={() => toggleSetWarmup(exercise.id, set.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <View
                      style={[
                        styles.setLabelBadge,
                        {
                          backgroundColor: numInfo.isWarmup ? '#F59E0B20' : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.setLabelText,
                          { color: numInfo.isWarmup ? '#F59E0B' : theme.text },
                        ]}
                      >
                        {numInfo.label}
                      </Text>
                    </View>
                  </PressableScale>
                  <TouchableOpacity
                    style={styles.loggedSetContent}
                    onPress={() => {
                      setEditingSet({
                        exerciseId: exercise.id,
                        setId: set.id,
                        weight: formattedWeight,
                        reps: String(set.reps || ''),
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.loggedSetText, { color: theme.text }]}>
                      {formattedWeight ? `${formattedWeight} ${unitLabel}` : `0 ${unitLabel}`} x {set.reps}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Entry Row: [ KG 50 ] [ REPS 8 ] [ Log ] */}
        <View style={styles.entryRow}>
          <View style={[styles.entryInputBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.entryInputPrefix, { color: theme.textSecondary }]}>
              {unitLabel.toUpperCase()}
            </Text>
            <TextInput
              style={[styles.entryInputText, { color: theme.text }]}
              placeholder="0"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
              value={entryVals.weight}
              onChangeText={(txt) => {
                setDraftInputs((prev) => ({
                  ...prev,
                  [exercise.id]: { ...entryVals, weight: txt },
                }));
              }}
            />
          </View>

          <View style={[styles.entryInputBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.entryInputPrefix, { color: theme.textSecondary }]}>REPS</Text>
            <TextInput
              style={[styles.entryInputText, { color: theme.text }]}
              placeholder="0"
              placeholderTextColor={theme.textTertiary}
              keyboardType="number-pad"
              value={entryVals.reps}
              onChangeText={(txt) => {
                setDraftInputs((prev) => ({
                  ...prev,
                  [exercise.id]: { ...entryVals, reps: txt },
                }));
              }}
            />
          </View>

          <TouchableOpacity
            style={[styles.logButton, { backgroundColor: theme.primary }]}
            onPress={() => handleLogSet(exercise.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.logButtonText}>Log</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStretchingCard = (exercise: any) => {
    const formatCountdown = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isTimerActive = activeStretchId === exercise.id;

    return (
      <View key={exercise.id} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <GripHandle theme={theme} />
          <Text style={[styles.cardExerciseName, { color: theme.text }]} numberOfLines={1}>
            {exercise.name}
          </Text>
          <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
            <Ionicons name="close-circle" size={24} color={theme.error} />
          </TouchableOpacity>
        </View>

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

        <View style={styles.stretchControls}>
          {!exercise.completed && !isTimerActive && (
            <TouchableOpacity
              style={[styles.stretchButton, { backgroundColor: theme.primary }]}
              onPress={() => startStretchTimer(exercise.id, exercise.duration || 60)}
            >
              <Ionicons name="play" size={18} color="white" />
              <Text style={styles.stretchButtonText}>Start Stretch</Text>
            </TouchableOpacity>
          )}
          {isTimerActive && (
            <TouchableOpacity
              style={[styles.stretchButton, { backgroundColor: theme.success }]}
              onPress={() => completeStretch(exercise.id)}
            >
              <Ionicons name="checkmark" size={18} color="white" />
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
  };

  const renderExerciseItem = (exercise: any) => {
    if (exercise.type === 'stretching') {
      return renderStretchingCard(exercise);
    }
    return renderStrengthCard(exercise);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {workoutType ? `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout` : 'Active Workout'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {formatDuration(workoutDuration)} - {workoutType ? workoutType.charAt(0).toUpperCase() + workoutType.slice(1) : 'Strength'}
          </Text>
        </View>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={[styles.discardHeaderButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={handleDiscardWorkout}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={[styles.discardHeaderButtonText, { color: theme.error }]}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.finishHeaderButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowFinishModal(true)}
          >
            <Text style={styles.finishHeaderButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rest bar (only while resting or rest over, under header) */}
      <RestTimerStatusBar />

      {/* Main List */}
      <View style={styles.listContainer}>
        <DragErrorBoundary
          onError={() => setManualReorderMode(true)}
          fallback={
            <View style={[styles.fallbackContainer, { backgroundColor: theme.card }]}>
              <Text style={[styles.fallbackText, { color: theme.textSecondary }]}>
                Drag reordering is unavailable.
              </Text>
            </View>
          }
        >
          <DraggableExerciseList
            exercises={safeExercises}
            onReorder={reorderExercises}
            renderItem={(exercise) => renderExerciseItem(exercise)}
            theme={theme}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
          />
        </DragErrorBoundary>
      </View>

      {/* Pinned Bottom "+ Add exercise" Button */}
      <View style={[styles.pinnedBottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.addExerciseButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => setShowExerciseSelection(true)}
        >
          <Ionicons name="add" size={20} color={theme.primary} />
          <Text style={[styles.addExerciseButtonText, { color: theme.text }]}>Add exercise</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise Selection Modal */}
      <ExerciseSelectionModal
        visible={showExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}
        onSelect={(exercise) => {
          addExercise(exercise.name, 90);
          setShowExerciseSelection(false);
        }}
      />

      {/* Exercise "..." Action Bottom Sheet */}
      <Modal visible={Boolean(menuExercise)} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setMenuExercise(null)}>
          <View style={styles.sheetBackdrop}>
            <TouchableWithoutFeedback>
              <View style={[styles.actionSheetContainer, { backgroundColor: theme.card }]}>
                <View style={styles.sheetHandle} />
                <Text style={[styles.actionSheetTitle, { color: theme.text }]} numberOfLines={1}>
                  {menuExercise?.name}
                </Text>
                <TouchableOpacity
                  style={styles.sheetActionItem}
                  onPress={() => {
                    if (menuExercise) {
                      handleDeleteExercise(menuExercise.id);
                    }
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.error} />
                  <Text style={[styles.sheetActionItemText, { color: theme.error }]}>Delete exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetCancelItem, { backgroundColor: theme.surface }]}
                  onPress={() => setMenuExercise(null)}
                >
                  <Text style={[styles.sheetCancelItemText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* "Rest for" Bottom Sheet */}
      <Modal visible={showRestSheet} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={handleSkipRest}>
          <View style={styles.sheetBackdrop}>
            <TouchableWithoutFeedback>
              <View style={[styles.actionSheetContainer, { backgroundColor: theme.card }]}>
                <View style={styles.sheetHandle} />

                {!restSheetCustomMode ? (
                  <>
                    <Text style={[styles.actionSheetTitle, { color: theme.text }]}>Rest for</Text>
                    <Text style={[styles.actionSheetSubtitle, { color: theme.textSecondary }]}>
                      Choose rest duration
                    </Text>

                    {/* 6 Presets */}
                    <View style={styles.presetsGrid}>
                      {REST_PRESETS.map((preset) => (
                        <TouchableOpacity
                          key={preset.seconds}
                          style={[styles.presetButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                          onPress={() => handleStartRestTimer(preset.seconds)}
                        >
                          <Text style={[styles.presetButtonText, { color: theme.text }]}>{preset.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Bottom Actions: Custom time & Skip rest */}
                    <View style={styles.restSheetFooter}>
                      <TouchableOpacity
                        style={[styles.restSheetFooterBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => setRestSheetCustomMode(true)}
                      >
                        <Text style={[styles.restSheetFooterBtnText, { color: theme.text }]}>Custom time</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.restSheetFooterBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={handleSkipRest}
                      >
                        <Text style={[styles.restSheetFooterBtnText, { color: theme.textSecondary }]}>Skip rest</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.customHeader}>
                      <TouchableOpacity onPress={() => setRestSheetCustomMode(false)}>
                        <Ionicons name="arrow-back" size={20} color={theme.text} />
                      </TouchableOpacity>
                      <Text style={[styles.actionSheetTitle, { color: theme.text, flex: 1, textAlign: 'center' }]}>
                        Custom Rest
                      </Text>
                      <View style={{ width: 20 }} />
                    </View>

                    {/* Minutes and Seconds Steppers */}
                    <View style={styles.steppersContainer}>
                      <View style={[styles.stepperBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.stepperLabel, { color: theme.textSecondary }]}>Minutes</Text>
                        <View style={styles.stepperControls}>
                          <TouchableOpacity
                            style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                            onPress={() => setCustomRestMinutes((m) => Math.max(0, m - 1))}
                          >
                            <Ionicons name="remove" size={18} color={theme.text} />
                          </TouchableOpacity>
                          <Text style={[styles.stepperValue, { color: theme.text }]}>{customRestMinutes}</Text>
                          <TouchableOpacity
                            style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                            onPress={() => setCustomRestMinutes((m) => Math.min(30, m + 1))}
                          >
                            <Ionicons name="add" size={18} color={theme.text} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={[styles.stepperBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.stepperLabel, { color: theme.textSecondary }]}>Seconds</Text>
                        <View style={styles.stepperControls}>
                          <TouchableOpacity
                            style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                            onPress={() => {
                              const options = [0, 15, 30, 45];
                              const idx = options.indexOf(customRestSeconds);
                              const next = idx <= 0 ? options[options.length - 1] : options[idx - 1];
                              setCustomRestSeconds(next);
                            }}
                          >
                            <Ionicons name="remove" size={18} color={theme.text} />
                          </TouchableOpacity>
                          <Text style={[styles.stepperValue, { color: theme.text }]}>
                            {customRestSeconds.toString().padStart(2, '0')}
                          </Text>
                          <TouchableOpacity
                            style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                            onPress={() => {
                              const options = [0, 15, 30, 45];
                              const idx = options.indexOf(customRestSeconds);
                              const next = idx >= options.length - 1 ? options[0] : options[idx + 1];
                              setCustomRestSeconds(next);
                            }}
                          >
                            <Ionicons name="add" size={18} color={theme.text} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.startCustomBtn, { backgroundColor: theme.primary }]}
                      onPress={() => {
                        const total = customRestMinutes * 60 + customRestSeconds;
                        handleStartRestTimer(total);
                      }}
                    >
                      <Text style={styles.startCustomBtnText}>
                        Start {customRestMinutes}:{customRestSeconds.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Finish Workout Modal */}
      <Modal visible={showFinishModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Finish Workout</Text>

            <View style={styles.intensityContainer}>
              <Text style={[styles.intensityLabel, { color: theme.text }]}>Intensity: {finishIntensity}/10</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={finishIntensity}
                onValueChange={setFinishIntensity}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.primary}
              />
            </View>

            <TextInput
              style={[
                styles.notesInput,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Add workout notes..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={3}
              value={finishNotes}
              onChangeText={setFinishNotes}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => setShowFinishModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={confirmFinishWorkout}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Save Template Modal */}
      <Modal visible={showSaveTemplateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Save as Template</Text>
            <TextInput
              style={[
                styles.templateInput,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Template name..."
              placeholderTextColor={theme.textTertiary}
              value={templateName}
              onChangeText={setTemplateName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => {
                  setShowSaveTemplateModal(false);
                  onBack();
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={saveWorkoutAsTemplate}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discardHeaderButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardHeaderButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  finishHeaderButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  finishHeaderButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardExerciseName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  eqBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  eqBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  subLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
  },
  subLineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  subLineText: {
    fontSize: 13,
  },
  warmupPill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warmupPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loggedSetsContainer: {
    marginBottom: 8,
  },
  loggedSetLine: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loggedSetLineContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  setLabelTapArea: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -11,
    marginRight: 0,
  },
  loggedSetContent: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
  },
  setLabelBadge: {
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setLabelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  loggedSetText: {
    fontSize: 15,
    fontWeight: '700',
  },
  inlineEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
    marginVertical: 4,
  },
  inlineInputs: {
    flexDirection: 'row',
    flex: 1,
    gap: 6,
  },
  inlineInput: {
    flex: 1,
    height: 32,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inlineSaveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  inlineSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  inlineDeleteBtn: {
    padding: 4,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  entryInputBox: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  entryInputPrefix: {
    fontSize: 11,
    fontWeight: '700',
    marginRight: 6,
  },
  entryInputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    padding: 0,
  },
  logButton: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pinnedBottomBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
  },
  addExerciseButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addExerciseButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 18,
    paddingBottom: 32,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7280',
    alignSelf: 'center',
    marginBottom: 12,
  },
  actionSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionSheetSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  sheetActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#374151',
  },
  sheetActionItemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sheetCancelItem: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sheetCancelItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 12,
  },
  presetButton: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  restSheetFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  restSheetFooterBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  restSheetFooterBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  steppersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  stepperBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  startCustomBtn: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startCustomBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  intensityContainer: {
    marginBottom: 16,
  },
  intensityLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  templateInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 14,
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
    marginTop: 8,
  },
  stretchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  stretchButtonText: {
    color: '#FFFFFF',
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
  fallbackContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 14,
  },
});

export default ActiveWorkoutScreen;
