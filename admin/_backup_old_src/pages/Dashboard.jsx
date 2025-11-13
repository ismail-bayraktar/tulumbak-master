import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import {
  Package,
  Clock,
  TrendingUp,
  Users,
  Mail,
  AlertTriangle,
  Plus,
  FileText,
  ShoppingCart,
  BarChart3,
  ArrowRight,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';

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
            setLoading(true);
            
            // Try to fetch dashboard stats with error handling
            try {
                const statsResponse = await axios.get(
                    backendUrl + '/api/report/dashboard',
                    { headers: { token } }
                );
                
                if (statsResponse.data.success) {
                    setStats(statsResponse.data.data || {});
                }
            } catch (err) {
                // Stats endpoint may not be available, continue without stats
            }

            // Fetch recent orders
            try {
                const ordersResponse = await axios.post(
                    backendUrl + '/api/order/list',
                    {},
                    { headers: { token } }
                );
                
                if (ordersResponse.data.success) {
                    // Get last 5 orders
                    setRecentOrders(ordersResponse.data.orders?.slice(0, 5) || []);
                }
            } catch (err) {
                // Recent orders may not be available, continue without them
            }
        } catch (error) {
            toast.error('Dashboard verileri yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Siparişiniz Alındı': 'bg-primary-100 text-primary-800 border-primary-200',
            'Hazırlanıyor': 'bg-warning-100 text-warning-800 border-warning-200',
            'Kargoya Verildi': 'bg-secondary-100 text-secondary-800 border-secondary-200',
            'Teslim Edildi': 'bg-success-100 text-success-800 border-success-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Siparişiniz Alındı': <ShoppingCart className="w-3 h-3" />,
            'Hazırlanıyor': <Clock className="w-3 h-3" />,
            'Kargoya Verildi': <Package className="w-3 h-3" />,
            'Teslim Edildi': <TrendingUp className="w-3 h-3" />
        };
        return icons[status] || <FileText className="w-3 h-3" />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-gray-500 text-sm">Dashboard yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-8 text-white">
                <div className="max-w-4xl">
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-primary-100 dark:text-primary-200 text-lg">Hoş geldiniz! Tulumbak Admin Paneline genel bakış</p>
                    <div className="mt-6 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date().toLocaleDateString('tr-TR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            <span>Sistem Aktif</span>
                        </div>
                    </div>
                </div>
            </div>

                      {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {/* Total Orders */}
                <div className="stats-card dark:stats-card-dark group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">+12%</div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Toplam Sipariş</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders?.toLocaleString() || 0}</p>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="stats-card dark:stats-card-dark group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                        </div>
                        <div className="text-xs text-warning-600 dark:text-warning-400 font-medium">Bekliyor</div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Bekleyen Siparişler</p>
                        <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{stats.pendingOrders?.toLocaleString() || 0}</p>
                    </div>
                </div>

                {/* Today Revenue */}
                <div className="stats-card dark:stats-card-dark group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <DollarSign className="w-6 h-6 text-success-600 dark:text-success-400" />
                        </div>
                        <div className="text-xs text-success-600 dark:text-success-400 font-medium">+8%</div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Bugünkü Gelir</p>
                        <p className="text-2xl font-bold text-success-600 dark:text-success-400">₺{(stats.todayRevenue || 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* New Users */}
                <div className="stats-card dark:stats-card-dark group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div className="text-xs text-secondary-600 dark:text-secondary-400 font-medium">+15%</div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Yeni Kullanıcılar</p>
                        <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{stats.newUsers?.toLocaleString() || 0}</p>
                    </div>
                </div>

                {/* Email Logs */}
                <div className="stats-card dark:stats-card-dark group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div className="text-xs text-brand-600 dark:text-brand-400 font-medium">Aktif</div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Email Gönderim</p>
                        <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.emailLogs?.toLocaleString() || 0}</p>
                    </div>
                </div>

                {/* Stock Alerts */}
                <div className="stats-card dark:stats-card-dark group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-danger-100 dark:bg-danger-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <AlertTriangle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                        </div>
                        <div className="text-xs text-danger-600 dark:text-danger-400 font-medium">{stats.stockAlerts > 0 ? 'Dikkat' : 'Normal'}</div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Stok Uyarıları</p>
                        <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">{stats.stockAlerts?.toLocaleString() || 0}</p>
                    </div>
                </div>
            </div>

                    {/* Quick Actions */}
            <div className="card dark:bg-gray-800 dark:border-gray-700">
                <div className="card-header">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hızlı Aksiyonlar</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sık kullanılan işlemlere hızlı erişim</p>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate('/add')}
                            className="flex items-center gap-3 p-4 
                                     bg-primary-50 dark:bg-primary-900/20 
                                     hover:bg-primary-100 dark:hover:bg-primary-900/30 
                                     border border-primary-200 dark:border-primary-800 
                                     rounded-xl transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-primary-900 dark:text-primary-300">Yeni Ürün</p>
                                <p className="text-xs text-primary-700 dark:text-primary-400">Hızlı ürün ekle</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/orders')}
                            className="flex items-center gap-3 p-4 
                                     bg-warning-50 dark:bg-warning-900/20 
                                     hover:bg-warning-100 dark:hover:bg-warning-900/30 
                                     border border-warning-200 dark:border-warning-800 
                                     rounded-xl transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 bg-warning-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-warning-900 dark:text-warning-300">Siparişler</p>
                                <p className="text-xs text-warning-700 dark:text-warning-400">Bekleyen siparişler</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/list')}
                            className="flex items-center gap-3 p-4 
                                     bg-success-50 dark:bg-success-900/20 
                                     hover:bg-success-100 dark:hover:bg-success-900/30 
                                     border border-success-200 dark:border-success-800 
                                     rounded-xl transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-success-900 dark:text-success-300">Ürünler</p>
                                <p className="text-xs text-success-700 dark:text-success-400">Tüm ürün listesi</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/reports')}
                            className="flex items-center gap-3 p-4 
                                     bg-secondary-50 dark:bg-secondary-900/20 
                                     hover:bg-secondary-100 dark:hover:bg-secondary-900/30 
                                     border border-secondary-200 dark:border-secondary-800 
                                     rounded-xl transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-secondary-900 dark:text-secondary-300">Raporlar</p>
                                <p className="text-xs text-secondary-700 dark:text-secondary-400">Detaylı analizler</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

                  {/* Recent Orders */}
            <div className="card dark:bg-gray-800 dark:border-gray-700">
                <div className="card-header">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Son Siparişler</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">En son gelen siparişler</p>
                    </div>
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                        Tümünü Gör
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="card-body">
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Henüz sipariş bulunmamaktadır</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">İlk siparişleriniz geldiğinde burada görünecek</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order, index) => (
                                <div
                                    key={index}
                                    className="group border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-modern hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800"
                                    onClick={() => navigate('/orders')}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {order.address?.firstName} {order.address?.lastName}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    <span>{order.status}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    <span>{order.items?.length} ürün</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(order.date).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>{order.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right ml-4">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                ₺{order.amount?.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(order.date).toLocaleTimeString('tr-TR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

