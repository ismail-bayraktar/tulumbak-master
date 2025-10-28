import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const CorporateOrders = ({ token }) => {
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
            console.error(error);
            toast.error("Siparişler yüklenemedi");
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
            toast.error("Güncelleme başarısız");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
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
        return <div className="text-center py-10">Yükleniyor...</div>;
    }

    return (
        <div className="w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Kurumsal Siparişler</h2>
            
            {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Henüz sipariş bulunmuyor</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border p-3 text-left">Şirket Adı</th>
                                <th className="border p-3 text-left">İletişim</th>
                                <th className="border p-3 text-left">Sipariş Detayları</th>
                                <th className="border p-3 text-left">Talep Tarihi</th>
                                <th className="border p-3 text-left">Durum</th>
                                <th className="border p-3 text-left">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="border p-3">{order.companyName}</td>
                                    <td className="border p-3">
                                        <div className="text-sm">
                                            <div>{order.contactName}</div>
                                            <div className="text-gray-500">{order.email}</div>
                                            <div className="text-gray-500">{order.phone}</div>
                                        </div>
                                    </td>
                                    <td className="border p-3">
                                        <div className="text-sm max-w-xs truncate" title={order.orderDetails}>
                                            {order.orderDetails}
                                        </div>
                                        {order.estimatedAmount > 0 && (
                                            <div className="text-gray-600 mt-1">
                                                ~{order.estimatedAmount}₺
                                            </div>
                                        )}
                                    </td>
                                    <td className="border p-3">{order.requestedDate}</td>
                                    <td className="border p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="border p-3">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-blue-600 hover:text-blue-800 mr-2"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Sipariş Detayları</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="font-semibold">Şirket Adı:</label>
                                <p>{selectedOrder.companyName}</p>
                            </div>
                            <div>
                                <label className="font-semibold">İletişim Kişisi:</label>
                                <p>{selectedOrder.contactName}</p>
                            </div>
                            <div>
                                <label className="font-semibold">E-posta:</label>
                                <p>{selectedOrder.email}</p>
                            </div>
                            <div>
                                <label className="font-semibold">Telefon:</label>
                                <p>{selectedOrder.phone}</p>
                            </div>
                            <div>
                                <label className="font-semibold">Adres:</label>
                                <p>{selectedOrder.address}</p>
                            </div>
                            <div>
                                <label className="font-semibold">Sipariş Detayları:</label>
                                <p className="whitespace-pre-wrap">{selectedOrder.orderDetails}</p>
                            </div>
                            <div>
                                <label className="font-semibold">Talep Tarihi:</label>
                                <p>{selectedOrder.requestedDate}</p>
                            </div>
                            {selectedOrder.estimatedAmount > 0 && (
                                <div>
                                    <label className="font-semibold">Tahmini Tutar:</label>
                                    <p>{selectedOrder.estimatedAmount}₺</p>
                                </div>
                            )}
                            {selectedOrder.notes && (
                                <div>
                                    <label className="font-semibold">Notlar:</label>
                                    <p>{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="font-semibold block mb-2">Durum:</label>
                            <select
                                value={selectedOrder.status}
                                onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                                className="w-full border p-2 rounded"
                            >
                                <option value="pending">Beklemede</option>
                                <option value="approved">Onaylandı</option>
                                <option value="rejected">Reddedildi</option>
                                <option value="completed">Tamamlandı</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="font-semibold block mb-2">Notlar:</label>
                            <textarea
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                                className="w-full border p-2 rounded"
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
                                className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                            >
                                Güncelle
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setStatusNotes("");
                                }}
                                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
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

