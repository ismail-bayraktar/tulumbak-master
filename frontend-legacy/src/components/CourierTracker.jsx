import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CourierTracker - Real-time courier location tracking
 *
 * Features:
- Map visualization (placeholder)
- Courier information
- ETA and distance
- Contact options
- Real-time updates
 */
const CourierTracker = ({ courier, location, showRealTime = false, eta, distance }) => {
  const [expanded, setExpanded] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);

  const handleCallCourier = async () => {
    setCallInProgress(true);
    try {
      // Simulate call
      window.location.href = `tel:${courier.phone}`;
      setTimeout(() => setCallInProgress(false), 1000);
    } catch (error) {
      setCallInProgress(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Merhaba ${courier.name}, benim siparişimle ilgili bilgi almak istiyorum. Takip numarası: #ABC123XYZ`;
    window.open(`https://wa.me/${courier.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getVehicleIcon = (vehicle) => {
    const icons = {
      'motorcycle': '🏍️',
      'car': '🚗',
      'bicycle': '🚲'
    };
    return icons[vehicle] || '🚚';
  };

  const getETAColor = (eta) => {
    if (eta <= 15) return 'text-green-600 bg-green-50';
    if (eta <= 30) return 'text-yellow-600 bg-yellow-50';
    if (eta <= 45) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getVehicleIcon(courier.vehicle)}</span>
            <div>
              <h3 className="font-semibold">Kurye Bilgileri</h3>
              <p className="text-green-100 text-sm">{courier.name}</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Real-time Status */}
      {showRealTime && location && (
        <div className="p-4 bg-green-50 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-700 font-medium text-sm">Gerçek Zaman Takip Aktif</span>
            </div>
            <span className="text-xs text-green-600">
              Son güncelleme: {new Date(location.lastUpdate).toLocaleTimeString('tr-TR')}
            </span>
          </div>
        </div>
      )}

      {/* ETA Information */}
      {eta && (
        <div className={`p-4 border-b ${getETAColor(eta)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Tahmini Varış Süresi</p>
              <p className="text-2xl font-bold">{eta} dakika</p>
            </div>
            {distance && (
              <div className="text-right">
                <p className="text-sm opacity-75">Mesafe</p>
                <p className="text-lg font-semibold">{distance} km</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="relative h-48 bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Harita Gösterimi</p>
            <p className="text-sm text-gray-400 mt-1">Kurye konumu burada gösterilecek</p>
          </div>
        </div>

        {/* Location Pins */}
        {showRealTime && location && (
          <>
            <div className="absolute top-4 left-4">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
              </div>
              <div className="bg-white px-2 py-1 rounded text-xs font-medium shadow-lg mt-1">
                Müşteri
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <div className="relative">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <div className="bg-white px-2 py-1 rounded text-xs font-medium shadow-lg">
                {courier.name}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Courier Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Kurye Bilgileri</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ad Soyad:</span>
                <span className="font-medium">{courier.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefon:</span>
                <span className="font-medium">{courier.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Araç:</span>
                <span className="font-medium">
                  {courier.vehicle === 'motorcycle' ? 'Motosiklet' :
                   courier.vehicle === 'car' ? 'Araba' : 'Bisiklet'}
                </span>
              </div>
              {courier.plateNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Plaka:</span>
                  <span className="font-medium">{courier.plateNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Options */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">İletişim Seçenekleri</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCallCourier}
                disabled={callInProgress}
                className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {callInProgress ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Ara
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                WhatsApp
              </button>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-semibold text-yellow-800 mb-1 text-sm">Teslimat Notu</h4>
            <p className="text-xs text-yellow-700">
              Kuryeye ulaşmak isterseniz yukarıdaki iletişim seçeneklerini kullanabilirsiniz.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

CourierTracker.propTypes = {
  courier: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    vehicle: PropTypes.string.isRequired,
    plateNumber: PropTypes.string
  }).isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    lastUpdate: PropTypes.string
  }),
  showRealTime: PropTypes.bool,
  eta: PropTypes.number,
  distance: PropTypes.number
};

export default CourierTracker;