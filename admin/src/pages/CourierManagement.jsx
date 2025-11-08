import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import { RefreshCw, Truck, CheckCircle, Package, Clock, Star, Lightbulb } from 'lucide-react';

const CourierManagement = ({ token }) => {
    const { isDarkMode } = useTheme();
    const [activeCouriers, setActiveCouriers] = useState([]);
    const [availableCouriers, setAvailableCouriers] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [stats, setStats] = useState({
        totalActive: 0,
        totalAvailable: 0,
        totalOrdersAssigned: 0,
        averageDeliveryTime: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourierData();
    }, []);

    const fetchCourierData = async () => {
        try {
            setLoading(true);
            
            // Mock data for EsnafExpress integration
            const mockCouriers = [
                {
                    id: 'CR-001',
                    name: 'Ahmet Yılmaz',
                    phone: '+90 532 123 4567',
                    vehicle: 'Motor',
                    status: 'active',
                    location: 'Bornova',
                    rating: 4.8,
                    totalDeliveries: 156,
                    currentOrders: 2
                },
                {
                    id: 'CR-002',
                    name: 'Mehmet Demir',
                    phone: '+90 533 234 5678',
                    vehicle: 'Motor',
                    status: 'available',
                    location: 'Karşıyaka',
                    rating: 4.9,
                    totalDeliveries: 203,
                    currentOrders: 0
                },
                {
                    id: 'CR-003',
                    name: 'Ali Kaya',
                    phone: '+90 534 345 6789',
                    vehicle: 'Bisiklet',
                    status: 'active',
                    location: 'Bayraklı',
                    rating: 4.7,
                    totalDeliveries: 98,
                    currentOrders: 1
                }
            ];

            // Mock assigned orders
            const mockOrders = [
                {
                    orderId: 'ORD-12345',
                    courierId: 'CR-001',
                    customerName: 'Fatma Öz',
                    address: 'Bornova Merkez Mah. No:42',
                    status: 'picking',
                    estimatedDelivery: new Date(Date.now() + 45 * 60000)
                }
            ];

            setAvailableCouriers(mockCouriers.filter(c => c.status === 'available'));
            setActiveCouriers(mockCouriers.filter(c => c.status === 'active'));
            setAssignedOrders(mockOrders);
            
            // Calculate stats
            setStats({
                totalActive: mockCouriers.filter(c => c.status === 'active').length,
                totalAvailable: mockCouriers.filter(c => c.status === 'available').length,
                totalOrdersAssigned: mockOrders.length,
                averageDeliveryTime: 38 // minutes
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Kurye verileri yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignOrder = (courierId, orderId) => {
        toast.success(`Sipariş ${orderId} kuryeye atandı`);
        // TODO: Implement real API call
        fetchCourierData();
    };

    const handleViewDetails = (courierId) => {
        // TODO: Open courier details modal
        toast.info(`Kurye ${courierId} detayları`);
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
            available: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400',
            busy: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
            offline: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const getStatusText = (status) => {
        const texts = {
            active: 'Çalışıyor',
            available: 'Hazır',
            busy: 'Meşgul',
            offline: 'Offline'
        };
        return texts[status] || status;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EsnafExpress</h1>
                        <span className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full text-sm font-semibold">
                            Kurye Yönetim Sistemi
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Kuryelerinizi yönetin, sipariş atayın ve performansı takip edin</p>
                </div>
                <button
                    onClick={() => toast.info('Entegrasyon henüz aktif değil')}
                    className="px-4 py-2 bg-warning-500 hover:bg-warning-600 dark:bg-warning-600 dark:hover:bg-warning-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Entegrasyon Ayarları
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aktif Kuryeler</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.totalActive}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <Truck className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hazır Kuryeler</p>
                            <p className="text-2xl font-bold text-success-600 dark:text-success-400">{stats.totalAvailable}</p>
                        </div>
                        <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Atanmış Siparişler</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.totalOrdersAssigned}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ort. Teslimat Süresi</p>
                            <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{stats.averageDeliveryTime} dk</p>
                        </div>
                        <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Couriers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hazır Kuryeler</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sipariş atamak için hazır kuryeler</p>
                </div>
                
                {availableCouriers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Şu anda hazır kurye yok</p>
                    </div>
                ) : (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {availableCouriers.map((courier) => (
                            <div key={courier.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{courier.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{courier.phone}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(courier.status)}`}>
                                        {getStatusText(courier.status)}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Araç:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{courier.vehicle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Konum:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{courier.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Puan:</span>
                                        <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                            <Star className="w-4 h-4 text-warning-500 dark:text-warning-400 fill-current" />
                                            {courier.rating}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Toplam Teslimat:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{courier.totalDeliveries}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleViewDetails(courier.id)}
                                    className="mt-3 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-md transition-colors text-sm font-medium"
                                >
                                    Detayları Gör
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active Couriers with Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Çalışan Kuryeler</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Şu anda sipariş teslim eden kuryeler</p>
                </div>
                
                {activeCouriers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Şu anda çalışan kurye yok</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        {activeCouriers.map((courier) => (
                            <div key={courier.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{courier.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{courier.location} • {courier.currentOrders} aktif sipariş</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full text-xs font-semibold">
                                            {getStatusText(courier.status)}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            <Star className="w-4 h-4 text-warning-500 dark:text-warning-400 fill-current" />
                                            {courier.rating}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <button
                                        onClick={() => handleViewDetails(courier.id)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors text-sm font-medium"
                                    >
                                        Canlı Takip
                                    </button>
                                    <button
                                        onClick={() => handleViewDetails(courier.id)}
                                        className="px-4 py-2 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-400 rounded-md transition-colors text-sm font-medium"
                                    >
                                        Sipariş Detayları
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Integration Info */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-primary-900 dark:text-primary-300 mb-2">EsnafExpress Entegrasyonu</h3>
                        <p className="text-sm text-primary-800 dark:text-primary-400 mb-3">
                            Bu sayfa EsnafExpress kurye uygulaması ile entegrasyon için hazırlanmış bir mockup alanıdır. 
                            Entegrasyon tamamlandığında gerçek zamanlı kurye bilgileri burada görüntülenecektir.
                        </p>
                        <ul className="text-sm text-primary-700 dark:text-primary-400 space-y-1">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Canlı kurye konumları
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Otomatik sipariş atama
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                GPS takibi
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Performans raporları
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourierManagement;
