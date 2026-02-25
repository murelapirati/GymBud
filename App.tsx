import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import CaloriesScreen from './src/screens/CaloriesScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import WorkoutGoalsScreen from './src/screens/WorkoutGoalsScreen';

function MainApp() {
  const [activeScreen, setActiveScreen] = useState('Calories');
  const [showSettings, setShowSettings] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showWorkoutGoals, setShowWorkoutGoals] = useState(false);
  const { theme } = useTheme();

  const renderScreen = () => {
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
        return <WorkoutsScreen onOpenSettings={() => setShowSettings(true)} />;
      default:
        return <CaloriesScreen onOpenSettings={() => setShowSettings(true)} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {!showSettings && !showGoals && !showWorkoutGoals && (
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
      <MainApp />
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
});
