import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { blogPosts } from '../assets/assets';

/**
 * BlogSection - Blog posts display component for homepage
 *
 * Features:
 * - Blog post cards with images
 * - Category filtering
 * - Load more functionality
 * - Responsive grid layout
 * - Modern design with hover effects
 */
const BlogSection = ({
  title = "Tulumbak Blog",
  subtitle = "Lezzetli tarifler ve baklava kültürü hakkında her şey",
  showHeader = true,
  maxPosts = 3,
  showLoadMore = true,
  variant = "default" // 'default' | 'compact' | 'featured'
}) => {
  const [visiblePosts, setVisiblePosts] = useState(maxPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(blogPosts.map(post => post.category))];

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const BlogCard = ({ post, variant = 'default' }) => {
    if (variant === 'compact') {
      return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="flex">
            <div className="w-32 h-24 flex-shrink-0">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 flex-1">
              <span className="text-xs text-red-600 font-medium uppercase tracking-wide">
                {post.category}
              </span>
              <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 hover:text-red-600 transition-colors">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <span>{post.author}</span>
                <span className="mx-1">•</span>
                <span>{formatDate(post.date)}</span>
                <span className="mx-1">•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'featured') {
      return (
        <div className="relative group">
          <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs rounded-full font-medium mb-2">
                {post.category}
              </span>
              <h3 className="text-xl font-bold text-white line-clamp-2">
                <Link to={`/blog/${post.slug}`} className="hover:text-red-200 transition-colors">
                  {post.title}
                </Link>
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium">{post.author}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.date)}</span>
            </div>
            <span>{post.readTime}</span>
          </div>
        </div>
      );
    }

    // Default variant
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs rounded-full font-medium">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <span className="font-medium">{post.author}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.date)}</span>
            </div>
            <span>{post.readTime}</span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm transition-colors group"
          >
            Devamını Oku
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        )}

        {/* Category Filter */}
        {variant === 'default' && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className={`
          ${variant === 'compact'
            ? 'space-y-4 max-w-4xl mx-auto'
            : variant === 'featured'
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-8'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          }
        `}>
          {displayedPosts.map((post) => (
            <BlogCard key={post.id} post={post} variant={variant} />
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && visiblePosts < filteredPosts.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Daha Fazla Yükle
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* View All Link */}
        {variant !== 'default' && (
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Tüm Yazıları Görüntüle
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* No Posts */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz blog yazısı bulunmuyor</h3>
            <p className="text-gray-600">Bu kategoride yayınlanmış yazı bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    readTime: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'compact', 'featured'])
};

BlogSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showHeader: PropTypes.bool,
  maxPosts: PropTypes.number,
  showLoadMore: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'compact', 'featured'])
};

export default BlogSection;