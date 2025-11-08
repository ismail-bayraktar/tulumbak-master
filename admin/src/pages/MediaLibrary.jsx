import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Upload, Search, Filter, Trash2, Edit, Eye, Image as ImageIcon, X, Check } from 'lucide-react';

const MediaLibraryPage = ({ token }) => {
    const { isDarkMode } = useTheme();
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [previewMedia, setPreviewMedia] = useState(null);
    const [editingMedia, setEditingMedia] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMedia, setSelectedMedia] = useState([]);

    const categories = [
        { value: 'all', label: 'Tümü' },
        { value: 'slider', label: 'Slider' },
        { value: 'product', label: 'Ürün' },
        { value: 'blog', label: 'Blog' },
        { value: 'general', label: 'Genel' },
        { value: 'logo', label: 'Logo' },
        { value: 'banner', label: 'Banner' },
        { value: 'category', label: 'Kategori' },
        { value: 'user', label: 'Kullanıcı' }
    ];

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: 20
            };

            if (searchTerm) params.search = searchTerm;
            if (selectedCategory !== 'all') params.category = selectedCategory;

            const response = await axios.get(`${backendUrl}/api/media/list`, {
                params,
                headers: { token }
            });

            if (response.data.success) {
                setMediaList(response.data.media);
                if (response.data.pagination) {
                    setTotalPages(response.data.pagination.pages);
                }
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
            
            // Close modal only if all uploads succeeded
            if (uploadResults.every(r => r.success)) {
                setShowUploadModal(false);
            }
        } catch (error) {
            toast.error('Dosya yükleme işlemi başarısız oldu');
            console.error('Upload error:', error);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDelete = async (mediaId) => {
        if (!window.confirm('Bu medyayı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/api/media/${mediaId}`, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Medya silindi');
                fetchMedia();
            } else {
                toast.error('Medya silinemedi');
            }
        } catch (error) {
            toast.error('Medya silinemedi');
            console.error('Delete error:', error);
        }
    };

    const handleUpdate = async (mediaId, updateData) => {
        try {
            const response = await axios.put(`${backendUrl}/api/media/${mediaId}`, updateData, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Medya güncellendi');
                setEditingMedia(null);
                fetchMedia();
            } else {
                toast.error('Medya güncellenemedi');
            }
        } catch (error) {
            toast.error('Medya güncellenemedi');
            console.error('Update error:', error);
        }
    };

    const toggleSelectMedia = (mediaId) => {
        setSelectedMedia(prev => 
            prev.includes(mediaId) 
                ? prev.filter(id => id !== mediaId)
                : [...prev, mediaId]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedMedia.length === 0) return;
        
        if (!window.confirm(`${selectedMedia.length} medyayı silmek istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            await Promise.all(
                selectedMedia.map(mediaId => 
                    axios.delete(`${backendUrl}/api/media/${mediaId}`, {
                        headers: { token }
                    })
                )
            );
            toast.success(`${selectedMedia.length} medya silindi`);
            setSelectedMedia([]);
            fetchMedia();
        } catch (error) {
            toast.error('Medyalar silinemedi');
            console.error('Bulk delete error:', error);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [searchTerm, selectedCategory, page]);

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medya Kütüphanesi</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Tüm medya dosyalarınızı yönetin
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Upload className="w-5 h-5" />
                    Medya Yükle
                </button>
            </div>

            {/* Filters */}
            <div className="card dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
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
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedMedia.length > 0 && (
                    <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-primary-800 dark:text-primary-200">
                            {selectedMedia.length} medya seçildi
                        </span>
                        <button
                            onClick={handleBulkDelete}
                            className="btn-danger text-sm flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Seçilenleri Sil
                        </button>
                    </div>
                )}
            </div>

            {/* Media Grid */}
            {loading && mediaList.length === 0 ? (
                <div className="card dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400"></div>
                    </div>
                </div>
            ) : mediaList.length === 0 ? (
                <div className="card dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Medya bulunamadı</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">İlk medyanızı yükleyin</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="btn-primary"
                        >
                            Medya Yükle
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {mediaList.map((media) => (
                            <div
                                key={media.id}
                                    className={`relative group card dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer transition-all ${
                                        selectedMedia.includes(media.id)
                                            ? 'ring-2 ring-primary-500 border-primary-500'
                                            : ''
                                    }`}
                                >
                                {/* Selection Checkbox */}
                                <div className="absolute top-2 left-2 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelectMedia(media.id);
                                        }}
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                            selectedMedia.includes(media.id)
                                                ? 'bg-primary-600 border-primary-600'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        {selectedMedia.includes(media.id) && (
                                            <Check className="w-4 h-4 text-white" />
                                        )}
                                    </button>
                                </div>

                                {/* Image */}
                                <div className="aspect-square relative bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                    {media.mimetype.startsWith('image/') ? (
                                        <img
                                            src={media.url.startsWith('http') ? media.url : `${backendUrl}${media.url}`}
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
                                            <div className="text-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{media.mimetype}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewMedia(media);
                                            }}
                                            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Önizle"
                                        >
                                            <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingMedia(media);
                                            }}
                                            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Düzenle"
                                        >
                                            <Edit className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(media.id);
                                            }}
                                            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        </button>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                                        {categories.find(c => c.value === media.category)?.label || 'Genel'}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-2">
                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={media.title}>
                                        {media.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(media.size)}
                                        {media.width && media.height && ` • ${media.width}×${media.height}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Önceki
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                Sayfa {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Sonraki
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medya Yükle</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="media-upload"
                                disabled={uploadLoading}
                            />
                            <label htmlFor="media-upload" className="cursor-pointer">
                                {uploadLoading ? (
                                    <div>
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400 mx-auto mb-4"></div>
                                        <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Medya yüklemek için tıklayın
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG, GIF (max. 10MB)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewMedia && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medya Önizleme</h3>
                            <button
                                onClick={() => setPreviewMedia(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 mb-6">
                                <img
                                    src={previewMedia.url.startsWith('http') ? previewMedia.url : `${backendUrl}${previewMedia.url}`}
                                    alt={previewMedia.alt || previewMedia.title}
                                    className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
                                    onError={(e) => {
                                        e.target.src = `${backendUrl}/api/media/${previewMedia.id}/base64`;
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{previewMedia.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{previewMedia.description || 'Açıklama yok'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Boyut: </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {previewMedia.width && previewMedia.height 
                                                ? `${previewMedia.width} × ${previewMedia.height}`
                                                : 'Bilinmiyor'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Dosya Boyutu: </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatFileSize(previewMedia.size)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Kategori: </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {categories.find(c => c.value === previewMedia.category)?.label || 'Genel'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Format: </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {previewMedia.mimetype}
                                        </span>
                                    </div>
                                </div>

                                {previewMedia.tags && previewMedia.tags.length > 0 && (
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Etiketler: </span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {previewMedia.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
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

            {/* Edit Modal */}
            {editingMedia && (
                <EditMediaModal
                    media={editingMedia}
                    onClose={() => setEditingMedia(null)}
                    onSave={(updateData) => handleUpdate(editingMedia.id, updateData)}
                />
            )}
        </div>
    );
};

// Edit Media Modal Component
const EditMediaModal = ({ media, onClose, onSave }) => {
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        title: media.title || '',
        alt: media.alt || '',
        description: media.description || '',
        category: media.category || 'general',
        tags: media.tags ? media.tags.join(', ') : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const updateData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        onSave(updateData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medya Düzenle</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Başlık
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Alt Text
                        </label>
                        <input
                            type="text"
                            value={formData.alt}
                            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Açıklama
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Kategori
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="general">Genel</option>
                            <option value="product">Ürün</option>
                            <option value="slider">Slider</option>
                            <option value="blog">Blog</option>
                            <option value="logo">Logo</option>
                            <option value="banner">Banner</option>
                            <option value="category">Kategori</option>
                            <option value="user">Kullanıcı</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Etiketler (virgülle ayırın)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="etiket1, etiket2, etiket3"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MediaLibraryPage;

