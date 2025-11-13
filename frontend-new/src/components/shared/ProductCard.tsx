'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
}

export default function ProductCard({ product, showBadge, badgeText }: ProductCardProps) {
  const price = product.variants?.[0]?.price || product.basePrice || 0;
  const imageUrl = product.images?.[0] || '/placeholder.png';

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/urun/${product._id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

          {showBadge && badgeText && (
            <span className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold z-10">
              {badgeText}
            </span>
          )}

          {product.labels && product.labels.length > 0 && !showBadge && (
            <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
              {product.labels[0]}
            </span>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/urun/${product._id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₺{price}
          </span>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-600 ml-1">4.9</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Sepete ekleme fonksiyonu burada olacak
          }}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
