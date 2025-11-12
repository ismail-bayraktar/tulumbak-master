# 💳 PayTR Entegrasyonu - Kurulum ve Yapılandırma Rehberi

Bu rehber, PayTR ödeme entegrasyonunu production için nasıl yapılandıracağınızı anlatır.

## 📋 İçindekiler

1. [PayTR Bilgilerini Alma](#paytr-bilgilerini-alma)
2. [Environment Variables Ayarlama](#environment-variables-ayarlama)
3. [Callback URL'leri Yapılandırma](#callback-urlleri-yapılandırma)
4. [Test Modu vs Production Modu](#test-modu-vs-production-modu)
5. [PayTR Panel Ayarları](#paytr-panel-ayarları)
6. [Test Etme](#test-etme)
7. [Sorun Giderme](#sorun-giderme)

---

## 🔑 PayTR Bilgilerini Alma

PayTR'den almanız gereken bilgiler:

1. **Merchant ID** - Mağaza numaranız
2. **Merchant Key** - API anahtarınız
3. **Merchant Salt** - Güvenlik salt değeriniz

Bu bilgileri PayTR panelinizden alabilirsiniz:
- PayTR Panel → Ayarlar → API Bilgileri

---

## ⚙️ Environment Variables Ayarlama

### Backend `.env` Dosyası

PayTR için gerekli environment variables:

```env
# ============================================
# PAYMENT GATEWAY (PayTR)
# ============================================
MERCHANT_ID=your_paytr_merchant_id
MERCHANT_KEY=your_paytr_merchant_key
MERCHANT_SALT=your_paytr_merchant_salt

# Test Modu (0 = Production, 1 = Test)
TEST_MODE=0

# Callback URL'leri (Production domain'leriniz)
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail
```

### Örnek Yapılandırma

```env
# Production için
MERCHANT_ID=123456
MERCHANT_KEY=abc123def456ghi789
MERCHANT_SALT=xyz789uvw456rst123
TEST_MODE=0
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail

# Development için (test modu)
TEST_MODE=1
MERCHANT_OK_URL=http://localhost:5173/orders
MERCHANT_FAIL_URL=http://localhost:5173/paymentfail
```

---

## 🔗 Callback URL'leri Yapılandırma

### Backend Callback Endpoint

PayTR callback'leri şu endpoint'e gönderilir:
```
POST https://api.tulumbak.com/api/paytr/callback
```

Bu endpoint otomatik olarak:
- ✅ Hash doğrulaması yapar
- ✅ Ödeme durumunu kontrol eder
- ✅ Siparişi günceller (`payment: true`)
- ✅ Kullanıcının sepetini temizler

### Frontend Success/Fail Sayfaları

**Success Sayfası:**
- URL: `https://www.tulumbak.com/orders`
- Kullanıcı ödeme başarılı olduğunda buraya yönlendirilir
- Siparişler sayfasında başarılı ödeme görüntülenir

**Fail Sayfası:**
- URL: `https://www.tulumbak.com/paymentfail`
- Kullanıcı ödeme başarısız olduğunda buraya yönlendirilir
- Hata mesajı gösterilir

---

## 🧪 Test Modu vs Production Modu

### Test Modu (`TEST_MODE=1`)

**Kullanım:**
- Development ortamında test için
- Gerçek para çekilmez
- Test kartları kullanılır

**Test Kartları:**
```
Kart Numarası: 4355 0808 0000 0008
Son Kullanma: 12/25
CVV: 000
```

**Avantajları:**
- Gerçek para çekilmeden test yapabilirsiniz
- Tüm akışı test edebilirsiniz

### Production Modu (`TEST_MODE=0`)

**Kullanım:**
- Production ortamında
- Gerçek para çekilir
- Gerçek kartlar kullanılır

**⚠️ ÖNEMLİ:**
- Production'a deploy etmeden önce mutlaka test modunda test edin
- Production'da `TEST_MODE=0` olduğundan emin olun

---

## 🎛️ PayTR Panel Ayarları

PayTR panelinizde yapmanız gereken ayarlar:

### 1. Callback URL Ayarları

PayTR Panel → Ayarlar → Callback URL'leri:

```
Callback URL: https://api.tulumbak.com/api/paytr/callback
```

### 2. IP Whitelist (Opsiyonel)

Eğer IP bazlı güvenlik kullanıyorsanız:
- Backend sunucunuzun IP adresini PayTR panel'e ekleyin

### 3. Ödeme Yöntemleri

PayTR Panel → Ayarlar → Ödeme Yöntemleri:
- ✅ Kredi Kartı
- ✅ Banka Kartı
- ✅ Taksit Seçenekleri (isteğe bağlı)

---

## ✅ Test Etme

### 1. Test Modunda Test

```env
# Backend .env
TEST_MODE=1
MERCHANT_OK_URL=http://localhost:5173/orders
MERCHANT_FAIL_URL=http://localhost:5173/paymentfail
```

**Test Adımları:**
1. Frontend'i başlatın (`npm run dev`)
2. Backend'i başlatın (`npm start`)
3. Bir ürün sepete ekleyin
4. Checkout sayfasına gidin
5. PayTR ödeme yöntemini seçin
6. Test kartı ile ödeme yapın
7. Success sayfasına yönlendirilmelisiniz

### 2. Production'da Test

```env
# Backend .env
TEST_MODE=0
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail
```

**⚠️ DİKKAT:**
- Production'da gerçek para çekilir
- Küçük bir tutarla test yapın
- Test sonrası iade edebilirsiniz

---

## 🔍 Sorun Giderme

### Sorun 1: "PayTR'den geçersiz yanıt alındı"

**Neden:**
- Merchant bilgileri yanlış
- API endpoint'e erişim sorunu

**Çözüm:**
1. `.env` dosyasındaki `MERCHANT_ID`, `MERCHANT_KEY`, `MERCHANT_SALT` kontrol edin
2. PayTR panel'den bilgileri doğrulayın
3. Backend loglarını kontrol edin: `backend/logs/error.log`

### Sorun 2: "Hash mismatch"

**Neden:**
- Callback hash doğrulaması başarısız
- Merchant salt yanlış

**Çözüm:**
1. `MERCHANT_SALT` değerini kontrol edin
2. PayTR panel'den salt değerini doğrulayın
3. Callback endpoint'inin çalıştığından emin olun

### Sorun 3: Callback çalışmıyor

**Neden:**
- Callback URL yanlış yapılandırılmış
- PayTR panel'de callback URL ayarlanmamış

**Çözüm:**
1. PayTR panel'de callback URL'i kontrol edin
2. Backend endpoint'inin çalıştığından emin olun: `https://api.tulumbak.com/api/paytr/callback`
3. Backend loglarını kontrol edin

### Sorun 4: Ödeme başarılı ama sipariş güncellenmiyor

**Neden:**
- Callback endpoint'inde hata
- Database bağlantı sorunu

**Çözüm:**
1. Backend loglarını kontrol edin: `backend/logs/error.log`
2. Callback endpoint'inin çalıştığını test edin
3. Database bağlantısını kontrol edin

---

## 📊 PayTR Entegrasyon Akışı

```
1. Kullanıcı checkout sayfasında PayTR seçer
   ↓
2. Frontend → Backend: POST /api/paytr/get-token
   ↓
3. Backend PayTR API'ye token isteği gönderir
   ↓
4. PayTR token döner
   ↓
5. Frontend PayTR iframe'i açar (yeni sekmede)
   ↓
6. Kullanıcı kart bilgilerini girer ve ödeme yapar
   ↓
7. PayTR → Backend: POST /api/paytr/callback
   ↓
8. Backend hash doğrulaması yapar
   ↓
9. Sipariş güncellenir (payment: true)
   ↓
10. Kullanıcı sepeti temizlenir
    ↓
11. PayTR → Frontend: Redirect to success/fail page
```

---

## ✅ Production Checklist

PayTR için production'a deploy etmeden önce:

- [ ] PayTR merchant bilgileri alındı
- [ ] `.env` dosyasında `MERCHANT_ID` ayarlandı
- [ ] `.env` dosyasında `MERCHANT_KEY` ayarlandı
- [ ] `.env` dosyasında `MERCHANT_SALT` ayarlandı
- [ ] `TEST_MODE=0` (Production modu)
- [ ] `MERCHANT_OK_URL` production domain'i
- [ ] `MERCHANT_FAIL_URL` production domain'i
- [ ] PayTR panel'de callback URL ayarlandı
- [ ] Test modunda test edildi
- [ ] Backend logları kontrol edildi
- [ ] Callback endpoint çalışıyor

---

## 📞 Destek

PayTR ile ilgili sorunlar için:
- PayTR Destek: https://www.paytr.com/iletisim
- Backend Logları: `backend/logs/error.log`
- PayTR Panel: https://www.paytr.com

---

**Son Güncelleme:** 2024

