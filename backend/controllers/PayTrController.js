import { getPaytrToken, validatePaytrCallback } from "../services/PayTrService.js";
import {render} from "ejs";
import orderModel from "../models/OrderModel.js";
import {response} from "express";
import userModel from "../models/UserModel.js";

// PayTR Token isteği
export const requestPaytrToken = async (req, res) => {
    try {
        const paymentData = req.body;
        //console.log("user id: " + paymentData.userId)
        const data = await getPaytrToken(paymentData);
        if (data.status === 'success') {
            res.status(200).json({ success: true, token: data.token });
        } else {
            res.status(400).json({ success: false, message: data.reason });
        }

    } catch (error) {
        console.error("Backend hatası:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updatePayTrOrderItemsAndAddress = async (req, res) => {
    try {
        const {userId, address, items } = req.body;

        // 1. Kullanıcının en son siparişini bul (tüm siparişler arasından)
        const lastOrder = await orderModel.findOne(
            { userId },
            {},
            { sort: { date: -1 } } // date'e göre ters sırala (en yeni en üstte)
        );

        if (!lastOrder) {
            return res.status(404).json({
                success: false,
                message: "Sipariş bulunamadı"
            });
        }

        // 2. Siparişi güncelle
        const updatedOrder = await orderModel.findByIdAndUpdate(
            lastOrder._id, // Bulunan siparişin ID'si
            {
                $set: {
                    address: address, // Yeni adres
                    items: items      // Yeni ürünler
                }
            },
            { new: true } // Güncellenmiş versiyonu döndür
        );

        res.status(200).json({
            success: true,
            order: updatedOrder
        });

    } catch (error) {
        console.error("Güncelleme hatası:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası",
            error: error.message
        });
    }
};

// PayTR Callback kontrolü
export const handlePaytrCallback = async (req, res) => {
    try {
        const callbackData = req.body;
        // Callback hash doğrulaması
        validatePaytrCallback(callbackData);
        // Callback'in başarılı olduğu durum
        if (callbackData.status === 'success') {
            const orderIds = callbackData.merchant_oid;
            const order = await orderModel.findOneAndUpdate({orderId: orderIds}, { payment: true });
            const user = await userModel.findById(order.userId);
            user.cartData = {};
            await user.save();
            // Ödeme başarılıysa işlem yapılabilir (örneğin, sipariş onaylama vb.
            res.send('OK');
        } else {
            // Ödeme başarısızsa yapılacak işlemler
            res.send('FAILED');
        }
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid callback", error: error.message });
    }
};
