import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import { Mail, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

const EmailLogs = ({ token }) => {
    const { isDarkMode } = useTheme();
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
        fetchEmailLogs();
    }, []);

    useEffect(() => {
        filterLogs();
    }, [logs, filters]);

    const fetchEmailLogs = async () => {
        try {
            setLoading(true);
            // Mock data for now - replace with actual API call
            const mockLogs = [
                {
                    id: '1',
                    recipient: 'customer@example.com',
                    subject: 'Sipariş Onayı',
                    status: 'success',
                    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    error: null
                },
                {
                    id: '2',
                    recipient: 'customer2@example.com',
                    subject: 'Kurye Atandı',
                    status: 'failed',
                    sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    error: 'SMTP connection timeout'
                },
                {
                    id: '3',
                    recipient: 'customer3@example.com',
                    subject: 'Teslim Edildi',
                    status: 'success',
                    sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    error: null
                }
            ];
            
            setLogs(mockLogs);
            calculateStats(mockLogs);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Email logları yüklenirken hata oluştu');
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
                log.subject.toLowerCase().includes(query) ||
                (log.error && log.error.toLowerCase().includes(query))
            );
        }

        setFilteredLogs(filtered);
    };

    const sendTestEmail = async () => {
        const testEmail = prompt('Test email adresini girin:');
        if (!testEmail) return;

        try {
            const response = await axios.post(
                backendUrl + '/api/settings/test-email',
                { email: testEmail },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Test email başarıyla gönderildi');
                fetchEmailLogs(); // Refresh logs
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Test email gönderilirken hata oluştu');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('tr-TR');
    };

    const getStatusColor = (status) => {
        return status === 'success' 
            ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400' 
            : 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Logları</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Email gönderim geçmişi ve istatistikleri</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam Email</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Başarılı</p>
                            <p className="text-2xl font-bold text-success-600 dark:text-success-400">{stats.success}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Başarısız</p>
                            <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">{stats.failed}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Başarı Oranı</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.successRate.toFixed(1)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Durum
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        >
                            <option value="all">Tümü</option>
                            <option value="success">Başarılı</option>
                            <option value="failed">Başarısız</option>
                        </select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tarih Aralığı
                        </label>
                        <select
                            value={filters.dateRange}
                            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        >
                            <option value="all">Tümü</option>
                            <option value="today">Bugün</option>
                            <option value="7days">Son 7 Gün</option>
                            <option value="30days">Son 30 Gün</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Arama
                        </label>
                        <input
                            type="text"
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                            placeholder="Email, konu, hata..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end">
                        <button
                            onClick={sendTestEmail}
                            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-md transition-colors font-medium"
                        >
                            Test Email Gönder
                        </button>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Alıcı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Konu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Gönderim Zamanı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Hata
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Log bulunamadı
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {log.recipient}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {log.subject}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                                                {log.status === 'success' ? 'Başarılı' : 'Başarısız'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {formatDate(log.sentAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {log.error ? (
                                                <span className="text-danger-600 dark:text-danger-400" title={log.error}>
                                                    {log.error.length > 50 ? log.error.substring(0, 50) + '...' : log.error}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
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
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toplam <span className="font-semibold text-gray-900 dark:text-white">{logs.length}</span> log,
                    gösterilen: <span className="font-semibold text-gray-900 dark:text-white">{filteredLogs.length}</span>
                </p>
            </div>
        </div>
    );
};

export default EmailLogs;

