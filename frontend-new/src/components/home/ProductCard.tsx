'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.sizePrices[0]?.price || product.basePrice;
  const priceInTL = displayPrice / 100;
  const imageUrl = product.image[0] || '/images/placeholder-product.jpg';

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
            <span className="text-neutral-400 text-sm">Ürün Görseli</span>
          </div>
          {product.bestseller && (
            <Badge className="absolute top-2 right-2 bg-orange-500">
              Çok Satan
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">
            {priceInTL.toFixed(2)} ₺
          </span>
          {product.sizePrices.length > 1 && (
            <span className="text-xs text-neutral-500">
              ({product.sizePrices[0].size}g)
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product._id}`} className="w-full">
          <Button className="w-full" variant="outline">
            <ShoppingCart size={18} className="mr-2" />
            İncele
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
