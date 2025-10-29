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

---

## Tulumbak Şube Bilgileri

### Şube 1: Menemen (Lise Yolu)
- **Adres**: Kasımpaşa Mahallesi, Cengiz Topel Caddesi 31C (Menemen metro durağı civarı), Menemen, İzmir
- **Koordinatlar**: (Eklenecek - Google API ile)
- **Durum**: Aktif

### Şube 2: Menemen (6. Cadde)
- **Adres**: 29 Ekim Mahallesi, 6. Cadde No:24A (Kasaplar Caddesi Kokoreççi Akın Usta yanı), Ulukent, İzmir
- **Koordinatlar**: (Eklenecek - Google API ile)
- **Durum**: Aktif

### Şube 3: (Daha belirtilmedi)
- **Adres**: TBD
- **Koordinatlar**: (Eklenecek - Google API ile)
- **Durum**: TBD

---

## Seçilen Yaklaşım: Zone + Hibrit Sistem

### Kararlar
1. **Başlangıç**: Tam otomatik mesafe bazlı atama
2. **Gelişim**: Hibrit (Öner + Onay) sistemi ayarlardan açılabilir
3. **Google API**: Opsiyonel (ücretli olabileceği belirtildi)
4. **UI**: Şubeler admin panelde yönetilebilir
5. **Koordinatlar**: Google API entegrasyonu ile (opsiyonel)

### UI Gereksinimleri

#### Admin Panel - Branches Sayfası
- Modern card layout
- Her şube için:
  - Adres bilgisi
  - Koordinat girişi (manual veya Google API picker)
  - Zone assignment (çoklu seçim)
  - Çalışma saatleri
  - Kapasite bilgisi
  - Durum (active/inactive)
- Google Maps preview (opsiyonel)
- Açıklamalı tooltip'ler

### Sistem Ayarları
- `BRANCH_AUTO_ASSIGNMENT`: true/false
  - `true`: Otomatik atama (default)
  - `false`: Bildirim + admin onay
  
- `GOOGLE_MAPS_ENABLED`: true/false
  - `true`: Koordinat Google API ile hesaplanır
  - `false`: Manuel koordinat girişi

- `GOOGLE_MAPS_API_KEY`: string (optional)

---

## Teknik Yaklaşım

### Phase 1: Temel Multi-Branch (Otomatik)
```javascript
// placeOrder() içinde
const { address } = req.body;

// Get all active branches
const branches = await BranchModel.find({ status: 'active' });

// Calculate distance to each branch
const distances = await Promise.all(
  branches.map(branch => 
    calculateDistance(address, branch.address)
  )
);

// Auto-assign to nearest
const nearestBranch = branches[distances.indexOf(Math.min(...distances))];
order.branchId = nearestBranch._id;
```

### Phase 2: Hibrit (Bildirim + Onay)
```javascript
// Settings check
const autoAssign = await getSetting('BRANCH_AUTO_ASSIGNMENT');

if (autoAssign === 'true') {
  // Auto assign
  const nearestBranch = findNearestBranch(order);
  order.branchId = nearestBranch._id;
} else {
  // Hybrid: Suggest + Notify
  const suggestedBranch = findNearestBranch(order);
  
  // Send notification to admin
  await notifyAdmin({
    orderId: order._id,
    suggestedBranch: suggestedBranch._id,
    alternativeBranches: branches.filter(b => b._id !== suggestedBranch._id)
  });
  
  // Wait for admin approval
  order.status = 'pending_branch_assignment';
}
```

### Phase 3: Google API Entegrasyonu (Opsiyonel)
```javascript
// Settings check
const googleEnabled = await getSetting('GOOGLE_MAPS_ENABLED');
const apiKey = await getSetting('GOOGLE_MAPS_API_KEY');

if (googleEnabled === 'true' && apiKey) {
  // Use Google Distance Matrix API
  const distances = await calculateDistanceGoogle(userAddress, branchAddresses, apiKey);
  return selectOptimalBranch(distances);
} else {
  // Use Haversine formula (free)
  const distances = await calculateDistanceHaversine(userAddress, branchAddresses);
  return selectOptimalBranch(distances);
}
```

---

## Geliştirme Aşamaları

### Aşama 1: Branch Model & Admin UI (Şimdi)
- [ ] BranchModel oluştur
- [ ] Admin panel - Branches sayfası
- [ ] Zone assignment UI
- [ ] Koordinat girişi (manual)

### Aşama 2: Otomatik Atama (Backend)
- [ ] placeOrder() - Auto-assignment logic
- [ ] Haversine mesafe hesaplama
- [ ] Settings entegrasyonu

### Aşama 3: Hibrit Sistem
- [ ] Admin bildirim sistemi
- [ ] Branch değiştirme API
- [ ] Orders page - Branch filter

### Aşama 4: Google Maps (İleri Seviye)
- [ ] Google Distance Matrix API
- [ ] Harita picker
- [ ] Gerçek mesafe/süre hesaplama
- [ ] API key management

---

## Örnek Senaryolar

### Senaryo 1: Otomatik Atama (Default)
```
Müşteri sipariş verir → Address: Menemen
→ Sistem 3 şubeye mesafe hesaplar
→ En yakın şube: Menemen (Lise Yolu)
→ Otomatik olarak atama yapılır
```

### Senaryo 2: Hibrit - Bildirim + Onay
```
Müşteri sipariş verir → Address: Ulukent
→ Sistem öneri: Menemen (6. Cadde)
→ Admin'e bildirim gider
→ Admin onaylar/reddeder
→ Alternatif: Menemen (Lise Yolu)
```

### Senaryo 3: Google API ile
```
Sipariş: Menemen center
→ Google API ile sürüş mesafesi hesaplanır
→ Şube 1: 2.5 km (8 dakika)
→ Şube 2: 1.8 km (5 dakika) ✅ Seçilir
```

---

## Notlar

- **Google API**: Ücretli olabilir (distance matrix API calls per request)
- **İlk geliştirme**: Ücretsiz Haversine formülü ile başla
- **İleri seviye**: Google API opsiyonel eklenecek
- **Ayarlar**: Sistem ayarlarından hibrit/otomatik seçilebilir
- **Koordinatlar**: Şubeler admin panelden yönetilir
- **Zone Assignment**: Her şube birden fazla zone'a hizmet edebilir

