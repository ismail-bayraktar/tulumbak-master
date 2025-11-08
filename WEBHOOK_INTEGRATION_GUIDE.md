# 🔗 Kurye Paneli Webhook Entegrasyon Rehberi

Bu rehber, kurye paneli yazılımcıları için webhook entegrasyonu yaparken ihtiyaç duyacakları tüm bilgileri içerir.

---

## 📋 İçindekiler

1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Gereksinimler](#gereksinimler)
3. [Webhook Gönderme](#webhook-gönderme)
4. [Signature Oluşturma](#signature-oluşturma)
5. [Event Tipleri](#event-tipleri)
6. [Error Handling](#error-handling)
7. [Test Etme](#test-etme)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Hızlı Başlangıç

### 1. Secret Key Alın

Kurye paneli entegrasyonu için secret key almanız gerekiyor. Secret key'i güvenli bir şekilde saklayın ve asla public repository'lere commit etmeyin.

**Test Secret Key:** `sk_test_...` (Test ortamı için)
**Production Secret Key:** `sk_live_...` (Production için)

### 2. Webhook Endpoint

```
Production: https://api.tulumbak.com/api/webhook/courier
Test: https://test-api.tulumbak.com/api/webhook/courier
```

### 3. İlk Webhook'u Gönderin

```javascript
const crypto = require('crypto');

const secretKey = 'sk_test_...';
const webhookUrl = 'https://test-api.tulumbak.com/api/webhook/courier';
const timestamp = Date.now();
const webhookId = `courier-panel-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;

const payload = {
  event: 'order.status.updated',
  timestamp: timestamp,
  orderId: 'ORDER123',
  status: 'yolda',
  location: {
    latitude: 38.4237,
    longitude: 27.1428
  }
};

// Signature oluştur
const message = timestamp + '.' + JSON.stringify(payload);
const signature = crypto
  .createHmac('sha256', secretKey)
  .update(message)
  .digest('hex');

// Webhook gönder
fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': `sha256=${signature}`,
    'X-Webhook-Platform': 'courier-panel-v1',
    'X-Webhook-Id': webhookId,
    'X-Webhook-Timestamp': timestamp.toString()
  },
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

---

## ✅ Gereksinimler

### Headers (Zorunlu)

| Header | Açıklama | Örnek |
|--------|----------|-------|
| `Content-Type` | `application/json` olmalı | `application/json` |
| `X-Webhook-Signature` | HMAC-SHA256 signature | `sha256=abc123...` |
| `X-Webhook-Platform` | Platform identifier | `courier-panel-v1` |
| `X-Webhook-Id` | Unique request ID | `webhook-123-456` |
| `X-Webhook-Timestamp` | Unix timestamp (ms) | `1704067200000` |

### Payload (Zorunlu Alanlar)

- `event`: Event type (string)
- `timestamp`: Unix timestamp (number)
- `orderId`: Sipariş ID (string)

---

## 📤 Webhook Gönderme

### Node.js Örneği

```javascript
const crypto = require('crypto');
const axios = require('axios');

class WebhookClient {
  constructor(secretKey, webhookUrl, platform) {
    this.secretKey = secretKey;
    this.webhookUrl = webhookUrl;
    this.platform = platform;
  }

  generateSignature(timestamp, payload) {
    const message = timestamp + '.' + JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(message)
      .digest('hex');
    return `sha256=${signature}`;
  }

  generateWebhookId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${this.platform}-${timestamp}-${random}`;
  }

  async sendWebhook(event, payload) {
    const timestamp = Date.now();
    const webhookId = this.generateWebhookId();
    
    const fullPayload = {
      event,
      timestamp,
      ...payload
    };

    const signature = this.generateSignature(timestamp, fullPayload);

    try {
      const response = await axios.post(this.webhookUrl, fullPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Platform': this.platform,
          'X-Webhook-Id': webhookId,
          'X-Webhook-Timestamp': timestamp.toString()
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
}

// Kullanım
const client = new WebhookClient(
  'sk_test_...',
  'https://test-api.tulumbak.com/api/webhook/courier',
  'courier-panel-v1'
);

// Order status update
client.sendWebhook('order.status.updated', {
  orderId: 'ORDER123',
  status: 'yolda',
  location: {
    latitude: 38.4237,
    longitude: 27.1428
  }
});
```

### Python Örneği

```python
import hmac
import hashlib
import json
import time
import requests
import uuid

class WebhookClient:
    def __init__(self, secret_key, webhook_url, platform):
        self.secret_key = secret_key
        self.webhook_url = webhook_url
        self.platform = platform
    
    def generate_signature(self, timestamp, payload):
        message = f"{timestamp}.{json.dumps(payload, separators=(',', ':'))}"
        signature = hmac.new(
            self.secret_key.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return f"sha256={signature}"
    
    def generate_webhook_id(self):
        timestamp = int(time.time() * 1000)
        random = str(uuid.uuid4())[:8]
        return f"{self.platform}-{timestamp}-{random}"
    
    def send_webhook(self, event, payload):
        timestamp = int(time.time() * 1000)
        webhook_id = self.generate_webhook_id()
        
        full_payload = {
            "event": event,
            "timestamp": timestamp,
            **payload
        }
        
        signature = self.generate_signature(timestamp, full_payload)
        
        headers = {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Webhook-Platform": self.platform,
            "X-Webhook-Id": webhook_id,
            "X-Webhook-Timestamp": str(timestamp)
        }
        
        try:
            response = requests.post(
                self.webhook_url,
                json=full_payload,
                headers=headers
            )
            response.raise_for_status()
            return {
                "success": True,
                "data": response.json()
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e)
            }

# Kullanım
client = WebhookClient(
    "sk_test_...",
    "https://test-api.tulumbak.com/api/webhook/courier",
    "courier-panel-v1"
)

client.send_webhook("order.status.updated", {
    "orderId": "ORDER123",
    "status": "yolda",
    "location": {
        "latitude": 38.4237,
        "longitude": 27.1428
    }
})
```

---

## 🔐 Signature Oluşturma

### Algoritma

1. Timestamp ve payload'ı birleştir: `{timestamp}.{JSON.stringify(payload)}`
2. HMAC-SHA256 ile imzala
3. Hex formatında döndür: `sha256={signature}`

### Örnek

```javascript
const timestamp = 1704067200000;
const payload = {
  event: 'order.status.updated',
  timestamp: 1704067200000,
  orderId: 'ORDER123',
  status: 'yolda'
};

const message = timestamp + '.' + JSON.stringify(payload);
// "1704067200000.{\"event\":\"order.status.updated\",\"timestamp\":1704067200000,\"orderId\":\"ORDER123\",\"status\":\"yolda\"}"

const signature = crypto
  .createHmac('sha256', secretKey)
  .update(message)
  .digest('hex');
// "abc123def456..."

const headerValue = `sha256=${signature}`;
// "sha256=abc123def456..."
```

### Önemli Notlar

- Payload'ı JSON.stringify ile stringify ederken **spaces olmadan** yapın
- Timestamp ve payload'ı nokta (`.`) ile birleştirin
- Signature'ı `sha256=` prefix'i ile gönderin

---

## 📨 Event Tipleri

### order.status.updated

Sipariş durumu değiştiğinde gönderilir.

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

**Status Değerleri:**
- `"hazırlanıyor"`: Sipariş hazırlanıyor
- `"yolda"`: Kurye yola çıktı
- `"teslim edildi"`: Teslim edildi
- `"iptal"`: İptal edildi

### order.delivered

Sipariş teslim edildiğinde gönderilir.

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

### order.failed

Sipariş teslim edilemediğinde gönderilir.

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

**Reason Codes:**
- `ADDRESS_NOT_FOUND`: Adres bulunamadı
- `CUSTOMER_NOT_AVAILABLE`: Müşteri ulaşılamadı
- `PAYMENT_FAILED`: Ödeme başarısız
- `OTHER`: Diğer

---

## ⚠️ Error Handling

### Retry Strategy

Webhook gönderimi başarısız olursa:

1. **401 Unauthorized (Invalid Signature):**
   - Signature'ı kontrol edin
   - Secret key'in doğru olduğundan emin olun
   - Retry yapmayın (signature hatası düzelmez)

2. **400 Bad Request (Invalid Payload):**
   - Payload formatını kontrol edin
   - Required field'ları kontrol edin
   - Retry yapmayın (payload hatası düzelmez)

3. **404 Not Found (Order Not Found):**
   - Order ID'yi kontrol edin
   - Retry yapmayın (order yoksa düzelmez)

4. **409 Conflict (Duplicate Webhook):**
   - Aynı webhook ID ile tekrar göndermeyin
   - Retry yapmayın (zaten işlenmiş)

5. **429 Too Many Requests (Rate Limit):**
   - Rate limit'i aşmışsınız
   - `Retry-After` header'ındaki süre kadar bekleyin
   - Exponential backoff ile retry yapın

6. **500 Internal Server Error:**
   - Sunucu hatası
   - Exponential backoff ile retry yapın
   - Max 3 retry

### Retry Implementation

```javascript
async function sendWebhookWithRetry(client, event, payload, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await client.sendWebhook(event, payload);
    
    if (result.success) {
      return result;
    }
    
    lastError = result.error;
    
    // 401, 400, 404, 409 için retry yapma
    if ([401, 400, 404, 409].includes(result.error?.statusCode)) {
      break;
    }
    
    // Exponential backoff
    const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  return {
    success: false,
    error: lastError
  };
}
```

---

## 🧪 Test Etme

### Test Endpoint

```
POST https://test-api.tulumbak.com/api/webhook/courier
```

### Test Secret Key

Test secret key'i almak için bizimle iletişime geçin.

### Test Order ID'ler

- `TEST-ORDER-001`
- `TEST-ORDER-002`

### Test Senaryoları

1. **Başarılı Webhook:**
   ```javascript
   client.sendWebhook('order.status.updated', {
     orderId: 'TEST-ORDER-001',
     status: 'yolda'
   });
   ```

2. **Invalid Signature:**
   - Yanlış secret key kullanın
   - 401 hatası almalısınız

3. **Invalid Payload:**
   - `orderId` field'ını göndermeyin
   - 400 hatası almalısınız

4. **Duplicate Webhook:**
   - Aynı `X-Webhook-Id` ile 2 kez gönderin
   - İlk seferde 200, ikinci seferde 409 almalısınız

---

## 🚀 Production Deployment

### Checklist

- [ ] Production secret key alındı
- [ ] Production webhook URL kullanılıyor
- [ ] Error handling implement edildi
- [ ] Retry mechanism implement edildi
- [ ] Logging implement edildi
- [ ] Monitoring setup edildi
- [ ] Test webhook'ları başarılı

### Production URL

```
https://api.tulumbak.com/api/webhook/courier
```

### Monitoring

Webhook gönderimlerini monitor edin:
- Success rate
- Error rate
- Response time
- Retry count

---

## 🔧 Troubleshooting

### Problem: Invalid Signature (401)

**Çözüm:**
- Secret key'in doğru olduğundan emin olun
- Timestamp ve payload'ın doğru birleştirildiğinden emin olun
- JSON.stringify'ın spaces olmadan yapıldığından emin olun

### Problem: Order Not Found (404)

**Çözüm:**
- Order ID'nin doğru olduğundan emin olun
- Order'ın sistemde mevcut olduğundan emin olun

### Problem: Rate Limit (429)

**Çözüm:**
- Webhook gönderim sıklığını azaltın
- `Retry-After` header'ındaki süre kadar bekleyin

### Problem: Timeout

**Çözüm:**
- Timeout süresini artırın (min 30 saniye)
- Retry mechanism kullanın

---

## 📞 Destek

Sorularınız için:
- **Email:** tech@tulumbak.com
- **Documentation:** https://docs.tulumbak.com/webhooks
- **Status Page:** https://status.tulumbak.com

---

## 📝 Notlar

- Webhook'ları asenkron olarak gönderin (blocking yapmayın)
- Her webhook için unique ID kullanın
- Signature'ı her zaman doğru oluşturun
- Error handling'i mutlaka implement edin
- Production'da monitoring yapın

