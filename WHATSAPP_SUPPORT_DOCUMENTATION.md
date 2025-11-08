# WhatsApp Müşteri Desteği (MVP) - Dokümantasyon

## Genel Bakış

Tulumbak e-ticaret sitesi için admin panelinden %100 yönetilebilen WhatsApp müşteri desteği floating butonu. MVP kapsamında geliştirilmiştir.

## Özellikler

- ✅ Admin panelinden tam kontrol
- ✅ Masaüstü ve mobil için ayrı ayarlar
- ✅ Canlı önizleme
- ✅ Kontrast uyarıları (WCAG uyumluluğu)
- ✅ GA4 event tracking
- ✅ Erişilebilirlik (A11y) desteği
- ✅ SSR güvenli (client-side mount)
- ✅ Ürün sayfasında otomatik mesaj ön-dolumu

## Teknik Yapı

### Backend

#### 1. Zod Şeması
**Dosya:** `backend/schemas/WhatsAppSettingsSchema.js`

- E.164 telefon numarası validasyonu
- HEX renk validasyonu
- Position enum validasyonu
- Icon type validasyonu
- SVG sanitization

#### 2. Settings Controller
**Dosya:** `backend/controllers/SettingsController.js`

- `getWhatsAppSettings()` - Public endpoint (frontend için)
- `updateWhatsAppSettings()` - Admin endpoint (auth gerekli)

#### 3. Routes
**Dosya:** `backend/routes/SettingsRoute.js`

- `GET /api/settings/whatsapp` - Public (ayarları getir)
- `POST /api/settings/whatsapp` - Admin (ayarları güncelle)

### Admin Panel

#### WhatsApp Settings Tab
**Dosya:** `admin/src/pages/Settings.jsx`

**Özellikler:**
- Genel ayarlar (enabled, phone, icon type)
- Masaüstü ve mobil için ayrı sekmeler
- Canlı önizleme (gerçek zamanlı)
- Kontrast uyarıları
- E.164 format doğrulaması
- HEX renk doğrulaması

**Form Alanları:**
- **Genel:**
  - Enabled (checkbox)
  - WhatsApp Numarası (E.164 format)
  - İkon Tipi (React Icon / Custom SVG)
  - İkon Adı (React Icon seçildiyse)
  - Özel SVG Kodu (Custom SVG seçildiyse)

- **Cihaz Ayarları (Masaüstü/Mobil):**
  - Ürün sayfasında göster (checkbox)
  - Buton Metni
  - Konum (6 preset)
  - X Ofseti (0-120px)
  - Y Ofseti (0-120px)
  - Arkaplan Rengi (HEX)
  - İkon Rengi (HEX)
  - Metin Rengi (HEX)

### Frontend

#### WhatsAppSupport Component
**Dosya:** `frontend/src/components/WhatsAppSupport.jsx`

**Özellikler:**
- Client-side mount guard (SSR safe)
- User Agent tespiti (mobil/masaüstü)
- Konumlandırma (preset + offset)
- Ürün sayfası davranışı
- A11y desteği (aria-label, focus ring, klavye erişilebilirliği)
- GA4 event tracking

**Props:**
- `productName` (optional) - Ürün adı (PDP için)
- `productUrl` (optional) - Ürün URL'i (PDP için)

**Davranış:**
- Mobil: `https://wa.me/<numara>?text=...`
- Masaüstü: `https://web.whatsapp.com/send?phone=<numara>&text=...`
- PDP'de: Otomatik mesaj ön-dolumu (`Merhaba, {productName} hakkında bilgi almak istiyorum. Link: {productUrl}`)

#### GA4 Helper
**Dosya:** `frontend/src/utils/ga4.js`

**Fonksiyonlar:**
- `trackEvent(eventName, eventParams)` - Genel event tracking
- `trackWhatsAppClick({ page, product_name })` - WhatsApp click tracking

**Event:** `click_whatsapp_support`
**Parametreler:**
- `page` - Mevcut sayfa path'i
- `product_name` (optional) - Ürün adı (PDP'de)

## Entegrasyon

### App.jsx
```jsx
import WhatsAppSupport from "./components/WhatsAppSupport.jsx";

// Global render (tüm sayfalarda görünür)
<WhatsAppSupport />
```

### ModernProductDetail.jsx
```jsx
import WhatsAppSupport from "./WhatsAppSupport.jsx";

// Ürün bilgileriyle render (otomatik mesaj için)
<WhatsAppSupport 
    productName={productData.name}
    productUrl={`/product/${productData._id}`}
/>
```

## Varsayılan Ayarlar

```javascript
{
  enabled: false,
  phoneE164: '+905551234567',
  iconType: 'reactIcon',
  iconName: 'MessageCircle',
  desktop: {
    showOnProduct: false,
    buttonText: 'WhatsApp\'tan Sor',
    position: 'bottom-right',
    offsetX: 20,
    offsetY: 20,
    bgColor: '#25D366',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF'
  },
  mobile: {
    showOnProduct: false,
    buttonText: 'WhatsApp',
    position: 'bottom-right',
    offsetX: 16,
    offsetY: 16,
    bgColor: '#25D366',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF'
  }
}
```

## QA Checklist

### Fonksiyonel Testler

- [ ] Admin panelden WhatsApp desteği açılıp kapatılabiliyor
- [ ] Kapatıldığında buton tüm sayfalarda kayboluyor
- [ ] Masaüstü ve mobil için ayrı ayarlar çalışıyor
- [ ] Konum preset'leri doğru çalışıyor
- [ ] Offset değerleri doğru uygulanıyor
- [ ] Renk ayarları canlı önizlemede görünüyor
- [ ] Mobil cihazda `wa.me` linki açılıyor
- [ ] Masaüstünde `web.whatsapp.com` linki açılıyor
- [ ] Ürün sayfasında mesaj otomatik ön-doluyor
- [ ] Ürün sayfasında `showOnProduct=false` ise buton görünmüyor
- [ ] E.164 format doğrulaması çalışıyor
- [ ] HEX renk doğrulaması çalışıyor

### Erişilebilirlik (A11y) Testleri

- [ ] Klavye ile erişilebilir (Tab, Enter)
- [ ] Focus ring görünüyor
- [ ] `aria-label` mevcut
- [ ] Kontrast uyarısı düşük kontrastta gösteriliyor
- [ ] Screen reader ile test edildi

### Responsive Testler

- [ ] Masaüstü görünümü doğru
- [ ] Mobil görünümü doğru
- [ ] Tablet görünümü doğru
- [ ] Farklı ekran boyutlarında konumlandırma doğru

### GA4 Testleri

- [ ] Event `click_whatsapp_support` tetikleniyor
- [ ] `page` parametresi doğru gönderiliyor
- [ ] PDP'de `product_name` parametresi gönderiliyor
- [ ] GA4 console'da event görünüyor

### Performans Testleri

- [ ] SSR hatası yok
- [ ] Hydration hatası yok
- [ ] Settings fetch performansı kabul edilebilir
- [ ] Component re-render optimizasyonu yapıldı

## Güvenlik

- ✅ Custom SVG sanitization (script tag ve event handler'lar kaldırılıyor)
- ✅ Public endpoint sadece GET (ayarları okumak için)
- ✅ Admin endpoint POST (ayarları güncellemek için auth gerekli)
- ✅ Zod validation (backend'de tüm input'lar validate ediliyor)

## Riskler ve Notlar

### Riskler

1. **GA4 Yapılandırması:** GA4 yapılandırılmamışsa event'ler sessizce başarısız olur (development modunda console.log)
2. **SVG Güvenliği:** Custom SVG kullanıldığında sanitization yapılıyor, ancak karmaşık SVG'lerde edge case'ler olabilir
3. **Performans:** Her component mount'ta settings fetch ediliyor. İleride cache veya context API ile optimize edilebilir

### Notlar

- WhatsApp numarası E.164 formatında olmalıdır (örn: `+905551234567`)
- Kontrast uyarısı WCAG 2.1 AA standardına göre (minimum 4.5:1)
- Mobil tespiti User Agent'a dayanıyor, bazı edge case'lerde yanlış tespit edilebilir
- PDP'de otomatik mesaj sadece `productName` ve `productUrl` prop'ları verildiğinde çalışır

## Gelecek İyileştirmeler (MVP Dışı)

- [ ] Settings cache (Context API veya React Query)
- [ ] Multiple WhatsApp numbers (farklı diller için)
- [ ] Scheduled visibility (belirli saatlerde görünürlük)
- [ ] Analytics dashboard (tıklama istatistikleri)
- [ ] A/B testing desteği
- [ ] Custom message templates
- [ ] Multi-language support

## Sorun Giderme

### Buton görünmüyor
1. Admin panelden `enabled` checkbox'ının işaretli olduğunu kontrol edin
2. Browser console'da hata var mı kontrol edin
3. Settings fetch başarılı mı kontrol edin (`/api/settings/whatsapp`)

### Mesaj ön-dolumu çalışmıyor
1. `ModernProductDetail` component'inde `productName` ve `productUrl` prop'larının geçildiğini kontrol edin
2. `location.pathname` `/product/` ile başlıyor mu kontrol edin

### GA4 event'ler görünmüyor
1. GA4 yapılandırmasını kontrol edin
2. Browser console'da `[GA4] Event tracked:` log'larını kontrol edin (development modunda)
3. GA4 DebugView'de event'leri kontrol edin

## Destek

Sorularınız için: [GitHub Issues](https://github.com/your-repo/issues)

