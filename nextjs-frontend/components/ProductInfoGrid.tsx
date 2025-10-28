import React from 'react';
import { AlertTriangle, Leaf, Clock, Box, LucideIcon } from 'lucide-react';

// Define the icon type mapping
type IconType = 'AlertTriangle' | 'Leaf' | 'Clock' | 'Box';

// Define the tone type for color coding
type ToneType = 'danger' | 'success' | 'info' | 'warning';

// Define the product info item interface
export interface ProductInfoItem {
  icon: IconType;
  label: string;
  value: string;
  tone?: ToneType;
}

// Define the component props interface
interface ProductInfoGridProps {
  items: ProductInfoItem[];
  className?: string;
}

// Icon mapping component
const IconMap: Record<IconType, LucideIcon> = {
  AlertTriangle,
  Leaf,
  Clock,
  Box,
};

// Color mapping for different tones
const toneColors: Record<ToneType, string> = {
  danger: 'text-red-500',
  success: 'text-green-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

// Default color mapping based on icon type
const defaultIconColors: Record<IconType, string> = {
  AlertTriangle: 'text-red-500',
  Leaf: 'text-green-500',
  Clock: 'text-blue-500',
  Box: 'text-amber-500',
};

const ProductInfoGrid: React.FC<ProductInfoGridProps> = ({ items, className = '' }) => {
  const getIconColor = (icon: IconType, tone?: ToneType): string => {
    if (tone) {
      return toneColors[tone];
    }
    return defaultIconColors[icon];
  };

  return (
    <section 
      className={`w-full ${className}`}
      aria-labelledby="product-info-heading"
    >
      <h2 id="product-info-heading" className="sr-only">
        Ürün Bilgileri
      </h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item, index) => {
          const IconComponent = IconMap[item.icon];
          const iconColor = getIconColor(item.icon, item.tone);
          
          return (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              role="article"
              aria-labelledby={`info-label-${index}`}
            >
              <div className={`flex-shrink-0 ${iconColor}`}>
                <IconComponent 
                  size={20} 
                  aria-hidden="true"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 
                  id={`info-label-${index}`}
                  className="text-sm font-medium text-gray-900 mb-1"
                >
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600 break-words">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductInfoGrid;
