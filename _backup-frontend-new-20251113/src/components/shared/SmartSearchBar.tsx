'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { productAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { debounce } from '@/lib/utils';
import Image from 'next/image';

interface SmartSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartSearchBar({ isOpen, onClose }: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState(['Fıstıklı Baklava', 'Cevizli Baklava', 'Kuru Baklava', 'Taze Baklava']);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search function
  const searchProducts = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await productAPI.search(searchQuery);
        if (response.data.success && response.data.data) {
          setResults(response.data.data.products.slice(0, 6)); // İlk 6 sonuç
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    searchProducts(value);
  };

  // Save search to recent searches
  const saveToRecentSearches = (search: string) => {
    if (!search.trim()) return;

    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  // Handle search submission
  const handleSearch = (searchTerm?: string) => {
    const finalQuery = searchTerm || query;
    if (!finalQuery.trim()) return;

    saveToRecentSearches(finalQuery);
    router.push(`/urunler?arama=${encodeURIComponent(finalQuery)}`);
    onClose();
    setQuery('');
    setResults([]);
  };

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    router.push(`/urun/${productId}`);
    onClose();
    setQuery('');
    setResults([]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleProductSelect(results[selectedIndex]._id);
          } else {
            handleSearch();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
        {/* Search Input */}
        <div className="relative p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Ürün ara... (örn: Fıstıklı Baklava)"
              className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:outline-none focus:ring-0"
            />
            {query && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-gray-100 rounded">↑↓</kbd>
            <span>Gezin</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd>
            <span>Seç</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>
            <span>Kapat</span>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
          )}

          {!loading && query && results.length > 0 && (
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-3 px-2">
                {results.length} sonuç bulundu
              </p>
              <div className="space-y-2">
                {results.map((product, index) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductSelect(product._id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-left ${
                      index === selectedIndex
                        ? 'bg-red-50 border-2 border-red-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {product.description}
                      </p>
                      <p className="text-sm font-semibold text-red-600 mt-1">
                        {product.variants[0]?.price ? `₺${product.variants[0].price}` : 'Fiyat bilgisi yok'}
                      </p>
                    </div>
                    {!product.stock && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                        Tükendi
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleSearch()}
                className="w-full mt-4 px-4 py-3 text-center text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Tüm sonuçları gör ({results.length}+)
              </button>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="text-gray-400 mb-3">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Sonuç bulunamadı
              </p>
              <p className="text-sm text-gray-600">
                "{query}" için ürün bulunamadı. Farklı bir arama deneyin.
              </p>
            </div>
          )}

          {!query && (
            <div className="p-6 space-y-6">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Popüler Aramalar
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Son Aramalar
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                      >
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {search}
                        </span>
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
