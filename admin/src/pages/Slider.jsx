import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const Slider = ({ token }) => {
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
            toast.error('Sliderler yüklenemedi');
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
            toast.error('İşlem başarısız');
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
                toast.error('Silme işlemi başarısız');
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
            toast.error('Durum güncellenemedi');
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    return (
        <div className='flex-1 p-4'>
            <h1 className='text-2xl font-bold mb-6'>Slider Yönetimi</h1>
            
            <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
                <h2 className='text-lg font-semibold mb-4'>
                    {editingId ? 'Slider Düzenle' : 'Yeni Slider Ekle'}
                </h2>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Slider Başlığı</label>
                        <input
                            type='text'
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Alt Başlık</label>
                        <input
                            type='text'
                            value={formData.subtitle}
                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Açıklama</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Buton Metni</label>
                        <input
                            type='text'
                            value={formData.buttonText}
                            onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Buton Linki</label>
                        <input
                            type='text'
                            value={formData.buttonLink}
                            onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='/collection veya /product/123'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Sıra</label>
                        <input
                            type='number'
                            value={formData.order}
                            onChange={(e) => setFormData({...formData, order: e.target.value})}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            min='0'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Görsel</label>
                        <input
                            type='file'
                            onChange={(e) => setImage(e.target.files[0])}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                            className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                        >
                            {editingId ? 'Güncelle' : 'Ekle'}
                        </button>
                        {editingId && (
                            <button
                                type='button'
                                onClick={resetForm}
                                className='px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
                            >
                                İptal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-lg font-semibold mb-4'>Mevcut Sliderlar</h2>
                
                <div className='space-y-4'>
                    {sliders.map((slider) => (
                        <div key={slider._id} className='border border-gray-200 rounded-lg p-4 flex items-center justify-between'>
                            <div className='flex-1'>
                                <div className='flex items-center gap-4'>
                                    <img 
                                        src={`${backendUrl}${slider.image}`} 
                                        alt={slider.title} 
                                        className='w-20 h-20 object-cover rounded'
                                    />
                                    <div>
                                        <h3 className='font-semibold text-lg'>{slider.title}</h3>
                                        <p className='text-gray-600 text-sm'>{slider.subtitle}</p>
                                        <p className='text-gray-500 text-sm'>{slider.description}</p>
                                        <p className='text-gray-500 text-sm'>Link: {slider.buttonLink || '/collection'}</p>
                                        <p className='text-gray-500 text-sm'>Sıra: {slider.order}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => toggleActive(slider._id, slider.isActive)}
                                    className={`px-3 py-1 rounded text-white ${
                                        slider.isActive ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                >
                                    {slider.isActive ? 'Aktif' : 'Pasif'}
                                </button>
                                <button
                                    onClick={() => handleEdit(slider)}
                                    className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(slider._id)}
                                    className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
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
