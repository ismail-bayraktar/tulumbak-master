# EsnafExpress Kurye Entegrasyonu Dokümantasyonu

## 📋 Genel Bakış

Bu dokümantasyon, Tulumbak e-ticaret sistemi ile EsnafExpress kurye yönetim uygulaması arasındaki entegrasyon sürecini ve teknik detaylarını içerir.

## 🎯 Entegrasyon Hedefi

EsnafExpress ile entegrasyon sayesinde:
- Gerçek zamanlı kurye konumları
- Otomatik sipariş atama
- GPS bazlı takip
- Performans raporları
- Canlı durum güncellemeleri

sağlanacaktır.

---

## 🔌 Entegrasyon Mimarisi

### 1. Backend API Endpoints

#### Kurye Listesi
```
GET /api/courier-management/
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "couriers": [
    {
      "_id": "...",
      "name": "Ahmet Yılmaz",
      "phone": "+90 532 123 4567",
      "status": "available",
      "vehicleType": "motor",
      "currentLocation": {
        "latitude": 38.4621,
        "longitude": 27.2208
      },
      "performance": {
        "totalDeliveries": 156,
        "rating": 4.8,
        "averageDeliveryTime": 38
      }
    }
  ]
}
```

#### Kurye Atama
```
POST /api/courier-management/assign
Authorization: Bearer {admin_token}

Request:
{
  "courierId": "courier_id",
  "orderId": "order_id"
}

Response:
{
  "success": true,
  "message": "Order assigned to courier successfully",
  "order": {...},
  "courier": {...}
}
```

#### Kurye Performans
```
GET /api/courier-management/:id/performance
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "performance": {
    "totalDeliveries": 156,
    "successfulDeliveries": 152,
    "averageDeliveryTime": 38,
    "rating": 4.8
  },
  "activeOrders": 2,
  "activeOrdersList": [...]
}
```

#### Kurye Durum Güncelleme
```
PUT /api/courier-management/:id/status
Authorization: Bearer {admin_token}

Request:
{
  "status": "active" | "busy" | "inactive" | "offline"
}

Response:
{
  "success": true,
  "message": "Courier status updated",
  "courier": {...}
}
```

---

## 📡 EsnafExpress API Entegrasyonu

### Gerekli API Endpoints (EsnafExpress tarafından sağlanacak)

#### 1. Kurye Listesi API
```
GET https://api.esnafexpress.com/api/couriers
Authorization: Bearer {esnafexpress_token}

Response:
{
  "success": true,
  "couriers": [
    {
      "id": "CR-001",
      "name": "Ahmet Yılmaz",
      "phone": "+90 532 123 4567",
      "vehicle": "Motor",
      "status": "available",
      "location": {
        "lat": 38.4621,
        "lng": 27.2208,
        "address": "Bornova Merkez"
      },
      "rating": 4.8,
      "totalDeliveries": 156
    }
  ]
}
```

#### 2. Sipariş Atama API
```
POST https://api.esnafexpress.com/api/orders/assign
Authorization: Bearer {esnafexpress_token}

Request:
{
  "orderId": "ORD-12345",
  "courierId": "CR-001",
  "pickupAddress": {
    "address": "...",
    "lat": 38.4621,
    "lng": 27.2208
  },
  "deliveryAddress": {
    "address": "...",
    "lat": 38.5000,
    "lng": 27.2500
  },
  "items": [...],
  "priority": "normal"
}

Response:
{
  "success": true,
  "assignmentId": "ASN-001",
  "estimatedPickup": "2024-01-15T10:30:00Z",
  "estimatedDelivery": "2024-01-15T11:30:00Z"
}
```

#### 3. Kurye Durum Takibi
```
GET https://api.esnafexpress.com/api/couriers/:id/tracking
Authorization: Bearer {esnafexpress_token}

Response:
{
  "success": true,
  "courierId": "CR-001",
  "status": "delivering",
  "currentLocation": {
    "lat": 38.4650,
    "lng": 27.2250,
    "timestamp": "2024-01-15T10:45:00Z"
  },
  "assignedOrders": [
    {
      "orderId": "ORD-12345",
      "status": "picking",
      "estimatedDelivery": "2024-01-15T11:30:00Z"
    }
  ]
}
```

#### 4. Webhook - Kurye Durum Güncellemeleri
```
POST https://your-domain.com/api/courier-webhook
X-Webhook-Signature: {signature}

Request:
{
  "event": "status_update",
  "courierId": "CR-001",
  "orderId": "ORD-12345",
  "status": "delivering",
  "location": {
    "lat": 38.4650,
    "lng": 27.2250
  },
  "timestamp": "2024-01-15T10:45:00Z"
}
```

---

## 🛠️ Backend Entegrasyonu

### Adım 1: EsnafExpress Service Oluşturma

Dosya: `backend/services/EsnafExpressService.js`

```javascript
import axios from 'axios';

class EsnafExpressService {
    constructor() {
        this.apiUrl = process.env.ESNAFEXPRESS_API_URL || 'https://api.esnafexpress.com';
        this.apiKey = process.env.ESNAFEXPRESS_API_KEY;
        this.apiSecret = process.env.ESNAFEXPRESS_API_SECRET;
    }

    /**
     * EsnafExpress'dan kurye listesini çek
     */
    async getCouriers() {
        try {
            const response = await axios.get(`${this.apiUrl}/api/couriers`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('EsnafExpress getCouriers error:', error);
            throw error;
        }
    }

    /**
     * Sipariş atama
     */
    async assignOrder(orderData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/api/orders/assign`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('EsnafExpress assignOrder error:', error);
            throw error;
        }
    }

    /**
     * Kurye durum takibi
     */
    async trackCourier(courierId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/api/couriers/${courierId}/tracking`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('EsnafExpress trackCourier error:', error);
            throw error;
        }
    }

    /**
     * Webhook signature doğrulama
     */
    verifyWebhookSignature(signature, payload) {
        // EsnafExpress webhook signature doğrulama logic
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', this.apiSecret)
            .update(JSON.stringify(payload))
            .digest('hex');
        
        return signature === expectedSignature;
    }
}

export default new EsnafExpressService();
```

### Adım 2: Webhook Handler

Dosya: `backend/controllers/CourierWebhookController.js`

```javascript
import orderModel from '../models/OrderModel.js';
import esnafExpressService from '../services/EsnafExpressService.js';

const handleCourierWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-webhook-signature'];
        const payload = req.body;

        // Signature verification
        const isValid = esnafExpressService.verifyWebhookSignature(
            signature,
            payload
        );

        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid signature' 
            });
        }

        const { event, courierId, orderId, status, location } = payload;

        // Update order status
        if (orderId) {
            const order = await orderModel.findById(orderId);
            if (order) {
                order.courierStatus = status;
                order.currentLocation = location;
                
                // Add status history
                if (!order.statusHistory) order.statusHistory = [];
                order.statusHistory.push({
                    status,
                    timestamp: new Date().getTime(),
                    location: `${location.lat}, ${location.lng}`,
                    note: 'Courier status updated via EsnafExpress',
                    updatedBy: 'esnafexpress'
                });
                
                await order.save();
            }
        }

        res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('Courier webhook error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export { handleCourierWebhook };
```

### Adım 3: Route Ekleme

Dosya: `backend/routes/CourierRoute.js` (mevcut dosyaya ekle)

```javascript
import { handleCourierWebhook } from '../controllers/CourierWebhookController.js';

// EsnafExpress Webhook (public, signature ile korumalı)
courierRouter.post('/esnafexpress-webhook', handleCourierWebhook);
```

### Adım 4: Environment Variables

Dosya: `backend/.env`

```env
# EsnafExpress API Configuration
ESNAFEXPRESS_API_URL=https://api.esnafexpress.com
ESNAFEXPRESS_API_KEY=your_api_key_here
ESNAFEXPRESS_API_SECRET=your_api_secret_here
ESNAFEXPRESS_WEBHOOK_URL=https://your-domain.com/api/courier/esnafexpress-webhook
```

---

## 🎨 Frontend Entegrasyonu

### Adım 1: Couriers Listesi API Bağlantısı

Dosya: `admin/src/pages/CourierManagement.jsx`

```javascript
const fetchCouriers = async () => {
    try {
        // Önce EsnafExpress'dan çek
        const esnafResponse = await axios.get(
            backendUrl + '/api/courier-management/esnafexpress',
            { headers: { token } }
        );

        // Fallback olarak local DB'den çek
        if (!esnafResponse.data.success) {
            const localResponse = await axios.get(
                backendUrl + '/api/courier-management/',
                { headers: { token } }
            );
            setCouriers(localResponse.data.couriers || []);
        } else {
            setCouriers(esnafResponse.data.couriers);
        }
    } catch (error) {
        console.error('Error fetching couriers:', error);
        toast.error('Kurye verileri yüklenirken hata oluştu');
    }
};
```

### Adım 2: Sipariş Atama İşlemi

```javascript
const handleAssignOrder = async (courierId, orderId) => {
    try {
        const response = await axios.post(
            backendUrl + '/api/courier-management/assign',
            { courierId, orderId },
            { headers: { token } }
        );

        if (response.data.success) {
            toast.success('Sipariş kurye atandı');
            fetchCouriers();
            fetchOrders();
        }
    } catch (error) {
        toast.error('Kurye atama başarısız');
    }
};
```

### Adım 3: Gerçek Zamanlı Konum Takibi (Opsiyonel)

```javascript
// WebSocket veya Polling ile canlı konum takibi
useEffect(() => {
    const interval = setInterval(async () => {
        if (selectedCourierId) {
            const response = await axios.get(
                backendUrl + `/api/courier-management/${selectedCourierId}/location`,
                { headers: { token } }
            );
            setCourierLocation(response.data.location);
        }
    }, 5000); // Her 5 saniyede bir güncelle

    return () => clearInterval(interval);
}, [selectedCourierId]);
```

---

## 📊 Veritabanı Modeli

### Courier Model

Dosya: `backend/models/CourierModel.js` (Zaten oluşturuldu)

```javascript
{
    name: String,
    phone: String,
    email: String,
    vehicleType: String, // motor, araba, bisiklet
    vehiclePlate: String,
    status: String, // active, busy, inactive, offline
    workSchedule: {
        startTime: String,
        endTime: String,
        days: [String]
    },
    currentLocation: {
        latitude: Number,
        longitude: Number,
        lastUpdate: Number
    },
    performance: {
        totalDeliveries: Number,
        successfulDeliveries: Number,
        averageDeliveryTime: Number,
        rating: Number,
        totalEarnings: Number
    },
    activeOrders: [ObjectId],
    esnafExpressId: String, // EsnafExpress ID mapping
    createdAt: Number,
    updatedAt: Number
}
```

---

## 🔐 Güvenlik

### 1. Webhook Güvenliği

- Signature doğrulama (HMAC-SHA256)
- IP whitelist kontrolü
- Rate limiting

### 2. API Güvenliği

- JWT authentication
- Role-based access control
- API key encryption
- HTTPS only

### 3. Veri Güvenliği

- PII (kişisel bilgiler) encryption
- GPS verileri anonymization
- Log sanitization

---

## 📈 Entegrasyon Akışı

### Sipariş Atama Akışı

1. Admin sipariş detay sayfasından "Kurye Ata" butonuna tıklar
2. Frontend EsnafExpress'dan hazır kurye listesini çeker
3. Admin kurye seçer
4. Backend EsnafExpress API'ye sipariş atama isteği gönderir
5. EsnafExpress siparişi kuryeye atar ve onay döner
6. Backend order'ı günceller (courierTrackingId, courierStatus)
7. Email/SMS bildirimi gönderilir
8. Status history'ye kayıt eklenir

### Canlı Takip Akışı

1. Admin kurye detay sayfasından "Canlı Takip" butonuna tıklar
2. EsnafExpress WebSocket veya polling ile konum güncellemeleri alınır
3. Map component'te gerçek zamanlı konum gösterilir
4. Delivery tahmin süresi dinamik olarak güncellenir

### Durum Güncelleme Akışı

1. EsnafExpress uygulamasında kurye status değiştirir
2. EsnafExpress webhook gönderir (signature ile)
3. Backend webhook handler çalışır, signature doğrular
4. Order status ve location güncellenir
5. Email/SMS bildirimi müşteriye gönderilir
6. Status history'ye kayıt eklenir

---

## 🧪 Test Senaryoları

### Unit Tests

```javascript
// backend/__tests__/services/EsnafExpressService.test.js
describe('EsnafExpressService', () => {
    test('should fetch couriers from API', async () => {
        // Test implementation
    });

    test('should assign order to courier', async () => {
        // Test implementation
    });

    test('should verify webhook signature', () => {
        // Test implementation
    });
});
```

### Integration Tests

```javascript
// backend/__tests__/integration/courier.test.js
describe('Courier Integration', () => {
    test('should handle courier webhook', async () => {
        // Test implementation
    });

    test('should update order status from webhook', async () => {
        // Test implementation
    });
});
```

---

## 📝 TODO Listesi

### Backend
- [ ] EsnafExpress Service oluşturma
- [ ] Webhook handler implementation
- [ ] Signature verification
- [ ] Error handling & retry logic
- [ ] Rate limiting
- [ ] Logging & monitoring

### Frontend
- [ ] Couriers listesi API bağlantısı
- [ ] Sipariş atama UI iyileştirmeleri
- [ ] Gerçek zamanlı tracking UI (opsiyonel - harita)
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

### Documentation
- [ ] API documentation (Swagger)
- [ ] Integration guide
- [ ] Troubleshooting guide

---

## 🔍 Monitoring & Debugging

### Log Yapısı

```javascript
logger.info('EsnafExpress API call', {
    endpoint: '/api/orders/assign',
    orderId: 'ORD-12345',
    courierId: 'CR-001',
    timestamp: new Date().toISOString()
});
```

### Error Tracking

```javascript
try {
    // EsnafExpress API call
} catch (error) {
    Sentry.captureException(error, {
        tags: { service: 'esnafexpress' },
        extra: { orderId, courierId }
    });
}
```

---

## 📞 İletişim

Entegrasyon ile ilgili sorularınız için:
- EsnafExpress API Docs: https://docs.esnafexpress.com
- Tulumbak Backend Team
- Support Email: support@tulumbak.com

---

## 📌 Versiyon

- Dokümantasyon Versiyonu: 1.0
- Son Güncelleme: 2024-01-15
- Durum: Ready for Integration

