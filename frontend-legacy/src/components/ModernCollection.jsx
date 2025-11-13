import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import { assets } from '../assets/assets.js';
import Title from '../components/Title.jsx';
import ProductItem from '../components/ProductItem.jsx';
import { toast } from 'react-toastify';

const ModernCollection = () => {
  const { products, search, showSearch, addToCart } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Categories for filters
  const categories = [
    'Baklava',
    'Kadayıf',
    'Sütlü Tatlı',
    'Kuru Tatlı',
    'Möğürlü Tatlı',
    'Şerbetli Tatlı',
    'Özel Paket'
  ];

  // Product labels
  const labels = ['TAZE', 'ÖZEL', 'ÇOK SATAN', 'HEDİYE'];

  useEffect(() => {
    if (products.length > 0) {
      applyFilter();
      setLoading(false);
    }
  }, [products, category, search, showSearch, priceRange, selectedRating]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory(prev => prev.filter(item => item !== value));
    } else {
      setCategory(prev => [...prev, value]);
    }
  };

  const toggleLabel = (label) => {
    // Implement label filtering logic
    setCategory(prev => [...prev]);
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.includes(item.category)
      );
    }

    // Price range filter
    productsCopy = productsCopy.filter(item =>
      item.basePrice >= priceRange[0] && item.basePrice <= priceRange[1]
    );

    // Rating filter (mock data for demo)
    if (selectedRating > 0) {
      productsCopy = productsCopy.filter(item => {
        // Mock rating logic - in real app, this would come from product data
        return Math.random() * 2 + 3 >= selectedRating; // Random rating between 3-5
      });
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const sortProducts = () => {
    let filterProductsCopy = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        setFilterProducts(filterProductsCopy.sort((a, b) => a.basePrice - b.basePrice));
        break;
      case 'high-low':
        setFilterProducts(filterProductsCopy.sort((a, b) => b.basePrice - a.basePrice));
        break;
      case 'newest':
        setFilterProducts(filterProductsCopy.sort((a, b) => b._id.localeCompare(a._id)));
        break;
      case 'rating':
        setFilterProducts(filterProductsCopy.sort((a, b) => {
          // Mock rating sort - in real app, use actual rating data
          const ratingA = Math.random() * 2 + 3;
          const ratingB = Math.random() * 2 + 3;
          return ratingB - ratingA;
        }));
        break;
      default:
        applyFilter();
        break;
    }
  };

  const handleAddToCart = (productId) => {
    addToCart(productId, '1');
    toast.success('Ürün sepete eklendi!');
  };

  const clearFilters = () => {
    setCategory([]);
    setPriceRange([0, 1000]);
    setSelectedRating(0);
    setSortType('relevant');
  };

  const hasActiveFilters = category.length > 0 || selectedRating > 0 ||
    (priceRange[0] > 0 || priceRange[1] < 1000);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Tüm Lezzetlerimiz
        </h1>
        <p className="text-lg text-gray-600">
          İzmir'in en taze ve lezzetli baklava çeşitleri
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Modern Filter Sidebar */}
        <div className={`lg:w-80 ${showFilter ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filtreleri Göster
            </button>

            {/* Category Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Kategoriler</h4>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center cursor-pointer hover:text-red-600 transition-colors">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={category.includes(cat)}
                      onChange={toggleCategory}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700">{cat}</span>
                    <span className="ml-auto text-sm text-gray-500">
                      ({products.filter(p => p.category === cat).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Fiyat Aralığı</h4>
              <div className="px-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">₺{priceRange[0]}</span>
                  <span className="text-sm text-gray-600">₺{priceRange[1]}</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Değerlendirme</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                    className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                      selectedRating === rating ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {rating === 4 ? '4 ve üzeri' : `${rating} ve üzeri`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Labels */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Özellikler</h4>
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleLabel(label)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden flex items-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filtreler
                </button>

                {/* Results Count */}
                <span className="text-sm text-gray-600">
                  {filterProducts.length} ürün bulundu
                </span>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filtreler:</span>
                    {category.map((cat) => (
                      <span key={cat} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="relevant">Sıralama</option>
                  <option value="low-high">Fiyat: Düşükten Yükseğe</option>
                  <option value="high-low">Fiyat: Yüksekten Düşüğe</option>
                  <option value="newest">En Yeniler</option>
                  <option value="rating">En Yüksek Puan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {currentProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Bulunamadı</h3>
              <p className="text-gray-600 mb-4">Seçtiğiniz filtrelere uygun ürün bulunamadı.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {currentProducts.map((item, index) => (
                  viewMode === 'grid' ? (
                    <div key={item._id} className="group">
                      <ProductItem
                        key={index}
                        name={item.name}
                        id={item._id}
                        price={item.basePrice}
                        image={item.image}
                        freshType={item.freshType}
                        packaging={item.packaging}
                        giftWrap={item.giftWrap}
                        labels={item.labels}
                      />
                    </div>
                  ) : (
                    /* List View Component */
                    <div key={item._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                      <div className="flex gap-6">
                        <div className="w-32 h-32 flex-shrink-0">
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl font-bold text-gray-900">₺{item.basePrice}</span>
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm text-gray-600 ml-1">4.8</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Link
                              to={`/product/${item._id}`}
                              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              İncele
                            </Link>
                            <button
                              onClick={() => handleAddToCart(item._id)}
                              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Sepete Ekle
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === index + 1
                            ? 'bg-red-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernCollection;