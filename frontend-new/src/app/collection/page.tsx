'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/stores/productStore';
import { ProductCard } from '@/components/home/ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const { products, loading, fetchProducts, search, setSearch } = useProductStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (products.length === 0 && !loading) {
      fetchProducts();
    }
  }, [products.length, loading, fetchProducts]);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams, setSearch]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.sizePrices[0]?.price || a.basePrice) - (b.sizePrices[0]?.price || b.basePrice);
        case 'price-high':
          return (b.sizePrices[0]?.price || b.basePrice) - (a.sizePrices[0]?.price || a.basePrice);
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'newest':
        default:
          const dateA = a.date ? (typeof a.date === 'number' ? a.date : new Date(a.date).getTime()) : 0;
          const dateB = b.date ? (typeof b.date === 'number' ? b.date : new Date(b.date).getTime()) : 0;
          return dateB - dateA;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ürünlerimiz</h1>
        <p className="text-neutral-600">
          {filteredProducts.length} ürün bulundu
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <Input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} className="mr-2" />
          Filtrele
        </Button>

        {/* Category Filter */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.filter(c => c !== 'all').map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sırala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">En Yeni</SelectItem>
              <SelectItem value="name">İsme Göre</SelectItem>
              <SelectItem value="price-low">Fiyat (Düşük)</SelectItem>
              <SelectItem value="price-high">Fiyat (Yüksek)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-lg" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-neutral-600 mb-4">
            Aradığınız kriterlere uygun ürün bulunamadı
          </p>
          <Button onClick={() => { setSearch(''); setSelectedCategory('all'); }}>
            Filtreleri Temizle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
