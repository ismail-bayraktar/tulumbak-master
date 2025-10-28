import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * DeliveryInfo - Enhanced delivery information form component
 *
 * Features:
 * - Form validation
 * - Real-time error handling
 * - Zone-based delivery fee calculation
 * - Time slot selection
 * - Modern UI with better UX
 */
const DeliveryInfo = ({
  formData,
  onChangeHandler,
  zones,
  deliveryZone,
  setDeliveryZone,
  deliveryFee,
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
  showNewsletter,
  setShowNewsletter,
  currentStep,
  setCurrentStep,
  navigate
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    const rules = {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Geçerli bir e-posta adresi giriniz'
      },
      firstName: {
        required: true,
        minLength: 2,
        message: 'Ad en az 2 karakter olmalıdır'
      },
      lastName: {
        required: true,
        minLength: 2,
        message: 'Soyad en az 2 karakter olmalıdır'
      },
      street: {
        required: true,
        minLength: 5,
        message: 'Adres en az 5 karakter olmalıdır'
      },
      phone: {
        required: true,
        pattern: /^5[0-9]{9}$/,
        message: 'Geçerli bir telefon numarası giriniz (5XX XXX XX XX)'
      },
      zipcode: {
        required: true,
        pattern: /^[0-9]{5}$/,
        message: 'Geçerli bir posta kodu giriniz (5 haneli)'
      },
      state: {
        required: true,
        minLength: 2,
        message: 'Mahalle en az 2 karakter olmalıdır'
      }
    };

    const rule = rules[name];
    if (!rule) return '';

    if (rule.required && !value.trim()) {
      return 'Bu alan zorunludur';
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    return '';
  };

  // Handle field changes with validation
  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    const finalValue = type === 'checkbox' ? checked : value;

    // Special handling for phone field
    if (name === 'phone' && value.startsWith('0')) {
      return;
    }

    onChangeHandler(event);

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, finalValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (event) => {
    const { name } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, event.target.value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Check if form is valid
  const isFormValid = () => {
    const requiredFields = ['email', 'firstName', 'lastName', 'street', 'phone', 'zipcode', 'state'];
    if (zones.length > 0 && !deliveryZone) return false;

    return requiredFields.every(field => {
      const error = validateField(field, formData[field]);
      return !error;
    });
  };

  return (
    <div className="bg-[#F5F4F1] py-12 px-8">
      <div className="max-w-2xl mt-16">
        {/* Progress Breadcrumb */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <div className="flex gap-2 text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="hover:text-black transition-colors"
            >
              Sepet
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setCurrentStep('info')}
              className={`${currentStep === 'info' ? 'text-black font-medium' : 'hover:text-black'} transition-colors`}
            >
              Bilgiler & Teslimat
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setCurrentStep('payment')}
              className={`${currentStep === 'payment' ? 'text-black font-medium' : 'hover:text-black'} transition-colors`}
              disabled={!isFormValid()}
            >
              Ödeme
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">İletişim Bilgileri</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi *
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ornek@email.com"
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                checked={showNewsletter}
                onChange={(e) => setShowNewsletter(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="newsletter" className="ml-2 text-sm text-gray-600">
                Haberler ve özel tekliflerden beni haberdar et
              </label>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Teslimat Adresi</h2>

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad *
                </label>
                <input
                  required
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Adınız"
                />
                {errors.firstName && touched.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad *
                </label>
                <input
                  required
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Soyadınız"
                />
                {errors.lastName && touched.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Adres *
              </label>
              <input
                required
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                  errors.street ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mahalle, Sokak, Bina No, Daire No"
              />
              {errors.street && touched.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
              )}
            </div>

            {/* District and Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  Mahalle *
                </label>
                <input
                  required
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mahalle"
                />
                {errors.state && touched.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Posta Kodu *
                </label>
                <input
                  required
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.zipcode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="35000"
                  maxLength={5}
                />
                {errors.zipcode && touched.zipcode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipcode}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  +90
                </div>
                <input
                  required
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={`w-full pl-16 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="5XX XXX XX XX"
                  maxLength={10}
                />
              </div>
              {errors.phone && touched.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* City (Fixed for İzmir) */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Şehir
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value="İzmir"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
                readOnly
              />
              <p className="mt-1 text-sm text-gray-500">Şu an için sadece İzmir'e teslimat yapılmaktadır</p>
            </div>

            {/* Delivery Zone Selection */}
            {zones.length > 0 && (
              <div>
                <label htmlFor="deliveryZone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Bölgesi *
                </label>
                <select
                  id="deliveryZone"
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                >
                  <option value="">Lütfen teslimat bölgesi seçiniz...</option>
                  {zones.map((zone) => (
                    <option key={zone._id} value={zone._id}>
                      {zone.district} - Teslimat Ücreti: {zone.fee}₺
                    </option>
                  ))}
                </select>
                {deliveryFee > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    Seçilen bölge için teslimat ücreti: <span className="font-medium text-red-600">{deliveryFee}₺</span>
                  </p>
                )}
              </div>
            )}

            {/* Time Slot Selection */}
            {timeSlots.length > 0 && deliveryZone && (
              <div>
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Saati *
                </label>
                <select
                  id="timeSlot"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                >
                  <option value="">Lütfen teslimat saati seçiniz...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot._id} value={slot._id}>
                      {slot.label} ({slot.start} - {slot.end})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Teslimat Bilgileri</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Siparişleriniz hazırlanır size SMS ile bilgilendirme yapılacaktır</li>
                <li>• Kurye yola çıktığında takip linki gönderilecektir</li>
                <li>• Aynı gün teslimat için saat 14:00'a kadar sipariş veriniz</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DeliveryInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  zones: PropTypes.array.isRequired,
  deliveryZone: PropTypes.string,
  setDeliveryZone: PropTypes.func.isRequired,
  deliveryFee: PropTypes.number.isRequired,
  timeSlots: PropTypes.array.isRequired,
  selectedTimeSlot: PropTypes.string,
  setSelectedTimeSlot: PropTypes.func.isRequired,
  showNewsletter: PropTypes.bool.isRequired,
  setShowNewsletter: PropTypes.func.isRequired,
  currentStep: PropTypes.string.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};

export default DeliveryInfo;