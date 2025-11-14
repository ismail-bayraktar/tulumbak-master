import { jest } from '@jest/globals';
import logger, { logError, logInfo, logWarn, logHttp } from '../../utils/logger.js';

describe('Logger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should have error, info, warn, and http methods', () => {
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.http).toBe('function');
  });

  describe('logError', () => {
    it('should call logger.error with the correct parameters', () => {
      const errorSpy = jest.spyOn(logger, 'error');
      const error = new Error('Test error');
      const context = { requestId: '123' };
      logError(error, context);
      expect(errorSpy).toHaveBeenCalledWith(error.message, {
        error: error.stack,
        ...context,
      });
    });
  });

  describe('logInfo', () => {
    it('should call logger.info with the correct parameters', () => {
      const infoSpy = jest.spyOn(logger, 'info');
      const message = 'Test info message';
      const context = { userId: '456' };
      logInfo(message, context);
      expect(infoSpy).toHaveBeenCalledWith(message, context);
    });
  });

  describe('logWarn', () => {
    it('should call logger.warn with the correct parameters', () => {
      const warnSpy = jest.spyOn(logger, 'warn');
      const message = 'Test warning message';
      const context = { data: 'some data' };
      logWarn(message, context);
      expect(warnSpy).toHaveBeenCalledWith(message, context);
    });
  });

  describe('logHttp', () => {
    it('should call logger.info with HTTP request details', () => {
      const infoSpy = jest.spyOn(logger, 'info');
      const req = {
        method: 'GET',
        originalUrl: '/test',
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('Test User-Agent'),
      };
      const res = {
        statusCode: 200,
      };
      const responseTime = 150;
      logHttp(req, res, responseTime);
      expect(infoSpy).toHaveBeenCalledWith(`${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: 'Test User-Agent',
      });
    });
  });
});

