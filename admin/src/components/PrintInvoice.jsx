import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PrintInvoice = ({ order, onClose, isOpen = false }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Fatura_${order?.trackingId || order?._id?.slice(-8) || 'Unknown'}`,
        onAfterPrint: () => {
            onClose && onClose();
        }
    });

    if (!isOpen || !order) return null;

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTax = (amount) => {
        const taxRate = 0.18; // %18 KDV
        const taxAmount = amount * taxRate;
        const subtotal = amount - taxAmount;
        return { subtotal, taxAmount, total: amount };
    };

    const totals = calculateTax(order.amount || 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Fatura Yazdır</h2>
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
                        <div className="mt-4 text-sm text-gray-600">
                            <p><strong>Vergi No:</strong> 1234567890</p>
                            <p><strong>Mersis No:</strong> 0123456789012345</p>
                        </div>
                    </div>

                    {/* Invoice Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Fatura Bilgileri</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Fatura No:</strong> {order.trackingId || order._id.slice(-8)}</p>
                                <p><strong>Tarih:</strong> {formatDate(order.date)}</p>
                                <p><strong>Sipariş No:</strong> {order._id.slice(-8)}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Müşteri Bilgileri</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Ad Soyad:</strong> {order.address?.firstName} {order.address?.lastName}</p>
                                <p><strong>Telefon:</strong> {order.address?.phone}</p>
                                <p><strong>Adres:</strong> {order.address?.street}</p>
                                <p><strong>Şehir:</strong> {order.address?.city}, {order.address?.state}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Ürün Detayları</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-3 text-left font-semibold">Ürün</th>
                                    <th className="border border-gray-300 p-3 text-center font-semibold">Adet</th>
                                    <th className="border border-gray-300 p-3 text-right font-semibold">Birim Fiyat</th>
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
                                        <td className="border border-gray-300 p-3 text-right">₺{(item.price || 0).toFixed(2)}</td>
                                        <td className="border border-gray-300 p-3 text-right">₺{((item.price || 0) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Ödeme Bilgileri</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Ödeme Yöntemi:</strong> {order.paymentMethod}</p>
                                <p><strong>Durum:</strong> {order.payment ? 'Ödendi' : 'Bekleniyor'}</p>
                                {order.codFee > 0 && (
                                    <p><strong>Kapıda Ödeme Ücreti:</strong> ₺{order.codFee.toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Ara Toplam:</span>
                                        <span>₺{totals.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>KDV (%18):</span>
                                        <span>₺{totals.taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
                                        <span>Toplam:</span>
                                        <span>₺{totals.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
                        <p>Bu fatura elektronik ortamda düzenlenmiştir.</p>
                        <p>Takip için: {order.trackingLink || `https://tulumbak.com/track/${order.trackingId}`}</p>
                        <div className="mt-2">
                            {/* QR Code placeholder */}
                            <div className="inline-block w-16 h-16 bg-gray-200 border border-gray-300 flex items-center justify-center">
                                QR
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintInvoice;

