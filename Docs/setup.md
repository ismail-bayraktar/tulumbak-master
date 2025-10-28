# Kurulum Rehberi

## Gereksinimler

- Node.js 18+
- MongoDB (Docker ile)
- Git
- Code Editor (VS Code önerilir)

## Adım Adım Kurulum

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/ismail-bayraktar/tulumbak-nextjs-eticaret.git
cd tulumbak-nextjs-eticaret
```

### 2. Docker Kurulumu

```bash
# Docker Desktop yüklü olmalı
# MongoDB konteynerini başlatın
docker compose up -d
```

Konteynerlerin çalıştığını kontrol edin:

```bash
docker ps
```

### 3. Backend Kurulumu

```bash
cd backend
npm install
npm start
```

Backend `http://localhost:4001` üzerinde çalışacaktır.

### 4. Frontend Kurulumu

Yeni bir terminal açın:

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5174` üzerinde çalışacaktır.

### 5. Admin Panel Kurulumu

Yeni bir terminal açın:

```bash
cd admin
npm install
npm run dev
```

Admin Panel `http://localhost:5173` üzerinde çalışacaktır.

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
JWT_SECRET=your_jwt_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
PORT=4001
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:4001
```

### Admin (.env)

```env
VITE_BACKEND_URL=http://localhost:4001
```

## Veritabanı Setup

### İlk Çalıştırma

Backend başladığında otomatik olarak bağlanır. Test verileri eklemek için:

```bash
cd backend
node scripts/addTestData.js
```

## Sorun Giderme

### Port Zaten Kullanılıyor

Eğer port zaten kullanılıyorsa:

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

### Node Modules Sorunları

```bash
# Tüm node_modules'leri silin
rm -rf node_modules package-lock.json

# Yeniden yükleyin
npm install
```

## Development Workflow

1. **Backend değişiklikleri için:**
   - Backend'i restart edin
   - Logları kontrol edin

2. **Frontend değişiklikleri için:**
   - Vite otomatik hot-reload yapar
   - Manuel restart gerekmez

3. **Database değişiklikleri için:**
   - MongoDB connection'ı kontrol edin
   - Yeni migration'ları çalıştırın

## Test Data

Test verileri için:

```bash
# Backend klasöründe
node scripts/addTestData.js
```

## VS Code Extension'ları

Önerilen extension'lar:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- REST Client
- MongoDB for VS Code

## Production Deployment

Production için Vercel veya benzeri bir platform kullanın.

```bash
# Frontend için
cd frontend
npm run build

# Admin için
cd admin
npm run build

# Backend için
cd backend
npm start
```

