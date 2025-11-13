export interface SizePrice {
  size: string;
  price: number;
  _id?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  sizePrices: SizePrice[];
  category: string;
  subCategory?: string;
  bestseller?: boolean;
  image: string[];
  date?: string;
  stock?: number;
}

export interface ProductListResponse {
  success: boolean;
  data?: {
    products: Product[];
    total?: number;
  };
  message?: string;
}

export interface ProductDetailResponse {
  success: boolean;
  data?: Product;
  message?: string;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  search: string;
  showSearch: boolean;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearch: (search: string) => void;
  setShowSearch: (show: boolean) => void;
  fetchProducts: () => Promise<void>;
}
