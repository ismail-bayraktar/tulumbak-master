import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App.jsx';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import {
    PackageSearch,
    Store,
    MapPin,
    Clock,
    CheckCircle,
    Truck,
    X,
    Eye,
    ChevronRight,
    AlertCircle,
    Loader
} from 'lucide-react';
import OrderDetailModal from '../components/OrderDetailModal.jsx';

const OrderProcessing = ({ token }) => {
    const { isDarkMode } = useTheme();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showBranchModal, setShowBranchModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [processingOrderId, setProcessingOrderId] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        branch: 'all',
        searchQuery: ''
    });

    useEffect(() => {
        fetchOrders();
        fetchBranches();
    }, [token]);

    useEffect(() => {
        filterOrders();
    }, [filters, orders]);

    const fetchOrders = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Siparişler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/branches', { headers: { token } });
            if (response.data.success) {
                setBranches(response.data.branches.filter(b => b.status === 'active'));
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        // Branch filter
        if (filters.branch !== 'all') {
            filtered = filtered.filter(order => order.branchId === filters.branch);
        }

        // Search query
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
    };

    const handleAssignBranch = async (orderId, branchId) => {
        try {
            setProcessingOrderId(orderId);
            const response = await axios.post(
                backendUrl + '/api/order/assign-branch',
                { orderId, branchId },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Şube atandı');
                setShowBranchModal(false);
                setSelectedOrder(null);
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Şube atama başarısız');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Şube atama sırasında hata oluştu');
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handlePrepareOrder = async (orderId) => {
        try {
            setProcessingOrderId(orderId);
            const response = await axios.post(
                backendUrl + '/api/order/prepare',
                { orderId },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Sipariş hazırlanmaya başlandı');
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Sipariş hazırlama başarısız');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Sipariş hazırlama sırasında hata oluştu');
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleSendToCourier = async (orderId) => {
        if (!window.confirm('Siparişi kuryeye göndermek istediğinizden emin misiniz?')) return;

        try {
            setProcessingOrderId(orderId);
            const response = await axios.post(
                backendUrl + '/api/order/send-to-courier',
                { orderId },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Sipariş kuryeye gönderildi');
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Kuryeye gönderme başarısız');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Kuryeye gönderme sırasında hata oluştu');
        } finally {
            setProcessingOrderId(null);
        }
    };

    const getBranchName = (branchId) => {
        if (!branchId) return 'Atanmamış';
        const branch = branches.find(b => b._id === branchId);
        return branch ? branch.name : 'Bilinmiyor';
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'Siparişiniz Alındı': 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
            'Hazırlanıyor': 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
            'Kuryeye Verildi': 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400',
            'Kurye Atandı': 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400',
            'Yolda': 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
            'Teslim Edildi': 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400',
            'İptal Edildi': 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader className="w-12 h-12 animate-spin text-primary-600 dark:text-primary-400" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sipariş İşleme</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Sipariş hazırlama ve kurye yönetimi</p>
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
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="all">Tümü</option>
                                <option value="Siparişiniz Alındı">Yeni Siparişler</option>
                                <option value="Hazırlanıyor">Hazırlanıyor</option>
                                <option value="Kuryeye Verildi">Kuryeye Verildi</option>
                                <option value="Yolda">Yolda</option>
                                <option value="Teslim Edildi">Teslim Edildi</option>
                                <option value="İptal Edildi">İptal Edildi</option>
                            </select>
                        </div>

                        {/* Branch Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Şube Filtrele
                            </label>
                            <select
                                value={filters.branch}
                                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="all">Tüm Şubeler</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>{branch.name}</option>
                                ))}
                                <option value="unassigned">Atanmamış</option>
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
                                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
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
                        <PackageSearch className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Sipariş bulunamadı</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {order.address?.firstName} {order.address?.lastName}
                                            </span>
                                            {order.trackingId && (
                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                                                    {order.trackingId}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(order.date)}
                                        </p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                            {currency}{order.amount?.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Branch Info */}
                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Store className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Şube:</span>
                                        <span className={`text-sm font-semibold ${
                                            order.branchId 
                                                ? 'text-primary-600 dark:text-primary-400' 
                                                : 'text-warning-600 dark:text-warning-400'
                                        }`}>
                                            {getBranchName(order.branchId)}
                                        </span>
                                    </div>
                                    {order.assignment?.status === 'suggested' && (
                                        <div className="flex items-center gap-2 text-xs text-warning-600 dark:text-warning-400">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>Şube önerisi bekleniyor</span>
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teslimat Adresi</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {order.address?.street}, {order.address?.state}, {order.address?.city}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {order.address?.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {!order.branchId && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowBranchModal(true);
                                            }}
                                            disabled={processingOrderId === order._id}
                                            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Store className="w-4 h-4" />
                                            Şube Ata
                                        </button>
                                    )}

                                    {order.branchId && order.status === 'Siparişiniz Alındı' && (
                                        <button
                                            onClick={() => handlePrepareOrder(order._id)}
                                            disabled={processingOrderId === order._id}
                                            className="flex-1 px-4 py-2 bg-warning-600 hover:bg-warning-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {processingOrderId === order._id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Clock className="w-4 h-4" />
                                            )}
                                            Hazırlanıyor
                                        </button>
                                    )}

                                    {order.status === 'Hazırlanıyor' && (
                                        <button
                                            onClick={() => handleSendToCourier(order._id)}
                                            disabled={processingOrderId === order._id}
                                            className="flex-1 px-4 py-2 bg-info-600 hover:bg-info-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {processingOrderId === order._id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Truck className="w-4 h-4" />
                                            )}
                                            Kuryeye Teslim Et
                                        </button>
                                    )}

                                    {order.branchId && order.status !== 'Siparişiniz Alındı' && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowBranchModal(true);
                                            }}
                                            disabled={processingOrderId === order._id}
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Store className="w-4 h-4" />
                                            Şube Değiştir
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowDetailModal(true);
                                        }}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Detay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Branch Selection Modal */}
            {showBranchModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Şube Seç</h3>
                            <button
                                onClick={() => {
                                    setShowBranchModal(false);
                                    setSelectedOrder(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                            {branches.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                                    Aktif şube bulunamadı
                                </p>
                            ) : (
                                branches.map(branch => (
                                    <button
                                        key={branch._id}
                                        onClick={() => handleAssignBranch(selectedOrder._id, branch._id)}
                                        disabled={processingOrderId === selectedOrder._id}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                            selectedOrder.branchId === branch._id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{branch.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{branch.code}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {branch.address?.street}, {branch.address?.city}
                                                </p>
                                            </div>
                                            {selectedOrder.branchId === branch._id && (
                                                <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setShowBranchModal(false);
                                setSelectedOrder(null);
                            }}
                            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    token={token}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedOrder(null);
                    }}
                    onStatusUpdate={fetchOrders}
                />
            )}

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
    );
};

export default OrderProcessing;

