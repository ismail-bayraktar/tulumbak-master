# Media Library & Ürün Yönetimi - Aksiyon Planı

## 🎯 Öncelikli Sorunlar ve Çözümler

### 1. ✅ publicId Hatası - ÇÖZÜLDÜ
- MongoDB index script'i hazır
- Model'den unique constraint kaldırıldı
- **Aksiyon:** Script'i çalıştır: `node backend/scripts/fixMediaPublicIdIndex.js`

### 2. 🔄 Admin Panel Ürün Görselleri
**Sorun:** `item.image?.[0]` relative path, full URL değil

**Çözüm:**
- Backend'den full URL döndür VEYA
- Frontend'de base URL ekle

**Kod Değişikliği:**
```javascript
// List.jsx - Frontend'de base URL ekle
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${backendUrl}${path}`;
};

<img src={getImageUrl(item.image?.[0])} alt={item.name || ''}/>
```

### 3. 🔄 Media Library - Mevcut Görselleri Gösterme
**Sorun:** Sadece Media model'ine kaydedilmiş görseller görünüyor

**Çözüm:** Migration script yaz
- `/assets/` ve `/uploads/` klasörlerindeki dosyaları tara
- Media model'ine ekle
- Duplicate kontrolü yap

### 4. 🔄 UI İyileştirmeleri
- Minimal görsel yükleme alanı
- Alerjen bilgileri gizli/expandable
- Modern tasarım

---

## 📋 Uygulama Sırası

1. **publicId hatası düzeltme** (Script çalıştır)
2. **Admin panel görsel gösterimi** (Frontend düzeltme)
3. **Migration script** (Mevcut görselleri Media'ya ekle)
4. **UI iyileştirmeleri** (Minimal tasarım, alerjen gizli)

