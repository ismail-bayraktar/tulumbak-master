import { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const DeliveryZones = ({ token }) => {
    const [zones, setZones] = useState([]);
    const [showForm, setShowForm] = useState(false);
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
            const response = await axios.post(backendUrl + '/api/delivery/zones', formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Bölge eklendi");
                setShowForm(false);
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

    useEffect(() => {
        fetchZones();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold">Teslimat Bölgeleri</p>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-black text-white"
                >
                    {showForm ? 'İptal' : '+ Yeni Bölge'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border">
                    <input
                        type="text"
                        placeholder="Bölge/İlçe"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Teslimat Ücreti"
                        value={formData.fee}
                        onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Minimum Sipariş"
                        value={formData.minOrder}
                        onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <label className="flex items-center gap-2 mb-2">
                        <input
                            type="checkbox"
                            checked={formData.weekendAvailable}
                            onChange={(e) => setFormData({ ...formData, weekendAvailable: e.target.checked })}
                        />
                        Hafta Sonu Teslimat
                    </label>
                    <label className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={formData.sameDayAvailable}
                            onChange={(e) => setFormData({ ...formData, sameDayAvailable: e.target.checked })}
                        />
                        Aynı Gün Teslimat
                    </label>
                    <button type="submit" className="px-4 py-2 bg-black text-white">
                        Kaydet
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-2">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 py-2 px-2 border bg-gray-100 text-sm font-bold">
                    <div>Bölge</div>
                    <div>Ücret</div>
                    <div>Min. Sipariş</div>
                    <div>Hafta Sonu</div>
                    <div>İşlem</div>
                </div>
                {zones.map((zone) => (
                    <div key={zone._id} className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 py-2 px-2 border text-sm">
                        <div>{zone.district}</div>
                        <div>{zone.fee}₺</div>
                        <div>{zone.minOrder}₺</div>
                        <div className="hidden md:block">{zone.weekendAvailable ? '✓' : '✗'}</div>
                        <div className="hidden md:block">
                            <button
                                onClick={() => handleDelete(zone._id)}
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

export default DeliveryZones;

