import { MappedExercise } from '../types';

export const PREDEFINED_EXERCISES: MappedExercise[] = [
  // CHEST
  { id: 'ex_1', name: 'Barbell Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: 'ex_2', name: 'Dumbbell Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: 'ex_3', name: 'Incline Barbell Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: 'ex_4', name: 'Incline Dumbbell Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'] },
  { id: 'ex_5', name: 'Decline Bench Press', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'] },
  { id: 'ex_6', name: 'Chest Flyes (Dumbbell/Cable)', type: 'gym', primaryMuscles: ['chest'], secondaryMuscles: [] },
  { id: 'ex_7', name: 'Push-ups', type: 'calisthenics', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps', 'abs'] },
  { id: 'ex_8', name: 'Dips', type: 'calisthenics', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front_delts'] },

  // BACK
  { id: 'ex_9', name: 'Deadlift', type: 'gym', primaryMuscles: ['lower_back', 'glutes', 'hamstrings'], secondaryMuscles: ['lats', 'upper_back', 'quads', 'forearms'] },
  { id: 'ex_10', name: 'Pull-ups', type: 'calisthenics', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'] },
  { id: 'ex_11', name: 'Chin-ups', type: 'calisthenics', primaryMuscles: ['lats', 'biceps'], secondaryMuscles: ['upper_back'] },
  { id: 'ex_12', name: 'Lat Pulldown', type: 'gym', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'] },
  { id: 'ex_13', name: 'Barbell Row', type: 'gym', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps', 'lower_back'] },
  { id: 'ex_14', name: 'Dumbbell Row', type: 'gym', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'] },
  { id: 'ex_15', name: 'Seated Cable Row', type: 'gym', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps'] },
  { id: 'ex_16', name: 'T-Bar Row', type: 'gym', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps'] },
  { id: 'ex_17', name: 'Back Extension', type: 'gym', primaryMuscles: ['lower_back'], secondaryMuscles: ['glutes', 'hamstrings'] },

  // SHOULDERS
  { id: 'ex_18', name: 'Overhead Press (Barbell)', type: 'gym', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps', 'side_delts'] },
  { id: 'ex_19', name: 'Dumbbell Shoulder Press', type: 'gym', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps', 'side_delts'] },
  { id: 'ex_20', name: 'Lateral Raises', type: 'gym', primaryMuscles: ['side_delts'], secondaryMuscles: [] },
  { id: 'ex_21', name: 'Front Raises', type: 'gym', primaryMuscles: ['front_delts'], secondaryMuscles: [] },
  { id: 'ex_22', name: 'Face Pulls', type: 'gym', primaryMuscles: ['rear_delts'], secondaryMuscles: ['upper_back'] },
  { id: 'ex_23', name: 'Reverse Pec Deck', type: 'gym', primaryMuscles: ['rear_delts'], secondaryMuscles: ['upper_back'] },
  { id: 'ex_24', name: 'Barbell Shrugs', type: 'gym', primaryMuscles: ['upper_back'], secondaryMuscles: [] }, // Traps map to upper_back

  // ARMS
  { id: 'ex_25', name: 'Barbell Curl', type: 'gym', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'] },
  { id: 'ex_26', name: 'Dumbbell Curl', type: 'gym', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'] },
  { id: 'ex_27', name: 'Hammer Curl', type: 'gym', primaryMuscles: ['biceps', 'forearms'], secondaryMuscles: [] },
  { id: 'ex_28', name: 'Preacher Curl', type: 'gym', primaryMuscles: ['biceps'], secondaryMuscles: [] },
  { id: 'ex_29', name: 'Tricep Pushdown', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: [] },
  { id: 'ex_30', name: 'Overhead Tricep Extension', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: [] },
  { id: 'ex_31', name: 'Skullcrushers', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: [] },
  { id: 'ex_32', name: 'Close-Grip Bench Press', type: 'gym', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'front_delts'] },

  // LEGS - QUADS
  { id: 'ex_33', name: 'Barbell Squat', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'lower_back', 'abs'] },
  { id: 'ex_34', name: 'Front Squat', type: 'gym', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'abs'] },
  { id: 'ex_35', name: 'Leg Press', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'] },
  { id: 'ex_36', name: 'Leg Extension', type: 'gym', primaryMuscles: ['quads'], secondaryMuscles: [] },
  { id: 'ex_37', name: 'Bulgarian Split Squat', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'] },
  { id: 'ex_38', name: 'Lunges', type: 'gym', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'] },
  { id: 'ex_39', name: 'Pistol Squats', type: 'calisthenics', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'abs'] },

  // LEGS - POSTERIOR & CALVES
  { id: 'ex_40', name: 'Romanian Deadlift (RDL)', type: 'gym', primaryMuscles: ['hamstrings', 'glutes'], secondaryMuscles: ['lower_back'] },
  { id: 'ex_41', name: 'Leg Curl', type: 'gym', primaryMuscles: ['hamstrings'], secondaryMuscles: [] },
  { id: 'ex_42', name: 'Hip Thrust', type: 'gym', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'] },
  { id: 'ex_43', name: 'Glute Bridge', type: 'gym', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'] },
  { id: 'ex_44', name: 'Standing Calf Raise', type: 'gym', primaryMuscles: ['calves'], secondaryMuscles: [] },
  { id: 'ex_45', name: 'Seated Calf Raise', type: 'gym', primaryMuscles: ['calves'], secondaryMuscles: [] },

  // CORE
  { id: 'ex_46', name: 'Crunches', type: 'calisthenics', primaryMuscles: ['abs'], secondaryMuscles: [] },
  { id: 'ex_47', name: 'Plank', type: 'calisthenics', primaryMuscles: ['abs'], secondaryMuscles: ['lower_back', 'obliques'] },
  { id: 'ex_48', name: 'Hanging Leg Raises', type: 'calisthenics', primaryMuscles: ['abs'], secondaryMuscles: [] },
  { id: 'ex_49', name: 'Russian Twists', type: 'calisthenics', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: [] },
  { id: 'ex_50', name: 'Cable Woodchoppers', type: 'gym', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: [] },
];
