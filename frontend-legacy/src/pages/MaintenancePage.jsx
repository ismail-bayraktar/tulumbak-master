import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, RefreshCw } from 'lucide-react';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);

  const checkStatus = async () => {
    try {
      setRetrying(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/settings/maintenance-status`);
      const data = await response.json();

      if (data.success && !data.maintenanceMode) {
        // Maintenance is over, redirect to home
        navigate('/', { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
    } finally {
      setTimeout(() => setRetrying(false), 1000);
    }
  };

  useEffect(() => {
    // Auto-check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Wrench className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bakım Modunda
          </h1>
          <p className="text-gray-600">
            Sitemiz şu anda bakım yapılıyor. Daha iyi bir deneyim için çalışıyoruz.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Lütfen daha sonra tekrar deneyin. Kısa süre içinde geri döneceğiz.
          </p>
        </div>

        <button
          onClick={checkStatus}
          disabled={retrying}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Kontrol Ediliyor...' : 'Tekrar Dene'}
        </button>

        <div className="mt-6 text-sm text-gray-500">
          <p>Destek için: info@tulumbak.com</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
