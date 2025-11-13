import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import { Eye, FileText, ClipboardList, CheckCircle, Clock, Store, Truck, Loader } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal.jsx';
import PrintInvoice from './PrintInvoice.jsx';
import PrintDeliveryNote from './PrintDeliveryNote.jsx';

const OrderCard = ({ order, token, onStatusUpdate }) => {
    const { isDarkMode } = useTheme();
    const [status, setStatus] = useState(order.status || 'Siparişiniz Alındı');
    const [loading, setLoading] = useState(false);
    const [processingAction, setProcessingAction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showDeliveryNote, setShowDeliveryNote] = useState(false);

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
            toast.error(error.response?.data?.message || error.message || 'Sipariş durumu güncellenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Siparişiniz Alındı': 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 border-primary-300 dark:border-primary-700',
            'Hazırlanıyor': 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400 border-warning-300 dark:border-warning-700',
            'Kargoya Verildi': 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 border-primary-300 dark:border-primary-700',
            'Teslim Edildi': 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400 border-success-300 dark:border-success-700',
            'İptal Edildi': 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400 border-danger-300 dark:border-danger-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    };

    const getCourierStatusColor = (courierStatus) => {
        const colors = {
            'hazırlanıyor': 'text-warning-600 dark:text-warning-400',
            'yolda': 'text-primary-600 dark:text-primary-400',
            'teslim edildi': 'text-success-600 dark:text-success-400',
            'iptal': 'text-danger-600 dark:text-danger-400'
        };
        return colors[courierStatus] || 'text-gray-600 dark:text-gray-400';
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {order.address?.firstName} {order.address?.lastName}
                        </span>
                        {order.trackingId && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                                ID: {order.trackingId}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₺{order.amount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.paymentMethod}</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Items */}
            <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {order.items?.length} ürün
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 max-h-20 overflow-y-auto">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                            <span className="text-gray-900 dark:text-white">{item.name}</span>
                            <span className="font-medium text-gray-900 dark:text-white">x{item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Branch & Address */}
            <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                {order.branchId || order.assignment?.suggestedBranchId ? (
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800 px-2 py-0.5 rounded">
                            Şube: {order.branchCode || (order.assignment?.mode === 'hybrid' ? 'Önerildi' : 'Atandı')}
                        </span>
                        {order.assignment?.mode === 'hybrid' && order.assignment?.status === 'suggested' && (
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await axios.post(
                                            backendUrl + '/api/order/approve-branch',
                                            { orderId: order._id },
                                            { headers: { token } }
                                        );
                                        if (res.data.success) {
                                            toast.success('Şube önerisi onaylandı');
                                            onStatusUpdate && onStatusUpdate();
                                        } else {
                                            toast.error(res.data.message);
                                        }
                                    } catch (err) {
                                        toast.error(err.response?.data?.message || err.message || 'Şube önerisi onaylanırken hata oluştu');
                                    }
                                }}
                                className="text-xs px-2 py-1 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded transition-colors"
                            >
                                Öneriyi Onayla
                            </button>
                        )}
                    </div>
                ) : null}
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Teslimat Adresi:</p>
                <p className="text-gray-900 dark:text-white">{order.address?.street}</p>
                <p className="text-gray-900 dark:text-white">{order.address?.city}, {order.address?.state}</p>
                <p className="text-gray-900 dark:text-white">{order.address?.phone}</p>
            </div>

            {/* Courier Status */}
            {order.courierStatus && (
                <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kurye Durumu:</p>
                    <p className={`text-sm font-semibold ${getCourierStatusColor(order.courierStatus)}`}>
                        {order.courierStatus === 'hazırlanıyor' && 'Hazırlanıyor'}
                        {order.courierStatus === 'yolda' && 'Yolda'}
                        {order.courierStatus === 'teslim edildi' && 'Teslim Edildi'}
                        {order.courierStatus === 'iptal' && 'İptal'}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-400 rounded-md transition-colors text-sm font-medium flex items-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    Detaylar
                </button>
                
                <div className="flex-1 flex gap-2">
                    <button
                        onClick={() => setShowInvoice(true)}
                        className="px-3 py-2 bg-success-100 hover:bg-success-200 dark:bg-success-900/30 dark:hover:bg-success-900/50 text-success-700 dark:text-success-400 rounded-md transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Fatura
                    </button>
                    <button
                        onClick={() => setShowDeliveryNote(true)}
                        className="px-3 py-2 bg-warning-100 hover:bg-warning-200 dark:bg-warning-900/30 dark:hover:bg-warning-900/50 text-warning-700 dark:text-warning-400 rounded-md transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <ClipboardList className="w-4 h-4" />
                        İrsaliye
                    </button>
                </div>
                
                <select
                    value={status}
                    onChange={(e) => statusHandler(e.target.value)}
                    disabled={loading}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
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
                <span className={`font-semibold flex items-center gap-1 ${
                    order.payment 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-warning-600 dark:text-warning-400'
                }`}>
                    {order.payment ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Ödendi
                        </>
                    ) : (
                        <>
                            <Clock className="w-4 h-4" />
                            Bekleniyor
                        </>
                    )}
                </span>
            </div>

            {/* Modals */}
            <OrderDetailModal
                order={order}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
            
            {showInvoice && (
                <PrintInvoice
                    order={order}
                    isOpen={showInvoice}
                    onClose={() => setShowInvoice(false)}
                />
            )}
            
            {showDeliveryNote && (
                <PrintDeliveryNote
                    order={order}
                    isOpen={showDeliveryNote}
                    onClose={() => setShowDeliveryNote(false)}
                />
            )}
        </div>
    );
};

export default OrderCard;

