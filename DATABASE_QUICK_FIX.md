# 🔧 MongoDB Bağlantı Sorunu - Hızlı Çözüm

## ✅ Durum Kontrolü

Docker container'larınız çalışıyor:
- ✅ `tulumbak-mongo` - Çalışıyor (healthy)
- ✅ `tulumbak-mongo-express` - Çalışıyor

## 🔍 Sorun Tespiti

Backend'iniz MongoDB'ye bağlanamıyorsa, muhtemelen `.env` dosyası eksik veya yanlış yapılandırılmış.

## ⚡ Hızlı Çözüm

### 1. Backend `.env` Dosyasını Kontrol Edin

```bash
cd backend
# .env dosyası var mı kontrol edin
ls -la .env
```

### 2. `.env` Dosyasını Oluşturun/Güncelleyin

```bash
# Eğer yoksa:
cp env.example .env

# .env dosyasını düzenleyin
nano .env  # veya editörünüzle
```

### 3. Doğru Yapılandırma

**Yöntem 1: Tam Connection String (Önerilen)**

```env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
```

**Yöntem 2: Ayrı Ayrı Değişkenler**

```env
MONGO_USERNAME=root
MONGO_PASSWORD=example
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=ecommerce
MONGO_AUTHSOURCE=admin
```

### 4. Backend'i Yeniden Başlatın

```bash
# Backend'i durdurun (Ctrl+C)
# Sonra tekrar başlatın:
npm start
```

### 5. Bağlantıyı Test Edin

Backend loglarında şunu görmelisiniz:
```
MongoDB connected successfully
```

---

## 🧪 Test Komutları

### MongoDB Container Durumu

```bash
docker ps | grep mongo
# Beklenen: tulumbak-mongo ve tulumbak-mongo-express çalışıyor olmalı
```

### MongoDB Bağlantı Testi

```bash
# Mongo Express ile test
# Tarayıcıda: http://localhost:8081
# Username: root
# Password: example
```

### Backend Log Kontrolü

```bash
# Backend loglarını kontrol edin
tail -f backend/logs/combined.log
# veya
tail -f backend/logs/error.log
```

---

## ⚠️ Yaygın Hatalar

### Hata: "Authentication failed"

**Çözüm:**
```env
# .env dosyasında authSource ekleyin
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
```

### Hata: "Connection refused"

**Çözüm:**
```bash
# Docker container'ı başlatın
docker-compose up -d mongo

# Container'ın hazır olmasını bekleyin (10-15 saniye)
docker logs -f tulumbak-mongo
```

### Hata: "Cannot connect to MongoDB"

**Çözüm:**
1. `.env` dosyasının doğru yerde olduğundan emin olun (`backend/.env`)
2. Environment variables'ın doğru yazıldığından emin olun
3. Backend'i yeniden başlatın

---

## 📋 Kontrol Listesi

- [ ] Docker container çalışıyor (`docker ps`)
- [ ] `.env` dosyası var (`backend/.env`)
- [ ] Connection string doğru (`authSource=admin` dahil)
- [ ] Backend yeniden başlatıldı
- [ ] Loglarda "MongoDB connected" mesajı var

---

## 🆘 Hala Çalışmıyor mu?

1. **Tüm container'ları yeniden başlatın:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

2. **Backend loglarını kontrol edin:**
   ```bash
   tail -f backend/logs/error.log
   ```

3. **MongoDB'yi manuel test edin:**
   ```bash
   docker exec -it tulumbak-mongo mongosh -u root -p example --authenticationDatabase admin
   ```

---

**Daha fazla bilgi:** [MONGODB_TROUBLESHOOTING.md](./Docs/database/MONGODB_TROUBLESHOOTING.md)

