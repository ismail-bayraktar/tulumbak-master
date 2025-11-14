# Component Playground - Tulumbak İzmir Baklava

## Storybook Kurulumu

Bu proje, UI component geliştirme ve test için **Storybook 10.0.7** kullanmaktadır.

### Kurulu Paketler

- `@storybook/nextjs` - Next.js 16 desteği
- `@storybook/addon-docs` - Otomatik dokümantasyon
- `@storybook/addon-onboarding` - Storybook rehberi
- `eslint-plugin-storybook` - Storybook ESLint kuralları
- `@chromatic-com/storybook` - Visual regression testing

### Çalıştırma

```bash
# Storybook development server'ı başlat (Port 6006)
npm run storybook

# Storybook static build oluştur
npm run build-storybook
```

## Component Stories

### 1. ProductCard Stories
**Dosya:** `src/components/home/ProductCard.stories.tsx`

**7 Farklı Varyant:**

1. **Default** - Normal stokta olan ürün
2. **Bestseller** - "Çok Satan" badge'li ürün
3. **Low Stock** - Az kaldı uyarısı (stok < 10)
4. **Out of Stock** - Tükenmiş ürün
5. **Premium** - Çoklu etiketli özel ürün
6. **Single Size** - Tek gramaj seçeneği
7. **Grid Display** - 3'lü grid düzeni

**Özellikler:**
- Dinamik badge sistem (Tükendi, Az Kaldı, Çok Satan)
- Çoklu etiket desteği (Yeni, Popüler, Premium)
- Gramaj seçenekleri ve fiyatlandırma
- Kişi sayısı gösterimi
- Hover efektleri ve animasyonlar

### 2. Header Stories
**Dosya:** `src/components/layout/Header.stories.tsx`

**5 Farklı Varyant:**

1. **Default** - Varsayılan header
2. **WithScrollContent** - Sticky davranış testi
3. **Mobile** - Mobil görünüm (hamburger menü)
4. **Tablet** - Tablet görünüm
5. **OnDarkBackground** - Koyu tema üzerinde

**Özellikler:**
- Sticky header (üstte sabit kalma)
- Kategori dropdown menüsü
- Arama işlevselliği
- Sepet badge (ürün sayısı)
- Kullanıcı menüsü (giriş/çıkış)
- Responsive mobile menü

### 3. Footer Stories
**Dosya:** `src/components/layout/Footer.stories.tsx`

**4 Farklı Varyant:**

1. **Default** - Varsayılan footer
2. **WithPageContent** - Sayfa içeriği ile birlikte
3. **Mobile** - Mobil görünüm
4. **Tablet** - Tablet görünüm

**Özellikler:**
- 4 kolonlu grid düzeni
- Hızlı erişim linkleri
- Müşteri hizmetleri linkleri
- İletişim bilgileri
- Dinamik yıl gösterimi
- Responsive tasarım

### 4. HeroSlider Stories
**Dosya:** `src/components/home/HeroSlider.stories.tsx`

**4 Farklı Varyant:**

1. **Default** - Store'dan veri çeken varsayılan slider
2. **Loading** - Yükleme animasyonu
3. **Mobile** - Mobil görünüm
4. **Tablet** - Tablet görünüm

**5 Farklı Template:**

#### Template 1: Split Left
- Metin sol, görsel sağda
- Gradient arka plan (orange-amber)
- E-ticaret için klasik düzen

#### Template 2: Split Right
- Görsel sol, metin sağda
- Split-left'in tersi düzen
- Mobilde görsel üstte

#### Template 3: Centered
- Merkezi hizalanmış metin
- Daha büyük başlıklar (text-7xl)
- Minimal ve şık tasarım

#### Template 4: Full Width
- Tam genişlik arka plan görseli
- Gradient overlay (siyah → şeffaf)
- Sol tarafa hizalı metin

#### Template 5: Overlay
- Arka plan görseli + ayarlanabilir opak katman
- overlayOpacity ile opacity kontrolü (0-100)
- Merkezi metin düzeni

**Slider Özellikleri:**
- Auto-play (5 saniye interval)
- Manuel navigasyon (ok tuşları)
- Dots indicator
- Fade + Slide animasyonlar (1000ms)
- Text color: light / dark / auto
- Button style: primary / secondary / outline

## Tailwind CSS v4 Entegrasyonu

Storybook, projenin `globals.css` dosyasını import eder:

```css
@import "tailwindcss";
@import "tw-animate-css";
```

**Tema Özellikleri:**
- CSS Variables ile renk sistemi
- Dark mode desteği (`.dark` class)
- OKLCH renk formatı
- Shadcn UI tema değişkenleri
- Custom font stacks (system fonts)

## Next.js 16 + React 19 Uyumluluğu

Storybook, Next.js 16 ve React 19 ile tam uyumludur:

- `@storybook/nextjs` framework adapter
- App Router desteği
- `next/image` component desteği
- `next/link` component desteği
- Server Component mock'ları

## Kullanım Senaryoları

### 1. Component Geliştirme
Yeni component varyantları geliştirirken Storybook'ta test edin:

```tsx
export const NewVariant: Story = {
  args: {
    product: createMockProduct({
      // Özel props
    }),
  },
};
```

### 2. Responsive Testing
Farklı viewport'larda test edin:

```tsx
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1', // veya 'tablet', 'desktop'
    },
  },
};
```

### 3. Design Review
Tasarım ekibi ile component varyantlarını gözden geçirin. Her story izole edilmiş olduğu için kolayca karşılaştırabilirsiniz.

### 4. A/B Testing Preparation
Farklı tasarım varyantları oluşturun ve Storybook'ta yan yana karşılaştırın.

## Gelecek Geliştirmeler

- [ ] Checkout flow component stories
- [ ] Single Product Page variants
- [ ] Cart page stories
- [ ] Category page stories
- [ ] Visual regression testing (Chromatic entegrasyonu)
- [ ] Accessibility tests (a11y addon)
- [ ] Interaction tests (play functions)

## Teknik Detaylar

**Storybook Konfigürasyonu:**
- `.storybook/main.ts` - Ana konfigürasyon
- `.storybook/preview.ts` - Global dekoratörler ve parametreler

**Story Pattern:**
```
src/**/*.stories.@(js|jsx|mjs|ts|tsx)
```

**Static Dizinler:**
- `public/` - Static asset'ler (görsel, font vb.)

**Addons:**
- Controls - Props'ları dinamik olarak değiştir
- Docs - Otomatik dokümantasyon
- Onboarding - Storybook rehberi
- Chromatic - Visual regression

## Kaynaklar

- [Storybook Docs](https://storybook.js.org/docs)
- [Next.js Integration](https://storybook.js.org/docs/get-started/frameworks/nextjs)
- [Tailwind CSS in Storybook](https://storybook.js.org/recipes/tailwindcss)
- [Component Story Format](https://storybook.js.org/docs/api/csf)

---

**Son Güncelleme:** 2025-01-14
**Storybook Version:** 10.0.7
**Next.js Version:** 16.0.3
**React Version:** 19.2.0
