import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { WorkoutType } from './WorkoutTypeSelectionModal';

interface WorkoutStartOptionsModalProps {
  visible: boolean;
  workoutType: WorkoutType | null;
  onClose: () => void;
  onStartBlank: () => void;
  onStartFromTemplate: () => void;
}

const workoutTypeLabels: Record<WorkoutType, string> = {
  gym: 'Gym Workout',
  cardio: 'Cardio',
  calisthenics: 'Calisthenics',
  stretching: 'Stretching/Pilates',
};

export const WorkoutStartOptionsModal: React.FC<WorkoutStartOptionsModalProps> = ({
  visible,
  workoutType,
  onClose,
  onStartBlank,
  onStartFromTemplate,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Start {workoutType ? workoutTypeLabels[workoutType] : 'Workout'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              onPress={onStartBlank}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#4ECDC4' + '20' }]}>
                <Ionicons name="add-circle-outline" size={32} color="#4ECDC4" />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  Start Blank Workout
                </Text>
                <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                  Begin with an empty workout and add exercises as you go
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              onPress={onStartFromTemplate}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FF6B6B' + '20' }]}>
                <Ionicons name="document-text-outline" size={32} color="#FF6B6B" />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  Start from Template
                </Text>
                <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                  Load a saved workout template with pre-filled exercises
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 13,
  },
});
