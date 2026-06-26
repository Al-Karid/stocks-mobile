const { withEntitlementsPlist } = require('@expo/config-plugins');

module.exports = function withRemoveIosPushNotifications(config) {
  return withEntitlementsPlist(config, (config) => {
    const entitlements = config.modResults;

    if (entitlements && Object.prototype.hasOwnProperty.call(entitlements, 'aps-environment')) {
      delete entitlements['aps-environment'];
      console.log('✅ Removed iOS push notification entitlement from app entitlements');
    }

    return config;
  });
};
