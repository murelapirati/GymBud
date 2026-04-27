import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useGlobalDate } from '../context/GlobalDateContext';
import { getTodayDate } from '../utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GlobalDateWarning() {
  const { theme } = useTheme();
  const { selectedDate, setSelectedDate } = useGlobalDate();
  const insets = useSafeAreaInsets();

  if (selectedDate === getTodayDate()) {
    return null;
  }

  // Format date nicely (e.g., "Oct 12, 2023")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Add timezone offset to prevent shifting backwards a day
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
      <View style={styles.content}>
        <Ionicons name="calendar" size={20} color={theme.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.text, { color: theme.text }]}>
            Viewing data for <Text style={[styles.bold, { color: theme.primary }]}>{formatDate(selectedDate)}</Text>
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          onPress={() => setSelectedDate(getTodayDate())}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Return to Today</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  bold: {
    fontWeight: '700',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
