# Media Library/Gallery Sistemi - Uygulama Planı

## Tamamlanan Adımlar ✅

### 1. ✅ Static File Serving
- `/assets/` için static serving eklendi
- `/uploads/` için static serving zaten vardı
- CORS headers eklendi

### 2. ✅ Media Model Düzeltmeleri
- `publicId` optional yapıldı (local storage için)
- `secureUrl` optional yapıldı
- `sparse: true` eklendi (multiple null values için)

### 3. ✅ Media Controller Düzeltmeleri
- `secureUrl` full URL olarak set ediliyor
- Local storage için uyumlu hale getirildi

## Yapılacaklar

### 1. ⏳ ProductController Media Entegrasyonu
**Hedef:** Ürün görsellerini hem eski sistemde (backward compatibility) hem de Media model'e kaydet

**Yaklaşım:**
- Mevcut `/assets/` sistemini koru
- Görselleri Media model'e de kaydet
- Product'ta hem URL hem Media ID sakla (opsiyonel)

**Değişiklikler:**
```javascript
// addProduct ve updateProduct'ta:
const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

// Eski sistem (backward compatibility)
const imagesUrl = images.map(item => `/assets/${item.filename}`);

// Yeni sistem (Media model'e kaydet)
const mediaDocs = await Promise.all(
    images.map(async (file) => {
        const media = new Media({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            url: `/assets/${file.filename}`,
            secureUrl: `${req.protocol}://${req.get('host')}/assets/${file.filename}`,
            category: 'product',
            folder: 'products',
            alt: `${name} - Ürün görseli`,
            title: name,
            uploadedBy: 'admin'
        });
        await media.save();
        return media._id.toString(); // Media ID
    })
);

// Product'a hem URL hem Media ID kaydet (opsiyonel)
productData.image = imagesUrl; // Mevcut sistem
productData.imageMediaIds = mediaDocs; // Yeni sistem (opsiyonel)
```

### 2. ⏳ Admin Panel Media Gallery Component
**Hedef:** Görsel seçme/yükleme için modern bir UI

**Özellikler:**
- Görsel yükleme
- Görsel listeleme (grid view)
- Görsel seçme
- Görsel silme
- Görsel önizleme
- Kategori/folder filtreleme
- Arama

**Dosya:** `admin/src/components/MediaGallery.jsx`

### 3. ⏳ Admin Panel Media Library Sayfası
**Hedef:** Tüm medya dosyalarını yönetmek için sayfa

**Özellikler:**
- Tüm görselleri listele
- Görsel yükle
- Görsel sil
- Görsel düzenle (alt, title, tags)
- Kategori/folder yönetimi

**Dosya:** `admin/src/pages/MediaLibrary.jsx`

### 4. ⏳ Ürün Formları Güncelleme
**Hedef:** Add.jsx ve Edit.jsx'i Media Gallery ile entegre et

**Yaklaşım:**
- File input yerine Media Gallery kullan
- Seçilen görselleri Media ID'leri olarak kaydet
- Backward compatibility için URL'leri de koru

## Uygulama Sırası

1. ✅ Static file serving
2. ✅ Media model düzeltmeleri
3. ⏳ ProductController Media entegrasyonu
4. ⏳ Media Gallery component
5. ⏳ Media Library sayfası
6. ⏳ Ürün formları güncelleme

## Riskler ve Önlemler

### Risk 1: Mevcut Görseller Kaybolabilir
**Önlem:** 
- Mevcut sistemi koru (backward compatibility)
- Migration script ile mevcut görselleri Media model'e kaydet

### Risk 2: Performance
**Önlem:**
- Lazy loading
- Pagination
- Image optimization

### Risk 3: Database Boyutu
**Önlem:**
- Media model'de sadece metadata sakla
- Dosyalar file system'de kalsın

## Sonuç

Media Library sistemi kurulduğunda:
- ✅ Görseller database'de kayıtlı
- ✅ Görsel yönetimi kolay
- ✅ Görseller kaybolmaz
- ✅ Media Gallery ile görsel seçimi kolay
- ✅ Görsel tekrar kullanılabilir
- ✅ Backward compatibility korunur

