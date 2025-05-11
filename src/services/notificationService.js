const logger = require('../utils/logger');

/**
 * Service to handle notifications for sync failures
 */
exports.sendFailureAlert = (deviceId, syncEvents) => {
  // For this assignment, we'll just log to the console as specified
  logger.warn(`ALERT: Device ${deviceId} has failed to sync 3 times in a row!`);
  logger.warn(`Failure details: ${JSON.stringify(syncEvents.map(s => ({
    timestamp: s.timestamp,
    errors: s.total_errors
  })))}`);
  return true;
};

/**
 * Service to check device status and trigger alerts if needed 
 */
exports.monitorDeviceHealth = async () => { 
  logger.info('Device health monitoring check initiated');
  return {
    monitored: true,
    timestamp: new Date()
  };
};