# ✅ Production Deployment Checklist

Bu checklist, projeyi production'a deploy etmeden önce kontrol edilmesi gereken tüm öğeleri içerir.

## 📋 Pre-Deployment Checklist

### 🌐 Domain ve SSL
- [ ] Domain'ler satın alındı ve yapılandırıldı
  - [ ] `www.tulumbak.com` (Frontend)
  - [ ] `api.tulumbak.com` (Backend)
  - [ ] `admin.tulumbak.com` (Admin Panel)
- [ ] DNS kayıtları yapılandırıldı
- [ ] SSL sertifikaları kuruldu ve test edildi
- [ ] HTTPS tüm domain'lerde çalışıyor

### 🗄️ Database
- [ ] MongoDB veritabanı hazır (Atlas veya kendi sunucu)
- [ ] Database user oluşturuldu
- [ ] Connection string hazır
- [ ] IP whitelist ayarlandı (MongoDB Atlas için)
- [ ] Backup stratejisi belirlendi

### 🔐 Security
- [ ] JWT secret key güçlü ve güvenli (min 32 karakter)
- [ ] Admin şifresi değiştirildi (default şifre kullanılmıyor)
- [ ] CORS origins production domain'leri içeriyor
- [ ] CSP (Content Security Policy) ayarları yapıldı
- [ ] Rate limiting aktif
- [ ] Helmet security headers aktif

### 🔑 Environment Variables

#### Backend
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` doğru ve test edildi
- [ ] `JWT_SECRET` güçlü ve güvenli
- [ ] `CORS_ORIGINS` production domain'leri içeriyor
- [ ] `FRONTEND_URL` doğru
- [ ] `BACKEND_URL` doğru
- [ ] PayTR bilgileri production için ayarlandı
  - [ ] `MERCHANT_ID`
  - [ ] `MERCHANT_KEY`
  - [ ] `MERCHANT_SALT`
  - [ ] `TEST_MODE=0`
- [ ] Email SMTP bilgileri ayarlandı
- [ ] (Opsiyonel) Redis ayarları yapıldı
- [ ] (Opsiyonel) Sentry DSN eklendi

#### Frontend
- [ ] `VITE_BACKEND_URL` production API URL'i

#### Admin
- [ ] `VITE_BACKEND_URL` production API URL'i

### 💳 Payment Gateway
- [ ] PayTR merchant hesabı aktif
- [ ] Production API bilgileri alındı
- [ ] Test mode kapatıldı (`TEST_MODE=0`)
- [ ] Callback URL'leri ayarlandı
  - [ ] Success URL
  - [ ] Fail URL

### 📧 Email Configuration
- [ ] SMTP sunucusu hazır
- [ ] SMTP credentials test edildi
- [ ] Test email gönderildi ve başarılı

### 📱 SMS Configuration (Opsiyonel)
- [ ] SMS provider seçildi (NetGSM/MesajPanel)
- [ ] API key alındı
- [ ] Test SMS gönderildi

## 🚀 Deployment Checklist

### Backend
- [ ] Code son versiyona güncellendi
- [ ] Dependencies yüklendi (`npm install --production`)
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Deploy edildi
- [ ] Health check başarılı (`curl https://api.tulumbak.com/`)
- [ ] Swagger documentation erişilebilir

### Frontend
- [ ] Code son versiyona güncellendi
- [ ] Environment variables ayarlandı
- [ ] Build başarılı (`npm run build`)
- [ ] Deploy edildi
- [ ] Ana sayfa yükleniyor
- [ ] API bağlantısı çalışıyor

### Admin Panel
- [ ] Code son versiyona güncellendi
- [ ] Environment variables ayarlandı
- [ ] Build başarılı (`npm run build`)
- [ ] Deploy edildi
- [ ] Login sayfası görüntüleniyor
- [ ] API bağlantısı çalışıyor

## ✅ Post-Deployment Checklist

### Functionality Tests
- [ ] Frontend ana sayfa yükleniyor
- [ ] Ürünler listeleniyor
- [ ] Ürün detay sayfası açılıyor
- [ ] Sepete ekleme çalışıyor
- [ ] Sepet görüntüleniyor
- [ ] Checkout akışı çalışıyor
- [ ] Ödeme entegrasyonu çalışıyor (test ödeme)
- [ ] Sipariş oluşturuluyor
- [ ] Admin panel login çalışıyor
- [ ] Admin dashboard görüntüleniyor
- [ ] Ürün ekleme/düzenleme çalışıyor
- [ ] Sipariş yönetimi çalışıyor

### Security Tests
- [ ] HTTPS tüm sayfalarda aktif
- [ ] CORS hataları yok (browser console kontrol)
- [ ] Mixed content hataları yok
- [ ] SSL sertifikası geçerli
- [ ] Security headers kontrol edildi

### Performance Tests
- [ ] Sayfa yükleme süreleri kabul edilebilir
- [ ] API response süreleri kabul edilebilir
- [ ] Image loading optimize edildi
- [ ] Caching çalışıyor (Redis varsa)

### Monitoring Setup
- [ ] Error tracking aktif (Sentry)
- [ ] Logging çalışıyor
- [ ] Uptime monitoring kuruldu
- [ ] Alert sistemi ayarlandı

## 🔍 Browser Console Checks

Tarayıcı console'unda kontrol edin:
- [ ] CORS hatası yok
- [ ] Mixed content hatası yok
- [ ] JavaScript hataları yok
- [ ] Network istekleri başarılı (200, 201 status)

## 📊 API Tests

### Health Check
```bash
curl https://api.tulumbak.com/
# Beklenen: "API Working"
```

### Product List
```bash
curl https://api.tulumbak.com/api/product/list
# Beklenen: JSON response with products
```

### CORS Test
```javascript
// Browser console'da çalıştırın
fetch('https://api.tulumbak.com/api/product/list')
  .then(res => res.json())
  .then(data => console.log('CORS OK:', data))
  .catch(err => console.error('CORS ERROR:', err));
```

## 🆘 Emergency Contacts

- **Backend Issues:** Log dosyalarını kontrol edin (`backend/logs/`)
- **Frontend Issues:** Browser console ve network tab
- **Database Issues:** MongoDB connection string ve IP whitelist
- **Payment Issues:** PayTR merchant panel ve loglar

## 📝 Notes

- Bu checklist'i deployment öncesi ve sonrası kullanın
- Her maddeyi kontrol edip işaretleyin
- Sorun yaşarsanız ilgili bölümü tekrar kontrol edin
- Production'da değişiklik yapmadan önce test ortamında deneyin

---

**Son Kontrol Tarihi:** _______________
**Deploy Eden:** _______________
**Notlar:** _______________

