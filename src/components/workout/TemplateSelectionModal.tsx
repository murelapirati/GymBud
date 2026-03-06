import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { WorkoutTemplate } from '../../types';
import { WorkoutType } from './WorkoutTypeSelectionModal';
import { STORAGE_KEYS } from '../../utils/storage';

interface TemplateSelectionModalProps {
  visible: boolean;
  workoutType: WorkoutType | null;
  onClose: () => void;
  onSelectTemplate: (template: WorkoutTemplate) => void;
}

export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  visible,
  workoutType,
  onClose,
  onSelectTemplate,
}) => {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && workoutType) {
      loadTemplates();
    }
  }, [visible, workoutType]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TEMPLATES);
      if (stored) {
        const allTemplates: WorkoutTemplate[] = JSON.parse(stored);
        // Filter by workout type
        const filtered = allTemplates.filter(t => t.workoutType === workoutType);
        // Sort by last used (most recent first), then by created date
        filtered.sort((a, b) => {
          if (a.lastUsed && b.lastUsed) {
            return b.lastUsed - a.lastUsed;
          }
          if (a.lastUsed) return -1;
          if (b.lastUsed) return 1;
          return b.createdAt - a.createdAt;
        });
        setTemplates(filtered);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('Error', 'Failed to load workout templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
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
              Select Template
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerContent}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Loading templates...
              </Text>
            </View>
          ) : templates.length === 0 ? (
            <View style={styles.centerContent}>
              <Ionicons name="document-outline" size={48} color={theme.textSecondary} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No templates found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                Create templates in the Workout Builder tab
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                  onPress={() => handleSelectTemplate(template)}
                >
                  <View style={styles.templateHeader}>
                    <Text style={[styles.templateName, { color: theme.text }]}>
                      {template.name}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                  </View>
                  <View style={styles.templateMeta}>
                    <View style={styles.metaRow}>
                      <Ionicons name="list-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    {template.lastUsed && (
                      <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                          Used {formatDate(template.lastUsed)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {template.exercises.length > 0 && (
                    <View style={styles.exercisePreview}>
                      {template.exercises.slice(0, 3).map((exercise, index) => (
                        <Text
                          key={exercise.id}
                          style={[styles.exercisePreviewText, { color: theme.textSecondary }]}
                        >
                          {index + 1}. {exercise.name}
                        </Text>
                      ))}
                      {template.exercises.length > 3 && (
                        <Text style={[styles.exercisePreviewText, { color: theme.textSecondary }]}>
                          +{template.exercises.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
    maxHeight: '80%',
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
  scrollContent: {
    gap: 12,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  templateCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  templateMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  exercisePreview: {
    gap: 4,
  },
  exercisePreviewText: {
    fontSize: 12,
  },
});
