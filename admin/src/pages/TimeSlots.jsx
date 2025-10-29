import { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const TimeSlots = ({ token }) => {
    const [slots, setSlots] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [formData, setFormData] = useState({
        label: "",
        start: "",
        end: "",
        isWeekend: false,
        capacity: 0
    });

    const fetchSlots = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/delivery/timeslots', { headers: { token } });
            if (response.data.success) {
                setSlots(response.data.slots);
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
            const response = editingSlot
                ? await axios.put(backendUrl + '/api/delivery/timeslots', { id: editingSlot._id, ...formData }, { headers: { token } })
                : await axios.post(backendUrl + '/api/delivery/timeslots', formData, { headers: { token } });
            
            if (response.data.success) {
                toast.success(editingSlot ? "Zaman aralığı güncellendi" : "Zaman aralığı eklendi");
                setShowForm(false);
                setEditingSlot(null);
                setFormData({
                    label: "",
                    start: "",
                    end: "",
                    isWeekend: false,
                    capacity: 0
                });
                fetchSlots();
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
            const response = await axios.delete(backendUrl + '/api/delivery/timeslots', {
                data: { id },
                headers: { token }
            });
            if (response.data.success) {
                toast.success("Zaman aralığı silindi");
                fetchSlots();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleEdit = (slot) => {
        setEditingSlot(slot);
        setFormData({
            label: slot.label,
            start: slot.start,
            end: slot.end,
            isWeekend: slot.isWeekend,
            capacity: slot.capacity
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSlot(null);
        setFormData({
            label: "",
            start: "",
            end: "",
            isWeekend: false,
            capacity: 0
        });
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const totalSlots = slots.length;
    const weekendSlots = slots.filter(s => s.isWeekend).length;
    const totalCapacity = slots.reduce((sum, slot) => sum + (slot.capacity || 0), 0);

    const groupedSlots = slots.reduce((acc, slot) => {
        const key = slot.isWeekend ? 'weekend' : 'weekday';
        if (!acc[key]) acc[key] = [];
        acc[key].push(slot);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Teslimat Zaman Aralıkları</h1>
                <p className="text-gray-600 mt-2">Müşterilerin teslimat zamanı seçebilmeleri için zaman aralıkları oluşturun</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Toplam Aralık</p>
                            <p className="text-3xl font-bold text-gray-800">{totalSlots}</p>
                        </div>
                        <div className="text-4xl">⏰</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Hafta Sonu</p>
                            <p className="text-3xl font-bold text-blue-600">{weekendSlots}</p>
                        </div>
                        <div className="text-4xl">📅</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Toplam Kapasite</p>
                            <p className="text-3xl font-bold text-green-600">{totalCapacity}</p>
                        </div>
                        <div className="text-4xl">📊</div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {(showForm || editingSlot) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full m-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingSlot ? 'Zaman Aralığı Düzenle' : 'Yeni Zaman Aralığı Ekle'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Etiket *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Örn: Sabah, Öğleden Sonra"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Müşterilere gösterilecek aralık adı
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Başlangıç *
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.start}
                                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Başlangıç saati</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bitiş *
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.end}
                                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Bitiş saati</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapasite
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Maksimum sipariş sayısı"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Bu aralıkta alınabilecek maksimum sipariş adedi (0 = sınırsız)
                                </p>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isWeekend}
                                        onChange={(e) => setFormData({ ...formData, isWeekend: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Hafta Sonu Aralığı</span>
                                        <p className="text-xs text-gray-500">Sadece haftasonu (Cumartesi/Pazar) için geçerli</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                                >
                                    {editingSlot ? 'Güncelle' : 'Ekle'}
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
                    {totalSlots} zaman aralığı listeleniyor
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                    + Yeni Aralık Ekle
                </button>
            </div>

            {/* Empty State */}
            {slots.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="text-6xl mb-4">⏰</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz zaman aralığı eklenmemiş</h3>
                    <p className="text-gray-600 mb-4">Müşterilerin teslimat zamanı seçebilmesi için aralıklar oluşturun</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + İlk Aralığı Ekle
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Weekday Slots */}
                    {groupedSlots.weekday && groupedSlots.weekday.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hafta İçi Aralıkları</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedSlots.weekday.map((slot) => (
                                    <div key={slot._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800">{slot.label}</h4>
                                                <p className="text-sm text-gray-500">Hafta içi aralığı</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(slot)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slot._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                                <span className="text-sm text-gray-600">⏱️ Süre</span>
                                                <span className="font-semibold text-gray-800">{slot.start} - {slot.end}</span>
                                            </div>
                                            {slot.capacity > 0 && (
                                                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                                    <span className="text-sm text-gray-600">📊 Kapasite</span>
                                                    <span className="font-semibold text-green-600">{slot.capacity} sipariş</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Weekend Slots */}
                    {groupedSlots.weekend && groupedSlots.weekend.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hafta Sonu Aralıkları</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedSlots.weekend.map((slot) => (
                                    <div key={slot._id} className="bg-white p-6 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800">{slot.label}</h4>
                                                <p className="text-sm text-blue-600">Hafta sonu aralığı</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(slot)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slot._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                                <span className="text-sm text-gray-600">⏱️ Süre</span>
                                                <span className="font-semibold text-gray-800">{slot.start} - {slot.end}</span>
                                            </div>
                                            {slot.capacity > 0 && (
                                                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                                    <span className="text-sm text-gray-600">📊 Kapasite</span>
                                                    <span className="font-semibold text-green-600">{slot.capacity} sipariş</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimeSlots;
