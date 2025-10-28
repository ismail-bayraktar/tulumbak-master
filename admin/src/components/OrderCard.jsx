import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import OrderDetailModal from './OrderDetailModal.jsx';

const OrderCard = ({ order, token, onStatusUpdate }) => {
    const [status, setStatus] = useState(order.status || 'Siparişiniz Alındı');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const statusHandler = async (newStatus) => {
        setLoading(true);
        try {
            const response = await axios.post(
                backendUrl + '/api/order/status',
                {
                    orderId: order._id,
                    status: newStatus
                },
                { headers: { token } }
            );
            
            if (response.data.success) {
                setStatus(newStatus);
                toast.success('Sipariş durumu güncellendi');
                onStatusUpdate && onStatusUpdate();
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Siparişiniz Alındı': 'bg-blue-100 text-blue-800 border-blue-300',
            'Hazırlanıyor': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Kargoya Verildi': 'bg-purple-100 text-purple-800 border-purple-300',
            'Teslim Edildi': 'bg-green-100 text-green-800 border-green-300',
            'İptal Edildi': 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getCourierStatusColor = (courierStatus) => {
        const colors = {
            'hazırlanıyor': 'text-orange-600',
            'yolda': 'text-blue-600',
            'teslim edildi': 'text-green-600',
            'iptal': 'text-red-600'
        };
        return colors[courierStatus] || 'text-gray-600';
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">
                            {order.address?.firstName} {order.address?.lastName}
                        </span>
                        {order.trackingId && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                ID: {order.trackingId}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">
                        ₺{order.amount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Items */}
            <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">
                    {order.items?.length} ürün
                </p>
                <div className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                            <span>{item.name}</span>
                            <span className="font-medium">x{item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Address */}
            <div className="mb-3 text-sm text-gray-600">
                <p className="font-medium text-gray-700 mb-1">Teslimat Adresi:</p>
                <p>{order.address?.street}</p>
                <p>{order.address?.city}, {order.address?.state}</p>
                <p>{order.address?.phone}</p>
            </div>

            {/* Courier Status */}
            {order.courierStatus && (
                <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Kurye Durumu:</p>
                    <p className={`text-sm font-semibold ${getCourierStatusColor(order.courierStatus)}`}>
                        {order.courierStatus === 'hazırlanıyor' && 'Hazırlanıyor'}
                        {order.courierStatus === 'yolda' && 'Yolda'}
                        {order.courierStatus === 'teslim edildi' && 'Teslim Edildi'}
                        {order.courierStatus === 'iptal' && 'İptal'}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                >
                    👁️ Detaylar
                </button>
                
                <select
                    value={status}
                    onChange={(e) => statusHandler(e.target.value)}
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Siparişiniz Alındı">Siparişiniz Alındı</option>
                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                    <option value="Kurye Ata">Kurye Atandı</option>
                    <option value="Yolda">Yolda</option>
                    <option value="Teslim Edildi">Teslim Edildi</option>
                    <option value="İptal Edildi">İptal Edildi</option>
                </select>
            </div>

            {/* Payment Status */}
            <div className="mt-2 flex items-center gap-2 text-sm">
                <span className={`font-semibold ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                    {order.payment ? '✓ Ödendi' : '⏳ Bekleniyor'}
                </span>
            </div>

            {/* Modal */}
            <OrderDetailModal
                order={order}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

export default OrderCard;

