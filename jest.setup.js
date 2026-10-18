jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

globalThis._WORKLETS_BUNDLE_MODE_ENABLED = false;
globalThis.__workletsModuleProxy = new Proxy({}, {
  get: () => (...args) => args[0] ?? null,
});

require('react-native-gesture-handler/jestSetup');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));


