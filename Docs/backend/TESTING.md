# Testing Dokümantasyonu

## 📋 Genel Bakış

Bu doküman, Tulumbak e-ticaret sisteminde test stratejisi ve yapısını açıklar.

---

## 🛠️ Teknoloji

**Test Framework:** Jest v29.7.0

**Özellikler:**
- Unit tests
- Integration tests
- Coverage reports
- Watch mode

---

## 📁 Test Yapısı

```
backend/
├── __tests__/
│   ├── utils/
│   │   └── logger.test.js
│   ├── middleware/
│   │   └── cache.test.js
│   └── controllers/
│       └── OrderController.test.js
├── jest.config.js
└── package.json
```

---

## 🚀 Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Watch mode (değişiklikleri otomatik test eder)
npm run test:watch

# Coverage raporu
npm run test:coverage
```

---

## 📊 Coverage Hedefi

**Minimum Coverage:**
- Statements: %80
- Branches: %75
- Functions: %80
- Lines: %80

---

## 🎯 Test Tipleri

### 1. Unit Tests

Tek fonksiyonları test eder:

```javascript
describe('Logger', () => {
  it('should log error', () => {
    logger.error('test');
    expect(true).toBe(true);
  });
});
```

### 2. Integration Tests

API endpoint'lerini test eder:

```javascript
describe('POST /api/order/place', () => {
  it('should create order', async () => {
    const response = await request(app)
      .post('/api/order/place')
      .send(orderData);
    
    expect(response.status).toBe(200);
  });
});
```

---

## 📝 Yeni Test Ekleme

1. Test dosyası oluştur: `__tests__/controllers/ProductController.test.js`
2. Jest import'ları ekle
3. Test cases yaz
4. `npm test` çalıştır

---

**Son Güncelleme:** 2025-10-28

