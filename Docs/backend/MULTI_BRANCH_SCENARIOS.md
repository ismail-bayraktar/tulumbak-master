# Multi-Branch (Çok Şubeli) Sipariş Dağıtım Sistemi

## Senaryo Analizi

### Senaryo 1: Tam Otomatik Mesafe Bazlı

**Çalışma Mantığı:**
- Müşteri sipariş verir
- Sistem sipariş adresini alır
- 3 şube arasında mesafe hesaplar
- En yakın şubeye otomatik atama yapar

**Avantajları:**
- Otomatik
- Hızlı

**Dezavantajları:**
- Şube yoğunluğu dikkate alınmaz
- Yolda olan sipariş varsa tekrar hesaplama gerektirir
- Aynı anda 2 şube en yakın olabilir

**Gereksinimler:**
- Google Maps API (mesafe/süre)
- Şube koordinatları database'de
- Mesafe hesaplama algoritması

---

### Senaryo 2: Zone Bazlı Şube Atama

**Çalışma Mantığı:**
- Her şubenin zone'ları var
- Sipariş adresi zone'a göre şubeye atanır
- Şube sadece kendi zone'una bakar

**Avantajları:**
- Basit mantık
- Zone management var (hazır yapı)
- Şube yükü eşit dağıtılabilir

**Dezavantajları:**
- Tam sınırlarda sorun olabilir
- Zone haritası elle çizilir
- Zone değişince manuel güncelleme gerekir

**Gereksinimler:**
- Zone-shop ilişkisi database'de
- Şubeler zone'ları yönetir

---

### Senaryo 3: Hibrit Sistem (Öner + Onay)

**Çalışma Mantığı:**
- Sistem en yakın şubeyi önerir
- Admin onaylar veya değiştirir
- Şube detayları manuel güncelleme yapar

**Avantajları:**
- Hem otomatik hem kontrol
- Acil durumda manuel müdahale
- Yoğunluk yönetimi mümkün

**Dezavantajları:**
- Manuel onay süreci
- Daha fazla UI gereklidir
- Operatör yükü eklenir

**Gereksinimler:**
- Öneri algoritması
- Admin onay UI
- Otomatik + manuel sistem

---

## Teknik Gereksinimler

### 1. Şube (Shop/Branch) Model

```javascript
{
  name: "Tulumbak Kadıköy",
  address: {
    street: "Bağdat Caddesi 123",
    district: "Kadıköy",
    city: "İstanbul",
    coordinates: { lat: 41.0, lng: 29.0 }
  },
  workingHours: {
    weekdays: "09:00-18:00",
    weekend: "10:00-16:00"
  },
  assignedZones: ["zone-id-1", "zone-id-2"],
  status: "active",
  capacity: 100, // günlük sipariş kapasitesi
  phone: "+902123456789"
}
```

### 2. Sipariş Şube Atama Logic

```javascript
// placeOrder() fonksiyonunda

// Option A: Mesafe bazlı
const nearestBranch = await findNearestBranch(order.address);
order.branchId = nearestBranch._id;

// Option B: Zone bazlı
const branch = await findBranchByZone(order.delivery.zoneId);
order.branchId = branch._id;

// Option C: Hibrit
const suggestedBranch = await suggestBranch(order);
order.branchId = suggestedBranch._id; // Admin onayı bekler
```

### 3. Google Maps Entegrasyonu

```javascript
// Mesafe hesaplama
async function calculateDistance(userAddress, branchAddress) {
  const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
    params: {
      origins: userAddress,
      destinations: branchAddress,
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  });
  
  return {
    distance: response.data.rows[0].elements[0].distance.value,
    duration: response.data.rows[0].elements[0].duration.value
  };
}
```

---

## Önerilen Çözüm: Zone + Mesafe Hibrit

### Mantık:
1. **Zone Primary**: Sipariş zone'una göre şubeleri filtrele
2. **Mesafe Secondary**: Zone içindeki şubelerden en yakın olanı seç
3. **Manuel Override**: Admin isteğe bağlı değiştirebilir

### Avantajları:
- Zone kontrolü mevcut
- Mesafe optimizasyonu eklenir
- Manuel müdahale esnekliği korunur

### Uygulama:

```javascript
// 1. Get branches serving this zone
const zoneBranches = await BranchModel.find({
  assignedZones: { $in: [order.delivery.zoneId] }
});

// 2. Calculate distance to each branch
const distances = await Promise.all(
  zoneBranches.map(branch => 
    calculateDistance(order.address, branch.address)
  )
);

// 3. Select nearest branch
const nearestBranch = zoneBranches[
  distances.indexOf(Math.min(...distances))
];

// 4. Assign order
order.branchId = nearestBranch._id;
```

---

## UI Gereksinimleri

### Admin Panel - Branch Management
- Şube CRUD operations
- Zone assignment
- Koordinat girişi (harita picker)
- Capacity yönetimi

### Orders Page
- Şube filtreleme
- Şube göre sipariş listesi
- Şube değiştirme

### Branch Dashboard (Şube Paneli)
- Şubeye ait siparişler
- Günlük/haftalık raporlar
- Stok takibi

---

## Database Schema

### BranchModel
```javascript
const branchSchema = {
  name: String,
  code: String, // Unique: "KADIKOY", "MASLAK", "BESIKTAS"
  address: {
    street: String,
    district: String,
    city: String,
    coordinates: { lat: Number, lng: Number }
  },
  workingHours: {
    weekdays: { start: String, end: String },
    weekend: { start: String, end: String },
    timezone: String
  },
  assignedZones: [String], // Delivery zone IDs
  capacity: Number,
  phone: String,
  email: String,
  managerId: String, // User ID
  status: { type: String, enum: ['active', 'inactive'] },
  createdAt: Number,
  updatedAt: Number
};
```

### OrderModel Update
```javascript
// Add to orderSchema
branchId: { type: String }, // Branch that handles this order
branchName: { type: String }, // Denormalized for easier queries
distanceKm: { type: Number }, // Distance to branch
```

---

## Roadmap

### Phase 1: Basic Multi-Branch
- [ ] BranchModel oluştur
- [ ] Admin panel - Branch CRUD
- [ ] placeOrder() - Zone bazlı atama
- [ ] Orders page - Branch filter

### Phase 2: Distance Optimization
- [ ] Google Maps API entegrasyonu
- [ ] Mesafe hesaplama servisi
- [ ] Nearest branch algoritması
- [ ] UI - Suggested branch göster

### Phase 3: Branch Dashboard
- [ ] Branch login sistemi
- [ ] Branch'a özel sipariş listesi
- [ ] Branch'a özel raporlar
- [ ] Transfer order (branch değiştir)

### Phase 4: Advanced Features
- [ ] Capacity management
- [ ] Auto-assignment rules
- [ ] Branch performance metrics
- [ ] Real-time inventory sync

---

## Sorular

1. **Zone-shop ilişkisi nasıl olmalı?**
   - Her shop birden fazla zone'a hizmet edebilir mi?
   - Zone çakışması olabilir mi? (2 shop aynı zone'da)

2. **Kapasite yönetimi gerekli mi?**
   - Günlük max sipariş limiti var mı?
   - Aynı anda çalışan kurye sayısı?

3. **Şube paneli ayrı mı?**
   - Şube manager'lar ayrı giriş yapacak mı?
   - Sadece kendi branch'ini görecekler mi?

4. **Transfer sistemi gerekli mi?**
   - Bir sipariş birden fazla şubede mi işlenir?
   - A şubesi -> B şubesi transfer yapılabilir mi?

---

## Örnek Senaryolar

### Örnek 1: Zone Bazlı Basit Sistem
```
Zone: Kadıköy
Shops: Tulumbak Kadıköy
→ Tüm Kadıköy siparişleri Kadıköy şubesine
```

### Örnek 2: Çakışan Zone'lar
```
Zone: Ataşehir (Hem Kadıköy hem Maltepe yakın)
Shops: Tulumbak Kadıköy, Tulumbak Maltepe
→ Mesafeye göre en yakın şube seç
```

### Örnek 3: Transfer
```
Sipariş Ataşehir'de
→ İlk olarak Kadıköy şubesine atandı
→ Kadıköy yoğun, Maltepe'ye transfer edildi
```

---

**Not:** Hangi senaryoda devam etmek istiyorsunuz? Zone bazlı mı, mesafe bazlı mı, yoksa hibrit mi?

