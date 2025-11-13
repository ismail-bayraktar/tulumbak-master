import ShopLayout from '@/components/layout/ShopLayout';

export default function LayoutTestPage() {
  return (
    <ShopLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ✅ CHECKPOINT 3 - Layout Test
              </h1>
              <p className="text-xl text-gray-600">
                Navbar, Footer ve Smart SearchBar başarıyla çalışıyor!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Navbar Features */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
                <div className="text-3xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Navbar Özellikleri
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Scroll efektli transparent-to-solid geçiş
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Desktop ve mobile responsive menü
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Aktif sayfa vurgulama
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Sepet badge sistemi
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Kullanıcı dropdown menüsü
                  </li>
                </ul>
              </div>

              {/* SearchBar Features */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                <div className="text-3xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Smart SearchBar
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Gerçek zamanlı ürün arama
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Klavye navigasyonu (↑↓ Enter Esc)
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Popüler aramalar önerileri
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Son aramalar geçmişi
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Debounced API çağrıları (300ms)
                  </li>
                </ul>
              </div>

              {/* Footer Features */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                <div className="text-3xl mb-4">📋</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Footer Özellikleri
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">✓</span>
                    4 kolonlu grid yapısı
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">✓</span>
                    Sosyal medya linkleri
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">✓</span>
                    İletişim bilgileri
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">✓</span>
                    Hızlı linkler
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">✓</span>
                    Responsive tasarım
                  </li>
                </ul>
              </div>

              {/* Layout Features */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
                <div className="text-3xl mb-4">🏗️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ShopLayout Wrapper
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Navbar + Content + Footer yapısı
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Hero section height ayarı
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Footer göster/gizle kontrolü
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Min-height scroll koruması
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Flexbox sticky footer
                  </li>
                </ul>
              </div>
            </div>

            {/* Test Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🧪 Test Senaryoları
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm font-bold">
                    1
                  </span>
                  <div>
                    <strong>Scroll Testi:</strong> Sayfa aşağı kaydırıldığında navbar'ın transparan'dan beyaza geçişini kontrol edin
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm font-bold">
                    2
                  </span>
                  <div>
                    <strong>Search Testi:</strong> Arama ikonuna tıklayıp "baklava" yazarak gerçek zamanlı arama çalışsın
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm font-bold">
                    3
                  </span>
                  <div>
                    <strong>Klavye Navigasyonu:</strong> Arama modalda ↑↓ tuşları ile gezinip Enter ile seçim yapın
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm font-bold">
                    4
                  </span>
                  <div>
                    <strong>Mobile Menu:</strong> Ekranı daraltıp hamburger menünün açılıp kapandığını test edin
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm font-bold">
                    5
                  </span>
                  <div>
                    <strong>Footer Links:</strong> Footer'daki tüm linklerin çalıştığını kontrol edin
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Test Content */}
            <div className="mt-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center">
              <p className="text-lg font-semibold mb-2">
                👇 Aşağı kaydırarak navbar geçişini test edin
              </p>
              <p className="text-sm opacity-90">
                Navbar transparan'dan beyaza dönüşecek
              </p>
            </div>

            {/* Spacer for scroll test */}
            <div className="h-screen"></div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
