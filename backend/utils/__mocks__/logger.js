import { jest } from '@jest/globals';

const logger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  http: jest.fn(),
};

export const logError = jest.fn();
export const logInfo = jest.fn();
export const logWarn = jest.fn();
export const logHttp = jest.fn();

export default logger;
