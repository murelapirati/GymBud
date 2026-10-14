# GymBud

Open-source Expo + React Native + TypeScript fitness tracker (workouts, ranks, calories).
All data is local on the user's device (AsyncStorage). There is no backend.

## Commands
- Tests: `npm test` (Jest)
- Type check: `npx tsc --noEmit`
- Run the app: `npm start` (dev build via `npm run ios`)

Run the tests and the type check after every change. Do not finish a task with failures.

## Layout
- `src/utils/rankingEngine.ts`: scoring, ranks, decay. Has Jest tests in `src/utils/__tests__/`.
- `src/data/exercises.ts`: built-in exercise library (900+ entries). Edit only entries a task names.
- `src/utils/foodApi.ts`: OpenFoodFacts barcode and text search.
- `src/components/`, `src/screens/`, `src/context/`, `src/hooks/`, `src/types/`

## Rules
- Do the one task you were given. Do not refactor unrelated code.
- Do not touch `rankingEngine.ts` unless the task says so. Any scoring change needs a test.
- Use theme colors (`theme.*`) instead of hardcoded hex. Exception: equipment badge colors.
- No emojis in UI text, code or comments.
- Never send user data (workouts, weights, scores) to any server. Debug logging must sit
  behind `__DEV__`.
- Custom exercises live on the user's device, not in a database. Any change to stored data
  shapes needs a migration for existing users.
- If a task is ambiguous, ask before editing.

## Workflow
1. Plan first. List the files you will change and wait for approval.
2. Make the smallest change that satisfies the task's "Done when" list.
3. Report what changed and anything you chose not to do.
