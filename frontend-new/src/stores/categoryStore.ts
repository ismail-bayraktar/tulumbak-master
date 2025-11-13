import { create } from 'zustand';
import { CategoryState, Category, CategoryListResponse } from '@/types/category';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  selectedCategoryId: null,

  setCategories: (categories: Category[]) => set({ categories }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setSelectedCategoryId: (categoryId: string | null) => set({ selectedCategoryId: categoryId }),

  fetchCategories: async () => {
    set({ loading: true, error: null });

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      console.log('📂 [Category Store] Kategoriler çekiliyor...');
    }

    try {
      const response = await apiClient.get<CategoryListResponse>(
        API_ENDPOINTS.CATEGORIES.ACTIVE
      );

      if (isDev) {
        console.log('✅ [Category Store] Kategoriler başarıyla çekildi:', {
          adet: response.data.categories?.length,
          kategoriler: response.data.categories?.map(c => c.name)
        });
      }

      if (response.data.success && response.data.categories) {
        // Order'a göre sırala
        const sortedCategories = response.data.categories.sort((a, b) => a.order - b.order);

        set({
          categories: sortedCategories,
          loading: false
        });
      } else {
        set({
          error: response.data.message || 'Kategoriler yüklenemedi',
          loading: false
        });
      }
    } catch (error: unknown) {
      console.error('❌ [Category Store] Kategori çekme hatası:', error);
      set({
        error: 'Kategoriler yüklenirken bir hata oluştu.',
        loading: false
      });
    }
  },

  getCategoryById: (id: string) => {
    return get().categories.find(cat => cat._id === id);
  },

  getCategoryBySlug: (slug: string) => {
    return get().categories.find(cat => cat.slug === slug);
  },
}));
