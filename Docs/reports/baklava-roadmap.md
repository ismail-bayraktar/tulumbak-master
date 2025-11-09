# 🧁 Baklavacı E-Ticaret Sitesi - Yol Haritası

## 📋 Proje Genel Bakış
Mevcut Ceviz İncir Pazarı projesini özel bir baklavacı dükkanı için özelleştireceğiz.

## 🎯 Hedef Kitle ve Özellikler
- **Hedef**: Türkiye'deki baklava ve tatlı severler
- **Ödeme**: Kapıda ödeme, kredi kartı, Havale/EFT
- **Teslimat**: Aynı gün teslimat, belirli saat aralığı seçimi
- **Özellikler**: Özel gün paketleri, kurumsal siparişler, abonelik sistemi

## 🚀 Yol Haritası

### Aşama 1: Temel Özelleştirme (1-2 gün) ✅
- [x] Logo ve marka kimliği değişiklikleri
- [x] Renk paleti (altın sarısı, kırmızı, beyaz)
- [x] Site başlığı ve açıklamaları güncelleme
- [x] İletişim bilgileri

### Aşama 2: Ürün Kategorisi Yapısı (2-3 gün)
- [ ] Baklava çeşitleri
  - Antep Baklavası
  - Fıstıklı Baklava
  - Cevizli Baklava
  - Sade Baklava
- [ ] Diğer Tatlılar
  - Kadayıf
  - Künefe
  - Sarı Burma
  - Burma Kadayıf
- [ ] Özel Paketler
  - 1 Kg Paketler
  - 2 Kg Aile Paketi
  - Kurumsat Paketleri
- [ ] İkramlıklar
  - Lokum
  - Akide şekeri
  - Turkish Delight

### Aşama 3: Özel Baklava Özellikleri (3-4 gün) ✅ Backend
- [x] Gramaj seçenekleri (weights: number[])
- [x] Taze mi/ Kuru mu seçimi (freshType: 'taze'|'kuru')
- [x] Özel ambalaj seçenekleri (packaging: 'standart'|'özel')
- [x] Hediye paketi hizmeti (giftWrap: boolean)
- [x] "Hemen Yenir" vs "Servis Gerektirir" etiketleri (labels: string[])

### Aşama 4: Teslimat Sistemi (2-3 gün) ✅ Backend
- [x] İlçe bazlı teslimat ücretleri (DeliveryZoneModel)
- [x] Belirli saat aralığı seçimi (DeliveryTimeSlotModel)
- [x] Aynı gün teslimat seçeneği
- [x] Minimum sipariş tutarı
- [x] Hafta sonu teslimatı
- [x] Kurye entegrasyonu mock (CourierController + CourierRoute)

### Aşama 5: Ödeme Sistemleri (2-3 gün) ✅ Backend
- [x] Kapıda ödeme (paymentMethod, codFee)
- [x] Havale/EFT ile ödeme (bank-info endpoint)
- [x] Kredi kartı ile online ödeme (mevcut PayTR)
- [x] Kapıda ödeme ek ücreti (codFee hesaplama)

### Aşama 6: Özel Baklava Fonksiyonları (3-4 gün) ✅ Backend
- [ ] Özel gün paketleri (düğün, bayram, yılbaşı) - Frontend pending
- [x] Kurumsal sipariş formu (CorporateOrderModel + API)
- [x] İndirim kupon sistemi (CouponModel + validate)
- [ ] Sadakat programı - İleriki aşama

### Aşama 7: İçerik ve SEO (2-3 gün)
- [ ] Baklava tarifleri blog yazıları
- [ ] Ürün açıklamaları SEO uyumlu
- [ ] Sosyal medya entegrasyonu
- [ ] Müşteri yorumları ve puanlama

## 🛠️ Teknik Değişiklikler

### Frontend Değişiklikleri
- [ ] Ana sayfa hero bölümü (taze baklava görseli)
- [ ] Ürün kartları tasarımı
- [ ] Kategori sayfaları
- [ ] Özel gün sayfası
- [ ] Kurumsal sayfası

### Backend Değişiklikleri ✅
- [x] Ürün modeline gramaj ekleme (weights, freshType, packaging, giftWrap, labels)
- [x] Teslimat bölgeleri ve fiyatları (DeliveryZone/TimeSlot + quote API)
- [x] Özel sipariş yönetimi (CorporateOrder)
- [x] Kurye entegrasyonu mock (pickup, webhook)
- [x] Kupon sistemi (CouponModel + validate)

### Admin Panel Değişiklikleri - Pending
- [ ] Ürün yönetimi (gramaj, kategoriler) - UI eklenmeli
- [ ] Teslimat yönetimi - UI eklenmeli
- [ ] Özel sipariş yönetimi - UI eklenmeli
- [ ] İndirim kupon yönetimi - UI eklenmeli
- [ ] Kurye durumları görüntüleme - UI eklenmeli

## 🎨 Tasarım İpuçları
- **Renkler**: Altın sarısı (#FFD700), Kırmızı (#DC143C), Beyaz (#FFFFFF)
- **Font**: El yazısı tarzı fontlar
- **Görseller**: Yüksek çözünürlüklü baklava fotoğrafları
- **İkon**: Baklava dilimi veya Türk kahvesi ikonu

## 📱 Mobil Öncelikli Özellikler
- [ ] Sipariş takibi
- [ ] Push bildirimler (sipariş durumu)
- [ ] WhatsApp sipariş desteği
- [ ] Hızlı sipariş butonu

## 🚀 Lansman Planı
1. **Beta Test**: Yakın arkadaşlar ve aile
2. **Yumuşak Lansman**: Sosyal medya duyurusu
3. **Resmi Lansman**: Reklam kampanyaları

## 💰 Gelir Modelleri
- [ ] Direkt ürün satışı
- [ ] Kurumsat abonelikleri
- [ ] Özel gün paketleri
- [ ] Teslimat ücretleri
- [ ] Reklam gelirleri (diğer işletmeler için)

## 📊 Başarı Metrikleri
- Günlük sipariş sayısı
- Müşteri memnuniyeti
- Tekrar alışveriş oranı
- Ortalama sepet tutarı
- Teslimat süresi

## 🎯 İlk Önce Yapılacaklar (Bugün)
1. Logo ve temel tasarım değişiklikleri
2. Ana sayfa içeriğini baklavacıya göre düzenleme
3. Temel ürün kategorilerini oluşturma
4. İletişim bilgilerini güncelleme
