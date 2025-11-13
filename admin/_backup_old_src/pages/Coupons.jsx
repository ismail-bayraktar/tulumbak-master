import { useEffect, useState } from 'react';
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { useTheme } from '../context/ThemeContext.jsx';

const Hint = ({ text }) => (
  <span title={text} className="ml-2 text-gray-400 dark:text-gray-500 select-none cursor-help">?</span>
);

const Coupons = ({ token }) => {
    const { isDarkMode } = useTheme();
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
            toast.error(error.response?.data?.message || error.message || 'Kuponlar yüklenirken hata oluştu');
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
            toast.error(error.response?.data?.message || error.message || 'Kuponlar yüklenirken hata oluştu');
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
            toast.error(error.response?.data?.message || error.message || 'Kuponlar yüklenirken hata oluştu');
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İndirim Kuponları</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Kupon kodlarını yönetin ve oluşturun</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
                >
                    {showForm ? 'İptal' : '+ Yeni Kupon'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Yeni Kupon Oluştur</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Kupon Kodu <Hint text="Müşterinin gireceği kod. Örn: TULUM10" /></label>
                            <input
                                type="text"
                                placeholder="Kupon Kodu"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">İndirim Türü <Hint text="Yüzde: % indirim. Tutar: sabit ₺ indirim." /></label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                required
                            >
                                <option value="yüzde">Yüzde</option>
                                <option value="tutar">Tutar</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Değer <Hint text="Yüzde ise 10 = %10; Tutar ise 50 = 50₺" /></label>
                            <input
                                type="number"
                                placeholder="Değer"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Sepet Tutarı <Hint text="Kuponun geçerli olması için en az sepet toplamı" /></label>
                            <input
                                type="number"
                                placeholder="Minimum Sepet Tutarı"
                                value={formData.minCart}
                                onChange={(e) => setFormData({ ...formData, minCart: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Kullanım Limiti <Hint text="0 = sınırsız; pozitif sayı = toplam kullanım" /></label>
                            <input
                                type="number"
                                placeholder="Kullanım Limiti (0=sınırsız)"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                                />
                                Aktif <Hint text="Pasif ise kupon kullanılamaz" />
                            </label>
                        </div>
                        <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-medium">
                            Kaydet
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2 py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white">
                    <div>Kod</div>
                    <div>Tip</div>
                    <div>Değer</div>
                    <div>Min. Sepet</div>
                    <div>Kullanım</div>
                    <div>İşlem</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2 py-3 px-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <div className="text-gray-900 dark:text-white font-medium">{coupon.code}</div>
                            <div className="text-gray-700 dark:text-gray-300">{coupon.type === 'yüzde' ? '%' : '₺'}</div>
                            <div className="hidden md:block text-gray-700 dark:text-gray-300">{coupon.value}</div>
                            <div className="hidden md:block text-gray-700 dark:text-gray-300">{coupon.minCart}₺</div>
                            <div className="hidden md:block text-gray-700 dark:text-gray-300">{coupon.usageCount}/{coupon.usageLimit || '∞'}</div>
                            <div className="hidden md:block">
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 cursor-pointer font-medium"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Coupons;

