import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const CourierManagement = ({ token }) => {
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCourier, setEditingCourier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        vehicleType: 'motor',
        vehiclePlate: '',
        status: 'active',
        workSchedule: {
            startTime: '09:00',
            endTime: '18:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
    });

    useEffect(() => {
        fetchCouriers();
    }, []);

    const fetchCouriers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                backendUrl + '/api/courier-management/',
                { headers: { token } }
            );

            if (response.data.success) {
                setCouriers(response.data.couriers || []);
            }
        } catch (error) {
            console.error('Error fetching couriers:', error);
            toast.error('Kuryeler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let response;
            if (editingCourier) {
                response = await axios.put(
                    backendUrl + `/api/courier-management/${editingCourier._id}`,
                    formData,
                    { headers: { token } }
                );
            } else {
                response = await axios.post(
                    backendUrl + '/api/courier-management/',
                    formData,
                    { headers: { token } }
                );
            }

            if (response.data.success) {
                toast.success(editingCourier ? 'Kurye güncellendi' : 'Kurye eklendi');
                setShowModal(false);
                setEditingCourier(null);
                resetForm();
                fetchCouriers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        }
    };

    const handleEdit = (courier) => {
        setEditingCourier(courier);
        setFormData({
            name: courier.name,
            phone: courier.phone,
            email: courier.email || '',
            vehicleType: courier.vehicleType,
            vehiclePlate: courier.vehiclePlate || '',
            status: courier.status,
            workSchedule: courier.workSchedule
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu kuryeyi silmek istediğinizden emin misiniz?')) return;

        try {
            const response = await axios.delete(
                backendUrl + `/api/courier-management/${id}`,
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Kurye silindi');
                fetchCouriers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const response = await axios.put(
                backendUrl + `/api/courier-management/${id}/status`,
                { status },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Durum güncellendi');
                fetchCouriers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            vehicleType: 'motor',
            vehiclePlate: '',
            status: 'active',
            workSchedule: {
                startTime: '09:00',
                endTime: '18:00',
                days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            }
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            busy: 'bg-yellow-100 text-yellow-800',
            inactive: 'bg-gray-100 text-gray-800',
            offline: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            active: 'Aktif',
            busy: 'Meşgul',
            inactive: 'Pasif',
            offline: 'Offline'
        };
        return texts[status] || status;
    };

    const getVehicleTypeText = (type) => {
        const texts = {
            motor: '🏍️ Motor',
            araba: '🚗 Araba',
            bisiklet: '🚴 Bisiklet',
            yaya: '🚶 Yaya'
        };
        return texts[type] || type;
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
                    <h1 className="text-3xl font-bold text-gray-800">Kurye Yönetimi</h1>
                    <p className="text-gray-600 mt-2">Kuryeleri yönetin, durumlarını takip edin</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCourier(null);
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    + Yeni Kurye Ekle
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Toplam Kurye</p>
                            <p className="text-2xl font-bold text-gray-800">{couriers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🚚</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Aktif Kurye</p>
                            <p className="text-2xl font-bold text-green-600">
                                {couriers.filter(c => c.status === 'active').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Meşgul Kurye</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {couriers.filter(c => c.status === 'busy').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⏳</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Toplam Teslimat</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {couriers.reduce((sum, c) => sum + (c.performance?.totalDeliveries || 0), 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Couriers List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İsim
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Telefon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Araç
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Performans
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {couriers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Henüz kurye yok
                                    </td>
                                </tr>
                            ) : (
                                couriers.map((courier) => (
                                    <tr key={courier._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="font-medium text-gray-900">{courier.name}</p>
                                                <p className="text-sm text-gray-500">{courier.email || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {courier.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{getVehicleTypeText(courier.vehicleType).split(' ')[0]}</span>
                                                <span className="text-sm text-gray-600">{courier.vehiclePlate || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={courier.status}
                                                onChange={(e) => handleStatusUpdate(courier._id, e.target.value)}
                                                className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(courier.status)}`}
                                            >
                                                <option value="active">Aktif</option>
                                                <option value="busy">Meşgul</option>
                                                <option value="inactive">Pasif</option>
                                                <option value="offline">Offline</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="text-gray-900">
                                                <p className="font-semibold">{courier.performance?.totalDeliveries || 0} teslimat</p>
                                                <p className="text-xs text-gray-500">
                                                    ⭐ {courier.performance?.rating?.toFixed(1) || '0.0'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(courier)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(courier._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingCourier ? 'Kurye Düzenle' : 'Yeni Kurye Ekle'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingCourier(null);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İsim *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefon *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Araç Tipi *
                                    </label>
                                    <select
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="motor">Motor</option>
                                        <option value="araba">Araba</option>
                                        <option value="bisiklet">Bisiklet</option>
                                        <option value="yaya">Yaya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Plaka
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.vehiclePlate}
                                        onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    {editingCourier ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourierManagement;
