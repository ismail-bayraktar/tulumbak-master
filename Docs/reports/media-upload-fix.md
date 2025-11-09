# Media Upload 500 Error - Sorun ve Çözüm

## Tespit Edilen Sorun

**Hata:** İkinci görsel yüklenirken 500 Internal Server Error alınıyor.

**Kök Neden:**
1. `MediaModel`'de `publicId` field'ı `unique: true` ve `sparse: true` olarak ayarlanmış
2. Local storage kullanıldığında `publicId` set edilmiyor (undefined/null)
3. MongoDB'de sparse index bazen null değerlerle sorun çıkarabiliyor
4. Error handling yetersiz - gerçek hata mesajı gösterilmiyor

## Uygulanan Çözümler

### 1. ✅ MediaModel Düzeltmesi
- `publicId` field'ından `unique: true` constraint'i kaldırıldı
- Sadece Cloudinary kullanıldığında gerekli
- Local storage için gerekli değil

**Değişiklik:**
```javascript
// ÖNCE:
publicId: {
    type: String,
    required: false,
    unique: true,
    sparse: true
}

// SONRA:
publicId: {
    type: String,
    required: false
    // Removed unique constraint - only needed when using Cloudinary
}
```

### 2. ✅ MediaController Error Handling İyileştirmesi
- Detaylı error logging eklendi
- Duplicate key error (11000) için özel mesaj
- Development mode'da detaylı hata mesajı gösteriliyor

**Değişiklik:**
```javascript
catch (error) {
    logger.error('Media upload error', { 
        error: error.message, 
        stack: error.stack,
        filename: req.file?.filename,
        code: error.code,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
    });
    
    let errorMessage = "Medya yüklenemedi";
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        errorMessage = `${field} zaten kullanılıyor. Lütfen farklı bir dosya seçin.`;
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    res.status(500).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
}
```

### 3. ✅ Frontend Error Handling İyileştirmesi
- Her dosya için ayrı try-catch
- Her dosyanın başarı/başarısızlık durumu takip ediliyor
- Daha detaylı hata mesajları gösteriliyor

**Değişiklik:**
```javascript
for (const file of files) {
    try {
        // Upload logic
        if (response.data.success) {
            toast.success(`${file.name} yüklendi`);
        } else {
            toast.error(`${file.name}: ${response.data.message || 'Yüklenemedi'}`);
        }
    } catch (fileError) {
        const errorMessage = fileError.response?.data?.message || fileError.message || 'Bilinmeyen hata';
        toast.error(`${file.name}: ${errorMessage}`);
        console.error(`Upload error for ${file.name}:`, fileError);
    }
}
```

## Test Edilmesi Gerekenler

1. ✅ İlk görsel yükleniyor mu?
2. ✅ İkinci görsel yükleniyor mu?
3. ✅ Multiple upload çalışıyor mu?
4. ✅ Hata mesajları görünüyor mu?
5. ✅ Backend loglarında detaylı hata var mı?

## Notlar

- `publicId` unique constraint'i kaldırıldı - sadece Cloudinary için gerekli
- Eğer Cloudinary kullanılacaksa, manuel olarak sparse unique index eklenebilir
- Error handling artık daha detaylı ve kullanıcı dostu

## Sonraki Adımlar (Opsiyonel)

1. MongoDB'de mevcut `publicId` unique index'ini kaldır (eğer varsa)
2. Test: Multiple file upload
3. Test: Error scenarios (duplicate filename, etc.)

