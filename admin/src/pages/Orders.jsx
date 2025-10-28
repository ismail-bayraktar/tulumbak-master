import {useEffect, useState} from 'react'
import axios from "axios";
import {backendUrl, currency} from "../App.jsx";
import {toast} from "react-toastify";
import OrderCard from "../components/OrderCard.jsx";

const Orders = ({token}) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        paymentMethod: 'all',
        searchQuery: ''
    });

    const fetchAllOrders = async () => {
        if (!token) {
            return null;
        }
        try {
            setLoading(true);
            const response = await axios.post(backendUrl + '/api/order/list', {}, {headers: {token}})
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
                setFilteredOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [token])

    // Filter orders based on filters
    useEffect(() => {
        let filtered = orders;

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        // Payment method filter
        if (filters.paymentMethod !== 'all') {
            filtered = filtered.filter(order => order.paymentMethod === filters.paymentMethod);
        }

        // Search query filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.address?.firstName?.toLowerCase().includes(query) ||
                order.address?.lastName?.toLowerCase().includes(query) ||
                order.address?.phone?.includes(query) ||
                order._id?.toLowerCase().includes(query) ||
                order.trackingId?.toLowerCase().includes(query)
            );
        }

        setFilteredOrders(filtered);
    }, [filters, orders]);

    const handleStatusUpdate = () => {
        fetchAllOrders();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Sipariş Yönetimi</h1>
                <p className="text-gray-600 mt-2">Tüm siparişleri görüntüleyin ve yönetin</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durum Filtrele
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tümü</option>
                            <option value="Siparişiniz Alındı">Siparişiniz Alındı</option>
                            <option value="Hazırlanıyor">Hazırlanıyor</option>
                            <option value="Kurye Ata">Kurye Atandı</option>
                            <option value="Yolda">Yolda</option>
                            <option value="Teslim Edildi">Teslim Edildi</option>
                            <option value="İptal Edildi">İptal Edildi</option>
                        </select>
                    </div>

                    {/* Payment Method Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ödeme Yöntemi
                        </label>
                        <select
                            value={filters.paymentMethod}
                            onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tümü</option>
                            <option value="KAPIDA">Kapıda Ödeme</option>
                            <option value="PayTR">PayTR</option>
                            <option value="Stripe">Stripe</option>
                            <option value="Razorpay">Razorpay</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arama
                        </label>
                        <input
                            type="text"
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                            placeholder="Müşteri adı, telefon, sipariş ID..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">Sipariş bulunamadı</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredOrders.map((order, index) => (
                            <OrderCard
                                key={index}
                                order={order}
                                token={token}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">
                    Toplam <span className="font-semibold text-gray-800">{orders.length}</span> sipariş,
                    gösterilen: <span className="font-semibold text-gray-800">{filteredOrders.length}</span>
                </p>
            </div>
        </div>
    )
}

export default Orders;
