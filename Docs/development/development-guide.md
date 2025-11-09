# Geliştirme Rehberi

## 📋 İçindekiler

1. [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
2. [Frontend Geliştirme](#frontend-geliştirme)
3. [Backend Geliştirme](#backend-geliştirme)
4. [Admin Panel Geliştirme](#admin-panel-geliştirme)
5. [Kod Standartları](#kod-standartları)
6. [Test Rehberi](#test-rehberi)
7. [Deployment](#deployment)
8. [Sık Karşılaşılan Sorunlar](#sık-karşılaşılan-sorunlar)

## 🛠️ Geliştirme Ortamı Kurulumu

### Gerekli Yazılımlar

- **Node.js** (v18+)
- **MongoDB** (Docker ile veya lokal)
- **Git**
- **VS Code** (tavsiye edilen IDE)

### VS Code Eklentileri (Tavsiye)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Kurulum Adımları

```bash
# 1. Repository'yi klonla
git clone https://github.com/ismail-bayraktar/tulumbak-nextjs-eticaret.git
cd tulumbak-nextjs-eticaret

# 2. Docker ile MongoDB'yi başlat
docker compose up -d

# 3. Backend kurulumu
cd backend
npm install
# .env dosyasını configure et
npm start

# 4. Frontend kurulumu (yeni terminal)
cd frontend
npm install
# .env dosyasını configure et
npm run dev

# 5. Admin panel kurulumu (yeni terminal)
cd admin
npm install
# .env dosyasını configure et
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017/tulumbak
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:4001
```

## 🎨 Frontend Geliştirme

### Proje Yapısı

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── context/        # Context providers
│   ├── assets/         # Static assets
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utility functions
├── public/             # Public assets
└── index.html          # HTML template
```

### Component Geliştirme Standartları

#### 1. Functional Components Kullanın

```jsx
// ✅ Doğru
const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product._id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold">{product.name}</h3>
      <button
        onClick={handleAddToCart}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
      >
        Sepete Ekle
      </button>
    </div>
  );
};

// ❌ Yanlış (Class components)
class ProductCard extends React.Component {
  render() {
    return (
      <div>...</div>
    );
  }
}
```

#### 2. Props Destructuring Kullanın

```jsx
// ✅ Doğru
const ProductCard = ({
  product: { name, price, image },
  onAddToCart,
  className = ""
}) => {
  return (
    <div className={`product-card ${className}`}>
      {/* content */}
    </div>
  );
};

// ❌ Yanlış
const ProductCard = (props) => {
  const product = props.product;
  const onAddToCart = props.onAddToCart;
  // ...
};
```

#### 3. Tailwind CSS Kullanım Standartları

```jsx
// ✅ Doğru - Responsive ve temalı
<div className="w-full bg-white rounded-lg shadow-modern hover:shadow-modern-lg transition-shadow duration-300">
  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
    Sepete Ekle
  </button>
</div>

// ❌ Yanlış - Inline styles
<div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
  <button style={{ backgroundColor: '#FF8235', color: 'white' }}>
    Sepete Ekle
  </button>
</div>
```

### İkon Kullanımı

```jsx
// ✅ Doğru - Lucide React
import { ShoppingCart, Package, Clock, Sun } from 'lucide-react';

<ShoppingCart className="w-5 h-5 text-orange-500" />
<Package className="w-6 h-6 text-gray-600" />
<Clock className="w-4 h-4 text-blue-500" />

// ❌ Yanlış - Emoji kullanımı
<span>🛒</span>
<span>📦</span>
```

### State Management

#### Context API Kullanımı

```jsx
// Context oluşturma
const ShopContext = createContext();

// Provider component
export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  const addToCart = (productId, size) => {
    // Logic
  };

  return (
    <ShopContext.Provider value={{
      cartItems,
      products,
      addToCart
    }}>
      {children}
    </ShopContext.Provider>
  );
};

// Context kullanımı
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  const handleAddToCart = () => {
    addToCart(product._id, 'medium');
    toast.success('Ürün sepete eklendi!');
  };

  return <button onClick={handleAddToCart}>Sepete Ekle</button>;
};
```

### API Entegrasyonu

```jsx
// API service
import axios from 'axios';
import { backendUrl } from '../App.jsx';

export const productService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      return response.data;
    } catch (error) {
      console.error('Product fetch error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/${id}`);
      return response.data;
    } catch (error) {
      console.error('Product fetch error:', error);
      throw error;
    }
  }
};

// Component içinde kullanım
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        toast.error('Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
```

### Routing

```jsx
// App.jsx
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import ProductDetail from './pages/ProductDetail.jsx';

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
      </Routes>
      <Footer />
    </div>
  );
};
```

## 🔧 Backend Geliştirme

### Proje Yapısı

```
backend/
├── controllers/        # Controller logic
├── models/            # Mongoose models
├── routes/            # Route definitions
├── middleware/        # Custom middleware
├── config/            # Configuration files
├── utils/             # Utility functions
├── services/          # Business logic
└── uploads/           # File uploads
```

### Controller Pattern

```javascript
// controllers/ProductController.js
import Product from '../models/ProductModel.js';

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Products could not be fetched"
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await product.save();

    res.json({
      success: true,
      message: "Product added successfully",
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Product could not be added"
    });
  }
};
```

### Model Pattern

```javascript
// models/ProductModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  image: { type: [String], required: true },
  sizes: [{ type: String }],
  sizePrices: [{
    size: { type: Number },
    price: { type: Number }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ name: "text", description: "text" });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
```

### Route Pattern

```javascript
// routes/ProductRoute.js
import express from 'express';
import { listProducts, addProduct, updateProduct, deleteProduct } from '../controllers/ProductController.js';
import upload from '../middleware/upload.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.get('/list', listProducts);
router.post('/add', authUser, upload.single('image'), addProduct);
router.put('/update/:id', authUser, upload.single('image'), updateProduct);
router.delete('/delete/:id', authUser, deleteProduct);

export default router;
```

### Error Handling Middleware

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};

export default errorHandler;
```

## 🔐 Security Best Practices

### 1. Environment Variables

```javascript
// Asla sensitive bilgileri kod içinde saklamayın
// ❌ Yanlış
const apiKey = "sk-1234567890abcdef";

// ✅ Doğru
const apiKey = process.env.API_KEY;
```

### 2. Input Validation

```javascript
// controllers validation
import { body, validationResult } from 'express-validator';

export const validateProduct = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
```

### 3. Authentication Middleware

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const authUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

export { authUser };
```

## 🧪 Test Rehberi

### Frontend Testing

#### Component Testing (React Testing Library)

```jsx
// components/__tests__/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Baklava',
    price: 100,
    image: ['test.jpg']
  };

  const mockOnAddToCart = jest.fn();

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    expect(screen.getByText('Test Baklava')).toBeInTheDocument();
    expect(screen.getByText('₺100')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    fireEvent.click(screen.getByText('Sepete Ekle'));
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct._id);
  });
});
```

### Backend Testing

#### API Endpoint Testing

```javascript
// tests/api/products.test.js
import request from 'supertest';
import app from '../../server.js';

describe('Products API', () => {
  describe('GET /api/product/list', () => {
    it('should return list of products', async () => {
      const response = await request(app)
        .get('/api/product/list')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.products)).toBe(true);
    });
  });

  describe('POST /api/product/add', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'Test Category'
      };

      const response = await request(app)
        .post('/api/product/add')
        .send(productData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.product.name).toBe(productData.name);
    });
  });
});
```

## 📦 Build ve Deployment

### Frontend Build

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Build analysis
npm run build -- --analyze
```

### Backend Deployment

```bash
# Production
npm start

# Development with nodemon
npm run dev

# Environment setup
export NODE_ENV=production
```

### Docker Deployment

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Sık Karşılaşılan Sorunlar

### 1. CORS Sorunları

**Problem:** Frontend backend'e erişemiyor
```javascript
// Backend çözümü
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176'],
  credentials: true
}));
```

### 2. Image Upload Sorunları

**Problem:** Görseller yüklenmiyor
```javascript
// server.js uploads middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 3. Mongoose Duplicate Index Hatası

**Problem:** Schema already has an index
```javascript
// Çözüm: Duplicate index'leri kaldır
// User model'de email zaten unique:1 varsa ekstra index ekleme
userSchema.index({ email: 1 }); // ❌ Bu kaldırılmalı
```

### 4. Memory Leak Sorunları

**Problem:** Component unmount olunca event listener'lar kalıyor
```jsx
// Çözüm: Cleanup function kullan
useEffect(() => {
  const handleScroll = () => {
    // scroll logic
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### 5. State Management Sorunları

**Problem:** State update'ları çalışmıyor
```jsx
// ❌ Yanlış
const [items, setItems] = useState([]);
items.push(newItem); // Direct mutation
setItems(items);

// ✅ Doğru
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]); // Immutable update
```

## 📋 Code Review Checklist

### Frontend
- [ ] Component functional ve hooks kullanıyor mu?
- [ ] Props destructuring yapılmış mı?
- [ ] Tailwind classes doğru kullanılmış mı?
- [ ] Responsive design uygulanmış mı?
- [ ] Loading states var mı?
- [ ] Error handling yapılmış mı?
- [ ] Orange theme kullanılmış mı?

### Backend
- [ ] Input validation yapılmış mı?
- [ ] Error handling var mı?
- [ ] Authentication middleware kullanılmış mı?
- [ ] Database indexes eklenmiş mi?
- [ ] Environment variables kullanılmış mı?
- [ ] CORS ayarları doğru mu?

### General
- [ ] Kod okunabilir mi?
- [ ] Yorumlar gerekli yerlerde var mı?
- [ ] Naming conventions tutarlı mı?
- [ ] Tekrar eden kod (DRY) prensibine uyulmuş mu?
- [ ] Security best practices uygulanmış mı?

---

**Son Güncelleme:** 29.10.2024
**Versiyon:** 2.0.0
**Geliştirici:** Tulumbak Development Team