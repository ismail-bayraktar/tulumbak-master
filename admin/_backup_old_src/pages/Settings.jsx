import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import { Mail, MessageSquare, Package, Shield, Store, Settings as SettingsIcon } from 'lucide-react';

const Settings = ({ token }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('email');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [emailSettings, setEmailSettings] = useState({
    email_enabled: true,
    email_smtp_host: '',
    email_smtp_port: 587,
    email_smtp_user: '',
    email_smtp_password: ''
  });

  const [smsSettings, setSmsSettings] = useState({
    sms_enabled: false,
    sms_provider: 'netgsm', // netgsm or mesajpanel
    sms_api_key: '',
    sms_from: ''
  });


  const [stockSettings, setStockSettings] = useState({
    stock_min_threshold: 10,
    stock_enable_alerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    rate_limit_max_requests: 100,
    rate_limit_window_ms: 900000
  });

  // WhatsApp settings state
  const [whatsAppSettings, setWhatsAppSettings] = useState({
    enabled: false,
    phoneE164: '+905551234567',
    iconType: 'reactIcon',
    iconName: 'MessageCircle',
    iconSvg: '',
    desktop: {
      showOnProduct: false,
      buttonText: 'WhatsApp\'tan Sor',
      position: 'bottom-right',
      offsetX: 20,
      offsetY: 20,
      bgColor: '#25D366',
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    mobile: {
      showOnProduct: false,
      buttonText: 'WhatsApp',
      position: 'bottom-right',
      offsetX: 16,
      offsetY: 16,
      bgColor: '#25D366',
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  });

  // WhatsApp preview device
  const [whatsAppPreviewDevice, setWhatsAppPreviewDevice] = useState('desktop');

  // Test email state
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/settings', {
        headers: { token }
      });
      
      if (response.data.success) {
        setSettings(response.data.settings);
        
        // Set form states
        setEmailSettings({
          email_enabled: response.data.settings.email_enabled ?? true,
          email_smtp_host: response.data.settings.email_smtp_host || '',
          email_smtp_port: response.data.settings.email_smtp_port || 587,
          email_smtp_user: response.data.settings.email_smtp_user || '',
          email_smtp_password: ''
        });

        setStockSettings({
          stock_min_threshold: response.data.settings.stock_min_threshold || 10,
          stock_enable_alerts: response.data.settings.stock_enable_alerts ?? true
        });

        setSecuritySettings({
          rate_limit_max_requests: response.data.settings.rate_limit_max_requests || 100,
          rate_limit_window_ms: response.data.settings.rate_limit_window_ms || 900000
        });


        // Fetch WhatsApp settings
        await fetchWhatsAppSettings();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWhatsAppSettings = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/settings/whatsapp', {
        headers: { token }
      });
      
      if (response.data.success) {
        setWhatsAppSettings(response.data.settings);
      }
    } catch (error) {
      // If settings don't exist, use defaults
      // Settings will use default values
    }
  };

  const saveSettings = async (settingsData) => {
    setSaving(true);
    try {
      const updates = Object.entries(settingsData).map(([key, value]) => ({
        key,
        value,
        category: getCategoryForKey(key)
      }));

      const response = await axios.post(
        backendUrl + '/api/settings/update-multiple',
        { settings: updates },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Ayarlar başarıyla güncellendi');
        await fetchSettings();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryForKey = (key) => {
    if (key.startsWith('email_')) return 'email';
    if (key.startsWith('stock_')) return 'stock';
    if (key.startsWith('rate_limit_')) return 'security';
    return 'general';
  };

  const handleEmailSave = () => {
    saveSettings(emailSettings);
  };

  const handleStockSave = () => {
    saveSettings(stockSettings);
  };

  const handleSecuritySave = () => {
    saveSettings(securitySettings);
  };

  const handleWhatsAppSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/settings/whatsapp',
        { settings: whatsAppSettings },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('WhatsApp ayarları başarıyla güncellendi');
        setWhatsAppSettings(response.data.settings);
      } else {
        toast.error(response.data.message || 'Ayarlar kaydedilemedi');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Ayarlar kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Email adresi giriniz');
      return;
    }

    setSendingTest(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/settings/test-email',
        { email: testEmail },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Test email başarıyla gönderildi');
        setTestEmail('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sistem Ayarları</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Sistem konfigürasyonlarını yönetin</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'email'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email Ayarları
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'sms'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            SMS Ayarları
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'stock'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Package className="w-4 h-4" />
            Stok Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            Güvenlik
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'whatsapp'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Desteği
          </button>
        </nav>
      </div>

      {/* Email Settings Tab */}
      {activeTab === 'email' && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Konfigürasyonu</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="email_enabled"
                  checked={emailSettings.email_enabled}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, email_enabled: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="email_enabled" className="font-medium text-gray-900 dark:text-white">
                  Email bildirimlerini etkinleştir
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Host</label>
                <input
                  type="text"
                  value={emailSettings.email_smtp_host}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, email_smtp_host: e.target.value })
                  }
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Port</label>
                <input
                  type="number"
                  value={emailSettings.email_smtp_port}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      email_smtp_port: parseInt(e.target.value)
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP User</label>
                <input
                  type="email"
                  value={emailSettings.email_smtp_user}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, email_smtp_user: e.target.value })
                  }
                  placeholder="your-email@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Password</label>
                <input
                  type="password"
                  value={emailSettings.email_smtp_password}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      email_smtp_password: e.target.value
                    })
                  }
                  placeholder="App password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Gmail için uygulama şifresi kullanın
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Test Email Gönder</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={sendTestEmail}
                    disabled={sendingTest}
                    className="btn-success disabled:bg-gray-400 dark:disabled:bg-gray-600"
                  >
                    {sendingTest ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleEmailSave}
                disabled={saving}
                className="btn-primary w-full disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {saving ? 'Kaydediliyor...' : 'Email Ayarlarını Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Settings Tab */}
      {activeTab === 'sms' && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">SMS Konfigürasyonu</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sms_enabled"
                  checked={smsSettings.sms_enabled}
                  onChange={(e) =>
                    setSmsSettings({ ...smsSettings, sms_enabled: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="sms_enabled" className="font-medium text-gray-900 dark:text-white">
                  SMS bildirimlerini etkinleştir
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMS Provider</label>
                <select
                  value={smsSettings.sms_provider}
                  onChange={(e) =>
                    setSmsSettings({ ...smsSettings, sms_provider: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="netgsm">NetGSM</option>
                  <option value="mesajpanel">MesajPanel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                <input
                  type="text"
                  value={smsSettings.sms_api_key}
                  onChange={(e) =>
                    setSmsSettings({ ...smsSettings, sms_api_key: e.target.value })
                  }
                  placeholder="API Key"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gönderen Numarası</label>
                <input
                  type="text"
                  value={smsSettings.sms_from}
                  onChange={(e) =>
                    setSmsSettings({ ...smsSettings, sms_from: e.target.value })
                  }
                  placeholder="0532 123 4567"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={() => saveSettings(smsSettings)}
                disabled={saving}
                className="btn-primary w-full disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {saving ? 'Kaydediliyor...' : 'SMS Ayarlarını Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Settings Tab */}
      {activeTab === 'stock' && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Stok Yönetimi</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Stok Eşiği
                </label>
                <input
                  type="number"
                  value={stockSettings.stock_min_threshold}
                  onChange={(e) =>
                    setStockSettings({
                      ...stockSettings,
                      stock_min_threshold: parseInt(e.target.value)
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Stok bu değerin altına düştüğünde uyarı verilir
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="stock_alerts"
                  checked={stockSettings.stock_enable_alerts}
                  onChange={(e) =>
                    setStockSettings({
                      ...stockSettings,
                      stock_enable_alerts: e.target.checked
                    })
                  }
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="stock_alerts" className="font-medium text-gray-900 dark:text-white">
                  Düşük stok uyarılarını etkinleştir
                </label>
              </div>

              <button
                onClick={handleStockSave}
                disabled={saving}
                className="btn-primary w-full disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {saving ? 'Kaydediliyor...' : 'Stok Ayarlarını Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Güvenlik Ayarları</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rate Limit - Maksimum İstek Sayısı
                </label>
                <input
                  type="number"
                  value={securitySettings.rate_limit_max_requests}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      rate_limit_max_requests: parseInt(e.target.value)
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Bir IP adresi için belirli bir süre içinde izin verilen maksimum istek sayısı
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rate Limit - Zaman Penceresi (ms)
                </label>
                <input
                  type="number"
                  value={securitySettings.rate_limit_window_ms}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      rate_limit_window_ms: parseInt(e.target.value)
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Zaman penceresi milisaniye cinsinden (örn: 900000 = 15 dakika)
                </p>
              </div>

              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                <p className="text-sm text-warning-800 dark:text-warning-200">
                  ⚠️ <strong>Uyarı:</strong> Bu ayarları değiştirmeden önce sistemin mevcut
                  yükünü ve kullanıcı sayısını dikkate alın.
                </p>
              </div>

              <button
                onClick={handleSecuritySave}
                disabled={saving}
                className="btn-primary w-full disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {saving ? 'Kaydediliyor...' : 'Güvenlik Ayarlarını Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Settings Tab */}
      {activeTab === 'whatsapp' && (
        <WhatsAppSettingsTab
          settings={whatsAppSettings}
          setSettings={setWhatsAppSettings}
          onSave={handleWhatsAppSave}
          saving={saving}
          previewDevice={whatsAppPreviewDevice}
          setPreviewDevice={setWhatsAppPreviewDevice}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

// WhatsApp Settings Tab Component
const WhatsAppSettingsTab = ({ 
  settings, 
  setSettings, 
  onSave, 
  saving,
  previewDevice,
  setPreviewDevice,
  isDarkMode 
}) => {
  const [activeDeviceTab, setActiveDeviceTab] = useState('desktop');
  
  // Calculate contrast ratio for accessibility warning
  const getContrastRatio = (color1, color2) => {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const getLuminance = (rgb) => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 1;

    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const currentDeviceSettings = settings[activeDeviceTab];
  const contrastRatio = getContrastRatio(currentDeviceSettings.bgColor, currentDeviceSettings.textColor);
  const hasLowContrast = contrastRatio < 4.5;

  // Position options
  const positionOptions = [
    { value: 'bottom-right', label: 'Sağ Alt' },
    { value: 'bottom-left', label: 'Sol Alt' },
    { value: 'top-right', label: 'Sağ Üst' },
    { value: 'top-left', label: 'Sol Üst' },
    { value: 'right-center', label: 'Sağ Orta' },
    { value: 'left-center', label: 'Sol Orta' }
  ];

  // React Icon options (Lucide React icons)
  const reactIconOptions = [
    { value: 'MessageCircle', label: 'Mesaj Dairesi' },
    { value: 'Phone', label: 'Telefon' },
    { value: 'MessageSquare', label: 'Mesaj Kare' },
    { value: 'Headphones', label: 'Kulaklık' },
    { value: 'HelpCircle', label: 'Yardım' }
  ];

  // Get position styles for preview
  const getPositionStyles = (position, offsetX, offsetY) => {
    const styles = {};
    if (position.includes('bottom')) {
      styles.bottom = `${offsetY}px`;
    }
    if (position.includes('top')) {
      styles.top = `${offsetY}px`;
    }
    if (position.includes('right')) {
      styles.right = `${offsetX}px`;
    }
    if (position.includes('left')) {
      styles.left = `${offsetX}px`;
    }
    if (position.includes('center')) {
      styles.top = '50%';
      styles.transform = 'translateY(-50%)';
    }
    return styles;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Settings Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Global Settings */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Genel Ayarlar</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="whatsapp_enabled"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="whatsapp_enabled" className="font-medium text-gray-900 dark:text-white">
                WhatsApp desteğini etkinleştir
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp Numarası (E.164 Format) <span className="text-danger-600 dark:text-danger-400">*</span>
              </label>
              <input
                type="text"
                value={settings.phoneE164}
                onChange={(e) => setSettings({ ...settings, phoneE164: e.target.value })}
                placeholder="+905551234567"
                pattern="^\+[1-9]\d{1,14}$"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                E.164 formatında olmalıdır (örn: +905551234567)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İkon Tipi
              </label>
              <select
                value={settings.iconType}
                onChange={(e) => setSettings({ ...settings, iconType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="reactIcon">React İkon (Lucide)</option>
                <option value="customSvg">Özel SVG</option>
              </select>
            </div>

            {settings.iconType === 'reactIcon' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İkon Adı
                </label>
                <select
                  value={settings.iconName || 'MessageCircle'}
                  onChange={(e) => setSettings({ ...settings, iconName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {reactIconOptions.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                  ))}
                </select>
              </div>
            )}

            {settings.iconType === 'customSvg' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Özel SVG Kodu
                </label>
                <textarea
                  value={settings.iconSvg || ''}
                  onChange={(e) => setSettings({ ...settings, iconSvg: e.target.value })}
                  rows={4}
                  placeholder="<svg>...</svg>"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  SVG kodu sanitize edilecektir (güvenlik için)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Device-specific Settings */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cihaz Ayarları</h3>
          </div>
          <div className="card-body">
            {/* Device Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
              <nav className="flex gap-4">
                <button
                  onClick={() => setActiveDeviceTab('desktop')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeDeviceTab === 'desktop'
                      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  💻 Masaüstü
                </button>
                <button
                  onClick={() => setActiveDeviceTab('mobile')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeDeviceTab === 'mobile'
                      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  📱 Mobil
                </button>
              </nav>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`showOnProduct_${activeDeviceTab}`}
                  checked={currentDeviceSettings.showOnProduct}
                  onChange={(e) => setSettings({
                    ...settings,
                    [activeDeviceTab]: {
                      ...currentDeviceSettings,
                      showOnProduct: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={`showOnProduct_${activeDeviceTab}`} className="font-medium text-gray-900 dark:text-white">
                  Ürün sayfasında göster
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buton Metni
                </label>
                <input
                  type="text"
                  value={currentDeviceSettings.buttonText}
                  onChange={(e) => setSettings({
                    ...settings,
                    [activeDeviceTab]: {
                      ...currentDeviceSettings,
                      buttonText: e.target.value
                    }
                  })}
                  maxLength={50}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konum
                </label>
                <select
                  value={currentDeviceSettings.position}
                  onChange={(e) => setSettings({
                    ...settings,
                    [activeDeviceTab]: {
                      ...currentDeviceSettings,
                      position: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {positionOptions.map(pos => (
                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    X Ofseti (0-120px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={currentDeviceSettings.offsetX}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        offsetX: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Y Ofseti (0-120px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={currentDeviceSettings.offsetY}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        offsetY: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arkaplan Rengi (HEX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentDeviceSettings.bgColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        bgColor: e.target.value
                      }
                    })}
                    className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentDeviceSettings.bgColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        bgColor: e.target.value
                      }
                    })}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İkon Rengi (HEX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentDeviceSettings.iconColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        iconColor: e.target.value
                      }
                    })}
                    className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentDeviceSettings.iconColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        iconColor: e.target.value
                      }
                    })}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Metin Rengi (HEX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentDeviceSettings.textColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        textColor: e.target.value
                      }
                    })}
                    className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentDeviceSettings.textColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      [activeDeviceTab]: {
                        ...currentDeviceSettings,
                        textColor: e.target.value
                      }
                    })}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  />
                </div>
                {hasLowContrast && (
                  <div className="mt-2 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                    <p className="text-sm text-warning-800 dark:text-warning-200">
                      ⚠️ <strong>Düşük Kontrast:</strong> Metin ve arkaplan renkleri arasındaki kontrast oranı ({contrastRatio.toFixed(2)}) WCAG standartlarının altında. Erişilebilirlik için en az 4.5:1 olmalıdır.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary w-full disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          {saving ? 'Kaydediliyor...' : 'WhatsApp Ayarlarını Kaydet'}
        </button>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-1">
        <div className="card dark:bg-gray-800 dark:border-gray-700 sticky top-4">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Canlı Önizleme</h3>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    previewDevice === 'desktop'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  💻 Masaüstü
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    previewDevice === 'mobile'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  📱 Mobil
                </button>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 p-8 min-h-[400px]">
              {settings.enabled ? (
                <div
                  className="absolute"
                  style={getPositionStyles(
                    settings[previewDevice].position,
                    settings[previewDevice].offsetX,
                    settings[previewDevice].offsetY
                  )}
                >
                  <button
                    type="button"
                    style={{
                      backgroundColor: settings[previewDevice].bgColor,
                      color: settings[previewDevice].textColor,
                      padding: previewDevice === 'mobile' ? '10px 16px' : '12px 20px',
                      borderRadius: '12px',
                      fontSize: previewDevice === 'mobile' ? '14px' : '16px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className="hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    {settings.iconType === 'reactIcon' ? (
                      <span style={{ color: settings[previewDevice].iconColor }}>
                        💬
                      </span>
                    ) : settings.iconSvg ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: settings.iconSvg }}
                        style={{ width: '20px', height: '20px', display: 'inline-block', color: settings[previewDevice].iconColor }}
                      />
                    ) : (
                      <span style={{ color: settings[previewDevice].iconColor }}>💬</span>
                    )}
                    <span>{settings[previewDevice].buttonText}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  <p className="text-sm">WhatsApp desteği kapalı</p>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-xs text-primary-800 dark:text-primary-200">
                💡 <strong>İpucu:</strong> Önizleme gerçek zamanlı olarak güncellenir. Değişikliklerinizi kaydetmek için "Kaydet" butonuna tıklayın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

