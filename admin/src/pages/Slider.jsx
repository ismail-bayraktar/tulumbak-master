import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Slider = ({ token }) => {
    const { isDarkMode } = useTheme();
    const [sliders, setSliders] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        buttonText: '',
        buttonLink: '/collection',
        order: 0
    });
    const [image, setImage] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchSliders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/slider/list`);
            if (response.data.success) {
                setSliders(response.data.sliders);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Sliderler yüklenemedi');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('subtitle', formData.subtitle);
            formDataObj.append('description', formData.description);
            formDataObj.append('buttonText', formData.buttonText);
            formDataObj.append('buttonLink', formData.buttonLink);
            formDataObj.append('order', formData.order);
            
            if (image) {
                formDataObj.append('image', image);
            }

            let response;
            if (editingId) {
                response = await axios.put(`${backendUrl}/api/slider/update/${editingId}`, formDataObj, {
                    headers: { token }
                });
            } else {
                response = await axios.post(`${backendUrl}/api/slider/add`, formDataObj, {
                    headers: { token }
                });
            }

            if (response.data.success) {
                toast.success(response.data.message);
                resetForm();
                fetchSliders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'İşlem başarısız');
        }
    };

    const handleEdit = (slider) => {
        setFormData({
            title: slider.title,
            subtitle: slider.subtitle,
            description: slider.description,
            buttonText: slider.buttonText,
            buttonLink: slider.buttonLink || '/collection',
            order: slider.order
        });
        setEditingId(slider._id);
        setImage(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu sliderı silmek istediğinize emin misiniz?')) {
            try {
                const response = await axios.delete(`${backendUrl}/api/slider/delete/${id}`, {
                    headers: { token }
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchSliders();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            buttonText: '',
            buttonLink: '/collection',
            order: 0
        });
        setImage(false);
        setEditingId(null);
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            const response = await axios.put(`${backendUrl}/api/slider/update/${id}`, {
                isActive: !currentStatus
            }, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success('Slider durumu güncellendi');
                fetchSliders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Durum güncellenemedi');
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    return (
        <div className='flex-1 p-4'>
            <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>Slider Yönetimi</h1>
            
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                    {editingId ? 'Slider Düzenle' : 'Yeni Slider Ekle'}
                </h2>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Slider Başlığı</label>
                        <input
                            type='text'
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Alt Başlık</label>
                        <input
                            type='text'
                            value={formData.subtitle}
                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Açıklama</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Buton Metni</label>
                        <input
                            type='text'
                            value={formData.buttonText}
                            onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Buton Linki</label>
                        <input
                            type='text'
                            value={formData.buttonLink}
                            onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                            placeholder='/collection veya /product/123'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Sıra</label>
                        <input
                            type='number'
                            value={formData.order}
                            onChange={(e) => setFormData({...formData, order: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                            min='0'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Görsel</label>
                        <input
                            type='file'
                            onChange={(e) => setImage(e.target.files[0])}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300'
                            accept='image/*'
                        />
                        {image && (
                            <div className='mt-2'>
                                <img 
                                    src={URL.createObjectURL(image)} 
                                    alt='Önizleme' 
                                    className='h-20 object-cover rounded'
                                />
                            </div>
                        )}
                    </div>

                    <div className='flex gap-3'>
                        <button
                            type='submit'
                            className='px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-md transition-colors font-medium'
                        >
                            {editingId ? 'Güncelle' : 'Ekle'}
                        </button>
                        {editingId && (
                            <button
                                type='button'
                                onClick={resetForm}
                                className='px-6 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors font-medium'
                            >
                                İptal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
                <h2 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>Mevcut Sliderlar</h2>
                
                <div className='space-y-4'>
                    {sliders.map((slider) => (
                        <div key={slider._id} className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between bg-white dark:bg-gray-800'>
                            <div className='flex-1'>
                                <div className='flex items-center gap-4'>
                                    <img 
                                        src={`${backendUrl}${slider.image}`} 
                                        alt={slider.title} 
                                        className='w-20 h-20 object-cover rounded'
                                    />
                                    <div>
                                        <h3 className='font-semibold text-lg text-gray-900 dark:text-white'>{slider.title}</h3>
                                        <p className='text-gray-600 dark:text-gray-400 text-sm'>{slider.subtitle}</p>
                                        <p className='text-gray-500 dark:text-gray-500 text-sm'>{slider.description}</p>
                                        <p className='text-gray-500 dark:text-gray-500 text-sm'>Link: {slider.buttonLink || '/collection'}</p>
                                        <p className='text-gray-500 dark:text-gray-500 text-sm'>Sıra: {slider.order}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => toggleActive(slider._id, slider.isActive)}
                                    className={`px-3 py-1 rounded text-white font-medium ${
                                        slider.isActive ? 'bg-success-500 hover:bg-success-600' : 'bg-danger-500 hover:bg-danger-600'
                                    }`}
                                >
                                    {slider.isActive ? 'Aktif' : 'Pasif'}
                                </button>
                                <button
                                    onClick={() => handleEdit(slider)}
                                    className='px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors font-medium'
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(slider._id)}
                                    className='px-3 py-1 bg-danger-500 hover:bg-danger-600 text-white rounded transition-colors font-medium'
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

export default Slider;
