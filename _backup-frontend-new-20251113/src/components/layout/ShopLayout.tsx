'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface ShopLayoutProps {
  children: ReactNode;
  heroSectionHeight?: number;
  showFooter?: boolean;
}

export default function ShopLayout({
  children,
  heroSectionHeight = 90,
  showFooter = true
}: ShopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar heroSectionHeight={heroSectionHeight} />

      <main className="flex-1">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
