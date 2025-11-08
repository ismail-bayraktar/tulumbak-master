import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import { Store, Settings as SettingsIcon, Loader } from 'lucide-react';

const BranchAssignmentSettings = ({ token }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branchAssignmentSettings, setBranchAssignmentSettings] = useState({
    enabled: true,
    mode: 'auto' // 'auto', 'hybrid', 'manual'
  });

  useEffect(() => {
    fetchBranchAssignmentSettings();
  }, []);

  const fetchBranchAssignmentSettings = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/settings/branch-assignment', {
        headers: { token }
      });
      
      if (response.data.success) {
        setBranchAssignmentSettings(response.data.settings);
      }
    } catch (error) {
      console.log('Branch assignment settings not found, using defaults');
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/settings/branch-assignment',
        branchAssignmentSettings,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Şube atama ayarları başarıyla güncellendi');
        setBranchAssignmentSettings(response.data.settings || branchAssignmentSettings);
      } else {
        toast.error(response.data.message || 'Ayarlar kaydedilemedi');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Ayarlar kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader className="w-12 h-12 animate-spin text-primary-600 dark:text-primary-400" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Şube Atama Ayarları</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Siparişlerin şubelere otomatik veya manuel atanmasını yönetin</p>
      </div>

      {/* Settings Card */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="card-header">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Şube Atama Konfigürasyonu</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Siparişlerin şubelere otomatik veya manuel atanmasını yönetin
          </p>
        </div>
        <div className="card-body space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Şube atama sistemini etkinleştir
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Bu özellik kapalıyken siparişler otomatik olarak şubelere atanmaz
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={branchAssignmentSettings.enabled}
                onChange={(e) => setBranchAssignmentSettings({ ...branchAssignmentSettings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Assignment Mode Selection */}
          {branchAssignmentSettings.enabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Atama Modu
                </label>
                <div className="space-y-3">
                  {/* Auto Mode */}
                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    branchAssignmentSettings.mode === 'auto'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}>
                    <input
                      type="radio"
                      name="assignmentMode"
                      value="auto"
                      checked={branchAssignmentSettings.mode === 'auto'}
                      onChange={(e) => setBranchAssignmentSettings({ ...branchAssignmentSettings, mode: e.target.value })}
                      className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Otomatik</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sistem siparişi otomatik olarak en uygun şubeye atar. Admin onayı gerekmez.
                      </div>
                    </div>
                  </label>

                  {/* Hybrid Mode */}
                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    branchAssignmentSettings.mode === 'hybrid'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}>
                    <input
                      type="radio"
                      name="assignmentMode"
                      value="hybrid"
                      checked={branchAssignmentSettings.mode === 'hybrid'}
                      onChange={(e) => setBranchAssignmentSettings({ ...branchAssignmentSettings, mode: e.target.value })}
                      className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Hibrit</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sistem şube önerir, admin onaylar. Önerilen şube "Sipariş İşleme" sayfasında görünür.
                      </div>
                    </div>
                  </label>

                  {/* Manual Mode */}
                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    branchAssignmentSettings.mode === 'manual'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}>
                    <input
                      type="radio"
                      name="assignmentMode"
                      value="manual"
                      checked={branchAssignmentSettings.mode === 'manual'}
                      onChange={(e) => setBranchAssignmentSettings({ ...branchAssignmentSettings, mode: e.target.value })}
                      className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Manuel</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sistem şube önerir ancak admin manuel olarak şube seçer ve atar.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <SettingsIcon className="w-4 h-4" />
                  Ayarları Kaydet
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card dark:bg-gray-800 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="card-body">
          <div className="flex items-start gap-3">
            <Store className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">Bilgi</h4>
              <p className="text-xs text-blue-800 dark:text-blue-300">
                Şube atama sistemi, siparişlerin teslimat adresine göre en uygun şubeye otomatik olarak atanmasını sağlar. 
                Sistem, teslimat bölgesi ve şube konumlarını dikkate alarak en yakın şubeyi belirler.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchAssignmentSettings;

