'use client';

import { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import Title from '../shared/Title';
import ProductCard from '../shared/ProductCard';

export default function BestSeller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await productAPI.getAll();
        if (response.data.success && response.data.data) {
          // En çok satan ürünleri filtrele (bestseller: true)
          const bestSellers = response.data.data.products
            .filter((product: Product) => product.bestseller)
            .slice(0, 5);
          setProducts(bestSellers);
        }
      } catch (error) {
        console.error('Best sellers yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="my-10">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title primaryText="EN ÇOK" secondaryText="TERCİH EDİLENLER" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Tulumbak'ın en çok tercih edilen İzmir baklavaları: ince hamur, bol fıstık, dengeli şerbet. Favorilerini keşfet!
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            showBadge={true}
            badgeText="EN ÇOK SATAN"
          />
        ))}
      </div>
    </div>
  );
}
