import { useState, useEffect, useMemo } from 'react';
import { blogPosts } from '../assets/assets';

/**
 * useBlog - Custom hook for blog data management
 *
 * Features:
 * - Blog posts filtering and searching
 * - Category management
 * - Pagination
 * - Post metadata
 * - Loading states
 */
export const useBlog = (options = {}) => {
  const {
    initialCategory = 'all',
    initialSearch = '',
    postsPerPage = 6,
    enablePagination = true
  } = options;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);

  // Simulate loading posts
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        setPosts(blogPosts);
        setLoading(false);
      } catch (err) {
        setError('Blog yazıları yüklenirken hata oluştu');
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(posts.map(post => post.category))];
    return uniqueCategories.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'Tüm Kategoriler' : cat,
      count: cat === 'all' ? posts.length : posts.filter(post => post.category === cat).length
    }));
  }, [posts]);

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [posts, category, search]);

  // Pagination
  const paginatedPosts = useMemo(() => {
    if (!enablePagination) return filteredPosts;

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage, postsPerPage, enablePagination]);

  const pagination = useMemo(() => {
    if (!enablePagination) return null;

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      currentPage,
      totalPages,
      hasNextPage,
      hasPrevPage,
      totalPosts: filteredPosts.length,
      postsPerPage,
      nextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
      prevPage: () => setCurrentPage(prev => Math.max(prev - 1, 1)),
      goToPage: (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    };
  }, [filteredPosts.length, currentPage, postsPerPage, enablePagination]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, search]);

  // Get post by slug
  const getPostBySlug = (slug) => {
    return posts.find(post => post.slug === slug);
  };

  // Get related posts
  const getRelatedPosts = (currentPost, limit = 3) => {
    return posts
      .filter(post =>
        post.id !== currentPost.id &&
        (post.category === currentPost.category || post.author === currentPost.author)
      )
      .slice(0, limit);
  };

  // Get popular posts
  const getPopularPosts = (limit = 5) => {
    // Simulate popular posts (in real app, this would be based on views/likes)
    return posts.slice(0, limit);
  };

  // Get recent posts
  const getRecentPosts = (limit = 5) => {
    return posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Search functionality
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  // Category functionality
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setCategory('all');
    setSearch('');
    setCurrentPage(1);
  };

  return {
    // Data
    posts: filteredPosts,
    paginatedPosts,
    categories,

    // Loading states
    loading,
    error,

    // Pagination
    pagination,

    // Current filters
    category,
    search,

    // Actions
    handleSearch,
    handleCategoryChange,
    clearFilters,
    setCurrentPage,

    // Utilities
    getPostBySlug,
    getRelatedPosts,
    getPopularPosts,
    getRecentPosts,

    // Stats
    totalPosts: filteredPosts.length,
    hasPosts: filteredPosts.length > 0
  };
};

/**
 * useBlogPost - Custom hook for individual blog post
 */
export const useBlogPost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    const timer = setTimeout(() => {
      try {
        const foundPost = blogPosts.find(p => p.slug === slug);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Blog yazısı bulunamadı');
        }
        setLoading(false);
      } catch (err) {
        setError('Blog yazısı yüklenirken hata oluştu');
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [slug]);

  // Get related posts
  const relatedPosts = post ? blogPosts
    .filter(p =>
      p.id !== post.id &&
      (p.category === post.category || p.author === post.author)
    )
    .slice(0, 3) : [];

  return {
    post,
    relatedPosts,
    loading,
    error,
    notFound: !loading && !post && !error
  };
};

export default useBlog;