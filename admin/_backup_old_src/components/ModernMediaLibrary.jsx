import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const ModernMediaLibrary = ({
    token,
    onSelectMedia,
    selectedMediaId,
    multiple = false,
    maxFiles = 10,
    allowedTypes = ['image/*'],
    showUpload = true,
    category = 'general'
}) => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(multiple ? [] : null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [previewMedia, setPreviewMedia] = useState(null);

    const categories = [
        { value: 'all', label: 'Tümü', icon: '🗂️' },
        { value: 'slider', label: 'Slider', icon: '🎨' },
        { value: 'product', label: 'Ürün', icon: '📦' },
        { value: 'blog', label: 'Blog', icon: '📝' },
        { value: 'general', label: 'Genel', icon: '📁' },
        { value: 'logo', label: 'Logo', icon: '🏷️' },
        { value: 'banner', label: 'Banner', icon: '🖼️' },
        { value: 'category', label: 'Kategori', icon: '🏷️' },
        { value: 'user', label: 'Kullanıcı', icon: '👤' }
    ];

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const params = {};

            if (searchTerm) params.search = searchTerm;
            if (selectedCategory !== 'all') params.category = selectedCategory;

            const response = await axios.get(`${backendUrl}/api/media-enhanced/list`, {
                params,
                headers: { token }
            });

            if (response.data.success) {
                setMediaList(response.data.media);
            }
        } catch (error) {
            toast.error('Medya yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        setUploadLoading(true);
        const uploadedFiles = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', selectedCategory === 'all' ? 'general' : selectedCategory);
                formData.append('folder', 'uploads');
                formData.append('alt', file.name);
                formData.append('title', file.name.split('.')[0]);
                formData.append('uploadedBy', 'admin');

                setUploadProgress(prev => ({
                    ...prev,
                    [file.name]: { progress: 0, status: 'uploading' }
                }));

                const response = await axios.post(`${backendUrl}/api/media-enhanced/upload`, formData, {
                    headers: {
                        token,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({
                            ...prev,
                            [file.name]: { progress, status: 'uploading' }
                        }));
                    }
                });

                if (response.data.success) {
                    uploadedFiles.push(response.data.media);
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: { progress: 100, status: 'completed' }
                    }));
                    toast.success(`${file.name} yüklendi`);
                } else {
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: { progress: 0, status: 'failed' }
                    }));
                }
            }

            fetchMedia();
            setShowUploadModal(false);
            setUploadProgress({});
        } catch (error) {
            toast.error('Dosya yüklenemedi');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleSelectMedia = (media) => {
        if (multiple) {
            if (selectedItems?.includes(media.id)) {
                setSelectedItems(selectedItems.filter(id => id !== media.id));
            } else {
                setSelectedItems([...selectedItems, media.id]);
            }
        } else {
            setSelectedItems(media.id);
            if (onSelectMedia) {
                onSelectMedia(media);
            }
        }
    };

    const handleConfirmSelection = () => {
        if (onSelectMedia && multiple) {
            const selectedMediaObjects = mediaList.filter(media => selectedItems.includes(media.id));
            onSelectMedia(selectedMediaObjects);
        }
    };

    const handlePreview = (media) => {
        setPreviewMedia(media);
    };

    const handleEdit = (media) => {
        // Implement edit functionality
        // Edit functionality to be implemented
    };

    const handleDelete = async (media) => {
        if (window.confirm(`${media.originalName} medyasını silmek istediğinizden emin misiniz?`)) {
            try {
                const response = await axios.delete(`${backendUrl}/api/media-enhanced/${media.id}`, {
                    headers: { token }
                });

                if (response.data.success) {
                    toast.success('Medya silindi');
                    fetchMedia();
                }
            } catch (error) {
                toast.error('Medya silinemedi');
            }
        }
    };

    const getResponsiveImageUrl = (media, size = 'medium') => {
        if (media.responsive && media.responsive[size]) {
            return media.responsive[size];
        }
        return media.url;
    };

    useEffect(() => {
        fetchMedia();
    }, [searchTerm, selectedCategory]);

    if (loading && mediaList.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Modern Medya Kütüphanesi</h3>
                    {showUpload && (
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Yükle
                        </button>
                    )}
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Medya ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                    <div className="mt-4 space-y-2">
                        {Object.entries(uploadProgress).map(([filename, info]) => (
                            <div key={filename} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="truncate">{filename}</span>
                                        <span className="text-gray-600">{info.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                info.status === 'completed' ? 'bg-green-600' :
                                                info.status === 'failed' ? 'bg-red-600' :
                                                'bg-blue-600'
                                            }`}
                                            style={{ width: `${info.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="text-gray-600">
                                    {info.status === 'completed' && '✅'}
                                    {info.status === 'failed' && '❌'}
                                    {info.status === 'uploading' && '⏳'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Media Grid */}
            <div className="p-4">
                {mediaList.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📁</div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Medya bulunamadı</h4>
                        <p className="text-gray-600 mb-4">İlk medyanızı yükleyin</p>
                        {showUpload && (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Medya Yükle
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mediaList.map((media) => (
                            <div
                                key={media.id}
                                onClick={() => handleSelectMedia(media)}
                                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                                    selectedItems === media.id || selectedItems?.includes(media.id)
                                        ? 'border-red-600'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="aspect-square relative bg-gray-100">
                                    <img
                                        src={getResponsiveImageUrl(media, 'medium')}
                                        alt={media.alt || media.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af"%3EResim%3C/text%3E%3C/svg%3E';
                                        }}
                                    />

                                    {/* Selection Indicator */}
                                    {(selectedItems === media.id || selectedItems?.includes(media.id)) && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                                        {categories.find(c => c.value === media.category)?.icon || '📁'}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                                        <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                                            <p className="text-xs font-medium truncate">{media.title}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs opacity-75">
                                                    {media.width}×{media.height}
                                                </span>
                                                <span className="text-xs opacity-75">
                                                    {(media.size / 1024).toFixed(1)}KB
                                                </span>
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePreview(media);
                                                    }}
                                                    className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30"
                                                    title="Önizle"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                {media.views > 0 && (
                                                    <span className="text-xs">
                                                        👁️ {media.views}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            {multiple && selectedItems?.length > 0 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        {selectedItems.length} medya seçildi
                    </span>
                    <button
                        onClick={handleConfirmSelection}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Seçimi Onayla
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Modern Medya Yükle</h3>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="enhanced-media-upload"
                                disabled={uploadLoading}
                            />
                            <label htmlFor="enhanced-media-upload" className="cursor-pointer">
                                {uploadLoading ? (
                                    <div>
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Yükleniyor...</p>
                                    </div>
                                ) : (
                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600">Medya yüklemek için tıklayın</p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, WebP, AVIF (max. 50MB)<br/>
                                            Cloudinary optimizasyonu ile
                                        </p>
                                        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-blue-600">
                                            <span>✨ Otomatik optimizasyon</span>
                                            <span>•</span>
                                            <span>📱 Responsive</span>
                                            <span>•</span>
                                            <span>☁️ CDN</span>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                disabled={uploadLoading}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewMedia && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Medya Önizleme</h3>
                            <button
                                onClick={() => setPreviewMedia(null)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-gray-100 rounded-lg p-8">
                                <img
                                    src={previewMedia.secureUrl}
                                    alt={previewMedia.alt || previewMedia.title}
                                    className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
                                />
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{previewMedia.title}</h4>
                                    <p className="text-gray-600 text-sm">{previewMedia.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Boyut:</span>
                                        <span className="font-medium">{previewMedia.width} × {previewMedia.height}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Format:</span>
                                        <span className="font-medium">{previewMedia.format?.toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Boyut:</span>
                                        <span className="font-medium">{(previewMedia.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Kategori:</span>
                                        <span className="font-medium">
                                            {categories.find(c => c.value === previewMedia.category)?.label}
                                        </span>
                                    </div>
                                </div>

                                {previewMedia.tags.length > 0 && (
                                    <div>
                                        <span className="text-gray-600 text-sm">Etiketler:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {previewMedia.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModernMediaLibrary;