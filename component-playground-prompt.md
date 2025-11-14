# Component Playground Geliştirme Prompt'u

## 🎯 Proje Bağlamı ve Amacı

Bu prompt, **Tulumbak İzmir Baklava E-Ticaret Platformu** için harici bir geliştirme ortamında **Component Playground** aracı geliştirmek için hazırlanmıştır. Bu araç, frontend geliştiricilerinin UI komponentlerini izole bir ortamda test etmesini, görselleştirmesini ve geliştirmesini sağlayacaktır.

### 📋 Proje Bilgileri

**Sektör:** E-Ticaret / Gıda & Tatlı Ürünleri  
**Ürün Grubu:** Baklava ve Geleneksel Türk Tatlıları  
**Hedef Pazar:** İzmir ve çevresi  
**Altyapı:** Modern Full-Stack E-Ticaret Platformu

**Proje Özellikleri:**
- Ürün yönetimi (gramaj seçenekleri, taze/kuru, özel ambalaj)
- Sepet ve sipariş yönetimi
- Ödeme entegrasyonu (PayTR)
- Kurye entegrasyonu (MuditaKurye)
- Email sistemi (React Email)
- Admin panel (Shadcn UI)

---

## 🔄 Geliştirme Workflow'u

### AŞAMA 1: Bağlamı Anlama (Sorular)

**ÖNCE ŞU SORULARI SOR:**

1. **Component Playground'un Kapsamı:**
   - Hangi komponentler için playground oluşturulacak? (UI komponentleri, sayfa komponentleri, özel komponentler)
   - Sadece mevcut komponentler mi yoksa yeni komponent geliştirmesi için mi kullanılacak?

2. **Teknik Gereksinimler:**
   - Standalone bir uygulama mı yoksa mevcut projeye entegre mi olacak?
   - Hangi port'ta çalışacak? (Mevcut: frontend 5174, admin 5173, backend 4001)
   - Hot reload desteği gerekli mi?

3. **Backend Entegrasyonu:**
   - Mock API mi kullanılacak yoksa gerçek backend'e bağlanacak mı?
   - API endpoint'leri için mock data mı yoksa gerçek data mı kullanılacak?
   - Authentication gereksinimleri var mı?

4. **Kullanıcı Deneyimi:**
   - Storybook benzeri bir arayüz mü isteniyor?
   - Component props'larını dinamik olarak değiştirme özelliği gerekli mi?
   - Responsive test araçları gerekli mi?
   - Dark mode test desteği gerekli mi?

5. **Veri Yönetimi:**
   - Mock data generator gerekli mi?
   - Farklı senaryolar için preset'ler oluşturulacak mı?
   - Zustand store'ları mock'lanacak mı?

**Kullanıcıdan bu soruların cevaplarını al ve cevaplara göre planı özelleştir.**

---

### AŞAMA 2: Plan Oluşturma

**Plan oluştururken şu adımları takip et:**

1. **Proje Yapısı Planı:**
   - Dizin yapısı
   - Dosya organizasyonu
   - Config dosyaları

2. **Teknoloji Stack Planı:**
   - Framework seçimi (Next.js, Vite, vb.)
   - Bağımlılık yönetimi
   - Build konfigürasyonu

3. **Component Entegrasyon Planı:**
   - Mevcut komponentlerin import stratejisi
   - Type definitions entegrasyonu
   - Styling entegrasyonu (Tailwind CSS)

4. **Mock Data Planı:**
   - Mock API stratejisi
   - Mock data generator
   - Zustand store mock'ları

5. **UI/UX Planı:**
   - Playground arayüz tasarımı
   - Component navigasyonu
   - Props editor tasarımı

**Planı detaylı bir şekilde dokümante et ve kullanıcıya sun.**

---

### AŞAMA 3: Uygulama

**Uygulama aşamasında:**

1. Proje yapısını oluştur
2. Tüm bağımlılıkları kur
3. Config dosyalarını ayarla
4. Component entegrasyonunu yap
5. Mock API'yi kur
6. Playground UI'ını geliştir
7. Test et ve dokümante et

---

## 🛠️ Teknoloji Stack ve Bağımlılıklar

### Frontend Stack (Mevcut Proje)

```json
{
  "framework": "Next.js 16.0.3",
  "react": "19.2.0",
  "typescript": "^5",
  "styling": "Tailwind CSS v4",
  "ui-library": "Radix UI + Shadcn UI",
  "state-management": "Zustand 5.0.8",
  "http-client": "Axios 1.13.2",
  "icons": "Lucide React 0.553.0",
  "notifications": "react-hot-toast 2.6.0",
  "utilities": {
    "clsx": "2.1.1",
    "tailwind-merge": "3.4.0",
    "class-variance-authority": "0.7.1"
  },
  "carousel": "embla-carousel-react 8.6.0"
}
```

### Backend Stack (Uyumluluk İçin)

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 4.21.2",
  "database": "MongoDB 6+ (Mongoose 8.9.2)",
  "authentication": "JWT (jsonwebtoken 9.0.2)",
  "validation": "Zod 3.25.76",
  "api-format": "RESTful JSON"
}
```

### TypeScript Konfigürasyonu

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind CSS Konfigürasyonu

- **Version:** Tailwind CSS v4
- **PostCSS:** @tailwindcss/postcss
- **Animations:** tw-animate-css
- **Custom Variants:** Dark mode support
- **Theme:** OKLCH color space, CSS variables

### Path Aliases

- `@/*` → `./src/*` (TypeScript path mapping)

---

## 📦 Mevcut Component Yapısı

### UI Components (Radix UI + Shadcn)

```
src/components/ui/
├── accordion.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── carousel.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── field.tsx
├── input.tsx
├── label.tsx
├── radio-group.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── skeleton.tsx
├── slider.tsx
├── tabs.tsx
├── textarea.tsx
└── tooltip.tsx
```

### Business Components

```
src/components/
├── home/
│   ├── ProductCard.tsx
│   ├── CategorySection.tsx
│   ├── Hero.tsx
│   ├── BestSeller.tsx
│   └── LatestCollection.tsx
├── collection/
│   └── FilterSidebar.tsx
├── layout/
│   ├── Header.tsx
│   └── Footer.tsx
├── auth/
├── providers/
│   └── AuthProvider.tsx
└── login-form.tsx
```

### Component Pattern'leri

1. **UI Components:**
   - Radix UI primitives kullanımı
   - `cn()` utility ile className birleştirme
   - `cva` (class-variance-authority) ile variant yönetimi
   - TypeScript strict typing
   - `data-slot` attribute'ları

2. **Business Components:**
   - Next.js `'use client'` directive
   - Zustand store entegrasyonu
   - API client kullanımı
   - Type-safe props

---

## 🔌 Backend API Uyumluluğu

### API Endpoint Yapısı

```typescript
// Base URL
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';

// Endpoint Pattern
/api/{resource}/{action}

// Örnekler:
/api/product/list
/api/product/{id}
/api/cart/add
/api/cart/get
/api/order/place
/api/user/login
/api/category/active
```

### Response Format

```typescript
// Success Response
{
  success: boolean;
  data?: T;
  products?: T[];
  message?: string;
}

// Error Response
{
  success: false;
  message: string;
  error?: string;
}
```

### Authentication

- **Method:** JWT Bearer Token
- **Header:** `Authorization: Bearer {token}`
- **Storage:** localStorage (`token` key)
- **Interceptor:** Axios interceptor ile otomatik ekleme

### API Client Pattern

```typescript
// Request Interceptor
- Token'ı localStorage'dan al
- Authorization header'a ekle
- Dev mode'da loglama

// Response Interceptor
- 401: Token sil, login'e yönlendir
- 403: Yetki hatası toast
- 500: Sunucu hatası toast
- Network error: Bağlantı hatası toast
```

---

## 📊 Type Definitions

### Product Types

```typescript
interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;  // TL cinsinden
  image: string[];    // URL array
  category: ProductCategory;
  sizes: number[];    // [250, 500, 1000, 2000]
  sizePrices: SizePrice[];
  personCounts: string[];
  freshType: 'taze' | 'kuru';
  packaging: 'standart' | 'özel';
  giftWrap: boolean;
  labels: string[];
  bestseller: boolean;
  stock: number;
  // ... diğer alanlar
}
```

### Cart Types

```typescript
interface CartState {
  items: CartItems;  // { [productId]: { [size]: quantity } }
  currency: string;
  deliveryFee: number;
  addToCart: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  // ... diğer metodlar
}
```

---

## 🎨 Styling ve Tema

### CSS Variables (globals.css)

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... diğer renkler */
}

.dark {
  /* Dark mode renkleri */
}
```

### Font System

- **Sans:** Inter (--font-inter)
- **Heading:** Poppins (--font-poppins)
- **Serif:** Prata (--font-prata)
- **Body:** Nunito Sans (--font-nunito-sans)

### Utility Functions

```typescript
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 🗂️ Proje Dizin Yapısı (Mevcut)

```
frontend-new/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── collection/
│   │   ├── login/
│   │   ├── orders/
│   │   └── product/[id]/
│   ├── components/
│   │   ├── ui/           # Shadcn UI components
│   │   ├── home/
│   │   ├── collection/
│   │   ├── layout/
│   │   └── providers/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   └── utils.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   └── productService.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── categoryStore.ts
│   │   └── productStore.ts
│   └── types/
│       ├── auth.ts
│       ├── cart.ts
│       ├── category.ts
│       ├── order.ts
│       └── product.ts
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## 🚀 Component Playground Gereksinimleri

### Temel Özellikler

1. **Component Listesi:**
   - Tüm UI komponentlerini listele
   - Business komponentlerini listele
   - Kategorize et (UI, Layout, Business)

2. **Component Viewer:**
   - Seçilen komponenti render et
   - Props'ları göster
   - Farklı variant'ları test et

3. **Props Editor:**
   - Dinamik props değiştirme
   - Type-safe prop editing
   - Preset'ler kaydetme/yükleme

4. **Mock Data:**
   - Product mock data
   - Cart mock data
   - User mock data
   - API response mock'ları

5. **Responsive Test:**
   - Farklı ekran boyutları
   - Mobile/Tablet/Desktop görünümleri

6. **Dark Mode Test:**
   - Light/Dark mode toggle
   - Theme değişikliği

### Teknik Gereksinimler

1. **Next.js Uyumluluğu:**
   - App Router kullanımı
   - Server/Client component ayrımı
   - Image optimization

2. **TypeScript:**
   - Strict mode
   - Type inference
   - Path aliases (@/*)

3. **Styling:**
   - Tailwind CSS v4
   - CSS variables
   - Dark mode support

4. **State Management:**
   - Zustand store mock'ları
   - Context API (gerekirse)

5. **API Mocking:**
   - MSW (Mock Service Worker) veya benzeri
   - Axios interceptor override
   - Mock data generator

---

## 📝 Geliştirme Standartları

### Kod Standartları

1. **TypeScript:**
   - Strict mode aktif
   - Explicit return types (fonksiyonlarda)
   - Interface kullanımı (type değil)

2. **React:**
   - Functional components
   - Hooks kullanımı
   - 'use client' directive (gerekirse)

3. **Naming:**
   - PascalCase: Components, Types, Interfaces
   - camelCase: functions, variables
   - kebab-case: file names (component dosyaları hariç)

4. **Import Order:**
   - React/Next.js imports
   - Third-party imports
   - Local imports (@/*)
   - Type imports

### Component Pattern

```typescript
'use client'; // Gerekirse

import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props definition
}

export function Component({ 
  prop1, 
  prop2,
  className,
  ...props 
}: ComponentProps & ComponentProps<"div">) {
  return (
    <div 
      className={cn("base-classes", className)}
      {...props}
    >
      {/* Component content */}
    </div>
  );
}
```

---

## 🔍 Mock Data Örnekleri

### Product Mock Data

```typescript
const mockProduct: Product = {
  _id: "507f1f77bcf86cd799439011",
  name: "Fıstıklı Baklava",
  description: "Geleneksel tarifle hazırlanmış taze fıstıklı baklava",
  basePrice: 250.00,
  image: ["/assets/baklava-1.jpg"],
  category: {
    _id: "507f191e810c19729de860ea",
    name: "Baklava",
    active: true,
    slug: "baklava"
  },
  sizes: [250, 500, 1000, 2000],
  sizePrices: [
    { size: 250, price: 250.00 },
    { size: 500, price: 450.00 },
    { size: 1000, price: 850.00 },
    { size: 2000, price: 1600.00 }
  ],
  personCounts: ["2-3", "5-6", "8-10"],
  freshType: "taze",
  packaging: "standart",
  giftWrap: true,
  labels: ["Yeni", "Popüler"],
  bestseller: true,
  stock: 50
};
```

### API Response Mock

```typescript
const mockProductListResponse: ProductListResponse = {
  success: true,
  products: [mockProduct],
  total: 1
};
```

---

## ✅ Checklist: Geliştirme Öncesi

- [ ] Kullanıcıdan AŞAMA 1 sorularının cevaplarını aldın mı?
- [ ] Plan oluşturdun ve kullanıcıya sundun mu?
- [ ] Tüm bağımlılıkları kontrol ettin mi?
- [ ] Type definitions'ları inceledin mi?
- [ ] Component pattern'lerini anladın mı?
- [ ] API yapısını anladın mı?
- [ ] Styling sistemini anladın mı?
- [ ] Mock data stratejisini belirledin mi?

---

## 🎯 Başarı Kriterleri

Component Playground başarılı sayılır eğer:

1. ✅ Tüm UI komponentleri görüntülenebiliyor
2. ✅ Props dinamik olarak değiştirilebiliyor
3. ✅ Mock data ile çalışıyor
4. ✅ Backend'e bağımlı değil
5. ✅ Responsive test yapılabiliyor
6. ✅ Dark mode test edilebiliyor
7. ✅ Type-safe
8. ✅ Hot reload çalışıyor
9. ✅ Mevcut proje ile uyumlu
10. ✅ Dokümante edilmiş

---

## 📚 Referanslar

- **Next.js Docs:** https://nextjs.org/docs
- **Radix UI:** https://www.radix-ui.com/
- **Shadcn UI:** https://ui.shadcn.com/
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **Zustand:** https://zustand-demo.pmnd.rs/
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## 💡 Önemli Notlar

1. **Proje Sektörü:** E-Ticaret / Gıda & Tatlı Ürünleri
2. **Hedef Kullanıcı:** Frontend geliştiricileri
3. **Geliştirme Ortamı:** Harici (mevcut projeden bağımsız)
4. **Uyumluluk:** Mevcut proje tech stack'i ile %100 uyumlu olmalı
5. **Performans:** Hızlı ve sorunsuz çalışmalı
6. **Dokümantasyon:** Her adım dokümante edilmeli

---

**Bu prompt'u kullanarak Component Playground geliştirmeye başlayabilirsin. Önce AŞAMA 1'deki soruları sor ve kullanıcıdan cevapları al!**

