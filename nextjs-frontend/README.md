# Product Info Grid Component

A clean, minimalist Product Info Grid component built with Next.js 14 (App Router) and TailwindCSS for e-commerce product detail pages.

## Features

- ✅ **Responsive Design**: 2x2 grid on desktop, 1 column on mobile
- ✅ **Clean & Minimalist**: White backgrounds, light borders, rounded corners
- ✅ **Color-Coded Icons**: Context-aware icon colors based on information type
- ✅ **Accessible**: Full ARIA support and semantic HTML
- ✅ **TypeScript**: Type-safe interfaces and props
- ✅ **Dynamic Data**: Easily customizable via props
- ✅ **Subtle Interactions**: Smooth hover effects and transitions

## Live Demo

Run the development server and navigate to `http://localhost:3000` to see the component in action.

```bash
npm run dev
```

## Component API

### ProductInfoItem Interface

```typescript
interface ProductInfoItem {
  icon: 'AlertTriangle' | 'Leaf' | 'Clock' | 'Box';
  label: string;
  value: string;
  tone?: 'danger' | 'success' | 'info' | 'warning';
}
```

### ProductInfoGrid Props

```typescript
interface ProductInfoGridProps {
  items: ProductInfoItem[];
  className?: string;
}
```

## Icon Color Mapping

| Information Type | Icon | Default Color | Tone Override |
|-----------------|------|---------------|---------------|
| Alerjen Bilgileri | `AlertTriangle` | `text-red-500` | `danger` |
| Malzemeler | `Leaf` | `text-green-500` | `success` |
| Raf Ömrü / Tazeleme | `Clock` | `text-blue-500` | `info` |
| Saklama Koşulları | `Box` | `text-amber-500` | `warning` |

## Usage Example

```tsx
import ProductInfoGrid, { ProductInfoItem } from '@/components/ProductInfoGrid';

const productInfo: ProductInfoItem[] = [
  { 
    icon: 'AlertTriangle', 
    label: 'Alerjen Bilgileri', 
    value: 'Antep fıstığı',
    tone: 'danger'
  },
  { 
    icon: 'Leaf', 
    label: 'Malzemeler', 
    value: 'Fıstık, Şeker'
  },
  { 
    icon: 'Clock', 
    label: 'Raf Ömrü / Tazeleme', 
    value: '5 gün taze'
  },
  { 
    icon: 'Box', 
    label: 'Saklama Koşulları', 
    value: 'Kuru ve serin'
  },
];

export default function ProductPage() {
  return (
    <div>
      <ProductInfoGrid items={productInfo} />
    </div>
  );
}
```

## Customization

### Adding Custom Styling

You can pass additional CSS classes via the `className` prop:

```tsx
<ProductInfoGrid 
  items={productInfo} 
  className="mb-8 px-4"
/>
```

### Overriding Icon Colors

Use the `tone` prop to override default colors:

```tsx
{ 
  icon: 'AlertTriangle', 
  label: 'Önemli Uyarı', 
  value: 'Çocuklardan uzak tutun',
  tone: 'danger' // Forces red color
}
```

## Accessibility Features

- **ARIA Labels**: Proper `aria-labelledby` attributes for screen readers
- **Semantic HTML**: Uses appropriate `<section>`, `<h2>`, `<h3>`, and `<article>` tags
- **Keyboard Navigation**: Fully accessible via keyboard
- **Screen Reader Support**: Hidden headings provide context for assistive technologies

## Design Principles

1. **Minimalist Aesthetic**: Clean design that doesn't distract from product images
2. **Visual Hierarchy**: Clear distinction between labels and values
3. **Consistent Spacing**: Uniform padding and margins throughout
4. **Subtle Interactions**: Gentle hover effects enhance user experience without being intrusive
5. **Color Psychology**: Colors intuitively convey information type and importance

## Technical Implementation

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS utility classes
- **Icons**: Lucide React icon library
- **Type Safety**: Full TypeScript implementation
- **Responsive**: Mobile-first responsive design

## File Structure

```
nextjs-frontend/
├── app/
│   ├── globals.css          # TailwindCSS imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Demo page
├── components/
│   └── ProductInfoGrid.tsx  # Main component
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
