import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SectionKey } from './src/utils/theme';
import { ActiveWorkoutProvider, useActiveWorkout } from './src/context/ActiveWorkoutContext';
import { GlobalDateProvider } from './src/context/GlobalDateContext';
import { BodyMapProvider } from './src/context/BodyMapContext';
import { migrateWorkoutTypes, seedDefaultTemplates } from './src/utils/bootstrap';
import ActiveWorkoutStatusBar from './src/components/ActiveWorkoutStatusBar';
import GlobalDateWarning from './src/components/GlobalDateWarning';
import CaloriesScreen from './src/screens/CaloriesScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import ActiveWorkoutScreen from './src/screens/ActiveWorkoutScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import WorkoutGoalsScreen from './src/screens/WorkoutGoalsScreen';
import BodyMapScreen from './src/screens/BodyMapScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

type RootScreen =
  | 'calories'
  | 'library'
  | 'workouts'
  | 'ranks'
  | 'settings'
  | 'goals'
  | 'workoutGoals'
  | 'activeWorkout';

const tabScreens: Array<{
  key: Extract<RootScreen, 'calories' | 'library' | 'workouts' | 'ranks'>;
  label: string;
  section: SectionKey;
  icon: 'flame' | 'library' | 'barbell' | 'medal';
}> = [
  { key: 'calories', label: 'Nutrition', section: 'Calories', icon: 'flame' },
  { key: 'library', label: 'Library', section: 'Library', icon: 'library' },
  { key: 'workouts', label: 'Workouts', section: 'Workouts', icon: 'barbell' },
  { key: 'ranks', label: 'Ranks', section: 'Ranks', icon: 'medal' },
];

function MainApp() {
  const [screen, setScreen] = useState<RootScreen>('calories');
  const [activeTab, setActiveTab] = useState<Extract<RootScreen, 'calories' | 'library' | 'workouts' | 'ranks'>>('calories');
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

  // Handle stretch timer completion
  useEffect(() => {
    if (stretchTimerCompleted) {
      // Could show alert or auto-navigate
      clearStretchTimerCompleted();
    }
  }, [stretchTimerCompleted, clearStretchTimerCompleted]);

  const renderScreen = () => {
    if (screen === 'activeWorkout') {
      return <ActiveWorkoutScreen 
        onBack={() => {
          setScreen('workouts');
          // Clear collapsed state when leaving workout screen
          if (!isWorkoutActive) {
            setCollapsedExercises(new Set());
          }
        }}
        collapsedExercises={collapsedExercises}
        setCollapsedExercises={setCollapsedExercises}
      />;
    }

    if (screen === 'workoutGoals') {
      return <WorkoutGoalsScreen onBack={() => setScreen('settings')} />;
    }

    if (screen === 'goals') {
      return <GoalsScreen 
        onBack={() => setScreen('settings')}
        onApplyPreset={() => {
          setScreen('settings');
        }}
      />;
    }
    
    if (screen === 'settings') {
      return <SettingsScreen 
        onBack={() => setScreen(activeTab)}
        onOpenGoals={() => {
          setScreen('goals');
        }}
        onOpenWorkoutGoals={() => {
          setScreen('workoutGoals');
        }}
      />;
    }

    switch (screen) {
      case 'calories':
        return <CaloriesScreen onOpenSettings={() => setScreen('settings')} />;
      case 'library':
        return <LibraryScreen onOpenSettings={() => setScreen('settings')} />;
      case 'workouts':
        return <WorkoutsScreen 
          onOpenSettings={() => setScreen('settings')}
          onStartWorkout={() => setScreen('activeWorkout')}
        />;
      case 'ranks':
        return <BodyMapScreen 
          onOpenSettings={() => setScreen('settings')}
        />;

      default:
        return <CaloriesScreen onOpenSettings={() => setScreen('settings')} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isWorkoutActive && screen !== 'activeWorkout' && (
        <ActiveWorkoutStatusBar onPress={() => setScreen('activeWorkout')} />
      )}
      
      <View style={styles.content}>
        <GlobalDateWarning />
        {renderScreen()}
      </View>
      {['calories', 'library', 'workouts', 'ranks'].includes(screen) && (
        <View style={[styles.tabBar, { backgroundColor: theme.tabBar }]}>
          {tabScreens.map(tab => {
            const isActive = screen === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => {
                  setActiveTab(tab.key);
                  setScreen(tab.key);
                  setActiveSection(tab.section);
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
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    migrateWorkoutTypes()
      .then(seedDefaultTemplates)
      .catch(error => {
        console.error('App bootstrap failed:', error);
        setBootstrapError('Unable to initialize saved app data.');
      })
      .finally(() => setIsBootstrapped(true));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        {!isBootstrapped ? (
          <SafeAreaProvider>
            <View style={styles.container} />
          </SafeAreaProvider>
        ) : bootstrapError ? (
          <SafeAreaProvider>
            <View style={[styles.container, styles.bootstrapError]}>
              <Text style={styles.bootstrapErrorTitle}>GymBud could not start</Text>
              <Text style={styles.bootstrapErrorText}>{bootstrapError}</Text>
            </View>
          </SafeAreaProvider>
        ) : (
          <SafeAreaProvider>
            <ThemeProvider>
              <GlobalDateProvider>
                <BodyMapProvider>
                  <ActiveWorkoutProvider>
                    <MainApp />
                  </ActiveWorkoutProvider>
                </BodyMapProvider>
              </GlobalDateProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        )}
      </ErrorBoundary>
    </GestureHandlerRootView>
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
  bootstrapError: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0F0F14',
  },
  bootstrapErrorTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  bootstrapErrorText: {
    color: '#D1D5DB',
    fontSize: 16,
    textAlign: 'center',
  },
});
