# API Documentation (Swagger)

## 📋 Genel Bakış

Tulumbak backend API'si için interaktif Swagger dokümantasyonu.

---

## 🔗 Erişim

**Development:**
```
http://localhost:4001/api-docs
```

**Production:**
```
https://api.tulumbak.com/api-docs
```

**JSON Endpoint:**
```
http://localhost:4001/api-docs.json
```

---

## 📊 API Grupları

### 1. Products
Product yönetimi endpoint'leri

**Endpoints:**
- `GET /api/product/list` - List all products
- `POST /api/product/single` - Get product details
- `POST /api/product/add` - Add product (Admin)
- `POST /api/product/update` - Update product (Admin)
- `POST /api/product/remove` - Remove product (Admin)

### 2. Orders
Sipariş yönetimi endpoint'leri

### 3. Users
Kullanıcı authentication ve yönetimi

### 4. Coupons
Kupon yönetimi

### 5. Delivery
Teslimat bölgeleri ve zaman aralıkları

### 6. Reports
Satış raporları ve analitik

### 7. Settings
Sistem ayarları

### 8. Admin
Admin CRUD işlemleri

### 9. Courier
Kurye takip ve yönetim

---

## 🔐 Authentication

Çoğu endpoint JWT token gerektirir:

```javascript
headers: {
  'token': 'your-jwt-token'
}
```

Admin endpoint'leri ek olarak admin yetkisi gerektirir.

---

## 📝 Örnek Kullanım

### Product List

```bash
curl http://localhost:4001/api/product/list
```

### Single Product

```bash
curl -X POST http://localhost:4001/api/product/single \
  -H "Content-Type: application/json" \
  -d '{"id": "product-id"}'
```

---

## 🛠️ Swagger UI Features

- **Interactive:** Tüm endpoint'leri tarayıcıda test edebilirsiniz
- **Auto-generated:** Kod yorumlarından otomatik üretilir
- **Try it out:** Gerçek istekler gönderebilirsiniz
- **Responses:** Response örnekleri ve schema'lar

---

**Son Güncelleme:** 2025-10-28  
**Versiyon:** 2.0

