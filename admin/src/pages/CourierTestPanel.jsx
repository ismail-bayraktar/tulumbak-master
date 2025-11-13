import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import {
    Activity,
    Package,
    Truck,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Settings,
    Beaker,
    Send,
    Zap,
    Database,
    Key,
    Server,
    Globe,
    Shield,
    TrendingUp,
    Clock,
    BarChart3,
    Eye,
    EyeOff
} from 'lucide-react';

const CourierTestPanel = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboard, setDashboard] = useState(null);
    const [showSecrets, setShowSecrets] = useState({
        apiKey: false,
        webhookSecret: false,
        apiSecret: false
    });
    // Load config from localStorage or use defaults
    const getInitialConfig = () => {
        try {
            const savedConfig = localStorage.getItem('courierTestPanelConfig');
            if (savedConfig) {
                return JSON.parse(savedConfig);
            }
        } catch (error) {
            console.error('localStorage okuma hatası:', error);
        }
        return {
            platform: 'muditakurye',
            enabled: true,
            testMode: true,
            apiKey: '',
            apiSecret: '',
            restaurantId: '',
            webhookSecret: '',
            apiUrl: 'https://api.muditakurye.com.tr',
            webhookOnlyMode: false
        };
    };

    const [config, setConfig] = useState(getInitialConfig());
    const [testResults, setTestResults] = useState({});
    const [logs, setLogs] = useState([]);

    // Save config to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('courierTestPanelConfig', JSON.stringify(config));
        } catch (error) {
            console.error('localStorage yazma hatası:', error);
        }
    }, [config]);

    // Dashboard verilerini yükle
    const loadDashboard = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/courier-integration/dashboard`,
                { headers: { token } }
            );
            if (response.data.success) {
                setDashboard(response.data);
            }
        } catch (error) {
            console.error('Dashboard yüklenemedi:', error);
            addLog('error', 'Dashboard yüklenemedi', error.response?.data?.error || error.message);
        }
    };

    // Mevcut konfigürasyonu yükle
    const loadConfig = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/courier-integration/configs/muditakurye`,
                { headers: { token } }
            );
            if (response.data && response.data.config) {
                const loadedConfig = { ...response.data.config };

                // Encrypted değerleri gösterme - sadece placeholder
                if (loadedConfig.apiKey?.startsWith('enc:')) {
                    loadedConfig.apiKey = ''; // Boş bırak, kullanıcı değiştirmek isterse doldurur
                }
                if (loadedConfig.webhookSecret?.startsWith('enc:')) {
                    loadedConfig.webhookSecret = ''; // Boş bırak
                }

                setConfig(prev => ({ ...prev, ...loadedConfig }));
                addLog('success', 'Konfigürasyon yüklendi');
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                addLog('error', 'Konfigürasyon yüklenirken hata', error.response?.data?.message || error.message);
            } else {
                addLog('info', 'Henüz konfigürasyon yok, yeni oluşturulacak');
            }
        }
    };

    // Konfigürasyonu kaydet
    const saveConfig = async () => {
        setLoading(true);
        try {
            // Boş encrypted alanları gönderme - backend'deki mevcut değeri korusun
            const configToSave = { ...config };
            if (!configToSave.apiKey || configToSave.apiKey.trim() === '') {
                delete configToSave.apiKey; // Backend mevcut encrypted değeri korur
            }
            if (!configToSave.webhookSecret || configToSave.webhookSecret.trim() === '') {
                delete configToSave.webhookSecret; // Backend mevcut encrypted değeri korur
            }

            const response = await axios.put(
                `${backendUrl}/api/admin/courier-integration/configs/muditakurye`,
                configToSave,
                { headers: { token } }
            );
            toast.success('✅ Konfigürasyon kaydedildi!');
            addLog('success', 'Konfigürasyon kaydedildi', response.data);
            loadDashboard();
            loadConfig(); // Config'i yeniden yükle
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            toast.error('❌ Hata: ' + errorMsg);
            addLog('error', 'Konfigürasyon kayıt hatası', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Konfigürasyonu doğrula
    const validateConfig = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/courier-integration/validate/muditakurye`,
                {},
                { headers: { token } }
            );
            setTestResults({ validate: response.data.validation });

            if (response.data.validation?.valid) {
                toast.success('✅ Konfigürasyon geçerli!');
                addLog('success', 'Konfigürasyon doğrulandı', response.data.validation);
            } else {
                toast.warning('⚠️ Konfigürasyonda sorunlar var');
                addLog('warning', 'Konfigürasyon uyarıları', response.data.validation);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            toast.error('❌ Doğrulama hatası: ' + errorMsg);
            addLog('error', 'Doğrulama hatası', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Test siparişi gönder
    const sendTestOrder = async () => {
        if (!config.testMode) {
            toast.error('❌ Test modu aktif değil! Lütfen önce test modunu açın.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/courier-integration/test-order/muditakurye`,
                {
                    customerName: 'Test Müşteri',
                    customerPhone: '+905551234567',
                    deliveryAddress: 'Test Adres, İstanbul, Türkiye',
                    items: [
                        { name: 'Test Ürün 1', quantity: 2, price: 50 }
                    ],
                    totalAmount: 100
                },
                { headers: { token } }
            );
            setTestResults({ testOrder: response.data });
            toast.success('✅ Test siparişi gönderildi!');
            addLog('success', 'Test siparişi başarıyla oluşturuldu', response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            toast.error('❌ Hata: ' + errorMsg);
            addLog('error', 'Test siparişi hatası', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Webhook simülasyonu
    const testWebhook = async (status) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/courier-integration/test-webhook/muditakurye`,
                {
                    event: 'order.status_changed',
                    orderId: 'TEST_ORDER_001',
                    status: status,
                    courierName: 'Test Kurye',
                    courierPhone: '+905559876543'
                },
                { headers: { token } }
            );
            toast.success(`✅ Webhook simülasyonu: ${status}`);
            addLog('success', `Webhook simülasyonu: ${status}`, response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            toast.error('❌ Webhook hatası: ' + errorMsg);
            addLog('error', 'Webhook hatası', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Sağlık kontrolü
    const checkHealth = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/courier-integration/health/muditakurye`,
                { headers: { token } }
            );
            setTestResults({ health: response.data });

            const healthStatus = response.data.health?.status;
            if (healthStatus === 'healthy') {
                toast.success('✅ Entegrasyon sağlıklı!');
                addLog('success', 'Sağlık kontrolü başarılı', response.data);
            } else if (healthStatus === 'degraded') {
                toast.info('⚠️ Entegrasyon kısmen çalışıyor (test mode)');
                addLog('info', 'Sağlık kontrolü: degraded', response.data);
            } else {
                toast.warning('⚠️ Entegrasyon sorunları tespit edildi');
                addLog('warning', 'Sağlık kontrolü uyarıları', response.data);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            toast.error('❌ Sağlık kontrolü hatası: ' + errorMsg);
            addLog('error', 'Sağlık kontrolü hatası', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Log ekle
    const addLog = (type, message, data = null) => {
        setLogs(prev => [{
            type,
            message,
            data,
            timestamp: new Date().toLocaleString('tr-TR')
        }, ...prev].slice(0, 50));
    };

    useEffect(() => {
        loadDashboard();
        loadConfig();
    }, []);

    const toggleSecret = (field) => {
        setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-6 md:p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
                            <Truck className="w-8 h-8 md:w-10 md:h-10" />
                            Esnaf Express Kurye Entegrasyonu
                        </h1>
                        <p className="text-primary-100 dark:text-primary-200">
                            Gerçek sipariş takibi ve kurye yönetimi
                        </p>
                    </div>
                    <button
                        onClick={loadDashboard}
                        className="btn-secondary inline-flex items-center gap-2 self-start md:self-center"
                    >
                        <RefreshCw size={18} />
                        <span className="hidden sm:inline">Yenile</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="card">
                <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-semibold transition-colors ${
                            activeTab === 'dashboard'
                                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        <BarChart3 size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-semibold transition-colors ${
                            activeTab === 'config'
                                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        <Settings size={18} />
                        <span className="hidden sm:inline">Konfigürasyon</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-semibold transition-colors ${
                            activeTab === 'logs'
                                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        <Activity size={18} />
                        <span className="hidden sm:inline">Loglar</span>
                        {logs.length > 0 && (
                            <span className="badge badge-primary">{logs.length}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Status Card */}
                    <div className="stats-card dark:stats-card-dark group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                {dashboard?.config?.enabled ? (
                                    <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Entegrasyon Durumu</p>
                            <p className={`text-xl font-bold ${dashboard?.config?.enabled ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                                {dashboard?.config?.enabled ? 'Aktif' : 'Pasif'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Test Modu: {dashboard?.config?.testMode ? 'Açık' : 'Kapalı'}
                            </p>
                        </div>
                    </div>

                    {/* Circuit Breaker Card */}
                    <div className="stats-card dark:stats-card-dark group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Circuit Breaker</p>
                            <p className={`text-xl font-bold ${
                                dashboard?.circuitBreaker?.state === 'closed' ? 'text-success-600 dark:text-success-400' :
                                dashboard?.circuitBreaker?.state === 'open' ? 'text-danger-600 dark:text-danger-400' :
                                'text-warning-600 dark:text-warning-400'
                            }`}>
                                {dashboard?.circuitBreaker?.state?.toUpperCase() || 'CLOSED'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Başarısızlık: {dashboard?.circuitBreaker?.failures || 0}
                            </p>
                        </div>
                    </div>

                    {/* Retry Queue Card */}
                    <div className="stats-card dark:stats-card-dark group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <RefreshCw className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Retry Kuyruğu</p>
                            <p className="text-xl font-bold text-secondary-600 dark:text-secondary-400">
                                {dashboard?.retryQueue?.pending || 0}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                İşleniyor: {dashboard?.retryQueue?.processing || 0}
                            </p>
                        </div>
                    </div>

                    {/* DLQ Card */}
                    <div className="stats-card dark:stats-card-dark group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-danger-100 dark:bg-danger-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Dead Letter Queue</p>
                            <p className="text-xl font-bold text-danger-600 dark:text-danger-400">
                                {dashboard?.dlq?.count || 0}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Yüksek Öncelik: {dashboard?.dlq?.highPriority || 0}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Esnaf Express API Konfigürasyonu</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="form-label dark:form-label-dark">
                                <Server size={16} className="inline mr-2" />
                                API URL
                            </label>
                            <input
                                type="text"
                                value={config.apiUrl}
                                onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                                className="form-input dark:form-input-dark"
                                placeholder="https://api.muditakurye.com.tr"
                            />
                        </div>

                        <div>
                            <label className="form-label dark:form-label-dark">
                                <Key size={16} className="inline mr-2" />
                                API Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.apiKey ? 'text' : 'password'}
                                    value={config.apiKey}
                                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                    className="form-input dark:form-input-dark pr-10"
                                    placeholder={config.apiKey ? "••••••••••••" : "Mevcut key korunuyor (değiştirmek için yeni key girin)"}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleSecret('apiKey')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showSecrets.apiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {!config.apiKey && (
                                <p className="mt-1 text-xs text-info-600 dark:text-info-400">
                                    ℹ️ API Key güvenle saklanıyor. Değiştirmek için yeni key girin.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="form-label dark:form-label-dark">
                                <Package size={16} className="inline mr-2" />
                                Restaurant ID
                            </label>
                            <input
                                type="text"
                                value={config.restaurantId}
                                onChange={(e) => setConfig({ ...config, restaurantId: e.target.value })}
                                className="form-input dark:form-input-dark"
                                placeholder="rest_YOUR_RESTAURANT_ID"
                            />
                        </div>

                        <div>
                            <label className="form-label dark:form-label-dark">
                                <Shield size={16} className="inline mr-2" />
                                Webhook Secret
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.webhookSecret ? 'text' : 'password'}
                                    value={config.webhookSecret}
                                    onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
                                    className="form-input dark:form-input-dark pr-10"
                                    placeholder={config.webhookSecret ? "••••••••••••" : "Mevcut secret korunuyor (değiştirmek için yeni secret girin)"}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleSecret('webhookSecret')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showSecrets.webhookSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {!config.webhookSecret && (
                                <p className="mt-1 text-xs text-info-600 dark:text-info-400">
                                    ℹ️ Webhook Secret güvenle saklanıyor. Değiştirmek için yeni secret girin.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="form-label dark:form-label-dark">
                                <Key size={16} className="inline mr-2" />
                                API Secret (Opsiyonel)
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.apiSecret ? 'text' : 'password'}
                                    value={config.apiSecret || ''}
                                    onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
                                    className="form-input dark:form-input-dark pr-10"
                                    placeholder="your_api_secret_if_required"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleSecret('apiSecret')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showSecrets.apiSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.enabled}
                                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.testMode}
                                onChange={(e) => setConfig({ ...config, testMode: e.target.checked })}
                                className="w-5 h-5 text-warning-600 rounded focus:ring-warning-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Modu</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.webhookOnlyMode}
                                onChange={(e) => setConfig({ ...config, webhookOnlyMode: e.target.checked })}
                                className="w-5 h-5 text-secondary-600 rounded focus:ring-secondary-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sadece Webhook Modu</span>
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={saveConfig}
                            disabled={loading}
                            className="btn-success inline-flex items-center gap-2 disabled:opacity-50"
                        >
                            <Database size={18} />
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>

                        <button
                            onClick={validateConfig}
                            disabled={loading}
                            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                        >
                            <CheckCircle size={18} />
                            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
                        </button>

                        <button
                            onClick={checkHealth}
                            disabled={loading}
                            className="btn-secondary inline-flex items-center gap-2 disabled:opacity-50"
                        >
                            <Activity size={18} />
                            {loading ? 'Kontrol Ediliyor...' : 'Sağlık Kontrolü'}
                        </button>
                    </div>

                    {/* Validation Results */}
                    {testResults.validate && (
                        <div className={`mt-6 p-4 rounded-lg border ${
                            testResults.validate.valid
                                ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                                : 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800'
                        }`}>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                {testResults.validate.valid ? (
                                    <CheckCircle size={20} className="text-success-600" />
                                ) : (
                                    <AlertTriangle size={20} className="text-warning-600" />
                                )}
                                Doğrulama Sonuçları
                            </h3>
                            {testResults.validate.errors?.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-danger-600 dark:text-danger-400 font-semibold mb-2 text-sm">Hatalar:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {testResults.validate.errors.map((err, i) => (
                                            <li key={i} className="text-danger-600 dark:text-danger-400 text-sm">{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {testResults.validate.warnings?.length > 0 && (
                                <div>
                                    <p className="text-warning-600 dark:text-warning-400 font-semibold mb-2 text-sm">Uyarılar:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {testResults.validate.warnings.map((warn, i) => (
                                            <li key={i} className="text-warning-600 dark:text-warning-400 text-sm">{warn}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {testResults.validate.valid && !testResults.validate.errors?.length && (
                                <p className="text-success-600 dark:text-success-400 text-sm">✅ Tüm ayarlar geçerli!</p>
                            )}
                        </div>
                    )}

                    {/* Health Check Results */}
                    {testResults.health && (
                        <div className={`mt-6 p-4 rounded-lg border ${
                            testResults.health.healthy
                                ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                                : 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800'
                        }`}>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                {testResults.health.healthy ? (
                                    <CheckCircle size={20} className="text-success-600" />
                                ) : (
                                    <XCircle size={20} className="text-danger-600" />
                                )}
                                Sağlık Durumu
                            </h3>
                            <div className="space-y-2">
                                {testResults.health.checks?.map((check, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        {check.status === 'pass' ? (
                                            <CheckCircle size={16} className="text-success-600" />
                                        ) : (
                                            <XCircle size={16} className="text-danger-600" />
                                        )}
                                        <span className="text-gray-700 dark:text-gray-300">{check.name}: {check.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Test Order */}
                    <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1 flex items-center gap-2">
                                    <Package size={20} />
                                    Hızlı Entegrasyon Testi
                                </h3>
                                <p className="text-sm text-primary-700 dark:text-primary-300">
                                    Esnaf Express API'ye test siparişi göndererek entegrasyonu kontrol edin
                                </p>
                            </div>
                            <button
                                onClick={sendTestOrder}
                                disabled={loading || !config.testMode}
                                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                            >
                                <Send size={18} />
                                {loading ? 'Gönderiliyor...' : 'Test Siparişi Gönder'}
                            </button>
                        </div>
                        {!config.testMode && (
                            <p className="mt-3 text-warning-600 dark:text-warning-400 text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Test modu aktif değil! Test modunu açın.
                            </p>
                        )}
                        {testResults.testOrder && (
                            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-primary-200 dark:border-primary-700">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Test Sonucu:</p>
                                <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-40">
                                    {JSON.stringify(testResults.testOrder, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">İşlem Logları</h2>
                        {logs.length > 0 && (
                            <button
                                onClick={() => setLogs([])}
                                className="btn-secondary text-sm"
                            >
                                Temizle
                            </button>
                        )}
                    </div>
                    <div className="space-y-3">
                        {logs.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">Henüz log yok</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                    Bir işlem yaptığınızda loglar burada görünecek
                                </p>
                            </div>
                        ) : (
                            logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border transition-all ${
                                        log.type === 'success' ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800' :
                                        log.type === 'error' ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800' :
                                        log.type === 'warning' ? 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800' :
                                        'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {log.type === 'success' && <CheckCircle size={20} className="text-success-600 dark:text-success-400" />}
                                            {log.type === 'error' && <XCircle size={20} className="text-danger-600 dark:text-danger-400" />}
                                            {log.type === 'warning' && <AlertTriangle size={20} className="text-warning-600 dark:text-warning-400" />}
                                            {log.type === 'info' && <Activity size={20} className="text-primary-600 dark:text-primary-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                <span className="font-semibold text-gray-900 dark:text-white">{log.message}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {log.timestamp}
                                                </span>
                                            </div>
                                            {log.data && (
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                                                        Detayları Göster
                                                    </summary>
                                                    <pre className="mt-2 text-xs bg-white dark:bg-gray-900 p-3 rounded overflow-auto border border-gray-200 dark:border-gray-700">
                                                        {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourierTestPanel;
