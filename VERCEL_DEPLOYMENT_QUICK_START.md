# ⚡ Vercel Deployment - Hızlı Başlangıç

5 dakikada Vercel'de deploy edin!

## 🎯 Yaklaşım: Monorepo (Aynı Repo, 3 Ayrı Proje)

```
GitHub Repo: tulumbak-master
├── backend/    → Vercel Projesi 1 (api.tulumbak.com)
├── frontend/   → Vercel Projesi 2 (www.tulumbak.com)
└── admin/      → Vercel Projesi 3 (admin.tulumbak.com)
```

---

## 🚀 Hızlı Adımlar

### 1. GitHub'a Push Edin

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Vercel'de 3 Proje Oluşturun

#### Backend Projesi

1. https://vercel.com/dashboard → "Add New Project"
2. GitHub repo'nuzu seçin
3. **Project Name:** `tulumbak-backend`
4. **Root Directory:** `backend` ⚠️ ÖNEMLİ!
5. **Framework Preset:** Other
6. **Build Command:** (boş)
7. **Output Directory:** (boş)
8. Environment Variables ekleyin (aşağıda)
9. "Deploy" tıklayın

#### Frontend Projesi

1. "Add New Project"
2. Aynı GitHub repo'yu seçin
3. **Project Name:** `tulumbak-frontend`
4. **Root Directory:** `frontend` ⚠️ ÖNEMLİ!
5. **Framework Preset:** Vite
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Environment Variables ekleyin:
   ```
   VITE_BACKEND_URL=https://api.tulumbak.com
   ```
9. "Deploy" tıklayın

#### Admin Projesi

1. "Add New Project"
2. Aynı GitHub repo'yu seçin
3. **Project Name:** `tulumbak-admin`
4. **Root Directory:** `admin` ⚠️ ÖNEMLİ!
5. **Framework Preset:** Vite
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Environment Variables ekleyin:
   ```
   VITE_BACKEND_URL=https://api.tulumbak.com
   ```
9. "Deploy" tıklayın

---

## 🔑 Backend Environment Variables

Backend projesi için Vercel Dashboard → Settings → Environment Variables:

```env
NODE_ENV=production
PORT=4001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CORS_ORIGINS=https://www.tulumbak.com,https://admin.tulumbak.com
FRONTEND_URL=https://www.tulumbak.com
BACKEND_URL=https://api.tulumbak.com
MERCHANT_ID=paytr_id
MERCHANT_KEY=paytr_key
MERCHANT_SALT=paytr_salt
TEST_MODE=0
MERCHANT_OK_URL=https://www.tulumbak.com/orders
MERCHANT_FAIL_URL=https://www.tulumbak.com/paymentfail
# ... diğer tüm backend env variables
```

---

## 🌐 Domain Ayarlama

Her proje için:

1. Vercel Dashboard → Projenizi seçin
2. Settings → Domains
3. "Add Domain" tıklayın
4. Domain'inizi girin:
   - Backend: `api.tulumbak.com`
   - Frontend: `www.tulumbak.com`
   - Admin: `admin.tulumbak.com`
5. DNS ayarlarını yapın (Vercel size talimat verecek)

---

## ✅ Test

```bash
# Backend
curl https://api.tulumbak.com/
# Beklenen: "API Working"

# Frontend
# Tarayıcıda açın: https://www.tulumbak.com

# Admin
# Tarayıcıda açın: https://admin.tulumbak.com
```

---

## ⚠️ Önemli Notlar

1. **Root Directory:** Her projede doğru klasörü seçin!
2. **Environment Variables:** Her proje için ayrı ayrı ekleyin
3. **Domain:** Her proje için ayrı domain kullanın
4. **Build Settings:** Frontend ve Admin için Vite preset kullanın

---

## 🆘 Sorun mu var?

- [Detaylı Rehber](./Docs/deployment/VERCEL_DEPLOYMENT.md)
- Vercel Dashboard → Deployments → Build Logs kontrol edin

---

**Hazır! 🎉**

