'use client';

import { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import Title from '../shared/Title';
import ProductCard from '../shared/ProductCard';

export default function LatestCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await productAPI.getAll();
        if (response.data.success && response.data.data) {
          // İlk 10 ürünü al (en yeni ürünler)
          const latestProducts = response.data.data.products.slice(0, 10);
          setProducts(latestProducts);
        }
      } catch (error) {
        console.error('Latest products yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
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
      <div className="text-center py-8 text-3xl">
        <Title primaryText="EN TAZE" secondaryText="SEÇİMLER" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-800">
          Doğanın en lezzetli hediyeleri olan sağlıklı atıştırmalıklar keşfetmeye hazır olun. Her biri taptaze ve doğal, tam size göre!
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
