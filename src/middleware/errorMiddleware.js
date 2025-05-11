const logger = require('../utils/logger');

/**
 * Error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);

  // Set default error values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(val => val.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate Field Value',
      field: Object.keys(err.keyValue)[0]
    });
  }

  // JSON parsing error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON',
      error: err.message
    });
  }

  // Generic API error response
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;