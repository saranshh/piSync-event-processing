const express = require('express');
const { body } = require('express-validator');
const syncController = require('../controllers/syncController');

const router = express.Router();

// Validation rules for sync event
const syncEventValidation = [
  body('device_id')
    .notEmpty()
    .withMessage('Device ID is required')
    .isString()
    .withMessage('Device ID must be a string'),
  
  body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO 8601 date'),
  
  body('total_files_synced')
    .notEmpty()
    .withMessage('Total files synced is required')
    .isInt({ min: 0 })
    .withMessage('Total files synced must be a non-negative integer'),
  
  body('total_errors')
    .notEmpty()
    .withMessage('Total errors is required')
    .isInt({ min: 0 })
    .withMessage('Total errors must be a non-negative integer'),
  
  body('internet_speed')
    .notEmpty()
    .withMessage('Internet speed is required')
    .isFloat({ min: 0 })
    .withMessage('Internet speed must be a non-negative number')
];

/**
 * @swagger
 * /api/sync-event:
 *   post:
 *     summary: Record a new sync event
 *     description: Receives a sync event from a device and stores it
 *     tags: [Sync]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device_id
 *               - total_files_synced
 *               - total_errors
 *               - internet_speed
 *             properties:
 *               device_id:
 *                 type: string
 *                 description: Unique identifier for the device
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Time of the sync event (ISO 8601)
 *               total_files_synced:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of files successfully synced
 *               total_errors:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of errors encountered during sync
 *               internet_speed:
 *                 type: number
 *                 minimum: 0
 *                 description: Internet speed in Mbps
 *     responses:
 *       201:
 *         description: Sync event recorded successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/sync-event', syncEventValidation, syncController.recordSyncEvent);

module.exports = router;