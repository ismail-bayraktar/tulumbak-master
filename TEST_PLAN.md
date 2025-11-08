# 🧪 Test Plan - Tulumbak E-Commerce

## 📊 Mevcut Test Durumu

**Test Coverage:** %5 (Çok düşük)
**Mevcut Testler:** 3 dosya
- `backend/__tests__/utils/logger.test.js`
- `backend/__tests__/middleware/cache.test.js`
- `backend/__tests__/controllers/OrderController.test.js`

---

## 🎯 Test Stratejisi

### 1. Unit Tests (Öncelik: Yüksek)

#### ProductController Tests
```javascript
- addProduct()
  ✓ Valid product data should create product
  ✓ Missing required fields should return error
  ✓ Invalid price should return error
  ✓ Image upload should work
  ✓ Duplicate product name should be allowed

- updateProduct()
  ✓ Valid update should succeed
  ✓ Invalid product ID should return error
  ✓ Partial update should work
  ✓ Image update should work

- listProducts()
  ✓ Should return all products
  ✓ inStockOnly filter should work
  ✓ Empty database should return empty array

- removeProduct()
  ✓ Valid ID should delete product
  ✓ Invalid ID should return error
  ✓ Non-existent product should return error

- singleProduct()
  ✓ Valid ID should return product
  ✓ Invalid ID should return error
  ✓ Non-existent product should return error
```

#### UserController Tests
```javascript
- loginUser()
  ✓ Valid credentials should return token
  ✓ Invalid email should return error
  ✓ Invalid password should return error
  ✓ Non-existent user should return error

- registerUser()
  ✓ Valid data should create user
  ✓ Duplicate email should return error
  ✓ Invalid email format should return error
  ✓ Weak password should return error
  ✓ Missing fields should return error

- adminLogin()
  ✓ Valid admin credentials should return token
  ✓ Invalid credentials should return error
  ✓ Inactive admin should return error
```

#### AdminController Tests
```javascript
- adminLogin()
  ✓ Valid credentials should return token
  ✓ Invalid credentials should return error

- createAdmin()
  ✓ Valid data should create admin
  ✓ Duplicate email should return error
  ✓ Missing fields should return error

- getAllAdmins()
  ✓ Should return all admins
  ✓ Should filter by role

- updateAdmin()
  ✓ Valid update should succeed
  ✓ Invalid ID should return error

- deleteAdmin()
  ✓ Valid ID should delete admin
  ✓ Self-deletion should be prevented
```

#### CouponController Tests
```javascript
- validateCoupon()
  ✓ Valid coupon should return discount
  ✓ Expired coupon should return error
  ✓ Invalid coupon code should return error
  ✓ Usage limit exceeded should return error
  ✓ Minimum cart amount not met should return error

- createCoupon()
  ✓ Valid coupon should be created
  ✓ Duplicate code should return error
  ✓ Invalid dates should return error
```

#### OrderController Tests
```javascript
- createOrder()
  ✓ Valid order should be created
  ✓ Empty cart should return error
  ✓ Invalid address should return error
  ✓ Stock check should work

- updateOrderStatus()
  ✓ Valid status update should work
  ✓ Invalid status should return error
  ✓ Status history should be updated
```

### 2. Middleware Tests (Öncelik: Yüksek)

#### AdminAuth Middleware
```javascript
- Should allow valid token
- Should reject missing token
- Should reject invalid token
- Should reject expired token
- Should attach admin to request
```

#### PermissionMiddleware Tests
```javascript
- checkPermission()
  ✓ Super admin should have all permissions
  ✓ Admin with permission should pass
  ✓ Admin without permission should fail
  ✓ Invalid token should fail

- checkRole()
  ✓ Valid role should pass
  ✓ Invalid role should fail
  ✓ Multiple roles should work
```

#### Auth Middleware
```javascript
- Should allow valid user token
- Should reject invalid token
- Should attach user to request
```

#### ErrorHandler Tests
```javascript
- Should catch async errors
- Should format error response
- Should log errors
- Should hide stack in production
```

### 3. Integration Tests (Öncelik: Orta)

#### Product Flow
```javascript
- Create product → List products → Update product → Delete product
- Create product with images → Verify images uploaded
- Update product stock → Verify stock updated
```

#### Order Flow
```javascript
- Add to cart → Create order → Update status → Complete order
- Create order with coupon → Verify discount applied
- Create order with delivery → Verify delivery calculated
```

#### Admin Flow
```javascript
- Admin login → Create product → Update product → Delete product
- Admin login → View orders → Update order status
- Admin login → Create coupon → Validate coupon
```

#### Payment Flow
```javascript
- Create order → Request PayTR token → Verify token
- PayTR callback → Verify order updated
- Payment failure → Verify order status
```

### 4. E2E Tests (Öncelik: Düşük)

#### User Journey
```javascript
- User registration → Browse products → Add to cart → Checkout → Order confirmation
- User login → View orders → Track order
- Apply coupon → Verify discount → Complete order
```

#### Admin Journey
```javascript
- Admin login → Dashboard → Add product → View orders → Update order
- Admin login → Settings → Update settings → Verify changes
- Admin login → Reports → View analytics
```

---

## 📝 Test Dosyaları Yapısı

```
backend/__tests__/
├── controllers/
│   ├── ProductController.test.js ✅ (Yazılacak)
│   ├── UserController.test.js ✅ (Yazılacak)
│   ├── AdminController.test.js ✅ (Yazılacak)
│   ├── CouponController.test.js ✅ (Yazılacak)
│   ├── OrderController.test.js ✅ (Mevcut)
│   └── CartController.test.js ✅ (Yazılacak)
├── middleware/
│   ├── AdminAuth.test.js ✅ (Yazılacak)
│   ├── Auth.test.js ✅ (Yazılacak)
│   ├── PermissionMiddleware.test.js ✅ (Yazılacak)
│   ├── errorHandler.test.js ✅ (Yazılacak)
│   └── cache.test.js ✅ (Mevcut)
├── services/
│   ├── PayTrService.test.js ✅ (Yazılacak)
│   ├── EmailService.test.js ✅ (Yazılacak)
│   └── RateLimiter.test.js ✅ (Yazılacak)
├── utils/
│   └── logger.test.js ✅ (Mevcut)
└── integration/
    ├── product-flow.test.js ✅ (Yazılacak)
    ├── order-flow.test.js ✅ (Yazılacak)
    └── admin-flow.test.js ✅ (Yazılacak)
```

---

## 🚀 Test Execution Plan

### Faz 1: Kritik Unit Tests (1-2 gün)
1. ProductController tests
2. UserController tests
3. AdminController tests
4. Middleware tests

### Faz 2: Integration Tests (1 gün)
1. Product flow
2. Order flow
3. Admin flow

### Faz 3: E2E Tests (Opsiyonel)
1. User journey
2. Admin journey

---

## 📊 Coverage Hedefleri

- **Unit Tests:** %80+
- **Integration Tests:** %60+
- **Overall Coverage:** %70+

---

## 🔧 Test Setup

### Test Environment
```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js']
};
```

### Test Database
- MongoDB test database kullanılmalı
- Her test öncesi database temizlenmeli
- Mock data kullanılmalı

---

## ✅ Test Checklist

### Unit Tests
- [ ] ProductController (5 functions)
- [ ] UserController (3 functions)
- [ ] AdminController (6 functions)
- [ ] CouponController (5 functions)
- [ ] OrderController (10+ functions)
- [ ] CartController (5+ functions)

### Middleware Tests
- [ ] AdminAuth
- [ ] Auth
- [ ] PermissionMiddleware
- [ ] ErrorHandler
- [ ] Cache

### Integration Tests
- [ ] Product CRUD flow
- [ ] Order creation flow
- [ ] Admin authentication flow
- [ ] Payment flow

---

## 📈 Success Criteria

- ✅ Test coverage %70+
- ✅ Tüm kritik endpoint'ler test edildi
- ✅ Tüm middleware'ler test edildi
- ✅ Integration testler çalışıyor
- ✅ CI/CD pipeline'da testler çalışıyor

