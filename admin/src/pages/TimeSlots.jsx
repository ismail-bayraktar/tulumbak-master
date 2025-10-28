import { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const TimeSlots = ({ token }) => {
    const [slots, setSlots] = useState([]);
    const [showForm, setShowForm] = useState(false);
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
            const response = await axios.post(backendUrl + '/api/delivery/timeslots', formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Zaman aralığı eklendi");
                setShowForm(false);
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

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold">Teslimat Zaman Aralıkları</p>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-black text-white"
                >
                    {showForm ? 'İptal' : '+ Yeni Zaman Aralığı'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border">
                    <input
                        type="text"
                        placeholder="Etiket (örn: Sabah, Öğleden Sonra)"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Başlangıç (HH:mm)"
                        value={formData.start}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Bitiş (HH:mm)"
                        value={formData.end}
                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Kapasite"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        className="w-full mb-2 px-3 py-2 border"
                    />
                    <label className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={formData.isWeekend}
                            onChange={(e) => setFormData({ ...formData, isWeekend: e.target.checked })}
                        />
                        Hafta Sonu
                    </label>
                    <button type="submit" className="px-4 py-2 bg-black text-white">
                        Kaydet
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-2">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 py-2 px-2 border bg-gray-100 text-sm font-bold">
                    <div>Etiket</div>
                    <div>Başlangıç</div>
                    <div>Bitiş</div>
                    <div>Hafta Sonu</div>
                    <div>İşlem</div>
                </div>
                {slots.map((slot) => (
                    <div key={slot._id} className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 py-2 px-2 border text-sm">
                        <div>{slot.label}</div>
                        <div>{slot.start}</div>
                        <div>{slot.end}</div>
                        <div className="hidden md:block">{slot.isWeekend ? '✓' : '✗'}</div>
                        <div className="hidden md:block">
                            <button
                                onClick={() => handleDelete(slot._id)}
                                className="text-red-500 cursor-pointer"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeSlots;

