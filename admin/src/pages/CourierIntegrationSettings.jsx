import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import { 
    Settings, 
    Plus, 
    Edit, 
    Trash2, 
    TestTube, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Key,
    Globe,
    ToggleLeft,
    ToggleRight,
    Save,
    Copy,
    Eye,
    EyeOff
} from 'lucide-react';

// Get webhook URL from environment or use default
const getWebhookUrl = () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || backendUrl || 'https://api.tulumbak.com';
    return `${baseUrl}/api/webhook/courier`;
};

const CourierIntegrationSettings = ({ token }) => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [showSecretKey, setShowSecretKey] = useState({});
    const [formData, setFormData] = useState({
        platform: '',
        name: '',
        secretKey: '',
        webhookUrl: getWebhookUrl(),
        enabled: true,
        events: [],
        rateLimit: {
            perMinute: 100,
            perHour: 1000
        },
        retryConfig: {
            maxRetries: 3,
            retryDelay: 1000
        },
        metadata: {}
    });

    const eventTypes = [
        'order.status.updated',
        'order.delivered',
        'order.failed',
        'order.cancelled',
        'order.assigned',
        'courier.location.updated'
    ];

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/webhook-config/list`, {
                headers: { token }
            });
            if (response.data.success) {
                setConfigs(response.data.configs);
            }
        } catch (error) {
            toast.error('Ayarlar yüklenirken hata oluştu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const url = editingConfig 
                ? `${backendUrl}/api/webhook-config/update/${editingConfig._id}`
                : `${backendUrl}/api/webhook-config/create`;
            
            const method = editingConfig ? 'put' : 'post';
            
            const response = await axios[method](url, formData, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success(editingConfig ? 'Ayarlar güncellendi' : 'Yeni entegrasyon eklendi');
                setShowModal(false);
                setEditingConfig(null);
                resetForm();
                fetchConfigs();
            } else {
                toast.error(response.data.message || 'Bir hata oluştu');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (config) => {
        setEditingConfig(config);
        setFormData({
            platform: config.platform,
            name: config.name,
            secretKey: '', // Don't populate secret key for security
            webhookUrl: config.webhookUrl,
            enabled: config.enabled,
            events: config.events || [],
            rateLimit: config.rateLimit || { perMinute: 100, perHour: 1000 },
            retryConfig: config.retryConfig || { maxRetries: 3, retryDelay: 1000 },
            metadata: config.metadata || {}
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu entegrasyonu silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/api/webhook-config/delete/${id}`, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Entegrasyon silindi');
                fetchConfigs();
            } else {
                toast.error(response.data.message || 'Silme işlemi başarısız');
            }
        } catch (error) {
            toast.error('Silme işlemi sırasında hata oluştu');
            console.error(error);
        }
    };

    const handleTest = async (id) => {
        try {
            const response = await axios.post(`${backendUrl}/api/webhook-config/test/${id}`, {}, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Test başarılı');
                fetchConfigs();
            } else {
                toast.error(response.data.message || 'Test başarısız');
            }
        } catch (error) {
            toast.error('Test sırasında hata oluştu');
            console.error(error);
        }
    };

    const toggleEnabled = async (config) => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/webhook-config/update/${config._id}`,
                { enabled: !config.enabled },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(config.enabled ? 'Entegrasyon devre dışı bırakıldı' : 'Entegrasyon aktif edildi');
                fetchConfigs();
            }
        } catch (error) {
            toast.error('Güncelleme sırasında hata oluştu');
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            platform: '',
            name: '',
            secretKey: '',
            webhookUrl: getWebhookUrl(),
            enabled: true,
            events: [],
            rateLimit: {
                perMinute: 100,
                perHour: 1000
            },
            retryConfig: {
                maxRetries: 3,
                retryDelay: 1000
            },
            metadata: {}
        });
        setEditingConfig(null);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Kopyalandı!');
    };

    const toggleEvent = (event) => {
        setFormData(prev => ({
            ...prev,
            events: prev.events.includes(event)
                ? prev.events.filter(e => e !== event)
                : [...prev.events, event]
        }));
    };

    if (loading && configs.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kurye Entegrasyon Ayarları</h1>
                    <p className="text-gray-600 mt-1">Kurye paneli webhook entegrasyonlarını yönetin</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Entegrasyon
                </button>
            </div>

            {/* Webhook URL Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1">Webhook Endpoint URL</h3>
                        <p className="text-sm text-blue-700 mb-2">
                            Kurye paneli yazılımcısına vereceğiniz webhook URL'i:
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-200 text-sm">
                                {getWebhookUrl()}
                            </code>
                            <button
                                onClick={() => copyToClipboard(getWebhookUrl())}
                                className="p-2 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                            >
                                <Copy className="w-4 h-4 text-blue-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configs List */}
            {configs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Henüz entegrasyon eklenmemiş</p>
                    <p className="text-sm text-gray-400">Yeni entegrasyon eklemek için yukarıdaki butona tıklayın</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {configs.map((config) => (
                        <div key={config._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">{config.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            config.enabled 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {config.enabled ? 'Aktif' : 'Pasif'}
                                        </span>
                                        {config.lastTestStatus && (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                                config.lastTestStatus === 'success'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {config.lastTestStatus === 'success' ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                Test: {config.lastTestStatus === 'success' ? 'Başarılı' : 'Başarısız'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        <span className="font-medium">Platform:</span> {config.platform}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Webhook URL</p>
                                            <p className="text-sm font-medium text-gray-800 truncate">{config.webhookUrl}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Event Sayısı</p>
                                            <p className="text-sm font-medium text-gray-800">{config.events?.length || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Rate Limit</p>
                                            <p className="text-sm font-medium text-gray-800">{config.rateLimit?.perMinute || 100}/dakika</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Secret Key</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {config.hasSecretKey ? (
                                                    <span className="text-green-600">✓ Yapılandırılmış</span>
                                                ) : (
                                                    <span className="text-red-600">✗ Eksik</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {config.events && config.events.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-500 mb-2">Aktif Event'ler:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {config.events.map((event) => (
                                                    <span key={event} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                                        {event}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => toggleEnabled(config)}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                                        title={config.enabled ? 'Devre Dışı Bırak' : 'Aktif Et'}
                                    >
                                        {config.enabled ? (
                                            <ToggleRight className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleTest(config._id)}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                                        title="Test Et"
                                    >
                                        <TestTube className="w-5 h-5 text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(config)}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                                        title="Düzenle"
                                    >
                                        <Edit className="w-5 h-5 text-orange-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(config._id)}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingConfig ? 'Entegrasyon Düzenle' : 'Yeni Entegrasyon Ekle'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Platform Identifier *
                                </label>
                                <input
                                    type="text"
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value.toLowerCase() })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="courier-panel-v1"
                                    required
                                    disabled={!!editingConfig}
                                />
                                <p className="text-xs text-gray-500 mt-1">Benzersiz platform tanımlayıcısı (değiştirilemez)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Platform Adı *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Kurye Paneli v1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Secret Key {!editingConfig && '*'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showSecretKey[editingConfig?._id || 'new'] ? 'text' : 'password'}
                                        value={formData.secretKey}
                                        onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                                        placeholder={editingConfig ? 'Değiştirmek için yeni key girin' : 'sk_live_...'}
                                        required={!editingConfig}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecretKey(prev => ({
                                            ...prev,
                                            [editingConfig?._id || 'new']: !prev[editingConfig?._id || 'new']
                                        }))}
                                        className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded"
                                    >
                                        {showSecretKey[editingConfig?._id || 'new'] ? (
                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Kurye panelinden alınan secret key</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Webhook URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.webhookUrl}
                                    onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="https://api.tulumbak.com/api/webhook/courier"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Tipleri
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {eventTypes.map((event) => (
                                        <label key={event} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.events.includes(event)}
                                                onChange={() => toggleEvent(event)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">{event}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rate Limit (Dakika)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.rateLimit.perMinute}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            rateLimit: { ...formData.rateLimit, perMinute: parseInt(e.target.value) }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rate Limit (Saat)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.rateLimit.perHour}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            rateLimit: { ...formData.rateLimit, perHour: parseInt(e.target.value) }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="enabled"
                                    checked={formData.enabled}
                                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                    className="rounded"
                                />
                                <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                                    Entegrasyonu Aktif Et
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourierIntegrationSettings;

