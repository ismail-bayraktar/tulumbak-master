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
        status: 'active'
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

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            vehicleType: 'motor',
            vehiclePlate: '',
            status: 'active'
        });
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
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Kurye Yönetimi</h1>
                <p className="text-gray-600 mt-2">Kuryeleri yönetin, durumlarını takip edin</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">Kurye yönetim sayfası hazırlanıyor...</p>
                <p className="mt-2 text-sm text-gray-500">Toplam kurye: {couriers.length}</p>
            </div>
        </div>
    );
};

export default CourierManagement;

