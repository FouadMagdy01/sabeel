const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add .db files as asset extensions so Metro bundles them
config.resolver.assetExts.push('db');

module.exports = config;
