# Admin Panel - Real-time Notifications System

## Genel Bakış

Tulumbak Admin Panel, real-time bildirim sistemi ile sipariş ve sistem olaylarını anında kullanıcıya iletir. Sistem, Server-Sent Events (SSE), Browser Notification API ve Web Audio API teknolojilerini kullanarak kapsamlı bir bildirim deneyimi sunar.

**Tarih**: 15 Kasım 2025
**Versiyon**: 1.0.0
**Durum**: ✅ Aktif

---

## Mimari Bileşenler

### 1. **useRealtimeStats Hook** (`admin/src/pages/dashboard/hooks/useRealtimeStats.js`)

Real-time SSE bağlantısını yöneten ana hook.

**Özellikler:**
- Backend SSE endpoint'ine otomatik bağlantı (`/api/notifications/stream`)
- Exponential backoff ile otomatik yeniden bağlanma
- Event-based callback sistemi
- Tab visibility tracking (sayfa aktif olunca otomatik reconnect)
- Browser notification entegrasyonu

**Event Tipleri:**
```javascript
{
  'NEW_ORDER': 'Yeni sipariş geldiğinde',
  'ORDER_STATUS_CHANGED': 'Sipariş durumu değiştiğinde',
  'COURIER_ASSIGNED': 'Kuryeye sipariş atandığında',
  'TEST_NOTIFICATION': 'Test bildirimi'
}
```

**Kullanım:**
```javascript
const { connected, reconnect } = useRealtimeStats({
  onNewOrder: (order) => {
    // Yeni sipariş işlemleri
    fetchOrders(true)
    fetchStats(true)
  },
  onOrderStatusChange: (order) => {
    // Durum değişikliği işlemleri
    fetchOrders(true)
  },
  onCourierAssigned: (order) => {
    // Kurye ataması işlemleri
    fetchCourierData(true)
  }
})
```

### 2. **useNotificationSettings Hook** (`admin/src/hooks/useNotificationSettings.js`)

Browser notification izinleri ve ayarlarını yöneten hook.

**Özellikler:**
- Browser Notification API entegrasyonu
- LocalStorage ile ayar kalıcılığı
- Web Audio API ile ses oluşturma
- Bildirim türü yönetimi
- Ses seçimi ve önizleme

**Ses Tipleri:**
```javascript
{
  'default': [800, 1000],      // İki tonlu bildirim
  'bell': [1200, 800, 600],    // Zil sesi
  'chime': [523, 659, 784],    // C-E-G akordu
  'ping': [1000],              // Tek ton
  'none': null                 // Sessiz
}
```

**Bildirim Türleri:**
```javascript
{
  'newOrder': 'Yeni Sipariş',
  'statusChange': 'Durum Değişikliği',
  'courierAssigned': 'Kurye Ataması',
  'lowStock': 'Düşük Stok'
}
```

**Kullanım:**
```javascript
const {
  permission,
  settings,
  isEnabled,
  requestPermission,
  toggleNotifications,
  showNotification,
  playSound
} = useNotificationSettings()

// Bildirim göster
showNotification('Yeni Sipariş! 🎉', {
  body: 'Sipariş #12345 alındı',
  type: 'newOrder',
  icon: '/icon-192x192.png'
})
```

### 3. **NotificationSettingsModal Komponenti** (`admin/src/components/NotificationSettingsModal.jsx`)

Kullanıcı bildirim ayarları için modal UI.

**Özellikler:**
- İzin durumu gösterimi (Verildi/Reddedildi/Beklemede)
- Bildirim açma/kapama toggle
- Ses seçimi dropdown
- Bildirim türü toggleları
- Ses önizleme butonu
- Test bildirimi gönderme
- Tarayıcı uyumluluk kontrolü

**Tarayıcı İzni Alma:**
```
1. Status bar'daki "Bildirim Kapalı" badge'ine tıkla
2. Modal açılır
3. "Bildirimleri Etkinleştir" toggle'ını aç
4. Tarayıcı izin penceresi çıkar
5. "İzin Ver" butonuna tıkla
6. Ses ve bildirim türü tercihlerini ayarla
7. Test bildirimi ile kontrol et
```

---

## Status Bar Entegrasyonu

Tüm admin sayfalarında (Dashboard, Orders, CourierSettings, CourierPerformance) status bar bildirim durumunu gösterir.

**Status Bar Bileşenleri:**
```jsx
<Badge variant={notificationsEnabled ? "outline" : "secondary"}>
  {notificationsEnabled ? (
    <>
      <Wifi className="h-3 w-3 mr-1" />
      Bildirim Aktif
    </>
  ) : (
    <>
      <WifiOff className="h-3 w-3 mr-1" />
      Bildirim Kapalı
    </>
  )}
</Badge>
```

**Badge Tıklama:**
- Badge'e tıklandığında NotificationSettingsModal açılır
- Kullanıcı ayarlarını anında değiştirebilir
- Değişiklikler LocalStorage'a kaydedilir

---

## Web Audio API Ses Sistemi

Harici ses dosyası gerektirmeden dinamik ses oluşturma.

**Ses Oluşturma Algoritması:**
```javascript
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const oscillator = audioContext.createOscillator()
const gainNode = audioContext.createGain()

// Frekans ayarı (ses tipine göre)
oscillator.frequency.value = frequency
oscillator.type = 'sine'

// Ses seviyesi (fade out ile)
gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

// Çalma süresi: 300ms
oscillator.start(audioContext.currentTime)
oscillator.stop(audioContext.currentTime + 0.3)
```

**Çok Tonlu Sesler:**
- Çan ve melodi sesleri 200ms aralıklarla birden fazla ton çalar
- Her ton ayrı oscillator ile oluşturulur
- Doğal bir ses geçişi için exponential ramp kullanılır

---

## Real-time Bildirim Akışı

### Sipariş Geldiğinde (NEW_ORDER):

```
1. Backend: Yeni sipariş oluşturulur
2. Backend: SSE üzerinden tüm bağlı admin kullanıcılarına event gönderilir
3. Frontend (useRealtimeStats): Event yakalanır
4. Frontend: showNotification() çağrılır
5. Browser: Notification gösterilir
6. Web Audio API: Seçilen ses çalar
7. Frontend: Toast notification gösterilir
8. Frontend: onNewOrder callback çalışır
9. Frontend: Sipariş listesi ve istatistikler güncellenir
```

### Durum Değişikliğinde (ORDER_STATUS_CHANGED):

```
1. Admin: Sipariş durumunu günceller
2. Backend: Durum değişikliği kaydedilir
3. Backend: SSE event gönderilir
4. Frontend: Bildirim + ses
5. Frontend: onOrderStatusChange callback
6. Frontend: UI güncellenir
```

### Kurye Atandığında (COURIER_ASSIGNED):

```
1. Admin: Kuryeye sipariş atar
2. Backend: Kurye entegrasyonu tetiklenir
3. Backend: SSE event gönderilir
4. Frontend: Bildirim + ses
5. Frontend: onCourierAssigned callback
6. Frontend: Kurye verileri güncellenir
```

---

## LocalStorage Ayarları

**Storage Key:** `tulumbak_notification_settings`

**Veri Yapısı:**
```json
{
  "enabled": true,
  "sound": "default",
  "enabledTypes": ["newOrder", "statusChange", "courierAssigned"]
}
```

**İzin Durumları:**
- `granted`: Bildirimler aktif
- `denied`: Kullanıcı izni reddetti (tarayıcı ayarlarından açılmalı)
- `default`: İzin henüz istenmedi

---

## Hata Yönetimi ve Fallback

### SSE Bağlantı Hataları:
```javascript
- Exponential backoff ile yeniden deneme
- Maksimum 5 deneme
- Başlangıç gecikmesi: 2 saniye
- Maksimum gecikme: 30 saniye
- Her başarısız denemede gecikme x2
```

### Browser Notification Hataları:
```javascript
- İzin reddedildi → Tarayıcı ayarları yönlendirmesi
- Desteklenmeyen tarayıcı → Uyarı mesajı
- Notification oluşturma hatası → Console log
```

### Audio API Hataları:
```javascript
- AudioContext oluşturma hatası → Sessiz devam
- Oscillator hatası → Console log, bildirim devam eder
```

---

## Performans Optimizasyonları

1. **Polling Azaltma:**
   - SSE aktif iken polling devre dışı
   - SSE kesilirse fallback olarak 60 saniyede bir polling

2. **Bağlantı Yönetimi:**
   - Tab görünür değilken reconnect attempt yok
   - Sayfa aktif olunca otomatik reconnect
   - Maksimum 1 aktif EventSource connection

3. **Ses Optimizasyonu:**
   - Web Audio API ile hafif ses oluşturma
   - Harici dosya yükleme yok
   - Ses 300ms ile sınırlı (memory friendly)

4. **LocalStorage:**
   - Sadece değişiklik olduğunda kaydet
   - Her render'da okuma yok (useState ile cache)

---

## Güvenlik Önlemleri

1. **Authentication:**
   ```javascript
   // SSE connection with token
   const token = localStorage.getItem('token')
   const sseUrl = `${apiUrl}/api/notifications/stream?token=${token}`
   ```

2. **Event Validation:**
   - Gelen eventler type kontrolünden geçirilir
   - Bilinmeyen event tipleri loglanır, işlem yapılmaz

3. **XSS Prevention:**
   - Notification body içeriği escape edilir
   - Icon URL'leri whitelist kontrolünden geçer

---

## Tarayıcı Desteği

| Tarayıcı | Notification API | Web Audio API | SSE |
|----------|-----------------|---------------|-----|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ | ✅ |

**Mobil Tarayıcılar:**
- iOS Safari: Kısıtlı (notification izni yok)
- Android Chrome: Tam destek
- Android Firefox: Tam destek

---

## Troubleshooting

### Bildirim Gelmiyor:
1. Status bar'da "Bildirim Aktif" mi kontrol et
2. Tarayıcı izinlerini kontrol et (adres çubuğu → site ayarları)
3. Browser console'da hata var mı kontrol et
4. SSE connection durumunu kontrol et (Network tab)

### Ses Çalmıyor:
1. Bildirim ayarlarında ses seçili mi kontrol et
2. "Sessiz" seçili değilse seçilen ses tipini değiştir
3. "Sesi Önizle" butonu ile test et
4. Tarayıcı ses ayarlarını kontrol et

### Status Bar Yanlış Gösteriyor:
1. Sayfayı yenile (F5)
2. LocalStorage'ı temizle ve tekrar izin ver
3. Tarayıcı cache'ini temizle

---

## Gelecek Geliştirmeler

- [ ] Push Notification API entegrasyonu (mobile support)
- [ ] Bildirim geçmişi sayfası
- [ ] Bildirim gruplaması (batch notifications)
- [ ] Özel ses yükleme özelliği
- [ ] Bildirim öncelik seviyeleri
- [ ] Desktop app notification (Electron)
- [ ] Bildirim istatistikleri ve analytics

---

## API Referansı

### `useRealtimeStats` Hook

```typescript
interface UseRealtimeStatsOptions {
  onNewOrder?: (order: Order) => void
  onOrderStatusChange?: (order: Order) => void
  onCourierAssigned?: (order: Order) => void
}

interface UseRealtimeStatsReturn {
  connected: boolean
  lastEvent: any
  connectionError: string | null
  reconnect: () => void
  disconnect: () => void
}

function useRealtimeStats(
  options?: UseRealtimeStatsOptions
): UseRealtimeStatsReturn
```

### `useNotificationSettings` Hook

```typescript
interface NotificationSettings {
  enabled: boolean
  sound: 'default' | 'bell' | 'chime' | 'ping' | 'none'
  enabledTypes: string[]
}

interface UseNotificationSettingsReturn {
  permission: 'granted' | 'denied' | 'default'
  settings: NotificationSettings
  sounds: Array<{id: string, name: string, file: string | null}>
  types: Array<{id: string, name: string, description: string}>
  requestPermission: () => Promise<boolean>
  toggleNotifications: (enabled: boolean) => Promise<boolean>
  toggleNotificationType: (typeId: string) => void
  changeSound: (soundId: string) => void
  playSound: (soundId?: string) => void
  showNotification: (title: string, options?: NotificationOptions) => Notification | undefined
  isEnabled: boolean
  canEnable: boolean
}

function useNotificationSettings(): UseNotificationSettingsReturn
```

---

## Örnekler

### Custom Event Handler:
```javascript
const { connected } = useRealtimeStats({
  onNewOrder: (order) => {
    console.log('Yeni sipariş:', order)
    // Custom işlem
    showCustomAnimation()
    updateDashboardWidgets()
  }
})
```

### Manuel Bildirim Gönderme:
```javascript
const { showNotification, playSound } = useNotificationSettings()

// Özel bildirim
showNotification('Özel Uyarı', {
  body: 'Sistem bakımı 10 dakika sonra başlayacak',
  type: 'newOrder', // Ses için
  icon: '/icon-192x192.png'
})

// Sadece ses
playSound('bell')
```

### Bildirim İzni Kontrolü:
```javascript
const { permission, requestPermission, isEnabled } = useNotificationSettings()

if (!isEnabled && permission !== 'denied') {
  // İzin iste
  const granted = await requestPermission()
  if (granted) {
    console.log('Bildirimler aktif!')
  }
}
```

---

**Son Güncelleme:** 15 Kasım 2025
**Güncelleyen:** Claude
**İlgili Dosyalar:**
- `admin/src/pages/dashboard/hooks/useRealtimeStats.js`
- `admin/src/hooks/useNotificationSettings.js`
- `admin/src/components/NotificationSettingsModal.jsx`
- `admin/src/pages/dashboard/Dashboard.jsx`
- `admin/src/pages/orders/Orders.jsx`
- `admin/src/pages/courier/CourierSettings.jsx`
- `admin/src/pages/courier/CourierPerformance.jsx`
