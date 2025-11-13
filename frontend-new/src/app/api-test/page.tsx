'use client';

import { useEffect, useState } from 'react';
import { productAPI, sliderAPI, settingsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import type { Product, Slider } from '@/lib/types';

export default function ApiTestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [maintenance, setMaintenance] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Test Product API
        const productsRes = await productAPI.getAll();
        if (productsRes.data.success && productsRes.data.data) {
          setProducts(productsRes.data.data.products.slice(0, 5)); // İlk 5 ürün
        }

        // Test Slider API
        const slidersRes = await sliderAPI.getActive();
        if (slidersRes.data.success && slidersRes.data.data) {
          setSliders(slidersRes.data.data.sliders);
        }

        // Test Settings API
        const maintenanceRes = await settingsAPI.checkMaintenance();
        if (maintenanceRes.data.success && maintenanceRes.data.data) {
          setMaintenance(maintenanceRes.data.data.maintenanceMode);
        }

        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'API bağlantı hatası');
        console.error('API Test Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">API Test Çalışıyor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-red-600">❌ API Bağlantı Hatası</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold mb-2">Hata Mesajı:</p>
            <p className="text-red-600 font-mono text-sm">{error}</p>
          </div>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Kontrol Listesi:</strong>
            </p>
            <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 space-y-1">
              <li>Backend server çalışıyor mu? (Port 4001)</li>
              <li>MongoDB bağlantısı aktif mi?</li>
              <li>CORS ayarları doğru mu?</li>
              <li>.env.local dosyası doğru mu?</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ✅ CHECKPOINT 2 - API TEST BAŞARILI
        </h1>

        {/* System Status */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">Backend Status</p>
            <p className="text-2xl font-bold text-green-600">🟢 Online</p>
          </div>
          <div className={`border rounded-lg p-4 ${maintenance ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <p className={`font-semibold ${maintenance ? 'text-red-800' : 'text-green-800'}`}>Maintenance Mode</p>
            <p className={`text-2xl font-bold ${maintenance ? 'text-red-600' : 'text-green-600'}`}>
              {maintenance ? '🔴 Aktif' : '🟢 Kapalı'}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-semibold">Total Products</p>
            <p className="text-2xl font-bold text-blue-600">{products.length} ürün</p>
          </div>
        </div>

        {/* Products Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📦 Products API Test</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-green-600">
                      {product.variants[0] && formatPrice(product.variants[0].price)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${product.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock ? 'Stokta' : 'Tükendi'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">Ürün bulunamadı</p>
            )}
          </div>
        </div>

        {/* Sliders Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🎨 Sliders API Test</h2>
          <div className="space-y-2">
            {sliders.length > 0 ? (
              sliders.map((slider) => (
                <div key={slider._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{slider.title}</h3>
                    <p className="text-sm text-gray-600">{slider.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${slider.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {slider.active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Slider bulunamadı</p>
            )}
          </div>
        </div>

        {/* API Details */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3">🔧 API Configuration</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-semibold">Backend URL:</dt>
              <dd className="font-mono text-blue-600">{process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">Axios Timeout:</dt>
              <dd>15 seconds</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">JWT Auth:</dt>
              <dd className="text-green-600">✅ Configured</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">CORS:</dt>
              <dd className="text-green-600">✅ WithCredentials</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:underline">← Ana Sayfaya Dön</a>
        </div>
      </div>
    </main>
  );
}
