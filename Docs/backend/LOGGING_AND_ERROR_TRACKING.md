# Logging ve Error Tracking Sistem Dokümantasyonu

## 📋 Genel Bakış

Bu doküman, Tulumbak e-ticaret sisteminde logging ve error tracking sistemlerinin nasıl kurulduğunu ve kullanıldığını açıklar.

---

## 🛠️ Kullanılan Teknolojiler

### 1. Winston Logger
**Versiyon:** 3.13.0

**Özellikler:**
- Structured logging
- Multiple transports (file, console)
- Log rotation
- Different log levels

### 2. Sentry
**Versiyon:** 8.22.1

**Özellikler:**
- Real-time error tracking
- Performance monitoring
- User context tracking
- Breadcrumb logging

---

## 📁 Dosya Yapısı

```
backend/
├── utils/
│   ├── logger.js          # Winston logger yapılandırması
│   └── sentry.js         # Sentry yapılandırması
├── middleware/
│   └── errorHandler.js    # Global error handler middleware
├── logs/
│   ├── error.log         # Sadece error seviyesi loglar
│   └── combined.log      # Tüm loglar
└── server.js             # Logger entegrasyonu
```

---

## 🎯 Logger Seviyeleri

Winston'da 6 log seviyesi vardır (önem sırasına göre):

1. **error** - Hatalar, exceptionlar
2. **warn** - Uyarılar
3. **info** - Genel bilgiler
4. **http** - HTTP istekleri
5. **verbose** - Detaylı bilgiler
6. **debug** - Debug bilgileri

**Varsayılan seviye:** `info`

**Environment Variable:** `LOG_LEVEL=debug`

---

## 💻 Kullanım

### Logger'ı Import Etme

```javascript
import logger, { logError, logInfo, logWarn } from '../utils/logger.js';
import { captureException, captureMessage } from '../utils/sentry.js';
```

### Basit Logging

```javascript
// Info log
logger.info('User logged in', { userId: '123' });
logInfo('User logged in', { userId: '123' });

// Error log
logger.error('Failed to process order', { orderId: '456' });
logError(error, { orderId: '456' });

// Warning log
logger.warn('Low stock detected', { productId: '789' });
logWarn('Low stock detected', { productId: '789' });
```

### Sentry Kullanımı

```javascript
// Exception capture
try {
  await someOperation();
} catch (error) {
  captureException(error, {
    context: 'order processing',
    orderId: '123'
  });
}

// Message capture
captureMessage('Payment gateway timeout', 'warning');

// User context
setUser({ _id: '123', email: 'user@example.com' });

// Breadcrumb
addBreadcrumb('Order placed', { orderId: '123' });
```

---

## 🔧 Yapılandırma

### Winston Konfigürasyonu

**Dosya:** `backend/utils/logger.js`

```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'tulumbak-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### Sentry Konfigürasyonu

**Dosya:** `backend/utils/sentry.js`

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1
});
```

---

## 🌍 Environment Variables

**`.env` dosyasına eklenmesi gerekenler:**

```env
# Logger
LOG_LEVEL=info                    # debug, verbose, info, warn, error

# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx
NODE_ENV=production              # development, staging, production
```

---

## 📊 Log Formatları

### Console Output (Development)

```
2024-10-28 14:30:15 [info]: User logged in {"userId":"123"}
```

### File Output (Production)

```json
{
  "timestamp": "2024-10-28 14:30:15",
  "level": "info",
  "message": "User logged in",
  "service": "tulumbak-backend",
  "userId": "123"
}
```

---

## 🔍 Error Handler Middleware

**Dosya:** `backend/middleware/errorHandler.js`

### Global Error Handler

Tüm hataları yakalar ve loglar:

```javascript
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err.message, {
    error: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Capture in Sentry
  captureException(err, {
    path: req.originalUrl,
    method: req.method
  });

  // Return error response
  res.status(err.status || 500).json({
    success: false,
    error: {
      status: err.status || 500,
      message: err.message,
      timestamp: new Date().toISOString()
    }
  });
};
```

### Async Handler Wrapper

Async route handler'ları wrap eder:

```javascript
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Kullanım:**

```javascript
import { asyncHandler } from '../middleware/errorHandler.js';

const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({});
  res.json({ success: true, orders });
});
```

---

## 📈 Best Practices

### 1. Logging

✅ **DO:**
```javascript
logger.info('Order created', { orderId, userId, amount });
logger.error('Payment failed', { orderId, error: err.message });
```

❌ **DON'T:**
```javascript
console.log('Order created');
console.error(err);
```

### 2. Sentry

✅ **DO:**
```javascript
try {
  await processOrder();
} catch (error) {
  captureException(error, { orderId });
  throw error;
}
```

❌ **DON'T:**
```javascript
try {
  await processOrder();
} catch (error) {
  console.log(error);
}
```

### 3. Context Ekleyin

Her zaman context ekleyin:

```javascript
logger.info('User action', {
  userId: user._id,
  action: 'viewed_product',
  productId: product._id,
  timestamp: Date.now()
});
```

---

## 🔒 Güvenlik

### Hassas Bilgiler

❌ **NEVER log:**
- Passwords
- Credit card numbers
- API keys
- JWT tokens
- Personal data (TC, passport)

✅ **Safe to log:**
- User IDs
- Order IDs
- Action names
- IP addresses (sanitized)
- Timestamps

---

## 📊 Monitoring

### Log Dosyaları

**Konum:** `backend/logs/`

**Dosyalar:**
- `error.log` - Sadece error seviyesi
- `combined.log` - Tüm loglar

**Log Rotation:**
- Maksimum dosya boyutu: 5MB
- Maksimum dosya sayısı: 5

### Sentry Dashboard

Sentry dashboard'da görebilirsiniz:
- Error frequency
- Error trends
- Affected users
- Error context
- Performance issues

---

## 🧪 Test Etme

### Logger Test

```bash
# API isteği gönder
curl http://localhost:4001/api/orders

# Log dosyalarını kontrol et
tail -f backend/logs/combined.log
```

### Sentry Test

```javascript
// Hata oluştur
import { captureException } from './utils/sentry.js';

captureException(new Error('Test error'), {
  test: true
});
```

---

## 🚀 Production Deployment

### 1. Log Rotation

**pm2-logrotate** kullan:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. Sentry DSN

Production'da mutlaka Sentry DSN ekle:

```env
SENTRY_DSN=https://xxx@sentry.io/xxx
NODE_ENV=production
LOG_LEVEL=info
```

### 3. Health Check

Server health endpoint'i:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

## 📞 Destek

Sorular ve öneriler için: backend@tulumbak.dev

---

**Son Güncelleme:** 2025-10-28  
**Versiyon:** 1.0  
**Durum:** Production Ready

