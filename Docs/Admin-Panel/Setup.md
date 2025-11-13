# Admin Panel Setup Guide

**Last Updated**: 2025-11-13

Complete setup guide for the Tulumbak Admin Panel built with React 18, Vite, Shadcn UI, and Radix UI.

## Overview

Modern admin dashboard featuring:
- **React 18**: Latest React with hooks and concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **Shadcn UI**: Beautiful, accessible component library
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **React Router v7**: Client-side routing
- **Axios**: HTTP client for API communication

---

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (http://localhost:4001)
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## Installation

### 1. Navigate to Admin Directory

```bash
cd admin
```

### 2. Install Dependencies

```bash
npm install
```

**Key Dependencies:**
- `react` & `react-dom`: React 18
- `vite`: Build tool
- `react-router-dom`: Routing
- `axios`: HTTP client
- `@radix-ui/*`: Radix UI primitives
- `tailwindcss`: Utility CSS
- `lucide-react`: Icon library
- `recharts`: Charts library
- `sonner`: Toast notifications

### 3. Environment Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:4001
```

### 4. Start Development Server

```bash
npm run dev
```

Admin panel will run on **http://localhost:5173**

---

## Project Structure

```
admin/
├── public/               # Static assets
├── src/
│   ├── components/       # Shadcn UI components
│   │   └── ui/           # Base UI components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── table.jsx
│   │       ├── toast.jsx
│   │       └── ...
│   ├── pages/            # Application pages
│   │   ├── auth/         # Login page
│   │   ├── dashboard/    # Dashboard & analytics
│   │   ├── orders/       # Order management
│   │   ├── products/     # Product CRUD
│   │   ├── email/        # Email system
│   │   │   ├── EmailSettings.jsx
│   │   │   ├── DesignTab.jsx
│   │   │   └── EmailLogs.jsx
│   │   ├── courier/      # Courier integration
│   │   ├── settings/     # System settings
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   │   └── utils.js      # Helper functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── components.json       # Shadcn UI config
├── tailwind.config.js    # Tailwind config
├── vite.config.js        # Vite config
└── package.json
```

---

## Configuration Files

### Vite Configuration

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
    },
  },
});
```

### Tailwind Configuration

**tailwind.config.js:**
```javascript
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### Shadcn UI Configuration

**components.json:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Authentication

### Login Flow

1. User enters credentials
2. POST to `/api/user/admin`
3. Store JWT token in localStorage
4. Redirect to dashboard
5. Include token in all API requests

**Login Component:**
```jsx
// src/pages/auth/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/admin`, {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
```

### Axios Configuration

**API Client Setup:**
```javascript
// src/lib/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Routing

**App.jsx:**
```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Orders from './pages/orders/Orders';
import Products from './pages/products/Products';
import EmailSettings from './pages/email/EmailSettings';
import { Toaster } from 'sonner';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />

        <Route path="/email-settings" element={
          <ProtectedRoute>
            <EmailSettings />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
```

---

## Shadcn UI Components

### Installing Components

```bash
# Add specific component
npx shadcn-ui@latest add button

# Add multiple components
npx shadcn-ui@latest add button card input select table dialog
```

### Using Components

**Button Example:**
```jsx
import { Button } from '@/components/ui/button';

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

**Card Example:**
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Orders</CardTitle>
  </CardHeader>
  <CardContent>
    <p>156 total orders</p>
  </CardContent>
</Card>
```

**Table Example:**
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Order ID</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orders.map(order => (
      <TableRow key={order.id}>
        <TableCell>{order.orderId}</TableCell>
        <TableCell>{order.customerName}</TableCell>
        <TableCell>₺{order.amount}</TableCell>
        <TableCell>{order.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## State Management

### Using React Hooks

**Example: Product Management**
```jsx
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/api/product/list');
      setProducts(response.data.productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.post('/api/product/remove', { id });
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <Button onClick={() => handleDelete(product._id)}>Delete</Button>
        </div>
      ))}
    </div>
  );
}
```

---

## Notifications

### Using Sonner Toast

```jsx
import { toast } from 'sonner';

// Success
toast.success('Product added successfully');

// Error
toast.error('Failed to add product');

// Info
toast.info('Processing order...');

// Promise
toast.promise(
  saveProduct(),
  {
    loading: 'Saving product...',
    success: 'Product saved!',
    error: 'Failed to save product',
  }
);
```

---

## Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Build output: `dist/` directory

---

## Deployment

### Vercel Deployment

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd admin
vercel
```

3. **Environment Variables:**
Add in Vercel dashboard:
- `VITE_API_URL`: Your production API URL

### Manual Deployment

1. Build the project
2. Upload `dist/` folder to web server
3. Configure web server to serve `index.html` for all routes
4. Set environment variables

**nginx configuration:**
```nginx
server {
  listen 80;
  server_name admin.tulumbak.com;
  root /var/www/admin/dist;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Troubleshooting

### Common Issues

**1. API Connection Errors**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Verify CORS configuration

**2. Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf node_modules/.vite`

**3. Component Import Errors**
- Verify `@/` alias is configured in vite.config.js
- Check component is installed: `npx shadcn-ui@latest add [component]`

---

**For components documentation, see**: [Components Guide](./Components.md)
**For pages documentation, see**: [Pages Guide](./Pages.md)
**For styling documentation, see**: [Styling Guide](./Styling.md)
