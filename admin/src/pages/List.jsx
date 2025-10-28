import {useEffect, useState} from 'react'
import axios from "axios";
import {backendUrl, currency} from "../App.jsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const List = ( {token} ) => {

    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'all',
        stockStatus: 'all',
        searchQuery: ''
    });
    const [sortBy, setSortBy] = useState('name');
    const navigate = useNavigate();

    const fetchList = async ()=>{
        try{
            setLoading(true);
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success){
                setList(response.data.products || []);
                setFilteredList(response.data.products || []);
            }else{
                toast.error(response.data.message)
            }
        }catch (error){
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    // Filter and sort products
    useEffect(() => {
        let filtered = list;

        // Category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        // Stock status filter
        if (filters.stockStatus !== 'all') {
            if (filters.stockStatus === 'in-stock') {
                filtered = filtered.filter(product => (product.stock || 0) > 0);
            } else if (filters.stockStatus === 'out-of-stock') {
                filtered = filtered.filter(product => (product.stock || 0) === 0);
            } else if (filters.stockStatus === 'low-stock') {
                filtered = filtered.filter(product => (product.stock || 0) > 0 && (product.stock || 0) < 10);
            }
        }

        // Search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query)
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return (b.basePrice || 0) - (a.basePrice || 0);
                case 'stock':
                    return (b.stock || 0) - (a.stock || 0);
                case 'date':
                    return new Date(b.date || 0) - new Date(a.date || 0);
                default:
                    return 0;
            }
        });

        setFilteredList(filtered);
    }, [list, filters, sortBy]);
    const removeProduct = async (id) => {
        try{
            const response = await axios.post(backendUrl + '/api/product/remove', {id} , {headers:{token}});
            if(response.data.success){
                toast.success(response.data.message)
                await fetchList();
            }else {
                toast.error(response.data.message)
            }
        }catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }
    useEffect(() => {
        fetchList()
    }, []);
    const getStockStatus = (stock) => {
        const stockNum = stock || 0;
        if (stockNum === 0) return { text: 'Stokta Yok', color: 'bg-red-100 text-red-800' };
        if (stockNum < 10) return { text: 'Az Stok', color: 'bg-orange-100 text-orange-800' };
        return { text: 'Stokta Var', color: 'bg-green-100 text-green-800' };
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
                <h1 className="text-3xl font-bold text-gray-800">Ürün Listesi</h1>
                <p className="text-gray-600 mt-2">Tüm ürünleri görüntüleyin ve yönetin</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arama
                        </label>
                        <input
                            type="text"
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                            placeholder="Ürün adı, kategori, açıklama..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kategori
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tümü</option>
                            <option value="Baklava">Baklava</option>
                            <option value="Kadayıf">Kadayıf</option>
                            <option value="Sütlü Tatlı">Sütlü Tatlı</option>
                            <option value="Kuru Tatlı">Kuru Tatlı</option>
                            <option value="Möğürlü Tatlı">Möğürlü Tatlı</option>
                            <option value="Şerbetli Tatlı">Şerbetli Tatlı</option>
                            <option value="Özel Paket">Özel Paket</option>
                        </select>
                    </div>

                    {/* Stock Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stok Durumu
                        </label>
                        <select
                            value={filters.stockStatus}
                            onChange={(e) => setFilters({...filters, stockStatus: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tümü</option>
                            <option value="in-stock">Stokta Var</option>
                            <option value="low-stock">Az Stok</option>
                            <option value="out-of-stock">Stokta Yok</option>
                        </select>
                    </div>
                </div>

                {/* Sort */}
                <div className="mt-4 flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Sırala:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="name">İsme Göre</option>
                        <option value="price">Fiyata Göre</option>
                        <option value="stock">Stoka Göre</option>
                        <option value="date">Tarihe Göre</option>
                    </select>
                </div>
            </div>

            {/* Products List */}
            <div className="space-y-4">
                {filteredList.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">Ürün bulunamadı</p>
                    </div>
                ) : (
                    filteredList.map((item, index) => {
                        const stockStatus = getStockStatus(item.stock);
                        return (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow" key={index}>
                                <div className="grid grid-cols-1 md:grid-cols-[80px_auto_1fr_120px_120px_150px] gap-4 items-center">
                                    {/* Image */}
                                    <div className="flex justify-center md:justify-start">
                                        <img className="w-16 h-16 object-cover rounded-lg border border-gray-200" src={item.image?.[0] || ''} alt={item.name || ''}/>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                        {item.bestseller && (
                                            <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                                                ⭐ Öne Çıkan
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="hidden md:block">
                                        <p className="text-sm text-gray-600 line-clamp-2">{item.description || 'Açıklama yok'}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center">
                                        <p className="font-bold text-gray-800">{item.basePrice}{currency}</p>
                                        <p className="text-xs text-gray-500">Fiyat</p>
                                    </div>

                                    {/* Stock */}
                                    <div className="text-center">
                                        <p className="font-bold text-gray-800">{item.stock || 0}</p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${stockStatus.color}`}>
                                            {stockStatus.text}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/edit/${item._id}`)}
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => removeProduct(item._id)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Stats */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">
                    Toplam <span className="font-semibold text-gray-800">{list.length}</span> ürün,
                    gösterilen: <span className="font-semibold text-gray-800">{filteredList.length}</span>
                </p>
            </div>
        </div>
    );
}

export default List
