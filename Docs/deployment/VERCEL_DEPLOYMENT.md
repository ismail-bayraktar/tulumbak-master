# 🚀 Vercel Deployment Rehberi - Monorepo Yaklaşımı

Bu rehber, Frontend, Backend ve Admin panel'i Vercel'de nasıl deploy edeceğinizi anlatır.

## 📋 İçindekiler

1. [Vercel Deployment Yaklaşımı](#vercel-deployment-yaklaşımı)
2. [Ön Hazırlık](#ön-hazırlık)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Admin Panel Deployment](#admin-panel-deployment)
6. [Environment Variables](#environment-variables)
7. [Domain Yapılandırması](#domain-yapılandırması)
8. [Sorun Giderme](#sorun-giderme)

---

## 🎯 Vercel Deployment Yaklaşımı

### Monorepo Yaklaşımı (Önerilen)

**Aynı repo içinde, her biri ayrı Vercel projesi olarak deploy edilir:**

```
tulumbak-master/          (GitHub Repo)
├── backend/              → Vercel Projesi 1 (api.tulumbak.com)
├── frontend/             → Vercel Projesi 2 (www.tulumbak.com)
└── admin/                → Vercel Projesi 3 (admin.tulumbak.com)
```

**Avantajları:**
- ✅ Tek repo, kolay yönetim
- ✅ Her proje bağımsız deploy edilebilir
- ✅ Her projenin kendi domain'i olabilir
- ✅ Environment variables ayrı ayrı yönetilir

---

## 📦 Ön Hazırlık

### 1. Vercel Hesabı Oluşturun

1. https://vercel.com adresine gidin
2. GitHub ile giriş yapın
3. Vercel hesabınızı oluşturun

### 2. GitHub Repo'yu Hazırlayın

Projenizi GitHub'a push edin:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. Vercel CLI Kurulumu (Opsiyonel)

```bash
npm install -g vercel
vercel login
```

---

## 🔧 Backend Deployment

### Adım 1: Vercel'de Yeni Proje Oluşturun

1. Vercel Dashboard'a gidin: https://vercel.com/dashboard
2. "Add New..." → "Project" tıklayın
3. GitHub repo'nuzu seçin
4. **Project Name:** `tulumbak-backend` (veya istediğiniz isim)
5. **Root Directory:** `backend` seçin ⚠️ ÖNEMLİ!

### Adım 2: Build Settings

**Framework Preset:** Other
**Build Command:** (boş bırakın veya `npm install`)
**Output Directory:** (boş bırakın)
**Install Command:** `npm install`

### Adım 3: Environment Variables

Vercel Dashboard → Project Settings → Environment Variables

Backend için gerekli tüm environment variables'ı ekleyin:

```env
NODE_ENV=production
PORT=4001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com
FRONTEND_URL=https://www.tulumbak.com
BACKEND_URL=https://api.tulumbak.com
MERCHANT_ID=paytr_merchant_id
MERCHANT_KEY=paytr_key
MERCHANT_SALT=paytr_salt
TEST_MODE=0
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail
# ... diğer environment variables
```

### Adım 4: Deploy

"Deploy" butonuna tıklayın. İlk deploy birkaç dakika sürebilir.

### Adım 5: Domain Ayarlama

1. Vercel Dashboard → Project Settings → Domains
2. "Add Domain" tıklayın
3. Domain'inizi girin: `api.tulumbak.com`
4. DNS ayarlarını yapın (Vercel size talimat verecek)

---

## 🎨 Frontend Deployment

### Adım 1: Vercel'de Yeni Proje Oluşturun

1. Vercel Dashboard'a gidin
2. "Add New..." → "Project" tıklayın
3. Aynı GitHub repo'yu seçin
4. **Project Name:** `tulumbak-frontend`
5. **Root Directory:** `frontend` seçin ⚠️ ÖNEMLİ!

### Adım 2: Build Settings

**Framework Preset:** Vite
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Adım 3: Environment Variables

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

### Adım 4: Deploy

"Deploy" butonuna tıklayın.

### Adım 5: Domain Ayarlama

1. Vercel Dashboard → Project Settings → Domains
2. Domain'inizi girin: `www.tulumbak.com`
3. DNS ayarlarını yapın

---

## 👨‍💼 Admin Panel Deployment

### Adım 1: Vercel'de Yeni Proje Oluşturun

1. Vercel Dashboard'a gidin
2. "Add New..." → "Project" tıklayın
3. Aynı GitHub repo'yu seçin
4. **Project Name:** `tulumbak-admin`
5. **Root Directory:** `admin` seçin ⚠️ ÖNEMLİ!

### Adım 2: Build Settings

**Framework Preset:** Vite
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Adım 3: Environment Variables

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

### Adım 4: Deploy

"Deploy" butonuna tıklayın.

### Adım 5: Domain Ayarlama

1. Vercel Dashboard → Project Settings → Domains
2. Domain'inizi girin: `admin.tulumbak.com`
3. DNS ayarlarını yapın

---

## 🔐 Environment Variables Yönetimi

### Vercel Dashboard'dan Ekleme

Her proje için ayrı ayrı environment variables ekleyin:

1. Vercel Dashboard → Projenizi seçin
2. Settings → Environment Variables
3. "Add New" tıklayın
4. Key ve Value girin
5. Environment seçin (Production, Preview, Development)
6. "Save" tıklayın

### Vercel CLI ile Ekleme

```bash
# Backend için
cd backend
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
# ... diğer variables

# Frontend için
cd frontend
vercel env add VITE_BACKEND_URL production

# Admin için
cd admin
vercel env add VITE_BACKEND_URL production
```

---

## 🌐 Domain Yapılandırması

### DNS Ayarları

Domain sağlayıcınızda (GoDaddy, Namecheap, vs.) DNS kayıtlarını yapın:

#### Backend (api.tulumbak.com)

```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

VEYA

```
Type: A
Name: api
Value: 76.76.21.21
```

#### Frontend (www.tulumbak.com)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Admin (admin.tulumbak.com)

```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
```

### Vercel'de Domain Ekleme

1. Her proje için Vercel Dashboard → Settings → Domains
2. "Add Domain" tıklayın
3. Domain'inizi girin
4. Vercel size DNS talimatlarını verecek
5. DNS ayarlarını yaptıktan sonra birkaç dakika bekleyin
6. SSL otomatik olarak aktif olacak

---

## ✅ Deployment Sonrası Kontroller

### Backend Kontrolleri

```bash
# Health check
curl https://api.tulumbak.com/
# Beklenen: "API Working"

# Swagger docs
https://api.tulumbak.com/api-docs
```

### Frontend Kontrolleri

- ✅ Ana sayfa yükleniyor mu?
- ✅ Browser console'da CORS hatası var mı?
- ✅ API bağlantısı çalışıyor mu?

### Admin Kontrolleri

- ✅ Login sayfası görüntüleniyor mu?
- ✅ API bağlantısı çalışıyor mu?

---

## 🔄 Otomatik Deployment

Vercel otomatik olarak:
- ✅ Her `git push` sonrası deploy eder
- ✅ Preview deployment'lar oluşturur (PR'lar için)
- ✅ Production deployment'ları otomatik yapar

### Manuel Deploy

```bash
# Vercel CLI ile
vercel --prod

# Veya Dashboard'dan
# Deployments → "Redeploy" butonuna tıklayın
```

---

## 🐛 Sorun Giderme

### Sorun: "Root Directory bulunamadı"

**Çözüm:**
- Vercel Dashboard → Project Settings → General
- "Root Directory" alanında doğru klasörü seçin:
  - Backend: `backend`
  - Frontend: `frontend`
  - Admin: `admin`

### Sorun: Build hatası

**Çözüm:**
1. Build loglarını kontrol edin: Vercel Dashboard → Deployments → Build Logs
2. `package.json` dosyasında build script'inin olduğundan emin olun
3. Dependencies eksikse `package.json` kontrol edin

### Sorun: Environment variables çalışmıyor

**Çözüm:**
1. Environment variables'ın doğru projeye eklendiğinden emin olun
2. Environment seçimini kontrol edin (Production/Preview/Development)
3. Deploy sonrası yeniden deploy edin (environment variables değişiklikleri için)

### Sorun: CORS hatası

**Çözüm:**
1. Backend environment variables'da `CORS_ORIGINS` kontrol edin
2. Domain'ler tam olarak eşleşmeli: `https://www.tulumbak.com` (sonunda / yok)
3. Backend'i yeniden deploy edin

### Sorun: API bağlantı hatası

**Çözüm:**
1. Frontend/Admin environment variables'da `VITE_BACKEND_URL` kontrol edin
2. Backend URL'in doğru olduğundan emin olun: `https://api.tulumbak.com`
3. Frontend/Admin'i yeniden deploy edin

---

## 📊 Vercel Dashboard Yapısı

```
Vercel Dashboard
├── tulumbak-backend (api.tulumbak.com)
│   ├── Deployments
│   ├── Settings
│   │   ├── Environment Variables
│   │   ├── Domains
│   │   └── General
│   └── Analytics
│
├── tulumbak-frontend (www.tulumbak.com)
│   ├── Deployments
│   ├── Settings
│   │   ├── Environment Variables
│   │   ├── Domains
│   │   └── General
│   └── Analytics
│
└── tulumbak-admin (admin.tulumbak.com)
    ├── Deployments
    ├── Settings
    │   ├── Environment Variables
    │   ├── Domains
    │   └── General
    └── Analytics
```

---

## 💡 İpuçları

1. **İlk Deploy:** İlk deploy'da tüm environment variables'ı ekleyin
2. **Test:** Her deploy sonrası test edin
3. **Logs:** Sorun yaşarsanız Vercel Dashboard → Deployments → Build Logs kontrol edin
4. **Preview:** PR'lar için otomatik preview deployment'lar oluşur
5. **Rollback:** Eski bir deployment'a geri dönebilirsiniz

---

## 📚 Ek Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Monorepo Deployment](https://vercel.com/docs/monorepos)

---

**Son Güncelleme:** 2024

