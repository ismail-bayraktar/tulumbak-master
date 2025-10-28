import { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const Coupons = ({ token }) => {
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        type: "yüzde",
        value: 0,
        minCart: 0,
        validFrom: new Date().getTime(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime(),
        usageLimit: 0,
        active: true
    });

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/coupon/list', { headers: { token } });
            if (response.data.success) {
                setCoupons(response.data.coupons);
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
            const response = await axios.post(backendUrl + '/api/coupon/create', formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Kupon eklendi");
                setShowForm(false);
                fetchCoupons();
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
            const response = await axios.delete(backendUrl + '/api/coupon/remove', {
                data: { id },
                headers: { token }
            });
            if (response.data.success) {
                toast.success("Kupon silindi");
                fetchCoupons();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold">İndirim Kuponları</p>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-black text-white"
                >
                    {showForm ? 'İptal' : '+ Yeni Kupon'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border">
                    <input
                        type="text"
                        placeholder="Kupon Kodu"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    >
                        <option value="yüzde">Yüzde</option>
                        <option value="tutar">Tutar</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Değer"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Minimum Sepet Tutarı"
                        value={formData.minCart}
                        onChange={(e) => setFormData({ ...formData, minCart: Number(e.target.value) })}
                        className="w-full mb-2 px-3 py-2 border"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Kullanım Limiti (0=sınırsız)"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                        className="w-full mb-2 px-3 py-2 border"
                    />
                    <label className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        Aktif
                    </label>
                    <button type="submit" className="px-4 py-2 bg-black text-white">
                        Kaydet
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-2">
                <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2 py-2 px-2 border bg-gray-100 text-sm font-bold">
                    <div>Kod</div>
                    <div>Tip</div>
                    <div>Değer</div>
                    <div>Min. Sepet</div>
                    <div>Kullanım</div>
                    <div>İşlem</div>
                </div>
                {coupons.map((coupon) => (
                    <div key={coupon._id} className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2 py-2 px-2 border text-sm">
                        <div>{coupon.code}</div>
                        <div>{coupon.type === 'yüzde' ? '%' : '₺'}</div>
                        <div className="hidden md:block">{coupon.value}</div>
                        <div className="hidden md:block">{coupon.minCart}₺</div>
                        <div className="hidden md:block">{coupon.usageCount}/{coupon.usageLimit || '∞'}</div>
                        <div className="hidden md:block">
                            <button
                                onClick={() => handleDelete(coupon._id)}
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

export default Coupons;

