import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ProductReviews - Product reviews and ratings component
 *
 * Features:
- Star rating display
- Customer reviews list
- Review filtering and sorting
- Review statistics
- Add review functionality
- Responsive design
*/
const ProductReviews = ({ productId, showAddReview = true }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'helpful', 'rating-high', 'rating-low'
  const [filterByRating, setFilterByRating] = useState('all'); // 'all', 5, 4, 3, 2, 1

  // Mock data for demo (real API integration required)
  const mockReviews = [
    {
      id: 1,
      productId: 'product1',
      user: {
        name: 'Ayşe Yılmaz',
        avatar: 'A'
      },
      rating: 5,
      title: 'Harika bir lezzet!',
      content: 'Bu baklava gerçekten çok lezzetliydi. Fıstıklar taze ve bol, hamuru çok güzel. Kesinlikle tavsiye ederim. Paketleme de özenli yapılmış.',
      date: '2024-01-15T10:30:00Z',
      helpful: 15,
      verified: true,
      images: []
    },
    {
      id: 2,
      productId: 'product1',
      user: {
        name: 'Mehmet Demir',
        avatar: 'M'
      },
      rating: 4,
      title: 'İyi ama',
      content: 'Lezzet olarak gayet başarılı. Sadece fiyatı biraz yüksek olabilir. Servis hızlı ve ambalaj güzeldi. Tekrar sipariş verebilirim.',
      date: '2024-01-12T14:20:00Z',
      helpful: 8,
      verified: true,
      images: []
    },
    {
      id: 3,
      productId: 'product1',
      user: {
        name: 'Zeynep Kaya',
        avatar: 'Z'
      },
      rating: 5,
      title: 'Mükemmel!',
      content: 'İzmir\'in en iyi baklavacısı. Her zaman taze ve lezzetli. Hediye paketi seçeneği de harika. Misafirler için çok ideal.',
      date: '2024-01-10T09:15:00Z',
      helpful: 22,
      verified: true,
      images: []
    },
    {
      id: 4,
      productId: 'product1',
      user: {
        name: 'Ali Vural',
        avatar: 'A'
      },
      rating: 3,
      title: 'İdare edilebilir',
      content: 'Genel olarak memnun kaldım ama birkaç küçük sorun yaşadık. Lezzet güzel ancak fiyat-performans oranı biraz yüksek.',
      date: '2024-01-08T16:45:00Z',
      helpful: 3,
      verified: false,
      images: []
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      setTimeout(() => {
        const productReviews = mockReviews.filter(review => review.productId === productId);
        setReviews(productReviews);
        setLoading(false);
      }, 500);

      // Real API call when backend is ready:
      // const response = await axios.get(`${backendUrl}/api/reviews/product/${productId}`);
      // setReviews(response.data.reviews);
    } catch (err) {
      setError('Yorumlar yüklenirken hata oluştu.');
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!token) {
      // Redirect to login
      return;
    }

    try {
      // Simulate API call
      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ));

      // Real API call:
      // await axios.post(`${backendUrl}/api/reviews/${reviewId}/helpful`);
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setShowAddReviewForm(false);
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (filterByRating !== 'all') {
      filtered = filtered.filter(review => review.rating === filterByRating);
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date) - new Date(a.date);
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return sorted;
  };

  const calculateRatingStats = () => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = (total / reviews.length).toFixed(1);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    return {
      averageRating: parseFloat(average),
      totalReviews: reviews.length,
      ratingDistribution: distribution
    };
  };

  const renderStars = (rating, size = 'normal') => {
    const starSizes = {
      small: 'w-4 h-4',
      normal: 'w-5 h-5',
      large: 'w-6 h-6'
    };

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starSizes[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 2.058 0l2.418 1.828a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-2.418.059a1 1 0 00-.95.69h-3.462a1 1 0 00-.95.69l-2.418 1.828a1 1 0 01-1.059.058 1 1 0 01-.95-.69l-2.418-1.828a1 1 0 00-1.059-.058 1 1 0 00.95.69l2.418 1.828a1 1 0 001.059-.058z" />
          </svg>
        ))}
      </div>
    );
  };

  const stats = calculateRatingStats();
  const filteredReviews = getFilteredAndSortedReviews();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">Yorumlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <span className="text-4xl font-bold text-gray-900">{stats.averageRating}</span>
              {renderStars(Math.round(stats.averageRating), 'large')}
            </div>
            <p className="text-gray-600 mt-2">{stats.totalReviews} değerlendirme</p>
            <div className="flex items-center justify-center md:justify-start mt-4 space-x-2">
              <span className="text-green-600 text-sm">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414l-2.586 2.586a1 1 0 00-1.414 0z" clipRule="evenodd" />
                </svg>
                %90 tavsiye eder
              </span>
            </div>
          </div>

          {/* Rating Distribution */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Değerlendirme Dağılımı</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating];
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm text-gray-600">{rating}</span>
                      {renderStars(rating, 'small')}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sırala</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="recent">En Yeni</option>
                <option value="helpful">En Yardımcı</option>
                <option value="rating-high">En Yüksek Puan</option>
                <option value="rating-low">En Düşük Puan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtre</label>
              <select
                value={filterByRating}
                onChange={(e) => setFilterByRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tüm Puanlar</option>
                <option value="5">5 Yıldız</option>
                <option value="4">4 Yıldız</option>
                <option value="3">3 Yıldız</option>
                <option value="2">2 Yıldız</option>
                <option value="1">1 Yıldız</option>
              </select>
            </div>
          </div>

          {showAddReview && token && (
            <button
              onClick={() => setShowAddReviewForm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Yorum Yaz
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Yorum Bulunmuyor</h3>
            <p className="text-gray-600">Bu ürün için henüz yapılmış yorum bulunmuyor.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold">
                    {review.user.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                      {review.verified && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745.723 3.066 3.066 0 001.745-.723 3.066 3.066 0 001.745.723 3.066 3.066 0 00-3.066 0zm3.066 0A1.45 1.45 0 011.45 1.45 1.45 1.45 0 011.45-1.45 1.45 1.45 0 01-1.45 1.45z" clipRule="evenodd" />
                          </svg>
                          Doğrulanmış
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                {review.title && (
                  <h3 className="font-semibold text-gray-900">{review.title}</h3>
                )}
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.784 0h9.128a2 2 0 011.784 0v9.128a2 2 0 01-2.828 0l-9.128-9.128a2 2 0 01-.784 0H4.764a2 2 0 01-2-2.828V12a2 2 0 012-2.828l9.128-9.128a2 2 0 012.828 0h9.128z" />
                    </svg>
                    <span>Yardımcı ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Review Form Modal - Commented out for now */}
      {/* {showAddReviewForm && (
        <ReviewForm
          productId={productId}
          onClose={() => setShowAddReviewForm(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )} */}
    </div>
  );
};

ProductReviews.propTypes = {
  productId: PropTypes.string.isRequired,
  showAddReview: PropTypes.bool
};

export default ProductReviews;