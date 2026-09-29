module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^expo-modules-core$': '<rootDir>/node_modules/expo-modules-core',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
};
