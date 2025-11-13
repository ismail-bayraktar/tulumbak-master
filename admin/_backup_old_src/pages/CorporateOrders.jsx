import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { useTheme } from '../context/ThemeContext.jsx';

const CorporateOrders = ({ token }) => {
    const { isDarkMode } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusNotes, setStatusNotes] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/corporate/list', {
                headers: { token }
            });
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Kurumsal siparişler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, status, notes = "") => {
        try {
            const response = await axios.put(
                backendUrl + '/api/corporate/update',
                { id: orderId, status, notes },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success("Durum güncellendi");
                fetchOrders();
                setSelectedOrder(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Durum güncellenirken hata oluştu');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
            case 'approved': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400';
            case 'rejected': return 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400';
            case 'completed': return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Beklemede';
            case 'approved': return 'Onaylandı';
            case 'rejected': return 'Reddedildi';
            case 'completed': return 'Tamamlandı';
            default: return status;
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Yükleniyor...</div>;
    }

    return (
        <div className="w-full p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Kurumsal Siparişler</h2>
            
            {orders.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">Henüz sipariş bulunmuyor</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-900 dark:text-white">Şirket Adı</th>
                                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-900 dark:text-white">İletişim</th>
                                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-900 dark:text-white">Sipariş Detayları</th>
                                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-900 dark:text-white">Talep Tarihi</th>
                                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-900 dark:text-white">Durum</th>
                                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-900 dark:text-white">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-900 dark:text-white">{order.companyName}</td>
                                    <td className="border border-gray-200 dark:border-gray-700 p-3">
                                        <div className="text-sm">
                                            <div className="text-gray-900 dark:text-white">{order.contactName}</div>
                                            <div className="text-gray-500 dark:text-gray-400">{order.email}</div>
                                            <div className="text-gray-500 dark:text-gray-400">{order.phone}</div>
                                        </div>
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-700 p-3">
                                        <div className="text-sm max-w-xs truncate text-gray-900 dark:text-white" title={order.orderDetails}>
                                            {order.orderDetails}
                                        </div>
                                        {order.estimatedAmount > 0 && (
                                            <div className="text-gray-600 dark:text-gray-400 mt-1">
                                                ~{order.estimatedAmount}₺
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-900 dark:text-white">{order.requestedDate}</td>
                                    <td className="border border-gray-200 dark:border-gray-700 p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-700 p-3">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-2 font-medium"
                                        >
                                            Detay
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Sipariş Detayları</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">Şirket Adı:</label>
                                <p className="text-gray-900 dark:text-white">{selectedOrder.companyName}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">İletişim Kişisi:</label>
                                <p className="text-gray-900 dark:text-white">{selectedOrder.contactName}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">E-posta:</label>
                                <p className="text-gray-900 dark:text-white">{selectedOrder.email}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">Telefon:</label>
                                <p className="text-gray-900 dark:text-white">{selectedOrder.phone}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">Adres:</label>
                                <p className="text-gray-900 dark:text-white">{selectedOrder.address}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">Sipariş Detayları:</label>
                                <p className="whitespace-pre-wrap text-gray-900 dark:text-white">{selectedOrder.orderDetails}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">Talep Tarihi:</label>
                                <p className="text-gray-900 dark:text-white">{selectedOrder.requestedDate}</p>
                            </div>
                            {selectedOrder.estimatedAmount > 0 && (
                                <div>
                                    <label className="font-semibold text-gray-700 dark:text-gray-300">Tahmini Tutar:</label>
                                    <p className="text-gray-900 dark:text-white">{selectedOrder.estimatedAmount}₺</p>
                                </div>
                            )}
                            {selectedOrder.notes && (
                                <div>
                                    <label className="font-semibold text-gray-700 dark:text-gray-300">Notlar:</label>
                                    <p className="text-gray-900 dark:text-white">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="font-semibold block mb-2 text-gray-700 dark:text-gray-300">Durum:</label>
                            <select
                                value={selectedOrder.status}
                                onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                            >
                                <option value="pending">Beklemede</option>
                                <option value="approved">Onaylandı</option>
                                <option value="rejected">Reddedildi</option>
                                <option value="completed">Tamamlandı</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="font-semibold block mb-2 text-gray-700 dark:text-gray-300">Notlar:</label>
                            <textarea
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                rows="3"
                                placeholder="İsteğe bağlı notlar ekleyin..."
                            />
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => {
                                    updateStatus(selectedOrder._id, selectedOrder.status, statusNotes);
                                    setStatusNotes("");
                                }}
                                className="flex-1 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-2 px-4 rounded transition-colors font-medium"
                            >
                                Güncelle
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setStatusNotes("");
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded transition-colors font-medium"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CorporateOrders;

