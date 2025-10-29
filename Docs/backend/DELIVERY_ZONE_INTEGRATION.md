# Teslimat Bölgesi Entegrasyonu - Kurye Sistemi

## Genel Bakış
Projede admin panelden belirlenen teslimat bölgelerine göre siparişlerin kuryelere atanması ve yönetilmesi için geliştirilmiş sistem.

## Sistem Mimarisi

### 1. Bileşenler

#### Backend Models
- **DeliveryZoneModel** (`backend/models/DeliveryZoneModel.js`)
  - `district`: Bölge/ilçe adı (unique)
  - `fee`: Teslimat ücreti
  - `minOrder`: Minimum sipariş tutarı
  - `weekendAvailable`: Hafta sonu teslimat
  - `sameDayAvailable`: Aynı gün teslimat

- **CourierModel** (`backend/models/CourierModel.js`)
  - `assignedZones`: Kuryenin hizmet vereceği bölge ID'leri (array)
  - Boş array = tüm bölgelerde hizmet verir (universal courier)
  - Zone ID'ler array = sadece belirtilen bölgelerde hizmet verir

#### Backend Controllers

**OrderController** (`backend/controllers/OrderController.js`)
```javascript
placeOrder() {
  // Zone validation
  - Validate delivery zone exists
  - Check minimum order amount
  - Validate same day delivery availability
}
```

**CourierManagementController** (`backend/controllers/CourierManagementController.js`)
```javascript
assignOrderToCourier() {
  // Zone-based assignment
  - Check if courier serves the order's zone
  - Return error if zone mismatch
}

getCouriersForZone(zoneId) {
  // Zone-filtered courier list
  - Returns couriers assigned to zoneId
  - OR couriers with no zones (universal)
}
```

#### Admin Panel

**DeliveryZones.jsx**
- Modern card-based UI
- Statistics: Total zones, weekend availability, same day availability
- CRUD operations with modals
- Visual zone management

**TimeSlots.jsx**
- Weekday/Weekend slot grouping
- Capacity management
- Time picker inputs

## Kullanım Senaryoları

### Senaryo 1: Zone Olmadan Kurye (Universal)
```javascript
// CourierModel
{
  name: "Ahmet Yılmaz",
  assignedZones: [], // Boş = tüm bölgeler
  status: "active"
}

// Bu kurye tüm bölgelere atanabilir
```

### Senaryo 2: Zone Bazlı Kurye
```javascript
// CourierModel
{
  name: "Mehmet Demir",
  assignedZones: ["zone-id-1", "zone-id-2"], // Sadece bu bölgeler
  status: "active"
}

// Bu kurye sadece zone-id-1 ve zone-id-2'ye atanabilir
```

### Senaryo 3: Sipariş Atama
```javascript
// Order has delivery zone
order.delivery.zoneId = "zone-123"

// System checks:
// 1. Does courier serve this zone?
// 2. If assignedZones empty → Allow
// 3. If assignedZones includes zone-123 → Allow
// 4. Otherwise → Reject with error
```

## API Endpoints

### Backend API

#### Get Couriers for Zone
```http
GET /api/courier-management/zone/:zoneId
Authorization: Admin Token

Response:
{
  success: true,
  couriers: [...],
  count: 5
}
```

#### Assign Order to Courier
```http
POST /api/courier-management/assign
Authorization: Admin Token
Body: { courierId, orderId }

Validation:
- Courier must be active
- Courier must serve the order's zone
```

### Frontend Usage

#### Kurye Atama İşlemi
```javascript
// 1. Get available couriers for order's zone
const { order } = await getOrderDetails(orderId);
const availableCouriers = await fetch(
  `/api/courier-management/zone/${order.delivery.zoneId}`
);

// 2. Show courier selection UI
// 3. Assign order to selected courier
const response = await fetch('/api/courier-management/assign', {
  method: 'POST',
  body: JSON.stringify({ courierId, orderId })
});
```

## Zone Bazlı Kurye Atama Mantığı

### 1. Kurye Oluşturma (Admin Panel)

Admin kurye oluştururken zone ataması yapmalı:

```javascript
// Yeni kurye oluştur
{
  name: "Ali Kaya",
  phone: "+905551234567",
  assignedZones: ["zone-123", "zone-456"], // Belirli bölgeler
  status: "active"
}
```

### 2. Sipariş - Kurye Eşleştirme

```javascript
// Sipariş oluşturulurken zone kaydedilir
order.delivery.zoneId = "zone-123"

// Admin kurye atarken sistem kontrol eder:
if (order.delivery.zoneId) {
  if (courier.assignedZones.length === 0) {
    // Universal courier - her bölgeye gider
    allowAssignment = true;
  } else if (courier.assignedZones.includes(order.delivery.zoneId)) {
    // Kurye bu bölgeye gidebilir
    allowAssignment = true;
  } else {
    // Kurye bu bölgeye gitmez!
    error = "Bu kurye seçilen bölgeye hizmet vermiyor";
  }
}
```

### 3. Dinamik Kurye Listesi

Admin panel'de sipariş detayına gittiğinde:

1. Siparişin zone ID'sini al
2. GET `/api/courier-management/zone/:zoneId`
3. Sadece o bölgeye hizmet veren kuryeleri göster
4. Admin birini seçer, system atama yapar

## Frontend Entegrasyonu

### Orders.jsx - Kurye Atama Modal

```javascript
const assignCourier = async (orderId) => {
  // Get order details
  const order = orders.find(o => o._id === orderId);
  
  // Fetch available couriers for this zone
  const response = await fetch(
    `${backendUrl}/api/courier-management/zone/${order.delivery.zoneId}`,
    { headers: { token } }
  );
  const { couriers } = await response.json();
  
  // Show modal with courier list
  showCourierSelectionModal(couriers);
  
  // On selection, assign order
  const selectedCourierId = getSelectedCourier();
  await assignOrderToCourier(orderId, selectedCourierId);
};
```

### CourierManagement.jsx - Zone Yönetimi

Kurye oluştururken/düzenlerken zone ataması:

```javascript
const updateCourierZones = async (courierId, zoneIds) => {
  await fetch(`${backendUrl}/api/courier-management/${courierId}`, {
    method: 'PUT',
    headers: { token },
    body: JSON.stringify({ assignedZones: zoneIds })
  });
};
```

## EsnafExpress Entegrasyonu

### Kurye Uygulaması ile Bağlantı

EsnafExpress uygulaması kuryelerin kendi telefonlarında çalışır:

1. **Kurye Girişi**
   - Kurye giriş yapar
   - Dashboard'da atanmış siparişleri görür
   - Sadece kendi zone'larındaki siparişler gösterilir

2. **Sipariş Teslimatı**
   - Kurye siparişi kabul eder
   - Yola çıkar
   - Teslim eder
   - Her adımda webhook ile backend'e bildirim

3. **Webhook Integration**
```javascript
// EsnafExpress app sends status updates
POST /api/courier/webhook
{
  courierTrackingId: "CR-ABC123",
  status: "yolda",
  location: { lat: 41.0082, lng: 28.9784 },
  note: "Delivery in progress"
}
```

## Test Senaryoları

### Test 1: Universal Kurye
```javascript
// 1. Create courier with no zones
const courier = { assignedZones: [] };

// 2. Create order with zone
const order = { delivery: { zoneId: "any-zone" } };

// 3. Try to assign
assignOrderToCourier(order, courier); // ✅ Should succeed
```

### Test 2: Zone Bazlı Kurye - Match
```javascript
// 1. Create courier with zones
const courier = { assignedZones: ["zone-1", "zone-2"] };

// 2. Create order with matching zone
const order = { delivery: { zoneId: "zone-1" } };

// 3. Try to assign
assignOrderToCourier(order, courier); // ✅ Should succeed
```

### Test 3: Zone Bazlı Kurye - Mismatch
```javascript
// 1. Create courier with zones
const courier = { assignedZones: ["zone-1"] };

// 2. Create order with different zone
const order = { delivery: { zoneId: "zone-999" } };

// 3. Try to assign
assignOrderToCourier(order, courier); // ❌ Should fail
```

## Sonuç

Bu sistem admin panelden yönetilen teslimat bölgelerine göre kurye atamalarını otomatikleştirir:

- ✅ Admin zone'ları belirler (DeliverZones.jsx)
- ✅ Kuryeler zone'lara atanır (CourierModel.assignedZones)
- ✅ Siparişler zone validasyonu ile kontrol edilir
- ✅ Kurye ataması zone bazlı filtre ile yapılır
- ✅ EsnafExpress uygulaması sadece kendi zone'larını görür

**Avantajlar:**
- Kurye kendi bölgesini bilir
- Yanlış bölgeye atama riski azalır
- Zone bazlı raporlama yapılabilir
- Courier app'de sadece ilgili siparişler gösterilir

