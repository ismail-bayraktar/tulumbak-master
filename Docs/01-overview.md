# Proje Genel Bakış

## 📖 Proje Hakkında

**Tulumbak İzmir Baklava**, İzmir ve çevresinde baklava ve tatlı ürünleri satan modern bir e-ticaret platformudur. Proje, müşterilerin online olarak ürünleri görüntüleyebilmesi, sipariş verebilmesi ve admin panel üzerinden siparişleri yönetebilmesini sağlar.

## 🎯 Projenin Amacı

- Baklava ve tatlı ürünlerini online satmak
- Kurye entegrasyonu ile teslimat yönetmek
- B2B/B2C Müşteri siparişlerini yönetmek
- Kupon ve indirim sistemleri sunmak
- Aynı gün teslimat seçenekleri sunmak

## 🏗️ Mimari

### Teknoloji Stack

**Backend:**
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File Upload)
- PayTR Payment Gateway

**Frontend:**
- React + Vite
- Tailwind CSS
- Axios
- React Router
- Context API

**Admin Panel:**
- React + Vite
- React Router
- Tailwind CSS
- Axios

**Database:**
- MongoDB (Docker)

### Proje Yapısı

```
tulumbak-master/
├── backend/                    # Backend API
│   ├── controllers/          # İş mantığı
│   ├── models/               # Veritabanı modelleri
│   ├── routes/               # API route'ları
│   ├── middleware/           # Middleware'ler
│   ├── config/               # Konfigürasyon
│   └── scripts/              # Utility script'leri
│
├── frontend/                  # Müşteri Arayüzü
│   ├── src/
│   │   ├── components/       # React component'leri
│   │   ├── pages/            # Sayfalar
│   │   ├── context/          # Context API
│   │   └── assets/           # Görseller
│
├── admin/                     # Admin Panel
│   ├── src/
│   │   ├── components/       # React component'leri
│   │   └── pages/            # Admin sayfaları
│
└── Docs/                     # Dökümantasyon
    ├── backend/              # Backend dökümantasyonu
    ├── frontend/             # Frontend dökümantasyonu
    └── admin/                # Admin dökümantasyonu
```

## ✨ Özellikler

### Tamamlanan Özellikler

✅ **Ürün Yönetimi**
- Ürün CRUD işlemleri
- Gramaj seçenekleri
- Taze/Kuru seçimi
- Özel ambalaj seçenekleri
- Hediye paketi
- Etiketler

✅ **Teslimat Sistemi**
- Bölge bazlı teslimat ücretleri
- Zaman aralığı seçimi
- Aynı gün teslimat
- Kurye entegrasyonu (Mock)

✅ **Ödeme Sistemi**
- Havale/EFT
- Kapıda ödeme
- Online ödeme (PayTR)

✅ **Kupon Sistemi**
- Kupon oluşturma
- Kupon doğrulama
- İndirim hesaplama

✅ **Kurumsal Siparişler**
- Kurumsal sipariş formu
- Durum yönetimi
- Not ekleme

✅ **Admin Panel**
- Ürün yönetimi
- Sipariş yönetimi
- Teslimat bölgeleri
- Zaman aralıkları
- Kupon yönetimi
- Kurye durumları

### Geliştirilmesi Gereken Özellikler

📋 **Backend**
- [ ] Email bildirimleri
- [ ] SMS bildirimleri
- [ ] Gerçek kurye API entegrasyonu
- [ ] Canlı kurye takibi
- [ ] Raporlama sistemi

📋 **Frontend**
- [ ] Özel gün paketleri sayfası
- [ ] Blog sayfası
- [ ] Müşteri yorumları
- [ ] Sipariş takip sayfası
- [ ] Favoriler
- [ ] Karşılaştırma özelliği

📋 **Admin Panel**
- [ ] Dashboard istatistikleri
- [ ] Grafikler ve raporlar
- [ ] Email template yönetimi
- [ ] Slider içerik yönetimi
- [ ] Multi-admin sistemi

## 📊 Proje Durumu

**Tamamlanma Oranı:** %85

- Backend: %90 ✅
- Frontend: %85 ✅
- Admin Panel: %80 ✅
- Test: %60 ⚠️
- Dökümantasyon: %70 ⚠️

## 🔄 Sürekli Geliştirme

Proje aktif olarak geliştirilmekte olup, haftalık güncellemeler yapılmaktadır. Yeni özellikler ve bug fix'ler düzenli olarak eklenmektedir.

## 📝 Notlar

- Proje MongoDB Docker konteynerleri ile çalışmaktadır
- Tüm API'ler RESTful standartlara uygundur
- Admin panel JWT token bazlı authentication kullanır
- Frontend responsive tasarıma sahiptir

