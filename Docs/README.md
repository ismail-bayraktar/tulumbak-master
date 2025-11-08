# Tulumbak İzmir Baklava - Proje Dökümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](./01-overview.md)
2. [Backend Dökümantasyonu](./backend/README.md)
3. [Frontend Dökümantasyonu](./frontend/README.md)
4. [Admin Panel Dökümantasyonu](./admin/README.md)
5. [API Referansı](./api-reference.md)
6. [Kurulum](./setup.md)
7. [Kullanım](./usage.md)
8. [Geliştirme Rehberi](./development.md)
9. [Deployment](./deployment.md)

## 🎯 Proje Hakkında

**Tulumbak İzmir Baklava**, İzmir ve çevresinde baklava ve tatlı ürünleri satan modern bir e-ticaret platformudur. React + Node.js tabanlı ölçeklenebilir ve kullanıcı dostu bir yapıya sahiptir.

### 🚀 Son Güncellemeler (v2.0.0 - 29.10.2024)

#### Frontend Geliştirmeleri:
- ✅ **Orange Tema Uygulandı**: Tüm site turuncu renk paletine güncellendi
- ✅ **Baklava-İzmir SEO Section**: Modern tanıtım bölümü eklendi
- ✅ **İkon Sistemi**: Lucide React professional ikonlara geçildi
- ✅ **Typography**: Türkçe karakter dostu modern fontlar
- ✅ **Minimalist Design**: Product detail sayfası sadeleştirildi
- ✅ **Slider Sorunları**: CORS ve CSP düzenlemeleri yapıldı

#### Backend Geliştirmeleri:
- ✅ **CORS Düzeltmeleri**: Cross-origin görsel erişimi sağlandı
- ✅ **Schema Index'ler**: Duplicate mongoose index'ler kaldırıldı
- ✅ **Security**: Helmet CSP ayarları güncellendi

## 🏗️ Mimari Yapı

```
tulumbak-master/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite Müşteri Arayüzü
├── admin/            # React + Vite Admin Panel
├── Docs/             # Proje Dökümantasyonu
└── docker-compose.yml
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- MongoDB (Docker ile)
- Git

### Kurulum

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

## 📚 Dökümantasyon Rehberi

- **Backend geliştiriciler için**: [Backend README](./backend/README.md)
- **Frontend geliştiriciler için**: [Frontend README](./frontend/README.md)
- **Admin geliştiriciler için**: [Admin README](./admin/README.md)

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak için lütfen:
1. Yeni bir branch oluşturun
2. Değişikliklerinizi yapın
3. Test edin
4. Pull request oluşturun

## 📞 İletişim

Proje ile ilgili sorularınız için: ismail.bayraktar.dev@gmail.com

