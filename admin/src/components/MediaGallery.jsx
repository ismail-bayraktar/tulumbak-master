import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Upload, Search, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

/**
 * MediaGallery Component
 * 
 * A reusable component for selecting media files from the media library.
 * Can be used in product forms, slider forms, etc.
 * 
 * @param {string} token - Admin authentication token
 * @param {function} onSelect - Callback when media is selected
 * @param {array} selectedMedia - Array of selected media IDs or URLs
 * @param {number} maxFiles - Maximum number of files that can be selected
 * @param {string} category - Filter media by category
 * @param {boolean} multiple - Allow multiple selection
 */
const MediaGallery = ({ 
    token, 
    onSelect, 
    selectedMedia = [], 
    maxFiles = 4,
    category = 'product',
    multiple = true 
}) => {
    const { isDarkMode } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [internalSelection, setInternalSelection] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);

    const categories = [
        { value: 'all', label: 'Tümü' },
        { value: 'product', label: 'Ürün' },
        { value: 'slider', label: 'Slider' },
        { value: 'blog', label: 'Blog' },
        { value: 'general', label: 'Genel' },
        { value: 'logo', label: 'Logo' },
        { value: 'banner', label: 'Banner' }
    ];

    useEffect(() => {
        if (showModal) {
            fetchMedia();
            // Initialize selection from props
            setInternalSelection(selectedMedia || []);
        }
    }, [showModal, searchTerm, selectedCategory]);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const params = {
                page: 1,
                limit: 50
            };

            if (searchTerm) params.search = searchTerm;
            if (selectedCategory !== 'all') params.category = selectedCategory;

            const response = await axios.get(`${backendUrl}/api/media/list`, {
                params,
                headers: { token }
            });

            if (response.data.success) {
                setMediaList(response.data.media);
            }
        } catch (error) {
            toast.error('Medya yüklenemedi');
            console.error('Media fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        setUploadLoading(true);
        const uploadResults = [];

        try {
            for (const file of files) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('category', selectedCategory === 'all' ? 'general' : selectedCategory);
                    formData.append('folder', 'uploads');
                    formData.append('alt', file.name);
                    formData.append('title', file.name.split('.')[0]);
                    formData.append('uploadedBy', 'admin');

                    const response = await axios.post(`${backendUrl}/api/media/upload`, formData, {
                        headers: {
                            token,
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.data.success) {
                        toast.success(`${file.name} yüklendi`);
                        // Auto-select uploaded media
                        const mediaUrl = response.data.media.url.startsWith('http') 
                            ? response.data.media.url 
                            : `${backendUrl}${response.data.media.url}`;
                        
                        if (multiple) {
                            setInternalSelection(prev => [...prev, response.data.media.url]);
                        } else {
                            setInternalSelection([response.data.media.url]);
                        }
                        uploadResults.push({ file: file.name, success: true });
                    } else {
                        toast.error(`${file.name}: ${response.data.message || 'Yüklenemedi'}`);
                        uploadResults.push({ file: file.name, success: false, error: response.data.message });
                    }
                } catch (fileError) {
                    const errorMessage = fileError.response?.data?.message || fileError.message || 'Bilinmeyen hata';
                    toast.error(`${file.name}: ${errorMessage}`);
                    uploadResults.push({ file: file.name, success: false, error: errorMessage });
                    console.error(`Upload error for ${file.name}:`, fileError);
                }
            }

            // Only refresh if at least one file was uploaded successfully
            if (uploadResults.some(r => r.success)) {
                fetchMedia();
            }
        } catch (error) {
            toast.error('Dosya yükleme işlemi başarısız oldu');
            console.error('Upload error:', error);
        } finally {
            setUploadLoading(false);
        }
    };

    const toggleSelection = (mediaUrl) => {
        if (!multiple) {
            setInternalSelection([mediaUrl]);
            return;
        }

        if (internalSelection.includes(mediaUrl)) {
            setInternalSelection(prev => prev.filter(url => url !== mediaUrl));
        } else {
            if (internalSelection.length >= maxFiles) {
                toast.warning(`Maksimum ${maxFiles} görsel seçebilirsiniz`);
                return;
            }
            setInternalSelection(prev => [...prev, mediaUrl]);
        }
    };

    const handleConfirm = () => {
        if (onSelect) {
            onSelect(multiple ? internalSelection : internalSelection[0]);
        }
        setShowModal(false);
    };

    const handleRemove = (index) => {
        const newSelection = [...internalSelection];
        newSelection.splice(index, 1);
        setInternalSelection(newSelection);
        if (onSelect) {
            onSelect(multiple ? newSelection : newSelection[0] || null);
        }
    };

    const isSelected = (mediaUrl) => {
        return internalSelection.includes(mediaUrl);
    };

    return (
        <div className="space-y-4">
            {/* Selected Media Preview */}
            {internalSelection.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {internalSelection.map((url, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img
                                    src={url.startsWith('http') ? url : `${backendUrl}${url}`}
                                    alt={`Seçili görsel ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af"%3EResim%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Open Gallery Button */}
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn-primary flex items-center gap-2"
            >
                <ImageIcon className="w-5 h-5" />
                {internalSelection.length > 0 
                    ? `${internalSelection.length} Görsel Seçildi - Değiştir`
                    : 'Medya Kütüphanesinden Seç'
                }
            </button>

            {/* Or Upload Directly */}
            <div className="relative">
                <input
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="direct-upload"
                    disabled={uploadLoading}
                />
                <label
                    htmlFor="direct-upload"
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    {uploadLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Yükleniyor...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Veya Doğrudan Yükle
                        </span>
                    )}
                </label>
            </div>

            {/* Gallery Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Medya Kütüphanesi
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {multiple 
                                        ? `Maksimum ${maxFiles} görsel seçebilirsiniz (${internalSelection.length}/${maxFiles})`
                                        : 'Bir görsel seçin'
                                    }
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Medya ara..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Media Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400" />
                                </div>
                            ) : mediaList.length === 0 ? (
                                <div className="text-center py-12">
                                    <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Medya bulunamadı
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        İlk medyanızı yükleyin
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {mediaList.map((media) => {
                                        const mediaUrl = media.url.startsWith('http') ? media.url : `${backendUrl}${media.url}`;
                                        const selected = isSelected(media.url);
                                        
                                        return (
                                            <div
                                                key={media.id}
                                                onClick={() => toggleSelection(media.url)}
                                                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                                                    selected
                                                        ? 'border-primary-600 ring-2 ring-primary-200 dark:ring-primary-800'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
                                                }`}
                                            >
                                                <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
                                                    {media.mimetype.startsWith('image/') ? (
                                                        <img
                                                            src={mediaUrl}
                                                            alt={media.alt || media.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.target.src = `${backendUrl}/api/media/${media.id}/base64`;
                                                                e.target.onerror = () => {
                                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af"%3EResim%3C/text%3E%3C/svg%3E';
                                                                };
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                    )}

                                                    {/* Selection Indicator */}
                                                    {selected && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                                                </div>

                                                {/* Title */}
                                                <div className="p-2 bg-white dark:bg-gray-800">
                                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={media.title}>
                                                        {media.title}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Upload in Modal */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="modal-upload"
                                    disabled={uploadLoading}
                                />
                                <label
                                    htmlFor="modal-upload"
                                    className="block w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                                >
                                    {uploadLoading ? (
                                        <span className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Yükleniyor...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Upload className="w-4 h-4" />
                                            Yeni Medya Yükle
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {internalSelection.length} görsel seçildi
                            </span>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
                                >
                                    Seçimi Onayla ({internalSelection.length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaGallery;

