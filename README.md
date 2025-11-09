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
- Çoklu görsel yükleme
- Stok yönetimi

**Teslimat Sistemi**
- Bölge bazlı teslimat ücretleri
- Zaman aralığı seçimi
- Aynı gün teslimat
- Minimum sipariş tutarı
- Hafta sonu teslimatı
- Kurye entegrasyonu (Mock)

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

**Admin Panel**
- Ürün yönetimi
- Sipariş yönetimi
- Teslimat bölgeleri
- Zaman aralıkları
- Kupon yönetimi
- Kurye durumları

## 🏗️ Teknoloji Stack

### Backend
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File Upload)
- PayTR Payment Gateway

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- React Router
- Context API

### Admin Panel
- React + Vite
- Tailwind CSS
- React Router

### Database
- MongoDB (Docker)

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (Docker ile)
- Git

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/ismail-bayraktar/tulumbak-nextjs-eticaret.git
cd tulumbak-nextjs-eticaret
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

## 📚 Dökümantasyon

Detaylı dökümantasyon için `Docs/` klasörüne bakın:

### 🚀 Başlangıç
- [Dokümantasyon Ana Sayfası](Docs/README.md) - Tüm dokümantasyonun merkezi index'i
- [Hızlı Başlangıç](Docs/getting-started/quick-start.md) - 5 dakikada başlatma
- [Kurulum Rehberi](Docs/getting-started/setup.md) - Detaylı kurulum
- [Docker Kurulumu](Docs/getting-started/docker-setup.md) - Docker ile MongoDB

### 💻 Geliştirme
- [Backend Dokümantasyonu](Docs/backend/README.md) - Backend geliştirme rehberi
- [Frontend Dokümantasyonu](Docs/frontend/README.md) - Frontend geliştirme rehberi
- [Admin Panel Dokümantasyonu](Docs/admin/README.md) - Admin panel geliştirme rehberi

### 🔌 API
- [API Referansı](Docs/api/api-reference.md) - Tüm API endpoint'leri
- [Webhook API](Docs/api/webhook-api.md) - Webhook entegrasyonu

### ✨ Özellikler
- [WhatsApp Desteği](Docs/features/whatsapp-support.md) - WhatsApp entegrasyonu
- [Kurye Takip Sistemi](Docs/features/courier-tracking.md) - Kurye entegrasyonu
- [Teslimat Yönetimi](Docs/features/delivery-management.md) - Teslimat sistemi

## 📁 Proje Yapısı

```
tulumbak-master/
├── backend/          # Node.js API
│   ├── controllers/ # İş mantığı
│   ├── models/      # Veritabanı modelleri
│   ├── routes/      # API route'ları
│   └── middleware/  # Middleware'ler
│
├── frontend/         # React Müşteri Arayüzü
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│
├── admin/            # React Admin Panel
│   └── src/
│       ├── components/
│       └── pages/
│
└── Docs/             # Dökümantasyon
    ├── backend/
    ├── frontend/
    └── admin/
```

## 🔑 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
JWT_SECRET=your_secret_key
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

## 🧪 Test

```bash
# Backend testleri (gelecek)
cd backend && npm test

# Frontend testleri (gelecek)
cd frontend && npm test
```

## 📝 Notlar

- MongoDB verileri `tulumbak-mongo_data` volume'ünde saklanır
- Docker konteynerleri yeniden başlatıldığında veriler korunur
- Tüm API endpoint'leri RESTful standartlara uygundur
- Admin panel JWT token bazlı authentication kullanır

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje ile ilgili sorularınız için:
- Email: ismail.bayraktar.dev@gmail.com

## 📄 Lisans

Bu proje özel bir projedir.

## 🙏 Teşekkürler

- MongoDB Community
- React Team
- Vite Team
- Tailwind CSS Team
