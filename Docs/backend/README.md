# Backend Dökümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Yapılan Değişiklikler](#yapılan-değişiklikler)
3. [API Endpoint'leri](#api-endpointleri)
4. [Veritabanı Modelleri](#veritabanı-modelleri)
5. [Geliştirme Rehberi](#geliştirme-rehberi)
6. [Yapılacak Geliştirmeler](#yapılacak-geliştirmeler)

## 🎯 Genel Bakış

Backend, Node.js + Express.js ile geliştirilmiş RESTful API servisidir. MongoDB veritabanı kullanır ve JWT token bazlı authentication sağlar.

### Teknoloji Stack

- **Node.js** (v18+)
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT** (Authentication)
- **Multer** (File Upload)
- **PayTR** (Payment Gateway)

### Çalıştırma

```bash
cd backend
npm install
npm start
```

Backend `http://localhost:4001` üzerinde çalışacaktır.

## ✅ Yapılan Değişiklikler

### 1. Product Model Güncellemeleri

**Yeni Alanlar:**
- `weights: [Number]` - Gramaj seçenekleri
- `freshType: String` - Taze mi/Kuru mu ('taze'|'kuru')
- `packaging: String` - Ambalaj seçeneği ('standart'|'özel')
- `giftWrap: Boolean` - Hediye paketi
- `labels: [String]` - Ürün etiketleri

**Dosya:** `backend/models/ProductModel.js`

### 2. Delivery Zone & Time Slot

**Yeni Modeller:**
- `DeliveryZoneModel` - Teslimat bölgeleri
- `DeliveryTimeSlotModel` - Teslimat zaman aralıkları

**Yeni Controller'lar:**
- `DeliveryController` - CRUD işlemleri ve quote API

**Dosyalar:**
- `backend/models/DeliveryZoneModel.js`
- `backend/models/DeliveryTimeSlotModel.js`
- `backend/controllers/DeliveryController.js`

### 3. Coupon Sistemi

**Yeni Model:**
- `CouponModel` - Kupon sistemi

**Özellikler:**
- Kupon oluşturma
- Kupon doğrulama
- İndirim hesaplama
- Kullanım limiti

**Dosyalar:**
- `backend/models/CouponModel.js`
- `backend/controllers/CouponController.js`

### 4. Kurumsal Siparişler

**Yeni Model:**
- `CorporateOrderModel` - Kurumsal siparişler

**Durumlar:**
- `pending` - Beklemede
- `approved` - Onaylandı
- `rejected` - Reddedildi
- `completed` - Tamamlandı

**Dosyalar:**
- `backend/models/CorporateOrderModel.js`
- `backend/controllers/CorporateController.js`

### 5. Courier Entegrasyonu (Mock)

**Yeni Controller:**
- `CourierController` - Kurye entegrasyonu

**Endpoints:**
- `POST /api/courier/request-pickup` - Kurye talep et
- `POST /api/courier/webhook` - Kurye durum webhook

**Dosyalar:**
- `backend/controllers/CourierController.js`
- `backend/routes/CourierRoute.js`

### 6. Order Model Güncellemeleri

**Yeni Alanlar:**
- `paymentMethod: String` - Ödeme yöntemi
- `codFee: Number` - Kapıda ödeme ücreti
- `delivery: Object` - Teslimat bilgileri
- `giftNote: String` - Hediye notu
- `courierStatus: String` - Kurye durumu
- `courierTrackingId: String` - Takip ID

**Dosya:** `backend/models/OrderModel.js`

## 📡 API Endpoint'leri

### Products

```http
GET    /api/product/list
POST   /api/product/add
POST   /api/product/update
POST   /api/product/remove
POST   /api/product/single
```

### Delivery

```http
GET    /api/delivery/zones
POST   /api/delivery/zones
DELETE /api/delivery/zones
GET    /api/delivery/timeslots
POST   /api/delivery/timeslots
DELETE /api/delivery/timeslots
POST   /api/delivery/quote
```

### Coupons

```http
GET    /api/coupon
POST   /api/coupon
POST   /api/coupon/validate
DELETE /api/coupon
```

### Orders

```http
POST   /api/order/place
POST   /api/order/list
POST   /api/order/status
POST   /api/order/userorders
GET    /api/order/bank-info
```

### Corporate

```http
POST   /api/corporate
GET    /api/corporate/list
PUT    /api/corporate/update
```

### Courier

```http
POST   /api/courier/request-pickup
POST   /api/courier/webhook
```

## 📊 Veritabanı Modelleri

### Product Model

```javascript
{
  name: String,
  description: String,
  basePrice: Number,
  image: [String],
  category: String,
  subCategory: String,
  sizes: [Number],
  weights: [Number],
  freshType: String,
  packaging: String,
  giftWrap: Boolean,
  labels: [String],
  personCounts: [String],
  bestseller: Boolean,
  date: Number,
  sizePrices: [{ size: Number, price: Number }],
  stock: Number,
  allergens: String,
  ingredients: String,
  shelfLife: String,
  storageInfo: String
}
```

### DeliveryZone Model

```javascript
{
  district: String,
  fee: Number,
  minOrder: Number,
  weekendAvailable: Boolean,
  sameDayAvailable: Boolean
}
```

### DeliveryTimeSlot Model

```javascript
{
  label: String,
  start: String,
  end: String,
  isWeekend: Boolean,
  capacity: Number
}
```

### Coupon Model

```javascript
{
  code: String,
  type: String,
  value: Number,
  minCart: Number,
  validFrom: Date,
  validUntil: Date,
  usageLimit: Number,
  usageCount: Number,
  active: Boolean
}
```

## 🛠️ Geliştirme Rehberi

### Kod Standartları

1. **Dosya İsimlendirme:**
   - Controller: `XController.js`
   - Model: `XModel.js`
   - Route: `XRoute.js`

2. **Export Formatı:**
   - Named exports kullanın
   - `export { functionName }`

3. **Hata Yönetimi:**
   ```javascript
   try {
     // code
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }
   ```

4. **Response Formatı:**
   ```javascript
   // Başarılı
   res.json({ success: true, data: ... });
   
   // Başarısız
   res.json({ success: false, message: "Error message" });
   ```

### Environment Variables

```env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
JWT_SECRET=your_secret_key
PORT=4001
```

## 📋 Yapılacak Geliştirmeler

### Yüksek Öncelik

- [ ] **Email Bildirimleri**
  - Sipariş onayı
  - Kurye atandığında
  - Teslim edildiğinde

- [ ] **SMS Entegrasyonu**
  - Sipariş durumu bildirimleri
  - Kurye bilgilendirme

- [ ] **Gerçek Kurye Entegrasyonu**
  - Türkiye Lojistik API
  - Takip numarası

### Orta Öncelik

- [ ] **Raporlama Sistemi**
  - Günlük satış raporları
  - Ürün bazlı analizler
  - Kullanıcı davranış analizi

- [ ] **Stok Yönetimi**
  - Otomatik stok azaltma
  - Stok uyarıları
  - Tedarik yönetimi

- [ ] **Multi-Admin Sistemi**
  - Role-based access
  - Permission yönetimi

### Düşük Öncelik

- [ ] **Önbellek Sistemi**
  - Redis entegrasyonu
  - API response caching

- [ ] **Logging**
  - Winston logger
  - Error tracking
  - Audit log

- [ ] **Performance**
  - Database indexing
  - Query optimization
  - Load balancing

## 🧪 Test

```bash
# Unit testler (gelecek)
npm test

# Integration testler (gelecek)
npm run test:integration
```

## 📝 Notlar

- Tüm API endpoint'leri RESTful standartlara uygundur
- JWT token gerektiren endpoint'ler `/api/*` altında
- Public endpoint'ler authentication gerektirmez
- File upload için Multer middleware kullanılır
- MongoDB connection pooling aktif

