import {useEffect, useState} from 'react'
import axios from "axios";
import {backendUrl, currency} from "../App.jsx";
import {toast} from "react-toastify";
import OrderCard from "../components/OrderCard.jsx";
import { useTheme } from '../context/ThemeContext.jsx';

const Orders = ({token}) => {
    const { isDarkMode } = useTheme();
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
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sipariş Yönetimi</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Tüm siparişleri görüntüleyin ve yönetin</p>
            </div>

            {/* Filters */}
            <div className="card dark:bg-gray-800 dark:border-gray-700">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Durum Filtrele
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ödeme Yöntemi
                            </label>
                            <select
                                value={filters.paymentMethod}
                                onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Arama
                            </label>
                            <input
                                type="text"
                                value={filters.searchQuery}
                                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                                placeholder="Müşteri adı, telefon, sipariş ID..."
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 card dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Sipariş bulunamadı</p>
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
            <div className="card dark:bg-gray-800 dark:border-gray-700">
                <div className="card-body">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Toplam <span className="font-semibold text-gray-900 dark:text-white">{orders.length}</span> sipariş,
                        gösterilen: <span className="font-semibold text-gray-900 dark:text-white">{filteredOrders.length}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Orders;
