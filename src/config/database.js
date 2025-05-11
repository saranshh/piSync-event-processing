const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up indexes for SyncEvent collection
    const db = mongoose.connection;
    await db.collection('syncevents').createIndex({ device_id: 1, timestamp: -1 });
    await db.collection('syncevents').createIndex({ timestamp: -1 });
    await db.collection('syncevents').createIndex({ total_errors: 1 });
    
    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 