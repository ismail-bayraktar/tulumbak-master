# 🚀 Production Deployment - Özet Rehber

Bu dokümantasyon, Tulumbak E-Ticaret projesini production'a deploy etmek için gereken tüm bilgileri içerir.

## 📚 Dokümantasyon İndeksi

1. **[Hızlı Başlangıç](./Docs/deployment/QUICK_START_PRODUCTION.md)** - Minimum gereksinimlerle hızlı deploy
2. **[Detaylı Rehber](./Docs/deployment/PRODUCTION_DEPLOYMENT.md)** - Tüm adımlar detaylı açıklamalar
3. **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Kontrol listesi

## 🎯 Hızlı Başlangıç (5 Dakika)

### 1. Environment Variables Hazırlayın

**Backend:**
```bash
cd backend
cp env.example .env
# .env dosyasını düzenleyin
```

**Frontend:**
```bash
cd frontend
cp env.example .env
# VITE_BACKEND_URL=https://api.tulumbak.com
```

**Admin:**
```bash
cd admin
cp env.example .env
# VITE_BACKEND_URL=https://api.tulumbak.com
```

### 2. Deploy Edin

**Vercel ile (Önerilen):**
```bash
# Backend
cd backend && vercel --prod

# Frontend
cd frontend && vercel --prod

# Admin
cd admin && vercel --prod
```

**Kendi Sunucunuzda:**
```bash
# Backend
cd backend
npm install --production
pm2 start server.js --name tulumbak-backend

# Frontend & Admin
# Build edip static dosyaları sunucuya yükleyin
npm run build
```

### 3. Test Edin

```bash
# Backend health check
curl https://api.tulumbak.com/

# Browser'da test
# https://www.tulumbak.com
# https://admin.tulumbak.com
```

## 🔑 Kritik Environment Variables

### Backend (.env) - Minimum Gereksinimler

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=güçlü_secret_key_min_32_karakter
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com
FRONTEND_URL=https://www.tulumbak.com
BACKEND_URL=https://api.tulumbak.com
MERCHANT_ID=paytr_id
MERCHANT_KEY=paytr_key
MERCHANT_SALT=paytr_salt
TEST_MODE=0
```

### Frontend & Admin (.env)

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

## ⚠️ Önemli Notlar

### 1. CORS Ayarları
- Production'da mutlaka `CORS_ORIGINS` environment variable'ını ayarlayın
- Domain'ler tam olarak eşleşmeli (https:// dahil, sonunda / olmamalı)

### 2. Security
- JWT secret key en az 32 karakter olmalı
- Admin şifresini mutlaka değiştirin
- PayTR test mode'u kapatın (`TEST_MODE=0`)

### 3. Database
- MongoDB Atlas kullanıyorsanız IP whitelist'e sunucu IP'nizi ekleyin
- Connection string'i doğru formatta kullanın

### 4. SSL/HTTPS
- Tüm domain'lerde HTTPS aktif olmalı
- Mixed content hatalarına dikkat edin

## 🔍 Troubleshooting

### CORS Hatası
**Sorun:** Browser console'da CORS hatası

**Çözüm:**
1. Backend `.env` dosyasında `CORS_ORIGINS` kontrol edin
2. Domain'ler tam olarak eşleşmeli: `https://www.tulumbak.com` (sonunda / yok)
3. Backend'i yeniden başlatın

### API Bağlantı Hatası
**Sorun:** Frontend API'ye bağlanamıyor

**Çözüm:**
1. Frontend `.env` dosyasında `VITE_BACKEND_URL` kontrol edin
2. Backend çalışıyor mu kontrol edin: `curl https://api.tulumbak.com/`
3. Browser network tab'ında istekleri kontrol edin

### Build Hatası
**Sorun:** Frontend/Admin build hatası

**Çözüm:**
1. Node.js versiyonu 18+ olmalı
2. `npm install` çalıştırın
3. Cache temizleyin: `rm -rf node_modules package-lock.json && npm install`

## 📊 Post-Deployment Kontroller

### Backend
- [ ] `curl https://api.tulumbak.com/` → "API Working"
- [ ] Swagger docs erişilebilir: `https://api.tulumbak.com/api-docs`

### Frontend
- [ ] Ana sayfa yükleniyor
- [ ] Ürünler listeleniyor
- [ ] Sepet çalışıyor
- [ ] Browser console'da hata yok

### Admin
- [ ] Login sayfası görüntüleniyor
- [ ] Login çalışıyor
- [ ] Dashboard görüntüleniyor

## 📞 Destek

Detaylı bilgi için:
- [Detaylı Deployment Rehberi](./Docs/deployment/PRODUCTION_DEPLOYMENT.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)

---

**Son Güncelleme:** 2024

