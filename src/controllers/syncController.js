const { validationResult } = require('express-validator');
const SyncEvent = require('../models/SyncEvent');
const logger = require('../utils/logger');
const notificationService = require('../services/notificationService');

// @desc    Record a new sync event
// @route   POST /api/sync-event
// @access  Public
exports.recordSyncEvent = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Create new sync event
    const syncEvent = await SyncEvent.create(req.body);
    
    // Check for repeated failures
    await checkForRepeatedFailures(req.body.device_id);
    
    return res.status(201).json({
      success: true,
      data: syncEvent
    });
  } catch (error) {
    logger.error(`Error recording sync event: ${error.message}`);
    next(error);
  }
};

// Helper function to check for repeated failures
const checkForRepeatedFailures = async (deviceId) => {
  try {
    // Get the last 3 sync events for this device
    const recentSyncs = await SyncEvent.find({ device_id: deviceId })
      .sort({ timestamp: -1 })
      .limit(3);
    
    // Check if all 3 are failures
    const allFailed = recentSyncs.length === 3 && 
      recentSyncs.every(sync => sync.isCompleteFail());
    
    if (allFailed) {
      logger.warn(`Device ${deviceId} has failed to sync 3 times in a row`);
      // Trigger notification
      notificationService.sendFailureAlert(deviceId, recentSyncs);
    }
  } catch (error) {
    logger.error(`Error checking for repeated failures: ${error.message}`);
  }
};