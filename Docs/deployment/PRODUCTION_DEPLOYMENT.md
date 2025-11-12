# 🚀 Production Deployment Rehberi

Bu rehber, Tulumbak E-Ticaret projesini production ortamına deploy etmek için gereken tüm adımları içerir.

## 📋 İçindekiler

1. [Ön Hazırlık](#ön-hazırlık)
2. [Domain ve SSL Ayarları](#domain-ve-ssl-ayarları)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Admin Panel Deployment](#admin-panel-deployment)
6. [Database Kurulumu](#database-kurulumu)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment Kontroller](#post-deployment-kontroller)
9. [Monitoring ve Logging](#monitoring-ve-logging)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Ön Hazırlık

### Gereksinimler

- ✅ Domain adları (örn: `www.tulumbak.com`, `api.tulumbak.com`, `admin.tulumbak.com`)
- ✅ SSL sertifikaları (Let's Encrypt veya ücretli SSL)
- ✅ MongoDB veritabanı (MongoDB Atlas veya kendi sunucunuz)
- ✅ Redis (opsiyonel ama önerilir)
- ✅ Vercel/Netlify hesabı veya kendi sunucunuz
- ✅ Email SMTP bilgileri
- ✅ PayTR merchant bilgileri

### Domain Yapılandırması

Önerilen domain yapısı:

```
www.tulumbak.com        → Frontend (Müşteri arayüzü)
api.tulumbak.com        → Backend API
admin.tulumbak.com      → Admin Panel
```

---

## 🌐 Domain ve SSL Ayarları

### 1. DNS Kayıtları

DNS ayarlarınızı aşağıdaki gibi yapılandırın:

```
A Record:
www.tulumbak.com        → Frontend IP
api.tulumbak.com        → Backend IP
admin.tulumbak.com      → Admin Panel IP

CNAME Record (Vercel kullanıyorsanız):
www.tulumbak.com        → cname.vercel-dns.com
api.tulumbak.com        → cname.vercel-dns.com
admin.tulumbak.com      → cname.vercel-dns.com
```

### 2. SSL Sertifikası

- **Vercel kullanıyorsanız:** Otomatik SSL sağlanır
- **Kendi sunucunuz varsa:** Let's Encrypt kullanarak ücretsiz SSL alın:

```bash
# Certbot ile SSL kurulumu
sudo certbot --nginx -d www.tulumbak.com -d api.tulumbak.com -d admin.tulumbak.com
```

---

## 🔧 Backend Deployment

### Vercel ile Deployment

1. **Vercel CLI ile deploy:**

```bash
cd backend
vercel --prod
```

2. **Environment Variables ayarlayın:**

Vercel Dashboard → Project Settings → Environment Variables

Tüm environment variable'ları ekleyin (`.env.example` dosyasındaki tüm değişkenler)

### Kendi Sunucunuzda Deployment

1. **Sunucuya bağlanın:**

```bash
ssh user@your-server-ip
```

2. **Projeyi klonlayın:**

```bash
git clone https://github.com/your-repo/tulumbak-master.git
cd tulumbak-master/backend
```

3. **Dependencies yükleyin:**

```bash
npm install --production
```

4. **Environment variables ayarlayın:**

```bash
cp .env.example .env
nano .env  # Değerleri doldurun
```

5. **PM2 ile çalıştırın:**

```bash
# PM2 kurulumu
npm install -g pm2

# Uygulamayı başlat
pm2 start server.js --name tulumbak-backend

# Otomatik başlatma için
pm2 startup
pm2 save
```

6. **Nginx reverse proxy (opsiyonel):**

```nginx
server {
    listen 80;
    server_name api.tulumbak.com;

    location / {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🎨 Frontend Deployment

### Vercel ile Deployment

1. **Vercel CLI ile deploy:**

```bash
cd frontend
vercel --prod
```

2. **Environment Variables:**

Vercel Dashboard → Project Settings → Environment Variables

```
VITE_BACKEND_URL=https://api.tulumbak.com
```

3. **Build Settings:**

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Netlify ile Deployment

1. **Netlify Dashboard'dan:**

- Repository'yi bağlayın
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables ekleyin

---

## 👨‍💼 Admin Panel Deployment

### Vercel ile Deployment

1. **Vercel CLI ile deploy:**

```bash
cd admin
vercel --prod
```

2. **Environment Variables:**

```
VITE_BACKEND_URL=https://api.tulumbak.com
```

---

## 🗄️ Database Kurulumu

### MongoDB Atlas (Önerilen)

1. **MongoDB Atlas hesabı oluşturun**
2. **Cluster oluşturun**
3. **Database User oluşturun**
4. **Network Access ayarlayın** (IP whitelist)
5. **Connection String'i alın:**

```
mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### Kendi Sunucunuzda MongoDB

```bash
# Docker ile MongoDB
docker run -d \
  --name tulumbak-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secure_password \
  -v mongo_data:/data/db \
  mongo:6
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=4001

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce

# Security
JWT_SECRET=your_super_secret_key_min_32_chars

# CORS
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com

# URLs
FRONTEND_URL=https://www.tulumbak.com
BACKEND_URL=https://api.tulumbak.com

# PayTR
MERCHANT_ID=your_merchant_id
MERCHANT_KEY=your_merchant_key
MERCHANT_SALT=your_merchant_salt
TEST_MODE=0

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Redis (opsiyonel)
REDIS_ENABLED=true
REDIS_URL=redis://your-redis-host:6379

# Sentry (opsiyonel)
SENTRY_DSN=your_sentry_dsn
```

### Frontend (.env)

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

### Admin (.env)

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

---

## ✅ Post-Deployment Kontroller

### 1. Backend Kontrolleri

```bash
# API health check
curl https://api.tulumbak.com/

# Swagger documentation
https://api.tulumbak.com/api-docs
```

### 2. Frontend Kontrolleri

- ✅ Ana sayfa yükleniyor mu?
- ✅ Ürünler listeleniyor mu?
- ✅ Sepet çalışıyor mu?
- ✅ Ödeme akışı çalışıyor mu?

### 3. Admin Panel Kontrolleri

- ✅ Login çalışıyor mu?
- ✅ Dashboard görüntüleniyor mu?
- ✅ Ürün ekleme/düzenleme çalışıyor mu?
- ✅ Sipariş yönetimi çalışıyor mu?

### 4. CORS Kontrolleri

Browser console'da CORS hatası olmamalı:

```javascript
// Test için
fetch('https://api.tulumbak.com/api/product/list')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 5. SSL Kontrolleri

- ✅ HTTPS çalışıyor mu?
- ✅ Mixed content hatası var mı?
- ✅ SSL sertifikası geçerli mi?

---

## 📊 Monitoring ve Logging

### 1. Sentry Error Tracking

Sentry DSN'i environment variable olarak ekleyin. Hatalar otomatik olarak Sentry'ye gönderilir.

### 2. Log Monitoring

Backend logları `backend/logs/` klasöründe tutulur:

- `combined.log` - Tüm loglar
- `error.log` - Sadece hatalar

### 3. PM2 Monitoring (Kendi sunucunuzda)

```bash
# PM2 monitoring
pm2 monit

# Logları görüntüle
pm2 logs tulumbak-backend
```

### 4. Uptime Monitoring

- UptimeRobot
- Pingdom
- StatusCake

---

## 🔍 Troubleshooting

### CORS Hataları

**Sorun:** Browser console'da CORS hatası

**Çözüm:**
1. Backend `.env` dosyasında `CORS_ORIGINS` değişkenini kontrol edin
2. Frontend domain'i listede olmalı
3. Backend'i yeniden başlatın

### API Bağlantı Hataları

**Sorun:** Frontend API'ye bağlanamıyor

**Çözüm:**
1. `VITE_BACKEND_URL` doğru mu kontrol edin
2. Backend çalışıyor mu kontrol edin
3. Firewall kurallarını kontrol edin

### Database Bağlantı Hataları

**Sorun:** MongoDB bağlantı hatası

**Çözüm:**
1. `MONGODB_URI` doğru mu kontrol edin
2. MongoDB Atlas'da IP whitelist kontrol edin
3. Database user permissions kontrol edin

### Build Hataları

**Sorun:** Frontend/Admin build hatası

**Çözüm:**
1. Node.js versiyonu kontrol edin (v18+)
2. `npm install` çalıştırın
3. Cache temizleyin: `rm -rf node_modules package-lock.json && npm install`

---

## 📝 Checklist

### Pre-Deployment

- [ ] Domain'ler hazır ve DNS ayarları yapıldı
- [ ] SSL sertifikaları kuruldu
- [ ] MongoDB veritabanı hazır
- [ ] Environment variables hazırlandı
- [ ] PayTR merchant bilgileri hazır
- [ ] Email SMTP bilgileri hazır

### Backend

- [ ] Backend deploy edildi
- [ ] Environment variables ayarlandı
- [ ] API health check başarılı
- [ ] Swagger documentation erişilebilir
- [ ] CORS ayarları doğru

### Frontend

- [ ] Frontend deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Ana sayfa yükleniyor
- [ ] API bağlantısı çalışıyor

### Admin Panel

- [ ] Admin panel deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Login çalışıyor
- [ ] Dashboard görüntüleniyor

### Post-Deployment

- [ ] Tüm sayfalar HTTPS ile çalışıyor
- [ ] CORS hataları yok
- [ ] Error tracking çalışıyor (Sentry)
- [ ] Logging çalışıyor
- [ ] Monitoring kuruldu

---

## 🆘 Destek

Sorun yaşarsanız:

1. Log dosyalarını kontrol edin
2. Browser console'u kontrol edin
3. Network tab'ını kontrol edin
4. Backend API'yi test edin (Postman/curl)

---

**Son Güncelleme:** 2024

