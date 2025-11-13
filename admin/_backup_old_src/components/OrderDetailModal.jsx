import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const OrderDetailModal = ({ order, isOpen, onClose }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && order) {
            fetchOrderDetails();
        }
    }, [isOpen, order]);

    const fetchOrderDetails = async () => {
        if (!order._id) return;
        
        setLoading(true);
        try {
            // Fetch status history
            const historyResponse = await axios.get(
                backendUrl + `/api/order/${order._id}/history`
            );

            // Fetch timeline
            const timelineResponse = await axios.get(
                backendUrl + `/api/order/${order._id}/timeline`
            );

            setOrderDetails({
                ...order,
                history: historyResponse.data.success ? historyResponse.data.history : [],
                timeline: timelineResponse.data.success ? timelineResponse.data : null
            });
        } catch (error) {
            // Order details may not be available
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('tr-TR');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Sipariş Detayları</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-gray-700 mb-2">Müşteri Bilgileri</h3>
                                    <p className="text-sm text-gray-600">
                                        {order.address?.firstName} {order.address?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        📞 {order.address?.phone}
                                    </p>
                                    {order.address?.email && (
                                        <p className="text-sm text-gray-600">
                                            📧 {order.address.email}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-gray-700 mb-2">Sipariş Bilgileri</h3>
                                    <p className="text-sm text-gray-600">
                                        Sipariş No: {order.trackingId || order._id.slice(-8)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Tarih: {formatDate(order.date)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Durum: {order.status}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Ödeme: {order.payment ? '✓ Ödendi' : '⏳ Bekleniyor'}
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Teslimat Adresi</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        {order.address?.street}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {order.address?.city}, {order.address?.state}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {order.address?.country} {order.address?.zipcode}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Ürünler</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {item.size && `${item.size} - `}
                                                    Adet: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">
                                                    ₺{(item.price || 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <p className="text-lg font-bold text-gray-800">
                                        Toplam: ₺{order.amount?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Courier Info */}
                            {order.courierStatus && (
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">Kurye Durumu</h3>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm font-semibold text-blue-800 mb-1">
                                            {order.courierStatus === 'hazırlanıyor' && 'Hazırlanıyor'}
                                            {order.courierStatus === 'yolda' && 'Yolda'}
                                            {order.courierStatus === 'teslim edildi' && 'Teslim Edildi'}
                                            {order.courierStatus === 'iptal' && 'İptal'}
                                        </p>
                                        {order.courierTrackingId && (
                                            <p className="text-xs text-gray-600">
                                                Kurye Takip ID: {order.courierTrackingId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Status History */}
                            {orderDetails?.history && orderDetails.history.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">Durum Geçmişi</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                        {orderDetails.history.map((entry, idx) => (
                                            <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-200 last:border-0">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {entry.status}
                                                    </p>
                                                    {entry.location && (
                                                        <p className="text-xs text-gray-600">
                                                            📍 {entry.location}
                                                        </p>
                                                    )}
                                                    {entry.note && (
                                                        <p className="text-xs text-gray-600">
                                                            📝 {entry.note}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(entry.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;

