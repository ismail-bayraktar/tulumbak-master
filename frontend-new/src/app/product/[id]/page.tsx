'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, Users, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductImageUrl } from '@/lib/utils/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { products, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  // Görsel URL (backend'den /uploads/... geliyor)
  const imageUrl = getProductImageUrl(product.image, selectedImage, '/assets/tulumba.png');

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Lütfen bir gramaj seçin');
      return;
    }
    if (product.stock === 0) {
      toast.error('Ürün stokta yok');
      return;
    }
    // Seçilen miktarda sepete ekle
    for (let i = 0; i < quantity; i++) {
      addToCart(product._id, selectedSize);
    }
    toast.success(`${quantity} adet ürün sepete eklendi`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square mb-4 bg-neutral-100 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.bestseller && (
                <Badge className="bg-orange-500">Çok Satan</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">Tükendi</Badge>
              )}
              {product.stock > 0 && product.stock < 10 && (
                <Badge className="bg-orange-500">Az Kaldı</Badge>
              )}
            </div>

            {/* Labels */}
            {product.labels && product.labels.length > 0 && (
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.labels.slice(0, 2).map((label, idx) => (
                  <Badge key={idx} className="bg-blue-600">{label}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.image && product.image.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.image.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square bg-neutral-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
                      ? 'border-orange-500'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Image
                    src={getProductImageUrl(product.image, idx, '/assets/tulumba.png')}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-neutral-600">{product.description}</p>
          </div>

          <Separator className="my-6" />

          {/* Size Selection with Dynamic Price */}
          {product.sizePrices.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Gramaj Seçin</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.sizePrices.map((sizePrice) => {
                  const isSelected = selectedSize === String(sizePrice.size);
                  const personCount = product.personCounts && product.personCounts.length > 0
                    ? product.personCounts[product.sizePrices.indexOf(sizePrice)]
                    : null;

                  return (
                    <button
                      key={sizePrice._id || String(sizePrice.size)}
                      onClick={() => setSelectedSize(String(sizePrice.size))}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 shadow-md'
                          : 'border-neutral-200 hover:border-orange-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="font-bold text-lg">{sizePrice.size}g</div>
                      {personCount && (
                        <div className="text-xs text-neutral-500 mb-1">{personCount} kişilik</div>
                      )}
                      <div className="text-orange-600 font-semibold">
                        {(sizePrice.price / 100).toFixed(2)} ₺
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Price Display */}
              {selectedSize && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Seçilen Fiyat:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {priceInTL.toFixed(2)} ₺
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">KDV Dahil</p>
                </div>
              )}
            </div>
          )}

          {/* Product Details */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-neutral-600">Ürün Tipi</span>
              <span className="font-medium capitalize">{product.freshType}</span>
            </div>
            {product.packaging && (
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-neutral-600">Paketleme</span>
                <span className="font-medium capitalize">{product.packaging}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-neutral-600">Stok Durumu</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} adet stokta` : 'Tükendi'}
              </span>
            </div>
            {product.shelfLife && (
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-neutral-600">Raf Ömrü</span>
                <span className="font-medium">{product.shelfLife}</span>
              </div>
            )}
          </div>

          {/* Quantity Selection & Add to Cart */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Miktar</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-neutral-300 rounded-lg hover:border-orange-500 transition-colors flex items-center justify-center font-bold"
                  type="button"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 h-10 text-center border-2 border-neutral-300 rounded-lg font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border-2 border-neutral-300 rounded-lg hover:border-orange-500 transition-colors flex items-center justify-center font-bold"
                  type="button"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
                {selectedSize && (
                  <span className="ml-auto text-neutral-600">
                    Toplam: <span className="font-bold text-orange-600">{(priceInTL * quantity).toFixed(2)} ₺</span>
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full h-12 text-base font-semibold"
              onClick={handleAddToCart}
              disabled={!selectedSize || product.stock === 0}
            >
              <ShoppingCart size={20} className="mr-2" />
              {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </Button>
          </div>

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
