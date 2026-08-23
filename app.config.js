const appConfig = require('./app.json');
const packageJson = require('./package.json');

module.exports = {
  ...appConfig.expo,
  version: packageJson.version,
  runtimeVersion: packageJson.version,
  android: {
    ...appConfig.expo.android,
    targetSdkVersion: 36,
  },
};
