# 🚀 Project Setup Guide

## Overview
This is a full-stack e-commerce application called "Tulumbak İzmir Baklava" with three main components:
- **Frontend** (Customer-facing application)
- **Admin** (Admin panel for management)
- **Backend** (API server)

## 📋 Prerequisites
- Node.js (v16 or higher)
- MongoDB (installed and running on localhost:27017)
- npm or yarn

## 🛠️ Installation Steps

### 1. Install Dependencies
```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies  
cd ../frontend && npm install

# Admin dependencies
cd ../admin && npm install
```

### 2. Environment Configuration

#### Backend (.env)
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# PayTR Configuration (payment gateway)
MERCHANT_ID=your_merchant_id
MERCHANT_KEY=your_merchant_key
MERCHANT_SALT=your_merchant_salt
TEST_MODE=1
MERCHANT_OK_URL=http://localhost:3000/success
MERCHANT_FAIL_URL=http://localhost:3000/failed

# Server Configuration
PORT=4000
```

#### Frontend (.env)
```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000
```

#### Admin (.env)
```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000
```

## 🚀 Running the Application

### 1. Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:4000
```

### 2. Start Frontend Application
```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### 3. Start Admin Panel
```bash
cd admin
npm run dev
# Admin panel runs on http://localhost:5174
```

## 🔗 Access URLs
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:4000

## 🔑 Default Admin Login
- **Email**: admin@example.com
- **Password**: admin123

## 📦 Project Structure
```
├── backend/          # Node.js API server
├── frontend/         # React customer application
├── admin/           # React admin panel
└── SETUP.md         # This setup guide
```

## 🛠️ Technologies Used
- **Frontend**: React, Tailwind CSS, Vite, React Router
- **Backend**: Node.js, Express, MongoDB, JWT
- **Admin**: React, Tailwind CSS, Vite
- **Additional**: Cloudinary (images), PayTR (payments), Multer (file uploads)

## 📝 Notes
- Make sure MongoDB is running before starting the backend
- For production, update the environment variables with actual credentials
- The application uses JWT tokens for authentication
- Image uploads are handled through Cloudinary
- Payment integration is done via PayTR (Turkish payment gateway)

## 🐛 Troubleshooting
1. **MongoDB Connection Error**: Ensure MongoDB is running on localhost:27017
2. **Port Already in Use**: Change the PORT in backend/.env if needed
3. **Environment Variables**: Double-check all required environment variables are set
4. **Dependency Issues**: Run `npm audit fix` to address security vulnerabilities
