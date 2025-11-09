# 🚀 Kurye Paneli Webhook Altyapısı Tasarım Dokümantasyonu

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Sistem Mimarisi](#sistem-mimarisi)
3. [Webhook Event Tipleri](#webhook-event-tipleri)
4. [API Endpoint Tasarımı](#api-endpoint-tasarımı)
5. [Güvenlik Mekanizmaları](#güvenlik-mekanizmaları)
6. [Veri Modelleri](#veri-modelleri)
7. [Error Handling & Retry Logic](#error-handling--retry-logic)
8. [Logging & Monitoring](#logging--monitoring)
9. [Implementation Plan](#implementation-plan)

---

## 🎯 Genel Bakış

### Amaç
Kurye paneli ile haberleşmek için güvenli, ölçeklenebilir ve bakımı kolay bir webhook altyapısı oluşturmak.

### Senaryo
- **Kurye Paneli** → Webhook gönderir (sipariş durumu güncellemeleri)
- **Bizim Sistem** → Webhook'ları alır, doğrular ve işler
- **Çoklu Platform Desteği**: Farklı kurye platformlarından webhook alabilmeli

### Best Practices
- ✅ RESTful API design
- ✅ Webhook signature verification (HMAC)
- ✅ Idempotency (duplicate request handling)
- ✅ Retry mechanism
- ✅ Comprehensive logging
- ✅ Rate limiting
- ✅ Error handling

---

## 🏗️ Sistem Mimarisi

```
┌─────────────────┐
│  Kurye Paneli   │
│  (External)     │
└────────┬────────┘
         │
         │ POST /api/webhook/courier
         │ (with signature)
         ▼
┌─────────────────────────────────┐
│   Webhook Receiver Endpoint     │
│   - Signature Verification      │
│   - Request Validation          │
│   - Rate Limiting               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Webhook Handler Service       │
│   - Event Routing              │
│   - Idempotency Check          │
│   - Business Logic             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Order Service                 │
│   - Update Order Status         │
│   - Update Courier Status       │
│   - Add Status History         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Notification Service          │
│   - SMS/Email Notifications    │
│   - Admin Alerts               │
└─────────────────────────────────┘
```

---

## 📨 Webhook Event Tipleri

### 1. Order Status Update
**Event Type:** `order.status.updated`

**Payload:**
```json
{
  "event": "order.status.updated",
  "timestamp": 1704067200000,
  "orderId": "ORDER123",
  "courierTrackingId": "COURIER456",
  "status": "yolda",
  "location": {
    "latitude": 38.4237,
    "longitude": 27.1428,
    "address": "İzmir, Konak"
  },
  "estimatedDelivery": 1704070800000,
  "note": "Kurye yola çıktı",
  "metadata": {
    "courierId": "COURIER123",
    "courierName": "Ahmet Yılmaz",
    "courierPhone": "+905551234567"
  }
}
```

### 2. Order Delivered
**Event Type:** `order.delivered`

**Payload:**
```json
{
  "event": "order.delivered",
  "timestamp": 1704070800000,
  "orderId": "ORDER123",
  "courierTrackingId": "COURIER456",
  "actualDelivery": 1704070800000,
  "deliveryProof": {
    "type": "signature",
    "url": "https://courier-panel.com/signatures/abc123.jpg"
  },
  "recipient": {
    "name": "Mehmet Demir",
    "phone": "+905559876543"
  },
  "note": "Teslim edildi",
  "metadata": {
    "courierId": "COURIER123",
    "deliveryTime": 45
  }
}
```

### 3. Order Failed/Cancelled
**Event Type:** `order.failed` veya `order.cancelled`

**Payload:**
```json
{
  "event": "order.failed",
  "timestamp": 1704070800000,
  "orderId": "ORDER123",
  "courierTrackingId": "COURIER456",
  "reason": "Müşteri adresi bulunamadı",
  "reasonCode": "ADDRESS_NOT_FOUND",
  "note": "3 kez denendi, ulaşılamadı",
  "metadata": {
    "courierId": "COURIER123",
    "attempts": 3
  }
}
```

### 4. Courier Location Update
**Event Type:** `courier.location.updated`

**Payload:**
```json
{
  "event": "courier.location.updated",
  "timestamp": 1704067200000,
  "courierId": "COURIER123",
  "location": {
    "latitude": 38.4237,
    "longitude": 27.1428,
    "accuracy": 10
  },
  "orderId": "ORDER123"
}
```

### 5. Order Assigned to Courier
**Event Type:** `order.assigned`

**Payload:**
```json
{
  "event": "order.assigned",
  "timestamp": 1704067200000,
  "orderId": "ORDER123",
  "courierTrackingId": "COURIER456",
  "courier": {
    "id": "COURIER123",
    "name": "Ahmet Yılmaz",
    "phone": "+905551234567",
    "vehicleType": "motor"
  },
  "estimatedPickup": 1704069000000
}
```

---

## 🔌 API Endpoint Tasarımı

### POST /api/webhook/courier

**Açıklama:** Kurye panelinden gelen webhook'ları alır ve işler.

**Headers:**
```
Content-Type: application/json
X-Webhook-Signature: sha256=abc123...
X-Webhook-Platform: courier-panel-v1
X-Webhook-Id: unique-request-id-123
X-Webhook-Timestamp: 1704067200000
```

**Request Body:**
```json
{
  "event": "order.status.updated",
  "timestamp": 1704067200000,
  "orderId": "ORDER123",
  "courierTrackingId": "COURIER456",
  "status": "yolda",
  "location": {
    "latitude": 38.4237,
    "longitude": 27.1428
  },
  "metadata": {}
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "webhookId": "webhook-123",
  "processedAt": 1704067201000
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "Invalid signature",
  "code": "INVALID_SIGNATURE"
}
```

**Response (Error - 409):**
```json
{
  "success": false,
  "error": "Duplicate webhook",
  "code": "DUPLICATE_WEBHOOK",
  "webhookId": "webhook-123"
}
```

---

## 🔒 Güvenlik Mekanizmaları

### 1. Webhook Signature Verification

**HMAC-SHA256 Signature:**
```
signature = HMAC-SHA256(
  secret_key,
  timestamp + "." + request_body
)
```

**Verification Process:**
1. Extract signature from `X-Webhook-Signature` header
2. Get timestamp from `X-Webhook-Timestamp` header
3. Reconstruct signature using secret key
4. Compare signatures (constant-time comparison)
5. Check timestamp (prevent replay attacks - max 5 minutes old)

### 2. Platform Authentication

Her kurye platformu için ayrı secret key:
```javascript
{
  platform: "courier-panel-v1",
  secretKey: "sk_live_abc123...",
  enabled: true
}
```

### 3. Rate Limiting

- **Per Platform:** 100 requests/minute
- **Per IP:** 200 requests/minute
- **Burst:** 20 requests/second

### 4. Idempotency

**Unique Request ID:**
- `X-Webhook-Id` header'dan alınır
- Database'de saklanır
- Duplicate request'ler reddedilir (409 Conflict)

---

## 📊 Veri Modelleri

### WebhookLog Model

```javascript
{
  _id: ObjectId,
  webhookId: String, // Unique request ID
  platform: String, // "courier-panel-v1"
  event: String, // "order.status.updated"
  orderId: String,
  courierTrackingId: String,
  payload: Object, // Original payload
  signature: String, // Received signature
  status: String, // "success" | "failed" | "pending"
  statusCode: Number, // HTTP status code
  response: Object, // Response sent
  error: String, // Error message if failed
  retryCount: Number, // Retry attempts
  processedAt: Number, // Timestamp
  createdAt: Number,
  updatedAt: Number
}
```

### WebhookConfig Model

```javascript
{
  _id: ObjectId,
  platform: String, // Unique platform identifier
  name: String, // "Courier Panel v1"
  secretKey: String, // Encrypted
  webhookUrl: String, // Our webhook endpoint
  enabled: Boolean,
  events: [String], // Allowed events
  rateLimit: {
    perMinute: Number,
    perHour: Number
  },
  retryConfig: {
    maxRetries: Number,
    retryDelay: Number // milliseconds
  },
  createdAt: Number,
  updatedAt: Number
}
```

---

## ⚠️ Error Handling & Retry Logic

### Error Types

1. **Validation Errors (400)**
   - Invalid payload structure
   - Missing required fields
   - Invalid data types

2. **Authentication Errors (401)**
   - Invalid signature
   - Missing signature
   - Expired timestamp

3. **Not Found Errors (404)**
   - Order not found
   - Invalid orderId

4. **Conflict Errors (409)**
   - Duplicate webhook
   - Idempotency violation

5. **Server Errors (500)**
   - Database errors
   - Internal processing errors

### Retry Strategy

**Automatic Retry:**
- Only for 5xx errors
- Max 3 retries
- Exponential backoff: 1s, 2s, 4s
- Store failed webhooks for manual review

**Manual Retry:**
- Admin panel'den retry yapılabilir
- Failed webhooks listesi
- Retry button

---

## 📝 Logging & Monitoring

### Log Levels

1. **INFO:** Webhook received, processed successfully
2. **WARN:** Invalid signature, duplicate request
3. **ERROR:** Processing failed, database error

### Log Structure

```javascript
{
  level: "info",
  message: "Webhook processed",
  webhookId: "webhook-123",
  platform: "courier-panel-v1",
  event: "order.status.updated",
  orderId: "ORDER123",
  processingTime: 45, // milliseconds
  timestamp: 1704067200000
}
```

### Metrics to Track

- Webhook success rate
- Average processing time
- Error rate by type
- Platform-specific metrics
- Retry rate

---

## 🛠️ Implementation Plan

### Phase 1: Core Infrastructure (Priority: HIGH)

1. **WebhookConfig Model** ✅
   - Create model
   - CRUD operations
   - Secret key encryption

2. **WebhookLog Model** ✅
   - Create model
   - Indexes (webhookId, orderId, platform)

3. **Webhook Receiver Endpoint** ✅
   - POST /api/webhook/courier
   - Signature verification middleware
   - Request validation

4. **Webhook Handler Service** ✅
   - Event routing
   - Idempotency check
   - Order update logic

### Phase 2: Security & Validation (Priority: HIGH)

1. **Signature Verification Middleware** ✅
   - HMAC-SHA256 implementation
   - Timestamp validation
   - Constant-time comparison

2. **Request Validation** ✅
   - Payload schema validation
   - Required fields check
   - Data type validation

3. **Rate Limiting** ✅
   - Per-platform rate limiting
   - Per-IP rate limiting

### Phase 3: Business Logic (Priority: MEDIUM)

1. **Order Status Update Handler** ✅
   - Update order.courierStatus
   - Add to statusHistory
   - Update estimatedDelivery

2. **Order Delivered Handler** ✅
   - Update order.actualDelivery
   - Update order.payment status
   - Trigger notifications

3. **Order Failed Handler** ✅
   - Update order status
   - Log failure reason
   - Notify admin

### Phase 4: Error Handling & Retry (Priority: MEDIUM)

1. **Error Handler** ✅
   - Error classification
   - Proper HTTP status codes
   - Error response formatting

2. **Retry Mechanism** ✅
   - Automatic retry for 5xx errors
   - Exponential backoff
   - Max retry limit

3. **Failed Webhook Management** ✅
   - Store failed webhooks
   - Admin panel for review
   - Manual retry functionality

### Phase 5: Monitoring & Logging (Priority: LOW)

1. **Comprehensive Logging** ✅
   - Winston logger integration
   - Structured logging
   - Log levels

2. **Metrics Collection** ✅
   - Success rate tracking
   - Processing time metrics
   - Error rate tracking

3. **Admin Dashboard** ✅
   - Webhook logs view
   - Failed webhooks list
   - Retry functionality

---

## 📋 Kurye Paneli İçin Gereken Bilgiler

### Bizden İsteyecekleri:

1. **Webhook Endpoint URL:**
   ```
   https://api.tulumbak.com/api/webhook/courier
   ```

2. **Secret Key:**
   - Her platform için unique secret key
   - HMAC-SHA256 için kullanılacak

3. **Expected Headers:**
   - `X-Webhook-Signature`: HMAC signature
   - `X-Webhook-Platform`: Platform identifier
   - `X-Webhook-Id`: Unique request ID
   - `X-Webhook-Timestamp`: Unix timestamp

4. **Expected Payload Format:**
   - Event type
   - Order ID
   - Status updates
   - Location data (optional)

### Onlardan Alacağımız:

1. **Platform Identifier:**
   - Unique platform name (e.g., "courier-panel-v1")

2. **Webhook Event Types:**
   - Hangi event'leri gönderecekler
   - Event payload formatları

3. **Secret Key:**
   - Webhook signature için kullanılacak secret key

4. **Test Environment:**
   - Test webhook URL'i
   - Test secret key

---

## 🔄 Webhook Flow Example

### 1. Order Status Update Flow

```
1. Kurye Paneli → Order status değişti
2. Kurye Paneli → Webhook hazırla:
   - Event: "order.status.updated"
   - Payload: { orderId, status, location }
   - Signature: HMAC-SHA256(secret, timestamp + payload)
3. POST /api/webhook/courier
4. Signature verification ✅
5. Idempotency check ✅
6. Find order by orderId
7. Update order.courierStatus
8. Add to order.statusHistory
9. Trigger notifications (SMS/Email)
10. Response: 200 OK
```

### 2. Error Flow

```
1. Kurye Paneli → Webhook gönder
2. POST /api/webhook/courier
3. Signature verification ❌
4. Response: 401 Unauthorized
5. Log error
6. Kurye Paneli → Retry (if configured)
```

---

## ✅ Checklist

### Backend Implementation
- [ ] WebhookConfig model
- [ ] WebhookLog model
- [ ] Webhook receiver endpoint
- [ ] Signature verification middleware
- [ ] Request validation middleware
- [ ] Event handlers (order.status.updated, order.delivered, etc.)
- [ ] Idempotency check
- [ ] Error handling
- [ ] Retry mechanism
- [ ] Logging integration
- [ ] Rate limiting
- [ ] Admin API for webhook management

### Testing
- [ ] Unit tests for signature verification
- [ ] Unit tests for event handlers
- [ ] Integration tests for webhook flow
- [ ] Error scenario tests
- [ ] Idempotency tests

### Documentation
- [ ] API documentation (Swagger)
- [ ] Webhook integration guide
- [ ] Event type documentation
- [ ] Error code documentation

---

## 🚀 Next Steps

1. **Review & Approval:** Bu tasarımı kurye paneli yazılımcısı ile paylaş
2. **Secret Key Exchange:** Güvenli bir şekilde secret key'leri paylaş
3. **Test Environment Setup:** Test webhook endpoint'i hazırla
4. **Implementation:** Phase 1'den başla
5. **Testing:** Test webhook'ları gönder
6. **Production:** Production'a deploy et

---

## 📞 İletişim & Sorular

Bu tasarım hakkında sorularınız varsa veya değişiklik önerileriniz varsa lütfen paylaşın.

**Not:** Bu tasarım, kurye paneli yazılımcısının webhook'ları yazmasından önce altyapının hazır olması için oluşturulmuştur. Webhook'lar geldiğinde sistem hazır olacak.

