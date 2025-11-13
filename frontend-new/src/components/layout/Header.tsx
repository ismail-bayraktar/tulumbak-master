'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { getCartCount } = useCartStore();
  const { search, setSearch, setShowSearch, showSearch } = useProductStore();

  const cartCount = getCartCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setShowSearch(true);
      window.location.href = `/collection?search=${encodeURIComponent(search)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white py-2 px-4 text-center text-sm">
        <p>Ücretsiz Kargo - 1000 TL ve Üzeri Siparişlerde</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-neutral-900">TULUMBAK</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="hover:text-neutral-600 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/collection" className="hover:text-neutral-600 transition-colors">
              Ürünler
            </Link>
            <Link href="/about" className="hover:text-neutral-600 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/contact" className="hover:text-neutral-600 transition-colors">
              İletişim
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-neutral-600 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-neutral-600 transition-colors" aria-label="User menu">
                    <User size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Siparişlerim</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profilim</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hover:text-neutral-600 transition-colors">
                <User size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative hover:text-neutral-600 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <Input
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Ara</Button>
          </form>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="hover:text-neutral-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/collection"
              className="hover:text-neutral-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ürünler
            </Link>
            <Link
              href="/about"
              className="hover:text-neutral-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className="hover:text-neutral-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              İletişim
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
