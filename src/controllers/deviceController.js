const SyncEvent = require('../models/SyncEvent');
const logger = require('../utils/logger');

// @desc    Get sync history for a specific device
// @route   GET /api/device/:id/sync-history
// @access  Public
exports.getDeviceSyncHistory = async (req, res, next) => {
  try {
    const deviceId = req.params.id;
    
    // Optional query parameters
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    // Find sync events for the device
    const syncEvents = await SyncEvent.find({ device_id: deviceId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await SyncEvent.countDocuments({ device_id: deviceId });
    
    // Check if device exists
    if (syncEvents.length === 0 && page === 1) {
      return res.status(404).json({
        success: false,
        message: `No sync history found for device ${deviceId}`
      });
    }
    
    return res.status(200).json({
      success: true,
      count: syncEvents.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: syncEvents
    });
  } catch (error) {
    logger.error(`Error getting device sync history: ${error.message}`);
    next(error);
  }
};

// @desc    Get devices with repeated failures
// @route   GET /api/devices/repeated-failures
// @access  Public
exports.getDevicesWithRepeatedFailures = async (req, res, next) => {
  try {
    // Aggregate to find devices with more than 3 failed syncs
    const failingDevices = await SyncEvent.aggregate([
      // Match only events with errors
      { $match: { total_errors: { $gt: 0 } } },
      // Group by device and count failures
      { $group: {
          _id: "$device_id",
          failedSyncs: { $sum: 1 },
          lastFailure: { $max: "$timestamp" },
          averageErrors: { $avg: "$total_errors" }
        }
      },
      // Filter only devices with more than 3 failed syncs
      { $match: { failedSyncs: { $gt: 3 } } },
      // Sort by number of failures, descending
      { $sort: { failedSyncs: -1 } },
      // Project the fields we want to return
      { $project: {
          device_id: "$_id",
          _id: 0,
          failedSyncs: 1,
          lastFailure: 1,
          averageErrors: 1
        }
      }
    ]);
    
    return res.status(200).json({
      success: true,
      count: failingDevices.length,
      data: failingDevices
    });
  } catch (error) {
    logger.error(`Error getting devices with repeated failures: ${error.message}`);
    next(error);
  }
};