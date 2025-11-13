import { useState } from 'react';
import CartTotal from './CartTotal.jsx';
import { assets } from '../assets/assets.js';

const CheckoutSteps = ({ 
    currentStep, 
    setCurrentStep, 
    formData, 
    onChangeHandler, 
    method, 
    setMethod,
    zones,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    setDeliveryFee,
    couponCode,
    setCouponCode,
    couponDiscount,
    handleCouponApply,
    timeSlots,
    selectedTimeSlot,
    setSelectedTimeSlot,
    bankInfo,
    onSubmitHandler
}) => {
    return (
        <>
            {/* STEP 1: SEPET ÖZETİ */}
            {currentStep === 1 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Sepet Özeti</h2>
                    <div className="border p-6 bg-gray-50">
                        <CartTotal deliveryFee={deliveryFee} couponDiscount={couponDiscount} />
                    </div>
                    <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-full mt-6 bg-black text-white px-6 py-3"
                    >
                        Devam Et - Teslimat Bilgileri
                    </button>
                </div>
            )}

            {/* STEP 2: ADRES VE TESLİMAT */}
            {currentStep === 2 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Teslimat Bilgileri</h2>
                    
                    {/* Adres Formu */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex gap-3">
                            <input
                                required
                                onChange={onChangeHandler}
                                name="firstName"
                                value={formData.firstName}
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                type="text"
                                placeholder="Adınız"
                            />
                            <input
                                required
                                onChange={onChangeHandler}
                                name="lastName"
                                value={formData.lastName}
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                type="text"
                                placeholder="Soyadınız"
                            />
                        </div>
                        <input
                            required
                            onChange={onChangeHandler}
                            name="email"
                            value={formData.email}
                            className="border border-gray-300 rounded py-2 px-3 w-full"
                            type="email"
                            placeholder="Email Adresiniz"
                        />
                        <input
                            required
                            onChange={onChangeHandler}
                            name="street"
                            value={formData.street}
                            className="border border-gray-300 rounded py-2 px-3 w-full"
                            type="text"
                            placeholder="Sokak Adı, Bina No, Kapı No"
                        />
                        <div className="flex gap-3">
                            <input
                                required
                                onChange={onChangeHandler}
                                name="city"
                                value={formData.city}
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                type="text"
                                placeholder="Şehir"
                            />
                            <input
                                required
                                onChange={onChangeHandler}
                                name="state"
                                value={formData.state}
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                type="text"
                                placeholder="Mahalle"
                            />
                        </div>
                        <div className="flex gap-3">
                            <input
                                required
                                onChange={onChangeHandler}
                                name="zipcode"
                                value={formData.zipcode}
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                type="number"
                                placeholder="Posta Kodu"
                            />
                            <input
                                required
                                onChange={onChangeHandler}
                                name="country"
                                value={formData.country}
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                type="text"
                                placeholder="Ülke"
                                disabled={true}
                            />
                        </div>
                        <div className="flex gap-3">
                            <p className="text-m mt-2">+90</p>
                            <input
                                required
                                onChange={onChangeHandler}
                                name="phone"
                                value={formData.phone}
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                type="tel"
                                placeholder="Telefon Numaranız"
                                minLength={10}
                                maxLength={10}
                            />
                        </div>
                    </div>

                    {/* Teslimat Bölgesi */}
                    <div className="mb-4">
                        <p className="mb-2 font-medium">Teslimat Bölgesi</p>
                        <select
                            value={deliveryZone}
                            onChange={(e) => {
                                setDeliveryZone(e.target.value);
                                const zone = zones.find(z => z._id === e.target.value);
                                if (zone) setDeliveryFee(zone.fee);
                            }}
                            className="w-full border border-gray-300 rounded py-2 px-3"
                        >
                            <option value="">Bölge seçiniz</option>
                            {zones.map((zone) => (
                                <option key={zone._id} value={zone._id}>
                                    {zone.district} - {zone.fee}₺
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Zaman Aralığı */}
                    {deliveryZone && timeSlots.length > 0 && (
                        <div className="mb-4">
                            <p className="mb-2 font-medium">Teslimat Zamanı</p>
                            <select
                                value={selectedTimeSlot}
                                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                className="w-full border border-gray-300 rounded py-2 px-3"
                            >
                                <option value="">Zaman aralığı seçiniz</option>
                                {timeSlots.map((slot) => (
                                    <option key={slot._id} value={slot._id}>
                                        {slot.label} ({slot.start} - {slot.end})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Kupon */}
                    <div className="mb-6">
                        <p className="mb-2 font-medium">Kupon Kodu</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Kupon kodu girin"
                                className="flex-1 border border-gray-300 rounded py-2 px-3"
                            />
                            <button
                                type="button"
                                onClick={handleCouponApply}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                Uygula
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3"
                        >
                            Geri
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="flex-1 bg-black text-white px-6 py-3"
                        >
                            Devam Et - Ödeme
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: ÖDEME */}
            {currentStep === 3 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Ödeme Yöntemi</h2>
                    <div className="mb-6">
                        <CartTotal deliveryFee={deliveryFee} couponDiscount={couponDiscount}/>
                    </div>

                    <div className="flex gap-3 flex-col lg:flex-row mb-4">
                        <div onClick={() => setMethod('KAPIDA')}
                             className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'KAPIDA' ? 'bg-green-400' : ''}`}></p>
                                <p className="text-gray-800 text-sm font-medium mx-4">KAPIDA ÖDEME</p>
                        </div>
                        <div onClick={() => setMethod('HAVALE/EFT')}
                             className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'HAVALE/EFT' ? 'bg-green-400' : ''}`}></p>
                            <p className="text-gray-800 text-sm font-medium mx-4">HAVALE / EFT</p>
                        </div>
                        <div onClick={() => setMethod('paytr')} 
                             className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paytr' ? 'bg-green-400' : ''}`}></p>
                            <p className="text-gray-800 text-sm font-medium mx-4">KREDİ/BANKA KARTI</p>
                        </div>
                    </div>

                    {method === "HAVALE/EFT" && bankInfo && (
                        <div className="mb-4 border p-4">
                            <p className="font-semibold mb-2">HAVALE / EFT BİLGİLERİ</p>
                            <p>Hesap Adı: {bankInfo.accountName}</p>
                            <p>Banka: {bankInfo.bankName}</p>
                            <p>IBAN: {bankInfo.iban}</p>
                        </div>
                    )}

                    {method === "KAPIDA" && (
                        <div className="mb-4 border p-4 text-sm text-orange-600">
                            Kapıda ödeme ek ücreti: 10₺ eklenecektir.
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3"
                        >
                            Geri
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-black text-white px-6 py-3"
                        >
                            Siparişi Tamamla
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckoutSteps;

