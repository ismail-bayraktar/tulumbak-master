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

