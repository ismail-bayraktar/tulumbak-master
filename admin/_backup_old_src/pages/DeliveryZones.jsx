import { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { useTheme } from '../context/ThemeContext.jsx';
import { MapPin, Calendar, Zap, Edit, Trash2, Lightbulb, CheckCircle, XCircle } from 'lucide-react';

const DeliveryZones = ({ token }) => {
    const { isDarkMode } = useTheme();
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
            toast.error(error.response?.data?.message || error.message || 'Bölgeler yüklenirken hata oluştu');
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
            toast.error(error.response?.data?.message || error.message || 'Bölge kaydedilirken hata oluştu');
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
            toast.error(error.response?.data?.message || error.message || 'Bölge silinirken hata oluştu');
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teslimat Bölgeleri</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Sipariş teslim edilecek bölgeleri yönetin</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Bölge</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalZones}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Hafta Sonu</p>
                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{activeWeekend}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Aynı Gün</p>
                            <p className="text-3xl font-bold text-success-600 dark:text-success-400">{activeSameDay}</p>
                        </div>
                        <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                            <Zap className="w-6 h-6 text-success-600 dark:text-success-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {(showForm || editingZone) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full m-4 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingZone ? 'Bölge Düzenle' : 'Yeni Bölge Ekle'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bölge/İlçe *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Örn: Kadıköy, Şişli"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Kuryelerinizin hizmet vereceği bölge adı</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Teslimat Ücreti (₺) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.fee}
                                    onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Bu bölge için müşteriden alınacak teslimat ücreti</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Minimum Sipariş Tutarı (₺) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.minOrder}
                                    onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Bu bölgeye teslimat için gereken minimum sepet tutarı</span>
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer text-gray-900 dark:text-white">
                                    <input
                                        type="checkbox"
                                        checked={formData.weekendAvailable}
                                        onChange={(e) => setFormData({ ...formData, weekendAvailable: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hafta Sonu Teslimat</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Cumartesi/Pazar günleri için teslimat aktif</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer text-gray-900 dark:text-white">
                                    <input
                                        type="checkbox"
                                        checked={formData.sameDayAvailable}
                                        onChange={(e) => setFormData({ ...formData, sameDayAvailable: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aynı Gün Teslimat</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Aynı gün içinde teslimat seçeneği sun</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-semibold"
                                >
                                    {editingZone ? 'Güncelle' : 'Ekle'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-semibold"
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
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {totalZones} bölge listeleniyor
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-semibold"
                >
                    + Yeni Bölge Ekle
                </button>
            </div>

            {/* Zones Grid */}
            {zones.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                    <MapPin className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Henüz bölge eklenmemiş</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">İlk teslimat bölgenizi ekleyerek başlayın</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
                    >
                        + İlk Bölgeyi Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zones.map((zone) => (
                        <div key={zone._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{zone.district}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Teslimat bölgesi</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(zone)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                                        title="Düzenle"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(zone._id)}
                                        className="p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-lg transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Teslimat Ücreti</span>
                                    <span className="font-semibold text-success-600 dark:text-success-400">{zone.fee}₺</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Min. Sipariş</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{zone.minOrder}₺</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className={`flex-1 text-center py-2 rounded-lg ${
                                    zone.weekendAvailable 
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                    <p className="text-xs font-medium">Hafta Sonu</p>
                                    {zone.weekendAvailable ? (
                                        <CheckCircle className="w-5 h-5 mx-auto mt-1 text-primary-600 dark:text-primary-400" />
                                    ) : (
                                        <XCircle className="w-5 h-5 mx-auto mt-1 text-gray-500 dark:text-gray-400" />
                                    )}
                                </div>
                                <div className={`flex-1 text-center py-2 rounded-lg ${
                                    zone.sameDayAvailable 
                                        ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' 
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                    <p className="text-xs font-medium">Aynı Gün</p>
                                    {zone.sameDayAvailable ? (
                                        <CheckCircle className="w-5 h-5 mx-auto mt-1 text-success-600 dark:text-success-400" />
                                    ) : (
                                        <XCircle className="w-5 h-5 mx-auto mt-1 text-gray-500 dark:text-gray-400" />
                                    )}
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
