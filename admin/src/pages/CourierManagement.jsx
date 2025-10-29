import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const CourierManagement = ({ token }) => {
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
            console.error('Error fetching courier data:', error);
            toast.error('Kurye verileri yüklenirken hata oluştu');
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
            active: 'bg-blue-100 text-blue-800',
            available: 'bg-green-100 text-green-800',
            busy: 'bg-yellow-100 text-yellow-800',
            offline: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
                <p className="text-gray-500">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-800">EsnafExpress</h1>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            Kurye Yönetim Sistemi
                        </span>
                    </div>
                    <p className="text-gray-600">Kuryelerinizi yönetin, sipariş atayın ve performansı takip edin</p>
                </div>
                <button
                    onClick={() => toast.info('Entegrasyon henüz aktif değil')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    🔄 Entegrasyon Ayarları
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Aktif Kuryeler</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalActive}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🚚</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Hazır Kuryeler</p>
                            <p className="text-2xl font-bold text-green-600">{stats.totalAvailable}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Atanmış Siparişler</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.totalOrdersAssigned}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Ort. Teslimat Süresi</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.averageDeliveryTime} dk</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⏱️</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Couriers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Hazır Kuryeler</h2>
                    <p className="text-sm text-gray-600">Sipariş atamak için hazır kuryeler</p>
                </div>
                
                {availableCouriers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500">Şu anda hazır kurye yok</p>
                    </div>
                ) : (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {availableCouriers.map((courier) => (
                            <div key={courier.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{courier.name}</h3>
                                        <p className="text-sm text-gray-600">{courier.phone}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(courier.status)}`}>
                                        {getStatusText(courier.status)}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Araç:</span>
                                        <span className="font-medium">{courier.vehicle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Konum:</span>
                                        <span className="font-medium">{courier.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Puan:</span>
                                        <span className="font-medium">⭐ {courier.rating}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Toplam Teslimat:</span>
                                        <span className="font-medium">{courier.totalDeliveries}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleViewDetails(courier.id)}
                                    className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                                >
                                    Detayları Gör
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active Couriers with Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Çalışan Kuryeler</h2>
                    <p className="text-sm text-gray-600">Şu anda sipariş teslim eden kuryeler</p>
                </div>
                
                {activeCouriers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500">Şu anda çalışan kurye yok</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        {activeCouriers.map((courier) => (
                            <div key={courier.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-lg">🚚</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{courier.name}</h3>
                                            <p className="text-sm text-gray-600">{courier.location} • {courier.currentOrders} aktif sipariş</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                            {getStatusText(courier.status)}
                                        </span>
                                        <span className="text-sm text-gray-600">⭐ {courier.rating}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <button
                                        onClick={() => handleViewDetails(courier.id)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                                    >
                                        Canlı Takip
                                    </button>
                                    <button
                                        onClick={() => handleViewDetails(courier.id)}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                        <h3 className="font-bold text-blue-900 mb-2">EsnafExpress Entegrasyonu</h3>
                        <p className="text-sm text-blue-800 mb-3">
                            Bu sayfa EsnafExpress kurye uygulaması ile entegrasyon için hazırlanmış bir mockup alanıdır. 
                            Entegrasyon tamamlandığında gerçek zamanlı kurye bilgileri burada görüntülenecektir.
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>✅ Canlı kurye konumları</li>
                            <li>✅ Otomatik sipariş atama</li>
                            <li>✅ GPS takibi</li>
                            <li>✅ Performans raporları</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourierManagement;
