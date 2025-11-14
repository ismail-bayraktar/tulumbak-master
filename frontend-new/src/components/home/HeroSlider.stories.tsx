import type { Meta, StoryObj } from '@storybook/react';
import { HeroSlider } from './HeroSlider';

// Note: HeroSlider uses Zustand store, so it fetches data dynamically.
// For Storybook, you may need to mock the store or provide sample data.

const meta: Meta<typeof HeroSlider> = {
  title: 'Components/HeroSlider',
  component: HeroSlider,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        {/* Content below slider */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-4">Slider Altı İçerik</h2>
          <p className="text-neutral-600">
            Hero slider 600px yüksekliğinde, 5 farklı template desteği ile çalışır.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Split Left</h3>
              <p className="text-sm text-neutral-600">Metin solda, görsel sağda</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Split Right</h3>
              <p className="text-sm text-neutral-600">Görsel solda, metin sağda</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Centered</h3>
              <p className="text-sm text-neutral-600">Merkezi metin düzeni</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Full Width</h3>
              <p className="text-sm text-neutral-600">Tam genişlik arka plan</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Overlay</h3>
              <p className="text-sm text-neutral-600">Opak katman ile metin</p>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeroSlider>;

// Default - Loads from store
export const Default: Story = {};

// Loading State
export const Loading: Story = {
  decorators: [
    (Story) => {
      // Mock loading state
      return (
        <div className="w-full h-[600px] bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 animate-pulse flex items-center justify-center">
          <div className="text-orange-600 text-xl">Yükleniyor...</div>
        </div>
      );
    },
  ],
  render: () => null,
};

// Mobile View
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet View
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Template Documentation
export const TemplateShowcase: Story = {
  decorators: [
    (Story) => (
      <div className="bg-neutral-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hero Slider Templates</h1>
            <p className="text-neutral-600 mb-8">
              HeroSlider component 5 farklı template ile çalışır. Her template farklı layout ve görsel sunum sağlar.
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Split Left */}
            <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  split-left
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Split Left Template</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Metin sol tarafta, ürün görseli sağ tarafta. E-ticaret siteleri için klasik düzen.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>✓ Subtitle, Title, Description</li>
                <li>✓ CTA Button (3 stil: primary, secondary, outline)</li>
                <li>✓ Gradient arka plan (orange-amber)</li>
                <li>✓ Görsel sağda, scale animasyonu</li>
              </ul>
            </div>

            {/* Split Right */}
            <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  split-right
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Split Right Template</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Ürün görseli sol tarafta, metin sağ tarafta. Split-left'in tersi düzen.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>✓ Aynı içerik yapısı</li>
                <li>✓ Ters grid düzeni (lg:order-1/2)</li>
                <li>✓ Mobilde görsel üstte</li>
                <li>✓ Gradient arka plan</li>
              </ul>
            </div>

            {/* Centered */}
            <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  centered
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Centered Template</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Tüm içerik merkezi hizalanmış. Hero section için minimal ve şık tasarım.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>✓ text-center düzeni</li>
                <li>✓ Daha büyük başlıklar (text-7xl)</li>
                <li>✓ max-w-4xl içerik genişliği</li>
                <li>✓ Gradient arka plan</li>
              </ul>
            </div>

            {/* Full Width */}
            <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  full-width
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Full Width Template</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Tam genişlik arka plan görseli üzerine metin. Etkileyici görsel sunum.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>✓ Background image (object-cover)</li>
                <li>✓ Gradient overlay (black/70 → transparent)</li>
                <li>✓ Light text colors (beyaz metin)</li>
                <li>✓ Sol tarafa hizalanmış içerik</li>
              </ul>
            </div>

            {/* Overlay */}
            <div className="bg-white p-6 rounded-lg border-2 border-orange-200 md:col-span-2">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  overlay
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Overlay Template</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Arka plan görseli üzerine ayarlanabilir opak katman ile merkezi metin. overlayOpacity değeri ile opacity kontrolü.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1 md:columns-2">
                <li>✓ Background image tam genişlik</li>
                <li>✓ Özelleştirilebilir overlay opacity (0-100)</li>
                <li>✓ Centered text layout</li>
                <li>✓ Dinamik text color (light/dark/auto)</li>
              </ul>
            </div>
          </div>

          {/* Shared Features */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Tüm Template'lerde Ortak Özellikler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-700">
              <div>
                <h4 className="font-semibold mb-2">İçerik</h4>
                <ul className="space-y-1">
                  <li>• Subtitle (küçük üst başlık)</li>
                  <li>• Title (ana başlık)</li>
                  <li>• Description (açıklama metni)</li>
                  <li>• CTA Button (link ile)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Özelleştirme</h4>
                <ul className="space-y-1">
                  <li>• Text Color: light / dark / auto</li>
                  <li>• Button Style: primary / secondary / outline</li>
                  <li>• Alt Text (SEO için)</li>
                  <li>• Background Image (opsiyonel)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Slider Özellikleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-700">
              <div>
                <h4 className="font-semibold mb-2">Auto-play</h4>
                <p>5 saniyede bir otomatik geçiş yapar</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Navigation</h4>
                <p>Ok tuşları ile manuel geçiş + Dots indicator</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Animations</h4>
                <p>Fade + Slide geçiş efektleri (1000ms)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
  render: () => null,
};
