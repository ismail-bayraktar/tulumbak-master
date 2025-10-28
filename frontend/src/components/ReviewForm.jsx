import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ReviewForm - Add customer review form component
 *
 * Features:
- Star rating input
- Review text input
- Image upload support
- Form validation
- Responsive design
- Success/error states
*/
const ReviewForm = ({ productId, onClose, onReviewSubmitted }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    setErrors(prev => ({ ...prev, rating: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle image upload logic here
    // For now, just store file names
    const imageNames = files.map(file => file.name);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageNames] }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Lütfen puan verin';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Yorum içeriği gereklidir';
    }

    if (formData.content.trim().length < 20) {
      newErrors.content = 'Yorum en az 20 karakter olmalıdır';
    }

    if (formData.content.trim().length > 1000) {
      newErrors.content = 'Yorum 1000 karakterden uzun olamaz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      const newReview = {
        id: Date.now(),
        productId,
        user: {
          name: 'Mevcut Kullanıcı',
          avatar: 'M'
        },
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        date: new Date().toISOString(),
        helpful: 0,
        verified: false,
        images: formData.images
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onReviewSubmitted(newReview);
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setFormData({
          rating: 0,
          title: '',
          content: '',
          images: []
        });
      }, 2000);

      // Real API call when backend is ready:
      // const response = await axios.post(
      //   `${backendUrl}/api/reviews`,
      //   { productId, ...formData },
      //   { headers: { token } }
      // );
      // onReviewSubmitted(response.data.review);

    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (interactive = true) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && handleStarClick(star)}
            disabled={!interactive}
            className={`transition-colors duration-200 ${
              interactive ? 'hover:scale-110' : ''
            }`}
          >
            <svg
              className={`w-8 h-8 ${
                star <= formData.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 2.058 0l2.418 1.828a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-2.418.059a1 1 0 00-.95.69h-3.462a1 1 0 00-.95.69l-2.418 1.828a1 1 0 01-1.059.058 1 1 0 00.95.69l2.418 1.828a1 1 0 001.059-.058z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Yorumunuz Gönderildi!</h3>
            <p className="text-gray-600">Değerlendirmeniz için teşekkürler.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Yorum Yaz</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puanlama <span className="text-red-500">*</span>
            </label>
            {renderStars()}
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Yorumunuzun başlığı"
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yorumunuz <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Bu ürün hakkındaki deneyimlerinizi paylaşın..."
              maxLength={1000}
            />
            <div className="mt-1 text-sm text-gray-500 text-right">
              {formData.content.length}/1000
            </div>
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğraflar (Opsiyonel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 01-1 9.9M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-600">
                  Fotoğraf eklemek için tıklayın
                </span>
              </label>

              {/* Uploaded Images Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(new Blob([image], { type: 'image/jpeg' }))}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Yorum Kuralları</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Dürüst ve yapıcı bir dil kullanın</li>
              <li>• Ürünle ilgili deneyimlerinizi paylaşın</li>
              <li>• Başkaların yorumlarınıza saygı gösterin</li>
              <li>• 100-1000 karakter arası uzunlukta olmalı</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gönderiliyor...
                </div>
              ) : (
                'Yorumu Gönder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReviewForm.propTypes = {
  productId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onReviewSubmitted: PropTypes.func.isRequired
};

export default ReviewForm;