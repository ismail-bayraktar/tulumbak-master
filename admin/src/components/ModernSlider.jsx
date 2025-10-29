import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
// import MediaLibrary from './MediaLibrary.jsx';

const ModernSlider = ({ token }) => {
    const [sliders, setSliders] = useState([]);
    const [activeTab, setActiveTab] = useState('list');
    const [editingSlider, setEditingSlider] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [previewSlider, setPreviewSlider] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);

    // Form data with all new fields
    const [formData, setFormData] = useState({
        template: 'split-left',
        title: '',
        subtitle: '',
        description: '',
        buttonText: '',
        buttonLink: '/collection',
        buttonStyle: 'primary',
        overlayOpacity: 0,
        textColor: 'auto',
        altText: '',
        seoTitle: '',
        order: 0,
        startDate: '',
        endDate: '',
        isActive: true
    });

    const [image, setImage] = useState(null);
    const [mobileImage, setMobileImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

    // Template options
    const templates = [
        { id: 'split-left', name: 'Sola Hizalı', icon: '🖼️' },
        { id: 'split-right', name: 'Sağa Hizalı', icon: '🖼️' },
        { id: 'centered', name: 'Ortalanmış', icon: '🎯' },
        { id: 'overlay', name: 'Overlay', icon: '🌟' },
        { id: 'full-width', name: 'Tam Genişlik', icon: '📐' }
    ];

    const buttonStyles = [
        { id: 'primary', name: 'Ana Buton', class: 'bg-red-600 hover:bg-red-700' },
        { id: 'secondary', name: 'İkincil', class: 'bg-gray-600 hover:bg-gray-700' },
        { id: 'outline', name: 'Outline', class: 'border-2 border-white hover:bg-white hover:text-gray-900' }
    ];

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

        // Validation
        if (!image && !editingSlider) {
            toast.error('Lütfen bir görsel seçin');
            return;
        }

        try {
            const formDataObj = new FormData();

            // Add all form fields
            Object.keys(formData).forEach(key => {
                if (key !== 'isActive') {
                    formDataObj.append(key, formData[key]);
                }
            });

            // Add images
            if (image) formDataObj.append('image', image);
            if (mobileImage) formDataObj.append('mobileImage', mobileImage);
            if (backgroundImage) formDataObj.append('backgroundImage', backgroundImage);

            let response;
            if (editingSlider) {
                response = await axios.put(`${backendUrl}/api/slider/update/${editingSlider._id}`, formDataObj, {
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
                setActiveTab('list');
            } else {
                toast.error(response.data.message || 'İşlem başarısız');
            }
        } catch (error) {
            console.error('Slider submit error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'İşlem başarısız';
            toast.error(errorMessage);
        }
    };

    const handleEdit = (slider) => {
        setFormData({
            template: slider.template || 'split-left',
            title: slider.title,
            subtitle: slider.subtitle,
            description: slider.description,
            buttonText: slider.buttonText,
            buttonLink: slider.buttonLink || '/collection',
            buttonStyle: slider.buttonStyle || 'primary',
            overlayOpacity: slider.overlayOpacity || 0,
            textColor: slider.textColor || 'auto',
            altText: slider.altText || '',
            seoTitle: slider.seoTitle || '',
            order: slider.order,
            startDate: slider.startDate ? new Date(slider.startDate).toISOString().split('T')[0] : '',
            endDate: slider.endDate ? new Date(slider.endDate).toISOString().split('T')[0] : '',
            isActive: slider.isActive
        });
        setEditingSlider(slider);
        setImage(null);
        setMobileImage(null);
        setBackgroundImage(null);
        setActiveTab('edit');
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

    const handleDragStart = (e, index) => {
        setDraggedItem(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const draggedIndex = draggedItem;

        if (draggedIndex !== dropIndex) {
            const newSliders = [...sliders];
            const [reorderedItem] = newSliders.splice(draggedIndex, 1);
            newSliders.splice(dropIndex, 0, reorderedItem);

            // Update order for all sliders
            const updatedSliders = newSliders.map((slider, index) => ({
                ...slider,
                order: index
            }));

            setSliders(updatedSliders);
            updateSliderOrders(updatedSliders);
        }
        setDraggedItem(null);
    };

    const updateSliderOrders = async (updatedSliders) => {
        try {
            await Promise.all(
                updatedSliders.map(slider =>
                    axios.put(`${backendUrl}/api/slider/update/${slider._id}`, {
                        order: slider.order
                    }, {
                        headers: { token }
                    })
                )
            );
            toast.success('Slider sıraları güncellendi');
        } catch (error) {
            toast.error('Sıralama güncellenemedi');
            fetchSliders(); // Reset to original order
        }
    };

    const duplicateSlider = async (slider) => {
        try {
            const duplicatedSlider = {
                ...slider,
                title: `${slider.title} (Kopyası)`,
                order: sliders.length
            };

            await axios.post(`${backendUrl}/api/slider/add`, duplicatedSlider, {
                headers: { token }
            });

            toast.success('Slider kopyalandı');
            fetchSliders();
        } catch (error) {
            toast.error('Kopyalama başarısız');
        }
    };

    const previewSliderHandler = (slider) => {
        setPreviewSlider(slider);
        setIsPreviewMode(true);
    };

    const handleMediaSelect = (media) => {
        if (media && media.length > 0) {
            // Update formData with media info
            setFormData({
                ...formData,
                image: media[0].url,
                altText: media[0].alt || media[0].title,
                title: formData.title || media[0].title
            });
        }
        setShowMediaLibrary(false);
    };

    const resetForm = () => {
        setFormData({
            template: 'split-left',
            title: '',
            subtitle: '',
            description: '',
            buttonText: '',
            buttonLink: '/collection',
            buttonStyle: 'primary',
            overlayOpacity: 0,
            textColor: 'auto',
            altText: '',
            seoTitle: '',
            order: 0,
            startDate: '',
            endDate: '',
            isActive: true
        });
        setImage(null);
        setMobileImage(null);
        setBackgroundImage(null);
        setEditingSlider(null);
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    return (
        <div className='flex-1 p-4 bg-gray-50'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900'>Modern Slider Yönetimi</h1>
                        <p className='text-gray-600 mt-1'>Profesyonel slider yönetimi ve analiz</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('edit')}
                        className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Slider
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className='bg-white rounded-lg shadow-sm mb-6'>
                <div className='border-b border-gray-200'>
                    <div className='flex'>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'list'
                                    ? 'border-red-600 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Slider Listesi
                        </button>
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'edit'
                                    ? 'border-red-600 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {editingSlider ? 'Slider Düzenle' : 'Yeni Slider Ekle'}
                        </button>
                    </div>
                </div>
            </div>

            {/* List Tab */}
            {activeTab === 'list' && (
                <div className='bg-white rounded-lg shadow-sm'>
                    <div className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-lg font-semibold text-gray-900'>Tüm Sliderlar</h2>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-gray-600'>
                                    Toplam: {sliders.length} slider
                                </span>
                                <span className='text-sm text-green-600'>
                                    Aktif: {sliders.filter(s => s.isActive).length} slider
                                </span>
                            </div>
                        </div>

                        {sliders.length === 0 ? (
                            <div className='text-center py-12'>
                                <div className='text-gray-400 text-6xl mb-4'>📸</div>
                                <h3 className='text-lg font-medium text-gray-900 mb-2'>Henüz slider eklenmedi</h3>
                                <p className='text-gray-600 mb-4'>İlk modern sliderınızı oluşturun</p>
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                                >
                                    İlk Sliderı Oluştur
                                </button>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {sliders.map((slider, index) => (
                                    <div
                                        key={slider._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-move'
                                    >
                                        <div className='flex items-start gap-6'>
                                            {/* Drag Handle */}
                                            <div className='flex flex-col items-center justify-center text-gray-400'>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                                <span className='text-xs mt-1'>#{slider.order + 1}</span>
                                            </div>

                                            {/* Preview Image */}
                                            <div className='flex-shrink-0'>
                                                <img
                                                    src={`${backendUrl}${slider.image}`}
                                                    alt={slider.title}
                                                    className='w-32 h-20 object-cover rounded-lg'
                                                />
                                                <div className='mt-2 flex items-center gap-1'>
                                                    <span className={`inline-block w-2 h-2 rounded-full ${
                                                        slider.isActive ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></span>
                                                    <span className='text-xs text-gray-600'>
                                                        {slider.isActive ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Slider Info */}
                                            <div className='flex-1'>
                                                <div className='flex items-start justify-between'>
                                                    <div>
                                                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                                                            {slider.title}
                                                        </h3>
                                                        <p className='text-gray-600 text-sm mb-3'>{slider.subtitle}</p>

                                                        <div className='flex items-center gap-6 text-sm text-gray-500'>
                                                            <span>🎨 {templates.find(t => t.id === slider.template)?.name}</span>
                                                            <span>🔗 {slider.buttonLink}</span>
                                                            {slider.viewCount > 0 && (
                                                                <span>👁️ {slider.viewCount} görüntülenme</span>
                                                            )}
                                                            {slider.clickCount > 0 && (
                                                                <span>🖱️ {slider.clickCount} tıklama</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={() => previewSliderHandler(slider)}
                                                            className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                                            title='Önizleme'
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => duplicateSlider(slider)}
                                                            className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                                                            title='Kopyala'
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => toggleActive(slider._id, slider.isActive)}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                slider.isActive
                                                                    ? 'text-green-600 hover:bg-green-50'
                                                                    : 'text-red-600 hover:bg-red-50'
                                                            }`}
                                                            title={slider.isActive ? 'Pasif yap' : 'Aktif yap'}
                                                        >
                                                            {slider.isActive ? (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(slider)}
                                                            className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                                            title='Düzenle'
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(slider._id)}
                                                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                                            title='Sil'
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Tab */}
            {activeTab === 'edit' && (
                <div className='bg-white rounded-lg shadow-sm'>
                    <div className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-lg font-semibold text-gray-900'>
                                {editingSlider ? 'Slider Düzenle' : 'Yeni Slider Oluştur'}
                            </h2>
                            <button
                                onClick={() => {
                                    setActiveTab('list');
                                    resetForm();
                                }}
                                className='text-gray-600 hover:text-gray-900'
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-8'>
                            {/* Template Selection */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-3'>
                                    Şablon Seçimi
                                </label>
                                <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                                    {templates.map(template => (
                                        <button
                                            key={template.id}
                                            type='button'
                                            onClick={() => setFormData({...formData, template: template.id})}
                                            className={`p-4 rounded-lg border-2 transition-all ${
                                                formData.template === template.id
                                                    ? 'border-red-600 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className='text-2xl mb-2'>{template.icon}</div>
                                            <div className='text-sm font-medium'>{template.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Başlık <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                        required
                                        placeholder='Dikkat çeken başlık'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Alt Başlık <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                        required
                                        placeholder='Destekleyici alt başlık'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Açıklama <span className='text-red-600'>*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                    rows={3}
                                    required
                                    placeholder='Ürün veya kampanya açıklaması'
                                />
                            </div>

                            {/* CTA Button */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Buton Metni <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.buttonText}
                                        onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                        required
                                        placeholder='Şimdi Alışveriş Yap'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Buton Linki
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.buttonLink}
                                        onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                        placeholder='/collection'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Buton Stili
                                    </label>
                                    <select
                                        value={formData.buttonStyle}
                                        onChange={(e) => setFormData({...formData, buttonStyle: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                    >
                                        {buttonStyles.map(style => (
                                            <option key={style.id} value={style.id}>
                                                {style.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Visual Settings */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Metin Rengi
                                    </label>
                                    <select
                                        value={formData.textColor}
                                        onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                    >
                                        <option value='auto'>Otomatik</option>
                                        <option value='light'>Açık (Beyaz)</option>
                                        <option value='dark'>Koyu (Siyah)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Overlay Opaklığı (%)
                                    </label>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={formData.overlayOpacity}
                                        onChange={(e) => setFormData({...formData, overlayOpacity: e.target.value})}
                                        className='w-full'
                                    />
                                    <div className='text-sm text-gray-600'>{formData.overlayOpacity}%</div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Sıra
                                    </label>
                                    <input
                                        type='number'
                                        value={formData.order}
                                        onChange={(e) => setFormData({...formData, order: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                        min='0'
                                        placeholder='0'
                                    />
                                </div>
                            </div>

                            {/* SEO Fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Alt Text (SEO)
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.altText}
                                        onChange={(e) => setFormData({...formData, altText: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                        placeholder='Görsel açıklaması'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        SEO Başlığı
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                        placeholder='SEO başlığı'
                                    />
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Başlangıç Tarihi
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Bitiş Tarihi
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent'
                                    />
                                </div>
                            </div>

                            {/* Image Uploads */}
                            <div className='space-y-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Ana Görsel <span className='text-red-600'>*</span>
                                    </label>

                                    {/* Current Image Display */}
                                    {formData.image && (
                                        <div className='mb-4 border border-gray-200 rounded-lg p-3'>
                                            <img
                                                src={`${backendUrl}/api/media/${formData.image.split('/').pop()}/base64`}
                                                alt='Mevcut görsel'
                                                className='w-full h-32 object-cover rounded'
                                                onError={(e) => {
                                                    e.target.src = formData.image;
                                                }}
                                            />
                                            <p className='text-xs text-gray-600 mt-2 truncate'>Mevcut görsel</p>
                                        </div>
                                    )}

                                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors'>
                                        <input
                                            type='file'
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className='hidden'
                                            id='main-image'
                                            accept='image/*'
                                        />
                                        <label htmlFor='main-image' className='cursor-pointer'>
                                            {image ? (
                                                <div>
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt='Önizleme'
                                                        className='mx-auto h-32 object-cover rounded-lg mb-4'
                                                    />
                                                    <p className='text-sm text-gray-600'>{image.name}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className='mt-2 text-sm text-gray-600'>Görsel yüklemek için tıklayın</p>
                                                    <p className='text-xs text-gray-500'>PNG, JPG, GIF (max. 10MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Mobil Görsel (İsteğe Bağlı)
                                        </label>
                                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors'>
                                            <input
                                                type='file'
                                                onChange={(e) => setMobileImage(e.target.files[0])}
                                                className='hidden'
                                                id='mobile-image'
                                                accept='image/*'
                                            />
                                            <label htmlFor='mobile-image' className='cursor-pointer'>
                                                {mobileImage ? (
                                                    <div>
                                                        <img
                                                            src={URL.createObjectURL(mobileImage)}
                                                            alt='Mobil Önizleme'
                                                            className='mx-auto h-20 object-cover rounded mb-2'
                                                        />
                                                        <p className='text-xs text-gray-600'>{mobileImage.name}</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className='mt-1 text-xs text-gray-600'>Mobil görsel</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Arkaplan Görseli (İsteğe Bağlı)
                                        </label>
                                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors'>
                                            <input
                                                type='file'
                                                onChange={(e) => setBackgroundImage(e.target.files[0])}
                                                className='hidden'
                                                id='background-image'
                                                accept='image/*'
                                            />
                                            <label htmlFor='background-image' className='cursor-pointer'>
                                                {backgroundImage ? (
                                                    <div>
                                                        <img
                                                            src={URL.createObjectURL(backgroundImage)}
                                                            alt='Arkaplan Önizleme'
                                                            className='mx-auto h-20 object-cover rounded mb-2'
                                                        />
                                                        <p className='text-xs text-gray-600'>{backgroundImage.name}</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className='mt-1 text-xs text-gray-600'>Arkaplan görseli</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className='flex items-center justify-between pt-6 border-t border-gray-200'>
                                <div className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        id='isActive'
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
                                    />
                                    <label htmlFor='isActive' className='ml-2 block text-sm text-gray-900'>
                                        Sliderı yayında tut
                                    </label>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setActiveTab('list');
                                            resetForm();
                                        }}
                                        className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type='submit'
                                        className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                                    >
                                        {editingSlider ? 'Güncelle' : 'Oluştur'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {isPreviewMode && previewSlider && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto'>
                        <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-900'>Slider Önizleme</h3>
                            <button
                                onClick={() => setIsPreviewMode(false)}
                                className='text-gray-600 hover:text-gray-900'
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className='p-6'>
                            {/* Preview content based on template */}
                            <div className='bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center'>
                                <div className='text-center'>
                                    <img
                                        src={`${backendUrl}${previewSlider.image}`}
                                        alt={previewSlider.title}
                                        className='mx-auto max-w-md rounded-lg shadow-lg mb-6'
                                    />
                                    <h4 className='text-2xl font-bold text-gray-900 mb-2'>{previewSlider.title}</h4>
                                    <p className='text-lg text-gray-600 mb-4'>{previewSlider.subtitle}</p>
                                    <p className='text-gray-600 mb-6'>{previewSlider.description}</p>
                                    <button className={`px-8 py-3 rounded-lg font-medium ${
                                        buttonStyles.find(s => s.id === previewSlider.buttonStyle)?.class || 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}>
                                        {previewSlider.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModernSlider;