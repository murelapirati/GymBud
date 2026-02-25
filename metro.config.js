const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable Fast Refresh
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

// Optimize for faster reloads
config.resetCache = false;

module.exports = config;
