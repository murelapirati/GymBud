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
import { Ionicons } from '@expo/vector-icons';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';
import { formatWeight, getWeightLabel } from '../../utils/measurements';

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
  sets?: WorkoutSet[]; // Optional for cardio/stretching
  restTimer?: number;
  previousWeight?: number;
  previousReps?: number;
  duration?: number; // For cardio/stretching (in seconds)
  distance?: number; // For cardio (in km)
  type?: string; // Exercise type
}

interface EditWorkoutModalProps {
  visible: boolean;
  exercises: WorkoutExercise[];
  workoutTitle: string;
  notes: string;
  addingSetToExerciseId: string | null;
  newSetReps: string;
  newSetWeight: string;
  onClose: () => void;
  onSave: () => void;
  onWorkoutTitleChange: (text: string) => void;
  onNotesChange: (text: string) => void;
  onExerciseNameChange: (exerciseId: string, name: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onAddSetClick: (exerciseId: string) => void;
  onAddSetCancel: () => void;
  onAddSet: (exerciseId: string) => void;
  onNewSetRepsChange: (text: string) => void;
  onNewSetWeightChange: (text: string) => void;
  theme: {
    card: string;
    text: string;
    surface: string;
    border: string;
    background: string;
    textSecondary: string;
    primary: string;
    error: string;
  };
}

export const EditWorkoutModal: React.FC<EditWorkoutModalProps> = ({
  visible,
  exercises,
  workoutTitle,
  notes,
  addingSetToExerciseId,
  newSetReps,
  newSetWeight,
  onClose,
  onSave,
  onWorkoutTitleChange,
  onNotesChange,
  onExerciseNameChange,
  onDeleteExercise,
  onDeleteSet,
  onAddSetClick,
  onAddSetCancel,
  onAddSet,
  onNewSetRepsChange,
  onNewSetWeightChange,
  theme,
}) => {
  const { measurementSystem } = useMeasurementSystem();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editWorkoutModal, { backgroundColor: theme.card }]}>
            <View style={styles.editWorkoutHeader}>
              <Text style={[styles.editNotesTitle, { color: theme.text }]}>Edit Workout</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.editWorkoutScroll} showsVerticalScrollIndicator={false}>
              {/* Workout Title */}
              <View style={[styles.editNotesSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.editNotesLabel, { color: theme.text }]}>Workout Title (Optional)</Text>
                <TextInput
                  style={[styles.editTitleInput, { 
                    backgroundColor: theme.background, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  value={workoutTitle}
                  onChangeText={onWorkoutTitleChange}
                  placeholder="e.g., Push Day, Leg Day..."
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              {/* Exercises */}
              {exercises && exercises.length > 0 && exercises.map((exercise) => (
                <View key={exercise.id} style={[styles.editExerciseCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.editExerciseHeader}>
                    <TextInput
                      style={[styles.editExerciseNameInput, { color: theme.text, borderColor: theme.border }]}
                      value={exercise.name}
                      onChangeText={(text) => onExerciseNameChange(exercise.id, text)}
                      placeholder="Exercise name"
                      placeholderTextColor={theme.textSecondary}
                    />
                    <TouchableOpacity onPress={() => onDeleteExercise(exercise.id)}>
                      <Ionicons name="trash-outline" size={20} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                  {exercise.sets && exercise.sets.length > 0 && exercise.sets.map((set, index) => {
                    const formattedWeight = set.weight ? formatWeight(set.weight, measurementSystem, 1) : '';
                    return (
                      <View key={set.id} style={styles.editSetRow}>
                        <Text style={[styles.editSetText, { color: theme.textSecondary }]}>
                          Set {index + 1}: {set.reps} reps {formattedWeight ? `@ ${formattedWeight}` : ''}
                        </Text>
                        <TouchableOpacity onPress={() => onDeleteSet(exercise.id, set.id)}>
                          <Ionicons name="close-circle-outline" size={18} color={theme.error} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}

                  {/* Duration info for cardio/stretching exercises */}
                  {!exercise.sets && (exercise.duration || exercise.distance) && (
                    <View style={styles.editSetRow}>
                      <Text style={[styles.editSetText, { color: theme.textSecondary }]}>
                        {exercise.duration && `Duration: ${Math.floor(exercise.duration / 60)}:${String(exercise.duration % 60).padStart(2, '0')}`}
                        {exercise.distance && ` • Distance: ${exercise.distance.toFixed(2)}km`}
                      </Text>
                    </View>
                  )}

                  {/* Add Set Section - only for exercises with sets (gym/calisthenics) */}
                  {exercise.sets && addingSetToExerciseId === exercise.id ? (
                    <View style={[styles.addSetSection, { borderColor: theme.border }]}>
                      <View style={styles.addSetInputs}>
                        <TextInput
                          style={[styles.addSetInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                          value={newSetReps}
                          onChangeText={onNewSetRepsChange}
                          placeholder="Reps"
                          placeholderTextColor={theme.textSecondary}
                          keyboardType="numeric"
                        />
                        <TextInput
                          style={[styles.addSetInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                          value={newSetWeight}
                          onChangeText={onNewSetWeightChange}
                          placeholder={getWeightLabel(measurementSystem, false).replace('Weight ', '')}
                          placeholderTextColor={theme.textSecondary}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <View style={styles.addSetButtons}>
                        <TouchableOpacity
                          style={[styles.addSetButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                          onPress={onAddSetCancel}
                        >
                          <Text style={[styles.addSetButtonText, { color: theme.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.addSetButton, { backgroundColor: theme.primary }]}
                          onPress={() => onAddSet(exercise.id)}
                        >
                          <Text style={[styles.addSetButtonText, { color: 'white' }]}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : exercise.sets ? (
                    <TouchableOpacity
                      style={styles.addSetTrigger}
                      onPress={() => onAddSetClick(exercise.id)}
                    >
                      <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
                      <Text style={[styles.addSetTriggerText, { color: theme.primary }]}>Add Set</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}

              {/* Notes */}
              <View style={[styles.editNotesSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.editNotesLabel, { color: theme.text }]}>Workout Notes</Text>
                <TextInput
                  style={[styles.editNotesInput, { 
                    backgroundColor: theme.background, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  value={notes}
                  onChangeText={onNotesChange}
                  placeholder="Add notes about your workout..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.editNotesButtons}>
              <TouchableOpacity
                style={[styles.editNotesModalButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                onPress={onClose}
              >
                <Text style={[styles.editNotesButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editNotesModalButton, { backgroundColor: theme.primary }]}
                onPress={onSave}
              >
                <Text style={[styles.editNotesButtonText, { color: 'white' }]}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editWorkoutModal: {
    margin: 20,
    marginTop: 60,
    marginBottom: 60,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%',
    maxWidth: 700,
  },
  editWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editWorkoutScroll: {
    maxHeight: 400,
    marginBottom: 16,
  },
  editExerciseCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  editExerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editExerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  editSetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 8,
  },
  editSetText: {
    fontSize: 14,
  },
  editTitleInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  editExerciseNameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  addSetSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  addSetInputs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  addSetInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  addSetButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addSetButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addSetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addSetTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  addSetTriggerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Shared styles
  editNotesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editNotesSection: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  editNotesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  editNotesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
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
    borderRadius: 8,
    alignItems: 'center',
  },
  editNotesButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
