# ⚡ PayTR Hızlı Kurulum

PayTR bilgilerinizi 5 dakikada yapılandırın.

## 🎯 Adımlar

### 1. PayTR Bilgilerinizi Hazırlayın

PayTR panelinizden şu bilgileri alın:
- Merchant ID
- Merchant Key  
- Merchant Salt

### 2. Backend `.env` Dosyasını Güncelleyin

```bash
cd backend
nano .env  # veya editörünüzle açın
```

Şu satırları ekleyin/güncelleyin:

```env
# PayTR Bilgileri
MERCHANT_ID=your_merchant_id_buraya
MERCHANT_KEY=your_merchant_key_buraya
MERCHANT_SALT=your_merchant_salt_buraya

# Production için test modunu kapatın
TEST_MODE=0

# Callback URL'leri (Domain'inizi yazın)
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail
```

### 3. PayTR Panel'de Callback URL Ayarlayın

PayTR Panel → Ayarlar → Callback URL:
```
https://api.tulumbak.com/api/paytr/callback
```

### 4. Backend'i Yeniden Başlatın

```bash
# PM2 kullanıyorsanız
pm2 restart tulumbak-backend

# Veya normal başlatma
npm start
```

### 5. Test Edin

1. Frontend'de bir ürün sepete ekleyin
2. Checkout sayfasına gidin
3. "Kredi/Banka Kartı" ödeme yöntemini seçin
4. Test kartı ile ödeme yapın (TEST_MODE=1 ise)
5. Başarılı ödeme sonrası siparişler sayfasına yönlendirilmelisiniz

## ⚠️ Önemli Notlar

1. **Production'da `TEST_MODE=0` olmalı**
2. **Callback URL'leri HTTPS olmalı**
3. **Domain'ler tam olarak eşleşmeli**

## 🔍 Hızlı Kontrol

```bash
# Backend loglarını kontrol edin
tail -f backend/logs/error.log

# PayTR token isteği test edin (Postman/curl)
curl -X POST https://api.tulumbak.com/api/paytr/get-token \
  -H "Content-Type: application/json" \
  -H "token: your_jwt_token" \
  -d '{"email":"test@test.com","payment_amount":10000,...}'
```

## 📚 Detaylı Bilgi

Daha fazla bilgi için: [PAYTR_SETUP.md](./PAYTR_SETUP.md)

