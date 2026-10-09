# GymBud

GymBud is an offline-first fitness companion built with React Native, Expo, and TypeScript. It combines workout logging, nutrition tracking, recipes, timers, and per-muscle progression in one mobile app.

## Features

- **Workouts:** strength, cardio, and stretching sessions; exercise library; custom exercises; templates; workout history; notes; intensity; warm-up sets.
- **Workout tools:** active workout mode, rest timers, stretch timers, cardio timers, bodyweight exercises, and measurement-system conversion.
- **Nutrition:** calorie and macronutrient logging, recipes, ingredient selection, barcode scanning, hybrid food search, Romanian fast-food aliases such as shaorma, OpenFoodFacts lookup, offline catalog estimates, and cached products.
- **Progress:** body-map muscle scores, rank tiers, estimated 1RM scoring, intensity and volume adjustments, superset handling, and inactivity decay.
- **Personalization:** goals, workout goals, themes, bodyweight, gender, global date selection, and daily activity tracking.

## Architecture

The application is currently a single Expo entry point (`App.tsx`) with feature-oriented source folders:

```text
App.tsx
src/
  components/       reusable UI and workout/nutrition modals
  context/          theme, active workout, date, and body-map state
  data/             predefined exercise catalog
  hooks/             reusable React hooks
  screens/          top-level app screens
  types/            shared domain types
  utils/             persistence, migrations, ranking, dates, APIs, and measurements
```

The app persists user data locally with AsyncStorage. `src/utils/bootstrap.ts` runs versioned data migrations before the providers that read persisted data are mounted. Feature repositories in `src/utils/repositories.ts` provide typed access for workout, exercise, and ranking data.

Food search combines OpenFoodFacts with a bundled catalog and locally saved foods. Bundled restaurant-style entries are estimates and show their source in the UI; an internet connection can provide broader or more current results. USDA FoodData Central is intentionally not enabled directly in the Expo client because its free API key must not be embedded in a mobile bundle. A future backend/proxy can enable it without changing the app-level provider contract. Device location and nearby restaurant discovery are reserved for a future provider.

The ranking implementation is intentionally deterministic and testable. It calculates effective load, estimated 1RM, muscle contributions, intensity/volume bonuses, decay, and rank progress from workout history.

## Development

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Useful targets:

```bash
npm run android
npm run ios
npm run web
```

Run validation:

```bash
npm test -- --runInBand
npx tsc --noEmit
```

The project uses Expo SDK 57, React Native 0.86, React 19, TypeScript, React Navigation, AsyncStorage, Expo Camera, Expo Image Picker, Expo Sensors, and React Native SVG.

## Data and migrations

Persisted data is stored under namespaced keys in `src/utils/storage.ts`. Legacy workout values (`gym` and `calisthenics`) are migrated to `strength` by the versioned bootstrap migration. Bodyweight behavior is represented by an exercise's `equipment: 'bodyweight'`, not by a separate workout type.

When changing a persisted schema:

1. Add a versioned migration in `src/utils/bootstrap.ts` or `src/utils/migration.ts`.
2. Add a pure migration test.
3. Keep the migration idempotent.
4. Run both the Jest suite and TypeScript check.

## Builds

EAS profiles are defined in `eas.json` for development, preview, and production builds. Native folders and Expo build output are generated artifacts and are intentionally ignored by Git; use Expo prebuild/build commands to recreate them when needed.
