# 🔐 Vercel Environment Variables Rehberi

Bu dokümantasyon, Vercel deployment için gereken tüm environment variables'ları içerir.

## 📋 İçindekiler

1. [Backend Environment Variables](#backend-environment-variables)
2. [Frontend Environment Variables](#frontend-environment-variables)
3. [Admin Environment Variables](#admin-environment-variables)
4. [Vercel'de Environment Variables Ekleme](#vercelde-environment-variables-ekleme)
5. [Environment Variables Yönetimi](#environment-variables-yönetimi)

## 🔧 Backend Environment Variables

### Zorunlu Variables

#### Server Configuration
```env
NODE_ENV=production
PORT=4001
```

#### Database Configuration
```env
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin
```

**Not:** MongoDB Atlas kullanıyorsanız:
- IP whitelist'e Vercel IP'lerini ekleyin (0.0.0.0/0 geçici olarak kullanılabilir)
- Connection string formatı: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

#### Security & Authentication
```env
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
ADMIN_EMAIL=admin@tulumbak.com
ADMIN_PASSWORD=secure_password_here
```

**Güvenlik Notları:**
- `JWT_SECRET` en az 32 karakter olmalı
- Güçlü bir password kullanın
- Production'da farklı secrets kullanın

#### CORS & Security Headers
```env
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com
CSP_IMAGE_SOURCES=https://www.tulumbak.com,https://api.tulumbak.com
```

**Not:** Development için localhost ekleyebilirsiniz:
```env
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com,http://localhost:5173,http://localhost:5174
```

#### Frontend & Backend URLs
```env
FRONTEND_URL=https://www.tulumbak.com
BACKEND_URL=https://api.tulumbak.com
WEBHOOK_BASE_URL=https://api.tulumbak.com
```

### Payment Gateway (PayTR)

```env
MERCHANT_ID=your_paytr_merchant_id
MERCHANT_KEY=your_paytr_merchant_key
MERCHANT_SALT=your_paytr_merchant_salt
TEST_MODE=0
MERCHANT_OK_URL=https://www.tulumbak.com/success
MERCHANT_FAIL_URL=https://www.tulumbak.com/failed
```

**Not:** Test modu için `TEST_MODE=1` kullanın.

### Email Configuration (SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**Gmail için:**
- App Password kullanın (normal şifre değil)
- 2FA aktif olmalı
- [Google App Passwords](https://myaccount.google.com/apppasswords)

**Diğer SMTP Sağlayıcıları:**
```env
# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key

# Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your_mailgun_username
SMTP_PASSWORD=your_mailgun_password
```

### Opsiyonel Variables

#### Redis Cache
```env
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379
```

**Redis Kullanımı:**
- Vercel'de Redis için Upstash veya Redis Cloud kullanın
- `REDIS_ENABLED=true` yapın
- `REDIS_URL` değerini sağlayıcınızdan alın

#### Error Tracking (Sentry)
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Not:** Sentry kullanmak istemiyorsanız boş bırakabilirsiniz.

#### SMS Configuration
```env
SMS_PROVIDER=netgsm
SMS_ENABLED=false
SMS_API_KEY=your_sms_api_key
SMS_FROM=your_sms_sender_name
```

**SMS Sağlayıcıları:**
- `netgsm`: NetGSM
- `mesajpanel`: MesajPanel

#### Mudita Kurye Integration
```env
MUDITA_ENABLED=false
MUDITA_API_URL=https://api.muditakurye.com.tr
MUDITA_API_KEY=your_mudita_api_key
MUDITA_API_SECRET=your_mudita_api_secret
MUDITA_RESTAURANT_ID=your_restaurant_id
MUDITA_WEBHOOK_SECRET=your_webhook_secret
MUDITA_TEST_MODE=false
MUDITA_WEBHOOK_ONLY_MODE=false
```

#### Webhook Encryption
```env
WEBHOOK_ENCRYPTION_KEY=your_webhook_encryption_key_min_32_chars
```

**Güvenlik:** En az 32 karakter güçlü bir key kullanın.

#### Bank Information
```env
BANK_IBAN=TR00 0000 0000 0000 0000 0000 00
BANK_ACCOUNT_NAME=Tulumbak Gıda
BANK_NAME=Banka Adı
```

#### Retry & Circuit Breaker Configuration
```env
RETRY_MAX_ATTEMPTS=5
RETRY_BASE_DELAY=1000
RETRY_MAX_DELAY=300000
CIRCUIT_BREAKER_ENABLED=true
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_TIMEOUT=60000
CIRCUIT_BREAKER_RESET_TIMEOUT=120000
```

**Not:** Bu değerler genellikle varsayılan olarak yeterlidir.

#### Swagger Documentation
```env
SWAGGER_DEV_URL=http://localhost:4001
SWAGGER_PROD_URL=https://api.tulumbak.com
```

## 🎨 Frontend Environment Variables

### Zorunlu Variables

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

**Not:** 
- `VITE_` prefix'i zorunludur (Vite build-time variables)
- Development için: `http://localhost:4001`
- Production için: Backend URL'inizi girin

## 👨‍💼 Admin Environment Variables

### Zorunlu Variables

```env
VITE_BACKEND_URL=https://api.tulumbak.com
```

**Not:** 
- `VITE_` prefix'i zorunludur (Vite build-time variables)
- Development için: `http://localhost:4001`
- Production için: Backend URL'inizi girin

## 🚀 Vercel'de Environment Variables Ekleme

### Yöntem 1: Vercel Dashboard

1. Vercel Dashboard'a gidin
2. Projenizi seçin
3. **Settings** → **Environment Variables** bölümüne gidin
4. **Add New** butonuna tıklayın
5. Key ve Value'yu girin
6. Environment'ı seçin (Production, Preview, Development)
7. **Save** butonuna tıklayın

### Yöntem 2: Vercel CLI

```bash
# Production environment
vercel env add VARIABLE_NAME production

# Preview environment
vercel env add VARIABLE_NAME preview

# Development environment
vercel env add VARIABLE_NAME development
```

### Yöntem 3: Toplu Ekleme (CLI)

```bash
# .env dosyasından ekleme
vercel env pull .env.production
# Dosyayı düzenleyin
vercel env push .env.production
```

## 📊 Environment Variables Yönetimi

### Environment Types

Vercel'de 3 farklı environment type vardır:

1. **Production**: Production deployment'lar için
2. **Preview**: Preview deployment'lar için (branch-based)
3. **Development**: Local development için (`vercel dev`)

### Best Practices

1. **Secrets Yönetimi:**
   - Asla secrets'ları commit etmeyin
   - Her environment için farklı secrets kullanın
   - Düzenli olarak secrets'ları rotate edin

2. **Variable Naming:**
   - Büyük harf kullanın
   - Alt çizgi ile ayırın (`SNAKE_CASE`)
   - Açıklayıcı isimler kullanın

3. **Value Validation:**
   - Değerleri eklemeden önce doğrulayın
   - Özellikle URL'lerin sonunda `/` olmamasına dikkat edin
   - MongoDB URI formatını kontrol edin

4. **Documentation:**
   - Her variable için açıklama ekleyin
   - Hangi environment'lar için gerekli olduğunu belirtin

### Environment Variables Listesi (Hızlı Referans)

#### Backend - Zorunlu
```
NODE_ENV
PORT
MONGODB_URI
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
CORS_ORIGINS
FRONTEND_URL
BACKEND_URL
WEBHOOK_BASE_URL
```

#### Backend - PayTR
```
MERCHANT_ID
MERCHANT_KEY
MERCHANT_SALT
TEST_MODE
MERCHANT_OK_URL
MERCHANT_FAIL_URL
```

#### Backend - Email
```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
```

#### Frontend/Admin - Zorunlu
```
VITE_BACKEND_URL
```

### Environment Variables Kontrol Listesi

Deployment öncesi kontrol edin:

- [ ] Tüm zorunlu variables eklendi
- [ ] Production environment'ı seçildi
- [ ] Values doğru format'ta
- [ ] Secrets güvenli
- [ ] MongoDB URI doğru
- [ ] CORS origins doğru
- [ ] Frontend/Admin backend URL'leri doğru
- [ ] PayTR credentials doğru (production için)
- [ ] SMTP credentials doğru
- [ ] Değişikliklerden sonra redeploy yapıldı

## 🔄 Environment Variables Güncelleme

### Değişiklik Sonrası

Environment variables değiştirildikten sonra:

1. **Backend için:** Yeniden deploy gerekir (serverless functions)
2. **Frontend/Admin için:** Yeniden build ve deploy gerekir

### Otomatik Redeploy

Vercel, environment variables değiştiğinde otomatik olarak redeploy yapmaz. Manuel olarak:

```bash
vercel --prod
```

veya Vercel Dashboard'dan **Redeploy** butonuna tıklayın.

## 🐛 Sorun Giderme

### Environment Variable Çalışmıyor

1. **Variable adını kontrol edin:** Büyük/küçük harf duyarlı
2. **Environment'ı kontrol edin:** Doğru environment'a eklendi mi?
3. **Redeploy yapın:** Değişikliklerden sonra redeploy gerekir
4. **Build loglarını kontrol edin:** Vercel Dashboard → Deployments → Build Logs

### Vite Variables Çalışmıyor

- `VITE_` prefix'i zorunludur
- Build-time variables'dır (runtime'da değiştirilemez)
- Değişiklik için yeniden build gerekir

### MongoDB Bağlantı Hatası

- MongoDB URI formatını kontrol edin
- IP whitelist'i kontrol edin
- `authSource` parametresini kontrol edin
- MongoDB Atlas kullanıyorsanız network access ayarlarını kontrol edin

---

**Son Güncelleme:** 2025-01-13
**Versiyon:** 1.0.0

