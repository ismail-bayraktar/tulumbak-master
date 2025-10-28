import ProductInfoGrid, { ProductInfoItem } from '@/components/ProductInfoGrid';

// Sample data for demonstration
const sampleProductInfo: ProductInfoItem[] = [
  { 
    icon: 'AlertTriangle', 
    label: 'Alerjen Bilgileri', 
    value: 'Antep fıstığı',
    tone: 'danger'
  },
  { 
    icon: 'Leaf', 
    label: 'Malzemeler', 
    value: 'Fıstık, Şeker'
  },
  { 
    icon: 'Clock', 
    label: 'Raf Ömrü / Tazeleme', 
    value: '5 gün taze'
  },
  { 
    icon: 'Box', 
    label: 'Saklama Koşulları', 
    value: 'Kuru ve serin'
  },
];

// Additional sample data to test dynamic functionality
const additionalProductInfo: ProductInfoItem[] = [
  { 
    icon: 'Leaf', 
    label: 'Besin Değeri', 
    value: 'Protein: 15g, Yağ: 45g, Karbonhidrat: 30g'
  },
  { 
    icon: 'AlertTriangle', 
    label: 'Uyarılar', 
    value: 'Çocukların erişemeyeceği yerde saklayınız',
    tone: 'warning'
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Info Grid Component Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clean, minimalist product information grid component for e-commerce product detail pages.
            Responsive 2x2 grid on desktop, single column on mobile.
          </p>
        </header>

        {/* Product Detail Page Simulation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Image Placeholder */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🥜</div>
                <p className="text-gray-500">Ürün Görseli</p>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Antep Fıstığı Baklava
              </h2>
              <p className="text-gray-600 mb-6">
                Lezzetli Antep fıstığı ile hazırlanan geleneksel baklava. Taze malzemelerle 
                özenle üretilmektedir.
              </p>

              {/* Product Info Grid Component */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ürün Özellikleri
                </h3>
                <ProductInfoGrid items={sampleProductInfo} />
              </div>

              {/* Price and Add to Cart */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">₺189.99</span>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                    Stokta var
                  </span>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Additional Information Examples
          </h2>
          <ProductInfoGrid items={additionalProductInfo} />
        </div>

        {/* Component Features */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Component Features
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Responsive 2x2 grid on desktop, 1 column on mobile</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Clean, minimalist design with white backgrounds and subtle borders</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Color-coded icons based on information type</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Accessible markup with ARIA labels</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>TypeScript interfaces for type safety</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Subtle hover effects and smooth transitions</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
