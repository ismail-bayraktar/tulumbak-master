# 🧁 Tulumbak İzmir Baklava - E-Ticaret Platformu

Modern teknolojilerle geliştirilmiş, İzmir ve çevresinde baklava ve tatlı ürünleri satışı yapan e-ticaret platformu.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler

**Ürün Yönetimi**
- Ürün ekleme/düzenleme/silme
- Gramaj seçenekleri (250g, 500g, 1kg, 2kg)
- Taze/Kuru seçimi
- Özel ambalaj seçenekleri
- Hediye paketi
- Etiket sistemi (Hemen Yenir, vb.)
- Çoklu görsel yükleme (Cloudinary entegrasyonu)
- Stok yönetimi

**Email Yönetimi** ✨ YENİ
- SMTP yapılandırması (Gmail, Outlook, özel sunucular)
- React Email ile modern email template'leri
- SWC transpiler ile JSX → JS dönüşümü
- Email log sistemi (trigger tracking)
- Logo yönetimi (URL + Dosya yükleme)
- Test email gönderimi
- Modern card-based email tasarımları

**Teslimat Sistemi**
- Bölge bazlı teslimat ücretleri
- Zaman aralığı seçimi
- Aynı gün teslimat
- Minimum sipariş tutarı
- Hafta sonu teslimatı
- MuditaKurye entegrasyonu
- Circuit breaker pattern
- Dead Letter Queue (DLQ)
- Webhook sistemi

**Ödeme Sistemi**
- Havale/EFT
- Kapıda ödeme
- Online ödeme (PayTR)
- Otomatik ücret hesaplama

**Kupon Sistemi**
- Kupon oluşturma
- Kupon doğrulama
- İndirim hesaplama
- Kullanım limiti

**Kurumsal Siparişler**
- Kurumsal sipariş formu
- Durum yönetimi
- Not ekleme

**Modern Admin Panel** ✨ YENİ
- Shadcn UI + Radix UI design system
- Tailwind CSS styling
- Responsive tasarım
- Dark mode desteği
- Ürün yönetimi
- Sipariş yönetimi
- Email yönetimi
- Teslimat bölgeleri
- Zaman aralıkları
- Kupon yönetimi
- Kurye durumları

## 🏗️ Teknoloji Stack

### Backend
- **Runtime:** Node.js 18+ + Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer + React Email
- **Transpiler:** SWC (JSX → JS)
- **Payment:** PayTR Gateway
- **Courier:** MuditaKurye Integration
- **Resilience:** Circuit Breaker, Retry Service

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **State:** Context API

### Admin Panel ✨ MODERNIZED
- **Framework:** React 18 + Vite
- **UI Library:** Shadcn UI
- **Primitives:** Radix UI
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **Validation:** Zod
- **Date Handling:** date-fns

### Database
- **MongoDB:** 7.0+ (Docker)
- **ODM:** Mongoose
- **Indexing:** Optimized for performance

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (Docker ile)
- Git

### Adımlar

1. **Proje dizinine gidin:**
```bash
cd tulumbak-master
```

2. **Docker ile MongoDB'yi başlatın:**
```bash
docker compose up -d
```

3. **Backend'i başlatın:**
```bash
cd backend
npm install
npm start
```

4. **Frontend'i başlatın:**
```bash
cd frontend
npm install
npm run dev
```

5. **Admin Panel'i başlatın:**
```bash
cd admin
npm install
npm run dev
```

## 🌐 Erişim

- **Frontend:** http://localhost:5174
- **Admin Panel:** http://localhost:5173
- **Backend API:** http://localhost:4001
- **Mongo Express:** http://localhost:8081

## 📚 Dokümantasyon

Detaylı dokümantasyon için `Docs/` klasörüne bakın:

### 🚀 Başlangıç
- **[Ana Dokümantasyon](Docs/README.md)** - Proje genel bakış ve navigasyon
- **[Hızlı Başlangıç](Docs/Development/Getting-Started.md)** - Development environment kurulumu
- **[Git Workflow](Docs/Development/Git-Workflow.md)** - Branching ve commit stratejisi

### 💻 Backend
- **[API Referansı](Docs/Backend/API-Reference.md)** - Tüm API endpoint'leri
- **[Servisler](Docs/Backend/Services.md)** - EmailService, CourierService, CircuitBreaker
- **[Database Schema](Docs/Backend/Database-Schema.md)** - MongoDB collections
- **[Authentication](Docs/Backend/Authentication.md)** - JWT auth ve middleware
- **[Email Sistemi](Docs/Backend/Email-System.md)** - React Email + SMTP

### 🎨 Admin Panel
- **[Kurulum Rehberi](Docs/Admin-Panel/Setup.md)** - Shadcn UI + Radix UI setup

### 🔌 Entegrasyonlar
- **[MuditaKurye](Docs/Integrations/MuditaKurye-Implementation.md)** - Kurye entegrasyonu
- **[MuditaKurye API Docs](Docs/MuditaKurye%20Entegrasyon%20Dokümantasyonu/)** - External API documentation

### 🛠️ Geliştirme
- **[Kod Standartları](Docs/Development/Coding-Standards.md)** - Best practices
- **[Deployment](Docs/Development/Deployment.md)** - Production deployment

## 📁 Proje Yapısı

```
tulumbak-master/
├── backend/              # Node.js API
│   ├── controllers/      # İş mantığı
│   ├── models/          # MongoDB modelleri
│   ├── routes/          # API route'ları
│   ├── services/        # Business services
│   ├── middleware/      # Auth, validation, rate limiting
│   ├── emails/          # React Email templates
│   ├── config/          # Configuration
│   └── schemas/         # Validation schemas
│
├── frontend/            # React Müşteri Arayüzü
│   └── src/
│       ├── components/
│       ├── pages/
│       └── context/
│
├── admin/               # Modern React Admin Panel
│   └── src/
│       ├── components/
│       │   └── ui/     # Shadcn UI components
│       ├── pages/
│       │   ├── dashboard/
│       │   ├── email/   # Email management
│       │   ├── orders/
│       │   └── products/
│       ├── hooks/
│       └── lib/
│
└── Docs/                # Comprehensive Documentation
    ├── Backend/
    ├── Admin-Panel/
    ├── Integrations/
    └── Development/
```

## 🔑 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin

# Authentication
JWT_SECRET=your_secret_key

# Server
PORT=4001

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# MuditaKurye Integration
MUDITA_API_KEY=your-api-key
MUDITA_API_SECRET=your-api-secret
MUDITA_WEBHOOK_SECRET=your-webhook-secret

# PayTR
PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:4001
```

### Admin (.env)
```env
VITE_BACKEND_URL=http://localhost:4001
```

## 🧪 Test

```bash
# Backend testleri
cd backend && npm test

# Frontend testleri (gelecek)
cd frontend && npm test

# Admin testleri (gelecek)
cd admin && npm test
```

## 🚀 Production Deployment

Proje production ortamına deploy edilmeye hazırdır. Detaylı rehber için:

**[Deployment Guide](Docs/Development/Deployment.md)** - Kapsamlı deployment rehberi

### Desteklenen Platformlar
- **Vercel** (Frontend + Admin)
- **Railway/Render** (Backend API)
- **MongoDB Atlas** (Database)
- **Cloudinary** (Media Storage)
- **VPS** (Full Stack)
- **Docker** (Containerized)

### Hızlı Deployment

```bash
# Backend (Railway/Render)
cd backend
git push railway main

# Frontend (Vercel)
cd frontend
vercel --prod

# Admin (Vercel)
cd admin
vercel --prod
```

## 📝 Önemli Notlar

### Database
- MongoDB verileri `tulumbak-mongo_data` volume'ünde saklanır
- Docker konteynerleri yeniden başlatıldığında veriler korunur
- Otomatik index'leme aktif

### API
- Tüm endpoint'ler RESTful standartlara uygun
- JWT token bazlı authentication
- Rate limiting aktif (100 req/15min)
- CORS yapılandırılmış

### Admin Panel
- Modern Shadcn UI design system
- 40+ yeniden kullanılabilir component
- Responsive ve accessible
- Dark mode desteği

### Email System
- React Email ile modern template'ler
- SWC transpiler ile performanslı dönüşüm
- Automatic retry mechanism
- Comprehensive logging

### Courier Integration
- Circuit breaker pattern
- Dead Letter Queue (DLQ)
- Webhook system
- Automatic retry with exponential backoff

## 👥 İç Ekip Geliştirme Standartları

Bu proje **Tulumbak İzmir Baklava** için geliştirilmiş kurumsal bir ticari projedir.

### Git Workflow
1. Feature branch oluşturun (`git checkout -b feature/feature-name`)
2. Conventional commits kullanın
3. Pull request açın ve code review bekleyin
4. Approval sonrası main branch'e merge edin

### Commit Conventions
```
feat: Yeni özellik
fix: Bug düzeltmesi
docs: Dokümantasyon
style: Code formatting
refactor: Code refactoring
test: Test ekleme/düzeltme
chore: Build/config değişiklikleri
```

**Detaylı geliştirme standartları:** [Coding Standards](Docs/Development/Coding-Standards.md)

## 📞 İletişim

**Teknik Destek & Geliştirme:**
- Email: ismail.bayraktar.dev@gmail.com

**Proje Sahibi:**
- Tulumbak İzmir Baklava

## 📄 Lisans

**Proprietary & Confidential**

Bu proje Tulumbak İzmir Baklava'ya aittir. Tüm hakları saklıdır.
Bu yazılımın herhangi bir kısmının izinsiz kopyalanması, dağıtılması veya kullanılması kesinlikle yasaktır.

© 2024-2025 Tulumbak İzmir Baklava. All Rights Reserved.

## 🛠️ Kullanılan Teknolojiler

Bu proje aşağıdaki açık kaynaklı teknolojileri kullanmaktadır:

- **UI/UX:** Shadcn UI, Radix UI
- **Framework:** React, Vite
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **Email:** React Email, Nodemailer
- **Compiler:** SWC
- **Icons:** Lucide React
- **Node.js:** Express.js
- **Authentication:** JWT

---

**Son Güncelleme:** 2025-11-13
**Versiyon:** 2.0.0 - Modern Architecture
**Durum:** ✅ Production Ready
