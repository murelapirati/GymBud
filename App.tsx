import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ActiveWorkoutProvider, useActiveWorkout } from './src/context/ActiveWorkoutContext';
import ActiveWorkoutStatusBar from './src/components/ActiveWorkoutStatusBar';
import RestTimerStatusBar from './src/components/RestTimerStatusBar';
import CaloriesScreen from './src/screens/CaloriesScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import ActiveWorkoutScreen from './src/screens/ActiveWorkoutScreen';
import RestTimerScreen from './src/screens/RestTimerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import WorkoutGoalsScreen from './src/screens/WorkoutGoalsScreen';

function MainApp() {
  const [activeScreen, setActiveScreen] = useState('Calories');
  const [showSettings, setShowSettings] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showWorkoutGoals, setShowWorkoutGoals] = useState(false);
  const [showActiveWorkout, setShowActiveWorkout] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [collapsedExercises, setCollapsedExercises] = useState<Set<string>>(new Set());
  const { theme } = useTheme();
  const { 
    isWorkoutActive, 
    activeRestTimer, 
    restTimerInitialSeconds, 
    restTimerCompleted, 
    clearRestTimerCompleted,
    stretchTimerCompleted,
    clearStretchTimerCompleted 
  } = useActiveWorkout();

  // Auto-navigate to rest timer screen when timer starts
  useEffect(() => {
    if (restTimerInitialSeconds > 0) {
      setShowRestTimer(true);
    }
  }, [restTimerInitialSeconds]);

  // Handle stretch timer completion
  useEffect(() => {
    if (stretchTimerCompleted) {
      // Could show alert or auto-navigate
      clearStretchTimerCompleted();
    }
  }, [stretchTimerCompleted, clearStretchTimerCompleted]);

  const handleRestTimerComplete = () => {
    clearRestTimerCompleted();
    setShowRestTimer(false);
  };

  const renderScreen = () => {
    if (showRestTimer) {
      return <RestTimerScreen onBack={() => setShowRestTimer(false)} />;
    }

    if (showActiveWorkout) {
      return <ActiveWorkoutScreen 
        onBack={() => {
          setShowActiveWorkout(false);
          // Clear collapsed state when leaving workout screen
          if (!isWorkoutActive) {
            setCollapsedExercises(new Set());
          }
        }}
        collapsedExercises={collapsedExercises}
        setCollapsedExercises={setCollapsedExercises}
      />;
    }

    if (showWorkoutGoals) {
      return <WorkoutGoalsScreen onBack={() => setShowWorkoutGoals(false)} />;
    }

    if (showGoals) {
      return <GoalsScreen 
        onBack={() => setShowGoals(false)} 
        onApplyPreset={() => {
          setShowGoals(false);
        }}
      />;
    }
    
    if (showSettings) {
      return <SettingsScreen 
        onBack={() => setShowSettings(false)} 
        onOpenGoals={() => {
          setShowSettings(false);
          setShowGoals(true);
        }}
        onOpenWorkoutGoals={() => {
          setShowSettings(false);
          setShowWorkoutGoals(true);
        }}
      />;
    }

    switch (activeScreen) {
      case 'Calories':
        return <CaloriesScreen onOpenSettings={() => setShowSettings(true)} />;
      case 'Workouts':
        return <WorkoutsScreen 
          onOpenSettings={() => setShowSettings(true)}
          onStartWorkout={() => setShowActiveWorkout(true)}
        />;
      default:
        return <CaloriesScreen onOpenSettings={() => setShowSettings(true)} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isWorkoutActive && !showActiveWorkout && (
        <ActiveWorkoutStatusBar onPress={() => setShowActiveWorkout(true)} />
      )}
      {activeRestTimer && activeRestTimer > 0 && !showRestTimer && showActiveWorkout && (
        <RestTimerStatusBar onPress={() => setShowRestTimer(true)} />
      )}
      
      {/* Rest Timer Completion Modal */}
      <Modal visible={restTimerCompleted} transparent={true} animationType="fade">
        <View style={styles.completionOverlay}>
          <View style={[styles.completionContent, { backgroundColor: theme.card }]}>
            <View style={[styles.completionIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color={theme.primary} />
            </View>
            <Text style={[styles.completionTitle, { color: theme.text }]}>Rest Complete!</Text>
            <Text style={[styles.completionSubtitle, { color: theme.textSecondary }]}>
              Ready for your next set
            </Text>
            <TouchableOpacity
              style={[styles.completionButton, { backgroundColor: theme.primary }]}
              onPress={handleRestTimerComplete}
            >
              <Text style={styles.completionButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {!showSettings && !showGoals && !showWorkoutGoals && !showActiveWorkout && !showRestTimer && (
        <View style={[styles.tabBar, { backgroundColor: theme.tabBar, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveScreen('Calories')}
          >
            <Ionicons 
              name="flame-outline" 
              size={28} 
              color={activeScreen === 'Calories' ? theme.tabBarActive : theme.tabBarInactive}
              style={styles.tabIcon}
            />
            <Text style={[
              styles.tabText, 
              { color: activeScreen === 'Calories' ? theme.tabBarActive : theme.tabBarInactive }
            ]}>
              Calorie Tracker
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveScreen('Workouts')}
          >
            <Ionicons 
              name="barbell-outline" 
              size={28} 
              color={activeScreen === 'Workouts' ? theme.tabBarActive : theme.tabBarInactive}
              style={styles.tabIcon}
            />
            <Text style={[
              styles.tabText, 
              { color: activeScreen === 'Workouts' ? theme.tabBarActive : theme.tabBarInactive }
            ]}>
              Workouts
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ActiveWorkoutProvider>
        <MainApp />
      </ActiveWorkoutProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 15,
    height: 80,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
  },
  completionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionContent: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 360,
  },
  completionIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 16,
    marginBottom: 28,
  },
  completionButton: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
  },
  completionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
