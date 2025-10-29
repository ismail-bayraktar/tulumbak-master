import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const Branches = ({ token }) => {
    const [branches, setBranches] = useState([]);
    const [zones, setZones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: {
            street: '',
            district: '',
            city: 'İzmir',
            zipCode: '',
            coordinates: { latitude: '', longitude: '' }
        },
        contact: {
            phone: '',
            email: '',
            whatsapp: ''
        },
        workingHours: {
            weekdays: { start: '09:00', end: '18:00' },
            weekend: { start: '10:00', end: '16:00' }
        },
        assignedZones: [],
        capacity: {
            dailyOrders: 100,
            activeCouriers: 5
        },
        settings: {
            autoAssignment: true,
            hybridMode: false,
            googleMapsEnabled: false
        },
        notes: ''
    });

    useEffect(() => {
        fetchBranches();
        fetchZones();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/branches', { headers: { token } });
            if (response.data.success) {
                setBranches(response.data.branches);
            }
        } catch (error) {
            console.error(error);
            toast.error('Şubeler yüklenemedi');
        }
    };

    const fetchZones = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/delivery/zones', { headers: { token } });
            if (response.data.success) {
                setZones(response.data.zones);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingBranch
                ? `${backendUrl}/api/branches/${editingBranch._id}`
                : `${backendUrl}/api/branches`;
            
            const method = editingBranch ? 'put' : 'post';
            
            const response = await axios[method](url, formData, { headers: { token } });
            
            if (response.data.success) {
                toast.success(editingBranch ? 'Şube güncellendi' : 'Şube eklendi');
                setShowForm(false);
                setEditingBranch(null);
                resetForm();
                fetchBranches();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Silmek istediğinizden emin misiniz?')) return;
        try {
            const response = await axios.delete(`${backendUrl}/api/branches/${id}`, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success('Şube silindi');
                fetchBranches();
            }
        } catch (error) {
            console.error(error);
            toast.error('Silme işlemi başarısız');
        }
    };

    const handleEdit = (branch) => {
        setEditingBranch(branch);
        setFormData({
            name: branch.name,
            code: branch.code,
            address: branch.address,
            contact: branch.contact,
            workingHours: branch.workingHours,
            assignedZones: branch.assignedZones || [],
            capacity: branch.capacity,
            settings: branch.settings,
            notes: branch.notes || ''
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingBranch(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            address: {
                street: '',
                district: '',
                city: 'İzmir',
                zipCode: '',
                coordinates: { latitude: '', longitude: '' }
            },
            contact: {
                phone: '',
                email: '',
                whatsapp: ''
            },
            workingHours: {
                weekdays: { start: '09:00', end: '18:00' },
                weekend: { start: '10:00', end: '16:00' }
            },
            assignedZones: [],
            capacity: {
                dailyOrders: 100,
                activeCouriers: 5
            },
            settings: {
                autoAssignment: true,
                hybridMode: false,
                googleMapsEnabled: false
            },
            notes: ''
        });
    };

    const activeBranches = branches.filter(b => b.status === 'active').length;
    const totalZones = branches.reduce((sum, b) => sum + (b.assignedZones?.length || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Şubeler</h1>
                <p className="text-gray-600 mt-2">Tulumbak şubelerini yönetin</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Toplam Şube</p>
                            <p className="text-3xl font-bold text-gray-800">{branches.length}</p>
                        </div>
                        <div className="text-4xl">🏪</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Aktif Şube</p>
                            <p className="text-3xl font-bold text-green-600">{activeBranches}</p>
                        </div>
                        <div className="text-4xl">✅</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Atanmış Zone</p>
                            <p className="text-3xl font-bold text-blue-600">{totalZones}</p>
                        </div>
                        <div className="text-4xl">📍</div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {(showForm || editingBranch) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingBranch ? 'Şube Düzenle' : 'Yeni Şube Ekle'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Şube Adı *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Şube Kodu * (örn: MENEMEN_LISE)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="MENEMEN_LISE"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        💡 Büyük harfler, alt çizgi ile (özelleştirilemez)
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Adres Bilgileri</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sokak/Cadde *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address.street}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                address: { ...formData.address, street: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            İlçe
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address.district}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                address: { ...formData.address, district: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            İl *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address.city}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                address: { ...formData.address, city: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Posta Kodu
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address.zipCode}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                address: { ...formData.address, zipCode: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coordinates (Optional) */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Koordinatlar (Opsiyonel - Google Maps)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Enlem (Latitude)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.address.coordinates.latitude}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                address: { 
                                                    ...formData.address, 
                                                    coordinates: { ...formData.address.coordinates, latitude: e.target.value }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="41.0082"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Boylam (Longitude)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.address.coordinates.longitude}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                address: { 
                                                    ...formData.address, 
                                                    coordinates: { ...formData.address.coordinates, longitude: e.target.value }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="28.9784"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    💡 Google Maps API ile otomatik hesaplanabilir (ileride eklenecek)
                                </p>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">İletişim Bilgileri</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefon *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.contact.phone}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                contact: { ...formData.contact, phone: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            E-posta
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.contact.email}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                contact: { ...formData.contact, email: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            WhatsApp
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.contact.whatsapp}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                contact: { ...formData.contact, whatsapp: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Çalışma Saatleri</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hafta İçi Başlangıç
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.workingHours.weekdays.start}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                workingHours: { 
                                                    ...formData.workingHours, 
                                                    weekdays: { ...formData.workingHours.weekdays, start: e.target.value }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hafta İçi Bitiş
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.workingHours.weekdays.end}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                workingHours: { 
                                                    ...formData.workingHours, 
                                                    weekdays: { ...formData.workingHours.weekdays, end: e.target.value }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hafta Sonu Başlangıç
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.workingHours.weekend.start}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                workingHours: { 
                                                    ...formData.workingHours, 
                                                    weekend: { ...formData.workingHours.weekend, start: e.target.value }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hafta Sonu Bitiş
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.workingHours.weekend.end}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                workingHours: { 
                                                    ...formData.workingHours, 
                                                    weekend: { ...formData.workingHours.weekend, end: e.target.value }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Assigned Zones */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Teslimat Bölgeleri (Zone Assignment)</h3>
                                <p className="text-xs text-gray-500 mb-3">
                                    💡 Bu şubeye atanacak teslimat bölgelerini seçin. Seçilen zone'lara gelen siparişler bu şubeye yönlendirilir.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-300 rounded-lg">
                                    {zones.map((zone) => (
                                        <label key={zone._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                            <input
                                                type="checkbox"
                                                checked={formData.assignedZones.includes(zone._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({
                                                            ...formData,
                                                            assignedZones: [...formData.assignedZones, zone._id]
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            assignedZones: formData.assignedZones.filter(z => z !== zone._id)
                                                        });
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">{zone.district}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.assignedZones.length === 0 && (
                                    <p className="text-xs text-yellow-600">
                                        ⚠️ Hiç zone seçilmedi. Bu şube tüm bölgelerde hizmet verebilir (Universal Branch)
                                    </p>
                                )}
                            </div>

                            {/* Capacity */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Kapasite Ayarları</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Günlük Max Sipariş
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.capacity.dailyOrders}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                capacity: { ...formData.capacity, dailyOrders: Number(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Bu şubenin günlük alabileceği maksimum sipariş sayısı
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Aktif Kurye Sayısı
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.capacity.activeCouriers}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                capacity: { ...formData.capacity, activeCouriers: Number(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Aynı anda çalışabilecek kurye sayısı
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Settings */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Şube Ayarları</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.settings.autoAssignment}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                settings: { ...formData.settings, autoAssignment: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Otomatik Sipariş Atama</span>
                                            <p className="text-xs text-gray-500">Siparişler bu şubeye otomatik atanır</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.settings.hybridMode}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                settings: { ...formData.settings, hybridMode: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Hibrit Mod (Öner + Onay)</span>
                                            <p className="text-xs text-gray-500">Sipariş önerisi admin onayından sonra atanır</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.settings.googleMapsEnabled}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                settings: { ...formData.settings, googleMapsEnabled: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Google Maps API</span>
                                            <p className="text-xs text-gray-500">Mesafe hesaplama için Google API kullan (opsiyonel, ücretli)</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notlar
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                                >
                                    {editingBranch ? 'Güncelle' : 'Şube Ekle'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    {branches.length} şube listeleniyor
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                    + Yeni Şube Ekle
                </button>
            </div>

            {/* Branches Grid */}
            {branches.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="text-6xl mb-4">🏪</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz şube eklenmemiş</h3>
                    <p className="text-gray-600 mb-4">İlk Tulumbak şubenizi ekleyerek başlayın</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + İlk Şubeyi Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branches.map((branch) => (
                        <div key={branch._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{branch.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase">{branch.code}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(branch)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Düzenle"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(branch._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Sil"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-600 w-20">📍 Adres:</span>
                                    <span className="text-sm text-gray-800 flex-1">
                                        {branch.address.street}, {branch.address.district}
                                    </span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-600 w-20">📞 Tel:</span>
                                    <span className="text-sm text-gray-800">{branch.contact.phone}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-600 w-20">⏰ Saatler:</span>
                                    <span className="text-sm text-gray-800">
                                        {branch.workingHours.weekdays.start} - {branch.workingHours.weekdays.end}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <div className={`flex-1 text-center py-2 rounded-lg ${
                                    branch.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : branch.status === 'inactive'
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    <p className="text-xs font-medium">
                                        {branch.status === 'active' ? '✅ Aktif' : branch.status === 'inactive' ? '⏸️ Pasif' : '🔧 Bakımda'}
                                    </p>
                                </div>
                                <div className="flex-1 text-center py-2 bg-blue-50 text-blue-700 rounded-lg">
                                    <p className="text-xs font-medium">{branch.assignedZones?.length || 0} Zone</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Branches;

