import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';

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
  const [stepOffset, setStepOffset] = useState('300');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadStepOffset();
  }, []);

  const loadStepOffset = async () => {
    try {
      const offset = await storage.getItem<number>(STORAGE_KEYS.STEP_OFFSET);
      if (offset !== null) {
        setStepOffset(offset.toString());
      }
    } catch (error) {
      console.error('Error loading step offset:', error);
    }
  };

  const handleOffsetChange = (value: string) => {
    setStepOffset(value);
    setHasChanges(true);
  };

  const saveStepOffset = async () => {
    try {
      const offset = parseInt(stepOffset) || 0;
      await storage.setItem(STORAGE_KEYS.STEP_OFFSET, offset);
      setHasChanges(false);
      Alert.alert('Success', 'Step offset saved. Restart the app to apply changes.');
    } catch (error) {
      console.error('Error saving step offset:', error);
      Alert.alert('Error', 'Failed to save step offset');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Goals</Text>
        <TouchableOpacity 
          style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={onOpenGoals}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="restaurant-outline" size={24} color={theme.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Calorie & Macro Goals</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Set targets and manage presets
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => onOpenWorkoutGoals && onOpenWorkoutGoals()}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="barbell-outline" size={24} color={theme.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Workout Goals</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Set step and exercise targets
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
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
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={isDark ? theme.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data & Tracking</Text>
        <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View>
            <View style={styles.settingLeft}>
              <Ionicons name="analytics-outline" size={24} color={theme.primary} style={styles.settingIcon} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Step Offset Calibration</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Adjust to match your health app's step count
                </Text>
              </View>
            </View>
            <View style={styles.offsetInputContainer}>
              <TextInput
                style={[styles.offsetInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="300"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={stepOffset}
                onChangeText={handleOffsetChange}
              />
              <TouchableOpacity
                style={[styles.saveOffsetButton, { backgroundColor: hasChanges ? theme.primary : theme.border }]}
                onPress={saveStepOffset}
                disabled={!hasChanges}
              >
                <Text style={[styles.saveOffsetButtonText, { color: hasChanges ? 'white' : theme.textSecondary }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  topBarTitle: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 36,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  settingCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
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
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  offsetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  offsetInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  saveOffsetButton: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  saveOffsetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
