import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

// Mock data helper
const createMockProduct = (overrides?: Partial<Product>): Product => ({
  _id: '1',
  name: 'Fıstıklı Baklava',
  description: 'Antep fıstığı ile hazırlanan geleneksel İzmir baklavamız. El açması yufka ile özenle hazırlanır.',
  basePrice: 450,
  image: ['/assets/tulumba.png'],
  category: {
    _id: 'cat1',
    name: 'Baklavalar',
    active: true,
    slug: 'baklavalar'
  },
  sizes: [250, 500, 1000, 2000],
  sizePrices: [
    { size: 250, price: 45000 },
    { size: 500, price: 85000 },
    { size: 1000, price: 160000 },
    { size: 2000, price: 300000 }
  ],
  personCounts: ['2-3', '5-6', '8-10', '12+'],
  freshType: 'taze',
  packaging: 'standart',
  giftWrap: true,
  labels: [],
  bestseller: false,
  stock: 50,
  date: Date.now(),
  ...overrides
});

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

// Variant 1: Normal Product (In Stock)
export const Default: Story = {
  args: {
    product: createMockProduct(),
  },
};

// Variant 2: Bestseller Product
export const Bestseller: Story = {
  args: {
    product: createMockProduct({
      name: 'Cevizli Baklava',
      description: 'Taze ceviz ile hazırlanan özel tarifimiz. En çok satan ürünümüz!',
      bestseller: true,
      labels: ['Popüler'],
      sizePrices: [
        { size: 250, price: 38000 },
        { size: 500, price: 72000 },
        { size: 1000, price: 135000 },
        { size: 2000, price: 250000 }
      ],
    }),
  },
};

// Variant 3: Low Stock
export const LowStock: Story = {
  args: {
    product: createMockProduct({
      name: 'Sütlü Nuriye',
      description: 'Sıcak sütle servis edilen efsane lezzetimiz. Tükenmeden sipariş verin!',
      stock: 5,
      labels: ['Yeni'],
      sizePrices: [
        { size: 250, price: 42000 },
        { size: 500, price: 80000 },
      ],
    }),
  },
};

// Variant 4: Out of Stock
export const OutOfStock: Story = {
  args: {
    product: createMockProduct({
      name: 'Burma Kadayıf',
      description: 'İnce tel kadayıf ile hazırlanan nefis tatlımız. Şu an tükenmiştir.',
      stock: 0,
      labels: ['Tükendi'],
    }),
  },
};

// Variant 5: Premium with Multiple Labels
export const Premium: Story = {
  args: {
    product: createMockProduct({
      name: 'Özel Karışık Baklava',
      description: 'Fıstık, ceviz ve fındık ile özenle hazırlanan premium baklava çeşitlerimiz. Hediye paketi dahildir.',
      bestseller: true,
      labels: ['Yeni', 'Premium', 'Özel'],
      packaging: 'özel',
      giftWrap: true,
      stock: 25,
      sizePrices: [
        { size: 500, price: 95000 },
        { size: 1000, price: 180000 },
        { size: 2000, price: 340000 }
      ],
    }),
  },
};

// Variant 6: Single Size Option
export const SingleSize: Story = {
  args: {
    product: createMockProduct({
      name: 'Şöbiyet',
      description: 'Kaymak dolgulu özel tatlımız. Sadece 250g porsiyonlarda sunulmaktadır.',
      sizes: [250],
      sizePrices: [
        { size: 250, price: 55000 }
      ],
      personCounts: ['2-3'],
      labels: ['Özel'],
    }),
  },
};

// Variant 7: Grid Display (Multiple Cards)
export const GridDisplay: Story = {
  decorators: [
    (Story) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl">
        <ProductCard product={createMockProduct()} />
        <ProductCard product={createMockProduct({ name: 'Havuç Dilimi', bestseller: true, labels: ['Popüler'] })} />
        <ProductCard product={createMockProduct({ name: 'Tulumba Tatlısı', stock: 8, labels: ['Yeni'] })} />
      </div>
    ),
  ],
  render: () => null,
};
