import { create } from 'zustand';
import { ProductState, Product, ProductListResponse } from '@/types/product';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  search: '',
  showSearch: false,

  setProducts: (products: Product[]) => set({ products }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setSearch: (search: string) => set({ search }),
  setShowSearch: (showSearch: boolean) => set({ showSearch }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<ProductListResponse>(
        API_ENDPOINTS.PRODUCTS.LIST
      );

      if (response.data.success && response.data.data) {
        set({
          products: response.data.data.products,
          loading: false
        });
      } else {
        set({
          error: response.data.message || 'Ürünler yüklenemedi',
          loading: false
        });
      }
    } catch (error: unknown) {
      console.error('Fetch products error:', error);
      set({
        error: 'Ürünler yüklenirken bir hata oluştu.',
        loading: false
      });
    }
  },
}));
