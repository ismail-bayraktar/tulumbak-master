import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Image, Target, Sparkles, Ruler, Eye, Copy, Power, PowerOff, Edit, Trash2, X, Upload, Smartphone, Layers } from 'lucide-react';
// import MediaLibrary from './MediaLibrary.jsx';

const ModernSlider = ({ token }) => {
    const { isDarkMode } = useTheme();
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
        { id: 'split-left', name: 'Sola Hizalı', icon: Image },
        { id: 'split-right', name: 'Sağa Hizalı', icon: Image },
        { id: 'centered', name: 'Ortalanmış', icon: Target },
        { id: 'overlay', name: 'Overlay', icon: Sparkles },
        { id: 'full-width', name: 'Tam Genişlik', icon: Ruler }
    ];

    const buttonStyles = [
        { id: 'primary', name: 'Ana Buton', class: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600' },
        { id: 'secondary', name: 'İkincil', class: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600' },
        { id: 'outline', name: 'Outline', class: 'border-2 border-white dark:border-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }
    ];

    const fetchSliders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/slider/admin/list`, {
                headers: { token }
            });
            
            if (response.data.success) {
                setSliders(response.data.sliders || []);
            } else {
                toast.error(response.data.message || 'Sliderler yüklenemedi');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Sliderler yüklenirken hata oluştu');
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
            toast.error(error.response?.data?.message || error.message || 'İşlem başarısız');
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
                toast.error(error.response?.data?.message || error.message || 'Silme işlemi başarısız');
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
            toast.error(error.response?.data?.message || error.message || 'Durum güncellenemedi');
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
            toast.error(error.response?.data?.message || error.message || 'Sıralama güncellenemedi');
            fetchSliders(); // Reset to original order
        }
    };

    const duplicateSlider = async (slider) => {
        try {
            const formDataObj = new FormData();
            
            // Copy all slider fields
            Object.keys(slider).forEach(key => {
                if (key !== '_id' && key !== '__v' && key !== 'image' && key !== 'mobileImage' && key !== 'backgroundImage' && key !== 'createdAt' && key !== 'updatedAt') {
                    if (slider[key] !== null && slider[key] !== undefined) {
                        formDataObj.append(key, slider[key]);
                    }
                }
            });
            
            // Update title and order
            formDataObj.set('title', `${slider.title} (Kopyası)`);
            formDataObj.set('order', sliders.length.toString());

            await axios.post(`${backendUrl}/api/slider/add`, formDataObj, {
                headers: { token }
            });

            toast.success('Slider kopyalandı');
            fetchSliders();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Kopyalama başarısız');
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
        if (token) {
            fetchSliders();
        }
    }, [token]);

    return (
        <div className='flex-1 p-4 bg-gray-50 dark:bg-gray-900'>
            {/* Header */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Modern Slider Yönetimi</h1>
                        <p className='text-gray-600 dark:text-gray-400 mt-1'>Profesyonel slider yönetimi ve analiz</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('edit')}
                        className='px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Slider
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700'>
                <div className='border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex'>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'list'
                                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Slider Listesi
                        </button>
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'edit'
                                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            {editingSlider ? 'Slider Düzenle' : 'Yeni Slider Ekle'}
                        </button>
                    </div>
                </div>
            </div>

            {/* List Tab */}
            {activeTab === 'list' && (
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Tüm Sliderlar</h2>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    Toplam: {sliders.length} slider
                                </span>
                                <span className='text-sm text-success-600 dark:text-success-400'>
                                    Aktif: {sliders.filter(s => s.isActive).length} slider
                                </span>
                            </div>
                        </div>

                        {sliders.length === 0 ? (
                            <div className='text-center py-12'>
                                <Image className='w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4' />
                                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>Henüz slider eklenmedi</h3>
                                <p className='text-gray-600 dark:text-gray-400 mb-4'>İlk modern sliderınızı oluşturun</p>
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className='px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-medium'
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
                                        className='border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-move bg-white dark:bg-gray-800'
                                    >
                                        <div className='flex items-start gap-6'>
                                            {/* Drag Handle */}
                                            <div className='flex flex-col items-center justify-center text-gray-400 dark:text-gray-500'>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                                <span className='text-xs mt-1 text-gray-600 dark:text-gray-400'>#{slider.order + 1}</span>
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
                                                        slider.isActive ? 'bg-success-500' : 'bg-danger-500'
                                                    }`}></span>
                                                    <span className='text-xs text-gray-600 dark:text-gray-400'>
                                                        {slider.isActive ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Slider Info */}
                                            <div className='flex-1'>
                                                <div className='flex items-start justify-between'>
                                                    <div>
                                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                                            {slider.title}
                                                        </h3>
                                                        <p className='text-gray-600 dark:text-gray-400 text-sm mb-3'>{slider.subtitle}</p>

                                                        <div className='flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400'>
                                                            <span className='flex items-center gap-1'>
                                                                <Image className='w-4 h-4' />
                                                                {templates.find(t => t.id === slider.template)?.name}
                                                            </span>
                                                            <span className='flex items-center gap-1'>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                </svg>
                                                                {slider.buttonLink}
                                                            </span>
                                                            {slider.viewCount > 0 && (
                                                                <span className='flex items-center gap-1'>
                                                                    <Eye className='w-4 h-4' />
                                                                    {slider.viewCount} görüntülenme
                                                                </span>
                                                            )}
                                                            {slider.clickCount > 0 && (
                                                                <span className='flex items-center gap-1'>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                                                    </svg>
                                                                    {slider.clickCount} tıklama
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={() => previewSliderHandler(slider)}
                                                            className='p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors'
                                                            title='Önizleme'
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => duplicateSlider(slider)}
                                                            className='p-2 text-success-600 hover:bg-success-50 dark:hover:bg-success-900/30 rounded-lg transition-colors'
                                                            title='Kopyala'
                                                        >
                                                            <Copy className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleActive(slider._id, slider.isActive)}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                slider.isActive
                                                                    ? 'text-success-600 hover:bg-success-50 dark:hover:bg-success-900/30'
                                                                    : 'text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/30'
                                                            }`}
                                                            title={slider.isActive ? 'Pasif yap' : 'Aktif yap'}
                                                        >
                                                            {slider.isActive ? (
                                                                <PowerOff className="w-5 h-5" />
                                                            ) : (
                                                                <Power className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(slider)}
                                                            className='p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors'
                                                            title='Düzenle'
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(slider._id)}
                                                            className='p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-lg transition-colors'
                                                            title='Sil'
                                                        >
                                                            <Trash2 className="w-5 h-5" />
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
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                {editingSlider ? 'Slider Düzenle' : 'Yeni Slider Oluştur'}
                            </h2>
                            <button
                                onClick={() => {
                                    setActiveTab('list');
                                    resetForm();
                                }}
                                className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-8'>
                            {/* Template Selection */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                                    Şablon Seçimi
                                </label>
                                <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                                    {templates.map(template => {
                                        const IconComponent = template.icon;
                                        return (
                                            <button
                                                key={template.id}
                                                type='button'
                                                onClick={() => setFormData({...formData, template: template.id})}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    formData.template === template.id
                                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-500'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                                }`}
                                            >
                                                <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                                                    formData.template === template.id
                                                        ? 'text-primary-600 dark:text-primary-400'
                                                        : 'text-gray-600 dark:text-gray-400'
                                                }`} />
                                                <div className={`text-sm font-medium ${
                                                    formData.template === template.id
                                                        ? 'text-primary-700 dark:text-primary-300'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                }`}>{template.name}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content Fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Başlık <span className='text-danger-600 dark:text-danger-400'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                        required
                                        placeholder='Dikkat çeken başlık'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Alt Başlık <span className='text-danger-600 dark:text-danger-400'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                        required
                                        placeholder='Destekleyici alt başlık'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Açıklama <span className='text-danger-600 dark:text-danger-400'>*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                    rows={3}
                                    required
                                    placeholder='Ürün veya kampanya açıklaması'
                                />
                            </div>

                            {/* CTA Button */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Buton Metni <span className='text-danger-600 dark:text-danger-400'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.buttonText}
                                        onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                        required
                                        placeholder='Şimdi Alışveriş Yap'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Buton Linki
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.buttonLink}
                                        onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                        placeholder='/collection'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Buton Stili
                                    </label>
                                    <select
                                        value={formData.buttonStyle}
                                        onChange={(e) => setFormData({...formData, buttonStyle: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
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
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Metin Rengi
                                    </label>
                                    <select
                                        value={formData.textColor}
                                        onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                    >
                                        <option value='auto'>Otomatik</option>
                                        <option value='light'>Açık (Beyaz)</option>
                                        <option value='dark'>Koyu (Siyah)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
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
                                    <div className='text-sm text-gray-600 dark:text-gray-400'>{formData.overlayOpacity}%</div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Sıra
                                    </label>
                                    <input
                                        type='number'
                                        value={formData.order}
                                        onChange={(e) => setFormData({...formData, order: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                        min='0'
                                        placeholder='0'
                                    />
                                </div>
                            </div>

                            {/* SEO Fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Alt Text (SEO)
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.altText}
                                        onChange={(e) => setFormData({...formData, altText: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                        placeholder='Görsel açıklaması'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        SEO Başlığı
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                        placeholder='SEO başlığı'
                                    />
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Başlangıç Tarihi
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Bitiş Tarihi
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                                    />
                                </div>
                            </div>

                            {/* Image Uploads */}
                            <div className='space-y-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Ana Görsel <span className='text-danger-600 dark:text-danger-400'>*</span>
                                    </label>

                                    {/* Current Image Display */}
                                    {editingSlider && editingSlider.image && (
                                        <div className='mb-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800'>
                                            <img
                                                src={`${backendUrl}${editingSlider.image}`}
                                                alt='Mevcut görsel'
                                                className='w-full h-32 object-cover rounded'
                                                onError={(e) => {
                                                    e.target.src = `${backendUrl}${editingSlider.image}`;
                                                }}
                                            />
                                            <p className='text-xs text-gray-600 dark:text-gray-400 mt-2 truncate'>Mevcut görsel</p>
                                        </div>
                                    )}

                                    <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800'>
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
                                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{image.name}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                    <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>Görsel yüklemek için tıklayın</p>
                                                    <p className='text-xs text-gray-500 dark:text-gray-500'>PNG, JPG, GIF (max. 10MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                            Mobil Görsel (İsteğe Bağlı)
                                        </label>
                                        <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800'>
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
                                                        <p className='text-xs text-gray-600 dark:text-gray-400'>{mobileImage.name}</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Smartphone className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                        <p className='mt-1 text-xs text-gray-600 dark:text-gray-400'>Mobil görsel</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                            Arkaplan Görseli (İsteğe Bağlı)
                                        </label>
                                        <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800'>
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
                                                        <p className='text-xs text-gray-600 dark:text-gray-400'>{backgroundImage.name}</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Layers className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                        <p className='mt-1 text-xs text-gray-600 dark:text-gray-400'>Arkaplan görseli</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className='flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700'>
                                <div className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        id='isActive'
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded'
                                    />
                                    <label htmlFor='isActive' className='ml-2 block text-sm text-gray-900 dark:text-white'>
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
                                        className='px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium'
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type='submit'
                                        className='px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors font-medium'
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
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto border border-gray-200 dark:border-gray-700'>
                        <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Slider Önizleme</h3>
                            <button
                                onClick={() => setIsPreviewMode(false)}
                                className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className='p-6'>
                            {/* Preview content based on template */}
                            <div className='bg-gray-100 dark:bg-gray-700 rounded-lg p-8 min-h-[400px] flex items-center justify-center'>
                                <div className='text-center'>
                                    <img
                                        src={`${backendUrl}${previewSlider.image}`}
                                        alt={previewSlider.title}
                                        className='mx-auto max-w-md rounded-lg shadow-lg mb-6'
                                    />
                                    <h4 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>{previewSlider.title}</h4>
                                    <p className='text-lg text-gray-600 dark:text-gray-400 mb-4'>{previewSlider.subtitle}</p>
                                    <p className='text-gray-600 dark:text-gray-400 mb-6'>{previewSlider.description}</p>
                                    <button className={`px-8 py-3 rounded-lg font-medium ${
                                        buttonStyles.find(s => s.id === previewSlider.buttonStyle)?.class || 'bg-primary-600 hover:bg-primary-700 text-white'
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