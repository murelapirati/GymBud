# GymApp

A React Native gym tracker app built with Expo and TypeScript.

## Features
- 🏋️ Workout & Exercise Tracker
- ⏱️ Rest Timer between sets
- 🍎 Calorie Tracker
- 📝 Recipe Manager

## Project Structure

```
gymapp/
├── App.tsx                 # Main app entry with navigation
├── assets/                 # App icons, splash screen (Expo assets)
├── src/
│   ├── screens/           # Screen components
│   │   ├── CaloriesScreen.tsx
│   │   ├── WorkoutsScreen.tsx
│   │   └── TimerScreen.tsx
│   ├── components/        # Reusable UI components
│   ├── assets/           # App-specific assets
│   │   └── images/       # Images used in the app
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and helpers
├── package.json
└── tsconfig.json
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the app:
```bash
npx expo start --tunnel
```

3. Run on your device:
- Scan the QR code with Expo Go app (Android/iOS)
- Or press `a` for Android emulator
- Or press `i` for iOS simulator

## Tech Stack
- React Native 0.81.5
- Expo SDK 54
- TypeScript
- AsyncStorage for local data persistence
- React Navigation for tab navigation
