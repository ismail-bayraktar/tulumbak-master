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
- **Nodemailer** (Email Notifications)
- **Helmet** (Security Headers)
- **Express Rate Limit** (Brute Force Protection)
- **Express Validator** (Input Validation)

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

### 7. Email Bildirim Sistemi

**Yeni Servis:**
- `EmailService` - Email gönderimi

**Özellikler:**
- Sipariş onayı email'i
- Sipariş durum değişiklik bildirimi
- Kurye atandığında bildirim
- Teslim edildiğinde teşekkür email'i
- HTML template'ler

**Dosya:** `backend/services/EmailService.js`

### 8. Stok Yönetimi Otomasyonu

**Yeni Middleware:**
- `StockCheck` - Stok kontrolü ve azaltma

**Özellikler:**
- Sipariş verildiğinde stok otomatik azaltma
- Stok kontrolü middleware
- Minimum stok uyarısı
- Stokta olmayan ürün filtresi

**Dosyalar:**
- `backend/middleware/StockCheck.js`

### 9. Güvenlik İyileştirmeleri

**Yeni Servisler:**
- `RateLimiterService` - API rate limiting
- Helmet middleware - Security headers

**Özellikler:**
- Rate limiting (brute force koruması)
- Authentication endpoint'lerinde sıkı limit
- Order placement limit
- File upload limit
- Security headers (Helmet)

**Dosyalar:**
- `backend/services/RateLimiter.js`
- `backend/server.js` (güncelleme)

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
# MongoDB
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin

# JWT & Admin
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Server
PORT=4001

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Bank Information
BANK_IBAN=TR00 0000 0000 0000 0000 0000 00
BANK_ACCOUNT_NAME=Tulumbak Gıda
BANK_NAME=Banka Adı
```

## 📋 Backend Özellikleri Durumu

### ✅ Tamamlanan Özellikler

**✅ Email Bildirim Sistemi** - Tamamlandı
- Nodemailer entegrasyonu
- Sipariş onayı, durum güncelleme, teslim bildirimleri
- Detay: `Docs/backend/RECENT_DEVELOPMENTS.md`

**✅ SMS Entegrasyonu** - Tamamlandı
- Netgsm ve MesajPanel desteği
- Sipariş ve kurye bildirimleri
- Detay: `Docs/backend/RECENT_DEVELOPMENTS.md`

**✅ Raporlama Sistemi** - Tamamlandı
- Satış raporları, ürün analizleri, müşteri davranış analizi
- Dashboard KPIs
- Detay: `Docs/backend/RECENT_DEVELOPMENTS.md`

**✅ Kurye Takip Sistemi** - Tamamlandı
- Tracking ID, status history, webhook desteği
- Detay: `Docs/backend/COURIER_TRACKING.md`

**✅ Stok Yönetimi** - Tamamlandı
- Otomatik stok azaltma, uyarılar, filtreleme
- Detay: `Docs/backend/RECENT_DEVELOPMENTS.md`

**✅ Multi-Admin Sistemi** - Tamamlandı
- RBAC, permission yönetimi
- Detay: `Docs/backend/RECENT_DEVELOPMENTS.md`

**✅ Güvenlik İyileştirmeleri** - Tamamlandı
- Rate limiting, Helmet, input validation
- Detay: `Docs/backend/RECENT_DEVELOPMENTS.md`

**✅ Logging ve Error Tracking** - Tamamlandı
- Winston logger, Sentry entegrasyonu
- Detay: `Docs/backend/LOGGING_AND_ERROR_TRACKING.md`

**✅ Önbellek Sistemi** - Tamamlandı
- Redis entegrasyonu, API caching
- Detay: `Docs/backend/REDIS_CACHING.md`

**✅ Performance Optimization** - Tamamlandı
- Database indexes, query optimization
- Detay: `Docs/backend/PERFORMANCE.md`

**✅ Test Coverage** - Tamamlandı
- Jest framework, unit ve integration tests
- Detay: `Docs/backend/TESTING.md`

### Geliştirme Devam Ediyor

Backend sistemi production-ready durumda. Detaylı bilgi için:
- **Tam özellik listesi:** `Docs/backend/RECENT_DEVELOPMENTS.md`
- **İlgili dokümanlar:** `Docs/backend/` klasöründe

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

