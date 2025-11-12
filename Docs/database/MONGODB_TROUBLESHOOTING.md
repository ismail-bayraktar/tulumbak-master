# 🔧 MongoDB Bağlantı Sorunları - Sorun Giderme Rehberi

## 🐛 Yaygın Sorunlar ve Çözümleri

### Sorun 1: Docker MongoDB'ye Bağlanamıyor

#### Belirtiler
- `MongoServerError: connect ECONNREFUSED`
- `MongoNetworkError: failed to connect`
- Backend başlatıldığında MongoDB bağlantı hatası

#### Çözüm Adımları

**1. Docker Container'ları Kontrol Edin**

```bash
# Container'ların çalışıp çalışmadığını kontrol edin
docker ps -a

# MongoDB container'ı çalışmıyorsa başlatın
docker-compose up -d mongo

# Container loglarını kontrol edin
docker logs tulumbak-mongo
```

**2. MongoDB Bağlantı String'ini Kontrol Edin**

Backend `.env` dosyanızda:

```env
# Yöntem 1: Tam connection string (Önerilen)
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin

# Yöntem 2: Ayrı ayrı değişkenler
MONGO_USERNAME=root
MONGO_PASSWORD=example
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=ecommerce
MONGO_AUTHSOURCE=admin
```

**3. Docker Compose Ayarlarını Kontrol Edin**

`docker-compose.yml` dosyasında:
- Port mapping: `27017:27017` ✅
- Username: `root` ✅
- Password: `example` ✅
- Auth source: `admin` ✅

**4. MongoDB'yi Yeniden Başlatın**

```bash
# Container'ı durdurun
docker-compose down

# Container'ı yeniden başlatın
docker-compose up -d

# MongoDB'nin hazır olmasını bekleyin (10-15 saniye)
docker logs -f tulumbak-mongo
```

**5. Bağlantıyı Test Edin**

```bash
# MongoDB shell ile test
docker exec -it tulumbak-mongo mongosh -u root -p example --authenticationDatabase admin

# Veya Mongo Express ile
# http://localhost:8081
```

---

### Sorun 2: Authentication Hatası

#### Belirtiler
- `Authentication failed`
- `MongoServerError: Authentication failed`

#### Çözüm

**1. Username ve Password Kontrolü**

`.env` dosyasında Docker Compose ile aynı credentials kullanın:

```env
MONGO_USERNAME=root
MONGO_PASSWORD=example
MONGO_AUTHSOURCE=admin
```

**2. Connection String Format**

```env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
```

⚠️ **ÖNEMLİ:** `authSource=admin` parametresi olmalı!

---

### Sorun 3: Port Çakışması

#### Belirtiler
- `EADDRINUSE: address already in use :::27017`
- MongoDB başlamıyor

#### Çözüm

**1. Port Kullanımını Kontrol Edin**

```bash
# Windows
netstat -ano | findstr :27017

# Linux/Mac
lsof -i :27017
```

**2. Port'u Değiştirin**

`docker-compose.yml` dosyasında:

```yaml
ports:
  - "27018:27017"  # Dış port'u değiştirin
```

`.env` dosyasında:

```env
MONGO_PORT=27018
MONGODB_URI=mongodb://root:example@localhost:27018/ecommerce?authSource=admin
```

---

### Sorun 4: Network Hatası

#### Belirtiler
- `MongoNetworkError: connect ECONNREFUSED`
- Container'lar birbirini göremiyor

#### Çözüm

**1. Docker Network Kontrolü**

```bash
docker network ls
docker network inspect tulumbak-master_default
```

**2. Container'ları Aynı Network'te Başlatın**

```bash
docker-compose up -d
```

---

## ✅ Doğru Yapılandırma

### Development (Local Docker)

**docker-compose.yml:**
```yaml
services:
  mongo:
    image: mongo:6
    container_name: tulumbak-mongo
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
```

**Backend .env:**
```env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
```

VEYA

```env
MONGO_USERNAME=root
MONGO_PASSWORD=example
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=ecommerce
MONGO_AUTHSOURCE=admin
```

### Production (MongoDB Atlas)

**Backend .env:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## 🔍 Debug Komutları

### MongoDB Container Durumu

```bash
# Container durumu
docker ps -a | grep mongo

# Container logları
docker logs tulumbak-mongo

# Container içine gir
docker exec -it tulumbak-mongo bash

# MongoDB shell
docker exec -it tulumbak-mongo mongosh -u root -p example --authenticationDatabase admin
```

### Bağlantı Testi

```bash
# Backend'den test
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://root:example@localhost:27017/ecommerce?authSource=admin').then(() => console.log('Connected!')).catch(e => console.error(e))"
```

### Mongo Express ile Kontrol

1. http://localhost:8081 adresine gidin
2. Username: `root`
3. Password: `example`
4. Bağlantı başarılıysa database'leri görebilmelisiniz

---

## 📋 Kontrol Listesi

MongoDB bağlantı sorunu için:

- [ ] Docker container çalışıyor mu? (`docker ps`)
- [ ] MongoDB port'u açık mı? (`27017`)
- [ ] `.env` dosyasında doğru credentials var mı?
- [ ] `authSource=admin` parametresi var mı?
- [ ] Connection string formatı doğru mu?
- [ ] Backend yeniden başlatıldı mı? (env değişiklikleri için)

---

## 🆘 Hala Çalışmıyor mu?

1. **Tüm container'ları durdurun:**
   ```bash
   docker-compose down
   ```

2. **Volume'ları temizleyin (DİKKAT: Veri kaybı olur!):**
   ```bash
   docker-compose down -v
   ```

3. **Yeniden başlatın:**
   ```bash
   docker-compose up -d
   ```

4. **Logları kontrol edin:**
   ```bash
   docker logs -f tulumbak-mongo
   ```

---

**Son Güncelleme:** 2024

