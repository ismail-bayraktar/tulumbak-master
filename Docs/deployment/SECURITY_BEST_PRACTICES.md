# 🔒 Production Security Best Practices

Bu dokümantasyon, production ortamında güvenlik için dikkat edilmesi gereken noktaları içerir.

## ✅ Mevcut Güvenlik Özellikleri

### 1. Helmet.js Security Headers
- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Strict-Transport-Security (HTTPS zorunlu)

### 2. CORS Protection
- ✅ Environment variable'dan alınan origin kontrolü
- ✅ Production'da development modu kapalı
- ✅ Credentials desteği

### 3. Rate Limiting
- ✅ API endpoint'lerinde rate limiting aktif
- ✅ 100 request / 15 dakika limiti

### 4. Authentication
- ✅ JWT token bazlı authentication
- ✅ Bcrypt ile şifre hashleme

## 🔐 Production İçin Güvenlik Kontrol Listesi

### Environment Variables Security

#### ✅ JWT Secret
```env
# ❌ YANLIŞ
JWT_SECRET=secret123

# ✅ DOĞRU
JWT_SECRET=super_secret_key_min_32_characters_long_random_string
```

**Kontrol:**
- [ ] JWT secret en az 32 karakter
- [ ] Rastgele ve güçlü bir string
- [ ] Production ve development farklı secret'lar kullanıyor

#### ✅ Database Credentials
```env
# ✅ MongoDB Atlas (Önerilen)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db

# ✅ Kendi sunucunuzda
MONGODB_URI=mongodb://username:strong_password@host:27017/db
```

**Kontrol:**
- [ ] Database şifresi güçlü (min 16 karakter)
- [ ] Database user'ın sadece gerekli yetkileri var
- [ ] IP whitelist aktif (MongoDB Atlas)

#### ✅ CORS Origins
```env
# ❌ YANLIŞ (Development domain'leri production'da)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# ✅ DOĞRU
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com
```

**Kontrol:**
- [ ] Sadece production domain'leri listede
- [ ] HTTPS kullanılıyor (HTTP değil)
- [ ] Wildcard (*) kullanılmıyor

### PayTR Security

#### ✅ Test Mode
```env
# ❌ YANLIŞ (Production'da test mode açık)
TEST_MODE=1

# ✅ DOĞRU
TEST_MODE=0
```

**Kontrol:**
- [ ] Production'da `TEST_MODE=0`
- [ ] Merchant bilgileri production credentials
- [ ] Callback URL'leri production domain'leri

### Admin Security

#### ✅ Admin Credentials
```env
# ❌ YANLIŞ (Default şifre)
ADMIN_PASSWORD=admin123

# ✅ DOĞRU
ADMIN_PASSWORD=strong_password_min_12_chars_with_special_chars
```

**Kontrol:**
- [ ] Admin şifresi güçlü (min 12 karakter)
- [ ] Default şifre kullanılmıyor
- [ ] Admin email geçerli ve erişilebilir

### SSL/HTTPS Security

**Kontrol:**
- [ ] Tüm domain'lerde HTTPS aktif
- [ ] SSL sertifikası geçerli ve güncel
- [ ] HTTP → HTTPS redirect aktif
- [ ] Mixed content hataları yok

### API Security

#### ✅ Rate Limiting
- [ ] Rate limiting aktif
- [ ] Limit değerleri production trafiğine uygun
- [ ] IP bazlı rate limiting düşünülmeli (gelecek)

#### ✅ Input Validation
- [ ] Tüm input'lar validate ediliyor
- [ ] SQL injection koruması (Mongoose kullanıldığı için otomatik)
- [ ] XSS koruması (Helmet CSP ile)

#### ✅ Error Handling
- [ ] Production'da detaylı error mesajları gösterilmiyor
- [ ] Error logging aktif (Sentry)
- [ ] Stack trace'ler production'da gizli

## 🛡️ Güvenlik İyileştirme Önerileri

### 1. IP Whitelisting (Gelecek)
```javascript
// Admin endpoint'leri için IP whitelist eklenebilir
const adminIPs = process.env.ADMIN_IP_WHITELIST?.split(',') || [];
```

### 2. API Key Authentication (Gelecek)
```javascript
// Public API endpoint'leri için API key authentication
const apiKey = req.headers['x-api-key'];
```

### 3. Request Logging
```javascript
// Şüpheli aktiviteleri logla
logger.warn('Suspicious activity', { ip, endpoint, userAgent });
```

### 4. Database Connection Security
- [ ] MongoDB connection string SSL/TLS ile
- [ ] Database backup'ları şifrelenmiş
- [ ] Regular security audit

### 5. Dependency Security
```bash
# Düzenli olarak çalıştırın
npm audit
npm audit fix
```

## 🔍 Security Audit Checklist

### Pre-Deployment
- [ ] Tüm environment variables kontrol edildi
- [ ] Default şifreler değiştirildi
- [ ] Test mode kapatıldı
- [ ] CORS origins production domain'leri
- [ ] SSL sertifikaları geçerli

### Post-Deployment
- [ ] HTTPS tüm sayfalarda aktif
- [ ] CORS hataları yok
- [ ] Security headers kontrol edildi
- [ ] Rate limiting çalışıyor
- [ ] Error tracking aktif

### Regular Maintenance
- [ ] Dependencies güncel (`npm audit`)
- [ ] Log dosyaları kontrol ediliyor
- [ ] Security alerts takip ediliyor
- [ ] Backup'lar test ediliyor

## 🚨 Security Incident Response

### 1. Şüpheli Aktivite Tespit Edildiğinde

1. **Hemen logları kontrol edin:**
   ```bash
   tail -f backend/logs/error.log
   tail -f backend/logs/combined.log
   ```

2. **Sentry'de hataları kontrol edin**

3. **Rate limiting'i artırın (gerekirse)**

4. **IP'yi block edin (gerekirse)**

### 2. Güvenlik Açığı Tespit Edildiğinde

1. **Hemen patch uygulayın**
2. **Dependencies güncelleyin**
3. **Kullanıcıları bilgilendirin (gerekirse)**
4. **Security audit yapın**

## 📚 Kaynaklar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Son Güncelleme:** 2024

