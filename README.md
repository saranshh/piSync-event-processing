# PiSync Backend Service

A lightweight service that helps PiBook and PiBox devices sync offline learning data to the cloud when internet connectivity is available.

## Overview

PiSync processes sync events from devices, tracks sync history, and identifies devices with repeated sync failures. This backend provides APIs to:

- Accept and store sync events
- Fetch sync history for any device
- Find devices with repeated sync failures
- Notify when devices fail multiple times consecutively

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- MongoDB (>= 4.4)

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file 
   ```
   .env
   ```
4. Start the server
   ```
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

### Endpoints

#### POST /api/sync-event

Records a new sync event from a device.

**Request Body:**
```json
{
  "device_id": "device-123",
  "timestamp": "2023-08-15T12:30:45Z",
  "total_files_synced": 25,
  "total_errors": 2,
  "internet_speed": 10.5
}
```

#### GET /api/device/:id/sync-history

Retrieves the sync history for a specific device.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 10)

#### GET /api/devices/repeated-failures

Lists devices that have had more than 3 failed syncs.

## Database Schema

### SyncEvent Collection

The primary collection storing sync events from devices:

- `device_id`: String (indexed) - Unique identifier for the device
- `timestamp`: Date (indexed) - When the sync occurred
- `total_files_synced`: Number - Count of files successfully synced
- `total_errors`: Number (indexed) - Count of errors during sync
- `internet_speed`: Number - Internet speed during sync in Mbps
- `sync_status`: String (enum: 'success', 'partial', 'failed') - Overall status

## Scaling for 100k Devices

### Database Scaling Strategy

1. **Sharding**: Implement MongoDB sharding with device_id as the shard key
2. **Time-Based Collections**: Consider time-based collection partitioning for historical data
3. **Indexes**: Maintain proper indexes on frequently queried fields
4. **Archiving**: Implement a data archiving strategy for older sync records

### Application Scaling Strategy

1. **Horizontal Scaling**: Deploy multiple API instances behind a load balancer
2. **Caching**: Implement Redis for caching frequent queries
3. **Queue Processing**: Use message queues (RabbitMQ/Kafka) for processing sync events asynchronously
4. **Rate Limiting**: Implement rate limiting per device to prevent API abuse
5. **Database Connection Pooling**: Optimize database connections

### Monitoring and Reliability

1. **Health Checks**: Implement comprehensive health checks
2. **Circuit Breakers**: Add circuit breakers to prevent cascading failures
3. **Metrics**: Track API performance metrics
4. **Alerting**: Set up proactive alerting for system issues

## Future Enhancements

- Authentication and authorization
- Detailed analytics dashboard
- Real-time sync monitoring
- Device grouping and tagging