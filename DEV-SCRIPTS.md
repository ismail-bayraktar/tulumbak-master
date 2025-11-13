# 🛠️ Development Scripts Kullanım Kılavuzu

Port ve lock file sorunlarını otomatik çözen development scriptleri.

## 🚀 Hızlı Başlangıç

### Tüm Projeyi Başlat (Önerilen)
```bash
# Root dizinden - Backend ve Frontend'i birlikte başlatır
node dev.js
```

### Frontend (Next.js)
```bash
cd frontend-new

# Temiz başlatma (portları temizler, lock dosyasını siler)
npm run dev:clean

# Normal başlatma
npm run dev

# Sadece port 3000'i temizle
npm run kill-port
npm run kill-port 3001  # Farklı port için
```

### Backend
```bash
cd backend

# Temiz başlatma (port 4001'i temizler)
npm run start:clean

# Normal başlatma
npm start

# Sadece port 4001'i temizle
npm run kill-port
npm run kill-port 4002  # Farklı port için
```

## 📋 Komutlar

### Frontend Commands
| Komut | Açıklama |
|-------|----------|
| `npm run dev:clean` | Port temizle + lock sil + dev server başlat |
| `npm run dev` | Normal dev server başlatma |
| `npm run kill-port` | Port 3000'i temizle |
| `npm run kill-port 3001` | Belirtilen portu temizle |

### Backend Commands
| Komut | Açıklama |
|-------|----------|
| `npm run start:clean` | Port temizle + backend başlat |
| `npm start` | Normal backend başlatma |
| `npm run kill-port` | Port 4001'i temizle |
| `npm run kill-port 4002` | Belirtilen portu temizle |

### Root Commands
| Komut | Açıklama |
|-------|----------|
| `node dev.js` | Backend + Frontend birlikte başlat |

## 🔧 Sorun Giderme

### Problem: "Port already in use" hatası
**Çözüm**:
```bash
# Frontend için
cd frontend-new && npm run dev:clean

# Backend için
cd backend && npm run start:clean
```

### Problem: "Unable to acquire lock" hatası
**Çözüm**:
```bash
cd frontend-new && npm run dev:clean
```
Bu komut otomatik olarak lock dosyasını siler.

### Problem: Birden fazla Next.js instance çalışıyor
**Çözüm**:
```bash
# Manuel port temizleme
cd frontend-new && npm run kill-port

# Veya direkt temiz başlatma
npm run dev:clean
```

## 💡 İpuçları

1. **Her zaman `dev:clean` kullanın**: Port ve lock sorunlarını otomatik çözer
2. **Root'tan başlatın**: `node dev.js` ile her ikisini birden başlatın
3. **Ctrl+C ile kapatın**: Tüm processler düzgün sonlanır
4. **Port değiştirme**: `npm run kill-port [port-numarası]` ile istediğiniz portu temizleyebilirsiniz

## 📁 Script Dosyaları

### Frontend (`frontend-new/scripts/`)
- `kill-port.js` - Port temizleme
- `clean-start.js` - Port + lock temizleme + dev server

### Backend (`backend/scripts/`)
- `kill-port.js` - Port temizleme
- `clean-start.js` - Port temizleme + backend server

### Root
- `dev.js` - Backend + Frontend birlikte başlatma

## 🎯 Önerilen Workflow

### Günlük Geliştirme
```bash
# 1. Terminal aç
# 2. Root dizine git
cd F:\NEXTJS\tulumbak-master

# 3. Her şeyi başlat
node dev.js

# 4. Geliştirme yap...

# 5. Ctrl+C ile kapat
```

### Frontend Only
```bash
cd frontend-new
npm run dev:clean
```

### Backend Only
```bash
cd backend
npm run start:clean
```

## ✅ Avantajlar

- ✅ Port çakışmalarını otomatik çözer
- ✅ Lock file sorunlarını otomatik temizler
- ✅ Windows ve Linux/Mac uyumlu
- ✅ Tek komutla her şeyi başlatır
- ✅ Temiz sonlanma (Ctrl+C)
- ✅ Kolay kullanım

## 🐛 Hata Durumunda

Script hata verirse:
1. Manuel port temizleme: `npm run kill-port`
2. Lock dosyasını manuel sil: `rm -f .next/dev/lock`
3. Normal başlatma: `npm run dev`

Windows'ta manuel port temizleme:
```cmd
netstat -ano | findstr :3000
taskkill /F /PID [PID_NUMARASI]
```
