# Admin Panel Dökümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Yapılan Değişiklikler](#yapılan-değişiklikler)
3. [Sayfalar](#sayfalar)
4. [Özellikler](#özellikler)
5. [Geliştirme Rehberi](#geliştirme-rehberi)
6. [Yapılacak Geliştirmeler](#yapılacak-geliştirmeler)

## 🎯 Genel Bakış

Admin Panel, e-ticaret platformunun yönetimi için tasarlanmış React tabanlı bir yönetim konsoludur.

### Teknoloji Stack

- **React** (v18+)
- **Vite** (Build tool)
- **Tailwind CSS**
- **React Router** (Routing)
- **Axios** (HTTP client)
- **React Toastify** (Notifications)

### Çalıştırma

```bash
cd admin
npm install
npm run dev
```

Admin Panel `http://localhost:5173` üzerinde çalışacaktır.

## ✅ Yapılan Değişiklikler

### 1. Yeni Sayfalar

**DeliveryZones.jsx** - Teslimat bölgeleri yönetimi
- Bölge ekleme/silme
- Ücret belirleme
- Minimum sipariş tutarı

**TimeSlots.jsx** - Teslimat zaman aralıkları
- Zaman aralığı ekleme/silme
- Weekend availability
- Kapasite yönetimi

**Coupons.jsx** - Kupon yönetimi
- Kupon oluşturma
- Kupon silme
- Liste görüntüleme
- Durum kontrolü

**CorporateOrders.jsx** - Kurumsal siparişler
- Sipariş listesi
- Durum güncelleme
- Not ekleme

### 2. Ürün Yönetimi Güncellemeleri

**Add.jsx** - Yeni alanlar:
- FreshType (Taze/Kuru)
- Packaging (Standart/Özel)
- GiftWrap (Hediye paketi)
- Labels (Etiketler)
- Weights (Gramaj)
- Allergens (Alerjen)
- Ingredients (Malzeme)
- ShelfLife (Raf ömrü)
- StorageInfo (Saklama)

**Edit.jsx** - Aynı alanlar güncellendi

### 3. Orders.jsx Güncellemeleri

**Yeni Özellikler:**
- Kurye durumu gösterimi
- Renk kodlu durum badges
- Detaylı sipariş bilgileri

## 📄 Sayfalar

### Login
- **Dosya:** `src/components/Login.jsx`
- **Özellikler:**
  - Email/Password ile giriş
  - JWT token yönetimi
  - LocalStorage entegrasyonu

### Add (Ürün Ekleme)
- **Dosya:** `src/pages/Add.jsx`
- **Özellikler:**
  - Ürün bilgileri
  - Görsel yükleme (4 adet)
  - Kategori seçimi
  - Gramaj ve kişi sayısı
  - Baklava özel alanlar
  - AdminAuth required

### List (Ürün Listesi)
- **Dosya:** `src/pages/List.jsx`
- **Özellikler:**
  - Tüm ürünleri listeleme
  - Ürün silme
  - Düzenleme sayfasına yönlendirme
  - Toast bildirimleri

### Edit (Ürün Düzenleme)
- **Dosya:** `src/pages/Edit.jsx`
- **Özellikler:**
  - Mevcut ürün bilgilerini yükleme
  - Güncelleme işlemleri
  - Görsel değiştirme
  - Tüm yeni alanları düzenleme

### Orders (Siparişler)
- **Dosya:** `src/pages/Orders.jsx`
- **Özellikler:**
  - Tüm siparişleri listeleme
  - Sipariş durumu güncelleme
  - Kurye durumu gösterimi
  - Detaylı adres bilgileri

### Slider
- **Dosya:** `src/pages/Slider.jsx`
- **Özellikler:**
  - Slider ekleme/silme
  - Görsel yükleme
  - Aktif/Pasif yapma
  - Düzenleme

### DeliveryZones
- **Dosya:** `src/pages/DeliveryZones.jsx`
- **Özellikler:**
  - Bölge ekleme
  - Ücret belirleme
  - Minimum sipariş
  - Weekend availability
  - Same-day availability
  - Bölge silme

### TimeSlots
- **Dosya:** `src/pages/TimeSlots.jsx`
- **Özellikler:**
  - Zaman aralığı ekleme
  - Başlangıç/bitiş saati
  - Weekend işareti
  - Kapasite yönetimi
  - Silme

### Coupons
- **Dosya:** `src/pages/Coupons.jsx`
- **Özellikler:**
  - Kupon oluşturma
  - Kod belirleme
  - Tip seçimi (% veya sabit)
  - Değer belirleme
  - Minimum sepet
  - Geçerlilik tarihleri
  - Kullanım limiti
  - Kupon silme

### CorporateOrders
- **Dosya:** `src/pages/CorporateOrders.jsx`
- **Özellikler:**
  - Kurumsal sipariş listesi
  - Detaylı bilgi görüntüleme
  - Durum güncelleme
  - Not ekleme
  - Modal detay görüntüleme

## 🎨 Özellikler

### Authentication

- JWT token bazlı
- LocalStorage'da token saklama
- Protected routes
- Otomatik logout

### Form Handling

- React hook form (opsiyonel)
- Form validation
- Error handling
- Toast notifications

### File Upload

- Multer backend entegrasyonu
- Multi-image upload
- Preview functionality
- Cloudinary entegrasyonu (opsiyonel)

### State Management

- Local state (useState)
- Context API (gerektiğinde)
- Props drilling minimum

## 🛠️ Geliştirme Rehberi

### Yeni Sayfa Ekleme

1. **Sayfa dosyası oluştur:**
```jsx
// src/pages/MyPage.jsx
import axios from "axios";
import { backendUrl } from "../App.jsx";

const MyPage = ({ token }) => {
  // Component logic
  return <div>My Page</div>;
};

export default MyPage;
```

2. **App.jsx'e route ekle:**
```jsx
import MyPage from "./pages/MyPage.jsx";

<Route path="/my-page" element={<MyPage token={token} />}/>
```

3. **Sidebar'a menü ekle:**
```jsx
<NavLink to="/my-page">
  My Page
</NavLink>
```

### API Çağrıları

```jsx
const fetchData = async () => {
  try {
    const response = await axios.get(
      backendUrl + '/api/endpoint',
      { headers: { token } }
    );
    if (response.data.success) {
      // Success
    }
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Form Gönderme

```jsx
const onSubmitHandler = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("field", value);
  
  try {
    const response = await axios.post(
      backendUrl + '/api/endpoint',
      formData,
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success("Başarılı!");
    }
  } catch (error) {
    toast.error("Hata!");
  }
};
```

## 📋 Yapılacak Geliştirmeler

### Yüksek Öncelik

- [ ] **Dashboard Sayfası**
  - İstatistikler
  - Grafikler
  - Son siparişler
  - Önemli bildirimler

- [ ] **Kullanıcı Yönetimi**
  - Kullanıcı listesi
  - Kullanıcı detayları
  - Yetki yönetimi
  - Aktivasyon/deaktivasyon

### Orta Öncelik

- [ ] **Raporlar**
  - Satış raporları
  - Ürün raporları
  - Kullanıcı raporları
  - Excel export

- [ ] **Email Template Yönetimi**
  - Template oluşturma
  - Template düzenleme
  - Preview

- [ ] **Slider İçerik Düzenleme**
  - WYSIWYG editor
  - Drag & drop düzenleme
  - Preview

### Düşük Öncelik

- [ ] **Multi-Admin Sistemi**
  - Roller ve izinler
  - Admin ekleme/silme
  - Aktivite logları

- [ ] **Ayarlar Sayfası**
  - Genel ayarlar
  - Site ayarları
  - Entegrasyon ayarları

## 🔒 Güvenlik

- JWT token authentication
- Password hashing (bcrypt)
- XSS koruması
- CSRF koruması (gelecek)
- Rate limiting (gelecek)

## 📦 Build ve Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

