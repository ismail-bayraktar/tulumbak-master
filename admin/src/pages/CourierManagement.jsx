import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const CourierManagement = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/orders/all`, {
        headers: { token }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCourier = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/courier/request-pickup`,
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Kurye başarıyla çağrıldı' });
        fetchOrders();
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Kurye çağrılamadı' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Bir hata oluştu' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Siparişiniz Alındı': 'bg-blue-100 text-blue-800',
      'Siparişiniz Hazırlanıyor': 'bg-yellow-100 text-yellow-800',
      'Siparişiniz Yola Çıktı': 'bg-purple-100 text-purple-800',
      'Teslim Edildi': 'bg-green-100 text-green-800',
      'İptal Edildi': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCourierStatusColor = (status) => {
    const colors = {
      'hazırlanıyor': 'bg-orange-100 text-orange-800',
      'yolda': 'bg-purple-100 text-purple-800',
      'teslim edildi': 'bg-green-100 text-green-800',
      'iptal': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kurye Yönetimi</h1>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurye Durumu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.trackingId || order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.address?.name || 'Müşteri'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCourierStatusColor(order.courierStatus)}`}>
                      {order.courierStatus || 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₺{order.amount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.courierStatus === 'hazırlanıyor' && (
                      <button
                        onClick={() => handleRequestCourier(order._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Kurye Çağır
                      </button>
                    )}
                    {order.trackingLink && (
                      <a
                        href={order.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-900"
                      >
                        Takip
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">Henüz sipariş yok</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourierManagement;

