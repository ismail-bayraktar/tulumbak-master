import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import { CheckCircle, XCircle, Mail, Smartphone, RefreshCw, ClipboardList } from 'lucide-react';

const BackendStatus = ({ token }) => {
    const { isDarkMode } = useTheme();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackendStatus();
  }, []);

  const fetchBackendStatus = async () => {
    try {
      const response = await axios.get(backendUrl + '/', {
        headers: { token }
      });
      
      setStatus({
        api: 'online',
        message: response.data
      });
    } catch (error) {
      setStatus({
        api: 'offline',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Backend Sistem Durumu</h2>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">API Status</p>
              <div className="flex items-center gap-2 mt-1">
                {status?.api === 'online' ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                    <p className="text-2xl font-bold text-success-600 dark:text-success-400">Online</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                    <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">Offline</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Service</p>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">SMS Service</p>
              <div className="flex items-center gap-2 mt-1">
                <Smartphone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">Configured</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Developments */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Son Gelişmeler</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-success-100 dark:bg-success-900/30 rounded border border-success-200 dark:border-success-800">
            <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Faz 1 Tamamlandı</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email bildirimi, stok yönetimi ve güvenlik iyileştirmeleri
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-primary-100 dark:bg-primary-900/30 rounded border border-primary-200 dark:border-primary-800">
            <RefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Faz 2 Devam Ediyor</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SMS entegrasyonu tamamlandı. Raporlama sistemi geliştiriliyor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <ClipboardList className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Yapılacaklar</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Raporlama sistemi, gerçek kurye entegrasyonu, multi-admin sistemi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Features */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sistem Özellikleri</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-success-500 dark:border-success-400 pl-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Email Bildirimleri</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              • Sipariş onayı<br/>
              • Durum güncellemeleri<br/>
              • Kurye bildirimleri
            </p>
          </div>

          <div className="border-l-4 border-primary-500 dark:border-primary-400 pl-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">SMS Bildirimleri</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              • Sipariş onayı SMS<br/>
              • Durum güncellemeleri<br/>
              • Kurye takip SMS
            </p>
          </div>

          <div className="border-l-4 border-primary-500 dark:border-primary-400 pl-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Stok Yönetimi</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              • Otomatik stok azaltma<br/>
              • Düşük stok uyarıları<br/>
              • Stok filtresi
            </p>
          </div>

          <div className="border-l-4 border-danger-500 dark:border-danger-400 pl-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Güvenlik</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              • Rate limiting<br/>
              • Helmet headers<br/>
              • JWT authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendStatus;

