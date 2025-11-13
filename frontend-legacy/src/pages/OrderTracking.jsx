import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import OrderTimeline from '../components/OrderTimeline';
import CourierTracker from '../components/CourierTracker';
import { assets } from '../assets/assets';

/**
 * OrderTracking - Comprehensive order tracking page
 *
 * Features:
 * - Real-time order status tracking
 * - Courier location tracking
 * - Order timeline visualization
 * - SMS notifications
 * - Customer support integration
 */
const OrderTracking = () => {
  const { backendUrl } = useContext(ShopContext);
  const { trackingId } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRealTimeTracking, setShowRealTimeTracking] = useState(false);
  const [courierLocation, setCourierLocation] = useState(null);

  // Mock data for demo (real API integration required)
  const mockOrderData = {
    orderId: "ORD123456",
    trackingId: trackingId || "ABC123XYZ",
    status: "delivering", // 'preparing', 'ready', 'picked_up', 'delivering', 'delivered'
    customer: {
      name: "Ahmet Yılmaz",
      phone: "+905321234567",
      email: "ahmet@example.com"
    },
    items: [
      {
        name: "Fıstıklı Baklava",
        size: "1 kg",
        quantity: 2,
        price: 150
      },
      {
        name: "Sütlü Tatlı",
        size: "500g",
        quantity: 1,
        price: 80
      }
    ],
    delivery: {
      address: "Bornova, Sanayi Mah. 1234 Sokak No:56 Daire:7",
      estimatedTime: "15:30",
      actualTime: null,
      fee: 15
    },
    payment: {
      method: "Kredi Kartı",
      status: "Paid",
      total: 395
    },
    courier: {
      name: "Mehmet Kaya",
      phone: "+905345678901",
      vehicle: "motorcycle",
      plate: "35 ABC 123"
    },
    timeline: [
      {
        id: 1,
        status: "preparing",
        title: "Sipariş Alındı",
        description: "Siparişiniz başarıyla alınmıştır",
        timestamp: "2024-01-20T10:30:00Z",
        completed: true,
        icon: "📋"
      },
      {
        id: 2,
        status: "preparing",
        title: "Hazırlanıyor",
        description: "Siparişiniz mutfakta hazırlanıyor",
        timestamp: "2024-01-20T10:35:00Z",
        completed: true,
        icon: "👨‍🍳"
      },
      {
        id: 3,
        status: "ready",
        title: "Hazır",
        description: "Siparişiniz hazır ve kurye bekliyor",
        timestamp: "2024-01-20T11:45:00Z",
        completed: true,
        icon: "✅"
      },
      {
        id: 4,
        status: "picked_up",
        title: "Kuryede",
        description: "Kurye siparişinizi teslim aldı",
        timestamp: "2024-01-20T12:00:00Z",
        completed: true,
        icon: "🚚"
      },
      {
        id: 5,
        status: "delivering",
        title: "Yolda",
        description: "Siparişiniz size geliyor",
        timestamp: "2024-01-20T12:15:00Z",
        completed: true,
        icon: "📍",
        estimatedArrival: "15:30"
      },
      {
        id: 6,
        status: "delivered",
        title: "Teslim Edildi",
        description: "Siparişiniz başarıyla teslim edildi",
        timestamp: null,
        completed: false,
        icon: "🎉"
      }
    ]
  };

  // Mock courier location data
  const mockCourierLocation = {
    lat: 38.4237,
    lng: 27.1428,
    lastUpdate: new Date().toISOString(),
    eta: 45, // minutes
    distance: 3.2 // km
  };

  useEffect(() => {
    fetchOrderData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (showRealTimeTracking) {
        // Update courier location (mock)
        setCourierLocation({
          ...mockCourierLocation,
          lat: mockCourierLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: mockCourierLocation.lng + (Math.random() - 0.5) * 0.001,
          eta: Math.max(5, mockCourierLocation.eta - 1)
        });
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [trackingId, showRealTimeTracking]);

  const fetchOrderData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      setTimeout(() => {
        if (trackingId === "DEMO123") {
          setOrderData(mockOrderData);
          setCourierLocation(mockCourierLocation);
        } else {
          // Real API call when backend is ready
          // const response = await axios.get(`${backendUrl}/api/order/track/${trackingId}`);
          // setOrderData(response.data);
          setError("Sipariş bulunamadı. Lütfen takip numarasını kontrol ediniz.");
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Sipariş bilgileri yüklenirken hata oluştu.");
      setLoading(false);
    }
  };

  const handleSMSNotification = () => {
    // Simulate SMS notification
    alert(`SMS gönderildi: Siparişiniz #${orderData?.trackingId} yolda. Takip için: https://tulumbak.com/track/${orderData?.trackingId}`);
  };

  const handleWhatsAppNotification = () => {
    // Simulate WhatsApp sharing
    const message = `Sipariş takip: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusColor = (status) => {
    const colors = {
      'preparing': 'bg-yellow-500',
      'ready': 'bg-blue-500',
      'picked_up': 'bg-purple-500',
      'delivering': 'bg-green-500',
      'delivered': 'bg-emerald-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      'preparing': 'Hazırlanıyor',
      'ready': 'Hazır',
      'picked_up': 'Kuryede',
      'delivering': 'Yolda',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal Edildi'
    };
    return texts[status] || 'Bilinmiyor';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sipariş bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Siparişlerime Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Siparişlerime Dön
            </button>
            <h1 className="text-2xl font-bold">Sipariş Takibi</h1>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Takip Numarası</p>
              <p className="text-2xl font-bold">{orderData?.trackingId}</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${getStatusColor(orderData?.status)}`}>
              <span className="font-semibold">{getStatusText(orderData?.status)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Info & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Bilgileri</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Müşteri</p>
                  <p className="font-medium">{orderData?.customer.name}</p>
                  <p className="text-sm text-gray-600">{orderData?.customer.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Teslimat Adresi</p>
                  <p className="font-medium">{orderData?.delivery.address}</p>
                  <p className="text-sm text-gray-600">Tahmini Teslimat: {orderData?.delivery.estimatedTime}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Sipariş Detayları</p>
                  <div className="space-y-2 mt-2">
                    {orderData?.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.size} x {item.quantity}</p>
                        </div>
                        <p className="font-medium">{item.price * item.quantity}₺</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Toplam:</span>
                      <span className="font-bold text-lg text-red-600">{orderData?.payment.total}₺</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <OrderTimeline
              timeline={orderData?.timeline}
              currentStatus={orderData?.status}
            />

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleSMSNotification}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  SMS Bilgisi
                </button>

                <button
                  onClick={handleWhatsAppNotification}
                  className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  WhatsApp
                </button>

                <button
                  onClick={() => setShowRealTimeTracking(!showRealTimeTracking)}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                    showRealTimeTracking
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {showRealTimeTracking ? 'Gerçek Zaman Takibi Açık' : 'Gerçek Zaman Takibi'}
                </button>

                <button className="flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Destek
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Courier Tracking */}
          <div className="space-y-6">
            {orderData?.courier && (
              <CourierTracker
                courier={orderData.courier}
                location={courierLocation}
                showRealTime={showRealTimeTracking}
                eta={courierLocation?.eta}
                distance={courierLocation?.distance}
              />
            )}

            {/* Support Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yardıma mı ihtiyacınız var?</h3>
              <div className="space-y-3">
                <a
                  href="tel:+902321234567"
                  className="flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-900">Müşteri Hizmetleri</p>
                    <p className="text-sm text-red-700">0232 123 45 67</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/905321234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-900">WhatsApp Destek</p>
                    <p className="text-sm text-green-700">0532 123 45 67</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Delivery Tips */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Teslimat İpuçları</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lütfen adreste bulunun
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Kuryeye ödemeyi hazırlayın
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ürünü teslimat sonrası kontrol edin
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;