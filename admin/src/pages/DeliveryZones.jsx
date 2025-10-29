import { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const DeliveryZones = ({ token }) => {
    const [zones, setZones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [formData, setFormData] = useState({
        district: "",
        fee: 0,
        minOrder: 0,
        weekendAvailable: true,
        sameDayAvailable: false
    });

    const fetchZones = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/delivery/zones', { headers: { token } });
            if (response.data.success) {
                setZones(response.data.zones);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = editingZone 
                ? await axios.put(backendUrl + '/api/delivery/zones', { id: editingZone._id, ...formData }, { headers: { token } })
                : await axios.post(backendUrl + '/api/delivery/zones', formData, { headers: { token } });
            
            if (response.data.success) {
                toast.success(editingZone ? "Bölge güncellendi" : "Bölge eklendi");
                setShowForm(false);
                setEditingZone(null);
                setFormData({
                    district: "",
                    fee: 0,
                    minOrder: 0,
                    weekendAvailable: true,
                    sameDayAvailable: false
                });
                fetchZones();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Silmek istediğinizden emin misiniz?')) return;
        try {
            const response = await axios.delete(backendUrl + '/api/delivery/zones', {
                data: { id },
                headers: { token }
            });
            if (response.data.success) {
                toast.success("Bölge silindi");
                fetchZones();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleEdit = (zone) => {
        setEditingZone(zone);
        setFormData({
            district: zone.district,
            fee: zone.fee,
            minOrder: zone.minOrder,
            weekendAvailable: zone.weekendAvailable,
            sameDayAvailable: zone.sameDayAvailable
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingZone(null);
        setFormData({
            district: "",
            fee: 0,
            minOrder: 0,
            weekendAvailable: true,
            sameDayAvailable: false
        });
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const totalZones = zones.length;
    const activeWeekend = zones.filter(z => z.weekendAvailable).length;
    const activeSameDay = zones.filter(z => z.sameDayAvailable).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Teslimat Bölgeleri</h1>
                <p className="text-gray-600 mt-2">Sipariş teslim edilecek bölgeleri yönetin</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Toplam Bölge</p>
                            <p className="text-3xl font-bold text-gray-800">{totalZones}</p>
                        </div>
                        <div className="text-4xl">📍</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Hafta Sonu</p>
                            <p className="text-3xl font-bold text-blue-600">{activeWeekend}</p>
                        </div>
                        <div className="text-4xl">📅</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Aynı Gün</p>
                            <p className="text-3xl font-bold text-green-600">{activeSameDay}</p>
                        </div>
                        <div className="text-4xl">⚡</div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {(showForm || editingZone) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full m-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingZone ? 'Bölge Düzenle' : 'Yeni Bölge Ekle'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bölge/İlçe *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Örn: Kadıköy, Şişli"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Kuryelerinizin hizmet vereceği bölge adı
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teslimat Ücreti (₺) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.fee}
                                    onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Bu bölge için müşteriden alınacak teslimat ücreti
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Sipariş Tutarı (₺) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.minOrder}
                                    onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Bu bölgeye teslimat için gereken minimum sepet tutarı
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.weekendAvailable}
                                        onChange={(e) => setFormData({ ...formData, weekendAvailable: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Hafta Sonu Teslimat</span>
                                        <p className="text-xs text-gray-500">Cumartesi/Pazar günleri için teslimat aktif</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.sameDayAvailable}
                                        onChange={(e) => setFormData({ ...formData, sameDayAvailable: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Aynı Gün Teslimat</span>
                                        <p className="text-xs text-gray-500">Aynı gün içinde teslimat seçeneği sun</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                                >
                                    {editingZone ? 'Güncelle' : 'Ekle'}
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
                    {totalZones} bölge listeleniyor
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                    + Yeni Bölge Ekle
                </button>
            </div>

            {/* Zones Grid */}
            {zones.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz bölge eklenmemiş</h3>
                    <p className="text-gray-600 mb-4">İlk teslimat bölgenizi ekleyerek başlayın</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + İlk Bölgeyi Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zones.map((zone) => (
                        <div key={zone._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{zone.district}</h3>
                                    <p className="text-sm text-gray-500">Teslimat bölgesi</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(zone)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Düzenle"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(zone._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Sil"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Teslimat Ücreti</span>
                                    <span className="font-semibold text-green-600">{zone.fee}₺</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Min. Sipariş</span>
                                    <span className="font-semibold text-gray-800">{zone.minOrder}₺</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <div className={`flex-1 text-center py-2 rounded-lg ${zone.weekendAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                    <p className="text-xs font-medium">Hafta Sonu</p>
                                    <p className="text-lg">{zone.weekendAvailable ? '✓' : '✗'}</p>
                                </div>
                                <div className={`flex-1 text-center py-2 rounded-lg ${zone.sameDayAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    <p className="text-xs font-medium">Aynı Gün</p>
                                    <p className="text-lg">{zone.sameDayAvailable ? '✓' : '✗'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryZones;
