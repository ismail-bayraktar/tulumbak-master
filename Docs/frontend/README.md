# Frontend Dökümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Yapılan Değişiklikler](#yapılan-değişiklikler)
3. [Sayfalar](#sayfalar)
4. [Component'ler](#componentler)
5. [State Management](#state-management)
6. [Geliştirme Rehberi](#geliştirme-rehberi)
7. [Yapılacak Geliştirmeler](#yapılacak-geliştirmeler)

## 🎯 Genel Bakış

Frontend, React + Vite ile geliştirilmiş modern ve responsive müşteri arayüzüdür. Tailwind CSS ile styled component'ler kullanılmıştır.

### Teknoloji Stack

- **React** (v18+)
- **Vite** (Build tool)
- **Tailwind CSS**
- **Axios** (HTTP client)
- **React Router** (Routing)
- **Context API** (State management)

### Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5174` üzerinde çalışacaktır.

## ✅ Yapılan Değişiklikler

### 1. Product Component Updates

**ProductItem.jsx** - Yeni badge'ler eklendi:
- Taze/Kuru badge
- Özel ambalaj badge
- Hediye paketi badge
- Labels gösterimi

**Değişiklikler:**
```jsx
const ProductItem = ({ id, name, price, freshType, packaging, giftWrap, labels }) => {
  // Badge rendering logic
}
```

### 2. Checkout Flow

**PlaceOrder.jsx** - Kapsamlı güncelleme:

**Yeni Özellikler:**
- Delivery zone seçimi
- Time slot seçimi
- Kupon doğrulama ve uygulama
- Çoklu ödeme yöntemi seçimi
- Shopify-style tasarım

**Tasarım Özellikleri:**
- İki sütunlu layout
- Sol taraf: İletişim ve teslimat bilgileri
- Sağ taraf: Sepet özeti ve ödeme
- Breadcrumb navigation
- Modern form input'ları

### 3. Product Detail Page

**Product.jsx** - Detaylı ürün bilgisi:

**Yeni Bilgiler:**
- Gramaj seçim alanları
- Taze/Kuru ve ambalaj badge'leri
- Hediye paketi seçeneği
- Labels gösterimi
- Alerjen bilgileri
- Malzeme listesi
- Raf ömrü
- Saklama koşulları

### 4. Category Filter Update

**Collection.jsx** - Kategori filtreleri güncellendi:

**Eski Kategoriler:**
- Ceviz, İncir, Fındık, vb.

**Yeni Kategoriler:**
- Baklava
- Kadayıf
- Sütlü Tatlı
- Kuru Tatlı
- Möğürlü Tatlı
- Şerbetli Tatlı
- Özel Paket

## 📄 Sayfalar

### Ana Sayfa (Home.jsx)

**Bileşenler:**
- HeroSlider - Ana slider
- LatestCollection - En taze ürünler
- BestSeller - Çok satan ürünler
- OurPolicy - Politika bölümü
- Banner - Promosyon banner

**Özellikler:**
- Baklavacı temalı içerik
- Responsive tasarım
- Otomatik slider

### Koleksiyon (Collection.jsx)

**Özellikler:**
- Kategori filtreleme
- Arama fonksiyonu
- Sıralama seçenekleri
- Responsive grid layout

**Filtreler:**
- Kategori bazlı filtreleme
- Fiyat aralığı filtreleme (gelecek)

### Ürün Detay (Product.jsx)

**Özellikler:**
- Ürün görseli
- Detaylı açıklama
- Gramaj seçimi
- Badge'ler
- Ekleme/kaldırma
- İlgili ürünler

### Sepet (Cart.jsx)

**Özellikler:**
- Sepet öğeleri listesi
- Miktar güncelleme
- Ürün silme
- Toplam fiyat
- Checkout butonu

### Ödeme (PlaceOrder.jsx)

**Özellikler:**
- Çok adımlı form
- Teslimat adresi
- Delivery zone seçimi
- Time slot seçimi
- Kupon uygulama
- Ödeme yöntemi seçimi
- Sipariş özeti

### Siparişlerim (Orders.jsx)

**Özellikler:**
- Kullanıcı siparişleri
- Durum görüntüleme
- Filtreleme (gelecek)

### Giriş/Kayıt (Login.jsx)

**Özellikler:**
- Kayıt olma
- Giriş yapma
- Form validation
- Error handling

## 🧩 Component'ler

### ProductItem

Kullanım:
```jsx
<ProductItem
  id={item._id}
  name={item.name}
  price={item.basePrice}
  image={item.image}
  freshType={item.freshType}
  packaging={item.packaging}
  giftWrap={item.giftWrap}
  labels={item.labels}
/>
```

### CartTotal

Kullanım:
```jsx
<CartTotal 
  deliveryFee={deliveryFee}
  couponDiscount={couponDiscount}
/>
```

### OrderSummary

Kullanım:
```jsx
<OrderSummary
  deliveryFee={deliveryFee}
  couponDiscount={couponDiscount}
  couponCode={couponCode}
  setCouponCode={setCouponCode}
  setCouponDiscount={setCouponDiscount}
  handleCouponApply={handleCouponApply}
  method={method}
  setMethod={setMethod}
  bankInfo={bankInfo}
/>
```

### HeroSlider

**Özellikler:**
- Otomatik slider
- Manuel navigation
- Responsive
- API entegrasyonu

## 🔄 State Management

### ShopContext

**Global State:**
- cartItems
- products
- search
- showSearch
- token
- currency
- backendUrl

**Functions:**
- addToCart
- removeFromCart
- updateCart
- getCartAmount
- getShippingFee
- fetchProducts
- fetchCartData

**Kullanım:**
```jsx
const { cartItems, addToCart, token } = useContext(ShopContext);
```

## 🛠️ Geliştirme Rehberi

### Component Yapısı

```jsx
// Component template
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const MyComponent = () => {
  const { /* context değerleri */ } = useContext(ShopContext);

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### API Çağrıları

```jsx
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const fetchData = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/endpoint`);
    if (response.data.success) {
      // Success handling
    }
  } catch (error) {
    console.error(error);
  }
};
```

### Stil Standartları

- Tailwind CSS utility classes
- BEM naming convention (yer yer)
- Responsive-first approach
- Component bazlı styling

### Yeni Sayfa Ekleme

1. `src/pages/` altında yeni component oluştur
2. `src/App.jsx` içinde route ekle
3. Gerekirse navbar veya footer'a link ekle

## 📋 Yapılacak Geliştirmeler

### Yüksek Öncelik

- [ ] **Özel Gün Paketleri Sayfası**
  - Düğün paketleri
  - Bayram paketleri
  - Kurumsat paketleri

- [ ] **Sipariş Takip Sayfası**
  - Canlı kurye takibi
  - Durum güncellemeleri
  - Harita entegrasyonu

- [ ] **Ürün Favorileme**
  - Favori ekleme/kaldırma
  - Favoriler sayfası
  - LocalStorage entegrasyonu

### Orta Öncelik

- [ ] **Blog Sayfası**
  - Baklava tarifleri
  - Bakım önerileri
  - Kültürel içerikler

- [ ] **Müşteri Yorumları**
  - Yorum ekleme
  - Rating sistemi
  - Yorum görüntüleme

- [ ] **Karşılaştırma Özelliği**
  - Ürün karşılaştırma
  - Özellik karşılaştırma

### Düşük Öncelik

- [ ] **Hızlı Sipariş**
  - One-click checkout
  - Kayıtlı bilgiler

- [ ] **Canlı Destek**
  - WhatsApp entegrasyonu
  - Chat widget

- [ ] **Multi-langauge**
  - i18n entegrasyonu
  - Dil değiştirme

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

## 🎨 Tasarım Sistemi

### Renkler

- Primary: `#DC143C` (Kırmızı)
- Secondary: `#FFD700` (Altın)
- Background: `#FFFFFF`
- Text: `#414141`

### Typography

- Headings: Bold, larger sizes
- Body: Regular, 16px
- Small text: 12-14px

### Spacing

- Grid: 4px base unit
- Padding: 8px, 16px, 24px, 32px
- Margin: 8px, 16px, 24px, 32px

