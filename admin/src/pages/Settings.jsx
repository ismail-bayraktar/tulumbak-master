import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const Settings = ({ token }) => {
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

  const [stockSettings, setStockSettings] = useState({
    stock_min_threshold: 10,
    stock_enable_alerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    rate_limit_max_requests: 100,
    rate_limit_window_ms: 900000
  });

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
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sistem Ayarları</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'email'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📧 Email Ayarları
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'stock'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📦 Stok Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'security'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔒 Güvenlik
          </button>
        </nav>
      </div>

      {/* Email Settings Tab */}
      {activeTab === 'email' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Email Konfigürasyonu</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="email_enabled"
                checked={emailSettings.email_enabled}
                onChange={(e) =>
                  setEmailSettings({ ...emailSettings, email_enabled: e.target.checked })
                }
                className="w-5 h-5"
              />
              <label htmlFor="email_enabled" className="font-medium">
                Email bildirimlerini etkinleştir
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SMTP Host</label>
              <input
                type="text"
                value={emailSettings.email_smtp_host}
                onChange={(e) =>
                  setEmailSettings({ ...emailSettings, email_smtp_host: e.target.value })
                }
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SMTP Port</label>
              <input
                type="number"
                value={emailSettings.email_smtp_port}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    email_smtp_port: parseInt(e.target.value)
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SMTP User</label>
              <input
                type="email"
                value={emailSettings.email_smtp_user}
                onChange={(e) =>
                  setEmailSettings({ ...emailSettings, email_smtp_user: e.target.value })
                }
                placeholder="your-email@gmail.com"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SMTP Password</label>
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
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Gmail için uygulama şifresi kullanın
              </p>
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium mb-2">Test Email Gönder</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={sendTestEmail}
                  disabled={sendingTest}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                >
                  {sendingTest ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </div>

            <button
              onClick={handleEmailSave}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {saving ? 'Kaydediliyor...' : 'Email Ayarlarını Kaydet'}
            </button>
          </div>
        </div>
      )}

      {/* Stock Settings Tab */}
      {activeTab === 'stock' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Stok Yönetimi</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
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
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
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
                className="w-5 h-5"
              />
              <label htmlFor="stock_alerts" className="font-medium">
                Düşük stok uyarılarını etkinleştir
              </label>
            </div>

            <button
              onClick={handleStockSave}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {saving ? 'Kaydediliyor...' : 'Stok Ayarlarını Kaydet'}
            </button>
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Güvenlik Ayarları</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
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
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bir IP adresi için belirli bir süre içinde izin verilen maksimum istek sayısı
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
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
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Zaman penceresi milisaniye cinsinden (örn: 900000 = 15 dakika)
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Uyarı:</strong> Bu ayarları değiştirmeden önce sistemin mevcut
                yükünü ve kullanıcı sayısını dikkate alın.
              </p>
            </div>

            <button
              onClick={handleSecuritySave}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {saving ? 'Kaydediliyor...' : 'Güvenlik Ayarlarını Kaydet'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

