# Changelog - Tulumbak İzmir Baklava

## ✅ Tamamlananlar

### Backend
- ✅ ProductModel: weights, freshType, packaging, giftWrap, labels
- ✅ DeliveryZone/TimeSlot modelleri ve CRUD API
- ✅ CourierController: mock kurye entegrasyonu
- ✅ CouponModel: kupon doğrulama ve CRUD
- ✅ CorporateOrderModel: kurumsal sipariş sistemi
- ✅ OrderModel: paymentMethod, codFee, delivery, giftNote
- ✅ Bank-info endpoint: havale/EFT bilgileri
- ✅ Docker MongoDB setup

### Admin Panel
- ✅ DeliveryZones, TimeSlots, Coupons yönetim sayfaları
- ✅ Add.jsx: freshType, packaging, giftWrap, labels UI alanları
- ✅ Sidebar menü güncellemeleri

### Frontend
- ✅ PlaceOrder.jsx: delivery zone, kupon, kapıda ödeme seçenekleri
- ✅ Product.jsx: taze/kuru, ambalaj, hediye paketi, labels badge'leri
- ✅ Ürün bilgi kartları: alerjen, malzeme, raf ömrü, saklama

## 🔄 Devam Eden

- [ ] Edit.jsx için yeni alanları ekle
- [ ] Frontend ProductItem.jsx'te yeni alanları göster
- [ ] Time slot seçimi ekle
- [ ] Sepet toplam hesaplamasına kupon indirimini dahil et
- [ ] Test verisi oluştur

## 📝 Notlar

- Tüm backend API'ler çalışır durumda
- Admin panelde ürün eklerken yeni alanlar kullanılabilir
- Frontend'de ürün detayında yeni badge'ler gösteriliyor
- Checkout akışında delivery ve kupon seçimi aktif

