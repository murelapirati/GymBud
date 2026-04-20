import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export type WorkoutType = 'gym' | 'cardio' | 'calisthenics' | 'stretching';

interface WorkoutTypeOption {
  type: WorkoutType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface WorkoutTypeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: WorkoutType) => void;
}

const workoutTypes: WorkoutTypeOption[] = [
  {
    type: 'gym',
    title: 'Gym Workout',
    description: 'Track sets, reps, and weight',
    icon: 'barbell-outline',
    color: '#FF6B6B',
  },
  {
    type: 'cardio',
    title: 'Cardio',
    description: 'Time-based cardio exercises',
    icon: 'heart-outline',
    color: '#4ECDC4',
  },
  {
    type: 'calisthenics',
    title: 'Calisthenics',
    description: 'Bodyweight + optional extra weight',
    icon: 'body-outline',
    color: '#95E1D3',
  },
  {
    type: 'stretching',
    title: 'Stretching/Pilates',
    description: 'Time-based flexibility exercises',
    icon: 'fitness-outline',
    color: '#F38181',
  },
];

export const WorkoutTypeSelectionModal: React.FC<WorkoutTypeSelectionModalProps> = ({
  visible,
  onClose,
  onSelectType,
}) => {
  const { theme } = useTheme();

  const handleSelectType = (type: WorkoutType) => {
    onSelectType(type);
    onClose();
  };

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
              Select Workout Type
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {workoutTypes.map((workoutType) => (
              <TouchableOpacity
                key={workoutType.type}
                style={[
                  styles.workoutTypeCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() => handleSelectType(workoutType.type)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: workoutType.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={workoutType.icon}
                    size={32}
                    color={workoutType.color}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.typeTitle, { color: theme.text }]}>
                    {workoutType.title}
                  </Text>
                  <Text style={[styles.typeDescription, { color: theme.textSecondary }]}>
                    {workoutType.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContent: {
    gap: 12,
  },
  workoutTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  typeDescription: {
    fontSize: 13,
  },
});
