'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import SmartSearchBar from '../shared/SmartSearchBar';

interface NavbarProps {
  heroSectionHeight?: number;
}

export default function Navbar({ heroSectionHeight = 90 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * (heroSectionHeight / 100);
      setScrolled(scrollPosition > heroHeight * 0.3);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroSectionHeight]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
    ${scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
      : 'bg-transparent'
    }
  `;

  const navLinkClasses = (isActive: boolean) => `
    relative flex flex-col items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-200
    ${scrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-200'}
    ${isActive ? (scrolled ? 'text-red-600' : 'text-white') : ''}
    group
  `;

  const navItems = [
    { href: '/', label: 'ANA SAYFA' },
    { href: '/urunler', label: 'BAKLAVALAR' },
    { href: '/hakkimizda', label: 'LEZZET DÜKKANIMIZ' },
    { href: '/iletisim', label: 'SİPARİŞ' },
    { href: '/ozel-gunler', label: 'ÖZEL GÜNLER' },
  ];

  return (
    <>
      <nav className={navbarClasses} role="navigation" aria-label="Ana navigasyon">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 transform transition-transform duration-200 hover:scale-105"
              aria-label="Tulumbak Ana Sayfa"
            >
              <div className={`text-2xl ${scrolled ? 'text-red-600' : 'text-white'}`}>
                🥮
              </div>
              <span className={`text-xl lg:text-2xl font-bold prata-regular ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Tulumbak
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navLinkClasses(isActive)}
                  >
                    <p>{item.label}</p>
                    <hr className={`w-0 border-none h-[2px] transition-all duration-300 group-hover:w-8 ${
                      scrolled ? 'bg-red-600' : 'bg-white'
                    }`} />
                  </Link>
                );
              })}
            </ul>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/20 text-white'
                }`}
                aria-label="Ürün ara"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Profile */}
              <Link
                href="/giris"
                className={`p-2 rounded-full transition-all duration-200 ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/20 text-white'
                }`}
                aria-label="Kullanıcı hesabı"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <Link
                href="/sepet"
                className={`relative p-2 rounded-full transition-all duration-200 ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/20 text-white'
                }`}
                aria-label="Alışveriş sepeti"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-full lg:hidden transition-all duration-200 ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/20 text-white'
                }`}
                aria-label="Mobil menüyü aç/kapat"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        />
        <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Menü</span>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Mobil menüyü kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="flex-1 overflow-y-auto">
              <div className="py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/sepet"
                className="flex items-center space-x-2 text-gray-900 hover:text-red-600 transition-colors"
                onClick={closeMobileMenu}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Sepet (0)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump */}
      <div className="h-16 lg:h-20" />

      {/* Smart Search Modal */}
      <SmartSearchBar isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
