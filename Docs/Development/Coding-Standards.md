# Coding Standards

**Last Updated**: 2025-11-13

Coding standards and best practices for Tulumbak E-Commerce Platform.

## General Principles

- **Clarity over Cleverness**: Write code that is easy to understand
- **Consistency**: Follow established patterns in the codebase
- **DRY**: Don't Repeat Yourself - extract common functionality
- **KISS**: Keep It Simple, Stupid - avoid unnecessary complexity
- **YAGNI**: You Aren't Gonna Need It - don't add speculative features

---

## JavaScript/Node.js Standards

### File Naming

- **camelCase** for files: `orderController.js`, `emailService.js`
- **PascalCase** for React components: `EmailSettings.jsx`, `OrderTable.jsx`
- **kebab-case** for routes/URLs: `/api/order-status`, `/email-settings`

### Variable Naming

```javascript
// camelCase for variables and functions
const userName = 'Ahmet';
function calculateTotal() {}

// PascalCase for classes and constructors
class EmailService {}
const User = mongoose.model('User', userSchema);

// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 5;
const API_BASE_URL = 'https://api.example.com';
```

### Function Structure

```javascript
// Good: Clear, single responsibility
async function sendOrderConfirmationEmail(order) {
  const emailData = prepareEmailData(order);
  const result = await emailService.send(emailData);
  return result;
}

// Bad: Too much responsibility, unclear name
async function processOrder(order) {
  // 50 lines of mixed logic
}
```

### Async/Await vs Promises

**Prefer async/await:**
```javascript
// Good
async function fetchUserOrders(userId) {
  try {
    const orders = await Order.find({ userId });
    return orders;
  } catch (error) {
    logger.error('Failed to fetch orders', { error });
    throw error;
  }
}

// Avoid: Promise chains
function fetchUserOrders(userId) {
  return Order.find({ userId })
    .then(orders => orders)
    .catch(error => {
      logger.error('Failed to fetch orders', { error });
      throw error;
    });
}
```

### Error Handling

```javascript
// Always use try-catch with async/await
async function updateProduct(id, data) {
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) {
      throw new Error('Product not found');
    }

    return { success: true, product };
  } catch (error) {
    logger.error('Product update failed', {
      id,
      error: error.message,
      stack: error.stack
    });

    return {
      success: false,
      message: error.message
    };
  }
}
```

### Import Statements

```javascript
// Standard library first
import fs from 'fs';
import path from 'path';

// Third-party packages
import express from 'express';
import mongoose from 'mongoose';

// Local imports
import User from './models/UserModel.js';
import emailService from './services/EmailService.js';
import logger from './utils/logger.js';
```

---

## React/JSX Standards

### Component Structure

```jsx
// Functional component with hooks
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ProductList() {
  // State declarations
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effects
  useEffect(() => {
    fetchProducts();
  }, []);

  // Functions
  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/product/list');
      setProducts(response.data.productData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Early returns
  if (loading) return <div>Loading...</div>;
  if (products.length === 0) return <div>No products</div>;

  // Main render
  return (
    <div className="p-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Props and PropTypes

```jsx
// Destructure props in function signature
function ProductCard({ product, onDelete }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <Button onClick={() => onDelete(product._id)}>Delete</Button>
    </div>
  );
}

// For TypeScript projects, use interfaces
interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}
```

### JSX Formatting

```jsx
// Short props on one line
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

// Long props split to multiple lines
<ProductCard
  product={product}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  isEditable={true}
/>

// Conditional rendering
{isLoggedIn && <UserMenu />}
{orders.length > 0 ? <OrderList orders={orders} /> : <EmptyState />}

// Lists with keys
{products.map(product => (
  <ProductCard key={product._id} product={product} />
))}
```

---

## Database Standards

### Model Definition

```javascript
// UserModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false // Don't include in queries by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'super_admin'],
      default: 'customer'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual fields
userSchema.virtual('orderCount', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'userId',
  count: true
});

// Methods
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Statics
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

export default mongoose.model('User', userSchema);
```

### Query Optimization

```javascript
// Good: Use select() to limit fields
const users = await User.find()
  .select('name email role')
  .lean(); // Convert to plain JavaScript objects

// Good: Use indexes for filtering
const recentOrders = await Order.find({ createdAt: { $gte: lastWeek } })
  .sort({ createdAt: -1 })
  .limit(20);

// Good: Populate only needed fields
const order = await Order.findById(orderId)
  .populate('userId', 'name email')
  .populate('items.productId', 'name price');

// Bad: Fetching unnecessary data
const users = await User.find(); // Gets all fields for all users
```

---

## API Standards

### Route Organization

```javascript
// orderRoute.js
import express from 'express';
import { placeOrder, allOrders, updateStatus } from '../controllers/OrderController.js';
import adminAuth from '../middleware/AdminAuth.js';
import authUser from '../middleware/Auth.js';

const orderRouter = express.Router();

// Public routes first
orderRouter.get('/:orderId/status', getOrderStatus);

// User routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/userorders', authUser, getUserOrders);

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

export default orderRouter;
```

### Controller Structure

```javascript
// OrderController.js
import Order from '../models/OrderModel.js';
import logger from '../utils/logger.js';

/**
 * Place a new order
 * @route POST /api/order/place
 * @access Private (User)
 */
export const placeOrder = async (req, res) => {
  try {
    // Validate input
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Business logic
    const order = new Order({
      userId: req.userId,
      items,
      amount,
      address,
      status: 'pending'
    });

    await order.save();

    // Log success
    logger.info('Order placed', {
      orderId: order.orderId,
      userId: req.userId,
      amount
    });

    // Send response
    res.json({
      success: true,
      orderId: order.orderId,
      message: 'Order placed successfully'
    });

  } catch (error) {
    logger.error('Error placing order', {
      error: error.message,
      userId: req.userId
    });

    res.status(500).json({
      success: false,
      message: 'Failed to place order'
    });
  }
};
```

### Response Format

**Success Response:**
```javascript
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}
```

**Error Response:**
```javascript
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { /* optional */ }
}
```

---

## Logging Standards

### Log Levels

```javascript
import logger from './utils/logger.js';

// INFO: General information
logger.info('Server started', { port: 4001 });

// DEBUG: Detailed debugging information
logger.debug('Processing order', { orderId, items });

// WARN: Warning conditions
logger.warn('Low stock alert', { productId, stock: 5 });

// ERROR: Error conditions
logger.error('Order failed', {
  error: error.message,
  stack: error.stack,
  orderId
});
```

### What to Log

**Do Log:**
- Application start/stop
- API requests/responses (in development)
- Authentication attempts
- Business transactions (orders, payments)
- External API calls
- Errors with context

**Don't Log:**
- Passwords or sensitive data
- Credit card information
- Personal identifiable information (PII) in production
- Excessive debugging in production

---

## Testing Standards

### Test Structure

```javascript
// orderController.test.js
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';
import Order from '../models/OrderModel.js';

describe('Order Controller', () => {
  let authToken;

  beforeEach(async () => {
    // Setup: Create test user and get token
    authToken = await getTestAuthToken();
  });

  afterEach(async () => {
    // Cleanup: Remove test data
    await Order.deleteMany({ userId: testUserId });
  });

  describe('POST /api/order/place', () => {
    it('should create a new order with valid data', async () => {
      const orderData = {
        items: [{ productId: '123', quantity: 2 }],
        amount: 250,
        address: { /* ... */ }
      };

      const response = await request(app)
        .post('/api/order/place')
        .set('token', authToken)
        .send(orderData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.orderId).toBeDefined();
    });

    it('should fail with empty items array', async () => {
      const orderData = {
        items: [],
        amount: 0,
        address: { /* ... */ }
      };

      const response = await request(app)
        .post('/api/order/place')
        .set('token', authToken)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

---

## Documentation Standards

### Code Comments

```javascript
// Good: Explain WHY, not WHAT
// Calculate tax using Turkish VAT rate (18%)
// This rate may change based on product category
const tax = amount * 0.18;

// Bad: Obvious comment
// Add 18% to amount
const tax = amount * 0.18;
```

### JSDoc Comments

```javascript
/**
 * Send order confirmation email to customer
 *
 * @param {Object} order - Order object from database
 * @param {string} order.orderId - Unique order identifier
 * @param {string} order.customerEmail - Customer email address
 * @param {Array} order.items - Order items array
 * @returns {Promise<Object>} Email send result
 * @throws {Error} If email service is not configured
 *
 * @example
 * const result = await sendOrderConfirmation(order);
 * if (result.success) {
 *   console.log('Email sent to:', order.customerEmail);
 * }
 */
async function sendOrderConfirmation(order) {
  // Implementation
}
```

---

## Git Commit Standards

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(email): Add logo upload functionality

- Support both URL and file upload
- Integrate with Cloudinary for storage
- Add preview in email settings page

Closes #123
```

```
fix(order): Resolve duplicate order ID generation

Orders created simultaneously could get the same ID.
Now using atomic counter with MongoDB to ensure uniqueness.

Fixes #456
```

---

## Security Standards

### Input Validation

```javascript
// Use validation libraries
import { z } from 'zod';

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().positive()
  })).min(1),
  amount: z.number().positive(),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    phone: z.string().regex(/^[0-9]{10}$/)
  })
});

// Validate in controller
const validatedData = orderSchema.parse(req.body);
```

### Password Handling

```javascript
// Always hash passwords
import bcrypt from 'bcrypt';

// Hash with salt rounds
const hashedPassword = await bcrypt.hash(password, 10);

// Never log passwords
logger.info('User login', { email }); // Good
logger.info('User login', { email, password }); // BAD!

// Never return passwords
const user = await User.findOne({ email }).select('-password');
```

### Environment Variables

```javascript
// Never commit .env files
// Use .env.example as template

// Access environment variables
const port = process.env.PORT || 4001;
const jwtSecret = process.env.JWT_SECRET;

// Validate required variables on startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
```

---

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] Functions have single responsibility
- [ ] Error handling is proper
- [ ] Input validation is implemented
- [ ] Sensitive data is not logged
- [ ] Tests are written and passing
- [ ] Comments explain complex logic
- [ ] No hardcoded credentials
- [ ] Database queries are optimized
- [ ] API responses follow standard format

---

**For Git workflow, see**: [Git Workflow](./Git-Workflow.md)
**For development setup, see**: [Getting Started](./Getting-Started.md)
