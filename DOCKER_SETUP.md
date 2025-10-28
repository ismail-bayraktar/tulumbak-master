# Docker Kurulum Rehberi

## Durum
✅ MongoDB Docker konteynerleri başarıyla kuruldu ve çalışıyor.

## Mevcut Konteynerler

### MongoDB
- **Port**: 27017
- **Container Name**: tulumbak-mongo
- **Credential**: 
  - Username: `root`
  - Password: `example`

### Mongo Express (Yönetim Arayüzü)
- **Port**: 8081
- **URL**: http://localhost:8081
- **Container Name**: tulumbak-mongo-express

## Backend Konfigürasyonu

### .env Dosyası
Backend klasöründe `.env` dosyası aşağıdaki gibi yapılandırıldı:

```env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
PORT=4001
```

## Komutlar

### Docker Konteynerlerini Başlat
```bash
cd F:\NEXTJS\tulumbak-master
docker compose up -d
```

### Docker Konteynerlerini Durdur
```bash
docker compose down
```

### Docker Konteynerlerini Durdur ve Volume'ları Sil
```bash
docker compose down -v
```

### Konteynerlerin Durumunu Kontrol Et
```bash
docker ps
```

### MongoDB Loglarını Görüntüle
```bash
docker logs tulumbak-mongo
```

### Mongo Express Loglarını Görüntüle
```bash
docker logs tulumbak-mongo-express
```

## Backend Server

Backend sunucusu şu şekilde başlatılabilir:

```bash
cd backend
npm start
```

Veya development modunda:

```bash
cd backend
npm run dev
```

## Mongo Express İçin Giriş Bilgileri

Mongo Express'e http://localhost:8081 adresinden erişebilirsiniz:
- **Authentication**: MongoDB konteynerinden: `root` / `example`

## Notlar

- MongoDB verileri `tulumbak-mongo_data` volume'ünde saklanır
- Konteynerler yeniden başlatıldığında veriler korunur
- Temiz başlangıç için `docker compose down -v` komutunu kullanın

