# Authentication System Documentation

**Last Updated**: 2025-11-13

Authentication and authorization system for Tulumbak E-Commerce Platform.

## Overview

The platform uses JWT (JSON Web Token) based authentication with bcrypt password hashing and role-based access control (RBAC).

### Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Role-Based Access**: Customer, Admin, Super Admin roles
- **Token Expiration**: Configurable token lifetime
- **Refresh Tokens**: (Optional) Long-lived refresh tokens
- **Rate Limiting**: Login attempt protection

---

## User Authentication

### Registration

**Endpoint:** `POST /api/user/register`

**Process:**
1. Validate input data (email, password, name)
2. Check if email already exists
3. Hash password with bcrypt (10 salt rounds)
4. Create user document
5. Generate JWT token
6. Return token and user data

**Password Requirements:**
- Minimum 6 characters
- No maximum length
- Special characters recommended

**Code Example:**
```javascript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Create user
const user = new User({
  name,
  email: email.toLowerCase(),
  password: hashedPassword,
  role: 'customer'
});
await user.save();

// Generate JWT
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

### Login

**Endpoint:** `POST /api/user/login`

**Process:**
1. Find user by email (case-insensitive)
2. Compare password with bcrypt
3. Generate JWT token
4. Return token and user data

**Code Example:**
```javascript
// Find user
const user = await User.findOne({ email: email.toLowerCase() });
if (!user) {
  return res.status(404).json({ success: false, message: 'User not found' });
}

// Compare password
const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  return res.status(401).json({ success: false, message: 'Invalid password' });
}

// Generate token
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

---

## Admin Authentication

### Admin Login

**Endpoint:** `POST /api/user/admin`

**Process:**
1. Find admin by email
2. Validate password
3. Check if account is active
4. Generate JWT with admin role
5. Update lastLogin timestamp

**Admin Roles:**
- `admin`: Standard admin access
- `super_admin`: Full system access including user management

---

## JWT Token Structure

### Token Payload

```javascript
{
  id: "507f1f77bcf86cd799439011", // User/Admin ID
  role: "customer", // user role
  iat: 1699707600, // Issued at (timestamp)
  exp: 1700312400  // Expiration (timestamp)
}
```

### Token Generation

```javascript
const token = jwt.sign(
  {
    id: user._id,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '7d' // 7 days
  }
);
```

### Token Verification

```javascript
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // decoded contains { id, role, iat, exp }
  return decoded;
} catch (error) {
  // Token invalid or expired
  return null;
}
```

---

## Middleware

### Auth Middleware (`Auth.js`)

Protects user routes requiring authentication.

**Usage:**
```javascript
import authUser from './middleware/Auth.js';

router.post('/userorders', authUser, getUserOrders);
```

**Implementation:**
```javascript
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Login again'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

### Admin Auth Middleware (`AdminAuth.js`)

Protects admin-only routes.

**Usage:**
```javascript
import adminAuth from './middleware/AdminAuth.js';

router.post('/add', adminAuth, addProduct);
```

**Implementation:**
```javascript
const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    req.adminId = decoded.id;
    req.adminRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

---

## Authorization

### Role-Based Access Control (RBAC)

**Roles:**
1. **Customer** (`customer`):
   - Place orders
   - View own orders
   - Manage own profile
   - Add to cart

2. **Admin** (`admin`):
   - Manage products
   - Manage orders
   - View reports
   - Configure settings

3. **Super Admin** (`super_admin`):
   - All admin permissions
   - Manage admin accounts
   - System configuration
   - Database management

### Permission Middleware

**Example: Super Admin Only**
```javascript
const requireSuperAdmin = (req, res, next) => {
  if (req.adminRole !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Super admin access required'
    });
  }
  next();
};

// Usage
router.delete('/admin/:id', adminAuth, requireSuperAdmin, deleteAdmin);
```

---

## Security Best Practices

### Password Security

1. **Bcrypt Hashing:**
```javascript
// Hash password with 10 salt rounds
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

2. **Password Requirements:**
- Minimum 6 characters (consider increasing to 8+)
- Recommend special characters and numbers
- Implement password strength indicator

### JWT Security

1. **Secret Key:**
```env
# Use strong, random secret key (minimum 64 characters)
JWT_SECRET=your_very_long_random_secret_key_here_at_least_64_characters_long
```

2. **Token Expiration:**
```javascript
// Short-lived access tokens
expiresIn: '7d' // Consider reducing to 1d or 1h

// Long-lived refresh tokens (if implemented)
refreshExpiresIn: '30d'
```

3. **Token Storage:**
- **Client-side:** Use httpOnly cookies or localStorage with caution
- **Never** expose tokens in URLs or console logs

### Rate Limiting

Protect authentication endpoints from brute force attacks:

```javascript
import RateLimiterService from '../services/RateLimiter.js';

// 5 login attempts per 15 minutes
router.post(
  '/login',
  RateLimiterService.createAuthLimiter(5, 15 * 60 * 1000),
  login
);
```

---

## Token Refresh (Optional)

### Implementation

**Refresh Token Flow:**
1. Issue short-lived access token (1 hour)
2. Issue long-lived refresh token (30 days)
3. When access token expires, use refresh token to get new access token
4. Rotate refresh token on each use

**Example:**
```javascript
// Generate tokens
const accessToken = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1h' });
const refreshToken = jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '30d' });

// Store refresh token in database
await RefreshToken.create({
  userId: id,
  token: refreshToken,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
});

// Refresh endpoint
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

  // Check if token exists in database
  const storedToken = await RefreshToken.findOne({
    userId: decoded.id,
    token: refreshToken
  });

  if (!storedToken) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }

  // Generate new access token
  const newAccessToken = jwt.sign(
    { id: decoded.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ success: true, accessToken: newAccessToken });
});
```

---

## Session Management

### Token Invalidation

**Logout:**
```javascript
router.post('/logout', authUser, async (req, res) => {
  // If using refresh tokens, delete from database
  await RefreshToken.deleteMany({ userId: req.userId });

  // Client must delete token from storage
  res.json({ success: true, message: 'Logged out successfully' });
});
```

**Logout All Devices:**
```javascript
router.post('/logout-all', authUser, async (req, res) => {
  // Delete all refresh tokens for user
  await RefreshToken.deleteMany({ userId: req.userId });

  res.json({ success: true, message: 'Logged out from all devices' });
});
```

---

## Client-Side Integration

### Storing Tokens

**Option 1: LocalStorage (Simple but less secure)**
```javascript
// Store token
localStorage.setItem('token', token);

// Retrieve token
const token = localStorage.getItem('token');

// Remove token
localStorage.removeItem('token');
```

**Option 2: HttpOnly Cookie (More secure)**
```javascript
// Server-side: Set cookie
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### Making Authenticated Requests

**User Requests:**
```javascript
// Using fetch
fetch('/api/order/userorders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'token': token // User token
  }
});

// Using axios
axios.post('/api/order/userorders', {}, {
  headers: {
    'token': token
  }
});
```

**Admin Requests:**
```javascript
// Using Authorization header
fetch('/api/product/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify(productData)
});
```

---

## Error Handling

### Authentication Errors

| Error | Status | Description | Solution |
|-------|--------|-------------|----------|
| `Not authorized. Login again` | 401 | Token missing | Redirect to login |
| `Invalid or expired token` | 401 | Token invalid/expired | Refresh token or redirect to login |
| `Insufficient permissions` | 403 | Wrong role | Show access denied message |
| `User not found` | 404 | Invalid credentials | Show error, allow retry |
| `Invalid password` | 401 | Wrong password | Show error, allow retry |

### Client-Side Handling

```javascript
// Axios interceptor for token errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Testing Authentication

### Test User Authentication

```javascript
// Test registration
const response = await fetch('/api/user/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Test authenticated request
const ordersResponse = await fetch('/api/order/userorders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'token': token
  }
});
```

### Test Admin Authentication

```javascript
// Test admin login
const adminResponse = await fetch('/api/user/admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@tulumbak.com',
    password: 'admin123'
  })
});

const { token: adminToken } = await adminResponse.json();

// Test admin endpoint
const productsResponse = await fetch('/api/product/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify(productData)
});
```

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Store JWT_SECRET securely (never commit to Git)
- [ ] Implement rate limiting on auth endpoints
- [ ] Use bcrypt with minimum 10 salt rounds
- [ ] Set appropriate token expiration times
- [ ] Implement refresh token rotation
- [ ] Validate and sanitize all inputs
- [ ] Use httpOnly cookies for token storage
- [ ] Implement logout functionality
- [ ] Log authentication events
- [ ] Monitor failed login attempts
- [ ] Implement account lockout after failed attempts
- [ ] Use strong password requirements
- [ ] Implement two-factor authentication (future)

---

**For API documentation, see**: [API Reference](./API-Reference.md)
**For service layer documentation, see**: [Services Documentation](./Services.md)
