# 📡 Webhook API Specification

## Base URL
```
Production: https://api.tulumbak.com/api/webhook
Development: http://localhost:4001/api/webhook
```

---

## POST /courier

Kurye panelinden gelen webhook'ları alır ve işler.

### Request

#### Headers
| Header | Required | Description | Example |
|--------|----------|-------------|---------|
| `Content-Type` | Yes | Must be `application/json` | `application/json` |
| `X-Webhook-Signature` | Yes | HMAC-SHA256 signature | `sha256=abc123...` |
| `X-Webhook-Platform` | Yes | Platform identifier | `courier-panel-v1` |
| `X-Webhook-Id` | Yes | Unique request ID (for idempotency) | `webhook-123-456` |
| `X-Webhook-Timestamp` | Yes | Unix timestamp (milliseconds) | `1704067200000` |

#### Signature Generation

```javascript
const crypto = require('crypto');

function generateSignature(secretKey, timestamp, payload) {
  const message = timestamp + '.' + JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');
  return `sha256=${signature}`;
}

// Example
const secretKey = 'sk_live_abc123...';
const timestamp = Date.now();
const payload = { event: 'order.status.updated', ... };
const signature = generateSignature(secretKey, timestamp, payload);
```

#### Request Body

**Schema:**
```json
{
  "event": "string (required)",
  "timestamp": "number (required)",
  "orderId": "string (required)",
  "courierTrackingId": "string (optional)",
  "status": "string (optional)",
  "location": {
    "latitude": "number (optional)",
    "longitude": "number (optional)",
    "address": "string (optional)"
  },
  "estimatedDelivery": "number (optional)",
  "actualDelivery": "number (optional)",
  "note": "string (optional)",
  "metadata": "object (optional)"
}
```

**Example:**
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
    "address": "İzmir, Konak, Atatürk Caddesi No:123"
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

### Response

#### Success (200 OK)
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "webhookId": "webhook-123",
  "processedAt": 1704067201000
}
```

#### Error Responses

**400 Bad Request - Invalid Payload**
```json
{
  "success": false,
  "error": "Invalid payload",
  "code": "INVALID_PAYLOAD",
  "details": {
    "field": "orderId",
    "message": "orderId is required"
  }
}
```

**401 Unauthorized - Invalid Signature**
```json
{
  "success": false,
  "error": "Invalid signature",
  "code": "INVALID_SIGNATURE"
}
```

**401 Unauthorized - Expired Timestamp**
```json
{
  "success": false,
  "error": "Request timestamp too old",
  "code": "EXPIRED_TIMESTAMP",
  "maxAge": 300000
}
```

**404 Not Found - Order Not Found**
```json
{
  "success": false,
  "error": "Order not found",
  "code": "ORDER_NOT_FOUND",
  "orderId": "ORDER123"
}
```

**409 Conflict - Duplicate Webhook**
```json
{
  "success": false,
  "error": "Duplicate webhook",
  "code": "DUPLICATE_WEBHOOK",
  "webhookId": "webhook-123"
}
```

**429 Too Many Requests - Rate Limit**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "requestId": "req-123"
}
```

---

## Event Types

### 1. order.status.updated

**Description:** Sipariş durumu güncellendiğinde gönderilir.

**Required Fields:**
- `event`: `"order.status.updated"`
- `timestamp`: Unix timestamp
- `orderId`: Sipariş ID
- `status`: Durum (`"hazırlanıyor"`, `"yolda"`, `"teslim edildi"`, `"iptal"`)

**Optional Fields:**
- `courierTrackingId`: Kurye takip ID
- `location`: Konum bilgisi
- `estimatedDelivery`: Tahmini teslimat zamanı
- `note`: Not
- `metadata`: Ek bilgiler

**Example:**
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
    "courierName": "Ahmet Yılmaz"
  }
}
```

### 2. order.delivered

**Description:** Sipariş teslim edildiğinde gönderilir.

**Required Fields:**
- `event`: `"order.delivered"`
- `timestamp`: Unix timestamp
- `orderId`: Sipariş ID
- `actualDelivery`: Teslimat zamanı (Unix timestamp)

**Optional Fields:**
- `courierTrackingId`: Kurye takip ID
- `deliveryProof`: Teslimat kanıtı
- `recipient`: Teslim alan kişi bilgileri
- `note`: Not
- `metadata`: Ek bilgiler

**Example:**
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

### 3. order.failed

**Description:** Sipariş teslim edilemediğinde gönderilir.

**Required Fields:**
- `event`: `"order.failed"`
- `timestamp`: Unix timestamp
- `orderId`: Sipariş ID
- `reason`: Hata nedeni
- `reasonCode`: Hata kodu

**Optional Fields:**
- `courierTrackingId`: Kurye takip ID
- `note`: Not
- `metadata`: Ek bilgiler (attempts, etc.)

**Example:**
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

### 4. order.cancelled

**Description:** Sipariş iptal edildiğinde gönderilir.

**Required Fields:**
- `event`: `"order.cancelled"`
- `timestamp`: Unix timestamp
- `orderId`: Sipariş ID
- `reason`: İptal nedeni

**Optional Fields:**
- `courierTrackingId`: Kurye takip ID
- `note`: Not
- `metadata`: Ek bilgiler

**Example:**
```json
{
  "event": "order.cancelled",
  "timestamp": 1704070800000,
  "orderId": "ORDER123",
  "courierTrackingId": "COURIER456",
  "reason": "Müşteri iptal etti",
  "note": "Müşteri tarafından iptal edildi",
  "metadata": {
    "courierId": "COURIER123"
  }
}
```

### 5. order.assigned

**Description:** Sipariş kuryeye atandığında gönderilir.

**Required Fields:**
- `event`: `"order.assigned"`
- `timestamp`: Unix timestamp
- `orderId`: Sipariş ID
- `courier`: Kurye bilgileri

**Optional Fields:**
- `courierTrackingId`: Kurye takip ID
- `estimatedPickup`: Tahmini toplama zamanı
- `note`: Not
- `metadata`: Ek bilgiler

**Example:**
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
  "estimatedPickup": 1704069000000,
  "note": "Kurye atandı",
  "metadata": {}
}
```

### 6. courier.location.updated

**Description:** Kurye konumu güncellendiğinde gönderilir.

**Required Fields:**
- `event`: `"courier.location.updated"`
- `timestamp`: Unix timestamp
- `courierId`: Kurye ID
- `location`: Konum bilgisi

**Optional Fields:**
- `orderId`: İlgili sipariş ID
- `metadata`: Ek bilgiler

**Example:**
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
  "orderId": "ORDER123",
  "metadata": {}
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_PAYLOAD` | 400 | Request payload is invalid |
| `MISSING_FIELD` | 400 | Required field is missing |
| `INVALID_SIGNATURE` | 401 | Webhook signature is invalid |
| `EXPIRED_TIMESTAMP` | 401 | Request timestamp is too old |
| `ORDER_NOT_FOUND` | 404 | Order with given ID not found |
| `DUPLICATE_WEBHOOK` | 409 | Webhook with same ID already processed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Per Platform:** 100 requests/minute
- **Per IP:** 200 requests/minute
- **Burst:** 20 requests/second

Rate limit aşıldığında `429 Too Many Requests` döner ve `Retry-After` header'ı ile tekrar deneme süresi belirtilir.

---

## Idempotency

Aynı `X-Webhook-Id` ile gönderilen webhook'lar sadece bir kez işlenir. Duplicate request'ler `409 Conflict` ile reddedilir.

**Best Practice:**
- Her webhook için unique ID kullanın
- Retry durumunda aynı ID'yi kullanın
- ID formatı: `{platform}-{timestamp}-{random}`

---

## Testing

### Test Endpoint
```
POST https://api.tulumbak.com/api/webhook/courier
```

### Test Secret Key
Test için ayrı bir secret key sağlanacak.

### Test Order ID
Test için kullanılacak order ID'ler:
- `TEST-ORDER-001`
- `TEST-ORDER-002`

### Test Webhook Example

```bash
curl -X POST https://api.tulumbak.com/api/webhook/courier \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: sha256=..." \
  -H "X-Webhook-Platform: courier-panel-v1" \
  -H "X-Webhook-Id: test-webhook-123" \
  -H "X-Webhook-Timestamp: 1704067200000" \
  -d '{
    "event": "order.status.updated",
    "timestamp": 1704067200000,
    "orderId": "TEST-ORDER-001",
    "status": "yolda",
    "location": {
      "latitude": 38.4237,
      "longitude": 27.1428
    }
  }'
```

---

## Support

Sorularınız için:
- Email: tech@tulumbak.com
- Documentation: https://docs.tulumbak.com/webhooks

