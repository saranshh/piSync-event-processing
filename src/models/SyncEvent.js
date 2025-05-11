const mongoose = require('mongoose');

const SyncEventSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: [true, 'Device ID is required'],
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  total_files_synced: {
    type: Number,
    required: [true, 'Total files synced is required'],
    min: 0
  },
  total_errors: {
    type: Number,
    required: [true, 'Total errors is required'],
    min: 0,
    index: true
  },
  internet_speed: {
    type: Number,
    required: [true, 'Internet speed is required'],
    min: 0
  },
  sync_status: {
    type: String,
    enum: ['success', 'partial', 'failed'],
    default: function() {
      return this.total_errors > 0 ? 
        (this.total_files_synced > 0 ? 'partial' : 'failed') : 
        'success';
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if the sync had errors
SyncEventSchema.virtual('hasErrors').get(function() {
  return this.total_errors > 0;
});

// Method to check if sync completely failed
SyncEventSchema.methods.isCompleteFail = function() {
  return this.total_errors > 0 && this.total_files_synced === 0;
};

module.exports = mongoose.model('SyncEvent', SyncEventSchema);