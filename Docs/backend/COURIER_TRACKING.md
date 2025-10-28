# Kurye Takip Sistemi Dokümantasyonu

## 📋 Genel Bakış

Bu doküman, Tulumbak e-ticaret sisteminin kurye takip ve sipariş yönetim özelliklerini detaylandırmaktadır. Sistem, siparişlerin gerçek zamanlı takibi, kurye atama ve durum güncellemelerini destekler.

---

## 🗄️ Veritabanı Modeli

### Order Model Güncellemeleri

**Dosya:** `backend/models/OrderModel.js`

**Yeni Alanlar:**

```javascript
{
  trackingId: { type: String, unique: true },     // Public tracking ID (ABC12345)
  trackingLink: { type: String },                   // Tracking URL
  statusHistory: [{                                // Sipariş durum geçmişi
    status: String,                                  // Durum adı
    timestamp: Number,                                // Zaman damgası
    location: String,                                 // Konum bilgisi
    note: String,                                     // Not
    updatedBy: String                                 // system/admin/courier
  }],
  courierStatus: String,                           // Kurye durumu
  courierTrackingId: String,                       // Kurye firma tracking ID
  estimatedDelivery: Number,                         // Tahmini teslimat zamanı
  actualDelivery: Number                            // Gerçek teslimat zamanı
}
```

---

## 🔌 API Endpoints

### 1. Kurye Takip API'leri

#### GET `/api/courier/track/:trackingId`
Sipariş takip bilgilerini getirir (Public, authentication gerekmez)

**Request:**
```
GET /api/courier/track/ABC12345
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "65abc...",
    "trackingId": "ABC12345",
    "status": "yolda",
    "mainStatus": "Siparişiniz Yola Çıktı",
    "statusHistory": [
      {
        "status": "Siparişiniz Alındı",
        "timestamp": 1698765432000,
        "location": "İzmir, Bornova",
        "note": "Siparişiniz sisteme kaydedildi",
        "updatedBy": "system"
      },
      {
        "status": "Kuryeye Verildi",
        "timestamp": 1698771234000,
        "location": "İzmir, Bornova",
        "note": "Siparişiniz kuryeye teslim edildi",
        "updatedBy": "system"
      }
    ],
    "items": [...],
    "address": {...},
    "amount": 250.00,
    "date": 1698765432000,
    "estimatedDelivery": 1698780000000,
    "actualDelivery": null
  }
}
```

#### POST `/api/courier/request-pickup`
Admin panelinden kurye çağırma isteği

**Request (Admin Auth Required):**
```json
POST /api/courier/request-pickup
{
  "orderId": "65abc..."
}
```

**Response:**
```json
{
  "success": true,
  "courierTrackingId": "CR-ABC123XYZ",
  "trackingId": "ABC12345",
  "trackingLink": "http://localhost:5173/track/ABC12345"
}
```

#### POST `/api/courier/webhook`
Kurye servisinden durum güncelleme webhook

**Request:**
```json
POST /api/courier/webhook
{
  "courierTrackingId": "CR-ABC123XYZ",
  "status": "yolda",
  "location": "İzmir, Bornova, Sanayi Mah.",
  "note": "Kurye yola çıktı"
}
```

**Status Değerleri:**
- `hazırlanıyor` - Sipariş hazırlanıyor
- `yolda` - Kurye yola çıktı
- `teslim edildi` - Teslim edildi
- `iptal` - İptal edildi

---

## 📊 Sipariş Durum Yaşam Döngüsü

### Durum Akışı

```
1. Siparişiniz Alındı
   ↓
2. Siparişiniz Hazırlanıyor
   ↓
3. Kuryeye Verildi
   ↓
4. Siparişiniz Yola Çıktı
   ↓
5. Teslim Edildi
```

### Durumlar ve Açıklamalar

#### 1. Siparişiniz Alındı
- **Zaman:** Sipariş oluşturulduğunda
- **updatedBy:** system
- **Not:** Sipariş başarıyla kaydedildi ve ödeme alındı

#### 2. Siparişiniz Hazırlanıyor
- **Zaman:** Admin panelden durum güncellendiğinde
- **updatedBy:** admin
- **Not:** Ürünler hazırlanıyor

#### 3. Kuryeye Verildi
- **Zaman:** Kurye çağrıldığında
- **updatedBy:** system
- **Not:** Sipariş kuryeye teslim edildi

#### 4. Siparişiniz Yola Çıktı
- **Zaman:** Kurye yola çıktığında
- **updatedBy:** courier
- **Not:** Kurye teslimat için yola çıktı

#### 5. Teslim Edildi
- **Zaman:** Teslim tamamlandığında
- **updatedBy:** courier
- **Not:** Sipariş başarıyla teslim edildi

---

## 🔔 Bildirimler

### Email Bildirimleri

Sipariş durumu değiştiğinde otomatik email gönderilir:

- Sipariş onayı email
- Kurye atandı email
- Yola çıktı email
- Teslim edildi email

### SMS Bildirimleri

SMS bildirimleri (opsiyonel, `SMS_ENABLED=true`):

- Sipariş onayı SMS + tracking link
- Kurye atandı SMS
- Yola çıktı SMS
- Teslim edildi SMS

---

## 🛠️ Kurye Servis Entegrasyonu

### Webhook Payload Formatı

Kurye servisi, durum güncellemeleri için webhook göndermelidir:

```javascript
POST https://api.tulumbak.com/api/courier/webhook
{
  "courierTrackingId": "CR-ABC123XYZ",
  "status": "yolda",
  "location": "Lat: 38.4627, Lng: 27.2145",
  "note": "Kurye müşteriye yaklaşıyor"
}
```

### Durum Mapping

Kurye servisi durumları iç sistem durumlarına mapping:

| Kurye Servisi Durumu | İç Sistem Durumu |
|----------------------|------------------|
| `picked_up`          | `yolda`          |
| `in_transit`         | `yolda`          |
| `out_for_delivery`   | `yolda`          |
| `delivered`          | `teslim edildi`  |
| `failed`             | `iptal`          |

---

## 📱 Tracking Link Formatı

**Format:**
```
https://tulumbak.com/track/{trackingId}
```

**Örnek:**
```
https://tulumbak.com/track/ABC12345
```

**SMS/Email içinde kullanım:**
```
Siparişinizi takip etmek için: https://tulumbak.com/track/ABC12345
```

---

## 🔐 Güvenlik

### Public API (GET /api/courier/track/:trackingId)

- Authentication gerekmez
- Sadece trackingId ile erişim
- Hassas bilgiler (telefon, email) response'a dahil edilmez
- Rate limiting uygulanır

### Admin API

- `/api/courier/request-pickup` - Admin authentication gerekir
- `/api/courier/update-status` - Admin authentication gerekir

### Webhook Security

- Webhook endpoint'i signature doğrulama yapmalı
- IP whitelist kontrolü yapılmalı
- Rate limiting uygulanır

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Sipariş

1. Müşteri sipariş verir
2. Sistem otomatik tracking ID oluşturur
3. Email ve SMS gönderilir (opsiyonel)
4. Status history başlatılır

**API Call:**
```
POST /api/order/place
```

**Response:**
```json
{
  "success": true,
  "order": {...},
  "trackingId": "ABC12345",
  "trackingLink": "http://localhost:5173/track/ABC12345"
}
```

### Senaryo 2: Kurye Atama

1. Admin panelden sipariş durumu "Hazırlanıyor" yapılır
2. Kurye çağrılır (POST /api/courier/request-pickup)
3. Tracking ID oluşturulur
4. Kurye firmasına bildirim gönderilir
5. SMS/Email gönderilir

### Senaryo 3: Kurye Teslim

1. Kurye yola çıktığında webhook gönderilir
2. Durum "yolda" olur
3. Sipariş takibi aktif olur
4. Müşteriye bildirim gönderilir

### Senaryo 4: Teslim Tamamlandı

1. Kurye webhook gönderir (status: "teslim edildi")
2. actualDelivery timestamp kaydedilir
3. Müşteriye teşekkür email/SMS gönderilir
4. Durum history'e eklenir

---

## 🧪 Test Senaryoları

### Test 1: Public Tracking
```bash
curl http://localhost:4001/api/courier/track/ABC12345
```

### Test 2: Request Courier
```bash
curl -X POST http://localhost:4001/api/courier/request-pickup \
  -H "token: admin-token" \
  -H "Content-Type: application/json" \
  -d '{"orderId": "65abc..."}'
```

### Test 3: Webhook
```bash
curl -X POST http://localhost:4001/api/courier/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "courierTrackingId": "CR-ABC123XYZ",
    "status": "yolda",
    "location": "İzmir, Bornova",
    "note": "Kurye yola çıktı"
  }'
```

---

## 📊 Analytics

### Status History Kullanımı

Status history verileri raporlama sisteminde kullanılır:

- Ortalama teslimat süresi
- Durum geçiş süreleri
- Kurye performans analizi
- Müşteri memnuniyet metrikleri

### API: GET /api/report/delivery-status

Delivery status raporu statusHistory verilerini kullanır.

---

## 🔄 İyileştirmeler ve Gelecek Planlar

### MVP Özellikleri (Mevcut)
- ✅ Tracking ID oluşturma
- ✅ Status history
- ✅ Webhook support
- ✅ Kurye durum güncelleme
- ✅ Email/SMS bildirimleri

### Gelecek Özellikler
- [ ] Gerçek zamanlı konum takibi
- [ ] Google Maps entegrasyonu
- [ ] Kurye uygulaması API entegrasyonu
- [ ] WhatsApp entegrasyonu
- [ ] Push notifications
- [ ] Müşteri değerlendirme sistemi

---

## 📞 Destek

Sorular ve öneriler için: backend@tulumbak.dev

---

**Son Güncelleme:** 2025-10-28  
**Versiyon:** 1.0  
**Durum:** Production Ready

