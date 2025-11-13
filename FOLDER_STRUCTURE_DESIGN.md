# TULUMBAK ADMIN - BEST PRACTICE FOLDER STRUCTURE

## 🎯 İsimlendirme Prensibi

**Geçici (Migration sırasında):**
```
modern/     → Yeni shadcn kodları
legacy/     → Eski kodlar (silinecek)
```

**Kalıcı (Migration sonrası):**
```
Klasör isimleri fonksiyonel olmalı, teknoloji odaklı olmamalı
❌ modern/, legacy/, old/, new/
✅ features/, layouts/, ui/, hooks/
```

---

## 📁 BEST PRACTICE STRUCTURE (Final)

```
admin/src/
├── app/                          # Application setup
│   ├── App.jsx                   # Main app component & routes
│   ├── main.jsx                  # React entry point
│   └── router.jsx                # Route definitions (optional)
│
├── components/
│   ├── ui/                       # Shadcn base components (auto-generated)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── select.jsx
│   │   └── ...
│   │
│   ├── layouts/                  # Layout components
│   │   ├── dashboard-layout.jsx  # Main dashboard layout
│   │   ├── auth-layout.jsx       # Login layout
│   │   ├── app-sidebar.jsx       # Sidebar component
│   │   ├── app-header.jsx        # Header/navbar
│   │   └── theme-provider.jsx    # Theme context
│   │
│   ├── features/                 # Feature-specific components
│   │   ├── auth/
│   │   │   ├── login-form.jsx
│   │   │   └── logout-button.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── stats-card.jsx
│   │   │   ├── recent-orders.jsx
│   │   │   └── quick-actions.jsx
│   │   │
│   │   ├── products/
│   │   │   ├── product-form.jsx
│   │   │   ├── product-list.jsx
│   │   │   └── product-card.jsx
│   │   │
│   │   ├── orders/
│   │   │   ├── order-table.jsx
│   │   │   ├── order-detail-modal.jsx
│   │   │   └── order-status-badge.jsx
│   │   │
│   │   ├── courier/              # Esnaf Express
│   │   │   ├── courier-config-form.jsx
│   │   │   ├── courier-logs.jsx
│   │   │   └── courier-dashboard.jsx
│   │   │
│   │   ├── branches/
│   │   │   ├── branch-form.jsx
│   │   │   └── branch-list.jsx
│   │   │
│   │   └── media/
│   │       ├── media-gallery.jsx
│   │       └── media-uploader.jsx
│   │
│   └── shared/                   # Reusable components
│       ├── data-table.jsx
│       ├── empty-state.jsx
│       ├── loading-spinner.jsx
│       └── confirmation-dialog.jsx
│
├── pages/                        # Route pages (views)
│   ├── auth/
│   │   └── login.jsx
│   │
│   ├── dashboard/
│   │   └── index.jsx
│   │
│   ├── products/
│   │   ├── index.jsx             # Product list
│   │   ├── create.jsx            # Add product
│   │   └── edit.jsx              # Edit product
│   │
│   ├── orders/
│   │   ├── index.jsx             # Order list
│   │   ├── processing.jsx        # Order processing
│   │   └── corporate.jsx         # Corporate orders
│   │
│   ├── courier/
│   │   └── index.jsx             # Esnaf Express integration
│   │
│   ├── branches/
│   │   ├── index.jsx             # Branch list
│   │   ├── delivery-zones.jsx
│   │   ├── time-slots.jsx
│   │   └── assignment-settings.jsx
│   │
│   ├── marketing/
│   │   ├── coupons.jsx
│   │   └── slider.jsx
│   │
│   ├── media/
│   │   └── library.jsx
│   │
│   ├── settings/
│   │   └── index.jsx
│   │
│   └── logs/
│       ├── email.jsx
│       ├── sms.jsx
│       └── reports.jsx
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.js
│   ├── use-dashboard.js
│   ├── use-courier.js
│   ├── use-products.js
│   ├── use-orders.js
│   ├── use-branches.js
│   └── use-theme.js
│
├── lib/                          # Utilities & helpers
│   ├── utils.js                  # Shadcn utils (cn, etc.)
│   ├── api.js                    # Axios instance & interceptors
│   ├── constants.js              # App constants
│   └── validators.js             # Form validation helpers
│
├── contexts/                     # React contexts
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── SidebarContext.jsx
│
├── assets/                       # Static assets
│   ├── assets.js                 # Asset exports
│   ├── logo.svg
│   └── ...
│
├── styles/                       # Global styles
│   ├── globals.css               # Shadcn + custom globals
│   └── themes/                   # Theme definitions
│       ├── light.css
│       └── dark.css
│
└── types/                        # TypeScript types (if needed)
    └── index.d.ts
```

---

## 🔄 MIGRATION STRATEGY (Revised)

### PHASE 1: Setup
```
1. Shadcn init
2. Eski kodları YEDEKLEME klasörüne taşı (geçici)
3. Yeni yapıyı kur
```

### PHASE 2: Geçici Yapı (Migration sırasında)
```
admin/src/
├── _backup/                      # Geçici - Migration sırasında
│   ├── components/               # Eski componentler
│   └── pages/                    # Eski sayfalar
│
├── components/                   # Yeni yapı (best practice)
│   ├── ui/
│   ├── layouts/
│   ├── features/
│   └── shared/
│
└── pages/                        # Yeni sayfalar (best practice)
    ├── auth/
    ├── dashboard/
    └── ...
```

### PHASE 3: Final Cleanup
```
Migration tamamlandığında:
rm -rf src/_backup
```

---

## 🎯 İSİMLENDİRME KURALLAR

### Dosya İsimlendirme
```
✅ DOĞRU:
- kebab-case: product-form.jsx, order-list.jsx
- Descriptive: courier-config-form.jsx (ne yaptığı belli)

❌ YANLIŞ:
- PascalCase: ProductForm.jsx (sadece component export isimleri)
- Generic: form.jsx, list.jsx (ne olduğu belli değil)
- Abbreviated: prod-frm.jsx (kısaltma kullanma)
```

### Klasör İsimlendirme
```
✅ DOĞRU:
- Plural: components/, hooks/, pages/
- Singular: auth/, dashboard/, courier/
- Descriptive: delivery-zones/, time-slots/

❌ YANLIŞ:
- Camel: myComponents/, userAuth/
- Generic: misc/, stuff/, temp/
- Tech-focused: shadcn/, modern/, legacy/
```

### Component İsimlendirme
```
✅ DOĞRU:
export function ProductForm() { }
export function OrderList() { }
export function CourierConfigForm() { }

❌ YANLIŞ:
export function Form() { }      // Çok generic
export function List() { }      // Ne listesi?
export function Component1() { } // Anlamsız
```

---

## 📋 ROUTE STRUCTURE (Best Practice)

```jsx
// app/router.jsx
const routes = [
  // Auth
  { path: '/login', element: <Login /> },

  // Main App
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      // Products
      { path: 'products', element: <ProductList /> },
      { path: 'products/create', element: <ProductCreate /> },
      { path: 'products/:id/edit', element: <ProductEdit /> },

      // Orders
      { path: 'orders', element: <OrderList /> },
      { path: 'orders/processing', element: <OrderProcessing /> },
      { path: 'orders/corporate', element: <CorporateOrders /> },

      // Courier
      { path: 'courier', element: <CourierIntegration /> },

      // Branches
      { path: 'branches', element: <BranchList /> },
      { path: 'branches/delivery-zones', element: <DeliveryZones /> },
      { path: 'branches/time-slots', element: <TimeSlots /> },
      { path: 'branches/assignment', element: <BranchAssignment /> },

      // Marketing
      { path: 'marketing/coupons', element: <Coupons /> },
      { path: 'marketing/slider', element: <Slider /> },

      // Media
      { path: 'media/library', element: <MediaLibrary /> },

      // Settings
      { path: 'settings', element: <Settings /> },

      // Logs
      { path: 'logs/email', element: <EmailLogs /> },
      { path: 'logs/sms', element: <SmsLogs /> },
      { path: 'logs/reports', element: <Reports /> },
    ]
  }
]
```

---

## 🎨 COMPONENT STRUCTURE (Best Practice)

### Feature Component Example
```jsx
// components/features/courier/courier-config-form.jsx

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useCourier } from '@/hooks/use-courier'

export function CourierConfigForm() {
  const { config, updateConfig, saveConfig, loading } = useCourier()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Esnaf Express API Konfigürasyonu</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form content */}
      </CardContent>
    </Card>
  )
}
```

### Page Example
```jsx
// pages/courier/index.jsx

import { CourierConfigForm } from '@/components/features/courier/courier-config-form'
import { CourierLogs } from '@/components/features/courier/courier-logs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CourierIntegrationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Esnaf Express Entegrasyon</h1>
        <p className="text-muted-foreground">Kurye yönetimi ve sipariş takibi</p>
      </div>

      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config">Konfigürasyon</TabsTrigger>
          <TabsTrigger value="logs">Loglar</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <CourierConfigForm />
        </TabsContent>

        <TabsContent value="logs">
          <CourierLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## 📦 IMPORT ALIASES

```js
// vite.config.js
export default {
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/hooks': '/src/hooks',
      '@/lib': '/src/lib',
      '@/assets': '/src/assets',
      '@/contexts': '/src/contexts',
    }
  }
}
```

**Usage:**
```jsx
// ✅ Clean imports
import { Button } from '@/components/ui/button'
import { useCourier } from '@/hooks/use-courier'
import { api } from '@/lib/api'

// ❌ Messy relative imports
import { Button } from '../../../components/ui/button'
```

---

## ✅ SUMMARY

**Geçici İsimlendirme (Migration sırasında):**
- `_backup/` → Eski kodlar

**Kalıcı İsimlendirme (Best Practice):**
- `components/` → ui/, layouts/, features/, shared/
- `pages/` → Fonksiyonel gruplar (auth/, products/, orders/, courier/)
- `hooks/` → Custom hooks
- `lib/` → Utilities

**Migration Sırası:**
1. Shadcn init
2. Eski kodlar → `_backup/`
3. Yeni yapıyı kur (best practice structure)
4. Sayfa sayfa migrate et
5. Test et
6. `_backup/` klasörünü sil

**Başlayalım mı?** 🚀
