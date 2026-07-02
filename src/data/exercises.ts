import { MappedExercise } from '../types';

export const PREDEFINED_EXERCISES: MappedExercise[] = [
  {
    id: 'ex_1',
    name: "Barbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_2',
    name: "Dumbbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 0.9,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_3',
    name: "Incline Barbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.1,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_4',
    name: "Incline Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_5',
    name: "Decline Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 0.95,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_6',
    name: "Chest Flyes (Dumbbell/Cable)",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.65,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_7',
    name: "Push-ups",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps", "abs"],
    difficultyMultiplier: 0.7,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_8',
    name: "Dips",
    type: 'strength',
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 0.8,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_9',
    name: "Deadlift",
    type: 'strength',
    primaryMuscles: ["lower_back", "glutes", "hamstrings"],
    secondaryMuscles: ["lats", "upper_back", "quads", "forearms"],
    difficultyMultiplier: 1.2,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_10',
    name: "Pull-ups",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_11',
    name: "Chin-ups",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 0.95,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_12',
    name: "Lat Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 0.8,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_13',
    name: "Barbell Row",
    type: 'strength',
    primaryMuscles: ["lats", "upper_back"],
    secondaryMuscles: ["biceps", "lower_back"],
    difficultyMultiplier: 0.9,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_14',
    name: "Dumbbell Row",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 0.85,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_15',
    name: "Seated Cable Row",
    type: 'strength',
    primaryMuscles: ["lats", "upper_back"],
    secondaryMuscles: ["biceps"],
    difficultyMultiplier: 0.75,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_16',
    name: "T-Bar Row",
    type: 'strength',
    primaryMuscles: ["lats", "upper_back"],
    secondaryMuscles: ["biceps"],
    difficultyMultiplier: 0.95,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_17',
    name: "Back Extension",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 0.55,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_18',
    name: "Overhead Press (Barbell)",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps", "side_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_19',
    name: "Dumbbell Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps", "side_delts"],
    difficultyMultiplier: 0.9,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_20',
    name: "Lateral Raises",
    type: 'strength',
    primaryMuscles: ["side_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.35,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_21',
    name: "Front Raises",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.35,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_22',
    name: "Face Pulls",
    type: 'strength',
    primaryMuscles: ["rear_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 0.45,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_23',
    name: "Reverse Pec Deck",
    type: 'strength',
    primaryMuscles: ["rear_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 0.45,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_24',
    name: "Barbell Shrugs",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.7,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_25',
    name: "Barbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 0.5,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_26',
    name: "Dumbbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 0.45,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_27',
    name: "Hammer Curl",
    type: 'strength',
    primaryMuscles: ["biceps", "forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.45,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_28',
    name: "Preacher Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.5,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_29',
    name: "Tricep Pushdown",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.5,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_30',
    name: "Overhead Tricep Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.5,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_31',
    name: "Skullcrushers",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.5,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_32',
    name: "Close-Grip Bench Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 0.9,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_33',
    name: "Barbell Squat",
    type: 'strength',
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "lower_back", "abs"],
    difficultyMultiplier: 1.1,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_34',
    name: "Front Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "abs"],
    difficultyMultiplier: 1.2,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_35',
    name: "Leg Press",
    type: 'strength',
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 0.7,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_36',
    name: "Leg Extension",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.35,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_37',
    name: "Bulgarian Split Squat",
    type: 'strength',
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 0.9,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_38',
    name: "Lunges",
    type: 'strength',
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 0.8,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_39',
    name: "Pistol Squats",
    type: 'strength',
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "abs"],
    difficultyMultiplier: 0.9,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_40',
    name: "Romanian Deadlift (RDL)",
    type: 'strength',
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_41',
    name: "Leg Curl",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.35,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_42',
    name: "Hip Thrust",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 0.8,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_43',
    name: "Glute Bridge",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 0.6,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_44',
    name: "Standing Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.4,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_45',
    name: "Seated Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.3,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_46',
    name: "Crunches",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.2,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_47',
    name: "Plank",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["lower_back", "obliques"],
    difficultyMultiplier: 0.2,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_48',
    name: "Hanging Leg Raises",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.4,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_49',
    name: "Russian Twists",
    type: 'strength',
    primaryMuscles: ["obliques", "abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.3,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_50',
    name: "Cable Woodchoppers",
    type: 'strength',
    primaryMuscles: ["obliques", "abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 0.4,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_51',
    name: "Running",
    type: 'cardio',
    primaryMuscles: ["quads", "calves"],
    secondaryMuscles: ["hamstrings", "glutes"],
    difficultyMultiplier: 0.1,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_52',
    name: "Cycling",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes"],
    difficultyMultiplier: 0.1,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_53',
    name: "Rowing",
    type: 'cardio',
    primaryMuscles: ["lats", "upper_back"],
    secondaryMuscles: ["biceps", "quads"],
    difficultyMultiplier: 0.15,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_54',
    name: "Jump Rope",
    type: 'cardio',
    primaryMuscles: ["calves"],
    secondaryMuscles: ["quads"],
    difficultyMultiplier: 0.1,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_55',
    name: "Yoga Routine",
    type: 'stretching',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 0.05,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_56',
    name: "Dynamic Stretching",
    type: 'stretching',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 0.05,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_57',
    name: "Foam Rolling",
    type: 'stretching',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 0.05,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_58',
    name: "3/4 Sit-Up",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_59',
    name: "90/90 Hamstring",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_60',
    name: "Ab Crunch Machine",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_61',
    name: "Ab Roller",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_62',
    name: "Adductor",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_63',
    name: "Adductor/Groin",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_64',
    name: "Advanced Kettlebell Windmill",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_65',
    name: "Air Bike",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_66',
    name: "All Fours Quad Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_67',
    name: "Alternate Hammer Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_68',
    name: "Alternate Heel Touchers",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_69',
    name: "Alternate Incline Dumbbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_70',
    name: "Alternate Leg Diagonal Bound",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_71',
    name: "Alternating Cable Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_72',
    name: "Alternating Deltoid Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_73',
    name: "Alternating Floor Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_74',
    name: "Alternating Hang Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["biceps", "calves", "forearms", "glutes", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_75',
    name: "Alternating Kettlebell Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_76',
    name: "Alternating Kettlebell Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_77',
    name: "Alternating Renegade Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["abs", "biceps", "chest", "lats", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_78',
    name: "Ankle Circles",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_79',
    name: "Ankle On The Knee",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_80',
    name: "Anterior Tibialis-SMR",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_81',
    name: "Anti-Gravity Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_82',
    name: "Arm Circles",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_83',
    name: "Arnold Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_84',
    name: "Around The Worlds",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_85',
    name: "Atlas Stone Trainer",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["biceps", "forearms", "glutes", "hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_86',
    name: "Atlas Stones",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["abs", "quads", "biceps", "calves", "forearms", "glutes", "hamstrings", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_87',
    name: "Axle Deadlift",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_88',
    name: "Back Flyes - With Bands",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_89',
    name: "Backward Drag",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "forearms", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_90',
    name: "Backward Medicine Ball Throw",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_91',
    name: "Balance Board",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: ["hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_92',
    name: "Ball Leg Curl",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_93',
    name: "Band Assisted Pull-Up",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["abs", "forearms", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_94',
    name: "Band Good Morning",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_95',
    name: "Band Good Morning (Pull Through)",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_96',
    name: "Band Hip Adductions",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_97',
    name: "Band Pull Apart",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_98',
    name: "Band Skull Crusher",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_99',
    name: "Barbell Ab Rollout",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["lower_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_100',
    name: "Barbell Ab Rollout - On Knees",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["lower_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_101',
    name: "Barbell Bench Press - Medium Grip",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_102',
    name: "Barbell Curls Lying Against An Incline",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_103',
    name: "Barbell Deadlift",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["calves", "forearms", "glutes", "hamstrings", "lats", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_104',
    name: "Barbell Full Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_105',
    name: "Barbell Glute Bridge",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_106',
    name: "Barbell Guillotine Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_107',
    name: "Barbell Hack Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "forearms", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_108',
    name: "Barbell Hip Thrust",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_109',
    name: "Barbell Incline Bench Press - Medium Grip",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_110',
    name: "Barbell Incline Shoulder Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_111',
    name: "Barbell Lunge",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_112',
    name: "Barbell Rear Delt Row",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps", "lats", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_113',
    name: "Barbell Rollout from Bench",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "hamstrings", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_114',
    name: "Barbell Seated Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_115',
    name: "Barbell Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_116',
    name: "Barbell Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_117',
    name: "Barbell Shrug Behind The Back",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_118',
    name: "Barbell Side Bend",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_119',
    name: "Barbell Side Split Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_120',
    name: "Barbell Squat To A Bench",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_121',
    name: "Barbell Step Ups",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_122',
    name: "Barbell Walking Lunge",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_123',
    name: "Battling Ropes",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest", "forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_124',
    name: "Bear Crawl Sled Drags",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_125',
    name: "Behind Head Chest Stretch",
    type: 'stretching',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_126',
    name: "Bench Dips",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_127',
    name: "Bench Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_128',
    name: "Bench Press - Powerlifting",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "forearms", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_129',
    name: "Bench Press - With Bands",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_130',
    name: "Bench Press with Chains",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_131',
    name: "Bench Sprint",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_132',
    name: "Bent-Arm Barbell Pullover",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["chest", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_133',
    name: "Bent-Arm Dumbbell Pullover",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["lats", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_134',
    name: "Bent-Knee Hip Raise",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_135',
    name: "Bent Over Barbell Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_136',
    name: "Bent Over Dumbbell Rear Delt Raise With Head On Bench",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_137',
    name: "Bent Over Low-Pulley Side Lateral",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["lower_back", "upper_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_138',
    name: "Bent Over One-Arm Long Bar Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_139',
    name: "Bent Over Two-Arm Long Bar Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_140',
    name: "Bent Over Two-Dumbbell Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_141',
    name: "Bent Over Two-Dumbbell Row With Palms In",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_142',
    name: "Bent Press",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "hamstrings", "lower_back", "quads", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_143',
    name: "Bicycling",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_144',
    name: "Bicycling, Stationary",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_145',
    name: "Board Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "forearms", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_146',
    name: "Body-Up",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["abs", "forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_147',
    name: "Body Tricep Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_148',
    name: "Bodyweight Flyes",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_149',
    name: "Bodyweight Mid Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_150',
    name: "Bodyweight Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_151',
    name: "Bodyweight Walking Lunge",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_152',
    name: "Bosu Ball Cable Crunch With Side Bends",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_153',
    name: "Bottoms-Up Clean From The Hang Position",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: ["biceps", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_154',
    name: "Bottoms Up",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_155',
    name: "Box Jump (Multiple Response)",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_156',
    name: "Box Skip",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_157',
    name: "Box Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_158',
    name: "Box Squat with Bands",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_159',
    name: "Box Squat with Chains",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_160',
    name: "Brachialis-SMR",
    type: 'stretching',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_161',
    name: "Bradford/Rocky Presses",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_162',
    name: "Butt-Ups",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_163',
    name: "Butt Lift (Bridge)",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_164',
    name: "Butterfly",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_165',
    name: "Cable Chest Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_166',
    name: "Cable Crossover",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_167',
    name: "Cable Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_168',
    name: "Cable Deadlifts",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_169',
    name: "Cable Hammer Curls - Rope Attachment",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_170',
    name: "Cable Hip Adduction",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_171',
    name: "Cable Incline Pushdown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_172',
    name: "Cable Incline Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_173',
    name: "Cable Internal Rotation",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_174',
    name: "Cable Iron Cross",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_175',
    name: "Cable Judo Flip",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_176',
    name: "Cable Lying Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_177',
    name: "Cable One Arm Tricep Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_178',
    name: "Cable Preacher Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_179',
    name: "Cable Rear Delt Fly",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_180',
    name: "Cable Reverse Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_181',
    name: "Cable Rope Overhead Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_182',
    name: "Cable Rope Rear-Delt Rows",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_183',
    name: "Cable Russian Twists",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_184',
    name: "Cable Seated Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_185',
    name: "Cable Seated Lateral Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_186',
    name: "Cable Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_187',
    name: "Cable Shrugs",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_188',
    name: "Cable Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_189',
    name: "Calf-Machine Shoulder Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_190',
    name: "Calf Press",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_191',
    name: "Calf Press On The Leg Press Machine",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_192',
    name: "Calf Raise On A Dumbbell",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_193',
    name: "Calf Raises - With Bands",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_194',
    name: "Calf Stretch Elbows Against Wall",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_195',
    name: "Calf Stretch Hands Against Wall",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_196',
    name: "Calves-SMR",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_197',
    name: "Car Deadlift",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_198',
    name: "Car Drivers",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_199',
    name: "Carioca Quick Step",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_200',
    name: "Cat Stretch",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["upper_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_201',
    name: "Catch and Overhead Throw",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["abs", "chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_202',
    name: "Chain Handle Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_203',
    name: "Chain Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_204',
    name: "Chair Leg Extended Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_205',
    name: "Chair Lower Back Stretch",
    type: 'stretching',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_206',
    name: "Chair Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_207',
    name: "Chair Upper Body Stretch",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps", "chest"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_208',
    name: "Chest And Front Of Shoulder Stretch",
    type: 'stretching',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_209',
    name: "Chest Push from 3 point stance",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_210',
    name: "Chest Push (multiple response)",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_211',
    name: "Chest Push (single response)",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_212',
    name: "Chest Push with Run Release",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_213',
    name: "Chest Stretch on Stability Ball",
    type: 'stretching',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_214',
    name: "Child's Pose",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_215',
    name: "Chin-Up",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "forearms", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_216',
    name: "Chin To Chest Stretch",
    type: 'stretching',
    primaryMuscles: [],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_217',
    name: "Circus Bell",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "lower_back", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_218',
    name: "Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "forearms", "glutes", "lower_back", "quads", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_219',
    name: "Clean Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["forearms", "glutes", "lower_back", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_220',
    name: "Clean Pull",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_221',
    name: "Clean Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["forearms", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_222',
    name: "Clean and Jerk",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "glutes", "hamstrings", "lower_back", "quads", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_223',
    name: "Clean and Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "calves", "glutes", "hamstrings", "lower_back", "upper_back", "quads", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_224',
    name: "Clean from Blocks",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_225',
    name: "Clock Push-Up",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_226',
    name: "Close-Grip Barbell Bench Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_227',
    name: "Close-Grip Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_228',
    name: "Close-Grip EZ-Bar Curl with Band",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_229',
    name: "Close-Grip EZ-Bar Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_230',
    name: "Close-Grip EZ Bar Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_231',
    name: "Close-Grip Front Lat Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_232',
    name: "Close-Grip Push-Up off of a Dumbbell",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["abs", "chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_233',
    name: "Close-Grip Standing Barbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_234',
    name: "Cocoons",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_235',
    name: "Conan's Wheel",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "biceps", "calves", "forearms", "lower_back", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_236',
    name: "Concentration Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_237',
    name: "Cross-Body Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_238',
    name: "Cross Body Hammer Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_239',
    name: "Cross Over - With Bands",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["biceps", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_240',
    name: "Crossover Reverse Lunge",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["abs", "glutes", "glutes", "hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_241',
    name: "Crucifix",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_242',
    name: "Crunch - Hands Overhead",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_243',
    name: "Crunch - Legs On Exercise Ball",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_244',
    name: "Cuban Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_245',
    name: "Dancer's Stretch",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_246',
    name: "Dead Bug",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_247',
    name: "Deadlift with Bands",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_248',
    name: "Deadlift with Chains",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_249',
    name: "Decline Barbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_250',
    name: "Decline Close-Grip Bench To Skull Crusher",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_251',
    name: "Decline Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_252',
    name: "Decline Dumbbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_253',
    name: "Decline Dumbbell Flyes",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_254',
    name: "Decline Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_255',
    name: "Decline EZ Bar Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_256',
    name: "Decline Oblique Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_257',
    name: "Decline Push-Up",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_258',
    name: "Decline Reverse Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_259',
    name: "Decline Smith Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_260',
    name: "Deficit Deadlift",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_261',
    name: "Depth Jump Leap",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_262',
    name: "Dip Machine",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_263',
    name: "Dips - Chest Version",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_264',
    name: "Dips - Triceps Version",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_265',
    name: "Donkey Calf Raises",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_266',
    name: "Double Kettlebell Alternating Hang Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["biceps", "calves", "forearms", "glutes", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_267',
    name: "Double Kettlebell Jerk",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_268',
    name: "Double Kettlebell Push Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_269',
    name: "Double Kettlebell Snatch",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["glutes", "hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_270',
    name: "Double Kettlebell Windmill",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "hamstrings", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_271',
    name: "Double Leg Butt Kick",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_272',
    name: "Downward Facing Balance",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["abs", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_273',
    name: "Drag Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_274',
    name: "Drop Push",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_275',
    name: "Dumbbell Alternate Bicep Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_276',
    name: "Dumbbell Bench Press with Neutral Grip",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_277',
    name: "Dumbbell Bicep Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_278',
    name: "Dumbbell Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "forearms", "glutes", "lower_back", "quads", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_279',
    name: "Dumbbell Floor Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_280',
    name: "Dumbbell Flyes",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_281',
    name: "Dumbbell Incline Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "forearms", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_282',
    name: "Dumbbell Incline Shoulder Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_283',
    name: "Dumbbell Lunges",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_284',
    name: "Dumbbell Lying One-Arm Rear Lateral Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_285',
    name: "Dumbbell Lying Pronation",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_286',
    name: "Dumbbell Lying Rear Lateral Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_287',
    name: "Dumbbell Lying Supination",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_288',
    name: "Dumbbell One-Arm Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_289',
    name: "Dumbbell One-Arm Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_290',
    name: "Dumbbell One-Arm Upright Row",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_291',
    name: "Dumbbell Prone Incline Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_292',
    name: "Dumbbell Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_293',
    name: "Dumbbell Rear Lunge",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_294',
    name: "Dumbbell Scaption",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_295',
    name: "Dumbbell Seated Box Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_296',
    name: "Dumbbell Seated One-Leg Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_297',
    name: "Dumbbell Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_298',
    name: "Dumbbell Side Bend",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_299',
    name: "Dumbbell Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_300',
    name: "Dumbbell Squat To A Bench",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_301',
    name: "Dumbbell Step Ups",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_302',
    name: "Dumbbell Tricep Extension -Pronated Grip",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_303',
    name: "Dynamic Back Stretch",
    type: 'stretching',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_304',
    name: "Dynamic Chest Stretch",
    type: 'stretching',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_305',
    name: "EZ-Bar Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_306',
    name: "EZ-Bar Skullcrusher",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_307',
    name: "Elbow Circles",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_308',
    name: "Elbow to Knee",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_309',
    name: "Elbows Back",
    type: 'stretching',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_310',
    name: "Elevated Back Lunge",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_311',
    name: "Elevated Cable Rows",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["upper_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_312',
    name: "Elliptical Trainer",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_313',
    name: "Exercise Ball Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_314',
    name: "Exercise Ball Pull-In",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_315',
    name: "Extended Range One-Arm Kettlebell Floor Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_316',
    name: "External Rotation",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_317',
    name: "External Rotation with Band",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_318',
    name: "External Rotation with Cable",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_319',
    name: "Face Pull",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_320',
    name: "Farmer's Walk",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: ["abs", "glutes", "hamstrings", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_321',
    name: "Fast Skipping",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_322',
    name: "Finger Curls",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_323',
    name: "Flat Bench Cable Flyes",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_324',
    name: "Flat Bench Leg Pull-In",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_325',
    name: "Flat Bench Lying Leg Raise",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_326',
    name: "Flexor Incline Dumbbell Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_327',
    name: "Floor Glute-Ham Raise",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_328',
    name: "Floor Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_329',
    name: "Floor Press with Chains",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_330',
    name: "Flutter Kicks",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_331',
    name: "Foot-SMR",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_332',
    name: "Forward Drag with Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "quads", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_333',
    name: "Frankenstein Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_334',
    name: "Freehand Jump Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_335',
    name: "Frog Hops",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_336',
    name: "Frog Sit-Ups",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_337',
    name: "Front Barbell Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_338',
    name: "Front Barbell Squat To A Bench",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_339',
    name: "Front Box Jump",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_340',
    name: "Front Cable Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_341',
    name: "Front Cone Hops (or hurdle hops)",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_342',
    name: "Front Dumbbell Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_343',
    name: "Front Incline Dumbbell Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_344',
    name: "Front Leg Raises",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_345',
    name: "Front Plate Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_346',
    name: "Front Raise And Pullover",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["lats", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_347',
    name: "Front Squat (Clean Grip)",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_348',
    name: "Front Squats With Two Kettlebells",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_349',
    name: "Front Two-Dumbbell Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_350',
    name: "Full Range-Of-Motion Lat Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_351',
    name: "Gironda Sternum Chins",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_352',
    name: "Glute Ham Raise",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_353',
    name: "Glute Kickback",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_354',
    name: "Goblet Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_355',
    name: "Good Morning",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["abs", "glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_356',
    name: "Good Morning off Pins",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["abs", "glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_357',
    name: "Gorilla Chin/Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_358',
    name: "Groin and Back Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_359',
    name: "Groiners",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_360',
    name: "Hack Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_361',
    name: "Hammer Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_362',
    name: "Hammer Grip Incline DB Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_363',
    name: "Hamstring-SMR",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_364',
    name: "Hamstring Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_365',
    name: "Handstand Push-Ups",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_366',
    name: "Hang Clean",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "forearms", "glutes", "hamstrings", "lower_back", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_367',
    name: "Hang Clean - Below the Knees",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "forearms", "glutes", "hamstrings", "lower_back", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_368',
    name: "Hang Snatch",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["abs", "calves", "forearms", "glutes", "lower_back", "quads", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_369',
    name: "Hang Snatch - Below Knees",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["abs", "calves", "forearms", "glutes", "lower_back", "quads", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_370',
    name: "Hanging Bar Good Morning",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["abs", "glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_371',
    name: "Hanging Leg Raise",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_372',
    name: "Hanging Pike",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_373',
    name: "Heaving Snatch Balance",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "forearms", "glutes", "hamstrings", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_374',
    name: "Heavy Bag Thrust",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_375',
    name: "High Cable Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_376',
    name: "Hip Circles (prone)",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_377',
    name: "Hip Extension with Bands",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_378',
    name: "Hip Flexion with Band",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_379',
    name: "Hip Lift with Band",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_380',
    name: "Hug A Ball",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["calves", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_381',
    name: "Hug Knees To Chest",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_382',
    name: "Hurdle Hops",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "calves", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_383',
    name: "Hyperextensions (Back Extensions)",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_384',
    name: "Hyperextensions With No Hyperextension Bench",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_385',
    name: "IT Band and Glute Stretch",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_386',
    name: "Iliotibial Tract-SMR",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_387',
    name: "Inchworm",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_388',
    name: "Incline Barbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_389',
    name: "Incline Bench Pull",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_390',
    name: "Incline Cable Chest Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_391',
    name: "Incline Cable Flye",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_392',
    name: "Incline Dumbbell Bench With Palms Facing In",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_393',
    name: "Incline Dumbbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_394',
    name: "Incline Dumbbell Flyes",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_395',
    name: "Incline Dumbbell Flyes - With A Twist",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_396',
    name: "Incline Hammer Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_397',
    name: "Incline Inner Biceps Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_398',
    name: "Incline Push-Up",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_399',
    name: "Incline Push-Up Close-Grip",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_400',
    name: "Incline Push-Up Depth Jump",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_401',
    name: "Incline Push-Up Medium",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_402',
    name: "Incline Push-Up Reverse Grip",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_403',
    name: "Incline Push-Up Wide",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_404',
    name: "Intermediate Groin Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_405',
    name: "Intermediate Hip Flexor and Quad Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_406',
    name: "Internal Rotation with Band",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_407',
    name: "Inverted Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_408',
    name: "Inverted Row with Straps",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_409',
    name: "Iron Cross",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest", "glutes", "hamstrings", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_410',
    name: "Iron Crosses (stretch)",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_411',
    name: "Isometric Chest Squeezes",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_412',
    name: "Isometric Neck Exercise - Front And Back",
    type: 'strength',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_413',
    name: "Isometric Neck Exercise - Sides",
    type: 'strength',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_414',
    name: "Isometric Wipers",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_415',
    name: "JM Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_416',
    name: "Jackknife Sit-Up",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_417',
    name: "Janda Sit-Up",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_418',
    name: "Jefferson Squats",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_419',
    name: "Jerk Balance",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["glutes", "hamstrings", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_420',
    name: "Jerk Dip Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_421',
    name: "Jogging, Treadmill",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_422',
    name: "Keg Load",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["abs", "biceps", "calves", "forearms", "glutes", "hamstrings", "upper_back", "quads", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_423',
    name: "Kettlebell Arnold Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_424',
    name: "Kettlebell Dead Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_425',
    name: "Kettlebell Figure 8",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_426',
    name: "Kettlebell Hang Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "lower_back", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_427',
    name: "Kettlebell One-Legged Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_428',
    name: "Kettlebell Pass Between The Legs",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_429',
    name: "Kettlebell Pirate Ships",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_430',
    name: "Kettlebell Pistol Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_431',
    name: "Kettlebell Seated Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_432',
    name: "Kettlebell Seesaw Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_433',
    name: "Kettlebell Sumo High Pull",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["quads", "glutes", "hamstrings", "quads", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_434',
    name: "Kettlebell Thruster",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_435',
    name: "Kettlebell Turkish Get-Up (Lunge style)",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "hamstrings", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_436',
    name: "Kettlebell Turkish Get-Up (Squat style)",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "calves", "hamstrings", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_437',
    name: "Kettlebell Windmill",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "hamstrings", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_438',
    name: "Kipping Muscle Up",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["abs", "biceps", "forearms", "upper_back", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_439',
    name: "Knee Across The Body",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_440',
    name: "Knee Circles",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: ["hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_441',
    name: "Knee/Hip Raise On Parallel Bars",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_442',
    name: "Knee Tuck Jump",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_443',
    name: "Kneeling Arm Drill",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_444',
    name: "Kneeling Cable Crunch With Alternating Oblique Twists",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_445',
    name: "Kneeling Cable Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_446',
    name: "Kneeling Forearm Stretch",
    type: 'stretching',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_447',
    name: "Kneeling High Pulley Row",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_448',
    name: "Kneeling Hip Flexor",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_449',
    name: "Kneeling Jump Squat",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["calves", "hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_450',
    name: "Kneeling Single-Arm High Pulley Row",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_451',
    name: "Kneeling Squat",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["abs", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_452',
    name: "Landmine 180's",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "lower_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_453',
    name: "Landmine Linear Jammer",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "calves", "chest", "hamstrings", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_454',
    name: "Lateral Bound",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_455',
    name: "Lateral Box Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_456',
    name: "Lateral Cone Hops",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_457',
    name: "Lateral Raise - With Bands",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_458',
    name: "Latissimus Dorsi-SMR",
    type: 'stretching',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_459',
    name: "Leg-Over Floor Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_460',
    name: "Leg-Up Hamstring Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_461',
    name: "Leg Extensions",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_462',
    name: "Leg Lift",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_463',
    name: "Leg Pull-In",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_464',
    name: "Leverage Chest Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_465',
    name: "Leverage Deadlift",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_466',
    name: "Leverage Decline Chest Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_467',
    name: "Leverage High Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_468',
    name: "Leverage Incline Chest Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_469',
    name: "Leverage Iso Row",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_470',
    name: "Leverage Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_471',
    name: "Leverage Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_472',
    name: "Linear 3-Part Start Technique",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_473',
    name: "Linear Acceleration Wall Drill",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_474',
    name: "Linear Depth Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_475',
    name: "Log Lift",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "chest", "glutes", "hamstrings", "lower_back", "upper_back", "quads", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_476',
    name: "London Bridges",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "forearms", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_477',
    name: "Looking At Ceiling",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_478',
    name: "Low Cable Crossover",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_479',
    name: "Low Cable Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_480',
    name: "Low Pulley Row To Neck",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps", "upper_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_481',
    name: "Lower Back-SMR",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_482',
    name: "Lower Back Curl",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_483',
    name: "Lunge Pass Through",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_484',
    name: "Lunge Sprint",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_485',
    name: "Lying Bent Leg Groin",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_486',
    name: "Lying Cable Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_487',
    name: "Lying Cambered Barbell Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_488',
    name: "Lying Close-Grip Bar Curl On High Pulley",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_489',
    name: "Lying Close-Grip Barbell Triceps Extension Behind The Head",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_490',
    name: "Lying Close-Grip Barbell Triceps Press To Chin",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_491',
    name: "Lying Crossover",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_492',
    name: "Lying Dumbbell Tricep Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_493',
    name: "Lying Face Down Plate Neck Resistance",
    type: 'strength',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_494',
    name: "Lying Face Up Plate Neck Resistance",
    type: 'strength',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_495',
    name: "Lying Glute",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_496',
    name: "Lying Hamstring",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_497',
    name: "Lying High Bench Barbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_498',
    name: "Lying Leg Curls",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_499',
    name: "Lying Machine Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_500',
    name: "Lying One-Arm Lateral Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_501',
    name: "Lying Prone Quadriceps",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_502',
    name: "Lying Rear Delt Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_503',
    name: "Lying Supine Dumbbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_504',
    name: "Lying T-Bar Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_505',
    name: "Lying Triceps Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_506',
    name: "Machine Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_507',
    name: "Machine Bicep Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_508',
    name: "Machine Preacher Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_509',
    name: "Machine Shoulder (Military) Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_510',
    name: "Machine Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_511',
    name: "Medicine Ball Chest Pass",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_512',
    name: "Medicine Ball Full Twist",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_513',
    name: "Medicine Ball Scoop Throw",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_514',
    name: "Middle Back Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_515',
    name: "Middle Back Stretch",
    type: 'stretching',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["abs", "lats", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_516',
    name: "Mixed Grip Chin",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_517',
    name: "Monster Walk",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_518',
    name: "Mountain Climbers",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["chest", "hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_519',
    name: "Moving Claw Series",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_520',
    name: "Muscle Snatch",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back", "quads", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_521',
    name: "Muscle Up",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["abs", "biceps", "forearms", "upper_back", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_522',
    name: "Narrow Stance Hack Squats",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_523',
    name: "Narrow Stance Leg Press",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_524',
    name: "Narrow Stance Squats",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_525',
    name: "Natural Glute Ham Raise",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_526',
    name: "Neck-SMR",
    type: 'stretching',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_527',
    name: "Neck Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_528',
    name: "Oblique Crunches",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_529',
    name: "Oblique Crunches - On The Floor",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_530',
    name: "Olympic Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_531',
    name: "On-Your-Back Quad Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_532',
    name: "On Your Side Quad Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_533',
    name: "One-Arm Dumbbell Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_534',
    name: "One-Arm Flat Bench Dumbbell Flye",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_535',
    name: "One-Arm High-Pulley Cable Side Bends",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_536',
    name: "One-Arm Incline Lateral Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_537',
    name: "One-Arm Kettlebell Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_538',
    name: "One-Arm Kettlebell Clean and Jerk",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_539',
    name: "One-Arm Kettlebell Floor Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_540',
    name: "One-Arm Kettlebell Jerk",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_541',
    name: "One-Arm Kettlebell Military Press To The Side",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_542',
    name: "One-Arm Kettlebell Para Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_543',
    name: "One-Arm Kettlebell Push Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_544',
    name: "One-Arm Kettlebell Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_545',
    name: "One-Arm Kettlebell Snatch",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_546',
    name: "One-Arm Kettlebell Split Jerk",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["glutes", "hamstrings", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_547',
    name: "One-Arm Kettlebell Split Snatch",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_548',
    name: "One-Arm Kettlebell Swings",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "lower_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_549',
    name: "One-Arm Long Bar Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_550',
    name: "One-Arm Medicine Ball Slam",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_551',
    name: "One-Arm Open Palm Kettlebell Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["forearms", "glutes", "lower_back", "quads", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_552',
    name: "One-Arm Overhead Kettlebell Squats",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_553',
    name: "One-Arm Side Deadlift",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "calves", "glutes", "hamstrings", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_554',
    name: "One-Arm Side Laterals",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_555',
    name: "One-Legged Cable Kickback",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_556',
    name: "One Arm Against Wall",
    type: 'stretching',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_557',
    name: "One Arm Chin-Up",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "forearms", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_558',
    name: "One Arm Dumbbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_559',
    name: "One Arm Dumbbell Preacher Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_560',
    name: "One Arm Floor Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_561',
    name: "One Arm Lat Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_562',
    name: "One Arm Pronated Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_563',
    name: "One Arm Supinated Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_564',
    name: "One Half Locust",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "biceps", "chest"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_565',
    name: "One Handed Hang",
    type: 'stretching',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_566',
    name: "One Knee To Chest",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_567',
    name: "One Leg Barbell Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_568',
    name: "Open Palm Kettlebell Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back", "quads", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_569',
    name: "Otis-Up",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_570',
    name: "Overhead Cable Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_571',
    name: "Overhead Lat",
    type: 'stretching',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_572',
    name: "Overhead Slam",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_573',
    name: "Overhead Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "calves", "glutes", "hamstrings", "lower_back", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_574',
    name: "Overhead Stretch",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "forearms", "lats", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_575',
    name: "Overhead Triceps",
    type: 'stretching',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_576',
    name: "Pallof Press",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_577',
    name: "Pallof Press With Rotation",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_578',
    name: "Palms-Down Dumbbell Wrist Curl Over A Bench",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_579',
    name: "Palms-Down Wrist Curl Over A Bench",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_580',
    name: "Palms-Up Barbell Wrist Curl Over A Bench",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_581',
    name: "Palms-Up Dumbbell Wrist Curl Over A Bench",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_582',
    name: "Parallel Bar Dip",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_583',
    name: "Pelvic Tilt Into Bridge",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_584',
    name: "Peroneals-SMR",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_585',
    name: "Peroneals Stretch",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_586',
    name: "Physioball Hip Bridge",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_587',
    name: "Pin Presses",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "forearms", "lats", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_588',
    name: "Piriformis-SMR",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_589',
    name: "Plate Pinch",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_590',
    name: "Plate Twist",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_591',
    name: "Platform Hamstring Slides",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_592',
    name: "Plie Dumbbell Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_593',
    name: "Plyo Kettlebell Pushups",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_594',
    name: "Plyo Push-up",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_595',
    name: "Posterior Tibialis Stretch",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_596',
    name: "Power Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "forearms", "glutes", "lower_back", "upper_back", "quads", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_597',
    name: "Power Clean from Blocks",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_598',
    name: "Power Jerk",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "calves", "glutes", "hamstrings", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_599',
    name: "Power Partials",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_600',
    name: "Power Snatch",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "lower_back", "quads", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_601',
    name: "Power Snatch from Blocks",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "forearms", "glutes", "hamstrings", "lower_back", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_602',
    name: "Power Stairs",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quads", "calves", "glutes", "lower_back", "quads", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_603',
    name: "Preacher Hammer Dumbbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_604',
    name: "Press Sit-Up",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_605',
    name: "Prone Manual Hamstring",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_606',
    name: "Prowler Sprint",
    type: 'cardio',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "chest", "glutes", "quads", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_607',
    name: "Pull Through",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_608',
    name: "Pullups",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_609',
    name: "Push-Up Wide",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_610',
    name: "Push-Ups - Close Triceps Position",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_611',
    name: "Push-Ups With Feet Elevated",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_612',
    name: "Push-Ups With Feet On An Exercise Ball",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_613',
    name: "Push Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_614',
    name: "Push Press - Behind the Neck",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_615',
    name: "Push Up to Side Plank",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["abs", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_616',
    name: "Pushups",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_617',
    name: "Pushups (Close and Wide Hand Positions)",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_618',
    name: "Pyramid",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_619',
    name: "Quad Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_620',
    name: "Quadriceps-SMR",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_621',
    name: "Quick Leap",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_622',
    name: "Rack Delivery",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["forearms", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_623',
    name: "Rack Pull with Bands",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_624',
    name: "Rack Pulls",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_625',
    name: "Rear Leg Raises",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_626',
    name: "Recumbent Bike",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_627',
    name: "Return Push from Stance",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_628',
    name: "Reverse Band Bench Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "forearms", "lats", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_629',
    name: "Reverse Band Box Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "forearms", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_630',
    name: "Reverse Band Deadlift",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "quads", "calves", "glutes", "hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_631',
    name: "Reverse Band Power Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_632',
    name: "Reverse Band Sumo Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "calves", "forearms", "glutes", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_633',
    name: "Reverse Barbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_634',
    name: "Reverse Barbell Preacher Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_635',
    name: "Reverse Cable Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_636',
    name: "Reverse Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_637',
    name: "Reverse Flyes",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_638',
    name: "Reverse Flyes With External Rotation",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_639',
    name: "Reverse Grip Bent-Over Rows",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_640',
    name: "Reverse Grip Triceps Pushdown",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_641',
    name: "Reverse Hyperextension",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_642',
    name: "Reverse Machine Flyes",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_643',
    name: "Reverse Plate Curls",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_644',
    name: "Reverse Triceps Bench Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_645',
    name: "Rhomboids-SMR",
    type: 'stretching',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_646',
    name: "Rickshaw Carry",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: ["abs", "calves", "glutes", "hamstrings", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_647',
    name: "Rickshaw Deadlift",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["forearms", "glutes", "hamstrings", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_648',
    name: "Ring Dips",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_649',
    name: "Rocket Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_650',
    name: "Rocking Standing Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_651',
    name: "Rocky Pull-Ups/Pulldowns",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_652',
    name: "Romanian Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_653',
    name: "Romanian Deadlift from Deficit",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["forearms", "glutes", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_654',
    name: "Rope Climb",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "forearms", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_655',
    name: "Rope Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_656',
    name: "Rope Jumping",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_657',
    name: "Rope Straight-Arm Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_658',
    name: "Round The World Shoulder Stretch",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps", "chest"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_659',
    name: "Rowing, Stationary",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["biceps", "calves", "glutes", "hamstrings", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_660',
    name: "Runner's Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_661',
    name: "Running, Treadmill",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_662',
    name: "Russian Twist",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_663',
    name: "Sandbag Load",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "biceps", "calves", "forearms", "glutes", "hamstrings", "lower_back", "upper_back", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_664',
    name: "Scapular Pull-Up",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_665',
    name: "Scissor Kick",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_666',
    name: "Scissors Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_667',
    name: "Seated Band Hamstring Curl",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_668',
    name: "Seated Barbell Military Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_669',
    name: "Seated Barbell Twist",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_670',
    name: "Seated Bent-Over One-Arm Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_671',
    name: "Seated Bent-Over Rear Delt Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_672',
    name: "Seated Bent-Over Two-Arm Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_673',
    name: "Seated Biceps",
    type: 'stretching',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_674',
    name: "Seated Cable Rows",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_675',
    name: "Seated Cable Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_676',
    name: "Seated Calf Stretch",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: ["hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_677',
    name: "Seated Close-Grip Concentration Barbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_678',
    name: "Seated Dumbbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_679',
    name: "Seated Dumbbell Inner Biceps Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_680',
    name: "Seated Dumbbell Palms-Down Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_681',
    name: "Seated Dumbbell Palms-Up Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_682',
    name: "Seated Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_683',
    name: "Seated Flat Bench Leg Pull-In",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_684',
    name: "Seated Floor Hamstring Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_685',
    name: "Seated Front Deltoid",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_686',
    name: "Seated Glute",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_687',
    name: "Seated Good Mornings",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_688',
    name: "Seated Hamstring",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_689',
    name: "Seated Hamstring and Calf Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_690',
    name: "Seated Head Harness Neck Resistance",
    type: 'strength',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_691',
    name: "Seated Leg Curl",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_692',
    name: "Seated Leg Tucks",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_693',
    name: "Seated One-Arm Dumbbell Palms-Down Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_694',
    name: "Seated One-Arm Dumbbell Palms-Up Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_695',
    name: "Seated One-arm Cable Pulley Rows",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_696',
    name: "Seated Overhead Stretch",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_697',
    name: "Seated Palm-Up Barbell Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_698',
    name: "Seated Palms-Down Barbell Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_699',
    name: "Seated Side Lateral Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_700',
    name: "Seated Triceps Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_701',
    name: "Seated Two-Arm Palms-Up Low-Pulley Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_702',
    name: "See-Saw Press (Alternating Side Press)",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["abs", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_703',
    name: "Shotgun Row",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_704',
    name: "Shoulder Circles",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_705',
    name: "Shoulder Press - With Bands",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_706',
    name: "Shoulder Raise",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_707',
    name: "Shoulder Stretch",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_708',
    name: "Side-Lying Floor Stretch",
    type: 'stretching',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_709',
    name: "Side Bridge",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_710',
    name: "Side Hop-Sprint",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_711',
    name: "Side Jackknife",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_712',
    name: "Side Lateral Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_713',
    name: "Side Laterals to Front Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_714',
    name: "Side Leg Raises",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_715',
    name: "Side Lying Groin Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_716',
    name: "Side Neck Stretch",
    type: 'stretching',
    primaryMuscles: [],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_717',
    name: "Side Standing Long Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_718',
    name: "Side To Side Chins",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "forearms", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_719',
    name: "Side Wrist Pull",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["forearms", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_720',
    name: "Side to Side Box Shuffle",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_721',
    name: "Single-Arm Cable Crossover",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_722',
    name: "Single-Arm Linear Jammer",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_723',
    name: "Single-Arm Push-Up",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_724',
    name: "Single-Cone Sprint Drill",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_725',
    name: "Single-Leg High Box Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_726',
    name: "Single-Leg Hop Progression",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_727',
    name: "Single-Leg Lateral Hop",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_728',
    name: "Single-Leg Leg Extension",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_729',
    name: "Single-Leg Stride Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_730',
    name: "Single Dumbbell Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["forearms", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_731',
    name: "Single Leg Butt Kick",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_732',
    name: "Single Leg Glute Bridge",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_733',
    name: "Single Leg Push-off",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_734',
    name: "Sit-Up",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_735',
    name: "Sit Squats",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_736',
    name: "Skating",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_737',
    name: "Sled Drag - Harness",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_738',
    name: "Sled Overhead Backward Walk",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "upper_back", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_739',
    name: "Sled Overhead Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_740',
    name: "Sled Push",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "chest", "glutes", "hamstrings", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_741',
    name: "Sled Reverse Flye",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_742',
    name: "Sled Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_743',
    name: "Sledgehammer Swings",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["calves", "forearms", "lats", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_744',
    name: "Smith Incline Shoulder Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_745',
    name: "Smith Machine Behind the Back Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_746',
    name: "Smith Machine Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_747',
    name: "Smith Machine Bent Over Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_748',
    name: "Smith Machine Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_749',
    name: "Smith Machine Close-Grip Bench Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_750',
    name: "Smith Machine Decline Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_751',
    name: "Smith Machine Hang Power Clean",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back", "quads", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_752',
    name: "Smith Machine Hip Raise",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_753',
    name: "Smith Machine Incline Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_754',
    name: "Smith Machine Leg Press",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_755',
    name: "Smith Machine One-Arm Upright Row",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_756',
    name: "Smith Machine Overhead Shoulder Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_757',
    name: "Smith Machine Pistol Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_758',
    name: "Smith Machine Reverse Calf Raises",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_759',
    name: "Smith Machine Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_760',
    name: "Smith Machine Stiff-Legged Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_761',
    name: "Smith Machine Upright Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_762',
    name: "Smith Single-Leg Split Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_763',
    name: "Snatch",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["biceps", "glutes", "hamstrings", "lower_back", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_764',
    name: "Snatch Balance",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_765',
    name: "Snatch Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["forearms", "glutes", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_766',
    name: "Snatch Pull",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "lower_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_767',
    name: "Snatch Shrug",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["forearms", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_768',
    name: "Snatch from Blocks",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "forearms", "glutes", "hamstrings", "lower_back", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_769',
    name: "Speed Band Overhead Triceps",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_770',
    name: "Speed Box Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_771',
    name: "Speed Squats",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_772',
    name: "Spell Caster",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["glutes", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_773',
    name: "Spider Crawl",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_774',
    name: "Spider Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_775',
    name: "Spinal Stretch",
    type: 'stretching',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["lats", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_776',
    name: "Split Clean",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "forearms", "glutes", "hamstrings", "lower_back", "front_delts", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_777',
    name: "Split Jerk",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_778',
    name: "Split Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_779',
    name: "Split Snatch",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "forearms", "glutes", "lower_back", "quads", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_780',
    name: "Split Squat with Dumbbells",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_781',
    name: "Split Squats",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_782',
    name: "Squat Jerk",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_783',
    name: "Squat with Bands",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_784',
    name: "Squat with Chains",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_785',
    name: "Squat with Plate Movers",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_786',
    name: "Squats - With Bands",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_787',
    name: "Stairmaster",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_788',
    name: "Standing Alternating Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_789',
    name: "Standing Barbell Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_790',
    name: "Standing Barbell Press Behind Neck",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_791',
    name: "Standing Bent-Over One-Arm Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_792',
    name: "Standing Bent-Over Two-Arm Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_793',
    name: "Standing Biceps Cable Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_794',
    name: "Standing Biceps Stretch",
    type: 'stretching',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_795',
    name: "Standing Bradford Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_796',
    name: "Standing Cable Chest Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_797',
    name: "Standing Cable Lift",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_798',
    name: "Standing Cable Wood Chop",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_799',
    name: "Standing Calf Raises",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_800',
    name: "Standing Concentration Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_801',
    name: "Standing Dumbbell Calf Raise",
    type: 'strength',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_802',
    name: "Standing Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_803',
    name: "Standing Dumbbell Reverse Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_804',
    name: "Standing Dumbbell Straight-Arm Front Delt Raise Above Head",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_805',
    name: "Standing Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_806',
    name: "Standing Dumbbell Upright Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_807',
    name: "Standing Elevated Quad Stretch",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_808',
    name: "Standing Front Barbell Raise Over Head",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_809',
    name: "Standing Gastrocnemius Calf Stretch",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: ["hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_810',
    name: "Standing Hamstring and Calf Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_811',
    name: "Standing Hip Circles",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_812',
    name: "Standing Hip Flexors",
    type: 'stretching',
    primaryMuscles: ["quads"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_813',
    name: "Standing Inner-Biceps Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_814',
    name: "Standing Lateral Stretch",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_815',
    name: "Standing Leg Curl",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_816',
    name: "Standing Long Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_817',
    name: "Standing Low-Pulley Deltoid Raise",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_818',
    name: "Standing Low-Pulley One-Arm Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_819',
    name: "Standing Military Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_820',
    name: "Standing Olympic Plate Hand Squeeze",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: ["biceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_821',
    name: "Standing One-Arm Cable Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_822',
    name: "Standing One-Arm Dumbbell Curl Over Incline Bench",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_823',
    name: "Standing One-Arm Dumbbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_824',
    name: "Standing Overhead Barbell Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_825',
    name: "Standing Palm-In One-Arm Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_826',
    name: "Standing Palms-In Dumbbell Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_827',
    name: "Standing Palms-Up Barbell Behind The Back Wrist Curl",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_828',
    name: "Standing Pelvic Tilt",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_829',
    name: "Standing Rope Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_830',
    name: "Standing Soleus And Achilles Stretch",
    type: 'stretching',
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_831',
    name: "Standing Toe Touches",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_832',
    name: "Standing Towel Triceps Extension",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_833',
    name: "Standing Two-Arm Overhead Throw",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_834',
    name: "Star Jump",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_835',
    name: "Step-up with Knee Raise",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_836',
    name: "Step Mill",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_837',
    name: "Stiff-Legged Barbell Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_838',
    name: "Stiff-Legged Dumbbell Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_839',
    name: "Stiff Leg Barbell Good Morning",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_840',
    name: "Stomach Vacuum",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_841',
    name: "Straight-Arm Dumbbell Pullover",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["lats", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_842',
    name: "Straight-Arm Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_843',
    name: "Straight Bar Bench Mid Rows",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_844',
    name: "Straight Raises on Incline Bench",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_845',
    name: "Stride Jump Crossover",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_846',
    name: "Sumo Deadlift",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quads", "forearms", "glutes", "lower_back", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_847',
    name: "Sumo Deadlift with Bands",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quads", "forearms", "glutes", "lower_back", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_848',
    name: "Sumo Deadlift with Chains",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "forearms", "glutes", "lower_back", "upper_back", "quads", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_849',
    name: "Superman",
    type: 'stretching',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_850',
    name: "Supine Chest Throw",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_851',
    name: "Supine One-Arm Overhead Throw",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_852',
    name: "Supine Two-Arm Overhead Throw",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "lats", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_853',
    name: "Suspended Fallout",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: ["chest", "lower_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_854',
    name: "Suspended Push-Up",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_855',
    name: "Suspended Reverse Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_856',
    name: "Suspended Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_857',
    name: "Suspended Split Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_858',
    name: "Svend Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["forearms", "front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_859',
    name: "T-Bar Row with Handle",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_860',
    name: "Tate Press",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_861',
    name: "The Straddle",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quads", "calves"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_862',
    name: "Thigh Abductor",
    type: 'strength',
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_863',
    name: "Thigh Adductor",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'machine'
  },
  {
    id: 'ex_864',
    name: "Tire Flip",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "chest", "forearms", "glutes", "hamstrings", "lower_back", "front_delts", "upper_back", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_865',
    name: "Toe Touchers",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_866',
    name: "Torso Rotation",
    type: 'stretching',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_867',
    name: "Trail Running/Walking",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_868',
    name: "Trap Bar Deadlift",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_869',
    name: "Tricep Dumbbell Kickback",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_870',
    name: "Tricep Side Stretch",
    type: 'stretching',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_871',
    name: "Triceps Overhead Extension with Rope",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_872',
    name: "Triceps Pushdown",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_873',
    name: "Triceps Pushdown - Rope Attachment",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_874',
    name: "Triceps Pushdown - V-Bar Attachment",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'cable'
  },
  {
    id: 'ex_875',
    name: "Triceps Stretch",
    type: 'stretching',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_876',
    name: "Tuck Crunch",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_877',
    name: "Two-Arm Dumbbell Preacher Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_878',
    name: "Two-Arm Kettlebell Clean",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_879',
    name: "Two-Arm Kettlebell Jerk",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["calves", "quads", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_880',
    name: "Two-Arm Kettlebell Military Press",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_881',
    name: "Two-Arm Kettlebell Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["biceps", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_882',
    name: "Underhand Cable Pulldowns",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_883',
    name: "Upper Back-Leg Grab",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["lower_back", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_884',
    name: "Upper Back Stretch",
    type: 'stretching',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_885',
    name: "Upright Barbell Row",
    type: 'strength',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_886',
    name: "Upright Cable Row",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_887',
    name: "Upright Row - With Bands",
    type: 'strength',
    primaryMuscles: ["upper_back"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_888',
    name: "Upward Stretch",
    type: 'stretching',
    primaryMuscles: ["front_delts"],
    secondaryMuscles: ["chest", "lats"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_889',
    name: "V-Bar Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_890',
    name: "V-Bar Pullup",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_891',
    name: "Vertical Swing",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "quads", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_892',
    name: "Walking, Treadmill",
    type: 'cardio',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'machine'
  },
  {
    id: 'ex_893',
    name: "Weighted Ball Hyperextension",
    type: 'strength',
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["glutes", "hamstrings", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_894',
    name: "Weighted Ball Side Bend",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_895',
    name: "Weighted Bench Dip",
    type: 'strength',
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_896',
    name: "Weighted Crunches",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_897',
    name: "Weighted Jump Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_898',
    name: "Weighted Pull Ups",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_899',
    name: "Weighted Sissy Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_900',
    name: "Weighted Sit-Ups - With Bands",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_901',
    name: "Weighted Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_902',
    name: "Wide-Grip Barbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_903',
    name: "Wide-Grip Decline Barbell Bench Press",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_904',
    name: "Wide-Grip Decline Barbell Pullover",
    type: 'strength',
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front_delts", "triceps"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_905',
    name: "Wide-Grip Lat Pulldown",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_906',
    name: "Wide-Grip Pulldown Behind The Neck",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'cable'
  },
  {
    id: 'ex_907',
    name: "Wide-Grip Rear Pull-Up",
    type: 'strength',
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "upper_back", "front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_908',
    name: "Wide-Grip Standing Barbell Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_909',
    name: "Wide Stance Barbell Squat",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_910',
    name: "Wide Stance Stiff Legs",
    type: 'strength',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["quads", "glutes", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_911',
    name: "Wind Sprints",
    type: 'strength',
    primaryMuscles: ["abs"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_912',
    name: "Windmills",
    type: 'stretching',
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_913',
    name: "World's Greatest Stretch",
    type: 'stretching',
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves", "glutes", "quads"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_914',
    name: "Wrist Circles",
    type: 'stretching',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'bodyweight'
  },
  {
    id: 'ex_915',
    name: "Wrist Roller",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: ["front_delts"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'other'
  },
  {
    id: 'ex_916',
    name: "Wrist Rotations with Straight Bar",
    type: 'strength',
    primaryMuscles: ["forearms"],
    secondaryMuscles: [],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'barbell'
  },
  {
    id: 'ex_917',
    name: "Yoke Walk",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "glutes", "calves", "glutes", "hamstrings", "lower_back"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'other'
  },
  {
    id: 'ex_918',
    name: "Zercher Squats",
    type: 'strength',
    primaryMuscles: ["quads"],
    secondaryMuscles: ["calves", "glutes", "hamstrings"],
    difficultyMultiplier: 1.0,
    mechanic: 'compound',
    equipment: 'barbell'
  },
  {
    id: 'ex_919',
    name: "Zottman Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
  {
    id: 'ex_920',
    name: "Zottman Preacher Curl",
    type: 'strength',
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    difficultyMultiplier: 1.0,
    mechanic: 'isolation',
    equipment: 'dumbbell'
  },
];
