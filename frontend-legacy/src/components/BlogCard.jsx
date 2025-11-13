import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * BlogCard - Individual blog post card component
 *
 * Features:
 * - Multiple display variants
 * - Responsive design
 * - Hover effects
 * - Author and date information
 * - Category badges
 */
const BlogCard = ({
  post,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showDate = true,
  showReadTime = true,
  className = ''
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tarih': 'bg-blue-100 text-blue-700',
      'Rehber': 'bg-green-100 text-green-700',
      'Kültür': 'bg-purple-100 text-purple-700',
      'Tarif': 'bg-orange-100 text-orange-700',
      'Haber': 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}>
        <div className="flex">
          <div className="w-32 h-24 flex-shrink-0">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 flex-1">
            {showCategory && (
              <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium mb-1 ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            )}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            {(showAuthor || showDate || showReadTime) && (
              <div className="flex items-center text-xs text-gray-500 mt-2 space-x-2">
                {showAuthor && <span>{post.author}</span>}
                {showAuthor && showDate && <span>•</span>}
                {showDate && <span>{formatDate(post.date)}</span>}
                {(showAuthor || showDate) && showReadTime && <span>•</span>}
                {showReadTime && <span>{post.readTime}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`relative group ${className}`}>
        <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {showCategory && (
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs rounded-full font-medium mb-2">
                {post.category}
              </span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white line-clamp-2">
              <Link to={`/blog/${post.slug}`} className="hover:text-red-200 transition-colors">
                {post.title}
              </Link>
            </h3>
          </div>
        </div>
        {(showAuthor || showDate || showReadTime) && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              {showAuthor && <span className="font-medium">{post.author}</span>}
              {showAuthor && showDate && <span>•</span>}
              {showDate && <span>{formatDate(post.date)}</span>}
            </div>
            {showReadTime && <span>{post.readTime}</span>}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}>
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 sm:h-full object-cover"
            />
          </div>
          <div className="p-6 sm:w-2/3">
            {showCategory && (
              <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium mb-3 ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            {(showAuthor || showDate || showReadTime) && (
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2">
                  {showAuthor && <span className="font-medium">{post.author}</span>}
                  {showAuthor && showDate && <span>•</span>}
                  {showDate && <span>{formatDate(post.date)}</span>}
                </div>
                {showReadTime && <span>{post.readTime}</span>
              </div>
            )}
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
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}>
      <div className="relative overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {showCategory && (
          <div className="absolute top-4 left-4">
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {(showAuthor || showDate || showReadTime) && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              {showAuthor && <span className="font-medium">{post.author}</span>}
              {showAuthor && showDate && <span>•</span>}
              {showDate && <span>{formatDate(post.date)}</span>}
            </div>
            {showReadTime && <span>{post.readTime}</span>
          </div>
        )}

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
  variant: PropTypes.oneOf(['default', 'compact', 'featured', 'horizontal']),
  showCategory: PropTypes.bool,
  showAuthor: PropTypes.bool,
  showDate: PropTypes.bool,
  showReadTime: PropTypes.bool,
  className: PropTypes.string
};

export default BlogCard;