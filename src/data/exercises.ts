import { MappedExercise } from '../types';

export const PREDEFINED_EXERCISES: MappedExercise[] = [
  // CHEST
  { id: 'ex_1', name: 'Barbell Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], difficultyMultiplier: 1.0 },
  { id: 'ex_2', name: 'Dumbbell Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], difficultyMultiplier: 0.9 },
  { id: 'ex_3', name: 'Incline Barbell Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], difficultyMultiplier: 1.1 },
  { id: 'ex_4', name: 'Incline Dumbbell Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], difficultyMultiplier: 1.0 },
  { id: 'ex_5', name: 'Decline Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], difficultyMultiplier: 0.95 },
  { id: 'ex_6', name: 'Chest Flyes (Dumbbell/Cable)', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: [], difficultyMultiplier: 0.65 },
  { id: 'ex_7', name: 'Push-ups', type: 'calisthenics', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps', 'abs'], difficultyMultiplier: 0.7 },
  { id: 'ex_8', name: 'Dips', type: 'calisthenics', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front_delts'], difficultyMultiplier: 0.8 },

  // BACK
  { id: 'ex_9', name: 'Deadlift', type: 'gym', primaryMuscles: ['lower_back', 'glutes', 'hamstrings'], secondaryMuscles: ['lats', 'upper_back', 'quads', 'forearms'], difficultyMultiplier: 1.2 },
  { id: 'ex_10', name: 'Pull-ups', type: 'calisthenics', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'], difficultyMultiplier: 1.0 },
  { id: 'ex_11', name: 'Chin-ups', type: 'calisthenics', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'], difficultyMultiplier: 0.95 },
  { id: 'ex_12', name: 'Lat Pulldown', type: 'gym', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'], difficultyMultiplier: 0.8 },
  { id: 'ex_13', name: 'Barbell Row', type: 'gym', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps', 'lower_back'], difficultyMultiplier: 0.9 },
  { id: 'ex_14', name: 'Dumbbell Row', type: 'gym', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'], difficultyMultiplier: 0.85 },
  { id: 'ex_15', name: 'Seated Cable Row', type: 'gym', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps'], difficultyMultiplier: 0.75 },
  { id: 'ex_16', name: 'T-Bar Row', type: 'gym', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps'], difficultyMultiplier: 0.95 },
  { id: 'ex_17', name: 'Back Extension', type: 'gym', primaryMuscles: ['lower_back'], secondaryMuscles: ['glutes', 'hamstrings'], difficultyMultiplier: 0.55 },

  // SHOULDERS
  { id: 'ex_18', name: 'Overhead Press (Barbell)', type: 'gym', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps', 'side_delts'], difficultyMultiplier: 1.0 },
  { id: 'ex_19', name: 'Dumbbell Shoulder Press', type: 'gym', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps', 'side_delts'], difficultyMultiplier: 0.9 },
  { id: 'ex_20', name: 'Lateral Raises', type: 'gym', primaryMuscles: ['side_delts'], secondaryMuscles: [], difficultyMultiplier: 0.35 },
  { id: 'ex_21', name: 'Front Raises', type: 'gym', primaryMuscles: ['front_delts'], secondaryMuscles: [], difficultyMultiplier: 0.35 },
  { id: 'ex_22', name: 'Face Pulls', type: 'gym', primaryMuscles: ['rear_delts'], secondaryMuscles: ['upper_back'], difficultyMultiplier: 0.45 },
  { id: 'ex_23', name: 'Reverse Pec Deck', type: 'gym', primaryMuscles: ['rear_delts'], secondaryMuscles: ['upper_back'], difficultyMultiplier: 0.45 },
  { id: 'ex_24', name: 'Barbell Shrugs', type: 'gym', primaryMuscles: ['upper_back'], secondaryMuscles: [], difficultyMultiplier: 0.7 },

  // ARMS
  { id: 'ex_25', name: 'Barbell Curl', type: 'gym', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], difficultyMultiplier: 0.5 },
  { id: 'ex_26', name: 'Dumbbell Curl', type: 'gym', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], difficultyMultiplier: 0.45 },
  { id: 'ex_27', name: 'Hammer Curl', type: 'gym', primaryMuscles: ['biceps', 'forearms'], secondaryMuscles: [], difficultyMultiplier: 0.45 },
  { id: 'ex_28', name: 'Preacher Curl', type: 'gym', primaryMuscles: ['biceps'], secondaryMuscles: [], difficultyMultiplier: 0.5 },
  { id: 'ex_29', name: 'Tricep Pushdown', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: [], difficultyMultiplier: 0.5 },
  { id: 'ex_30', name: 'Overhead Tricep Extension', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: [], difficultyMultiplier: 0.5 },
  { id: 'ex_31', name: 'Skullcrushers', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: [], difficultyMultiplier: 0.5 },
  { id: 'ex_32', name: 'Close-Grip Bench Press', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'front_delts'], difficultyMultiplier: 0.9 },

  // LEGS - QUADS
  { id: 'ex_33', name: 'Barbell Squat', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'lower_back', 'abs'], difficultyMultiplier: 1.1 },
  { id: 'ex_34', name: 'Front Squat', type: 'gym', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'abs'], difficultyMultiplier: 1.2 },
  { id: 'ex_35', name: 'Leg Press', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'], difficultyMultiplier: 0.7 },
  { id: 'ex_36', name: 'Leg Extension', type: 'gym', primaryMuscles: ['quads'], secondaryMuscles: [], difficultyMultiplier: 0.35 },
  { id: 'ex_37', name: 'Bulgarian Split Squat', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'], difficultyMultiplier: 0.9 },
  { id: 'ex_38', name: 'Lunges', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'], difficultyMultiplier: 0.8 },
  { id: 'ex_39', name: 'Pistol Squats', type: 'calisthenics', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'abs'], difficultyMultiplier: 0.9 },

  // LEGS - POSTERIOR & CALVES
  { id: 'ex_40', name: 'Romanian Deadlift (RDL)', type: 'gym', primaryMuscles: ['hamstrings', 'glutes'], secondaryMuscles: ['lower_back'], difficultyMultiplier: 1.0 },
  { id: 'ex_41', name: 'Leg Curl', type: 'gym', primaryMuscles: ['hamstrings'], secondaryMuscles: [], difficultyMultiplier: 0.35 },
  { id: 'ex_42', name: 'Hip Thrust', type: 'gym', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'], difficultyMultiplier: 0.8 },
  { id: 'ex_43', name: 'Glute Bridge', type: 'gym', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'], difficultyMultiplier: 0.6 },
  { id: 'ex_44', name: 'Standing Calf Raise', type: 'gym', primaryMuscles: ['calves'], secondaryMuscles: [], difficultyMultiplier: 0.4 },
  { id: 'ex_45', name: 'Seated Calf Raise', type: 'gym', primaryMuscles: ['calves'], secondaryMuscles: [], difficultyMultiplier: 0.3 },

  // CORE
  { id: 'ex_46', name: 'Crunches', type: 'calisthenics', primaryMuscles: ['abs'], secondaryMuscles: [], difficultyMultiplier: 0.2 },
  { id: 'ex_47', name: 'Plank', type: 'calisthenics', primaryMuscles: ['abs'], secondaryMuscles: ['lower_back', 'obliques'], difficultyMultiplier: 0.2 },
  { id: 'ex_48', name: 'Hanging Leg Raises', type: 'calisthenics', primaryMuscles: ['abs'], secondaryMuscles: [], difficultyMultiplier: 0.4 },
  { id: 'ex_49', name: 'Russian Twists', type: 'calisthenics', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: [], difficultyMultiplier: 0.3 },
  { id: 'ex_50', name: 'Cable Woodchoppers', type: 'gym', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: [], difficultyMultiplier: 0.4 },

  // CARDIO
  { id: 'ex_51', name: 'Running', type: 'cardio', primaryMuscles: ['quads', 'calves'], secondaryMuscles: ['hamstrings', 'glutes'], difficultyMultiplier: 0.1 },
  { id: 'ex_52', name: 'Cycling', type: 'cardio', primaryMuscles: ['quads'], secondaryMuscles: ['calves', 'glutes'], difficultyMultiplier: 0.1 },
  { id: 'ex_53', name: 'Rowing', type: 'cardio', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps', 'quads'], difficultyMultiplier: 0.15 },
  { id: 'ex_54', name: 'Jump Rope', type: 'cardio', primaryMuscles: ['calves'], secondaryMuscles: ['quads'], difficultyMultiplier: 0.1 },

  // STRETCHING
  { id: 'ex_55', name: 'Yoga Routine', type: 'stretching', primaryMuscles: [], secondaryMuscles: [], difficultyMultiplier: 0.05 },
  { id: 'ex_56', name: 'Dynamic Stretching', type: 'stretching', primaryMuscles: [], secondaryMuscles: [], difficultyMultiplier: 0.05 },
  { id: 'ex_57', name: 'Foam Rolling', type: 'stretching', primaryMuscles: [], secondaryMuscles: [], difficultyMultiplier: 0.05 },
];
