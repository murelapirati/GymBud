import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';
import { formatWeight, getWeightLabel, convertWeightToStorage } from '../../utils/measurements';

interface WorkoutSet {
  id: string;
  reps: number;
  weight?: number;
  completed: boolean;
  completedAt?: number;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  restTimer?: number;
  previousWeight?: number;
  previousReps?: number;
}

interface ActiveWorkoutModalProps {
  visible: boolean;
  currentExercises: WorkoutExercise[];
  activeExerciseId: string | null;
  workoutStartTime: number | null;
  exerciseName: string;
  reps: string;
  weight: string;
  restMinutes: number;
  restSeconds: number;
  editingSetId: string | null;
  activeRestTimer: number | null;
  onClose: () => void;
  onFinishExercise: () => void;
  onRemoveExercise: (exerciseId: string) => void;
  onEditSet: (exerciseId: string, setId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, reps: number, weight?: number) => void;
  onLogSet: () => void;
  onAddExercise: () => void;
  onSaveWorkout: () => void;
  onCancelRestTimer: () => void;
  onExerciseNameChange: (text: string) => void;
  onRepsChange: (text: string) => void;
  onWeightChange: (text: string) => void;
  onRestMinutesChange: (value: number) => void;
  onRestSecondsChange: (value: number) => void;
  onCancelEdit: () => void;
  theme: {
    card: string;
    text: string;
    surface: string;
    border: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    error: string;
  };
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  visible,
  currentExercises,
  activeExerciseId,
  workoutStartTime,
  exerciseName,
  reps,
  weight,
  restMinutes,
  restSeconds,
  editingSetId,
  activeRestTimer,
  onClose,
  onFinishExercise,
  onRemoveExercise,
  onEditSet,
  onDeleteSet,
  onUpdateSet,
  onLogSet,
  onAddExercise,
  onSaveWorkout,
  onCancelRestTimer,
  onExerciseNameChange,
  onRepsChange,
  onWeightChange,
  onRestMinutesChange,
  onRestSecondsChange,
  onCancelEdit,
  theme,
}) => {
  const { measurementSystem } = useMeasurementSystem();

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Active Workout</Text>
                  {workoutStartTime && (
                    <Text style={[styles.workoutTimer, { color: theme.textSecondary }]}>
                      {Math.floor((Date.now() - workoutStartTime) / 1000 / 60)} min
                    </Text>
                  )}
                </View>
                <View style={styles.headerButtons}>
                  <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                    <Ionicons name="close" size={28} color={theme.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView 
                style={styles.modalScroll} 
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
              >
                {/* Current Exercises */}
                {currentExercises.length > 0 && (
                  <View style={styles.activeExercisesSection}>
                    {currentExercises.map((exercise) => {
                      const isActive = exercise.id === activeExerciseId;
                      
                      return (
                        <View 
                          key={exercise.id} 
                          style={[
                            styles.activeExerciseCard, 
                            { backgroundColor: theme.surface, borderColor: theme.border },
                            isActive && { borderColor: theme.primary, borderWidth: 2 }
                          ]}
                        >
                          <View style={styles.exerciseCardHeader}>
                            <View style={styles.exerciseHeaderLeft}>
                              <Text style={[styles.activeExerciseName, { color: theme.text }]}>
                                {exercise.name}
                                {isActive && <Text style={{ color: theme.primary }}> •</Text>}
                              </Text>
                              {(exercise.previousWeight || exercise.previousReps) && (
                                <Text style={[styles.previousStats, { color: theme.textSecondary }]}>
                                  Last: {exercise.previousWeight ? formatWeight(exercise.previousWeight, measurementSystem, 1) : ''} {exercise.previousReps ? `× ${exercise.previousReps}` : ''}
                                </Text>
                              )}
                            </View>
                            <View style={styles.exerciseActions}>
                              {isActive && (
                                <TouchableOpacity 
                                  onPress={onFinishExercise}
                                  style={[styles.finishExerciseButton, { backgroundColor: theme.primary }]}
                                >
                                  <Text style={styles.finishExerciseText}>Finish</Text>
                                </TouchableOpacity>
                              )}
                              <TouchableOpacity onPress={() => onRemoveExercise(exercise.id)}>
                                <Ionicons name="trash-outline" size={20} color={theme.error} />
                              </TouchableOpacity>
                            </View>
                          </View>
                          
                          {/* Logged Sets */}
                          {exercise.sets.length > 0 && (
                            <View style={styles.loggedSetsContainer}>
                              {exercise.sets.map((set, setIndex) => (
                                <View key={set.id} style={[styles.loggedSetRow, { borderColor: theme.border }]}>
                                  <Text style={[styles.setNumberText, { color: theme.textSecondary }]}>
                                    Set {setIndex + 1}
                                  </Text>
                                  <Text style={[styles.setDetailText, { color: theme.text }]}>
                                    {set.reps} reps{set.weight ? ` × ${formatWeight(set.weight, measurementSystem, 1)}` : ''}
                                  </Text>
                                  <View style={styles.setActions}>
                                    <TouchableOpacity onPress={() => onEditSet(exercise.id, set.id)}>
                                      <Ionicons name="pencil-outline" size={18} color={theme.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onDeleteSet(exercise.id, set.id)}>
                                      <Ionicons name="trash-outline" size={18} color={theme.error} />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}
                          
                          {/* Log Set Form - only show for active exercise */}
                          {isActive && (
                            <View style={[styles.logSetForm, { backgroundColor: theme.card, borderColor: theme.border }]}>
                              <Text style={[styles.logSetTitle, { color: theme.text }]}>
                                {editingSetId ? 'Edit Set' : `Log Set ${exercise.sets.length + 1}`}
                              </Text>
                              <View style={styles.inputRow}>
                                <View style={styles.inputColumn}>
                                  <Text style={[styles.inputLabel, { color: theme.text }]}>Reps</Text>
                                  <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    placeholder="10"
                                    placeholderTextColor={theme.textTertiary}
                                    keyboardType="number-pad"
                                    value={reps}
                                    onChangeText={onRepsChange}
                                  />
                                </View>
                                <View style={styles.inputColumn}>
                                  <Text style={[styles.inputLabel, { color: theme.text }]}>{getWeightLabel(measurementSystem, false)}</Text>
                                  <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    placeholder={measurementSystem === 'metric' ? '60' : '135'}
                                    placeholderTextColor={theme.textTertiary}
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={onWeightChange}
                                  />
                                </View>
                                <View style={styles.inputColumn}>
                                  <Text style={[styles.inputLabel, { color: theme.text }]}>Rest Timer</Text>
                                  <View style={styles.restTimerContainer}>
                                    <View style={styles.pickerColumn}>
                                      <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>min</Text>
                                      <Picker
                                        selectedValue={restMinutes}
                                        onValueChange={onRestMinutesChange}
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
                                        selectedValue={restSeconds}
                                        onValueChange={onRestSecondsChange}
                                        style={styles.picker}
                                        itemStyle={[styles.pickerItem, { color: theme.text }]}
                                      >
                                        {Array.from({ length: 60 }, (_, i) => (
                                          <Picker.Item key={i} label={String(i)} value={i} color={theme.text} />
                                        ))}
                                      </Picker>
                                    </View>
                                  </View>
                                </View>
                              </View>
                              {editingSetId ? (
                                <View style={styles.editSetButtons}>
                                  <TouchableOpacity
                                    style={[styles.logSetButton, { flex: 1, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                                    onPress={onCancelEdit}
                                  >
                                    <Text style={[styles.logSetButtonText, { color: theme.text }]}>Cancel</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.logSetButton, { flex: 1, backgroundColor: theme.primary }]}
                                    onPress={() => {
                                      if (reps) {
                                        onUpdateSet(exercise.id, editingSetId, parseInt(reps), weight ? convertWeightToStorage(parseFloat(weight), measurementSystem) : undefined);
                                      }
                                    }}
                                  >
                                    <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                                    <Text style={styles.logSetButtonText}>Update</Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  style={[styles.logSetButton, { backgroundColor: theme.primary }]}
                                  onPress={onLogSet}
                                >
                                  <Ionicons name="add-circle-outline" size={20} color="white" />
                                  <Text style={styles.logSetButtonText}>Log Set</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Add Exercise Form */}
                {!activeExerciseId && (
                  <View style={[styles.addExerciseSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.addExerciseTitle, { color: theme.text }]}>
                      {currentExercises.length === 0 ? 'Start with an exercise' : 'Add next exercise'}
                    </Text>
                    
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Exercise Name</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                      placeholder="e.g., Bench Press"
                      placeholderTextColor={theme.textSecondary}
                      value={exerciseName}
                      onChangeText={onExerciseNameChange}
                      returnKeyType="done"
                      onSubmitEditing={onAddExercise}
                    />

                    <TouchableOpacity
                      style={[styles.addExerciseButton, { backgroundColor: theme.primary }]}
                      onPress={onAddExercise}
                    >
                      <Ionicons name="add" size={20} color="white" />
                      <Text style={[styles.addExerciseButtonText, { color: 'white' }]}>Add Exercise</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Finish Workout Button */}
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: theme.primary }]}
                  onPress={onSaveWorkout}
                  disabled={currentExercises.length === 0}
                >
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Finish Workout</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Full Screen Rest Timer Overlay */}
      {activeRestTimer !== null && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={onCancelRestTimer}
        >
          <View style={styles.timerOverlay}>
            <TouchableOpacity 
              style={styles.timerOverlayTouchable}
              activeOpacity={1}
              onPress={onCancelRestTimer}
            >
              <View style={[styles.timerContent, { backgroundColor: theme.primary }]}>
                <Ionicons name="timer-outline" size={80} color="white" />
                <Text style={styles.timerNumber}>{activeRestTimer}</Text>
                <Text style={styles.timerLabel}>seconds remaining</Text>
                
                <View style={styles.timerButtons}>
                  <TouchableOpacity 
                    onPress={onCancelRestTimer} 
                    style={[styles.timerButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                  >
                    <Ionicons name="play-skip-forward" size={24} color="white" />
                    <Text style={styles.timerButtonText}>Skip Rest</Text>
                  </TouchableOpacity>
                  
                  {activeExerciseId && (
                    <TouchableOpacity 
                      onPress={onFinishExercise} 
                      style={[styles.timerButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
                    >
                      <Ionicons name="checkmark-done" size={24} color="white" />
                      <Text style={styles.timerButtonText}>Finish Exercise</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <Text style={styles.timerHint}>Tap anywhere to skip</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  workoutTimer: {
    fontSize: 12,
    marginTop: 2,
  },
  modalScroll: {
    maxHeight: '100%',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  activeExercisesSection: {
    gap: 12,
    marginBottom: 16,
  },
  activeExerciseCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseHeaderLeft: {
    flex: 1,
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  finishExerciseButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  finishExerciseText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  activeExerciseName: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 4,
  },
  previousStats: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  loggedSetsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  loggedSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  setActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  setNumberText: {
    fontSize: 14,
    fontWeight: '500',
  },
  setDetailText: {
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
    marginLeft: 12,
  },
  logSetForm: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  logSetTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  inputColumn: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  restTimerContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  logSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  editSetButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  logSetButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  addExerciseSection: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  addExerciseTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
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
  timerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerOverlayTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 20,
    minWidth: 280,
  },
  timerNumber: {
    fontSize: 120,
    fontWeight: '300',
    color: 'white',
    marginVertical: 20,
  },
  timerLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  timerButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  timerHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
