# Kurye Yönetim Sistemi - Revizyon Notları

## 📋 Revizyon Özeti

Sipariş durum sistemi revize edildi. "Kargo" yerine "Kurye" sistemi kullanılacak.

## ⚠️ Değişiklikler

### Eski Durumlar:
- ❌ "Kargoya Verildi" - Kaldırıldı

### Yeni Durumlar:
- ✅ "Kurye Atandı" - Kurye atama durumu
- ✅ "Yolda" - Kurye yolda durumu
- ✅ Diğer mevcut durumlar korundu

## 🎯 Gereken Sistemler

### 1. Kurye Model (Backend)
```javascript
// backend/models/CourierModel.js
{
  name: String,
  phone: String,
  email: String,
  vehicle: String, // 'motorcycle', 'car', 'bicycle'
  plateNumber: String,
  isActive: Boolean,
  workingHours: {
    start: String, // "09:00"
    end: String   // "18:00"
  },
  currentLocation: {
    lat: Number,
    lng: Number,
    lastUpdate: Date
  }
}
```

### 2. Kurye API Endpoints
```
POST   /api/admin/courier              # Kurye oluştur
GET    /api/admin/courier/list         # Kurye listesi
PUT    /api/admin/courier/:id          # Kurye güncelle
DELETE /api/admin/courier/:id          # Kurye sil
POST   /api/admin/courier/assign       # Sipariş atama
GET    /api/admin/courier/:id/performance  # Performans
```

### 3. Sipariş-Kurye İlişkisi
- Order model'de `courierId` eklenecek
- Sipariş durumları kurye sistemiyle entegre edilecek
- Kurye atama için modal/popup gerekli
- Otomatik veya manuel atama seçenekleri

### 4. Frontend Components
- `CourierManagement.jsx` - Kurye CRUD sayfası
- `CourierCard.jsx` - Kurye kartları
- Sipariş detayından kurye atama butonu
- Kurye atama modal'ı

## 📝 Yapılacaklar

### Backend:
1. `CourierModel.js` oluştur
2. `CourierController.js` oluştur
3. `CourierRoute.js` oluştur
4. Sipariş-kurye ilişkisi kurulacak
5. Order model'de `courierId` eklenecek

### Frontend:
1. `CourierManagement.jsx` sayfası oluştur
2. `CourierCard.jsx` component'i oluştur
3. Sipariş detayına kurye atama butonu ekle
4. Kurye listesi ve filtreleme
5. Kurye performans gösterimi

### Entegrasyon:
1. Sipariş durumları kurye sistemine göre ayarlanacak
2. "Kurye Atandı" durumunda otomatik bildirim
3. "Yolda" durumunda konum takibi
4. Kurye atama butonu sipariş detayında

---

**Not:** Bu sistem kurye paneliyle de entegre olacak ve gerçek zamanlı takip sağlayacak.

## 🔄 Otomatik Durum Güncellemeleri

### Kurye Uygulaması API Entegrasyonu

**Sistem Akışı:**
1. Admin siparişe "Kurye Atandı" seçer → Backend'e istek gider
2. Backend kurye uygulamasına webhook gönderir
3. Kurye uygulaması kuryeye bildirim gönderir
4. Kurye onaylar → Kurye uygulaması API'ye durum günceller
5. Backend webhook alır → Sipariş durumunu "Yolda" yapar
6. Kurye teslim eder → API ile "Teslim Edildi" olur

### Webhook Endpoints (Kurye Uygulaması → Backend)

```
POST /api/courier/webhook/status-update
{
  "orderId": "ORDER_ID",
  "courierId": "COURIER_ID",
  "status": "yolda" | "teslim_edildi" | "iptal",
  "location": {
    "lat": 38.4242,
    "lng": 27.1428
  },
  "timestamp": 1234567890
}
```

### Backend Webhook Handler

```javascript
// backend/controllers/CourierController.js
const handleWebhookStatusUpdate = async (req, res) => {
  try {
    const { orderId, courierId, status, location } = req.body;
    
    // Update order status
    const order = await OrderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: 'Order not found' });
    
    // Map status
    const statusMap = {
      'yolda': 'Yolda',
      'teslim_edildi': 'Teslim Edildi',
      'iptal': 'İptal Edildi'
    };
    
    order.status = statusMap[status];
    order.courierStatus = status;
    
    // Add to history
    order.statusHistory.push({
      status: statusMap[status],
      timestamp: Date.now(),
      location: location ? `${location.lat}, ${location.lng}` : '',
      note: 'Kurye uygulamasından güncellendi',
      updatedBy: 'courier'
    });
    
    await order.save();
    
    // Send notification to customer
    // ...
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.json({ success: false, message: error.message });
  }
};
```

### Gerekli Backend İyileştirmeleri

1. **Webhook Authentication:** Kurye uygulaması API key doğrulaması
2. **Rate Limiting:** Webhook endpoint için özel rate limit
3. **Logging:** Tüm webhook istekleri loglanmalı
4. **Error Handling:** Webhook hatalarında kuryeye bildirim
5. **Notification System:** Durum değiştiğinde müşteriye otomatik bildirim (SMS/Email)

### Frontend Değişiklikleri

1. **Sipariş listesinde** otomatik güncellenen durumlar "live" gösterilecek
2. **WebSocket** veya **Polling** ile gerçek zamanlı güncelleme
3. **Kurye konum** haritada gösterilecek (opsiyonel)

### Güvenlik

- Webhook endpoint için özel API key
- IP whitelist kontrolü (kurye uygulaması IP'leri)
- HMAC signature doğrulaması
- Rate limiting (her sipariş için limit)

### Konfigürasyon

Backend'de `courierApp` ayarları:
```javascript
{
  apiKey: process.env.COURIER_API_KEY,
  webhookUrl: process.env.COURIER_WEBHOOK_URL,
  autoStatusUpdate: true,
  notificationEnabled: true
}
```

Admin panel Settings'den konfigüre edilebilir hale getirilecek.

