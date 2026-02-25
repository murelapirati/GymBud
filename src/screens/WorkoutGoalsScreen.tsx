import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface WorkoutGoals {
  dailySteps: number;
  exerciseMinutes: number;
  caloriesBurned: number;
}

interface WorkoutGoalsScreenProps {
  onBack: () => void;
}

export default function WorkoutGoalsScreen({ onBack }: WorkoutGoalsScreenProps) {
  const { theme } = useTheme();
  const [dailySteps, setDailySteps] = useState('10000');
  const [exerciseMinutes, setExerciseMinutes] = useState('30');
  const [caloriesBurned, setCaloriesBurned] = useState('300');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const goals = await storage.getItem<WorkoutGoals>(STORAGE_KEYS.WORKOUT_GOALS);
      if (goals) {
        setDailySteps(goals.dailySteps.toString());
        setExerciseMinutes(goals.exerciseMinutes.toString());
        setCaloriesBurned(goals.caloriesBurned.toString());
      }
    } catch (error) {
      console.error('Error loading workout goals:', error);
    }
  };

  const handleSaveGoals = async () => {
    const steps = parseInt(dailySteps);
    const minutes = parseInt(exerciseMinutes);
    const calories = parseInt(caloriesBurned);
    
    if (isNaN(steps) || steps <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid step goal');
      return;
    }

    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid exercise minutes goal');
      return;
    }

    if (isNaN(calories) || calories <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid calories burned goal');
      return;
    }

    const goals: WorkoutGoals = {
      dailySteps: steps,
      exerciseMinutes: minutes,
      caloriesBurned: calories,
    };

    try {
      await storage.setItem(STORAGE_KEYS.WORKOUT_GOALS, goals);
      setHasChanges(false);
      Alert.alert('Success', 'Workout goals saved successfully!');
    } catch (error) {
      console.error('Error saving workout goals:', error);
      Alert.alert('Error', 'Failed to save workout goals');
    }
  };

  const handleInputChange = (value: string) => {
    setDailySteps(value);
    setHasChanges(true);
  };

  const handleMinutesChange = (value: string) => {
    setExerciseMinutes(value);
    setHasChanges(true);
  };

  const handleCaloriesChange = (value: string) => {
    setCaloriesBurned(value);
    setHasChanges(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Workout Goals</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Activity Goals Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics-outline" size={24} color={theme.primary} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Activity Ring Goals</Text>
          </View>
          
          {/* Steps Goal */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Ionicons name="walk" size={20} color="#5383B8" />
              <Text style={[styles.inputLabel, { color: theme.text, marginLeft: 8 }]}>Daily Steps</Text>
            </View>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={dailySteps}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder="10000"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Exercise Minutes Goal */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Ionicons name="time-outline" size={20} color="#34C759" />
              <Text style={[styles.inputLabel, { color: theme.text, marginLeft: 8 }]}>Exercise Minutes</Text>
            </View>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={exerciseMinutes}
              onChangeText={handleMinutesChange}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Calories Burned Goal */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Ionicons name="flame-outline" size={20} color="#FF3B30" />
              <Text style={[styles.inputLabel, { color: theme.text, marginLeft: 8 }]}>Calories Burned</Text>
            </View>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              value={caloriesBurned}
              onChangeText={handleCaloriesChange}
              keyboardType="numeric"
              placeholder="300"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Set your daily activity targets. These goals will appear as rings in your workout tracker.
            </Text>
          </View>
        </View>

        {/* Save Button */}
        {hasChanges && (
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSaveGoals}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Goals</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(83, 131, 184, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    marginLeft: 8,
    lineHeight: 18,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 14,
    lineHeight: 24,
  },
});
