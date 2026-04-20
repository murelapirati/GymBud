import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import type { WorkoutTemplate, WorkoutType, TemplateExercise, Recipe } from '../types';
import RecipeEditScreen from './RecipeEditScreen';

type TabType = 'templates' | 'recipes';

interface LibraryScreenProps {
  onOpenSettings: () => void;
}

export default function LibraryScreen({ onOpenSettings }: LibraryScreenProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showRecipeEdit, setShowRecipeEdit] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined);

  // Workout builder state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutType, setNewWorkoutType] = useState<WorkoutType>('gym');
  const [newExercises, setNewExercises] = useState<TemplateExercise[]>([]);
  const [showTypeSelector, setShowTypeSelector] = useState(true);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<WorkoutType>>(new Set());

  const toggleSection = async (workoutType: WorkoutType) => {
    try {
      setCollapsedSections(prev => {
        const newSet = new Set(prev);
        if (newSet.has(workoutType)) {
          newSet.delete(workoutType);
        } else {
          newSet.add(workoutType);
        }

        // Save state asynchronously without awaiting
        storage.setItem(STORAGE_KEYS.LIBRARY_COLLAPSED_SECTIONS, Array.from(newSet))
          .catch(err => console.error('Error saving collapsed state:', err));

        return newSet;
      });
    } catch (e) {
      console.error('Error toggling section:', e);
    }
  };

  const loadCollapsedSections = async () => {
    try {
      const saved = await storage.getItem<WorkoutType[]>(STORAGE_KEYS.LIBRARY_COLLAPSED_SECTIONS);
      if (saved) {
        setCollapsedSections(new Set(saved));
      } else {
        // Default to all collapsed
        const allTypes: WorkoutType[] = ['gym', 'cardio', 'calisthenics', 'stretching'];
        setCollapsedSections(new Set(allTypes));
        await storage.setItem(STORAGE_KEYS.LIBRARY_COLLAPSED_SECTIONS, allTypes);
      }
    } catch (error) {
      console.error('Error loading collapsed sections:', error);
    }
  };

  useEffect(() => {
    loadCollapsedSections();
    loadTemplates();
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const saved = await storage.getItem<Recipe[]>(STORAGE_KEYS.RECIPES) || [];
      setRecipes(saved);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      const updated = editingRecipe
        ? recipes.map(r => r.id === recipe.id ? recipe : r)
        : [...recipes, recipe];
      await storage.setItem(STORAGE_KEYS.RECIPES, updated);
      setRecipes(updated);
      setShowRecipeEdit(false);
      setEditingRecipe(undefined);
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Failed to save recipe.');
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const updated = recipes.filter(r => r.id !== recipeId);
            await storage.setItem(STORAGE_KEYS.RECIPES, updated);
            setRecipes(updated);
          } catch (error) {
            console.error('Error deleting recipe:', error);
          }
        },
      },
    ]);
  };

  const loadTemplates = async () => {
    try {
      const savedTemplates = await storage.getItem<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_TEMPLATES) || [];
      setTemplates(savedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTemplates = templates.filter(t => t.id !== templateId);
              await storage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, updatedTemplates);
              setTemplates(updatedTemplates);
            } catch (error) {
              console.error('Error deleting template:', error);
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const getWorkoutTypeIcon = (type: WorkoutType): any => {
    switch (type) {
      case 'gym': return 'barbell';
      case 'cardio': return 'heart';
      case 'calisthenics': return 'body';
      case 'stretching': return 'hand-left';
      default: return 'fitness';
    }
  };

  const getWorkoutTypeLabel = (type: WorkoutType): string => {
    switch (type) {
      case 'gym': return 'Gym';
      case 'cardio': return 'Cardio';
      case 'calisthenics': return 'Calisthenics';
      case 'stretching': return 'Stretching';
      default: return 'Workout';
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.workoutType]) {
      acc[template.workoutType] = [];
    }
    acc[template.workoutType].push(template);
    return acc;
  }, {} as Record<WorkoutType, WorkoutTemplate[]>);

  // Workout builder functions
  const startCreateWorkout = () => {
    setEditingTemplate(null);
    setNewWorkoutName('');
    setNewWorkoutType('gym');
    setNewExercises([]);
    setCurrentExerciseName('');
    setShowTypeSelector(true);
    setShowNamePrompt(false);
    setShowCreateModal(true);
  };

  const startEditWorkout = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setNewWorkoutName(template.name);
    setNewWorkoutType(template.workoutType);
    setNewExercises(template.exercises);
    setCurrentExerciseName('');
    setShowTypeSelector(false);
    setShowNamePrompt(false);
    setShowCreateModal(true);
  };

  const selectWorkoutType = (type: WorkoutType) => {
    setNewWorkoutType(type);
    setShowTypeSelector(false);
  };

  const addExercise = () => {
    if (!currentExerciseName.trim()) {
      Alert.alert('Missing Name', 'Please enter an exercise name');
      return;
    }

    const newExercise: TemplateExercise = {
      id: Date.now().toString(),
      name: currentExerciseName.trim(),
      restTimer: newWorkoutType === 'gym' || newWorkoutType === 'calisthenics' ? 90 : undefined,
      duration: newWorkoutType === 'cardio' || newWorkoutType === 'stretching' ? 60 : undefined,
      type: newWorkoutType,
    };
    setNewExercises([...newExercises, newExercise]);
    setCurrentExerciseName('');
  };

  const removeExercise = (id: string) => {
    setNewExercises(newExercises.filter(ex => ex.id !== id));
  };

  const moveExercise = (id: string, direction: 'up' | 'down') => {
    const currentIndex = newExercises.findIndex(ex => ex.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    // Check bounds
    if (newIndex < 0 || newIndex >= newExercises.length) return;

    // Swap exercises
    const updated = [...newExercises];
    [updated[currentIndex], updated[newIndex]] = [updated[newIndex], updated[currentIndex]];

    setNewExercises(updated);
  };

  const promptForWorkoutName = () => {
    if (newExercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise');
      return;
    }

    // If editing and name already exists, save directly
    if (editingTemplate && newWorkoutName.trim()) {
      saveWorkout();
    } else {
      // Hide the create modal and show name prompt
      setShowCreateModal(false);
      setTimeout(() => {
        setShowNamePrompt(true);
      }, 300);
    }
  };

  const saveWorkout = async () => {
    if (!newWorkoutName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your workout');
      return;
    }

    if (newExercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise');
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template
        const updatedTemplates = templates.map(t =>
          t.id === editingTemplate.id
            ? { ...t, name: newWorkoutName.trim(), exercises: newExercises }
            : t
        );
        await storage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, updatedTemplates);
        setTemplates(updatedTemplates);
        Alert.alert('Success', 'Workout updated successfully!');
      } else {
        // Create new template
        const newTemplate: WorkoutTemplate = {
          id: Date.now().toString(),
          name: newWorkoutName.trim(),
          workoutType: newWorkoutType,
          exercises: newExercises,
          createdAt: Date.now(),
        };
        const updatedTemplates = [...templates, newTemplate];
        await storage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, updatedTemplates);
        setTemplates(updatedTemplates);
        Alert.alert('Success', 'Workout saved successfully!');
      }

      setShowCreateModal(false);
      setShowNamePrompt(false);
      setNewWorkoutName('');
      setNewExercises([]);
      setCurrentExerciseName('');
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    }
  };

  const cancelCreate = () => {
    setShowCreateModal(false);
    setShowNamePrompt(false);
    setNewWorkoutName('');
    setNewExercises([]);
    setCurrentExerciseName('');
    setShowTypeSelector(true);
    setEditingTemplate(null);
  };

  const backToBuilder = () => {
    setShowNamePrompt(false);
    setTimeout(() => {
      setShowCreateModal(true);
    }, 300);
  };

  if (showRecipeEdit) {
    return (
      <RecipeEditScreen
        recipe={editingRecipe}
        onBack={() => { setShowRecipeEdit(false); setEditingRecipe(undefined); }}
        onSave={handleSaveRecipe}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Library</Text>
        <TouchableOpacity onPress={onOpenSettings} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'recipes' && styles.activeTabButton]}
          onPress={() => setActiveTab('recipes')}
        >
          <Ionicons
            name="restaurant-outline"
            size={20}
            color={activeTab === 'recipes' ? theme.primary : theme.textSecondary}
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'recipes' ? theme.primary : theme.textSecondary }
          ]}>
            Recipes
          </Text>
          {activeTab === 'recipes' && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.primary }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'templates' && styles.activeTabButton]}
          onPress={() => setActiveTab('templates')}
        >
          <Ionicons
            name="barbell-outline"
            size={20}
            color={activeTab === 'templates' ? theme.primary : theme.textSecondary}
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'templates' ? theme.primary : theme.textSecondary }
          ]}>
            Workout Builder
          </Text>
          {activeTab === 'templates' && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'recipes' ? (
          recipes.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
              <Ionicons name="restaurant-outline" size={64} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Recipes Yet</Text>
              <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
                Create a recipe by tapping the + button below.
              </Text>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: theme.primary }]}
                onPress={() => { setEditingRecipe(undefined); setShowRecipeEdit(true); }}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
                <Text style={styles.createButtonText}>New Recipe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ paddingBottom: 80 }}>
              {recipes.map(recipe => (
                <TouchableOpacity
                  key={recipe.id}
                  style={[styles.recipeCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => { setEditingRecipe(recipe); setShowRecipeEdit(true); }}
                >
                  {recipe.imageUri ? (
                    <Image
                      source={{ uri: recipe.imageUri }}
                      style={styles.recipeCardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.recipeCardImagePlaceholder, { backgroundColor: theme.surface }]}>
                      <Ionicons name="restaurant-outline" size={28} color={theme.textSecondary} />
                    </View>
                  )}
                  <View style={styles.recipeCardInfo}>
                    <Text style={[styles.recipeCardName, { color: theme.text }]} numberOfLines={1}>{recipe.name}</Text>
                    <Text style={[styles.recipeCardMeta, { color: theme.textSecondary }]}>
                      {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''} · {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
                    </Text>
                    <Text style={[styles.recipeCardMacros, { color: theme.primary }]}>
                      {recipe.totalCalories} kcal total · {Math.round(recipe.totalCalories / recipe.servings)} kcal/serving
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteRecipe(recipe.id)}
                    style={styles.recipeDeleteBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )
        ) : (
          <>
            {templates.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Ionicons name="barbell-outline" size={64} color={theme.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No Workouts Yet</Text>
                <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
                  Create custom workout templates here or enable "Prompt to Save Workouts" in Settings to save completed workouts.
                </Text>
                <TouchableOpacity
                  style={[styles.createButton, { backgroundColor: theme.primary }]}
                  onPress={startCreateWorkout}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                  <Text style={styles.createButtonText}>Create Workout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {(Object.keys(groupedTemplates) as WorkoutType[]).map(workoutType => {
                  const isCollapsed = collapsedSections.has(workoutType);
                  const templateCount = groupedTemplates[workoutType].length;

                  return (
                    <View key={workoutType}>
                      <TouchableOpacity
                        style={[styles.sectionHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => toggleSection(workoutType)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.sectionHeaderLeft}>
                          <Ionicons
                            name={getWorkoutTypeIcon(workoutType)}
                            size={20}
                            color={theme.primary}
                            style={{ marginRight: 8 }}
                          />
                          <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            {getWorkoutTypeLabel(workoutType)} Workouts
                          </Text>
                          <View style={[styles.countBadge, { backgroundColor: theme.primary + '20' }]}>
                            <Text style={[styles.countBadgeText, { color: theme.primary }]}>
                              {templateCount}
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name={isCollapsed ? "chevron-down" : "chevron-up"}
                          size={24}
                          color={theme.textSecondary}
                        />
                      </TouchableOpacity>

                      {!isCollapsed && groupedTemplates[workoutType].map(template => (
                        <View
                          key={template.id}
                          style={[styles.templateCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                        >
                          <View style={styles.templateHeader}>
                            <View style={styles.templateInfo}>
                              <View style={[styles.typeIcon, { backgroundColor: theme.primary + '20' }]}>
                                <Ionicons
                                  name={getWorkoutTypeIcon(template.workoutType)}
                                  size={20}
                                  color={theme.primary}
                                />
                              </View>
                              <View style={styles.templateText}>
                                <Text style={[styles.templateName, { color: theme.text }]}>
                                  {template.name}
                                </Text>
                                <Text style={[styles.templateMeta, { color: theme.textSecondary }]}>
                                  {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''} • Created {formatDate(template.createdAt)}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.actionButtons}>
                              <TouchableOpacity
                                onPress={() => startEditWorkout(template)}
                                style={styles.editButton}
                              >
                                <Ionicons name="create-outline" size={20} color={theme.primary} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => deleteTemplate(template.id)}
                                style={styles.deleteButton}
                              >
                                <Ionicons name="trash-outline" size={20} color={theme.error} />
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View style={styles.exerciseList}>
                            {template.exercises.map((exercise, index) => (
                              <View key={exercise.id} style={styles.exerciseItem}>
                                <Text style={[styles.exerciseNumber, { color: theme.textSecondary }]}>
                                  {index + 1}.
                                </Text>
                                <Text style={[styles.exerciseName, { color: theme.text }]}>
                                  {exercise.name}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Create Button */}
      {activeTab === 'templates' && templates.length > 0 && (
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: theme.primary }]}
          onPress={startCreateWorkout}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      {activeTab === 'recipes' && recipes.length > 0 && (
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: theme.primary }]}
          onPress={() => { setEditingRecipe(undefined); setShowRecipeEdit(true); }}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Create Workout Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelCreate}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.createModal, { backgroundColor: theme.card }]}>
              {showTypeSelector ? (
                <>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Select Workout Type</Text>
                  <View style={styles.typeGrid}>
                    {(['gym', 'cardio', 'calisthenics', 'stretching'] as WorkoutType[]).map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typeCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => selectWorkoutType(type)}
                      >
                        <Ionicons name={getWorkoutTypeIcon(type)} size={32} color={theme.primary} />
                        <Text style={[styles.typeLabel, { color: theme.text }]}>{getWorkoutTypeLabel(type)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: theme.border }]}
                    onPress={cancelCreate}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    {editingTemplate ? 'Edit' : 'Create'} {getWorkoutTypeLabel(newWorkoutType)} Workout
                  </Text>

                  {editingTemplate && (
                    <View style={styles.editNameSection}>
                      <Text style={[styles.editNameLabel, { color: theme.textSecondary }]}>Workout Name</Text>
                      <TextInput
                        style={[styles.editNameInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder="Workout name"
                        placeholderTextColor={theme.textSecondary}
                        value={newWorkoutName}
                        onChangeText={setNewWorkoutName}
                      />
                    </View>
                  )}

                  <View style={styles.addExerciseSection}>
                    <TextInput
                      style={[styles.exerciseNameInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                      placeholder="Exercise name"
                      placeholderTextColor={theme.textSecondary}
                      value={currentExerciseName}
                      onChangeText={setCurrentExerciseName}
                      onSubmitEditing={addExercise}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      style={[styles.addButton, { backgroundColor: theme.primary }]}
                      onPress={addExercise}
                    >
                      <Ionicons name="add" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.builderContent} showsVerticalScrollIndicator={false}>
                    {newExercises.length > 0 ? (
                      <>
                        <Text style={[styles.exercisesLabel, { color: theme.textSecondary }]}>
                          {newExercises.length} exercise{newExercises.length !== 1 ? 's' : ''}
                        </Text>
                        {newExercises.map((exercise, index) => (
                          <View key={exercise.id} style={[styles.exerciseItem2, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Text style={[styles.exerciseNumber2, { color: theme.textSecondary }]}>
                              {index + 1}.
                            </Text>
                            <Text style={[styles.exerciseName2, { color: theme.text }]}>
                              {exercise.name}
                            </Text>
                            <View style={styles.exerciseItemActions}>
                              <TouchableOpacity
                                onPress={() => moveExercise(exercise.id, 'up')}
                                disabled={index === 0}
                                style={{ opacity: index === 0 ? 0.3 : 1 }}
                              >
                                <Ionicons name="arrow-up" size={20} color={theme.textSecondary} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => moveExercise(exercise.id, 'down')}
                                disabled={index === newExercises.length - 1}
                                style={{ opacity: index === newExercises.length - 1 ? 0.3 : 1 }}
                              >
                                <Ionicons name="arrow-down" size={20} color={theme.textSecondary} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                                <Ionicons name="close-circle" size={24} color={theme.error} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </>
                    ) : (
                      <Text style={[styles.emptyExercises, { color: theme.textSecondary }]}>
                        No exercises added yet. Type a name above and tap + to add.
                      </Text>
                    )}
                  </ScrollView>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButtonOutline, { borderColor: theme.border }]}
                      onPress={cancelCreate}
                    >
                      <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
                      onPress={promptForWorkoutName}
                    >
                      <Text style={styles.saveButtonText}>
                        {editingTemplate ? 'Update Workout' : 'Save Workout'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Workout Name Prompt Modal */}
      <Modal
        visible={showNamePrompt}
        transparent={true}
        animationType="fade"
        onRequestClose={backToBuilder}
      >
        <View style={styles.namePromptOverlay}>
          <View style={[styles.namePromptModal, { backgroundColor: theme.card }]}>
            <Text style={[styles.namePromptTitle, { color: theme.text }]}>Name Your Workout</Text>
            <TextInput
              style={[styles.nameInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., Upper Body Day"
              placeholderTextColor={theme.textSecondary}
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
              onSubmitEditing={saveWorkout}
              returnKeyType="done"
              autoFocus
            />
            <View style={styles.namePromptButtons}>
              <TouchableOpacity
                style={[styles.namePromptButton, { borderColor: theme.border }]}
                onPress={backToBuilder}
              >
                <Text style={[styles.namePromptCancelText, { color: theme.textSecondary }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.namePromptButton, styles.namePromptSaveButton, { backgroundColor: theme.primary }]}
                onPress={saveWorkout}
              >
                <Text style={styles.namePromptSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  activeTabButton: {},
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    marginTop: 60,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 8,
    borderWidth: 1,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  templateCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  templateText: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  templateMeta: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseList: {
    gap: 6,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseNumber: {
    fontSize: 13,
    fontWeight: '700',
    width: 22,
    textAlign: 'right',
  },
  exerciseName: {
    fontSize: 14,
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeCardImage: {
    width: 80,
    height: 80,
  },
  recipeCardImagePlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeCardInfo: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  recipeCardName: {
    fontSize: 16,
    fontWeight: '700',
  },
  recipeCardMeta: {
    fontSize: 12,
  },
  recipeCardMacros: {
    fontSize: 13,
    fontWeight: '700',
  },
  recipeDeleteBtn: {
    padding: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  createModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  typeCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  editNameSection: {
    marginBottom: 16,
  },
  editNameLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  editNameInput: {
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    borderWidth: 1,
  },
  addExerciseSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  exerciseNameInput: {
    flex: 1,
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    borderWidth: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  builderContent: {
    maxHeight: 400,
  },
  exercisesLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  exerciseItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  exerciseNumber2: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 12,
    width: 24,
    textAlign: 'right',
  },
  exerciseName2: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  exerciseItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyExercises: {
    fontSize: 14,
    textAlign: 'center',
    padding: 40,
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonOutline: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {},
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  namePromptOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  namePromptModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  namePromptTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  nameInput: {
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  namePromptButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  namePromptButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  namePromptSaveButton: {
    borderWidth: 0,
  },
  namePromptCancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  namePromptSaveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

