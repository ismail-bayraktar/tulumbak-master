import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import {
    Settings,
    TestTube,
    CheckCircle,
    XCircle,
    AlertCircle,
    Key,
    Send,
    Activity,
    Package,
    Truck,
    Clock,
    RefreshCw,
    Database,
    Zap,
    TrendingUp,
    AlertTriangle,
    BarChart3
} from 'lucide-react';

const CourierTestPanel = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboard, setDashboard] = useState(null);
    const [config, setConfig] = useState({
        platform: 'mudita',
        enabled: true,
        testMode: true,
        apiKey: '',
        apiSecret: '',
        restaurantId: '',
        webhookSecret: '',
        apiUrl: 'https://api.muditakurye.com.tr',
        webhookOnlyMode: false
    });
    const [testResults, setTestResults] = useState({});
    const [logs, setLogs] = useState([]);

    // Dashboard verilerini yükle
    const loadDashboard = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/courier-integration/dashboard`,
                { headers: { token } }
            );
            setDashboard(response.data);
        } catch (error) {
            console.error('Dashboard yüklenemedi:', error);
        }
    };

    // Mevcut konfigürasyonu yükle
    const loadConfig = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/courier-integration/configs/mudita`,
                { headers: { token } }
            );
            if (response.data) {
                setConfig({ ...config, ...response.data });
            }
        } catch (error) {
            console.log('Henüz config yok, yeni oluşturulacak');
        }
    };

    // Konfigürasyonu kaydet
    const saveConfig = async () => {
        setLoading(true);
        try {
            await axios.put(
                `${backendUrl}/api/admin/courier-integration/configs/mudita`,
                config,
                { headers: { token } }
            );
            toast.success('Konfigürasyon kaydedildi!');
            loadDashboard();
        } catch (error) {
            toast.error('Hata: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Konfigürasyonu doğrula
    const validateConfig = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/courier-integration/validate/mudita`,
                {},
                { headers: { token } }
            );
            setTestResults({ validate: response.data });

            if (response.data.valid) {
                toast.success('✅ Konfigürasyon geçerli!');
            } else {
                toast.warning('⚠️ Konfigürasyonda sorunlar var');
            }
        } catch (error) {
            toast.error('Doğrulama hatası: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Test siparişi gönder
    const sendTestOrder = async () => {
        if (!config.testMode) {
            toast.error('Test modu aktif değil! Lütfen önce test modunu açın.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/courier-integration/test-order/mudita`,
                {
                    customerName: 'Test Müşteri',
                    customerPhone: '+905551234567',
                    deliveryAddress: 'Test Adres, İstanbul',
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
            toast.error('Hata: ' + (error.response?.data?.error || error.message));
            addLog('error', 'Test siparişi hatası', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    // Webhook simülasyonu
    const testWebhook = async (status) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/courier-integration/test-webhook/mudita`,
                {
                    event: 'courier.status.updated',
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
            toast.error('Webhook hatası: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Sağlık kontrolü
    const checkHealth = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/courier-integration/health/mudita`,
                { headers: { token } }
            );
            setTestResults({ health: response.data });

            if (response.data.healthy) {
                toast.success('✅ Entegrasyon sağlıklı!');
            } else {
                toast.warning('⚠️ Entegrasyon sorunları tespit edildi');
            }
        } catch (error) {
            toast.error('Sağlık kontrolü hatası: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Log ekle
    const addLog = (type, message, data) => {
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <Truck className="text-blue-600" size={32} />
                            MuditaKurye Entegrasyon Test Paneli
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Kurye entegrasyonunuzu test edin ve yönetin
                        </p>
                    </div>
                    <button
                        onClick={loadDashboard}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <RefreshCw size={18} />
                        Yenile
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-4 font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} />
                            Dashboard
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`px-6 py-4 font-semibold ${activeTab === 'config' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Settings size={18} />
                            Konfigürasyon
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('test')}
                        className={`px-6 py-4 font-semibold ${activeTab === 'test' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <TestTube size={18} />
                            Test İşlemleri
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-6 py-4 font-semibold ${activeTab === 'logs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Activity size={18} />
                            Loglar
                        </div>
                    </button>
                </div>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && dashboard && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Durum</h3>
                            {dashboard.config?.enabled ? (
                                <CheckCircle className="text-green-500" size={24} />
                            ) : (
                                <XCircle className="text-red-500" size={24} />
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Aktif:</span>
                                <span className={dashboard.config?.enabled ? 'text-green-600 font-semibold' : 'text-red-600'}>
                                    {dashboard.config?.enabled ? 'Evet' : 'Hayır'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Test Modu:</span>
                                <span className={dashboard.config?.testMode ? 'text-yellow-600 font-semibold' : 'text-gray-600'}>
                                    {dashboard.config?.testMode ? 'Evet' : 'Hayır'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Circuit Breaker Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Circuit Breaker</h3>
                            <Zap className="text-yellow-500" size={24} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Durum:</span>
                                <span className={`font-semibold ${
                                    dashboard.circuitBreaker?.state === 'closed' ? 'text-green-600' :
                                    dashboard.circuitBreaker?.state === 'open' ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                    {dashboard.circuitBreaker?.state?.toUpperCase() || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Başarısızlık:</span>
                                <span className="text-gray-900">{dashboard.circuitBreaker?.failures || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Retry Queue Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Retry Kuyruğu</h3>
                            <RefreshCw className="text-blue-500" size={24} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bekleyen:</span>
                                <span className="text-blue-600 font-bold text-xl">{dashboard.retryQueue?.pending || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">İşleniyor:</span>
                                <span className="text-gray-900">{dashboard.retryQueue?.processing || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* DLQ Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Dead Letter Queue</h3>
                            <AlertTriangle className="text-red-500" size={24} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Başarısız:</span>
                                <span className="text-red-600 font-bold text-xl">{dashboard.dlq?.count || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Yüksek Öncelik:</span>
                                <span className="text-gray-900">{dashboard.dlq?.highPriority || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">MuditaKurye API Konfigürasyonu</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform
                            </label>
                            <input
                                type="text"
                                value={config.platform}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API URL
                            </label>
                            <input
                                type="text"
                                value={config.apiUrl}
                                onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Key size={16} className="inline mr-1" />
                                API Key
                            </label>
                            <input
                                type="text"
                                value={config.apiKey}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                placeholder="yk_YOUR_API_KEY"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Restaurant ID
                            </label>
                            <input
                                type="text"
                                value={config.restaurantId}
                                onChange={(e) => setConfig({ ...config, restaurantId: e.target.value })}
                                placeholder="rest_YOUR_RESTAURANT_ID"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Webhook Secret
                            </label>
                            <input
                                type="password"
                                value={config.webhookSecret}
                                onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
                                placeholder="wh_YOUR_WEBHOOK_SECRET"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Secret (Opsiyonel)
                            </label>
                            <input
                                type="password"
                                value={config.apiSecret}
                                onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
                                placeholder="your_api_secret_if_required"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.enabled}
                                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <span className="text-gray-700">Aktif</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.testMode}
                                onChange={(e) => setConfig({ ...config, testMode: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <span className="text-gray-700">Test Modu</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.webhookOnlyMode}
                                onChange={(e) => setConfig({ ...config, webhookOnlyMode: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <span className="text-gray-700">Sadece Webhook Modu</span>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={saveConfig}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            <Database size={18} />
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>

                        <button
                            onClick={validateConfig}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <CheckCircle size={18} />
                            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
                        </button>

                        <button
                            onClick={checkHealth}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            <Activity size={18} />
                            {loading ? 'Kontrol Ediliyor...' : 'Sağlık Kontrolü'}
                        </button>
                    </div>

                    {/* Validation Results */}
                    {testResults.validate && (
                        <div className={`mt-6 p-4 rounded-lg ${testResults.validate.valid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                            <h3 className="font-semibold mb-2">Doğrulama Sonuçları</h3>
                            {testResults.validate.errors?.length > 0 && (
                                <div className="mb-2">
                                    <p className="text-red-600 font-semibold">Hatalar:</p>
                                    <ul className="list-disc list-inside">
                                        {testResults.validate.errors.map((err, i) => (
                                            <li key={i} className="text-red-600">{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {testResults.validate.warnings?.length > 0 && (
                                <div>
                                    <p className="text-yellow-600 font-semibold">Uyarılar:</p>
                                    <ul className="list-disc list-inside">
                                        {testResults.validate.warnings.map((warn, i) => (
                                            <li key={i} className="text-yellow-600">{warn}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {testResults.validate.valid && (
                                <p className="text-green-600">✅ Tüm ayarlar geçerli!</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Test Tab */}
            {activeTab === 'test' && (
                <div className="space-y-6">
                    {/* Test Order */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Package size={24} className="text-blue-600" />
                            Test Siparişi Gönder
                        </h2>
                        <p className="text-gray-600 mb-4">
                            MuditaKurye API'ye gerçek bir test siparişi gönderin.
                        </p>
                        <button
                            onClick={sendTestOrder}
                            disabled={loading || !config.testMode}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Send size={18} />
                            {loading ? 'Gönderiliyor...' : 'Test Siparişi Gönder'}
                        </button>
                        {!config.testMode && (
                            <p className="mt-2 text-red-600 text-sm">⚠️ Test modu aktif değil!</p>
                        )}
                    </div>

                    {/* Webhook Simulation */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Activity size={24} className="text-green-600" />
                            Webhook Simülasyonu
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Farklı sipariş durumlarını simüle edin.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => testWebhook('VALIDATED')}
                                disabled={loading}
                                className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 font-semibold"
                            >
                                Doğrulandı
                            </button>
                            <button
                                onClick={() => testWebhook('ASSIGNED')}
                                disabled={loading}
                                className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 font-semibold"
                            >
                                Kuryeye Atandı
                            </button>
                            <button
                                onClick={() => testWebhook('ON_DELIVERY')}
                                disabled={loading}
                                className="px-4 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50 font-semibold"
                            >
                                Yolda
                            </button>
                            <button
                                onClick={() => testWebhook('DELIVERED')}
                                disabled={loading}
                                className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 font-semibold"
                            >
                                Teslim Edildi
                            </button>
                        </div>
                    </div>

                    {/* Test Results */}
                    {testResults.testOrder && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Test Siparişi Sonucu</h2>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                                {JSON.stringify(testResults.testOrder, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">İşlem Logları</h2>
                    <div className="space-y-2">
                        {logs.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Henüz log yok</p>
                        ) : (
                            logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${
                                        log.type === 'success' ? 'bg-green-50 border-green-200' :
                                        log.type === 'error' ? 'bg-red-50 border-red-200' :
                                        'bg-blue-50 border-blue-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {log.type === 'success' && <CheckCircle size={16} className="text-green-600" />}
                                                {log.type === 'error' && <XCircle size={16} className="text-red-600" />}
                                                <span className="font-semibold">{log.message}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{log.timestamp}</p>
                                            {log.data && (
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer text-sm text-blue-600">Detayları Göster</summary>
                                                    <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                                                        {JSON.stringify(log.data, null, 2)}
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
