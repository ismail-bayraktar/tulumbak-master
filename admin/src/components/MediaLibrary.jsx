import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const MediaLibrary = ({ token, onSelectMedia, selectedMediaId, multiple = false }) => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState(multiple ? [] : null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showUploadModal, setShowUploadModal] = useState(false);

    const categories = [
        { value: 'all', label: 'Tümü' },
        { value: 'slider', label: 'Slider' },
        { value: 'product', label: 'Ürün' },
        { value: 'blog', label: 'Blog' },
        { value: 'general', label: 'Genel' },
        { value: 'logo', label: 'Logo' },
        { value: 'banner', label: 'Banner' }
    ];

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const params = {};

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
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        setUploadLoading(true);

        try {
            for (let file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', selectedCategory === 'all' ? 'general' : selectedCategory);
                formData.append('folder', 'uploads');

                const response = await axios.post(`${backendUrl}/api/media/upload`, formData, {
                    headers: {
                        token,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    toast.success(`${file.name} yüklendi`);
                }
            }

            fetchMedia();
            setShowUploadModal(false);
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
                    <h3 className="text-lg font-semibold text-gray-900">Medya Kütüphanesi</h3>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yükle
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Medya ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Media Grid */}
            <div className="p-4">
                {mediaList.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📁</div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Medya bulunamadı</h4>
                        <p className="text-gray-600 mb-4">İlk medyanızı yükleyin</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Medya Yükle
                        </button>
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
                                    {media.mimetype.startsWith('image/') ? (
                                        <img
                                            src={media.url.startsWith('http') ? media.url : `${backendUrl}${media.url}`}
                                            alt={media.alt || media.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                // Fallback to base64 if direct URL fails
                                                e.target.src = `${backendUrl}/api/media/${media.id}/base64`;
                                                e.target.onerror = () => {
                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af"%3EResim%3C/text%3E%3C/svg%3E';
                                                };
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="text-gray-400 text-4xl mb-2">📄</div>
                                                <p className="text-xs text-gray-600">{media.mimetype}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Selection Indicator */}
                                    {(selectedItems === media.id || selectedItems?.includes(media.id)) && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-end">
                                        <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-xs font-medium truncate">{media.title}</p>
                                            <p className="text-xs opacity-75">{(media.size / 1024).toFixed(1)} KB</p>
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
                        <h3 className="text-lg font-semibold mb-4">Medya Yükle</h3>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Yükleniyor...</p>
                                    </div>
                                ) : (
                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600">Medya yüklemek için tıklayın</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (max. 10MB)</p>
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
        </div>
    );
};

export default MediaLibrary;