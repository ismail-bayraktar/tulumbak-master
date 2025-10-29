import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const Dashboard = ({ token }) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        todayRevenue: 0,
        newUsers: 0,
        emailLogs: 0,
        stockAlerts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch dashboard stats
            const statsResponse = await axios.get(
                backendUrl + '/api/report/dashboard',
                { headers: { token } }
            );
            
            if (statsResponse.data.success) {
                setStats(statsResponse.data.data || {});
            }

            // Fetch recent orders
            const ordersResponse = await axios.post(
                backendUrl + '/api/order/list',
                {},
                { headers: { token } }
            );
            
            if (ordersResponse.data.success) {
                // Get last 5 orders
                setRecentOrders(ordersResponse.data.orders?.slice(0, 5) || []);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Dashboard verileri yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Siparişiniz Alındı': 'bg-blue-100 text-blue-800',
            'Hazırlanıyor': 'bg-yellow-100 text-yellow-800',
            'Kargoya Verildi': 'bg-purple-100 text-purple-800',
            'Teslim Edildi': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-2">Hoş geldiniz! Sisteme genel bakış</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Orders */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Toplam Sipariş</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalOrders || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Bekleyen Siparişler</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⏳</span>
                        </div>
                    </div>
                </div>

                {/* Today Revenue */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Bugünkü Gelir</p>
                            <p className="text-2xl font-bold text-green-600">₺ {stats.todayRevenue || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💰</span>
                        </div>
                    </div>
                </div>

                {/* New Users */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Yeni Kullanıcılar</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.newUsers || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                {/* Email Logs */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Email Durumu</p>
                            <p className="text-2xl font-bold text-indigo-600">{stats.emailLogs || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📧</span>
                        </div>
                    </div>
                </div>

                {/* Stock Alerts */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Stok Uyarıları</p>
                            <p className="text-2xl font-bold text-red-600">{stats.stockAlerts || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⚠️</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hızlı Aksiyonlar</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/add')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        ⚡ Hızlı Ürün Ekle
                    </button>
                    <button
                        onClick={() => navigate('/orders')}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        📋 Bekleyen Siparişleri Gör
                    </button>
                    <button
                        onClick={() => navigate('/list')}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        📦 Tüm Ürünleri Listele
                    </button>
                    <button
                        onClick={() => navigate('/reports')}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                    >
                        📊 Detaylı Raporlar
                    </button>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Son Siparişler</h2>
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Tümünü Gör →
                    </button>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Henüz sipariş bulunmamaktadır</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate('/orders')}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-800">
                                                {order.address?.firstName} {order.address?.lastName}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {order.items?.length} ürün · ₺{order.amount?.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(order.date).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800">
                                            ₺{order.amount?.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {order.paymentMethod}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

