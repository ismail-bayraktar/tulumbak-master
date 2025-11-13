'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { products, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find((p) => p._id === productId);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    if (product && product.sizePrices.length > 0 && !selectedSize) {
      setSelectedSize(String(product.sizePrices[0].size));
    }
  }, [product, selectedSize]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h1>
        <Button onClick={() => router.push('/collection')}>
          Ürünlere Geri Dön
        </Button>
      </div>
    );
  }

  const selectedSizePrice = product.sizePrices.find(
    (sp) => String(sp.size) === selectedSize
  );
  const price = selectedSizePrice ? selectedSizePrice.price : product.basePrice;
  const priceInTL = price / 100;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Lütfen bir boyut seçin');
      return;
    }
    addToCart(product._id, selectedSize);
    toast.success('Ürün sepete eklendi');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square mb-4 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-neutral-400">Ürün Görseli</span>
            </div>
            {product.bestseller && (
              <Badge className="absolute top-4 right-4 bg-orange-500">
                Çok Satan
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.image.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.image.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square bg-neutral-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
                      ? 'border-orange-500'
                      : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-neutral-600">(24 değerlendirme)</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-orange-600">
              {priceInTL.toFixed(2)} ₺
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              KDV Dahil
            </p>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Açıklama</h3>
            <p className="text-neutral-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Size Selection */}
          {product.sizePrices.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Boyut Seçin</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.sizePrices.map((sizePrice) => (
                  <button
                    key={sizePrice._id || String(sizePrice.size)}
                    onClick={() => setSelectedSize(String(sizePrice.size))}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      selectedSize === String(sizePrice.size)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold">{sizePrice.size}g</div>
                    <div className="text-sm text-neutral-600">
                      {(sizePrice.price / 100).toFixed(2)} ₺
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
            {product.freshType && (
              <div>
                <p className="text-sm text-neutral-600">Tazelik</p>
                <p className="font-medium capitalize">{product.freshType}</p>
              </div>
            )}
            {product.packaging && (
              <div>
                <p className="text-sm text-neutral-600">Paketleme</p>
                <p className="font-medium capitalize">{product.packaging}</p>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!selectedSize}
          >
            <ShoppingCart size={20} className="mr-2" />
            Sepete Ekle
          </Button>

          {/* Delivery Info */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Ücretsiz Kargo:</strong> 1000 TL ve üzeri siparişlerde
            </p>
            <p className="text-sm text-green-800 mt-1">
              <strong>Aynı Gün Teslimat:</strong> Saat 14:00'a kadar verilen siparişlerde
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
