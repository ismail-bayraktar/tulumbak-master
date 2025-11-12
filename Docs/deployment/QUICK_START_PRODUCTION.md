# ⚡ Production Deployment - Hızlı Başlangıç

Bu rehber, projeyi production'a hızlıca deploy etmek için minimum gereksinimleri içerir.

## 🎯 Hızlı Checklist

### 1. Domain ve SSL ✅
- [ ] Domain'ler hazır (www, api, admin)
- [ ] SSL sertifikaları kuruldu
- [ ] DNS kayıtları yapıldı

### 2. Environment Variables ✅

#### Backend (.env)
```bash
cd backend
cp env.example .env
# .env dosyasını düzenleyin
```

**Minimum Gerekli Değişkenler:**
```env
NODE_ENV=production
PORT=4001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=güçlü_bir_secret_key_min_32_karakter
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com
FRONTEND_URL=https://www.tulumbak.com
BACKEND_URL=https://api.tulumbak.com
MERCHANT_ID=paytr_merchant_id
MERCHANT_KEY=paytr_key
MERCHANT_SALT=paytr_salt
TEST_MODE=0
```

#### Frontend (.env)
```bash
cd frontend
cp env.example .env
```

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

#### Admin (.env)
```bash
cd admin
cp env.example .env
```

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

### 3. Backend Deployment

#### Vercel ile:
```bash
cd backend
vercel --prod
# Environment variables'ı Vercel dashboard'dan ekleyin
```

#### Kendi Sunucunuzda:
```bash
cd backend
npm install --production
pm2 start server.js --name tulumbak-backend
pm2 save
```

### 4. Frontend Deployment

#### Vercel ile:
```bash
cd frontend
vercel --prod
```

### 5. Admin Panel Deployment

#### Vercel ile:
```bash
cd admin
vercel --prod
```

## 🔍 Hızlı Test

### Backend Test:
```bash
curl https://api.tulumbak.com/
# Beklenen: "API Working"
```

### Frontend Test:
- Tarayıcıda açın: `https://www.tulumbak.com`
- Console'da CORS hatası olmamalı

### Admin Test:
- Tarayıcıda açın: `https://admin.tulumbak.com`
- Login sayfası görünmeli

## ⚠️ Önemli Notlar

1. **CORS Ayarları:** Production'da mutlaka `CORS_ORIGINS` environment variable'ını ayarlayın
2. **JWT Secret:** Güçlü bir secret key kullanın (en az 32 karakter)
3. **TEST_MODE:** PayTR için production'da `TEST_MODE=0` olmalı
4. **MongoDB:** MongoDB Atlas kullanıyorsanız IP whitelist'e sunucu IP'nizi ekleyin

## 🆘 Sorun Giderme

**CORS Hatası:**
- Backend `.env` dosyasında `CORS_ORIGINS` kontrol edin
- Domain'ler tam olarak eşleşmeli (https:// dahil)

**API Bağlantı Hatası:**
- Frontend `.env` dosyasında `VITE_BACKEND_URL` kontrol edin
- Backend çalışıyor mu kontrol edin

**Build Hatası:**
- Node.js versiyonu 18+ olmalı
- `npm install` çalıştırın

## 📚 Detaylı Rehber

Daha detaylı bilgi için: [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

