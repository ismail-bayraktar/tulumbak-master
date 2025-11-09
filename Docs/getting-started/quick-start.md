# 🚀 Hızlı Başlangıç Rehberi

Tulumbak e-ticaret platformunu hızlıca çalıştırmak için bu rehberi takip edin.

## ⚡ 5 Dakikada Başlatma

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/ismail-bayraktar/tulumbak-master.git
cd tulumbak-master
```

### 2. Docker ile MongoDB'yi Başlatın
```bash
docker compose up -d
```

### 3. Backend'i Başlatın
```bash
cd backend
npm install
npm start
```

Backend `http://localhost:4001` üzerinde çalışacaktır.

### 4. Frontend'i Başlatın (Yeni Terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5174` üzerinde çalışacaktır.

### 5. Admin Panel'i Başlatın (Yeni Terminal)
```bash
cd admin
npm install
npm run dev
```

Admin Panel `http://localhost:5173` üzerinde çalışacaktır.

## 🌐 Erişim URL'leri

- **Frontend:** http://localhost:5174
- **Admin Panel:** http://localhost:5173
- **Backend API:** http://localhost:4001
- **Mongo Express:** http://localhost:8081

## 🔑 İlk Admin Hesabı Oluşturma

```bash
cd backend
node scripts/createAdmin.js
```

Bu komut yeni bir admin hesabı oluşturur ve bilgileri konsola yazdırır.

## ✅ Doğrulama

1. Backend API çalışıyor mu?
   ```bash
   curl http://localhost:4001
   ```
   Cevap: `API Working`

2. MongoDB bağlantısı başarılı mı?
   - Mongo Express'e http://localhost:8081 adresinden erişin
   - `ecommerce` veritabanını görüyor olmalısınız

3. Frontend çalışıyor mu?
   - Tarayıcıda http://localhost:5174 adresini açın
   - Ana sayfa görünüyor olmalı

## 🐛 Sorun Giderme

### Port Zaten Kullanılıyor
```bash
# Windows
netstat -ano | findstr :4001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4001 | xargs kill -9
```

### MongoDB Bağlantı Hatası
```bash
# Docker konteynerlerini kontrol edin
docker ps

# Konteynerleri yeniden başlatın
docker compose down
docker compose up -d
```

### Environment Variables Eksik
Her klasörde (backend, frontend, admin) `.env` dosyası olduğundan emin olun.

Detaylı kurulum için: [Kurulum Rehberi](./setup.md)

---

**Son Güncelleme:** 2025-11-08

