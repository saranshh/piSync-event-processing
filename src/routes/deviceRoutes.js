const express = require('express');
const { param, query } = require('express-validator');
const deviceController = require('../controllers/deviceController');

const router = express.Router();

/**
 * @swagger
 * /api/device/{id}/sync-history:
 *   get:
 *     summary: Get sync history for a device
 *     description: Retrieves a paginated list of sync events for a specific device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Sync history retrieved successfully
 *       404:
 *         description: No sync history found for the device
 *       500:
 *         description: Server error
 */
router.get(
  '/device/:id/sync-history',
  [
    param('id').notEmpty().withMessage('Device ID is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  deviceController.getDeviceSyncHistory
);

/**
 * @swagger
 * /api/devices/repeated-failures:
 *   get:
 *     summary: Get devices with repeated failures
 *     description: Returns a list of devices that have had more than 3 failed syncs
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Device failure list retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/devices/repeated-failures', deviceController.getDevicesWithRepeatedFailures);

module.exports = router;