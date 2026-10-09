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
import { LibraryFolder, WorkoutTemplate } from '../../types';
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
  const [folders, setFolders] = useState<LibraryFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedFolderId(null);
      loadTemplates();
    }
  }, [visible]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TEMPLATES);
      const storedFolders = await AsyncStorage.getItem(STORAGE_KEYS.LIBRARY_FOLDERS);
      setFolders(storedFolders ? JSON.parse(storedFolders) : []);
      if (stored) {
        const allTemplates: WorkoutTemplate[] = JSON.parse(stored);
        // Sort by last used (most recent first), then by created date
        allTemplates.sort((a, b) => {
          if (a.lastUsed && b.lastUsed) {
            return b.lastUsed - a.lastUsed;
          }
          if (a.lastUsed) return -1;
          if (b.lastUsed) return 1;
          return b.createdAt - a.createdAt;
        });
        setTemplates(workoutType ? allTemplates.filter(template => template.workoutType === workoutType) : allTemplates);
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

  const currentFolder = selectedFolderId
    ? folders.find(folder => folder.id === selectedFolderId)
    : undefined;
  const currentFolders = folders.filter(folder =>
    folder.type === 'templates' &&
    (selectedFolderId ? folder.parentId === selectedFolderId : !folder.parentId)
  );
  const visibleTemplates = templates.filter(template =>
    template.folderId === (selectedFolderId || undefined)
  );
  const folderPath = (folder: LibraryFolder): string => {
    const parent = folder.parentId ? folders.find(item => item.id === folder.parentId) : undefined;
    return parent ? `${parent.name} / ${folder.name}` : folder.name;
  };
  const goToParentFolder = () => {
    setSelectedFolderId(currentFolder?.parentId || null);
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
            <View style={styles.titleWithBreadcrumb}>
              {selectedFolderId && (
                <TouchableOpacity onPress={goToParentFolder} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={18} color={theme.primary} />
                </TouchableOpacity>
              )}
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {currentFolder ? folderPath(currentFolder) : 'Select Template'}
              </Text>
            </View>
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
          ) : visibleTemplates.length === 0 && currentFolders.length === 0 ? (
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
              {currentFolders.map(folder => (
                <TouchableOpacity
                  key={folder.id}
                  style={[
                    styles.folderCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                  onPress={() => setSelectedFolderId(folder.id)}
                >
                  <View style={styles.folderIcon}>
                    <Ionicons name="folder" size={28} color={theme.primary} />
                  </View>
                  <View style={styles.folderInfo}>
                    <Text style={[styles.folderName, { color: theme.text }]}>{folder.name}</Text>
                    <Text style={[styles.folderMeta, { color: theme.textSecondary }]}>
                      {folders.some(item => item.parentId === folder.id) ? 'Subfolders' : 'Open folder'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              ))}
              {visibleTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                  onPress={() => handleSelectTemplate(template)}
                >
                  <View style={styles.templateHeader}>
                    <View style={styles.templateTitleRow}>
                      <Text style={[styles.templateName, { color: theme.text }]}>
                        {template.name}
                      </Text>
                      {template.id.startsWith('default_') && (
                        <View style={[styles.defaultBadge, { backgroundColor: theme.border }]}>
                          <Text style={[styles.defaultBadgeText, { color: theme.textSecondary }]}>Default</Text>
                        </View>
                      )}
                    </View>
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
  titleWithBreadcrumb: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  templateCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  folderCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  folderIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderInfo: {
    flex: 1,
    gap: 4,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '700',
  },
  folderMeta: {
    fontSize: 13,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
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
