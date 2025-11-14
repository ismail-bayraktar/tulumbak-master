/**
 * Test Setup File
 * Configures test environment, mocks, and utilities
 */

import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    dropDatabase: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    collections: {},
    on: jest.fn(),
    once: jest.fn(),
  },
  Schema: Object.assign(jest.fn().mockImplementation(function() {
    return {
      index: jest.fn(),
      pre: jest.fn(),
      methods: {},
      virtual: jest.fn().mockReturnThis(),
      get: jest.fn(),
      statics: {},
    };
  }), {
    Types: {
      Mixed: {},
    },
  }),
  model: jest.fn(),
  models: {},
}));


// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tulumbak-test';
process.env.WEBHOOK_ENCRYPTION_KEY = 'a-very-secure-webhook-encryption-key';

// Global test timeout
jest.setTimeout(30000);

// Mock Sentry
jest.mock('../utils/sentry', () => ({
  initSentry: jest.fn(),
  captureException: jest.fn()
}));

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Test helpers
export const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: null,
  admin: null,
  ...overrides
});

export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = () => jest.fn();

// Generate test JWT token
export const generateTestToken = (payload = {}) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: 'test-user-id', email: 'test@example.com', ...payload },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

