import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';

const SmsLogs = ({ token }) => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: '7days',
        searchQuery: ''
    });
    const [stats, setStats] = useState({
        total: 0,
        success: 0,
        failed: 0,
        successRate: 0
    });

    useEffect(() => {
        fetchSmsLogs();
    }, []);

    useEffect(() => {
        filterLogs();
    }, [logs, filters]);

    const fetchSmsLogs = async () => {
        try {
            setLoading(true);
            // Mock data for now - replace with actual API call
            const mockLogs = [
                {
                    id: '1',
                    recipient: '+905551234567',
                    message: 'Siparişiniz alındı. Takip ID: ABC123',
                    status: 'success',
                    sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    error: null
                },
                {
                    id: '2',
                    recipient: '+905559876543',
                    message: 'Kuryeniz yola çıktı.',
                    status: 'failed',
                    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    error: 'Invalid phone number'
                },
                {
                    id: '3',
                    recipient: '+905556543210',
                    message: 'Siparişiniz teslim edildi.',
                    status: 'success',
                    sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    error: null
                }
            ];
            
            setLogs(mockLogs);
            calculateStats(mockLogs);
        } catch (error) {
            console.error('Error fetching SMS logs:', error);
            toast.error('SMS logları yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (logData) => {
        const total = logData.length;
        const success = logData.filter(log => log.status === 'success').length;
        const failed = total - success;
        const successRate = total > 0 ? (success / total) * 100 : 0;

        setStats({ total, success, failed, successRate });
    };

    const filterLogs = () => {
        let filtered = logs;

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(log => log.status === filters.status);
        }

        // Date range filter
        const now = new Date();
        const filterDate = new Date();
        switch (filters.dateRange) {
            case 'today':
                filterDate.setHours(0, 0, 0, 0);
                break;
            case '7days':
                filterDate.setDate(now.getDate() - 7);
                break;
            case '30days':
                filterDate.setDate(now.getDate() - 30);
                break;
            default:
                break;
        }

        if (filters.dateRange !== 'all') {
            filtered = filtered.filter(log => new Date(log.sentAt) >= filterDate);
        }

        // Search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(log =>
                log.recipient.toLowerCase().includes(query) ||
                log.message.toLowerCase().includes(query) ||
                (log.error && log.error.toLowerCase().includes(query))
            );
        }

        setFilteredLogs(filtered);
    };

    const sendTestSms = async () => {
        const testPhone = prompt('Test telefon numarasını girin (+90 ile başlayarak):');
        if (!testPhone) return;

        try {
            const response = await axios.post(
                backendUrl + '/api/settings/test-sms',
                { phone: testPhone },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Test SMS başarıyla gönderildi');
                fetchSmsLogs(); // Refresh logs
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Test SMS gönderilirken hata oluştu');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('tr-TR');
    };

    const getStatusColor = (status) => {
        return status === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">SMS Logları</h1>
                <p className="text-gray-600 mt-2">SMS gönderim geçmişi ve istatistikleri</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Toplam SMS</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📱</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Başarılı</p>
                            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Başarısız</p>
                            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">❌</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Başarı Oranı</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.successRate.toFixed(1)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durum
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tümü</option>
                            <option value="success">Başarılı</option>
                            <option value="failed">Başarısız</option>
                        </select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tarih Aralığı
                        </label>
                        <select
                            value={filters.dateRange}
                            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tümü</option>
                            <option value="today">Bugün</option>
                            <option value="7days">Son 7 Gün</option>
                            <option value="30days">Son 30 Gün</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arama
                        </label>
                        <input
                            type="text"
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                            placeholder="Telefon, mesaj, hata..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end">
                        <button
                            onClick={sendTestSms}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Test SMS Gönder
                        </button>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Alıcı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mesaj
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gönderim Zamanı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hata
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        Log bulunamadı
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {log.recipient}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            <div className="truncate" title={log.message}>
                                                {log.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                                                {log.status === 'success' ? 'Başarılı' : 'Başarısız'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(log.sentAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {log.error ? (
                                                <span className="text-red-600" title={log.error}>
                                                    {log.error.length > 50 ? log.error.substring(0, 50) + '...' : log.error}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">
                    Toplam <span className="font-semibold text-gray-800">{logs.length}</span> log,
                    gösterilen: <span className="font-semibold text-gray-800">{filteredLogs.length}</span>
                </p>
            </div>
        </div>
    );
};

export default SmsLogs;

