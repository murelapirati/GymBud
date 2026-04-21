import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SectionKey } from './src/utils/theme';
import { ActiveWorkoutProvider, useActiveWorkout } from './src/context/ActiveWorkoutContext';
import ActiveWorkoutStatusBar from './src/components/ActiveWorkoutStatusBar';
import RestTimerStatusBar from './src/components/RestTimerStatusBar';
import CaloriesScreen from './src/screens/CaloriesScreen';
import LibraryScreen from './src/screens/LibraryScreen';
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
  const { theme, setActiveSection } = useTheme();
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
      case 'Library':
        return <LibraryScreen onOpenSettings={() => setShowSettings(true)} />;
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
          <View style={[styles.completionContent, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.primary }]}>
            <View style={[styles.completionIconContainer, { backgroundColor: theme.primary + '25' }]}>
              <Ionicons name="checkmark-circle" size={72} color={theme.primary} />
            </View>
            <Text style={[styles.completionTitle, { color: theme.text }]}>Rest Complete!</Text>
            <Text style={[styles.completionSubtitle, { color: theme.textSecondary }]}>
              Ready for your next set
            </Text>
            <TouchableOpacity
              style={[styles.completionButton, { backgroundColor: theme.primary }]}
              onPress={handleRestTimerComplete}
            >
              <Text style={styles.completionButtonText}>Let's Go 💪</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {!showSettings && !showGoals && !showWorkoutGoals && !showActiveWorkout && !showRestTimer && (
        <View style={[styles.tabBar, { backgroundColor: theme.tabBar }]}>
          {[
            { key: 'Calories', label: 'Nutrition', icon: 'flame' as const },
            { key: 'Library', label: 'Library', icon: 'library' as const },
            { key: 'Workouts', label: 'Workouts', icon: 'barbell' as const },
          ].map(tab => {
            const isActive = activeScreen === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => {
                  setActiveScreen(tab.key);
                  setActiveSection(tab.key as SectionKey);
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.tabIconWrapper,
                  isActive && { backgroundColor: theme.primary + '20' },
                ]}>
                  <Ionicons
                    name={isActive ? tab.icon : `${tab.icon}-outline` as any}
                    size={24}
                    color={isActive ? theme.tabBarActive : theme.tabBarInactive}
                  />
                </View>
                <Text style={[
                  styles.tabText,
                  { color: isActive ? theme.tabBarActive : theme.tabBarInactive },
                  isActive && styles.tabTextActive,
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 8,
    height: 72,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIconWrapper: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tabTextActive: {
    fontWeight: '700',
  },
  completionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionContent: {
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    width: '88%',
    maxWidth: 360,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  completionIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  completionSubtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  completionButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    width: '100%',
  },
  completionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
