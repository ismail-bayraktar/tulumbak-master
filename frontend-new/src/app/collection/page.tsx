'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { ProductCard } from '@/components/home/ProductCard';
import { FilterSidebar, FilterState } from '@/components/collection/FilterSidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

function CollectionContent() {
  const searchParams = useSearchParams();
  const { products, loading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categoryId: null,
    sizes: [],
    priceRange: [0, 5000],
    personCounts: [],
    freshType: 'all',
    inStockOnly: false,
  });

  useEffect(() => {
    if (products.length === 0 && !loading) {
      fetchProducts();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [products.length, loading, fetchProducts, categories.length, fetchCategories]);

  // URL'den kategori parametresini al
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categories.length > 0) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setFilters(prev => ({ ...prev, categoryId: category._id }));
      }
    }
  }, [searchParams, categories]);

  // Ürünleri filtrele
  const filteredProducts = products
    .filter(p => {
      // Kategori filtresi
      if (filters.categoryId && p.category !== filters.categoryId) return false;

      // Gramaj filtresi
      if (filters.sizes.length > 0) {
        const hasMatchingSize = p.sizes.some(size => filters.sizes.includes(size));
        if (!hasMatchingSize) return false;
      }

      // Fiyat aralığı filtresi
      const productPrice = p.sizePrices[0]?.price || p.basePrice * 100;
      const priceInTL = productPrice / 100;
      if (priceInTL < filters.priceRange[0] || priceInTL > filters.priceRange[1]) return false;

      // Kişi sayısı filtresi
      if (filters.personCounts.length > 0) {
        const hasMatchingPersonCount = p.personCounts.some(count =>
          filters.personCounts.includes(count)
        );
        if (!hasMatchingPersonCount) return false;
      }

      // Taze/Kuru filtresi
      if (filters.freshType !== 'all' && p.freshType !== filters.freshType) return false;

      // Stok filtresi
      if (filters.inStockOnly && p.stock === 0) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.sizePrices[0]?.price || a.basePrice * 100) - (b.sizePrices[0]?.price || b.basePrice * 100);
        case 'price-high':
          return (b.sizePrices[0]?.price || b.basePrice * 100) - (a.sizePrices[0]?.price || a.basePrice * 100);
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

      <div className="flex gap-8">
        {/* Desktop Sidebar - Sol tarafta sabit */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            isMobile={false}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar - Sıralama ve Mobile Filtre Butonu */}
          <div className="flex items-center justify-between mb-6">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filtrele
            </Button>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] ml-auto">
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

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[400px] rounded-lg" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-600 mb-4">
                Aradığınız kriterlere uygun ürün bulunamadı
              </p>
              <Button
                onClick={() =>
                  setFilters({
                    categoryId: null,
                    sizes: [],
                    priceRange: [0, 5000],
                    personCounts: [],
                    freshType: 'all',
                    inStockOnly: false,
                  })
                }
              >
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Filtreler</SheetTitle>
          </SheetHeader>
          <FilterSidebar
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setMobileFiltersOpen(false);
            }}
            onClose={() => setMobileFiltersOpen(false)}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    }>
      <CollectionContent />
    </Suspense>
  );
}
