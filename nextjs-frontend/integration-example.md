# Integration Guide

## Using ProductInfoGrid in Existing Frontend

To integrate the ProductInfoGrid component into your existing Vite frontend project:

### 1. Copy Component Files

Copy these files to your existing frontend project:
```
nextjs-frontend/components/ProductInfoGrid.tsx → frontend/src/components/ProductInfoGrid.tsx
```

### 2. Install Dependencies

In your frontend directory, run:
```bash
npm install lucide-react
```

### 3. Update Component Import

Modify the import paths to work with your Vite setup:

```tsx
// Before (Next.js)
import ProductInfoGrid, { ProductInfoItem } from '@/components/ProductInfoGrid';

// After (Vite)
import ProductInfoGrid, { ProductInfoItem } from './components/ProductInfoGrid';
```

### 4. Integration Example

Here's how to integrate it into an existing product page:

```jsx
import React from 'react';
import ProductInfoGrid, { ProductInfoItem } from './components/ProductInfoGrid';

const ProductDetail = ({ product }) => {
  const productInfo = [
    { 
      icon: 'AlertTriangle', 
      label: 'Alerjen Bilgileri', 
      value: product.allergens || 'Bulunamadı',
      tone: 'danger'
    },
    { 
      icon: 'Leaf', 
      label: 'Malzemeler', 
      value: product.ingredients || 'Bulunamadı'
    },
    { 
      icon: 'Clock', 
      label: 'Raf Ömrü / Tazeleme', 
      value: product.shelfLife || 'Bulunamadı'
    },
    { 
      icon: 'Box', 
      label: 'Saklama Koşulları', 
      value: product.storage || 'Bulunamadı'
    },
  ];

  return (
    <div className="product-detail">
      {/* Existing product content */}
      
      {/* Add ProductInfoGrid */}
      <div className="product-info-section my-6">
        <h2 className="text-lg font-semibold mb-4">Ürün Bilgileri</h2>
        <ProductInfoGrid items={productInfo} />
      </div>
    </div>
  );
};

export default ProductDetail;
```

### 5. TailwindCSS Configuration

Ensure your `tailwind.config.js` includes the component paths:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of config
}
```

### 6. CSS Import

Make sure TailwindCSS is imported in your main CSS file:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Benefits of Integration

1. **Consistent Design**: Maintains the same clean, minimalist aesthetic across your e-commerce site
2. **Responsive**: Automatically adapts to mobile and desktop views
3. **Accessible**: Includes proper ARIA labels for screen readers
4. **Type Safe**: Full TypeScript support for better development experience
5. **Reusable**: Can be used across multiple product pages

## Customization Options

### Custom Colors
You can customize the colors by modifying the `toneColors` object in the component:

```tsx
const toneColors = {
  danger: 'text-red-600',
  success: 'text-green-600',
  info: 'text-blue-600',
  warning: 'text-amber-600',
};
```

### Custom Icons
Add new icons by extending the `IconMap` and `IconType`:

```tsx
import { AlertTriangle, Leaf, Clock, Box, Star } from 'lucide-react';

type IconType = 'AlertTriangle' | 'Leaf' | 'Clock' | 'Box' | 'Star';

const IconMap = {
  AlertTriangle,
  Leaf,
  Clock,
  Box,
  Star,
};
```

### Custom Styling
Override default styles with custom CSS classes:

```jsx
<ProductInfoGrid 
  items={productInfo} 
  className="custom-product-grid"
/>
```

Then add custom styles:

```css
.custom-product-grid {
  /* Your custom styles */
}
