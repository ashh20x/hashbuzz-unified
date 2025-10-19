import dotenv from 'dotenv';
dotenv.config();

import RedisClient from '@services/redis-service';
import { logError, logInfo } from '@shared/helper';
import createPrismaClient from '@shared/prisma';
import { getConfig } from './appConfig';
import server from './server';

// Initialize BullMQ workers for scheduled jobs
import { AccountId } from '@hashgraph/sdk';
import './V201/SchedulesJobHandlers';

// Initialize V201 Events Worker for processing queued events
import './V201/EventsWorker';

let redisClient: RedisClient;
/**
 * Test Prisma connection
 */
async function testPrismaConnection() {
  try {
    const prisma = await createPrismaClient();
    await prisma.$connect();
    const msg = 'Connected to the database successfully.';
    logInfo(msg);
  } catch (error) {
    const errMsg = 'Failed to connect to the database';
    logError(errMsg, error);
    process.exit(1);
  }
}

/**
 * Test Redis connection
 */
async function testRedisConnection(client: RedisClient) {
  try {
    await client.checkConnection();
    const msg = 'Connected to Redis successfully.';
    logInfo(msg);
  } catch (error) {
    const errMsg = 'Failed to connect to Redis';
    logError(errMsg, error);
    process.exit(1);
  }
}

/**
 * Gracefully shuts down the server
 */
async function gracefulShutdown() {
  logInfo('Shutting down gracefully...');

  try {
    // Disconnect Prisma client and close connection pool
    const { disconnectPrisma } = await import('@shared/prisma');
    await disconnectPrisma();
    logInfo('Prisma disconnected and connection pool closed.');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logError(`Error disconnecting Prisma: ${errorMsg}`);
  }

  if (redisClient) {
    await redisClient.client.quit();
    logInfo('Redis disconnected.');
  }

  process.exit(0);
}

process.on('SIGTERM', () => {
  void gracefulShutdown();
});
process.on('SIGINT', () => {
  void gracefulShutdown();
});

/**
 * Initialize the server
 */
async function init() {
  try {
    logInfo('Initializing server');
    const config = await getConfig();
    redisClient = new RedisClient(config.db.redisServerURI);

    // CRITICAL: Set up admin addresses for authentication (from disabled setVariables)
    globalThis.adminAddress = String(config.app.adminAddresses)
      .split(',')
      .map((add: string) =>
        AccountId.fromString(add).toSolidityAddress().toString()
      );
    logInfo(
      `Admin addresses configured: ${globalThis.adminAddress.length} addresses`
    );

    // NOTE: Stuck campaigns and edge cases are handled through the event-based monitoring system.
    // Use the monitoring API endpoints:
    // - GET /api/v201/monitoring/campaigns/stuck - View stuck campaigns
    // - POST /api/v201/monitoring/campaigns/stuck/process - Process stuck campaigns
    // This ensures all campaign operations go through the proper event flow with idempotency guarantees.

    await testPrismaConnection();
    await testRedisConnection(redisClient);

    // DEPRECATED: After-start jobs disabled for maintenance. These were used for:
    // - Checking previous campaign close times
    // - Processing backlog campaigns
    // await afterStartJobs();

    const port = config.app.port || 4000;
    const httpServer = server.listen(port, () => {
      const msg = `Server is running on http://localhost:${port}`;
      logInfo(msg);
    });

    // Attach WebSocket server (if available)
    try {
      // Lazy import to avoid circular deps
      const websocket = await import('./V201/websocket');
      if (websocket && websocket.attach) {
        websocket.attach(httpServer);
      }
    } catch (err) {
      logInfo('WebSocket module not attached: ' + String(err));
    }
  } catch (error) {
    const errMsg = 'Failed to initialize the server';
    logError(errMsg, error);
    process.exit(1);
  }
}

init().catch((error) => {
  const errMsg = 'Failed to initialize the server';
  logError(errMsg, error);
  process.exit(1);
});
