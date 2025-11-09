# 📡 API Referansı

Tulumbak e-ticaret platformu RESTful API dokümantasyonu.

## 🔗 Base URL

```
http://localhost:4001/api
```

Production:
```
https://api.tulumbak.com/api
```

## 🔐 Authentication

Çoğu endpoint JWT token gerektirir. Token'ı header'da gönderin:

```
Authorization: Bearer <token>
```

veya

```
token: <token>
```

## 📚 Endpoint Kategorileri

### Ürünler (Products)
- `GET /api/product/list` - Ürün listesi
- `POST /api/product/single` - Tek ürün detayı
- `POST /api/product/add` - Ürün ekle (Admin)
- `POST /api/product/update` - Ürün güncelle (Admin)
- `POST /api/product/remove` - Ürün sil (Admin)

### Kullanıcılar (Users)
- `POST /api/user/register` - Kullanıcı kaydı
- `POST /api/user/login` - Kullanıcı girişi
- `POST /api/user/admin` - Admin girişi

### Siparişler (Orders)
- `POST /api/order/place` - Sipariş oluştur
- `GET /api/order/all` - Tüm siparişler (Admin)
- `POST /api/order/user` - Kullanıcı siparişleri
- `POST /api/order/status` - Sipariş durumu güncelle (Admin)

### Sepet (Cart)
- `POST /api/cart/add` - Sepete ekle
- `POST /api/cart/remove` - Sepetten çıkar
- `POST /api/cart/get` - Sepeti getir

### Kuponlar (Coupons)
- `POST /api/coupon/validate` - Kupon doğrula
- `POST /api/coupon/create` - Kupon oluştur (Admin)
- `GET /api/coupon/list` - Kupon listesi (Admin)

### Teslimat (Delivery)
- `GET /api/delivery/zones` - Teslimat bölgeleri
- `GET /api/delivery/time-slots` - Zaman aralıkları
- `POST /api/delivery/quote` - Teslimat ücreti hesapla

### Kurye (Courier)
- `POST /api/courier/assign` - Siparişi kuryeye ata
- `GET /api/courier/tracking/:trackingId` - Sipariş takibi
- `POST /api/courier/status/update` - Kurye durumu güncelle

### Medya (Media)
- `POST /api/media/upload` - Medya yükle (Admin)
- `GET /api/media/list` - Medya listesi (Admin)
- `DELETE /api/media/:id` - Medya sil (Admin)

### Ayarlar (Settings)
- `GET /api/settings` - Ayarları getir
- `POST /api/settings/update` - Ayar güncelle (Admin)

### Raporlar (Reports)
- `GET /api/report/dashboard` - Dashboard istatistikleri (Admin)
- `GET /api/report/sales` - Satış raporları (Admin)
- `GET /api/report/products` - Ürün analitikleri (Admin)

## 📖 Detaylı Dokümantasyon

- [Webhook API](./webhook-api.md) - Webhook entegrasyonu
- [Authentication](./authentication.md) - Authentication detayları
- [Backend API Dokümantasyonu](../backend/API_DOCUMENTATION.md) - Backend detayları

## 🔄 Swagger Dokümantasyonu

Canlı API dokümantasyonu için:
```
http://localhost:4001/api-docs
```

---

**Son Güncelleme:** 2025-11-08

