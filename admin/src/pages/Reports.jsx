import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { toast } from 'react-toastify';

const Reports = ({ token }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState({
    dashboard: null,
    dailySales: null,
    weeklySales: null,
    monthlySales: null,
    productAnalytics: null,
    userBehavior: null,
    deliveryStatus: null
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchReport = async (endpoint, key) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/${endpoint}`, {
        headers: { 'token': token },
        params: key === 'dailySales' ? { date } : {}
      });
      
      if (response.data.success) {
        setReports(prev => ({ 
          ...prev, 
          [key]: response.data[key] || response.data.report || response.data.analytics || response.data.behavior || response.data.delivery || response.data.dashboard 
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `${key} raporu yüklenirken hata oluştu`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = () => fetchReport('api/report/dashboard', 'dashboard');
  const fetchDailySales = () => fetchReport('api/report/daily-sales', 'dailySales');
  const fetchWeeklySales = () => fetchReport('api/report/weekly-sales', 'weeklySales');
  const fetchMonthlySales = () => fetchReport('api/report/monthly-sales', 'monthlySales');
  const fetchProductAnalytics = () => fetchReport('api/report/product-analytics', 'productAnalytics');
  const fetchUserBehavior = () => fetchReport('api/report/user-behavior', 'userBehavior');
  const fetchDeliveryStatus = () => fetchReport('api/report/delivery-status', 'deliveryStatus');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const renderDashboard = () => {
    if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Yükleniyor...</div>;
    if (!reports.dashboard) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Veri bulunamadı</div>;
    const { dashboard } = reports;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Bu Ay Gelir</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {formatCurrency(dashboard.thisMonth?.revenue || 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {dashboard.growth?.revenue} büyüme
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Bu Ay Sipariş</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {dashboard.thisMonth?.orders || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {dashboard.growth?.orders} değişim
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Bekleyen Siparişler</h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {dashboard.pendingOrders || 0}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Düşük Stok Ürünler</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {dashboard.lowStockProducts || 0}
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Toplam Ürünler</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{dashboard.totalProducts}</p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Toplam Kullanıcılar</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{dashboard.totalUsers}</p>
        </div>
      </div>
    );
  };

  const renderDailySales = () => {
    if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Yükleniyor...</div>;
    if (!reports.dailySales) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Veri bulunamadı</div>;
    const report = reports.dailySales;

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tarih Seçin</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <button
              onClick={fetchDailySales}
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded transition-colors font-medium"
            >
              Getir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Gelir</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(report.totalRevenue || 0)}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Sipariş</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{report.totalOrders || 0}</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortalama Sipariş</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(report.averageOrderValue || 0)}
            </p>
          </div>
        </div>

        {report.paymentMethodStats && Object.keys(report.paymentMethodStats).length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Ödeme Yöntemi Dağılımı</h4>
            <div className="space-y-2">
              {Object.entries(report.paymentMethodStats).map(([method, count]) => (
                <div key={method} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">{method}</span>
                  <span className="text-primary-600 dark:text-primary-400 font-bold">{count} sipariş</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProductAnalytics = () => {
    if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Yükleniyor...</div>;
    if (!reports.productAnalytics) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Veri bulunamadı</div>;

    const analytics = reports.productAnalytics;
    const topProducts = analytics?.topProducts || [];

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">En Çok Satan Ürünler</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Satılan Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gelir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Siparişler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {product.name || 'Ürün Adı Yok'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.totalSold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.orders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Raporlar</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Detaylı raporlar ve analizler</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 p-2">
            <button
              onClick={() => { setActiveTab('dashboard'); fetchDashboard(); }}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                activeTab === 'dashboard' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('daily'); fetchDailySales(); }}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                activeTab === 'daily' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Günlük Satış
            </button>
            <button
              onClick={() => { setActiveTab('products'); fetchProductAnalytics(); }}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                activeTab === 'products' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Ürün Analizi
            </button>
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'daily' && renderDailySales()}
        {activeTab === 'products' && renderProductAnalytics()}
      </div>

    </div>
  );
};

export default Reports;

