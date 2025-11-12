# 📋 Kurye Yönetimi Admin Panel İmplementasyon Planı

## 🎯 Genel Bakış

Bu plan, Tulumbak admin panelinde kurye entegrasyonlarının yönetimi için kapsamlı bir çözüm sunmaktadır. MuditaKurye entegrasyonu başta olmak üzere, tüm kurye sistemlerinin merkezi yönetimi, test edilmesi ve monitörlenmesi hedeflenmektedir.

## 🏗️ Sistem Mimarisi

### Mevcut Durum - Doğru Akış
```
┌──────────────┐                   ┌──────────────┐
│              │  1. Sipariş API   │              │
│   Tulumbak   │ ────────────────► │ MuditaKurye  │
│    Backend   │                   │    Panel     │
│              │  2. Webhook       │              │
│              │ ────────────────► │              │
└──────────────┘  (Durum bildirimi)└──────────────┘

Akış Açıklaması:
1. Tulumbak yeni sipariş oluşturunca → MuditaKurye API'ye gönderir
2. Tulumbak sipariş durumu değişince → MuditaKurye'ye webhook gönderir
3. MuditaKurye'de kurye ataması/durum değişikliği olunca → Tulumbak'a webhook gelir
```

### Hedef Mimari
```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│    Admin    │ ───► │   Backend    │ ◄──► │ MuditaKurye  │
│    Panel    │      │   Services   │      │     API      │
└─────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       ▼                     ▼                      ▼
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Test UI   │      │   Database   │      │   Webhook    │
│  Components │      │   (MongoDB)  │      │   Receiver   │
└─────────────┘      └──────────────┘      └──────────────┘
```

## 📊 Admin Panel Kurye Yönetimi Sayfası Tasarımı

### 1. Ana Dashboard (`/admin/courier-management`)

```jsx
// Sayfa Bileşenleri
├── KuryeListesi
│   ├── Aktif Kuryeler
│   ├── Devre Dışı Kuryeler
│   └── Test Modu Kuryeler
│
├── KuryeDetay
│   ├── Konfigürasyon
│   ├── API Bilgileri
│   ├── Webhook Ayarları
│   └── İstatistikler
│
└── TestPanel
    ├── Bağlantı Testi
    ├── Sipariş Testi
    ├── Durum Güncellemeleri
    └── Test Logları
```

### 2. UI Mockup

```
┌─────────────────────────────────────────────────────┐
│  🚚 Kurye Entegrasyon Yönetimi                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ MuditaKurye  │  │    Aras      │  │  Yurtiçi  │ │
│  │   ✅ Aktif   │  │  🔄 Hazır    │  │ ⏸️ Pasif  │ │
│  │              │  │              │  │           │ │
│  │ [Yönet] [▶]  │  │ [Yönet] [▶]  │  │ [Yönet]  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ MuditaKurye Detayları                        │   │
│  ├──────────────────────────────────────────────┤   │
│  │ Status: ✅ Aktif | Mode: 🧪 Test             │   │
│  │                                              │   │
│  │ API Bilgileri:                               │   │
│  │ ├─ URL: https://api.muditakurye.com.tr      │   │
│  │ ├─ API Key: **********************ey12      │   │
│  │ ├─ Restaurant ID: REST_001                   │   │
│  │ └─ Webhook Secret: **********************g4  │   │
│  │                                              │   │
│  │ Test İşlemleri:                              │   │
│  │ ┌────────────┐ ┌────────────┐ ┌───────────┐ │   │
│  │ │ 🔌 Bağlantı│ │ 📦 Sipariş │ │ 🔄 Durum  │ │   │
│  │ │   Testi    │ │   Testi    │ │   Testi   │ │   │
│  │ └────────────┘ └────────────┘ └───────────┘ │   │
│  │ ┌────────────┐ ┌────────────┐ ┌───────────┐ │   │
│  │ │ ❌ İptal   │ │ 📊 İstatist│ │ 📝 Loglar │ │   │
│  │ │   Testi    │ │            │ │           │ │   │
│  │ └────────────┘ └────────────┘ └───────────┘ │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 🧪 Test Senaryoları

### Test 1: Bilgi Doğrulama Testi
```javascript
// API Endpoint: POST /api/courier-integration/test/validate-config
{
  "testType": "validateConfig",
  "platform": "muditakurye"
}

// Kontrol Edilecekler:
✓ API anahtarlarının formatı doğru mu?
✓ URL'ler erişilebilir mi?
✓ Webhook secret key geçerli mi?
✓ Zorunlu alanlar dolu mu?
```

### Test 2: Bağlantı Testi
```javascript
// API Endpoint: POST /api/courier-integration/test/connection
{
  "testType": "connection",
  "platform": "muditakurye"
}

// Test Adımları:
1. API endpoint'e ping at
2. Auth token al (eğer destekleniyorsa)
3. Hesap bilgilerini doğrula
4. Response time'ı ölç
5. Circuit breaker durumunu kontrol et
```

### Test 3: Sipariş Yaşam Döngüsü Testi
```javascript
// API Endpoint: POST /api/courier-integration/test/order-lifecycle
{
  "testType": "orderLifecycle",
  "platform": "muditakurye",
  "simulateWebhooks": true
}

// Test Akışı:
1. Test siparişi oluştur (TEST_ORDER_001)
2. Siparişi kurye sistemine gönder
3. Webhook simülasyonları:
   - VALIDATED (Sipariş alındı)
   - ASSIGNED (Kuryeye atandı)
   - PREPARED (Hazırlandı)
   - ON_DELIVERY (Yolda)
   - DELIVERED (Teslim edildi)
4. Her adımda veritabanı kontrolü
5. Status history doğrulaması
```

### Test 4: İptal Testi
```javascript
// API Endpoint: POST /api/courier-integration/test/cancel
{
  "testType": "cancel",
  "platform": "muditakurye",
  "orderId": "TEST_ORDER_001"
}

// Test Adımları:
1. Aktif test siparişi oluştur
2. İptal isteği gönder
3. İptal onayı bekle
4. Webhook ile iptal bildirimi al
5. Veritabanında durumu kontrol et
```

## 🚀 İmplementasyon Aşamaları

### Faz 1: Backend API'lerin Hazırlanması (2-3 gün)

#### 1.1 Test Controller Oluşturma
```javascript
// backend/controllers/CourierTestController.js
- validateConfig()    // Konfigürasyon doğrulama
- testConnection()    // Bağlantı testi
- testOrderLifecycle() // Sipariş döngüsü testi
- testCancel()        // İptal testi
- getTestResults()    // Test sonuçlarını getir
```

#### 1.2 Test Service Katmanı
```javascript
// backend/services/CourierTestService.js
- Webhook simülasyon motoru
- Test siparişi yönetimi
- Test log kaydı
- Sonuç raporlama
```

#### 1.3 API Endpoints
```
POST   /api/courier-integration/test/validate-config
POST   /api/courier-integration/test/connection
POST   /api/courier-integration/test/order-lifecycle
POST   /api/courier-integration/test/cancel
GET    /api/courier-integration/test/results/:testId
GET    /api/courier-integration/test/logs/:platform
```

### Faz 2: Admin Panel UI Geliştirme (3-4 gün)

#### 2.1 React Components
```jsx
// admin/src/components/courier/
├── CourierDashboard.jsx       // Ana dashboard
├── CourierCard.jsx            // Kurye kartı
├── CourierDetailPanel.jsx     // Detay paneli
├── CourierTestPanel.jsx       // Test paneli
├── TestResultModal.jsx        // Test sonuç modal
└── CourierConfigForm.jsx      // Konfigürasyon formu
```

#### 2.2 State Management
```javascript
// admin/src/store/courierSlice.js
- Courier listesi state
- Test sonuçları state
- WebSocket bağlantısı (gerçek zamanlı güncellemeler)
```

#### 2.3 API Integration
```javascript
// admin/src/services/courierService.js
- fetchCouriers()
- updateCourierConfig()
- runTest()
- fetchTestResults()
- streamTestLogs() // WebSocket
```

### Faz 3: Test Ortamı Kurulumu (1-2 gün)

#### 3.1 Local Test Ortamı
```yaml
# docker-compose.test.yml
services:
  mock-mudita:
    image: mockserver/mockserver
    ports:
      - "8080:1080"
    environment:
      - MOCKSERVER_INITIALIZATION_JSON_PATH=/config/mudita-mocks.json
```

#### 3.2 Mock Webhook Generator
```javascript
// backend/scripts/mockWebhookGenerator.js
- Otomatik webhook gönderimi
- Farklı senaryoları simüle etme
- Hata durumlarını test etme
```

### Faz 4: Production Hazırlıkları (2-3 gün)

#### 4.1 Güvenlik Önlemleri
- Test siparişlerinin production'a gitmemesini sağlama
- Test modunda özel prefix kullanma (TEST_*)
- Rate limiting ve güvenlik kontrolleri

#### 4.2 Monitoring & Logging
- Detaylı test logları
- Hata yakalama ve raporlama
- Performance metrikleri

#### 4.3 Documentation
- API dokümantasyonu
- Kullanım kılavuzu
- Troubleshooting guide

## 🛠️ Teknik Gereksinimler

### Backend Gereksinimleri
- Node.js 18+
- MongoDB 5.0+
- Redis (opsiyonel, cache için)
- WebSocket desteği

### Frontend Gereksinimleri
- React 18+
- Redux Toolkit
- Material-UI veya Ant Design
- Recharts (istatistikler için)

### Test Gereksinimleri
- Jest & React Testing Library
- Supertest (API testleri)
- MockServer veya WireMock

## 📅 Zaman Planı

| Hafta | Görev | Detay |
|-------|-------|-------|
| **Hafta 1** | Backend API'ler | Test controller, service, endpoints |
| **Hafta 2** | Admin Panel UI | React components, state management |
| **Hafta 2-3** | Test Ortamı | Mock server, webhook generator |
| **Hafta 3** | Entegrasyon | Frontend-backend entegrasyonu |
| **Hafta 4** | Test & Debug | Kapsamlı test, bug fix, dokümantasyon |

## 🔍 Local Test Senaryoları

### Senaryo 1: Başarılı Sipariş Akışı
```bash
# 1. Backend'i test modunda başlat
cd backend
NODE_ENV=test npm run dev

# 2. Mock MuditaKurye sunucusunu başlat
docker-compose -f docker-compose.test.yml up mock-mudita

# 3. Admin paneli başlat
cd admin
npm run dev

# 4. Test senaryosunu çalıştır
curl -X POST http://localhost:4001/api/courier-integration/test/order-lifecycle \
  -H "Content-Type: application/json" \
  -d '{"platform": "muditakurye", "simulateWebhooks": true}'
```

### Senaryo 2: Bağlantı Hatası Simülasyonu
```javascript
// Mock server'da timeout simülasyonu
mockServer.when(
  request().withPath("/api/v1/auth")
).respond(
  response().withDelay(TimeUnit.SECONDS, 31) // 30 saniye timeout
);
```

### Senaryo 3: Webhook İmza Hatası
```javascript
// Yanlış imza ile webhook gönder
const wrongSignature = "invalid_signature_123";
sendWebhook({
  headers: {
    "X-MuditaKurye-Signature": wrongSignature
  }
});
```

## 🚦 Başarı Kriterleri

### Fonksiyonel Kriterler
- [ ] Tüm test senaryoları başarıyla çalışmalı
- [ ] Webhook alımı ve işleme %100 başarılı olmalı
- [ ] Sipariş durumları doğru güncellenmel
- [ ] İptal işlemleri çalışmalı

### Performans Kriterleri
- [ ] API response time < 200ms
- [ ] Webhook işleme süresi < 500ms
- [ ] Test completion < 30 saniye
- [ ] UI yükleme süresi < 2 saniye

### Güvenlik Kriterleri
- [ ] Tüm API anahtarları şifreli saklanmalı
- [ ] HMAC imza doğrulaması çalışmalı
- [ ] Rate limiting aktif olmalı
- [ ] Test verileri production'a karışmamalı

## 📝 Notlar

### Öncelikler
1. **Kritik**: Webhook alımı ve imza doğrulaması
2. **Yüksek**: Test panel UI ve temel testler
3. **Orta**: İstatistik ve raporlama
4. **Düşük**: Gelişmiş özellikler ve otomasyonlar

### Riskler ve Çözümler
| Risk | Olasılık | Etki | Çözüm |
|------|----------|------|-------|
| API anahtarlarının gecikmesi | Yüksek | Orta | Mock server ile development |
| Webhook timeout'ları | Orta | Yüksek | Retry mekanizması, DLQ |
| Test verilerinin karışması | Düşük | Kritik | TEST_ prefix, ayrı DB |

### Gelecek Geliştirmeler
- Otomatik test scheduling
- Multi-tenant kurye yönetimi
- Kurye performans karşılaştırması
- AI-powered anomaly detection
- Real-time tracking integration

## 🎯 Sonuç

Bu plan, Tulumbak admin panelinde kapsamlı bir kurye yönetim sistemi oluşturmak için gereken tüm adımları içermektedir. Local development'tan production deployment'a kadar tüm süreç detaylandırılmıştır.

**Tahmini Tamamlanma Süresi**: 3-4 hafta
**Tahmini Efor**: 120-160 saat

---
*Plan Oluşturma Tarihi: 2025-11-12*
*Versiyon: 1.0.0*