import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { assets } from '../assets/assets';

/**
 * PaymentMethods - Enhanced payment methods selection component
 *
 * Features:
 * - Multiple payment options
 * - Bank information display
 * - Credit card form
 * - Security badges
 * - Modern UI with animations
 */
const PaymentMethods = ({
  method,
  setMethod,
  bankInfo,
  onSubmitHandler,
  isSubmitting,
  isFormValid
}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [showCardForm, setShowCardForm] = useState(false);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    // Format card number
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
      return;
    }

    // Format CVV
    if (name === 'cvv') {
      setCardDetails(prev => ({ ...prev, [name]: value.slice(0, 3) }));
      return;
    }

    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const paymentMethods = [
    {
      id: 'HAVALE/EFT',
      name: 'Havale / EFT',
      description: 'Banka hesabımıza havale ile ödeme',
      icon: '💰',
      fee: 0,
      processingTime: '1-2 iş günü'
    },
    {
      id: 'KAPIDA',
      name: 'Kapıda Ödeme',
      description: 'Teslimat sırasında nakit ödeme',
      icon: '💵',
      fee: 10,
      processingTime: 'Anında'
    },
    {
      id: 'paytr',
      name: 'Kredi/Banka Kartı',
      description: 'Güvenli online ödeme',
      icon: '💳',
      fee: 0,
      processingTime: 'Anında'
    }
  ];

  const renderPaymentContent = () => {
    switch (method) {
      case 'HAVALE/EFT':
        return bankInfo ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Havale / EFT Bilgileri
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Hesap Adı:</span>
                <span className="font-medium">{bankInfo.accountName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Banka:</span>
                <span className="font-medium">{bankInfo.bankName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">IBAN:</span>
                <span className="font-mono text-xs">{bankInfo.iban}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                <strong>Önemli:</strong> Havale açıklamasına sipariş numaranızı yazmayı unutmayınız. Ödemeniz kontrol edildikten sonra siparişiniz işleme alınacaktır.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">Banka bilgileri yükleniyor...</p>
          </div>
        );

      case 'KAPIDA':
        return (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-semibold text-gray-900">Kapıda Ödeme</h4>
            </div>
            <div className="space-y-2 text-sm text-orange-800">
              <p>• Siparişinizi teslim alırken nakit ödeme yapabilirsiniz</p>
              <p>• Kapıda ödeme için <span className="font-bold">10₺</span> hizmet bedeli uygulanır</p>
              <p>• Kuryelerimiz tam para üstü bulundurma zorundadır</p>
            </div>
          </div>
        );

      case 'paytr':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h4 className="font-semibold text-gray-900">Güvenli Ödeme</h4>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır.
              </p>

              <div className="flex items-center justify-center space-x-4 py-3">
                <img src={assets.stripe_logo} alt="Stripe" className="h-8 opacity-60" />
                <img src={assets.razorpay_logo} alt="Razorpay" className="h-8 opacity-60" />
              </div>
            </div>

            {showCardForm && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Kart Bilgileri</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardDetails.cardName}
                      onChange={handleCardInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      placeholder="Ad Soyad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ay</label>
                      <select
                        name="expiryMonth"
                        value={cardDetails.expiryMonth}
                        onChange={handleCardInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">AA</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label>
                      <select
                        name="expiryYear"
                        value={cardDetails.expiryYear}
                        onChange={handleCardInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">YY</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year.toString().slice(-2)}>
                              {year.toString().slice(-2)}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white pl-8 py-8">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Ödeme Yöntemi</h2>

        {/* Payment Methods Selection */}
        <div className="space-y-3 mb-6">
          {paymentMethods.map((paymentMethod) => (
            <label
              key={paymentMethod.id}
              className={`
                flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${method === paymentMethod.id
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={paymentMethod.id}
                checked={method === paymentMethod.id}
                onChange={() => {
                  setMethod(paymentMethod.id);
                  if (paymentMethod.id === 'paytr') {
                    setShowCardForm(true);
                  }
                }}
                className="w-4 h-4 text-red-600 focus:ring-red-500"
              />

              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{paymentMethod.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{paymentMethod.name}</div>
                    <div className="text-sm text-gray-500">{paymentMethod.description}</div>
                  </div>
                </div>

                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span className="mr-4">İşlem Süresi: {paymentMethod.processingTime}</span>
                  {paymentMethod.fee > 0 && (
                    <span className="text-orange-600 font-medium">
                      +{paymentMethod.fee}₺ hizmet bedeli
                    </span>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Selected Payment Method Details */}
        {renderPaymentContent()}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            type="submit"
            onClick={onSubmitHandler}
            disabled={!isFormValid || isSubmitting}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200
              ${isFormValid && !isSubmitting
                ? 'bg-red-600 hover:bg-red-700 transform hover:scale-[1.02] shadow-lg'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </div>
            ) : (
              `Siparişi Tamamla • ${method === 'KAPIDA' ? '(10₺ ek)' : ''}`
            )}
          </button>

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Güvenli Ödeme
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hızlı Teslimat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentMethods.propTypes = {
  method: PropTypes.string.isRequired,
  setMethod: PropTypes.func.isRequired,
  bankInfo: PropTypes.object,
  onSubmitHandler: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  isFormValid: PropTypes.bool.isRequired
};

export default PaymentMethods;