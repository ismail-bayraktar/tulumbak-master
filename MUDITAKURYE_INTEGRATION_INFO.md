# MuditaKurye Webhook Entegrasyonu

## ✅ Webhook Secret Key Başarıyla Yapılandırıldı!

Webhook secret key `.env` dosyasına eklendi ve sistem webhook almaya hazır.

## 📌 MuditaKurye'ye Verilecek Bilgiler

### 1️⃣ Webhook URL
MuditaKurye'ye aşağıdaki webhook URL'ini vermeniz gerekiyor:

**Development (Local):**
```
http://localhost:4001/api/webhook/muditakurye
```

**Production:**
```
https://api.tulumbak.com/api/webhook/muditakurye
```

### 2️⃣ Webhook Headers
MuditaKurye webhook gönderirken şu header'ları eklemelidir:
- `X-MuditaKurye-Signature`: HMAC-SHA256 signature
- `X-Mudita-Timestamp`: Unix timestamp (milliseconds)
- `Content-Type`: application/json

### 3️⃣ Desteklenen Event'ler
Sistem şu event'leri otomatik olarak işleyebilir:
- Order status updates (VALIDATED, ASSIGNED, PREPARED, ON_DELIVERY, DELIVERED, CANCELED, FAILED)
- Courier assignment notifications
- Delivery completion events

## 🔧 Mevcut Durum

### Aktif Özellikler:
✅ Webhook alabilir ve doğrulayabilir
✅ Sipariş durumlarını güncelleyebilir
✅ Status history'ye kayıt ekleyebilir
✅ Webhook imza doğrulaması aktif

### Bekleyen Özellikler:
⏳ Sipariş gönderme (API anahtarları gerekli)
⏳ Sipariş iptal etme (API anahtarları gerekli)
⏳ Aktif sipariş sorgulama (API anahtarları gerekli)

## 📝 Test Etme

### 1. Sistem Durumunu Kontrol:
```bash
cd backend
npm run dev
```

### 2. Webhook Test (curl ile):
```bash
curl -X POST http://localhost:4001/api/webhook/muditakurye \
  -H "Content-Type: application/json" \
  -H "X-MuditaKurye-Signature: test_signature" \
  -H "X-Mudita-Timestamp: 1234567890" \
  -d '{
    "muditaOrderId": "TEST123",
    "status": "DELIVERED",
    "timestamp": 1234567890
  }'
```

### 3. Migration Çalıştırma:
```bash
cd backend
node scripts/migrateMuditaKurye.js
```

## 🚀 API Anahtarları Geldiğinde

MuditaKurye'den API anahtarları aldığınızda, `.env` dosyasını güncelleyin:

```env
MUDITA_API_KEY=your_actual_api_key
MUDITA_API_SECRET=your_actual_api_secret
MUDITA_RESTAURANT_ID=your_restaurant_id
MUDITA_WEBHOOK_ONLY_MODE=false  # Bu satırı false yapın
```

Sonra sistemi restart edin.

## 📊 Monitoring

### Dead Letter Queue (DLQ):
Başarısız webhook işlemleri DLQ'da saklanır:
- Admin Panel: `/admin/dlq`
- API: `GET /api/dlq?status=pending`

### Circuit Breaker Status:
```
GET /api/courier-integration/circuit-breakers
```

### Integration Statistics:
```
GET /api/courier-integration/stats
```

## ⚠️ Önemli Notlar

1. **Webhook Secret Key Güvenliği**: `wh_0rC-rimL096iJALsxXui67-n0LrKWVNlpHknLHn12g4` key'ini kimseyle paylaşmayın.

2. **HTTPS Zorunlu**: Production ortamında mutlaka HTTPS kullanın.

3. **Rate Limiting**: Webhook endpoint'i dakikada 100 istek kabul eder.

4. **Idempotency**: Aynı webhook ID'si ile gelen istekler otomatik olarak reddedilir (duplicate koruması).

5. **Timeout**: Webhook işleme timeout'u 30 saniye.

## 🆘 Sorun Giderme

### "Invalid signature" hatası:
- Webhook secret key'in doğru olduğundan emin olun
- Timestamp'in 5 dakikadan eski olmadığından emin olun

### "Order not found" hatası:
- Sipariş ID'sinin Tulumbak sisteminde mevcut olduğundan emin olun
- MuditaOrderId mapping'inin doğru yapıldığından emin olun

### Webhook alınmıyor:
- Firewall/port ayarlarını kontrol edin (4001 portu açık olmalı)
- nginx/Apache reverse proxy ayarlarını kontrol edin

## 📞 Destek

Teknik destek için:
- Logs: `backend/logs/combined.log`
- Error logs: `backend/logs/error.log`
- MongoDB logs: Check courier_integration_configs collection

---
Güncelleme Tarihi: ${new Date().toISOString()}