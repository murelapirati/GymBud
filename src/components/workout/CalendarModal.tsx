import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MiniActivityRings from '../MiniActivityRings';

interface DailyActivityData {
  date: string;
  steps: number;
  exerciseMinutes: number;
  caloriesBurned: number;
  lastUpdated?: number; // Timestamp of when this data was last saved
}

interface DailyActivityHistory {
  [date: string]: DailyActivityData;
}

interface WorkoutSession {
  id: string;
  date: string;
  title?: string;
  exercises: any[];
  notes?: string;
  duration?: number;
  intensity?: number;
  startTime?: number;
  endTime?: number;
}

interface WorkoutHistory {
  [date: string]: WorkoutSession[];
}

interface CalendarModalProps {
  visible: boolean;
  viewingMonth: string;
  selectedDate: string;
  workoutHistory: WorkoutHistory;
  dailyActivityHistory: DailyActivityHistory;
  todaySteps: number;
  todayExerciseMinutes: number;
  todayCaloriesBurned: number;
  stepGoal: number;
  exerciseMinutesGoal: number;
  caloriesBurnedGoal: number;
  isWorkoutActive: boolean;
  workoutDuration: number;
  getTodayDate: () => string;
  onClose: () => void;
  onMonthChange: (delta: number) => void;
  onDateSelect: (date: string) => void;
  onViewingMonthChange: (month: string) => void;
  theme: {
    card: string;
    text: string;
    surface: string;
    border: string;
    textSecondary: string;
    primary: string;
  };
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  viewingMonth,
  selectedDate,
  workoutHistory,
  dailyActivityHistory,
  todaySteps,
  todayExerciseMinutes,
  todayCaloriesBurned,
  stepGoal,
  exerciseMinutesGoal,
  caloriesBurnedGoal,
  isWorkoutActive,
  workoutDuration,
  getTodayDate,
  onClose,
  onMonthChange,
  onDateSelect,
  theme,
}) => {
  const getMonthName = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const canGoNextMonth = () => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const viewDate = new Date(year, month - 1, 1);
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return viewDate < currentMonth;
  };

  const getCalendarMonths = () => {
    const [year, month] = viewingMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    
    return dates;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.historyModalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Activity History</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.monthNavigation}>
            <TouchableOpacity 
              style={[styles.monthNavButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => onMonthChange(-1)}
            >
              <Ionicons name="chevron-back" size={24} color={theme.text} />
            </TouchableOpacity>
            
            <Text style={[styles.monthTitle, { color: theme.text }]}>
              {getMonthName(viewingMonth)}
            </Text>

            <TouchableOpacity 
              style={[styles.monthNavButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => onMonthChange(1)}
              disabled={!canGoNextMonth()}
            >
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={canGoNextMonth() ? theme.text : theme.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.calendarScrollView}
            contentContainerStyle={styles.calendarScrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.calendarGrid}>
              {getCalendarMonths().map((dateString) => {
                const date = new Date(dateString + 'T00:00:00');
                const hasWorkout = !!workoutHistory[dateString];
                const isToday = dateString === getTodayDate();
                const isSelected = dateString === selectedDate;
                const isFuture = new Date(dateString) > new Date(getTodayDate());
                
                // Load historical activity data or use today's current values
                const dayActivity = dailyActivityHistory[dateString];
                const daySteps = isToday ? todaySteps : (dayActivity?.steps || 0);
                const dayExerciseMinutes = isToday ? todayExerciseMinutes : (dayActivity?.exerciseMinutes || 0);
                const dayCalories = isToday ? todayCaloriesBurned : (dayActivity?.caloriesBurned || 0);
                
                // Calculate progress percentages - allow calories to exceed 100% to show overage
                const stepsProgress = stepGoal > 0 ? Math.min(Math.max((daySteps / stepGoal) * 100, 0), 100) : 0;
                const exerciseProgress = exerciseMinutesGoal > 0 ? Math.min(Math.max((dayExerciseMinutes / exerciseMinutesGoal) * 100, 0), 100) : 0;
                const caloriesProgress = caloriesBurnedGoal > 0 ? Math.max((dayCalories / caloriesBurnedGoal) * 100, 0) : 0;

                return (
                  <TouchableOpacity
                    key={dateString}
                    style={[
                      styles.calendarDay,
                      { backgroundColor: theme.surface },
                      isSelected && { backgroundColor: theme.primary + '20', borderColor: theme.primary, borderWidth: 2 },
                      isToday && !isSelected && { borderColor: theme.primary, borderWidth: 1 },
                      isFuture && { opacity: 0.3 },
                    ]}
                    onPress={() => {
                      if (!isFuture) {
                        onDateSelect(dateString);
                        onClose();
                      }
                    }}
                    disabled={isFuture}
                  >
                    <Text style={[styles.calendarDayNumber, { color: theme.text }]}>
                      {date.getDate()}
                    </Text>
                    <Text style={[styles.calendarDayName, { color: theme.textSecondary }]}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    
                    <View style={styles.miniRingsContainer}>
                      {(hasWorkout || daySteps > 0 || dayExerciseMinutes > 0 || dayCalories > 0) && !isFuture ? (
                        <MiniActivityRings 
                          stepsProgress={stepsProgress}
                          exerciseProgress={exerciseProgress}
                          caloriesProgress={caloriesProgress}
                          size={32}
                        />
                      ) : (
                        <View style={[styles.emptyMiniRings, { borderColor: theme.border }]} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyModalContent: {
    borderRadius: 20,
    padding: 20,
    width: '95%',
    maxWidth: 700,
    maxHeight: '85%',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '500',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  monthNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  calendarScrollView: {
    flex: 1,
  },
  calendarScrollContent: {
    paddingBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  calendarDay: {
    width: '13.5%',
    aspectRatio: 0.75,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  calendarDayNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendarDayName: {
    fontSize: 9,
    textTransform: 'uppercase',
  },
  miniRingsContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  emptyMiniRings: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    opacity: 0.3,
  },
});
