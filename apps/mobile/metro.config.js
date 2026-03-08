const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, '../../packages/shared');

const config = getDefaultConfig(projectRoot);

// Watch the shared package for hot-reload
config.watchFolders = [sharedRoot];

// Resolve @nookme/shared from its actual path
config.resolver.extraNodeModules = {
  '@nookme/shared': sharedRoot,
};

module.exports = config;
