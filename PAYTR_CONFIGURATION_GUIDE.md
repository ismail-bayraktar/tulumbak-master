# 💳 PayTR Yapılandırma Rehberi

PayTR bilgilerinizi projeye entegre etmek için bu rehberi takip edin.

## 📋 PayTR Bilgileriniz

PayTR panelinizden şu bilgileri hazırlayın:

1. **Merchant ID** (Mağaza numaranız)
2. **Merchant Key** (API anahtarınız)
3. **Merchant Salt** (Güvenlik salt değeriniz)

---

## 🔧 Adım Adım Yapılandırma

### Adım 1: Backend `.env` Dosyasını Açın

```bash
cd backend
# Eğer .env dosyası yoksa:
cp env.example .env

# .env dosyasını düzenleyin
nano .env  # veya editörünüzle açın
```

### Adım 2: PayTR Bilgilerinizi Ekleyin

`.env` dosyasında şu satırları bulun ve PayTR bilgilerinizle doldurun:

```env
# ============================================
# PAYMENT GATEWAY (PayTR)
# ============================================
MERCHANT_ID=buraya_merchant_id_yazin
MERCHANT_KEY=buraya_merchant_key_yazin
MERCHANT_SALT=buraya_merchant_salt_yazin
TEST_MODE=0
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail
```

### Adım 3: Domain'lerinizi Güncelleyin

`MERCHANT_OK_URL` ve `MERCHANT_FAIL_URL` değerlerini kendi domain'inizle değiştirin:

```env
# Örnek (kendi domain'inizi yazın):
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail

# Development için (test sırasında):
# MERCHANT_OK_URL=http://localhost:5173/orders
# MERCHANT_FAIL_URL=http://localhost:5173/paymentfail
```

### Adım 4: Test Modunu Ayarlayın

**Development/Test için:**
```env
TEST_MODE=1  # Test modu açık
```

**Production için:**
```env
TEST_MODE=0  # Test modu kapalı (gerçek ödeme)
```

⚠️ **ÖNEMLİ:** Production'a deploy etmeden önce mutlaka `TEST_MODE=1` ile test edin!

### Adım 5: Backend'i Yeniden Başlatın

```bash
# PM2 kullanıyorsanız:
pm2 restart tulumbak-backend

# Veya normal başlatma:
npm start
```

---

## ✅ PayTR Panel Ayarları

PayTR panelinizde yapmanız gereken ayarlar:

### 1. Callback URL Ayarlayın

PayTR Panel → Ayarlar → Callback URL:

```
https://api.tulumbak.com/api/paytr/callback
```

⚠️ **ÖNEMLİ:** Domain'inizi yazın! (`api.tulumbak.com` yerine kendi backend domain'iniz)

### 2. IP Whitelist (Opsiyonel)

Eğer PayTR panel'de IP bazlı güvenlik varsa:
- Backend sunucunuzun IP adresini ekleyin

---

## 🧪 Test Etme

### Test Modunda Test (Önerilen)

1. `.env` dosyasında `TEST_MODE=1` olduğundan emin olun
2. Frontend'i başlatın: `cd frontend && npm run dev`
3. Backend'i başlatın: `cd backend && npm start`
4. Bir ürün sepete ekleyin
5. Checkout sayfasına gidin
6. "Kredi/Banka Kartı" ödeme yöntemini seçin
7. Test kartı ile ödeme yapın:
   - **Kart No:** `4355 0808 0000 0008`
   - **Son Kullanma:** `12/25`
   - **CVV:** `000`
8. Başarılı ödeme sonrası `/orders` sayfasına yönlendirilmelisiniz

### Production'da Test

⚠️ **DİKKAT:** Production'da gerçek para çekilir!

1. `.env` dosyasında `TEST_MODE=0` olduğundan emin olun
2. Küçük bir tutarla test yapın (örn: 1 TL)
3. Test sonrası iade edebilirsiniz

---

## 🔍 Sorun Giderme

### Sorun: "PayTR'den geçersiz yanıt alındı"

**Çözüm:**
1. `.env` dosyasındaki `MERCHANT_ID`, `MERCHANT_KEY`, `MERCHANT_SALT` değerlerini kontrol edin
2. PayTR panel'den bilgileri tekrar kopyalayın (boşluk olmamalı)
3. Backend loglarını kontrol edin: `backend/logs/error.log`

### Sorun: Callback çalışmıyor

**Çözüm:**
1. PayTR panel'de callback URL'in doğru ayarlandığından emin olun
2. Backend endpoint'inin çalıştığını test edin: `curl https://api.tulumbak.com/api/paytr/callback`
3. Backend loglarını kontrol edin

### Sorun: Ödeme başarılı ama sipariş güncellenmiyor

**Çözüm:**
1. Backend loglarını kontrol edin: `tail -f backend/logs/error.log`
2. Callback endpoint'inin çalıştığını doğrulayın
3. Database bağlantısını kontrol edin

---

## 📝 Örnek `.env` Dosyası

```env
# PayTR Bilgileri (ÖRNEK - Kendi bilgilerinizi yazın)
MERCHANT_ID=123456
MERCHANT_KEY=abc123def456ghi789jkl012mno345pqr678
MERCHANT_SALT=xyz789uvw456rst123abc456def789ghi012

# Test Modu (1 = Test, 0 = Production)
TEST_MODE=1

# Callback URL'leri (Kendi domain'inizi yazın)
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail
```

---

## ✅ Kontrol Listesi

PayTR yapılandırması için kontrol listesi:

- [ ] PayTR merchant bilgileri alındı
- [ ] Backend `.env` dosyasında `MERCHANT_ID` ayarlandı
- [ ] Backend `.env` dosyasında `MERCHANT_KEY` ayarlandı
- [ ] Backend `.env` dosyasında `MERCHANT_SALT` ayarlandı
- [ ] `MERCHANT_OK_URL` production domain'i ile güncellendi
- [ ] `MERCHANT_FAIL_URL` production domain'i ile güncellendi
- [ ] PayTR panel'de callback URL ayarlandı
- [ ] Test modunda test edildi (`TEST_MODE=1`)
- [ ] Backend yeniden başlatıldı
- [ ] Test ödemesi başarılı oldu

---

## 📚 Daha Fazla Bilgi

- [Detaylı PayTR Kurulum Rehberi](./Docs/payment/PAYTR_SETUP.md)
- [Hızlı Kurulum](./Docs/payment/PAYTR_QUICK_SETUP.md)

---

**Sorularınız için:** Backend loglarını kontrol edin veya PayTR destek ile iletişime geçin.

