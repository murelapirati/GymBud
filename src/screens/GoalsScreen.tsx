import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface Goals {
  calories: number;
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
}

interface GoalPreset {
  id: string;
  name: string;
  goals: Goals;
}

interface GoalsScreenProps {
  onBack: () => void;
  onApplyPreset?: () => void;
}

export default function GoalsScreen({ onBack, onApplyPreset }: GoalsScreenProps) {
  const { theme } = useTheme();
  const [calories, setCalories] = useState('2000');
  const [proteinPercent, setProteinPercent] = useState('30');
  const [carbsPercent, setCarbsPercent] = useState('40');
  const [fatsPercent, setFatsPercent] = useState('30');
  const [presets, setPresets] = useState<GoalPreset[]>([]);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showEditGoalsModal, setShowEditGoalsModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    loadGoals();
    loadPresets();
  }, []);

  const loadGoals = async () => {
    try {
      const goals = await storage.getItem<Goals>(STORAGE_KEYS.GOALS);
      if (goals) {
        setCalories(goals.calories.toString());
        setProteinPercent(goals.proteinPercent.toString());
        setCarbsPercent(goals.carbsPercent.toString());
        setFatsPercent(goals.fatsPercent.toString());
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const loadPresets = async () => {
    try {
      const savedPresets = await storage.getItem<GoalPreset[]>(STORAGE_KEYS.GOAL_PRESETS);
      if (savedPresets && savedPresets.length > 0) {
        setPresets(savedPresets);
      } else {
        // Create default preset on first launch
        const defaultPreset: GoalPreset = {
          id: Date.now().toString(),
          name: 'Maintenance',
          goals: {
            calories: 2000,
            proteinPercent: 30,
            carbsPercent: 40,
            fatsPercent: 30,
          },
        };
        await storage.setItem(STORAGE_KEYS.GOAL_PRESETS, [defaultPreset]);
        setPresets([defaultPreset]);
      }
    } catch (error) {
      console.error('Error loading presets:', error);
    }
  };

  const handleSaveAsPreset = async () => {
    if (!presetName.trim()) {
      Alert.alert('Error', 'Please enter a preset name');
      return;
    }

    const totalPercent = parseFloat(proteinPercent) + parseFloat(carbsPercent) + parseFloat(fatsPercent);
    if (totalPercent !== 100) {
      Alert.alert('Invalid Percentages', 'Macro percentages must total 100%');
      return;
    }

    const newPreset: GoalPreset = {
      id: Date.now().toString(),
      name: presetName,
      goals: {
        calories: parseFloat(calories) || 2000,
        proteinPercent: parseFloat(proteinPercent) || 30,
        carbsPercent: parseFloat(carbsPercent) || 40,
        fatsPercent: parseFloat(fatsPercent) || 30,
      },
    };

    // Save the goals as current goals
    await storage.setItem(STORAGE_KEYS.GOALS, newPreset.goals);

    const updatedPresets = [...presets, newPreset];
    await storage.setItem(STORAGE_KEYS.GOAL_PRESETS, updatedPresets);
    setPresets(updatedPresets);
    setPresetName('');
    setShowPresetModal(false);
    Alert.alert('Success', `Preset "${presetName}" saved!`);
  };

  const handleApplyPreset = async (preset: GoalPreset) => {
    setCalories(preset.goals.calories.toString());
    setProteinPercent(preset.goals.proteinPercent.toString());
    setCarbsPercent(preset.goals.carbsPercent.toString());
    setFatsPercent(preset.goals.fatsPercent.toString());
    
    await storage.setItem(STORAGE_KEYS.GOALS, preset.goals);
    Alert.alert('Applied', `Preset "${preset.name}" has been applied!`, [
      {
        text: 'OK',
        onPress: () => {
          if (onApplyPreset) {
            onApplyPreset();
          }
        },
      },
    ]);
  };

  const handleDeletePreset = async (presetId: string) => {
    Alert.alert(
      'Delete Preset',
      'Are you sure you want to delete this preset?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedPresets = presets.filter(p => p.id !== presetId);
            await storage.setItem(STORAGE_KEYS.GOAL_PRESETS, updatedPresets);
            setPresets(updatedPresets);
          },
        },
      ]
    );
  };

  const totalPercent = (parseFloat(proteinPercent) || 0) + (parseFloat(carbsPercent) || 0) + (parseFloat(fatsPercent) || 0);

  const handleCaloriesChange = (value: string) => {
    setCalories(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Goals & Presets</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.presetsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Saved Presets</Text>
          {presets.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No presets saved yet
            </Text>
          )}
        </View>

        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={[styles.presetCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => handleApplyPreset(preset)}
            activeOpacity={0.7}
          >
            <View style={styles.presetLeft}>
              <View style={styles.presetHeader}>
                <Ionicons name="bookmark" size={20} color={theme.primary} />
                <Text style={[styles.presetName, { color: theme.text }]}>{preset.name}</Text>
              </View>
              <View style={styles.presetDetails}>
                <Text style={[styles.presetDetailText, { color: theme.textSecondary }]}>
                  {preset.goals.calories} cal
                </Text>
                <Text style={[styles.presetDetailSeparator, { color: theme.textSecondary }]}>•</Text>
                <Text style={[styles.presetDetailText, { color: '#FF6B6B' }]}>
                  P: {preset.goals.proteinPercent}%
                </Text>
                <Text style={[styles.presetDetailText, { color: '#4ECDC4' }]}>
                  C: {preset.goals.carbsPercent}%
                </Text>
                <Text style={[styles.presetDetailText, { color: '#FFE66D' }]}>
                  F: {preset.goals.fatsPercent}%
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deletePresetButton}
              onPress={() => handleDeletePreset(preset.id)}
            >
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.customGoalsButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowEditGoalsModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.customGoalsContent}>
            <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
            <Text style={[styles.customGoalsText, { color: theme.text }]}>Create New Goal</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Goals Modal */}
      <Modal
        visible={showEditGoalsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditGoalsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Create New Goal</Text>
              <TouchableOpacity onPress={() => setShowEditGoalsModal(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
              <View style={styles.goalSection}>
                <Text style={[styles.goalLabel, { color: theme.text }]}>Daily Calorie Target</Text>
                <TextInput
                  style={[styles.goalInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  placeholder="2000"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  value={calories}
                  onChangeText={handleCaloriesChange}
                />
              </View>

              <Text style={[styles.goalLabel, { color: theme.text, marginTop: 16 }]}>Macronutrient Percentages</Text>
              <Text style={[styles.goalDescription, { color: theme.textSecondary }]}>
                Total must equal 100%
              </Text>

              <View style={styles.macroInputRow}>
                <View style={styles.macroInputContainer}>
                  <Text style={[styles.macroInputLabel, { color: '#FF6B6B' }]}>Protein</Text>
                  <TextInput
                    style={[styles.macroInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                    placeholder="30"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                    value={proteinPercent}
                    onChangeText={setProteinPercent}
                  />
                  <Text style={[styles.percentSymbol, { color: theme.text }]}>%</Text>
                </View>

                <View style={styles.macroInputContainer}>
                  <Text style={[styles.macroInputLabel, { color: '#4ECDC4' }]}>Carbs</Text>
                  <TextInput
                    style={[styles.macroInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                    placeholder="40"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                    value={carbsPercent}
                    onChangeText={setCarbsPercent}
                  />
                  <Text style={[styles.percentSymbol, { color: theme.text }]}>%</Text>
                </View>

                <View style={styles.macroInputContainer}>
                  <Text style={[styles.macroInputLabel, { color: '#FFE66D' }]}>Fats</Text>
                  <TextInput
                    style={[styles.macroInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                    placeholder="30"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                    value={fatsPercent}
                    onChangeText={setFatsPercent}
                  />
                  <Text style={[styles.percentSymbol, { color: theme.text }]}>%</Text>
                </View>
              </View>

              {totalPercent !== 100 && (
                <View style={[styles.warningContainer, { backgroundColor: theme.error + '20' }]}>
                  <Ionicons name="warning" size={16} color={theme.error} />
                  <Text style={[styles.warningText, { color: theme.error }]}>
                    Total: {totalPercent}% (must be 100%)
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setShowEditGoalsModal(false);
                  setShowPresetModal(true);
                }}
              >
                <Ionicons name="bookmark" size={20} color="white" />
                <Text style={styles.buttonText}>Save as New Daily Goal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Save Preset Modal */}
      <Modal
        visible={showPresetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPresetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Save Preset</Text>
              <TouchableOpacity onPress={() => setShowPresetModal(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: theme.text }]}>Preset Name</Text>
            <TextInput
              style={[styles.presetNameInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., Bulking, Cutting, Maintenance"
              placeholderTextColor={theme.textSecondary}
              value={presetName}
              onChangeText={setPresetName}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.modalSaveButton, { backgroundColor: theme.primary }]}
              onPress={handleSaveAsPreset}
            >
              <Text style={styles.modalSaveButtonText}>Save Preset</Text>
            </TouchableOpacity>
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
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  goalSection: {
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 13,
    marginBottom: 12,
  },
  goalInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  macroInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  macroInputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  macroInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  macroInput: {
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    width: '100%',
    textAlign: 'center',
  },
  percentSymbol: {
    fontSize: 14,
    marginTop: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  presetsHeader: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  presetLeft: {
    flex: 1,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
  },
  presetDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetDetailText: {
    fontSize: 13,
  },
  presetDetailSeparator: {
    fontSize: 13,
  },
  deletePresetButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 20,
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
  modalLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetNameInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  modalSaveButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  customGoalsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  customGoalsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customGoalsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
});
