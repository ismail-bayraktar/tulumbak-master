# 🚀 Vercel Deployment Rehberi

Bu dokümantasyon, Tulumbak projesinin Vercel'e deploy edilmesi için gereken tüm adımları içerir.

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Proje Yapısı](#proje-yapısı)
3. [Deployment Stratejisi](#deployment-stratejisi)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Admin Panel Deployment](#admin-panel-deployment)
7. [Environment Variables](#environment-variables)
8. [Domain Yapılandırması](#domain-yapılandırması)
9. [Sorun Giderme](#sorun-giderme)

## 🎯 Genel Bakış

Tulumbak projesi monorepo yapısında 3 ana bileşenden oluşur:

- **Backend**: Node.js + Express API (Serverless Functions)
- **Frontend**: React + Vite SPA (Static Site)
- **Admin**: React + Vite SPA (Static Site)

Her bir bileşen için ayrı Vercel projesi oluşturulması önerilir.

## 📁 Proje Yapısı

```
tulumbak-master/
├── backend/          # Node.js API
│   ├── server.js     # Express app (Vercel için export edilmiş)
│   ├── vercel.json   # Backend Vercel config
│   └── package.json
├── frontend/         # React Müşteri Arayüzü
│   ├── vercel.json   # Frontend Vercel config
│   └── package.json
├── admin/            # React Admin Panel
│   ├── vercel.json   # Admin Vercel config
│   └── package.json
├── vercel.json       # Root monorepo config
└── .vercelignore     # Vercel ignore dosyası
```

## 🎯 Deployment Stratejisi

### Seçenek 1: Ayrı Projeler (Önerilen)

Her bileşen için ayrı Vercel projesi oluşturun:

1. **Backend API**: `tulumbak-backend` veya `api.tulumbak.com`
2. **Frontend**: `tulumbak-frontend` veya `www.tulumbak.com`
3. **Admin Panel**: `tulumbak-admin` veya `admin.tulumbak.com`

**Avantajlar:**
- Bağımsız deployment
- Ayrı environment variables yönetimi
- Daha iyi performans izleme
- Kolay ölçeklendirme

### Seçenek 2: Tek Proje (Monorepo)

Tüm projeyi tek bir Vercel projesi olarak deploy edin ve path-based routing kullanın.

**Not**: Bu yaklaşım daha karmaşıktır ve önerilmez.

## 🔧 Backend Deployment

### Adım 1: Vercel CLI Kurulumu

```bash
npm install -g vercel
```

### Adım 2: Backend Projesi Oluşturma

```bash
cd backend
vercel login
vercel
```

Sorulara şu şekilde cevap verin:
- **Set up and deploy?** → `Y`
- **Which scope?** → Kendi hesabınızı seçin
- **Link to existing project?** → `N`
- **What's your project's name?** → `tulumbak-backend`
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → `N`

### Adım 3: Production Deployment

```bash
vercel --prod
```

### Adım 4: Environment Variables Ayarlama

Vercel Dashboard'dan veya CLI ile environment variables ekleyin:

```bash
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add PORT production
# ... diğer tüm environment variables için tekrarlayın
```

**Tüm Backend Environment Variables için:** `backend/env.example` dosyasına bakın.

### Adım 5: Backend URL'i Not Edin

Deployment sonrası backend URL'i not edin (örn: `https://tulumbak-backend.vercel.app`)

## 🎨 Frontend Deployment

### Adım 1: Frontend Projesi Oluşturma

```bash
cd frontend
vercel login
vercel
```

Sorulara şu şekilde cevap verin:
- **Set up and deploy?** → `Y`
- **Which scope?** → Kendi hesabınızı seçin
- **Link to existing project?** → `N`
- **What's your project's name?** → `tulumbak-frontend`
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → `N`

### Adım 2: Environment Variables

```bash
vercel env add VITE_BACKEND_URL production
```

**Değer:** Backend URL'inizi girin (örn: `https://tulumbak-backend.vercel.app`)

### Adım 3: Production Deployment

```bash
vercel --prod
```

## 👨‍💼 Admin Panel Deployment

### Adım 1: Admin Projesi Oluşturma

```bash
cd admin
vercel login
vercel
```

Sorulara şu şekilde cevap verin:
- **Set up and deploy?** → `Y`
- **Which scope?** → Kendi hesabınızı seçin
- **Link to existing project?** → `N`
- **What's your project's name?** → `tulumbak-admin`
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → `N`

### Adım 2: Environment Variables

```bash
vercel env add VITE_BACKEND_URL production
```

**Değer:** Backend URL'inizi girin (örn: `https://tulumbak-backend.vercel.app`)

### Adım 3: Production Deployment

```bash
vercel --prod
```

## 🔐 Environment Variables

### Backend Environment Variables

Aşağıdaki environment variables'ları Vercel Dashboard'dan ekleyin:

#### Zorunlu Variables

```env
NODE_ENV=production
PORT=4001
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
ADMIN_EMAIL=admin@tulumbak.com
ADMIN_PASSWORD=secure_password_here
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com
FRONTEND_URL=https://www.tulumbak.com
BACKEND_URL=https://api.tulumbak.com
WEBHOOK_BASE_URL=https://api.tulumbak.com
```

#### PayTR Payment Gateway

```env
MERCHANT_ID=your_paytr_merchant_id
MERCHANT_KEY=your_paytr_merchant_key
MERCHANT_SALT=your_paytr_merchant_salt
TEST_MODE=0
MERCHANT_OK_URL=https://www.tulumbak.com/success
MERCHANT_FAIL_URL=https://www.tulumbak.com/failed
```

#### Email Configuration (SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

#### Opsiyonel Variables

```env
# Redis (Opsiyonel)
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379

# Sentry (Opsiyonel)
SENTRY_DSN=

# SMS (Opsiyonel)
SMS_PROVIDER=netgsm
SMS_ENABLED=false
SMS_API_KEY=your_sms_api_key
SMS_FROM=your_sms_sender_name

# Mudita Kurye (Opsiyonel)
MUDITA_ENABLED=false
MUDITA_API_URL=https://api.muditakurye.com.tr
MUDITA_API_KEY=your_mudita_api_key
MUDITA_API_SECRET=your_mudita_api_secret
MUDITA_RESTAURANT_ID=your_restaurant_id
MUDITA_WEBHOOK_SECRET=your_webhook_secret

# Webhook Encryption
WEBHOOK_ENCRYPTION_KEY=your_webhook_encryption_key_min_32_chars

# Bank Information
BANK_IBAN=TR00 0000 0000 0000 0000 0000 00
BANK_ACCOUNT_NAME=Tulumbak Gıda
BANK_NAME=Banka Adı
```

### Frontend Environment Variables

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

### Admin Environment Variables

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

## 🌐 Domain Yapılandırması

### Backend Domain

1. Vercel Dashboard → Backend Projesi → Settings → Domains
2. Custom domain ekleyin: `api.tulumbak.com`
3. DNS kayıtlarını yapılandırın (CNAME veya A record)

### Frontend Domain

1. Vercel Dashboard → Frontend Projesi → Settings → Domains
2. Custom domain ekleyin: `www.tulumbak.com` veya `tulumbak.com`
3. DNS kayıtlarını yapılandırın

### Admin Domain

1. Vercel Dashboard → Admin Projesi → Settings → Domains
2. Custom domain ekleyin: `admin.tulumbak.com`
3. DNS kayıtlarını yapılandırın

### DNS Kayıtları Örneği

```
Type    Name    Value
CNAME   api     cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
CNAME   admin   cname.vercel-dns.com
```

## 🔄 Continuous Deployment (Git Integration)

### GitHub/GitLab Entegrasyonu

1. Vercel Dashboard → Proje → Settings → Git
2. GitHub/GitLab hesabınızı bağlayın
3. Repository'yi seçin
4. Root Directory ayarlayın:
   - **Backend**: `backend`
   - **Frontend**: `frontend`
   - **Admin**: `admin`
5. Build Command ve Output Directory otomatik algılanacak

### Branch-based Deployment

- **Production**: `main` veya `master` branch → Production deployment
- **Preview**: Diğer branch'ler → Preview deployment

## 🐛 Sorun Giderme

### Backend Sorunları

#### "Cannot find module" Hatası

**Çözüm:** `backend/vercel.json` dosyasındaki `includeFiles` listesini kontrol edin.

#### "Function timeout" Hatası

**Çözüm:** `backend/vercel.json` dosyasındaki `maxDuration` değerini artırın (max 60 saniye).

#### MongoDB Bağlantı Hatası

**Çözüm:** 
- MongoDB URI'nin doğru olduğundan emin olun
- MongoDB Atlas kullanıyorsanız, IP whitelist'e Vercel IP'lerini ekleyin
- `authSource` parametresini kontrol edin

#### CORS Hatası

**Çözüm:** `CORS_ORIGINS` environment variable'ında frontend ve admin URL'lerini ekleyin.

### Frontend/Admin Sorunları

#### "404 Not Found" Hatası (SPA Routing)

**Çözüm:** `vercel.json` dosyasındaki `rewrites` yapılandırmasını kontrol edin.

#### Backend API Çağrıları Çalışmıyor

**Çözüm:**
- `VITE_BACKEND_URL` environment variable'ının doğru olduğundan emin olun
- CORS ayarlarını kontrol edin
- Browser console'da hataları kontrol edin

#### Build Hatası

**Çözüm:**
- `package.json` dosyasındaki build script'ini kontrol edin
- Node.js versiyonunu kontrol edin (Vercel Dashboard → Settings → Node.js Version)
- Dependencies'lerin yüklendiğinden emin olun

### Genel Sorunlar

#### Environment Variables Çalışmıyor

**Çözüm:**
- Environment variables'ları doğru environment'a eklediğinizden emin (production/preview/development)
- Değişikliklerden sonra yeniden deploy edin
- Variable isimlerinin doğru olduğundan emin olun

#### Deployment Başarısız

**Çözüm:**
- Build loglarını kontrol edin (Vercel Dashboard → Deployments → Build Logs)
- Local'de build'in çalıştığından emin olun (`npm run build`)
- Dependencies'lerin güncel olduğundan emin olun

## 📊 Monitoring ve Logs

### Vercel Analytics

1. Vercel Dashboard → Proje → Analytics
2. Performance metriklerini izleyin
3. Error tracking'i aktifleştirin

### Backend Logs

Backend logları Vercel Dashboard → Functions → Logs bölümünden görüntülenebilir.

### Frontend/Admin Logs

Browser console ve Vercel Analytics kullanın.

## 🔒 Güvenlik

### Environment Variables Güvenliği

- Asla environment variables'ları commit etmeyin
- Production ve development için farklı secrets kullanın
- Düzenli olarak secrets'ları rotate edin

### CORS Yapılandırması

- `CORS_ORIGINS` environment variable'ında sadece gerekli domain'leri listeleyin
- Wildcard (`*`) kullanmayın production'da

### HTTPS

Vercel otomatik olarak HTTPS sağlar. Custom domain'ler için SSL sertifikaları otomatik olarak yönetilir.

## 📚 Ek Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions Guide](https://vercel.com/docs/concepts/functions/serverless-functions)

## ✅ Deployment Checklist

### Backend
- [ ] Vercel projesi oluşturuldu
- [ ] Tüm environment variables eklendi
- [ ] MongoDB bağlantısı test edildi
- [ ] API endpoint'leri çalışıyor
- [ ] CORS yapılandırması doğru
- [ ] Custom domain yapılandırıldı (opsiyonel)

### Frontend
- [ ] Vercel projesi oluşturuldu
- [ ] `VITE_BACKEND_URL` environment variable eklendi
- [ ] Build başarılı
- [ ] SPA routing çalışıyor
- [ ] API çağrıları çalışıyor
- [ ] Custom domain yapılandırıldı (opsiyonel)

### Admin
- [ ] Vercel projesi oluşturuldu
- [ ] `VITE_BACKEND_URL` environment variable eklendi
- [ ] Build başarılı
- [ ] SPA routing çalışıyor
- [ ] API çağrıları çalışıyor
- [ ] Custom domain yapılandırıldı (opsiyonel)

### Genel
- [ ] Git entegrasyonu yapıldı
- [ ] Continuous deployment aktif
- [ ] Monitoring yapılandırıldı
- [ ] Error tracking aktif
- [ ] SSL sertifikaları doğrulandı

---

**Son Güncelleme:** 2025-01-13
**Versiyon:** 1.0.0

