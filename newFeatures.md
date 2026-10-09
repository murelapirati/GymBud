# GymBud — Default workout templates + food text search

Repo: https://github.com/murelapirati/GymBud
Key files:
  `src/components/workout/TemplateSelectionModal.tsx`
  `src/screens/CaloriesScreen.tsx`
  `src/utils/foodApi.ts`  ← searchFoodByText already exists here, just not wired to UI
  `src/utils/storage.ts`
  `src/types/index.ts`

---

## Task 1 — Seed default workout templates for new users

`WorkoutTemplate` and `TemplateExercise` interfaces already exist in `types/index.ts`.
Templates are stored at `STORAGE_KEYS.WORKOUT_TEMPLATES` in AsyncStorage.

### 1a — Create `src/data/defaultTemplates.ts`

Add this file with 5 default templates. Use real exercise names that exist in
`src/data/exercises.ts`. All dumbbell-based. Pre-exhaustion supersets are preferred
where it makes sense (isolation exercise listed directly before compound targeting
same muscle — the superset detection in rankingEngine handles the rest).

```ts
import { WorkoutTemplate } from '../types';

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'default_push',
    name: 'Push (Chest / Shoulders / Triceps)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      // pre-exhaust chest → compound
      { id: 'dt_1', name: 'Dumbbell Flyes', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_2', name: 'Dumbbell Bench Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      // pre-exhaust side delt → compound
      { id: 'dt_3', name: 'Lateral Raises', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_4', name: 'Dumbbell Shoulder Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      // triceps finisher
      { id: 'dt_5', name: 'Lying Dumbbell Tricep Extension', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
    ],
  },
  {
    id: 'default_pull',
    name: 'Pull (Back / Biceps)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_6', name: 'Bent Over Rear Delt Raise', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_7', name: 'Bent Over Two-Dumbbell Row', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_8', name: 'Concentration Curls', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_9', name: 'Hammer Curl', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
    ],
  },
  {
    id: 'default_legs',
    name: 'Legs (Quads / Hamstrings / Glutes)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_10', name: 'Stiff-Legged Dumbbell Deadlift', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_11', name: 'Dumbbell Squat', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_12', name: 'Bulgarian Split Squat', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_13', name: 'Dumbbell Lunges', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
    ],
  },
  {
    id: 'default_upper',
    name: 'Upper Body (Full)',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_14', name: 'Dumbbell Flyes', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_15', name: 'Dumbbell Bench Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_16', name: 'Bent Over Two-Dumbbell Row', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_17', name: 'Lateral Raises', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
      { id: 'dt_18', name: 'Dumbbell Shoulder Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_19', name: 'Concentration Curls', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
    ],
  },
  {
    id: 'default_fullbody',
    name: 'Full Body',
    workoutType: 'strength',
    createdAt: 0,
    exercises: [
      { id: 'dt_20', name: 'Dumbbell Squat', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_21', name: 'Dumbbell Bench Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_22', name: 'Bent Over Two-Dumbbell Row', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_23', name: 'Dumbbell Shoulder Press', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_24', name: 'Hammer Curl', type: 'strength', equipment: 'dumbbell', mechanic: 'compound' },
      { id: 'dt_25', name: 'Lying Dumbbell Tricep Extension', type: 'strength', equipment: 'dumbbell', mechanic: 'isolation' },
    ],
  },
];
```

### 1b — Seed on first launch

In App.tsx (or wherever the app initialises storage), add a one-time seed:

```ts
import { DEFAULT_TEMPLATES } from './src/data/defaultTemplates';

const seedDefaultTemplates = async () => {
  const alreadySeeded = await AsyncStorage.getItem('@gymapp_default_templates_seeded_v1');
  if (alreadySeeded) return;

  const existing = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TEMPLATES);
  const existingTemplates: WorkoutTemplate[] = existing ? JSON.parse(existing) : [];

  // Only add defaults that don't already exist (by id)
  const existingIds = new Set(existingTemplates.map(t => t.id));
  const toAdd = DEFAULT_TEMPLATES.filter(t => !existingIds.has(t.id));
  const merged = [...toAdd, ...existingTemplates]; // defaults appear first

  await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(merged));
  await AsyncStorage.setItem('@gymapp_default_templates_seeded_v1', 'true');
};
```

Call `seedDefaultTemplates()` inside the app's startup `useEffect`, before any
template screen is rendered. Guard with the `_v1` flag so adding future default
template batches is just a new flag (`_v2`, etc.).

### 1c — Mark default templates visually in TemplateSelectionModal

In `TemplateSelectionModal.tsx`, add a small "Default" badge on template cards
where `template.id.startsWith('default_')`. Same style as the "Custom" badge in
`ExerciseSelectionModal` — a small pill, muted colour, doesn't distract.

---

## Task 2 — Food text search in CaloriesScreen

`searchFoodByText(query)` already exists in `src/utils/foodApi.ts` and returns
`ScannedProduct[]`. It is NOT currently wired to any UI. Wire it up.

### 2a — Add a search flow to the "Add food" entry point

Currently `CaloriesScreen` has a barcode scanner path and a manual entry form.
Add a third path: text search. The entry point should be a search bar that appears
when the user taps "Add food" (or whichever button opens the add-food flow).

The flow:
```
[Add food] button
  → Sheet/modal appears with:
      [ Search by name... ] ← text input, autofocused
      [ Scan barcode ]      ← existing scanner button
      [ Add manually ]      ← existing manual entry

  User types "shaorma" → debounced 500ms → calls searchFoodByText(query)
  → shows results list (same card style as barcode result)
  → tap result → opens existing ProductDetailsModal with that ScannedProduct
  → user confirms → adds FoodEntry to today's log
```

### 2b — Results list UI

Each result card shows:
- Food name (bold)
- Brand if available (muted, smaller)
- Calories per 100g + protein/carbs/fat as small pills
- Food image thumbnail if `imageUrl` exists (40×40, rounded)

Show a loading spinner while fetching. Show "No results for X" if the array
comes back empty. Show "Search for a food above" as the default empty state.

### 2c — Custom food shortcut

If the search returns 0 results OR the user dismisses search, show a prompt:
```
Can't find it? Add "[query]" manually →
```
Tapping it pre-fills the manual entry form with the search query as the food name.
This covers local/restaurant foods like a specific shaorma place — user enters
macros once, it saves to their log and is reusable from history.

### 2d — Recent foods

When a `FoodEntry` is saved to the log, also save its `ScannedProduct`-equivalent
data to a `STORAGE_KEYS.RECENT_FOODS` list (max 10, most recent first, deduped by
name). When the search modal opens with an empty query, show this list as
"Recent" instead of an empty state. Add `RECENT_FOODS: '@gymapp_recent_foods'` to
`STORAGE_KEYS` in `storage.ts`.

---

## What NOT to change

- `searchFoodByText` and `fetchProductByBarcode` in `foodApi.ts` — already correct
- `ProductDetailsModal` — already handles `ScannedProduct`, reuse as-is
- `calculateMacros` — already correct
- Existing barcode scanner flow — keep exactly as is, just add search alongside it
- `WorkoutTemplate` and `TemplateExercise` interfaces — already correct
