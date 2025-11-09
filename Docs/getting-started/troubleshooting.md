# Sorun Çözümü - MongoDB & Backend Port Ayarları

## Tespit Edilen Sorunlar

### 1. ❌ Port Çakışması
- Frontend ve Admin panel `:4000` portuna bağlanmaya çalışıyordu
- Backend `:4001` portunda çalışıyordu
- Bu yüzden `ERR_CONNECTION_REFUSED` hatası alınıyordu

### 2. ✅ Çözüm
- `admin/.env` dosyası güncellendi: `VITE_BACKEND_URL=http://localhost:4001`
- `frontend/.env` dosyası güncellendi: `VITE_BACKEND_URL=http://localhost:4001`
- Backend zaten `:4001` portunda çalışıyor

### 3. ✅ MongoDB Durumu
- ❌ PostgreSQL kullanılmamış (her yerde MongoDB kullanılıyor)
- ✅ MongoDB Docker konteynerleri çalışıyor
- ✅ Backend MongoDB'ye bağlı
- ✅ Test verileri mevcut

## Yeniden Başlatma İşlemleri

### 1. Frontend ve Admin Panellerini Yeniden Başlat
`.env` dosyası değişiklikleri için Vite'nin yeniden başlatılması gerekiyor:

```bash
# Eğer çalışıyorsa, durdurun ve tekrar başlatın:

# Admin Panel
cd admin
npm run dev

# Frontend  
cd frontend
npm run dev
```

### 2. Backend Zaten Çalışıyor
Port `4001`'de backend çalışıyor, yeniden başlatmaya gerek yok.

## Doğrulama

### Backend API Test
```bash
curl http://localhost:4001/api/product/list
```

### MongoDB Bağlantısı
- MongoDB Docker konteyneri: ✅ Çalışıyor
- Mongo Express: http://localhost:8081
- Backend bağlantısı: ✅ Başarılı

## Notlar

- `.env` dosyaları `.gitignore` ile ignore ediliyor (güvenlik için)
- Her geliştiricinin local `.env` dosyası olmalı
- Production'da environment variable'lar kullanılacak

## Test Etmek İçin

1. Admin panelini aç: http://localhost:5173
2. Frontend'i aç: http://localhost:5174
3. Her ikisi de backend'e bağlanmalı (Port 4001)

