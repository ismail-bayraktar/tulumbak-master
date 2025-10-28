import { assets } from "../assets/assets.js";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import BaklavaLogo from "./BaklavaLogo.jsx";

/**
 * ModernNavbar - Enhanced navigation with scroll effects and hero section integration
 *
 * Features:
 * - Transparent to solid transition on scroll
 * - Modern glassmorphism effect
 * - Better mobile responsiveness
 * - Enhanced accessibility
 * - Hero section integration
 */
const ModernNavbar = ({ heroSectionHeight = 90 }) => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

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

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

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

  const navLinkClasses = `
    relative flex flex-col items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-200
    ${scrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-200'}
    group
  `;

  const navLinkActiveClasses = `
    ${scrolled ? 'text-red-600' : 'text-white'}
  `;

  return (
    <>
      <nav className={navbarClasses} role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 transform transition-transform duration-200 hover:scale-105"
              aria-label="Tulumbak Ana Sayfa"
            >
              <BaklavaLogo className="w-8 h-8 lg:w-10 lg:h-10" />
              <span className={`text-xl lg:text-2xl font-bold prata-regular ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Tulumbak
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ''}`
                }
                end
              >
                <p>ANA SAYFA</p>
                <hr className={`w-0 border-none h-[2px] transition-all duration-300 group-hover:w-8 ${
                  scrolled ? 'bg-red-600' : 'bg-white'
                }`} />
              </NavLink>

              <NavLink
                to="/collection"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ''}`
                }
              >
                <p>BAKLAVALAR</p>
                <hr className={`w-0 border-none h-[2px] transition-all duration-300 group-hover:w-8 ${
                  scrolled ? 'bg-red-600' : 'bg-white'
                }`} />
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ''}`
                }
              >
                <p>LEZZET DÜKKANIMIZ</p>
                <hr className={`w-0 border-none h-[2px] transition-all duration-300 group-hover:w-8 ${
                  scrolled ? 'bg-red-600' : 'bg-white'
                }`} />
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ''}`
                }
              >
                <p>SİPARİŞ</p>
                <hr className={`w-0 border-none h-[2px] transition-all duration-300 group-hover:w-8 ${
                  scrolled ? 'bg-red-600' : 'bg-white'
                }`} />
              </NavLink>

              {/* Special Occasions */}
              <NavLink
                to="/special-occasions"
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ''}`
                }
              >
                <p>ÖZEL GÜNLER</p>
                <hr className={`w-0 border-none h-[2px] transition-all duration-300 group-hover:w-8 ${
                  scrolled ? 'bg-red-600' : 'bg-white'
                }`} />
              </NavLink>
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
                aria-label="Search products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Profile */}
              <div className="relative group">
                <button
                  onClick={() => token ? null : navigate("/login")}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    scrolled
                      ? 'hover:bg-gray-100 text-gray-700'
                      : 'hover:bg-white/20 text-white'
                  }`}
                  aria-label="User account"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {token && (
                  <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                        onClick={() => setVisible(false)}
                      >
                        Siparişlerim
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition-all duration-200 ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/20 text-white'
                }`}
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-full lg:hidden transition-all duration-200 ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/20 text-white'
                }`}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
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
                aria-label="Close mobile menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="flex-1 overflow-y-auto">
              <div className="py-2">
                <Link
                  to="/"
                  className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  ANA SAYFA
                </Link>
                <Link
                  to="/collection"
                  className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  BAKLAVALAR
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  LEZZET DÜKKANIMIZ
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  SİPARİŞ
                </Link>
                <Link
                  to="/special-occasions"
                  className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  ÖZEL GÜNLER
                </Link>
              </div>

              {token && (
                <div className="border-t border-gray-200 py-2">
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Siparişlerim
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-gray-900 hover:text-red-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Sepet ({getCartCount()})</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

ModernNavbar.propTypes = {
  heroSectionHeight: PropTypes.number // Height percentage of hero section for scroll calculations
};

export default ModernNavbar;