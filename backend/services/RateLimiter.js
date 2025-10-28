import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Service
 * Protects API from abuse and brute force attacks
 */
class RateLimiterService {
  /**
   * General API rate limiter
   * Limits requests per window
   */
  static createGeneralLimiter(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    return rateLimit({
      windowMs, // 15 minutes
      max: maxRequests, // limit each IP to maxRequests requests per windowMs
      message: {
        success: false,
        message: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  /**
   * Authentication rate limiter
   * Stricter limit for login/register endpoints
   */
  static createAuthLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
      message: {
        success: false,
        message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
      },
      skipSuccessfulRequests: true, // Don't count successful requests
    });
  }

  /**
   * Admin API rate limiter
   * Limits admin endpoints to prevent abuse
   */
  static createAdminLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // limit each IP to 50 requests per windowMs
      message: {
        success: false,
        message: 'Admin API limit aşıldı. Lütfen daha sonra tekrar deneyin.',
      },
      skipSuccessfulRequests: false,
    });
  }

  /**
   * Order placement rate limiter
   * Prevents order spam
   */
  static createOrderLimiter() {
    return rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // limit each IP to 10 orders per hour
      message: {
        success: false,
        message: 'Çok fazla sipariş denemesi. Lütfen daha sonra tekrar deneyin.',
      },
    });
  }

  /**
   * File upload rate limiter
   * Limits file uploads to prevent abuse
   */
  static createUploadLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // limit each IP to 20 uploads per 15 minutes
      message: {
        success: false,
        message: 'Çok fazla dosya yükleme denemesi. Lütfen daha sonra tekrar deneyin.',
      },
    });
  }

  /**
   * Contact form rate limiter
   * Prevents spam submissions
   */
  static createContactLimiter() {
    return rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // limit each IP to 3 contact form submissions per hour
      message: {
        success: false,
        message: 'Çok fazla mesaj gönderme denemesi. Lütfen 1 saat sonra tekrar deneyin.',
      },
    });
  }

  /**
   * Password reset rate limiter
   * Prevents abuse of password reset feature
   */
  static createPasswordResetLimiter() {
    return rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // limit each IP to 3 password reset requests per hour
      message: {
        success: false,
        message: 'Çok fazla şifre sıfırlama isteği. Lütfen 1 saat sonra tekrar deneyin.',
      },
    });
  }
}

export default RateLimiterService;

