# MuditaKurye Integration Implementation

**Last Updated**: 2025-11-13

Tulumbak's implementation guide for MuditaKurye courier service integration.

## Overview

This document describes how Tulumbak implements the MuditaKurye courier integration. For detailed MuditaKurye API documentation, see the external documentation in `/Docs/MuditaKurye Entegrasyon Dokümantasyonu/`.

### Features

- **Order Submission**: Submit orders to MuditaKurye API
- **Webhook Integration**: Receive real-time delivery status updates
- **Circuit Breaker**: Fault-tolerant API calls
- **Retry Logic**: Automatic retry for failed operations
- **Dead Letter Queue**: Track and manually retry failed operations
- **Webhook-Only Mode**: Receive updates without API submission

---

## Configuration

### Environment Variables

```env
# Enable/Disable Integration
MUDITA_ENABLED=true
MUDITA_TEST_MODE=false

# API Endpoints
MUDITA_API_URL=https://api.muditakurye.com.tr

# Credentials (Get from MuditaKurye panel)
MUDITA_API_KEY=yk_YOUR_API_KEY
MUDITA_API_SECRET=your_api_secret
MUDITA_WEBHOOK_SECRET=wh_YOUR_WEBHOOK_SECRET
MUDITA_RESTAURANT_ID=rest_YOUR_RESTAURANT_ID

# Operating Mode
MUDITA_WEBHOOK_ONLY_MODE=false

# Circuit Breaker
CIRCUIT_BREAKER_ENABLED=true
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_TIMEOUT=60000
CIRCUIT_BREAKER_RESET_TIMEOUT=120000

# Retry Configuration
RETRY_MAX_ATTEMPTS=5
RETRY_BASE_DELAY=1000
RETRY_MAX_DELAY=300000
```

### Database Configuration

Configuration is stored in `courierintegrationconfigs` collection:

```javascript
{
  platform: 'muditakurye',
  enabled: true,
  testMode: false,
  apiUrl: 'https://api.muditakurye.com.tr',
  webhookUrl: 'https://tulumbak.com/api/webhook/muditakurye',
  webhookSecret: 'wh_encrypted_secret',
  credentials: {
    apiKey: 'yk_encrypted_key',
    apiSecret: 'encrypted_secret',
    restaurantId: 'rest_YOUR_ID'
  },
  webhookOnlyMode: false,
  circuitBreaker: {
    enabled: true,
    failureThreshold: 5,
    timeout: 60000,
    resetTimeout: 120000
  },
  retry: {
    enabled: true,
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 300000
  }
}
```

---

## Operating Modes

### Full Integration Mode

**Configuration:**
```env
MUDITA_WEBHOOK_ONLY_MODE=false
```

**Flow:**
1. Order created in Tulumbak
2. Submit order to MuditaKurye API
3. Receive tracking number
4. Store tracking number in database
5. Receive webhook updates
6. Update order status

**Use Case:** Complete automation with API submission

### Webhook-Only Mode

**Configuration:**
```env
MUDITA_WEBHOOK_ONLY_MODE=true
```

**Flow:**
1. Order created in Tulumbak
2. Manually create order in MuditaKurye panel
3. MuditaKurye sends webhook with order info
4. Tulumbak receives webhook and updates status

**Use Case:** Manual order creation, automated status tracking

---

## Implementation

### Order Submission

**Controller:**
```javascript
// OrderController.js
export const sendToCourier = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    // Prepare courier data
    const courierData = {
      orderId: order.orderId,
      customerName: order.address.firstName + ' ' + order.address.lastName,
      customerPhone: order.address.phone,
      deliveryAddress: {
        street: order.address.street,
        district: order.address.district,
        city: order.address.city,
        zipCode: order.address.zipCode,
        coordinates: {
          lat: order.address.coordinates?.lat,
          lng: order.address.coordinates?.lng
        }
      },
      items: order.items,
      amount: order.amount,
      paymentMethod: order.paymentMethod,
      notes: order.notes
    };

    // Submit to MuditaKurye
    const result = await CircuitBreakerService.execute(
      'muditakurye-api',
      async () => {
        return await MuditaKuryeService.submitOrder(courierData);
      },
      async () => {
        // Fallback: Queue for manual retry
        await DeadLetterQueueModel.create({
          operation: 'courier_submission',
          payload: courierData,
          priority: 'high'
        });
        return { success: false, queued: true };
      }
    );

    if (result.success) {
      // Update order with tracking info
      order.trackingNumber = result.trackingNumber;
      order.status = 'assigned';
      await order.save();

      res.json({
        success: true,
        trackingNumber: result.trackingNumber
      });
    } else if (result.queued) {
      res.json({
        success: false,
        message: 'Order queued for manual processing',
        queued: true
      });
    } else {
      throw new Error('Failed to submit order to courier');
    }
  } catch (error) {
    logger.error('Error sending to courier', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Webhook Handler

**Controller:**
```javascript
// WebhookController.js
export const handleMuditaWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-mudita-signature'];
    const payload = req.body;

    // Verify webhook signature
    const config = await CourierIntegrationConfigModel.findOne({
      platform: 'muditakurye',
      enabled: true
    });

    const isValid = WebhookSecurity.verifySignature(
      payload,
      signature,
      config.webhookSecret
    );

    if (!isValid) {
      logger.warn('Invalid webhook signature', { payload });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process webhook
    const { event, orderId, trackingNumber, status, location } = payload;

    logger.info('MuditaKurye webhook received', {
      event,
      orderId,
      status
    });

    // Find order by orderId or trackingNumber
    const order = await Order.findOne({
      $or: [
        { orderId: orderId },
        { trackingNumber: trackingNumber }
      ]
    });

    if (!order) {
      logger.error('Order not found for webhook', { orderId, trackingNumber });
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    const statusMapping = {
      'assigned': 'assigned',
      'picked_up': 'in_transit',
      'in_transit': 'in_transit',
      'delivered': 'delivered',
      'failed': 'failed',
      'cancelled': 'cancelled'
    };

    const newStatus = statusMapping[status] || order.status;

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      notes: `Courier update: ${status}`
    });

    // Update tracking info if provided
    if (trackingNumber && !order.trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    // Send email notification
    if (newStatus === 'delivered') {
      await emailService.sendReactEmail(
        'delivery-notification',
        {
          orderId: order.orderId,
          customerName: order.address.firstName,
          deliveryDate: new Date()
        },
        order.userId.email
      );
    }

    res.json({ success: true, received: true });
  } catch (error) {
    logger.error('Webhook processing error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

---

## Circuit Breaker Implementation

**Service:**
```javascript
// CircuitBreakerService.js
class CircuitBreakerService {
  constructor() {
    this.circuits = new Map();
  }

  async execute(key, operation, fallback) {
    let circuit = this.circuits.get(key);

    if (!circuit) {
      circuit = {
        state: 'CLOSED',
        failureCount: 0,
        nextAttempt: Date.now()
      };
      this.circuits.set(key, circuit);
    }

    // Circuit is OPEN
    if (circuit.state === 'OPEN') {
      if (Date.now() < circuit.nextAttempt) {
        logger.warn('Circuit breaker is OPEN', { key });
        return fallback ? await fallback() : { success: false, circuit: 'OPEN' };
      }
      // Try to close circuit (HALF-OPEN)
      circuit.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();

      // Success - close circuit
      if (circuit.state === 'HALF_OPEN') {
        circuit.state = 'CLOSED';
        circuit.failureCount = 0;
        logger.info('Circuit breaker closed', { key });
      }

      return result;
    } catch (error) {
      circuit.failureCount++;

      if (circuit.failureCount >= FAILURE_THRESHOLD) {
        circuit.state = 'OPEN';
        circuit.nextAttempt = Date.now() + RESET_TIMEOUT;
        logger.error('Circuit breaker opened', {
          key,
          failures: circuit.failureCount
        });
      }

      if (fallback) {
        return await fallback();
      }
      throw error;
    }
  }
}
```

---

## Retry Logic Implementation

**Service:**
```javascript
// RetryService.js
class RetryService {
  static async executeWithRetry(operation, options = {}) {
    const {
      maxAttempts = 5,
      baseDelay = 1000,
      maxDelay = 300000,
      shouldRetry = () => true
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts || !shouldRetry(error)) {
          throw error;
        }

        // Calculate delay with exponential backoff + jitter
        const exponentialDelay = Math.min(
          baseDelay * Math.pow(2, attempt - 1),
          maxDelay
        );
        const jitter = Math.random() * 1000;
        const delay = exponentialDelay + jitter;

        logger.warn('Retry attempt', {
          attempt,
          maxAttempts,
          delay,
          error: error.message
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
```

---

## Dead Letter Queue

**Purpose:** Track and manually retry failed courier operations

**Model:**
```javascript
{
  operation: 'courier_submission',
  payload: {
    orderId: 'ORD-1699707600000',
    // ... full order data
  },
  error: {
    message: 'Connection timeout',
    code: 'ETIMEDOUT',
    stack: '...'
  },
  attempts: 3,
  maxAttempts: 5,
  lastAttemptAt: Date,
  nextRetryAt: Date,
  priority: 'high',
  status: 'pending'
}
```

**Admin UI:**
View and manually retry failed operations in admin panel at `/dlq` route

---

## Testing

### Test Order Submission

```javascript
// Test with Postman or curl
POST /api/order/send-to-courier
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011"
}
```

### Test Webhook

```javascript
// Simulate webhook from MuditaKurye
POST /api/webhook/muditakurye
X-Mudita-Signature: <signature>
Content-Type: application/json

{
  "event": "delivery.status.update",
  "orderId": "ORD-1699707600000",
  "trackingNumber": "TRK-1699707600000",
  "status": "delivered",
  "timestamp": "2024-11-15T14:30:00.000Z",
  "location": {
    "lat": 38.4192,
    "lng": 27.1287
  }
}
```

---

## Monitoring

### Logs

```bash
# View courier integration logs
tail -f backend/logs/courier-integration.log

# View webhook logs
tail -f backend/logs/webhook.log
```

### Metrics

Monitor in admin panel:
- Total orders submitted
- Success rate
- Average response time
- Circuit breaker status
- Failed operations in DLQ

---

## Troubleshooting

### Order Submission Fails

**Check:**
1. API credentials are correct
2. Circuit breaker is not open
3. Network connectivity
4. Order data is valid

**View Logs:**
```bash
grep "courier_submission" backend/logs/app.log
```

### Webhook Not Received

**Check:**
1. Webhook URL is accessible from internet
2. Webhook secret is correct
3. Signature verification is working
4. MuditaKurye panel shows webhook configured

**Test Webhook:**
```bash
# Check webhook endpoint is reachable
curl -X POST https://your-domain.com/api/webhook/muditakurye \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'
```

---

**For MuditaKurye API details, see**: `/Docs/MuditaKurye Entegrasyon Dokümantasyonu/`
**For service layer documentation, see**: [Services Documentation](../Backend/Services.md)
**For API documentation, see**: [API Reference](../Backend/API-Reference.md)
