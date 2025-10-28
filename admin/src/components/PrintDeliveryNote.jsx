import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PrintDeliveryNote = ({ order, onClose, isOpen = false }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Irsaliye_${order.trackingId || order._id.slice(-8)}`,
        onAfterPrint: () => {
            onClose && onClose();
        }
    });

    if (!isOpen) return null;

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">İrsaliye Yazdır</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            🖨️ Yazdır
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Kapat
                        </button>
                    </div>
                </div>

                {/* Print Content */}
                <div ref={componentRef} className="p-8 bg-white">
                    {/* Company Header */}
                    <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">TULUMBAK GIDA</h1>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>📍 Adres: İzmir, Bornova, Sanayi Mahallesi</p>
                            <p>📞 Telefon: +90 232 XXX XX XX</p>
                            <p>📧 Email: info@tulumbak.com</p>
                            <p>🌐 Web: www.tulumbak.com</p>
                        </div>
                    </div>

                    {/* Delivery Note Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">İrsaliye Bilgileri</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>İrsaliye No:</strong> {order.trackingId || order._id.slice(-8)}</p>
                                <p><strong>Tarih:</strong> {formatDate(order.date)}</p>
                                <p><strong>Sipariş No:</strong> {order._id.slice(-8)}</p>
                                <p><strong>Durum:</strong> {order.status}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Teslimat Bilgileri</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Ad Soyad:</strong> {order.address?.firstName} {order.address?.lastName}</p>
                                <p><strong>Telefon:</strong> {order.address?.phone}</p>
                                <p><strong>Adres:</strong> {order.address?.street}</p>
                                <p><strong>Şehir:</strong> {order.address?.city}, {order.address?.state}</p>
                                <p><strong>Posta Kodu:</strong> {order.address?.zipcode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Ürün Listesi</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-3 text-left font-semibold">Ürün</th>
                                    <th className="border border-gray-300 p-3 text-center font-semibold">Adet</th>
                                    <th className="border border-gray-300 p-3 text-center font-semibold">Birim</th>
                                    <th className="border border-gray-300 p-3 text-right font-semibold">Toplam</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-3">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                {item.size && <p className="text-sm text-gray-600">{item.size}</p>}
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                                        <td className="border border-gray-300 p-3 text-center">Adet</td>
                                        <td className="border border-gray-300 p-3 text-right">₺{((item.price || 0) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Teslimat Detayları</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Teslimat Yöntemi:</strong> Kurye</p>
                                <p><strong>Ödeme Yöntemi:</strong> {order.paymentMethod}</p>
                                <p><strong>Durum:</strong> {order.status}</p>
                                {order.courierStatus && (
                                    <p><strong>Kurye Durumu:</strong> {order.courierStatus}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Toplam Tutar</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-800">₺{(order.amount || 0).toFixed(2)}</p>
                                    {order.codFee > 0 && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Kapıda Ödeme Ücreti: ₺{order.codFee.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Info */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Takip Bilgileri</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p><strong>Takip ID:</strong> {order.trackingId || 'N/A'}</p>
                                    <p><strong>Takip Linki:</strong></p>
                                    <p className="text-blue-600 break-all">{order.trackingLink || 'N/A'}</p>
                                </div>
                                <div>
                                    <p><strong>Kurye Takip ID:</strong> {order.courierTrackingId || 'N/A'}</p>
                                    <p><strong>Durum Geçmişi:</strong> {order.statusHistory?.length || 0} kayıt</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-8 mt-8">
                        <div className="text-center">
                            <div className="border-t border-gray-300 pt-2 mt-16">
                                <p className="text-sm text-gray-600">Gönderen</p>
                                <p className="font-semibold">Tulumbak Gıda</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-gray-300 pt-2 mt-16">
                                <p className="text-sm text-gray-600">Teslim Alan</p>
                                <p className="font-semibold">{order.address?.firstName} {order.address?.lastName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
                        <p>Bu irsaliye elektronik ortamda düzenlenmiştir.</p>
                        <p>Takip için: {order.trackingLink || `https://tulumbak.com/track/${order.trackingId}`}</p>
                        <div className="mt-2">
                            {/* Barcode placeholder */}
                            <div className="inline-block w-32 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs">
                                BARCODE: {order.trackingId || order._id.slice(-8)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintDeliveryNote;

