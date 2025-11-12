# ⚡ Vercel Deployment - Hızlı Başlangıç

Bu rehber, Tulumbak projesini Vercel'e hızlıca deploy etmek için adım adım talimatlar içerir.

## 🎯 Hızlı Başlangıç (5 Dakika)

### Ön Gereksinimler

- [ ] Vercel hesabı ([vercel.com](https://vercel.com))
- [ ] MongoDB veritabanı (MongoDB Atlas veya kendi sunucunuz)
- [ ] PayTR merchant bilgileri (opsiyonel)
- [ ] Domain adresi (opsiyonel)

### Adım 1: Vercel CLI Kurulumu

```bash
npm install -g vercel
vercel login
```

### Adım 2: Backend Deployment

```bash
cd backend
vercel
```

Sorulara cevap verin:
- **Set up and deploy?** → `Y`
- **Link to existing project?** → `N`
- **Project name:** → `tulumbak-backend`
- **Directory:** → `./`

### Adım 3: Backend Environment Variables

Vercel Dashboard'dan veya CLI ile:

```bash
# Zorunlu variables
vercel env add NODE_ENV production
vercel env add PORT production
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add ADMIN_EMAIL production
vercel env add ADMIN_PASSWORD production
vercel env add CORS_ORIGINS production
vercel env add FRONTEND_URL production
vercel env add BACKEND_URL production
vercel env add WEBHOOK_BASE_URL production
```

**Not:** Her birini eklerken değerleri girin. Backend URL'i deployment sonrası alacaksınız.

### Adım 4: Backend Production Deploy

```bash
vercel --prod
```

**Backend URL'i not edin:** `https://tulumbak-backend.vercel.app` (veya verilen URL)

### Adım 5: Frontend Deployment

```bash
cd ../frontend
vercel
```

Sorulara cevap verin:
- **Set up and deploy?** → `Y`
- **Link to existing project?** → `N`
- **Project name:** → `tulumbak-frontend`
- **Directory:** → `./`

### Adım 6: Frontend Environment Variables

```bash
vercel env add VITE_BACKEND_URL production
```

**Değer:** Backend URL'inizi girin (Adım 4'te not ettiğiniz)

### Adım 7: Frontend Production Deploy

```bash
vercel --prod
```

### Adım 8: Admin Panel Deployment

```bash
cd ../admin
vercel
```

Sorulara cevap verin:
- **Set up and deploy?** → `Y`
- **Link to existing project?** → `N`
- **Project name:** → `tulumbak-admin`
- **Directory:** → `./`

### Adım 9: Admin Environment Variables

```bash
vercel env add VITE_BACKEND_URL production
```

**Değer:** Backend URL'inizi girin (Adım 4'te not ettiğiniz)

### Adım 10: Admin Production Deploy

```bash
vercel --prod
```

## ✅ Kontrol Listesi

### Backend
- [ ] Deployment başarılı
- [ ] Environment variables eklendi
- [ ] MongoDB bağlantısı çalışıyor
- [ ] API endpoint'leri erişilebilir

### Frontend
- [ ] Deployment başarılı
- [ ] `VITE_BACKEND_URL` eklendi
- [ ] Sayfa yükleniyor
- [ ] API çağrıları çalışıyor

### Admin
- [ ] Deployment başarılı
- [ ] `VITE_BACKEND_URL` eklendi
- [ ] Sayfa yükleniyor
- [ ] Login çalışıyor

## 🔧 Ek Yapılandırmalar

### PayTR Entegrasyonu

```bash
cd backend
vercel env add MERCHANT_ID production
vercel env add MERCHANT_KEY production
vercel env add MERCHANT_SALT production
vercel env add TEST_MODE production
vercel env add MERCHANT_OK_URL production
vercel env add MERCHANT_FAIL_URL production
```

### Email Yapılandırması

```bash
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_USER production
vercel env add SMTP_PASSWORD production
```

### Custom Domain

1. Vercel Dashboard → Proje → Settings → Domains
2. Domain ekleyin
3. DNS kayıtlarını yapılandırın

## 📚 Detaylı Dokümantasyon

Daha detaylı bilgi için:
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Kapsamlı deployment rehberi
- [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) - Environment variables rehberi

## 🐛 Sorun mu Yaşıyorsunuz?

1. **Build hatası:** Build loglarını kontrol edin
2. **API çalışmıyor:** CORS ve environment variables'ı kontrol edin
3. **404 hatası:** SPA routing yapılandırmasını kontrol edin

Detaylı sorun giderme için [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) dosyasına bakın.

---

**Hızlı Başlangıç Süresi:** ~5-10 dakika
**Son Güncelleme:** 2025-01-13

