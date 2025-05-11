const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const logger = require('./utils/logger');
const syncRoutes = require('./routes/syncRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const swaggerSetup = require('./config/swagger');
const errorMiddleware = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// API Documentation
swaggerSetup(app);

// Routes
app.use('/api', syncRoutes);
app.use('/api', deviceRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PiSync API is running' });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  logger.info(`PiSync API server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app; 