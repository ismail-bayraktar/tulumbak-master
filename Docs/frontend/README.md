# Frontend Dökümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Yapılan Son Değişiklikler](#yapılan-son-değişiklikler-2024-10-29)
3. [Kod Standartları ve Best Practiceler](#kod-standartları-ve-best-practiceler)
4. [Tasarım Sistemi ve Tema](#tasarım-sistemi-ve-tema)
5. [Sayfalar](#sayfalar)
6. [Component'ler](#componentler)
7. [State Management](#state-management)
8. [Geliştirme Rehberi](#geliştirme-rehberi)
9. [Yapılacak Geliştirmeler](#yapılacak-geliştirmeler)

## 🎯 Genel Bakış

Frontend, React + Vite ile geliştirilmiş modern ve responsive müşteri arayüzüdür. Tailwind CSS ilestyled component'ler kullanılmıştır.

### Teknoloji Stack

- **React** (v18.3.1)
- **Vite** (Build tool)
- **Tailwind CSS** (Utility-first CSS framework)
- **Axios** (HTTP client)
- **React Router** (Routing)
- **Context API** (State management)
- **Lucide React** (Icon library)
- **React Toastify** (Notifications)

### Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5176` üzerinde çalışacaktır (port dolarsa otomatik olarak bir sonraki available port'u kullanır).

## ✅ Yapılan Son Değişiklikler (2024-10-29)

### 1. Orange Tema Implementasyonu

**Değiştirilen Dosyalar:**
- `ModernHome.jsx` - Ana sayfa orange tema
- `HeroSlider.jsx` - Slider element'leri orange tema
- `ModernProductDetail.jsx` - Product detail orange tema

**Tema Değişiklikleri:**
```css
/* Eski kırmızı tema */
bg-red-600 hover:bg-red-700
text-red-600

/* Yeni turuncu tema */
bg-orange-500 hover:bg-orange-600
text-orange-500
```

**Etkilen Elementler:**
- Primary button'lar
- CTA (Call-to-Action) button'lar
- Title ve accent renkler
- Loading spinner'lar
- Hero slider dot indicator'ları

### 2. Modern Baklava-İzmir SEO Section

**Eklenen Section:** `ModernHome.jsx` içinde yeni tanıtım bölümü

**Özellikler:**
- SEO odaklı "Baklava-İzmir" keyword entegrasyonu
- "Menemen" bölgesi hedeflemesi
- Modern kart tasarımı ile istatistikler
- İki kolonlu layout (özellikler + stats panel)
- Responsive tasarım

```jsx
{/* Baklava-İzmir SEO Section */}
<section className="py-20 bg-gradient-to-br from-orange-50 to-white">
  <div className="container mx-auto px-6">
    {/* İçerik... */}
  </div>
</section>
```

### 3. İkon Sistemi Modernizasyonu

**Değiştirilen Dosyalar:**
- `ModernProductDetail.jsx`
- `Navbar.jsx`
- Diğer component'ler

**Eski Sistem:** Emoji ve custom PNG ikonlar
**Yeni Sistem:** Lucide React professional SVG ikonlar

```jsx
// Eski
🚫 ❌ ✅ 📦

// Yeni
import { ShoppingBag, Shield, Clock, Sun, Sparkles } from "lucide-react";
```

### 4. Typography ve Font Sistemi

**Değiştirilen Dosyalar:**
- `index.css`
- `tailwind.config.js`

**Yeni Font Family'ler:**
- Inter (body text)
- Poppins (headings)
- Nunito (accent text)

**Özellikler:**
- Türkçe karakter desteği
- Türk Lira sembolü optimizasyonu
- Modern font ağırlıkları

```css
.font-inter { font-family: 'Inter', sans-serif; }
.font-poppins { font-family: 'Poppins', sans-serif; }
.font-nunito { font-family: 'Nunito Sans', sans-serif; }
```

### 5. Product Detail Sayfası Minimalist Tasarım

**Değiştirilen Dosyalar:** `ModernProductDetail.jsx`

**Kaldırılan Elementler:**
- Quick Info Cards (hacimli kartlar)
- Alerjen/Malzeme tab'ları (sadeleştirildi)

**Yeni Tasarım:**
- Sade 2 tab: "Ürün Açıklaması" ve "Saklama Koşulları"
- Modern ve minimalist yaklaşım
- Daha temiz UI

### 6. Slider Görsel Yükleme Sorunu Çözüldü

**Backend Düzeltmeleri:**
- CORS ayarları güncellendi
- Content Security Policy düzenlendi
- Cross-origin resource policy eklendi

**Değiştirilen Dosyalar:**
- `server.js` (backend)
- `HeroSlider.jsx` (frontend)

## 🎨 Kod Standartları ve Best Practiceler

### Component Yapısı

```jsx
// ✅ Doğru Component Yapısı
import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import { ShoppingCart, Star } from 'lucide-react';

const ComponentName = ({ prop1, prop2 }) => {
  const { globalState, globalFunction } = useContext(ShopContext);
  const [localState, setLocalState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependency]);

  const handleAction = () => {
    // Action logic
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* JSX Content */}
    </div>
  );
};

export default ComponentName;
```

### İkon Kullanımı

```jsx
// ✅ Doğru İkon Kullanımı
import { ShoppingCart, Package, Truck, Clock } from 'lucide-react';

<ShoppingCart className="w-5 h-5 text-orange-500" />
<Package className="w-6 h-6 text-gray-600" />

// ❌ Yanlış: Emoji kullanımı
<span>🛒</span>
<span>📦</span>
```

### Renk Kullanımı

```jsx
// ✅ Doğru Tema Renkleri
<button className="bg-orange-500 hover:bg-orange-600 text-white">
  Primary Action
</button>

<button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
  Secondary Action
</button>

// ❌ Yanlış: Eski kırmızı tema
<button className="bg-red-600 hover:bg-red-700">
```

### Typography Standartları

```jsx
// ✅ Doğru Typography
<h1 className="heading-primary font-bold text-3xl">
  Ana Başlık
</h1>

<h2 className="heading-secondary font-semibold text-2xl">
  Alt Başlık
</h2>

<p className="text-gray-600 leading-relaxed">
  Body text content
</p>
```

### State Management

```jsx
// ✅ Doğru Context Kullanımı
const {
  cartItems,
  addToCart,
  removeFromCart,
  products,
  currency
} = useContext(ShopContext);

// Product ekleme
const handleAddToCart = (productId, size) => {
  addToCart(productId, size);
  toast.success('Ürün sepete eklendi!');
};
```

### API Çağrıları

```jsx
// ✅ Doğru API Pattern
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/product/list`);
    if (response.data.success) {
      setProducts(response.data.products);
    }
  } catch (error) {
    console.error('Products fetch error:', error);
    toast.error('Ürünler yüklenemedi');
  }
};
```

### Responsive Design

```jsx
// ✅ Doğru Responsive Classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>

<div className="flex flex-col sm:flex-row gap-4">
  {/* Content */}
</div>
```

## 🎨 Tasarım Sistemi ve Tema

### Renk Paleti

```css
/* Orange Tema */
--orange-50:   #FFF7F0;
--orange-100:  #FFECE0;
--orange-200:  #FFD9BF;
--orange-300:  #FFBF99;
--orange-400:  #FFA366;
--orange-500:  #FF8235;  /* Primary */
--orange-600:  #FF6B35;  /* Primary Hover */
--orange-700:  #E55A2B;
--orange-800:  #CC4A20;
--orange-900:  #A63A1A;

/* Neutral Colors */
--text-primary:   #1F2937;
--text-secondary: #6B7280;
--text-muted:     #9CA3AF;
--background:     #FAFAFA;
--border:         #E5E7EB;
```

### Typography Scale

```css
.heading-primary {
  font-size: 1.875rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.heading-secondary {
  font-size: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
```

### Shadow Sistemi

```css
.shadow-modern: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
.shadow-modern-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

## 📄 Sayfalar

### Ana Sayfa (ModernHome.jsx)

**Bileşenler:**
- HeroSlider - Admin yönetimli slider
- Trust Badges - Güvenlik badge'leri
- Featured Products - Öne çıkan ürünler
- Baklava-İzmir SEO Section - SEO bölümü
- Best Sellers - Çok satanlar
- CTA Section - Eylem çağrısı

**Özellikler:**
- Orange tema uyumlu
- Responsive tasarım
- Modern component'ler

### Ürün Detay (ModernProductDetail.jsx)

**Özellikler:**
- Minimalist tasarım
- Orange theme CTA butonları
- Sade 2 tab (Açıklama, Saklama)
- Professional ikonlar
- Türkçe karakter desteği

### Diğer Sayfalar

- **Collection.jsx** - Ürün listeleme
- **Cart.jsx** - Sepet yönetimi
- **PlaceOrder.jsx** - Ödeme süreci
- **Login.jsx** - Giriş/Kayıt

## 🧩 Component'ler

### ModernProductDetail

Minimalist product detail component'i.

```jsx
<ModernProductDetail />
```

### HeroSlider

Admin panelinden yönetilebilen slider.

```jsx
<HeroSlider />
```

### BaklavaİzmirSection

SEO odaklı tanıtım bölümü.

```jsx
<BaklavaİzmirSection />
```

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

**Key Functions:**
- addToCart(productId, size)
- removeFromCart(productId, size)
- updateQuantity(productId, size, quantity)
- getCartAmount()
- fetchProducts()

## 🛠️ Geliştirme Rehberi

### Yeni Component Ekleme

1. Component oluştur:
```jsx
// src/components/NewComponent.jsx
const NewComponent = () => {
  return <div>New Component</div>;
};
export default NewComponent;
```

2. Component'i import et ve kullan:
```jsx
import NewComponent from '../components/NewComponent.jsx';
```

### Yeni Sayfa Ekleme

1. Sayfa component'i oluştur (`src/pages/`)
2. Route ekle (`src/App.jsx`)
3. Navbar'a link ekle (gerekirse)

### CSS Tailwind Kullanımı

```jsx
// Spacing
<p-4>  {/* padding: 1rem */}
<m-2>  {/* margin: 0.5rem */}
<gap-4> {/* gap: 1rem */}

// Colors
<bg-orange-500>  {/* background */}
<text-gray-700>  {/* text color */}
<border-orange-200> {/* border */}

// Typography
<text-sm>     {/* font-size: 0.875rem */}
<font-bold>   {/* font-weight: bold */}
<leading-relaxed> {/* line-height: 1.625 */}
```

### Toast Notifications

```jsx
import { toast } from 'react-toastify';

// Success
toast.success('İşlem başarılı!');

// Error
toast.error('Bir hata oluştu!');

// Info
toast.info('Bilgilendirme!');
```

## 📋 Yapılacak Geliştirmeler

### 🚀 Yüksek Öncelik

- [ ] **Mobile Optimization**
  - Men hamburger menü iyileştirmeleri
  - Touch-friendly button boyutları
  - Swipe gestures for carousel

- [ ] **Loading States**
  - Skeleton loading component'leri
  - Better loading animations
  - Error boundaries

- [ ] **Product Filters Enhancement**
  - Fiyat aralığı slider
  - Multi-select category filters
  - Advanced search with autocomplete

### 🎯 Orta Öncelik

- [ ] **User Dashboard**
  - Sipariş geçmişi
  - Adres yönetimi
  - Profil ayarları

- [ ] **Product Quick View**
  - Modal quick preview
  - Fast add to cart
  - Product comparison

- [ ] **Wishlist System**
  - Favori ürünler
  - LocalStorage entegrasyonu
  - Share wishlist

### 🔮 Düşük Öncelik

- [ ] **Blog/Magazine Section**
  - Baklava tarifleri
  - İzmir kültürü
  - SEO içerikleri

- [ ] **Advanced Features**
  - Live chat support
  - Product recommendations
  - Social sharing

- [ ] **Performance Optimization**
  - Image lazy loading
  - Code splitting
  - Service worker

## 📦 Build ve Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Environment Variables

```bash
VITE_BACKEND_URL=http://localhost:4001
```

## 🎯 Best Practices Checklist

### ✅ Component Standards
- [ ] Functional components with hooks
- [ ] Props destructuring
- [ ] Proper TypeScript (when applicable)
- [ ] Consistent naming conventions

### ✅ Styling Standards
- [ ] Tailwind utility classes
- [ ] Responsive-first design
- [ ] Orange theme compliance
- [ ] Semantic HTML structure

### ✅ Performance Standards
- [ ] Lazy loading for images
- [ ] Component memoization when needed
- [ ] Optimized re-renders
- [ ] Bundle size optimization

### ✅ Accessibility Standards
- [ ] Alt text for images
- [ ] Semantic HTML
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

### ✅ Code Quality Standards
- [ ] ESLint compliance
- [ ] Proper error handling
- [ ] Loading states
- [ ] User feedback (toasts)

---

**Son Güncelleme:** 29.10.2024
**Versiyon:** 2.0.0
**Geliştirici:** Claude Code Assistant