# Getting Started Guide

**Last Updated**: 2025-11-13

Complete development environment setup for Tulumbak E-Commerce Platform.

## Prerequisites

### Required Software

- **Node.js**: 18+ (LTS recommended)
- **npm** or **yarn**: Latest version
- **MongoDB**: 6+ (local or cloud)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Optional Software

- **Docker**: For containerized MongoDB
- **Redis**: For caching (optional)
- **Postman**: For API testing

---

## Quick Start (5 Minutes)

### 1. Clone Repository

```bash
git clone https://github.com/your-org/tulumbak.git
cd tulumbak
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend runs on **http://localhost:4001**

### 3. Setup Admin Panel

```bash
cd ../admin
npm install
echo "VITE_API_URL=http://localhost:4001" > .env
npm run dev
```

Admin panel runs on **http://localhost:5173**

### 4. Access Admin Panel

- URL: http://localhost:5173
- Email: admin@tulumbak.com
- Password: admin123

---

## Detailed Setup

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

**Key Packages:**
- express: Web framework
- mongoose: MongoDB ODM
- nodemailer: Email sending
- jsonwebtoken: Authentication
- bcrypt: Password hashing

#### 2. Configure Environment

```bash
cp .env.example .env
```

**Edit `.env`:**
```env
# MongoDB
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin

# Server
PORT=4001
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin
ADMIN_EMAIL=admin@tulumbak.com
ADMIN_PASSWORD=admin123

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your_app_password

# Cloudinary (Optional)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret

# Redis (Optional)
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379
```

#### 3. Start MongoDB

**Option A: Docker**
```bash
docker-compose up -d mongodb
```

**Option B: Local Installation**
```bash
# Windows
net start MongoDB

# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod
```

#### 4. Initialize Database

```bash
# Database initialization happens automatically on first start
npm run dev
```

Default admin account created:
- Email: admin@tulumbak.com
- Password: admin123

#### 5. Verify Backend

```bash
# Check server
curl http://localhost:4001

# Check API docs
open http://localhost:4001/api-docs
```

### Admin Panel Setup

#### 1. Install Dependencies

```bash
cd admin
npm install
```

**Key Packages:**
- react: UI library
- vite: Build tool
- @radix-ui/\*: UI primitives
- tailwindcss: CSS framework
- axios: HTTP client

#### 2. Configure Environment

```bash
echo "VITE_API_URL=http://localhost:4001" > .env
```

#### 3. Start Development Server

```bash
npm run dev
```

#### 4. Access Admin Panel

Open http://localhost:5173 in browser

---

## Development Tools

### VS Code Extensions

Recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "mongodb.mongodb-vscode",
    "humao.rest-client"
  ]
}
```

### VS Code Settings

**.vscode/settings.json:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Git Configuration

```bash
# Set user info
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch
git config --global init.defaultBranch main

# Set pull behavior
git config --global pull.rebase false
```

---

## Project Structure Overview

```
tulumbak/
├── backend/              # Backend API server
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Middleware functions
│   ├── emails/           # Email templates
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
│
├── admin/                # Admin Panel (React)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities
│   └── ...
│
├── Docs/                 # Documentation
│   ├── Backend/
│   ├── Admin-Panel/
│   ├── Integrations/
│   └── Development/
│
└── docker-compose.yml    # Docker configuration
```

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Edit files in your code editor

### 3. Test Changes

```bash
# Backend tests
cd backend
npm test

# Manual testing
# Test API endpoints in Postman/browser
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

---

## Common Development Tasks

### Adding New API Endpoint

1. Create route in `/backend/routes/`
2. Create controller in `/backend/controllers/`
3. Add validation schema in `/backend/schemas/`
4. Update Swagger documentation
5. Test endpoint

### Adding New Admin Page

1. Create page component in `/admin/src/pages/`
2. Add route in `App.jsx`
3. Create necessary UI components
4. Connect to API with axios

### Adding Database Model

1. Create model in `/backend/models/`
2. Define schema with Mongoose
3. Add indexes if needed
4. Update controllers to use model

---

## Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Manual API Testing

**Using curl:**
```bash
# Test login
curl -X POST http://localhost:4001/api/user/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tulumbak.com","password":"admin123"}'

# Test authenticated endpoint
curl -X GET http://localhost:4001/api/product/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Using Postman:**
1. Import Swagger/OpenAPI spec from `/api-docs`
2. Set environment variables
3. Test endpoints

---

## Debugging

### Backend Debugging

**VS Code Launch Configuration:**

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/server.js",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "console": "integratedTerminal"
    }
  ]
}
```

**Logging:**
```javascript
import logger from './utils/logger.js';

logger.info('Operation successful', { data });
logger.error('Operation failed', { error: error.message });
logger.debug('Debug info', { details });
```

### Admin Panel Debugging

**React DevTools:**
- Install React DevTools browser extension
- Inspect component tree
- View props and state

**Console Debugging:**
```javascript
console.log('Debug:', data);
console.error('Error:', error);
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `PORT` | No | Server port | `4001` |
| `JWT_SECRET` | Yes | JWT signing secret | `your_secret_key` |
| `ADMIN_EMAIL` | Yes | Default admin email | `admin@tulumbak.com` |
| `ADMIN_PASSWORD` | Yes | Default admin password | `admin123` |
| `SMTP_HOST` | No | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | No | Email server port | `587` |
| `SMTP_USER` | No | Email username | `your@gmail.com` |
| `SMTP_PASSWORD` | No | Email password | `app_password` |
| `CLOUDINARY_NAME` | No | Cloudinary cloud name | `your_cloud` |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key | `123456789` |
| `CLOUDINARY_SECRET_KEY` | No | Cloudinary secret | `your_secret` |
| `REDIS_ENABLED` | No | Enable Redis caching | `true/false` |
| `REDIS_URL` | No | Redis connection URL | `redis://localhost:6379` |

### Admin Panel (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `http://localhost:4001` |

---

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Check MongoDB is running: `docker ps` or `sudo systemctl status mongod`
- Verify connection string in `.env`
- Check MongoDB port: default is 27017

### Backend Won't Start

**Error:** `Error: listen EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port
lsof -i :4001  # macOS/Linux
netstat -ano | findstr :4001  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Admin Panel API Errors

**Error:** `Network Error` or `CORS Error`

**Solution:**
- Check backend is running
- Verify `VITE_API_URL` in admin `.env`
- Check CORS configuration in backend

### npm Install Fails

**Error:** `EACCES` permissions error

**Solution:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) ~/.config

# Or use nvm (recommended)
# https://github.com/nvm-sh/nvm
```

---

## Next Steps

- [Coding Standards](./Coding-Standards.md) - Learn project conventions
- [Git Workflow](./Git-Workflow.md) - Branching and commit guidelines
- [Backend API Documentation](../Backend/API-Reference.md) - API endpoints
- [Admin Panel Components](../Admin-Panel/Components.md) - UI components

---

## Getting Help

- **Documentation**: Check `/Docs` directory
- **API Docs**: http://localhost:4001/api-docs
- **GitHub Issues**: Report bugs and ask questions
- **Team Chat**: Contact development team

---

## Quick Command Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm test             # Run tests
npm run test:coverage # Test with coverage

# Admin Panel
cd admin
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# MongoDB (Docker)
docker-compose up -d mongodb    # Start MongoDB
docker-compose down             # Stop all services
docker-compose logs mongodb     # View MongoDB logs

# Git
git status           # Check status
git branch           # List branches
git checkout -b feature/name  # Create feature branch
git add .            # Stage changes
git commit -m "message"  # Commit changes
git push origin branch-name  # Push to remote
```
