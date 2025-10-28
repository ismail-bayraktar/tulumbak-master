import redis from 'redis';
import logger from '../utils/logger.js';

/**
 * Redis Cache Configuration
 * Provides caching layer for improved performance
 */

let redisClient = null;
let isConnected = false;

/**
 * Initialize Redis connection
 */
export const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL && process.env.REDIS_ENABLED !== 'true') {
      logger.info('Redis disabled, skipping connection');
      return;
    }

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis connection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 50, 1000);
        }
      }
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', { error: err.message });
      isConnected = false;
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
      isConnected = true;
    });

    await redisClient.connect();
    logger.info('✅ Redis Connected Successfully');
  } catch (error) {
    logger.error('Redis connection failed', { error: error.message });
    isConnected = false;
  }
};

/**
 * Get value from cache
 */
export const getFromCache = async (key) => {
  if (!redisClient || !isConnected) {
    return null;
  }

  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Redis get error', { key, error: error.message });
    return null;
  }
};

/**
 * Set value in cache
 */
export const setInCache = async (key, value, expirySeconds = 3600) => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    await redisClient.setEx(key, expirySeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis set error', { key, error: error.message });
    return false;
  }
};

/**
 * Delete from cache
 */
export const deleteFromCache = async (key) => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis delete error', { key, error: error.message });
    return false;
  }
};

/**
 * Delete multiple keys by pattern
 */
export const deletePattern = async (pattern) => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error('Redis delete pattern error', { pattern, error: error.message });
    return false;
  }
};

/**
 * Clear all cache
 */
export const clearCache = async () => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    await redisClient.flushAll();
    logger.info('Cache cleared');
    return true;
  } catch (error) {
    logger.error('Redis flush error', { error: error.message });
    return false;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  if (!redisClient || !isConnected) {
    return null;
  }

  try {
    const info = await redisClient.info('stats');
    return info;
  } catch (error) {
    logger.error('Redis stats error', { error: error.message });
    return null;
  }
};

export default redisClient;

