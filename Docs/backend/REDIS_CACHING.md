# Redis Caching Sistemi Dokümantasyonu

## 📋 Genel Bakış

Bu doküman, Tulumbak e-ticaret sisteminde Redis cache entegrasyonunu ve kullanımını açıklar.

---

## 🛠️ Teknoloji

**Redis Client:** redis v4.7.0

**Özellikler:**
- API response caching
- Automatic cache invalidation
- Configurable TTL
- Cache statistics
- Production-ready error handling

---

## 📁 Dosya Yapısı

```
backend/
├── config/
│   └── redis.js              # Redis bağlantı ve yardımcı fonksiyonlar
├── middleware/
│   └── cache.js              # Cache middleware'leri
├── routes/
│   └── ProductRoute.js       # Cache kullanılan routes (örnek)
└── .env                      # REDIS_URL environment variable
```

---

## 🔧 Yapılandırma

### Environment Variables

**`.env` dosyasına ekleyin:**

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true
```

### Redis Kurulumu (Docker)

```bash
docker run -d -p 6379:6379 redis:latest
```

Veya Docker Compose:

```yaml
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
```

---

## 💻 Kullanım

### Cache Middleware

**Dosya:** `backend/middleware/cache.js`

```javascript
import { cache } from '../middleware/cache.js';

// Cache for 5 minutes (300 seconds)
router.get('/products', cache(300), getProducts);
```

### Cache Invalidation

```javascript
import { invalidateCache } from '../middleware/cache.js';

// Invalidate all product caches when updating
router.post('/products/add', invalidateCache('products:*'), addProduct);
```

### Manuel Cache İşlemleri

```javascript
import { getFromCache, setInCache, deleteFromCache } from '../config/redis.js';

// Get from cache
const data = await getFromCache('key');

// Set in cache
await setInCache('key', data, 3600); // 1 hour TTL

// Delete from cache
await deleteFromCache('key');
```

---

## 📊 Cache Stratejileri

### 1. Product List Caching

```javascript
// GET /api/product/list
router.get('/list', cache(300), listProducts);
```

**TTL:** 5 dakika (300 saniye)  
**Key:** `products:list`  
**Invalidation:** Ürün eklendi/güncellendi/silindiğinde

### 2. Single Product Caching

```javascript
// POST /api/product/single
router.post('/single', cache(300), singleProduct);
```

**TTL:** 5 dakika  
**Key:** Product ID bazlı

### 3. Cache Invalidation Pattern

```javascript
// Invalidate all products
router.post('/add', invalidateCache('products:*'), addProduct);
router.put('/update', invalidateCache('products:*'), updateProduct);
router.delete('/remove', invalidateCache('products:*'), removeProduct);
```

---

## 🎯 Cache Headers

Cache middleware otomatik olarak response headers ekler:

```javascript
// Cache Hit
'X-Cache': 'HIT'

// Cache Miss
'X-Cache': 'MISS'
```

---

## 🔍 Örnek Kullanım

### Controller'da Cache Kullanımı

```javascript
import { getFromCache, setInCache } from '../config/redis.js';

const getPopularProducts = async (req, res) => {
  const cacheKey = 'popular-products';
  
  // Try cache first
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // Database query
  const products = await productModel.find({ bestseller: true }).limit(10);
  
  const response = { success: true, products };
  
  // Cache for 1 hour
  await setInCache(cacheKey, response, 3600);
  
  res.json(response);
};
```

### Cache Bypass

Cache'i bypass etmek için `noCache=true` query parametresi kullanın:

```javascript
GET /api/product/list?noCache=true
```

---

## 📈 Performance İyileştirmeleri

### Cache Durumu

```javascript
import { getCacheStats } from '../config/redis.js';

const stats = await getCacheStats();
console.log(stats);
```

### Cache Temizleme

```javascript
import { clearCache, deletePattern } from '../config/redis.js';

// Clear all cache
await clearCache();

// Clear specific pattern
await deletePattern('products:*');
```

---

## 🚨 Error Handling

Redis bağlantısı başarısız olursa:

- API otomatik olarak database'e fallback yapar
- Hata loglanır
- Kullanıcı hiçbir şey fark etmez (graceful degradation)

```javascript
// Redis disabled
if (!isConnected) {
  return null; // Skip cache, use database
}
```

---

## 🔒 Güvenlik

### Cache Key Sanitization

**✅ DO:**
```javascript
const cacheKey = `user:${userId}`; // Safe
```

**❌ DON'T:**
```javascript
const cacheKey = req.query.q; // Unsafe - potential injection
```

### Hassas Data

**❌ Cache'lenmemeli:**
- Passwords
- JWT tokens
- Credit card numbers
- Personal data

---

## 📊 Monitoring

### Cache Hit Rate

```javascript
const cacheKey = 'stats:hit-rate';
const stats = await getFromCache(cacheKey);
```

### Cache Size

```javascript
import { getCacheStats } from '../config/redis.js';

const stats = await getCacheStats();
// Returns info about memory usage, keys, etc.
```

---

## 🧪 Testing

### Cache Test

```bash
# İlk istek (MISS)
curl http://localhost:4001/api/product/list

# İkinci istek (HIT)
curl http://localhost:4001/api/product/list
```

### Cache Invalidation Test

```bash
# Product ekle (cache invalidate olur)
curl -X POST http://localhost:4001/api/product/add

# Tekrar istek (fresh data)
curl http://localhost:4001/api/product/list
```

---

## 🚀 Production Best Practices

### 1. TTL Stratejisi

```javascript
// Static data (long TTL)
cache(86400) // 24 hours

// Dynamic data (short TTL)
cache(300) // 5 minutes

// Real-time data (no cache)
cache(0) // Disabled
```

### 2. Memory Management

- Redis memory limit: 512MB (adjust based on needs)
- Eviction policy: `allkeys-lru`
- Monitor memory usage

### 3. Cache Warming

Startup'ta cache'i doldur:

```javascript
// server.js
setTimeout(async () => {
  await warmupCache();
}, 5000);
```

---

## 📞 Destek

Sorular için: backend@tulumbak.dev

---

**Son Güncelleme:** 2025-10-28  
**Versiyon:** 1.0  
**Durum:** Production Ready

