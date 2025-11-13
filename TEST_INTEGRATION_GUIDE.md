# MuditaKurye Entegrasyon Test Rehberi

## 🚀 Hızlı Başlangıç

### 1. ngrok Kurulumu (Webhook için localhost tunnel)

#### Windows için:
```bash
# Chocolatey ile (önerilen)
choco install ngrok

# veya manuel kurulum:
# 1. https://ngrok.com/download adresinden indirin
# 2. ZIP'i açın ve ngrok.exe'yi PATH'e ekleyin
# 3. ngrok hesabı oluşturun: https://dashboard.ngrok.com/signup
# 4. Auth token'ı ayarlayın:
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 2. Backend Başlatma

```bash
cd backend
npm install
npm run dev
```

**Beklenen Çıktı:**
```
Server running on port 4001
MongoDB Connected
✅ CourierIntegrationService initialized
```

### 3. ngrok ile Webhook Tunnel Açma

**Yeni terminal açın:**
```bash
ngrok http 4001
```

**Çıktı örneği:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:4001
```

⚠️ **ÖNEMLİ:** `https://abc123.ngrok.io` URL'sini not alın!

### 4. Frontend Başlatma

**Yeni terminal açın:**
```bash
cd admin
npm install
npm run dev
```

**Tarayıcıda:**
```
http://localhost:5173/courier-test
```

---

## 📝 Test Adımları

### Adım 1: Konfigürasyon Kaydet

1. **Admin Panele Giriş Yap:**
   - URL: `http://localhost:5173`
   - Email: `admin@tulumbak.com`
   - Password: `admin123`

2. **Kurye Test Paneline Git:**
   - Sidebar → "MuditaKurye Entegrasyon"
   - veya doğrudan: `http://localhost:5173/courier-test`

3. **Konfigürasyon Sekmesi:**
   ```
   API URL: https://api.muditakurye.com.tr
   API Key: yk_24c584705e97492483bcb4264338aa14
   Restaurant ID: rest_85b4ad47f35b45e893c9
   Webhook Secret: wh_0rC-rimL096iJALsxXui67-n0LrKWVNlpHknLHn12g4

   ✅ Aktif: AÇIK
   ✅ Test Modu: AÇIK
   ❌ Sadece Webhook Modu: KAPALI
   ```

4. **Kaydet Butonuna Tıkla**
   - Beklenen: ✅ "Konfigürasyon kaydedildi!"

### Adım 2: Validation

1. **"Doğrula" Butonuna Tıkla**
   - Beklenen: ✅ "Konfigürasyon geçerli!"
   - Warnings görebilirsiniz (normal):
     - "Running in TEST MODE"

### Adım 3: Health Check

1. **"Sağlık Kontrolü" Butonuna Tıkla**
   - Beklenen: ✅ "Entegrasyon sağlıklı!"
   - Checks:
     - ✅ Configuration: pass
     - ✅ Circuit Breaker: CLOSED
     - ✅ API Connection: pass (test mode'da skip edilebilir)

### Adım 4: Test Siparişi Gönder

1. **Test İşlemleri Sekmesine Git**

2. **"Test Siparişi Gönder" Butonuna Tıkla**
   - Beklenen: ✅ "Test siparişi gönderildi!"
   - Sonuç JSON'unda:
     ```json
     {
       "success": true,
       "data": {
         "testOrderId": "test_...",
         "externalOrderId": "550e8400-...",
         "note": "This is a TEST order..."
       }
     }
     ```

### Adım 5: Webhook Simülasyonu

1. **Webhook Simülasyonu Bölümünde:**
   - "Doğrulandı" butonuna tıkla → ✅ VALIDATED
   - "Kuryeye Atandı" → ✅ ASSIGNED
   - "Yolda" → ✅ ON_DELIVERY
   - "Teslim Edildi" → ✅ DELIVERED

2. **Loglar Sekmesinde:**
   - Her webhook simülasyonunu görebilirsiniz
   - Detayları açarak payload'ı inceleyebilirsiniz

---

## 🎯 Gerçek Sipariş ile Test (Advanced)

### Önkoşul: MuditaKurye Webhook URL'i Kaydetme

1. **MuditaKurye Admin Paneline Giriş:**
   - https://panel.muditakurye.com.tr (veya staging URL)

2. **Webhook URL'i Kaydet:**
   - Ayarlar → Entegrasyon → Webhook URL
   - Status Webhook: `https://abc123.ngrok.io/api/webhook/courier/muditakurye/status`
   - Cancel Webhook: `https://abc123.ngrok.io/api/webhook/courier/muditakurye/cancel`

   ⚠️ **ÖNEMLİ:** `abc123.ngrok.io` yerine kendi ngrok URL'inizi yazın!

3. **Webhook Secret:**
   - MuditaKurye panelinden webhook secret'ı alın
   - Tulumbak admin panelinde güncelleyin

### Gerçek Sipariş Testi:

1. **Tulumbak Frontend'de Sipariş Oluştur:**
   - http://localhost:5174
   - Sepete ürün ekle
   - Sipariş ver

2. **Admin Panelde Siparişi Bul:**
   - Siparişler → Sipariş Detayı
   - "Kuryeye Ata" butonuna tıkla
   - Platform seç: "MuditaKurye"

3. **Beklenen Akış:**
   - ✅ Sipariş MuditaKurye API'sine gönderilir
   - ✅ External Order ID alınır
   - ✅ MuditaKurye webhook'lar göndermeye başlar
   - ✅ Sipariş durumu otomatik güncellenir

4. **Takip:**
   - Dashboard sekmesinde güncel durumu görebilirsiniz
   - Loglar sekmesinde tüm webhook eventlerini izleyebilirsiniz

---

## 🐛 Sorun Giderme

### Problem: "Failed to update configuration"

**Çözüm:**
```bash
# Backend console'da hata loglarını kontrol edin
# Genellikle MongoDB bağlantı problemi
```

### Problem: "Dashboard yüklenemedi - 404"

**Çözüm:**
```bash
# Backend route'ları kontrol edin
curl http://localhost:4001/api/admin/courier-integration/dashboard
```

### Problem: "API Connection failed"

**Çözüm:**
1. API Key'in doğru olduğundan emin olun
2. Test mode açık olmalı
3. İnternet bağlantısını kontrol edin

### Problem: Webhook gelmedi

**Çözüm:**
1. ngrok tunnel'ın açık olduğundan emin olun
2. MuditaKurye panelinde webhook URL'i kontrol edin
3. ngrok web interface'de webhook isteklerini görebilirsiniz:
   - http://localhost:4040 (ngrok dashboard)

---

## 📊 Test Checklist

### Temel Testler:
- [ ] Backend başarıyla başlatıldı
- [ ] Frontend başarıyla başlatıldı
- [ ] ngrok tunnel açıldı
- [ ] Admin panele giriş yapıldı
- [ ] Konfigürasyon kaydedildi
- [ ] Validation başarılı
- [ ] Health check başarılı
- [ ] Test siparişi gönderildi
- [ ] Webhook simülasyonu çalıştı

### Advanced Testler:
- [ ] MuditaKurye webhook URL kaydedildi
- [ ] Gerçek sipariş oluşturuldu
- [ ] Sipariş kurye API'sine gönderildi
- [ ] Webhook'lar alındı ve işlendi
- [ ] Sipariş durumu otomatik güncellendi
- [ ] Dashboard'da metrics güncellendi

---

## 🔗 Yararlı Linkler

- **ngrok Dashboard:** http://localhost:4040
- **Backend Health:** http://localhost:4001/health
- **Admin Panel:** http://localhost:5173
- **Courier Test Panel:** http://localhost:5173/courier-test
- **MuditaKurye Docs:** https://integration.muditakurye.com.tr/

---

## 💡 Pro Tips

1. **ngrok URL'i değişiyor mu?**
   - Ücretsiz ngrok her yeniden başlatmada yeni URL verir
   - Paid plan ile sabit subdomain alabilirsiniz
   - Test sırasında ngrok'u kapatmayın!

2. **Test Mode:**
   - Test mode AÇIK olduğunda gerçek kurye çağrılmaz
   - Sadece API test edilir
   - Production'a geçmeden önce KAPATIN

3. **Log Monitoring:**
   - Backend terminal: API isteklerini görürsünüz
   - ngrok dashboard (http://localhost:4040): Webhook trafiğini görürsünüz
   - Frontend console: UI eventlerini görürsünüz

4. **Quick Reset:**
   ```bash
   # Backend logs'u temizlemek için:
   Ctrl+C → npm run dev

   # Frontend'i yenilemek için:
   Tarayıcıda F5
   ```

---

## ✅ Başarı Kriterleri

Entegrasyon başarılı sayılır:
1. ✅ Test siparişi gönderilebildi
2. ✅ External Order ID alındı
3. ✅ Webhook simülasyonu çalıştı
4. ✅ Dashboard metrics güncellendi
5. ✅ Health check PASS gösteriyor
6. ✅ Hiç error logu yok

**Tebrikler! 🎉 MuditaKurye entegrasyonunuz çalışıyor!**
