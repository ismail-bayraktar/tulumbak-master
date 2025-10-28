import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Reports = () => {
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

  const token = Cookies.get('jwt');

  const fetchReport = async (endpoint, key) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_APP_API}/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: key === 'dailySales' ? { date } : {}
      });
      
      if (response.data.success) {
        setReports(prev => ({ ...prev, [key]: response.data[key] || response.data.report || response.data.analytics || response.data.behavior || response.data.delivery || response.data.dashboard }));
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = () => fetchReport('report/dashboard', 'dashboard');
  const fetchDailySales = () => fetchReport('report/daily-sales', 'dailySales');
  const fetchWeeklySales = () => fetchReport('report/weekly-sales', 'weeklySales');
  const fetchMonthlySales = () => fetchReport('report/monthly-sales', 'monthlySales');
  const fetchProductAnalytics = () => fetchReport('report/product-analytics', 'productAnalytics');
  const fetchUserBehavior = () => fetchReport('report/user-behavior', 'userBehavior');
  const fetchDeliveryStatus = () => fetchReport('report/delivery-status', 'deliveryStatus');

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
    if (!reports.dashboard) return <div>Yükleniyor...</div>;
    const { dashboard } = reports;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600">Bu Ay Gelir</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {formatCurrency(dashboard.thisMonth?.revenue || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {dashboard.growth?.revenue} büyüme
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600">Bu Ay Sipariş</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {dashboard.thisMonth?.orders || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {dashboard.growth?.orders} değişim
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600">Bekleyen Siparişler</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {dashboard.pendingOrders || 0}
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600">Düşük Stok Ürünler</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {dashboard.lowStockProducts || 0}
          </p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Toplam Ürünler</h3>
          <p className="text-3xl font-bold text-gray-800">{dashboard.totalProducts}</p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Toplam Kullanıcılar</h3>
          <p className="text-3xl font-bold text-gray-800">{dashboard.totalUsers}</p>
        </div>
      </div>
    );
  };

  const renderDailySales = () => {
    if (!reports.dailySales) return <div>Rapor yükleniyor...</div>;
    const { report } = reports;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Seçin</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={fetchDailySales}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Getir
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="text-sm font-medium text-gray-600">Toplam Gelir</h4>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(report.totalRevenue || 0)}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h4 className="text-sm font-medium text-gray-600">Toplam Sipariş</h4>
            <p className="text-2xl font-bold text-green-600">{report.totalOrders || 0}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h4 className="text-sm font-medium text-gray-600">Ortalama Sipariş</h4>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(report.averageOrderValue || 0)}
            </p>
          </div>
        </div>

        {report.paymentMethodStats && Object.keys(report.paymentMethodStats).length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Ödeme Yöntemi Dağılımı</h4>
            <div className="space-y-2">
              {Object.entries(report.paymentMethodStats).map(([method, count]) => (
                <div key={method} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{method}</span>
                  <span className="text-blue-600 font-bold">{count} sipariş</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProductAnalytics = () => {
    if (!reports.productAnalytics) return <div>Rapor yükleniyor...</div>;

    const { analytics } = reports;
    const topProducts = analytics.topProducts || [];

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">En Çok Satan Ürünler</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satılan Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gelir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siparişler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name || 'Ürün Adı Yok'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.totalSold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Raporlar</h1>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 p-2">
            <button
              onClick={() => { setActiveTab('dashboard'); fetchDashboard(); }}
              className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('daily'); fetchDailySales(); }}
              className={`px-4 py-2 rounded ${activeTab === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              Günlük Satış
            </button>
            <button
              onClick={() => { setActiveTab('products'); fetchProductAnalytics(); }}
              className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
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

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">Yükleniyor...</div>
        </div>
      )}
    </div>
  );
};

export default Reports;

