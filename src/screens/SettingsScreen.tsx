import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import type { MeasurementSystem } from '../utils/measurements';
import CustomExercisesModal from '../components/CustomExercisesModal';
import { useBodyMap } from '../context/BodyMapContext';


interface Goals {
  calories: number;
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
}

interface SettingsScreenProps {
  onBack: () => void;
  onOpenGoals: () => void;
  onOpenWorkoutGoals?: () => void;
}

export default function SettingsScreen({ onBack, onOpenGoals, onOpenWorkoutGoals }: SettingsScreenProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [stepMultiplier, setStepMultiplier] = useState('1.33');
  const [hasChanges, setHasChanges] = useState(false);
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>('imperial');
  const [promptSaveTemplate, setPromptSaveTemplate] = useState(false);
  const [showCustomExercises, setShowCustomExercises] = useState(false);
  const { gender, setGender, refreshRanks } = useBodyMap();


  useEffect(() => {
    loadStepMultiplier();
    loadMeasurementSystem();
    loadPromptSaveTemplate();
  }, []);

  const loadStepMultiplier = async () => {
    try {
      const multiplier = await storage.getItem<number>(STORAGE_KEYS.STEP_MULTIPLIER);
      if (multiplier !== null) {
        setStepMultiplier(multiplier.toString());
      }
    } catch (error) {
      console.error('Error loading step multiplier:', error);
    }
  };

  const loadMeasurementSystem = async () => {
    try {
      const system = await storage.getItem<MeasurementSystem>(STORAGE_KEYS.MEASUREMENT_SYSTEM);
      if (system) {
        setMeasurementSystem(system);
      }
    } catch (error) {
      console.error('Error loading measurement system:', error);
    }
  };

  const toggleMeasurementSystem = async () => {
    try {
      const newSystem: MeasurementSystem = measurementSystem === 'imperial' ? 'metric' : 'imperial';
      await storage.setItem(STORAGE_KEYS.MEASUREMENT_SYSTEM, newSystem);
      setMeasurementSystem(newSystem);
    } catch (error) {
      console.error('Error saving measurement system:', error);
      Alert.alert('Error', 'Failed to save measurement preference');
    }
  };

  const loadPromptSaveTemplate = async () => {
    try {
      const prompt = await storage.getItem<boolean>(STORAGE_KEYS.PROMPT_SAVE_TEMPLATE);
      if (prompt !== null) {
        setPromptSaveTemplate(prompt);
      }
    } catch (error) {
      console.error('Error loading template prompt setting:', error);
    }
  };

  const togglePromptSaveTemplate = async () => {
    try {
      const newValue = !promptSaveTemplate;
      await storage.setItem(STORAGE_KEYS.PROMPT_SAVE_TEMPLATE, newValue);
      setPromptSaveTemplate(newValue);
    } catch (error) {
      console.error('Error saving template prompt setting:', error);
      Alert.alert('Error', 'Failed to save setting');
    }
  };

  const handleMultiplierChange = (value: string) => {
    setStepMultiplier(value);
    setHasChanges(true);
  };

  const saveStepMultiplier = async () => {
    try {
      const multiplier = parseFloat(stepMultiplier) || 1.33;
      if (multiplier < 0.5 || multiplier > 3.0) {
        Alert.alert('Invalid Value', 'Multiplier must be between 0.5 and 3.0');
        return;
      }
      await storage.setItem(STORAGE_KEYS.STEP_MULTIPLIER, multiplier);
      setHasChanges(false);
      Alert.alert('Success', 'Step multiplier saved. Pull down on home screen to refresh.');
    } catch (error) {
      console.error('Error saving step multiplier:', error);
      Alert.alert('Error', 'Failed to save step multiplier');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'Choose what data you want to clear:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Workouts Only',
          style: 'destructive',
          onPress: () => confirmClearData('workouts'),
        },
        {
          text: 'Clear Calories Only',
          style: 'destructive',
          onPress: () => confirmClearData('calories'),
        },
        {
          text: 'Clear Body Map Only',
          style: 'destructive',
          onPress: () => confirmClearData('bodymap'),
        },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: () => confirmClearData('all'),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmClearData = (type: 'workouts' | 'calories' | 'bodymap' | 'all') => {
    const messages = {
      workouts: 'This will delete all workout history and activity data. This action cannot be undone.',
      calories: 'This will delete all calorie tracking data. This action cannot be undone.',
      bodymap: 'This will reset all muscle ranks and scores back to Dirt. This action cannot be undone.',
      all: 'This will delete ALL app data including workouts, calories, goals, and settings. This action cannot be undone.',
    };

    Alert.alert(
      'Are you sure?',
      messages[type],
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => clearData(type),
        },
      ],
      { cancelable: true }
    );
  };

  const clearData = async (type: 'workouts' | 'calories' | 'bodymap' | 'all') => {
    try {
      if (type === 'workouts' || type === 'all') {
        await storage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, {});
        await storage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, {});
        await storage.setItem(STORAGE_KEYS.WORKOUTS, []);
      }
      
      if (type === 'calories' || type === 'all') {
        await storage.setItem(STORAGE_KEYS.CALORIES, { date: new Date().toISOString().split('T')[0], items: [] });
      }
      
      if (type === 'bodymap' || type === 'all') {
        await storage.setItem(STORAGE_KEYS.MUSCLE_STATUS, {});
        await refreshRanks();
      }
      
      if (type === 'all') {
        await storage.setItem(STORAGE_KEYS.GOALS, {
          calories: 2000,
          proteinPercent: 30,
          carbsPercent: 40,
          fatsPercent: 30,
        });
        await storage.setItem(STORAGE_KEYS.WORKOUT_GOALS, {
          steps: 10000,
          exerciseMinutes: 30,
          caloriesBurned: 300,
        });
        await storage.setItem(STORAGE_KEYS.RECIPES, []);
        await storage.setItem(STORAGE_KEYS.GOAL_PRESETS, []);
      }

      Alert.alert(
        'Success',
        type === 'bodymap' ? 'Body map data cleared successfully.' : 'Data cleared successfully. Please restart the app to see all changes.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.surface }]}
      behavior='padding'
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Goals</Text>
        <TouchableOpacity 
          style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={onOpenGoals}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#7C5CFC22' }]}>
                <Ionicons name="restaurant-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Calorie & Macro Goals</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Set targets and manage presets
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => onOpenWorkoutGoals && onOpenWorkoutGoals()}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#34D39922' }]}>
                <Ionicons name="barbell-outline" size={20} color={theme.success} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Workout Goals</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Set step and exercise targets
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Advanced</Text>
        <TouchableOpacity 
          style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowCustomExercises(true)}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#8B5CF622' }]}>
                <Ionicons name="barbell-outline" size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Manage Custom Exercises</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Add and map your own exercises
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Toggle between light and dark theme
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: theme.primary }}
              thumbColor='#FFFFFF'
              ios_backgroundColor='#E0E0E0'
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>
        </View>

        <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Measurement System</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {measurementSystem === 'metric' ? 'Metric (kg)' : 'Imperial (lbs)'}
              </Text>
            </View>
            <Switch
              value={measurementSystem === 'metric'}
              onValueChange={toggleMeasurementSystem}
              trackColor={{ false: '#E0E0E0', true: theme.primary }}
              thumbColor='#FFFFFF'
              ios_backgroundColor='#E0E0E0'
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>
        </View>
        <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Body Map Type</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {gender === 'male' ? 'Male silhouette' : 'Female silhouette'}
              </Text>
            </View>
            <View style={styles.genderToggleContainer}>
              <TouchableOpacity 
                onPress={() => setGender('male')}
                style={[
                  styles.genderOption, 
                  gender === 'male' && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
              >
                <Ionicons name="male" size={16} color={gender === 'male' ? '#fff' : theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setGender('female')}
                style={[
                  styles.genderOption, 
                  gender === 'female' && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
              >
                <Ionicons name="female" size={16} color={gender === 'female' ? '#fff' : theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data & Tracking</Text>
        <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Prompt to Save Workouts</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Ask to save as template after finishing workouts
              </Text>
            </View>
            <Switch
              value={promptSaveTemplate}
              onValueChange={togglePromptSaveTemplate}
              trackColor={{ false: '#E0E0E0', true: theme.primary }}
              thumbColor='#FFFFFF'
              ios_backgroundColor='#E0E0E0'
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>
        </View>

        <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#FBBF2422' }]}>
                <Ionicons name="analytics-outline" size={20} color={theme.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Step Multiplier</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Health API × multiplier = adjusted steps (default 1.33)
                </Text>
              </View>
            </View>
            <View style={styles.offsetInputContainer}>
              <TextInput
                style={[styles.offsetInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="1.33"
                placeholderTextColor={theme.textSecondary}
                keyboardType='default'
                value={stepMultiplier}
                onChangeText={handleMultiplierChange}
              />
              <TouchableOpacity
                style={[styles.saveOffsetButton, { backgroundColor: hasChanges ? theme.primary : theme.border }]}
                onPress={saveStepMultiplier}
                disabled={!hasChanges}
              >
                <Text style={[styles.saveOffsetButtonText, { color: hasChanges ? 'white' : theme.textSecondary }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.settingCard, { backgroundColor: '#F8717118', borderColor: '#F8717130' }]}
          onPress={handleClearData}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#F8717122' }]}>
                <Ionicons name="trash-outline" size={20} color="#F87171" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingTitle, { color: '#F87171' }]}>Clear App Data</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Delete workouts, calories, body map, or all data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F87171" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <CustomExercisesModal 
        visible={showCustomExercises}
        onClose={() => setShowCustomExercises(false)}
      />
    </KeyboardAvoidingView>
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
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  settingCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  settingIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 13,
  },
  offsetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  offsetInput: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    borderWidth: 1,
    minHeight: 48,
    fontWeight: '600',
  },
  saveOffsetButton: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  saveOffsetButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  genderToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  genderOption: {
    width: 40,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

