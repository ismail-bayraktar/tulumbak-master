# ✅ Vercel Deployment Checklist

Bu checklist, Vercel'e deployment yapmadan önce ve sonra kontrol edilmesi gereken tüm adımları içerir.

## 📋 Pre-Deployment Checklist

### Backend Hazırlık

- [ ] `backend/server.js` dosyası Vercel için export edilmiş (`export default app`)
- [ ] `backend/vercel.json` dosyası mevcut ve doğru yapılandırılmış
- [ ] `backend/package.json` build script'leri doğru
- [ ] Local'de backend çalışıyor ve test edildi
- [ ] MongoDB bağlantısı test edildi
- [ ] Tüm dependencies yüklü (`npm install`)

### Frontend Hazırlık

- [ ] `frontend/vercel.json` dosyası mevcut ve doğru yapılandırılmış
- [ ] `frontend/vite.config.js` production için optimize edilmiş
- [ ] `frontend/package.json` build script'leri doğru
- [ ] Local'de frontend build ediliyor (`npm run build`)
- [ ] Build output (`dist/`) kontrol edildi
- [ ] Tüm dependencies yüklü (`npm install`)

### Admin Hazırlık

- [ ] `admin/vercel.json` dosyası mevcut ve doğru yapılandırılmış
- [ ] `admin/vite.config.js` production için optimize edilmiş
- [ ] `admin/package.json` build script'leri doğru
- [ ] Local'de admin build ediliyor (`npm run build`)
- [ ] Build output (`dist/`) kontrol edildi
- [ ] Tüm dependencies yüklü (`npm install`)

### Environment Variables Hazırlık

- [ ] Tüm backend environment variables listesi hazır
- [ ] MongoDB URI hazır ve test edildi
- [ ] JWT_SECRET güçlü bir değer (min 32 karakter)
- [ ] PayTR credentials hazır (opsiyonel)
- [ ] SMTP credentials hazır (opsiyonel)
- [ ] Frontend/Admin backend URL'leri hazır

## 🚀 Deployment Checklist

### Backend Deployment

- [ ] Vercel CLI kurulu (`vercel --version`)
- [ ] Vercel'e login yapıldı (`vercel login`)
- [ ] Backend projesi oluşturuldu (`vercel`)
- [ ] Tüm backend environment variables eklendi
- [ ] Production deployment yapıldı (`vercel --prod`)
- [ ] Backend URL not edildi
- [ ] Backend API test edildi (`/` endpoint)
- [ ] MongoDB bağlantısı çalışıyor
- [ ] CORS yapılandırması doğru

### Frontend Deployment

- [ ] Frontend projesi oluşturuldu (`vercel`)
- [ ] `VITE_BACKEND_URL` environment variable eklendi
- [ ] Backend URL değeri doğru
- [ ] Production deployment yapıldı (`vercel --prod`)
- [ ] Frontend URL not edildi
- [ ] Sayfa yükleniyor
- [ ] SPA routing çalışıyor (404 hatası yok)
- [ ] API çağrıları çalışıyor
- [ ] CORS hatası yok

### Admin Deployment

- [ ] Admin projesi oluşturuldu (`vercel`)
- [ ] `VITE_BACKEND_URL` environment variable eklendi
- [ ] Backend URL değeri doğru
- [ ] Production deployment yapıldı (`vercel --prod`)
- [ ] Admin URL not edildi
- [ ] Sayfa yükleniyor
- [ ] SPA routing çalışıyor (404 hatası yok)
- [ ] Login sayfası çalışıyor
- [ ] API çağrıları çalışıyor
- [ ] CORS hatası yok

## 🔧 Post-Deployment Checklist

### Backend Kontrolleri

- [ ] API endpoint'leri erişilebilir
- [ ] Swagger documentation çalışıyor (`/api-docs`)
- [ ] Health check endpoint çalışıyor (`/`)
- [ ] MongoDB bağlantısı stabil
- [ ] Error handling çalışıyor
- [ ] Logging çalışıyor (Vercel Functions logs)
- [ ] Rate limiting çalışıyor
- [ ] CORS headers doğru

### Frontend Kontrolleri

- [ ] Ana sayfa yükleniyor
- [ ] Ürün listesi görüntüleniyor
- [ ] Ürün detay sayfası çalışıyor
- [ ] Sepet işlevleri çalışıyor
- [ ] Checkout süreci çalışıyor
- [ ] API çağrıları başarılı
- [ ] Error handling çalışıyor
- [ ] Loading states çalışıyor
- [ ] Responsive tasarım çalışıyor

### Admin Kontrolleri

- [ ] Login sayfası çalışıyor
- [ ] Authentication çalışıyor
- [ ] Dashboard yükleniyor
- [ ] Ürün yönetimi çalışıyor
- [ ] Sipariş yönetimi çalışıyor
- [ ] API çağrıları başarılı
- [ ] Error handling çalışıyor
- [ ] Form validasyonları çalışıyor

### Entegrasyon Kontrolleri

- [ ] Frontend → Backend API çağrıları çalışıyor
- [ ] Admin → Backend API çağrıları çalışıyor
- [ ] PayTR ödeme entegrasyonu çalışıyor (opsiyonel)
- [ ] Email gönderimi çalışıyor (opsiyonel)
- [ ] SMS gönderimi çalışıyor (opsiyonel)
- [ ] Webhook'lar çalışıyor (opsiyonel)

## 🌐 Domain Yapılandırması (Opsiyonel)

### Backend Domain

- [ ] Custom domain eklendi (`api.tulumbak.com`)
- [ ] DNS kayıtları yapılandırıldı
- [ ] SSL sertifikası aktif
- [ ] Domain doğrulandı
- [ ] Backend URL güncellendi (environment variables)

### Frontend Domain

- [ ] Custom domain eklendi (`www.tulumbak.com`)
- [ ] DNS kayıtları yapılandırıldı
- [ ] SSL sertifikası aktif
- [ ] Domain doğrulandı
- [ ] Frontend URL güncellendi (CORS, PayTR callbacks)

### Admin Domain

- [ ] Custom domain eklendi (`admin.tulumbak.com`)
- [ ] DNS kayıtları yapılandırıldı
- [ ] SSL sertifikası aktif
- [ ] Domain doğrulandı
- [ ] Admin URL güncellendi (CORS)

## 🔄 Continuous Deployment (Opsiyonel)

### Git Integration

- [ ] GitHub/GitLab repository bağlandı
- [ ] Vercel projeleri Git ile bağlandı
- [ ] Root directory ayarlandı:
  - Backend: `backend`
  - Frontend: `frontend`
  - Admin: `admin`
- [ ] Build command'lar doğru
- [ ] Output directory'ler doğru
- [ ] Auto-deploy aktif
- [ ] Preview deployments çalışıyor

### Branch Strategy

- [ ] Production branch belirlendi (`main` veya `master`)
- [ ] Preview deployments çalışıyor
- [ ] Branch protection kuralları ayarlandı (opsiyonel)

## 📊 Monitoring & Analytics

### Vercel Analytics

- [ ] Vercel Analytics aktif
- [ ] Performance metrikleri görüntüleniyor
- [ ] Error tracking aktif
- [ ] Real-time monitoring çalışıyor

### Backend Monitoring

- [ ] Function logs görüntüleniyor
- [ ] Error tracking çalışıyor (Sentry opsiyonel)
- [ ] Performance metrikleri izleniyor
- [ ] Rate limiting metrikleri görüntüleniyor

## 🔒 Güvenlik Kontrolleri

### Environment Variables

- [ ] Tüm secrets güvenli
- [ ] Production ve development secrets ayrı
- [ ] Secrets commit edilmedi
- [ ] JWT_SECRET güçlü (min 32 karakter)
- [ ] MongoDB credentials güvenli

### CORS & Security Headers

- [ ] CORS origins doğru yapılandırılmış
- [ ] Wildcard (`*`) kullanılmıyor production'da
- [ ] Security headers aktif (Helmet)
- [ ] CSP yapılandırması doğru

### HTTPS

- [ ] Tüm domain'ler HTTPS kullanıyor
- [ ] SSL sertifikaları aktif
- [ ] Mixed content hatası yok

## 🐛 Sorun Giderme

### Yaygın Sorunlar

- [ ] Build hataları çözüldü
- [ ] Environment variables çalışıyor
- [ ] CORS hataları çözüldü
- [ ] 404 hataları çözüldü (SPA routing)
- [ ] API timeout sorunları çözüldü
- [ ] MongoDB bağlantı sorunları çözüldü

### Log Kontrolleri

- [ ] Vercel build logları kontrol edildi
- [ ] Function logs kontrol edildi
- [ ] Browser console hataları kontrol edildi
- [ ] Network tab hataları kontrol edildi

## 📝 Dokümantasyon

- [ ] Deployment rehberi okundu
- [ ] Environment variables dokümantasyonu okundu
- [ ] Sorun giderme rehberi okundu
- [ ] Team members bilgilendirildi

## ✅ Final Checklist

- [ ] Tüm deployment'lar başarılı
- [ ] Tüm testler geçti
- [ ] Production ortamı stabil
- [ ] Monitoring aktif
- [ ] Backup stratejisi hazır (MongoDB)
- [ ] Rollback planı hazır
- [ ] Team members erişim bilgileri paylaşıldı

---

**Checklist Versiyonu:** 1.0.0
**Son Güncelleme:** 2025-01-13

**Not:** Bu checklist'i deployment öncesi ve sonrası kullanarak hiçbir adımı atlamadığınızdan emin olun.

