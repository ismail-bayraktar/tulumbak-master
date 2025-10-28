import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const BackendStatus = ({ token }) => {
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
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Backend Sistem Durumu</h2>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">API Status</p>
              <p className="text-2xl font-bold">
                {status?.api === 'online' ? '🟢 Online' : '🔴 Offline'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Email Service</p>
              <p className="text-2xl font-bold">📧 Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">SMS Service</p>
              <p className="text-2xl font-bold">📱 Configured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Developments */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Son Gelişmeler</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium">Faz 1 Tamamlandı</p>
              <p className="text-sm text-gray-600">
                Email bildirimi, stok yönetimi ve güvenlik iyileştirmeleri
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
            <span className="text-blue-600">🔄</span>
            <div>
              <p className="font-medium">Faz 2 Devam Ediyor</p>
              <p className="text-sm text-gray-600">
                SMS entegrasyonu tamamlandı. Raporlama sistemi geliştiriliyor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
            <span className="text-gray-600">📋</span>
            <div>
              <p className="font-medium">Yapılacaklar</p>
              <p className="text-sm text-gray-600">
                Raporlama sistemi, gerçek kurye entegrasyonu, multi-admin sistemi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Features */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Sistem Özellikleri</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold">Email Bildirimleri</h4>
            <p className="text-sm text-gray-600">
              • Sipariş onayı<br/>
              • Durum güncellemeleri<br/>
              • Kurye bildirimleri
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold">SMS Bildirimleri</h4>
            <p className="text-sm text-gray-600">
              • Sipariş onayı SMS<br/>
              • Durum güncellemeleri<br/>
              • Kurye takip SMS
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold">Stok Yönetimi</h4>
            <p className="text-sm text-gray-600">
              • Otomatik stok azaltma<br/>
              • Düşük stok uyarıları<br/>
              • Stok filtresi
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold">Güvenlik</h4>
            <p className="text-sm text-gray-600">
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

