# Tulumbak E-Commerce Platform

**Last Updated**: 2025-11-13

## Project Overview

Tulumbak is a comprehensive e-commerce platform designed for the Turkish market, featuring advanced courier integration, order management, and a modern admin panel. The platform is built with a focus on reliability, scalability, and user experience.

### Key Features

- **Modern Admin Panel**: Built with React 18, Vite, Shadcn UI, and Radix UI components
- **Advanced Email System**: React Email templates with SWC transpilation and comprehensive logging
- **Courier Integration**: MuditaKurye integration with circuit breaker pattern and retry mechanisms
- **Order Management**: Complete order lifecycle management with status tracking
- **Product Management**: Category-based product organization with inventory tracking
- **Media Library**: Cloudinary integration for image management
- **Payment Gateway**: PayTR integration for Turkish market
- **Caching Layer**: Redis caching for performance optimization
- **Security**: Helmet.js, rate limiting, JWT authentication

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis (optional)
- **Email**: React Email + Nodemailer + SWC
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod schemas
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Error Tracking**: Sentry
- **Documentation**: Swagger/OpenAPI

### Admin Panel
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Notifications**: Sonner + React Toastify

### Infrastructure
- **Container**: Docker (optional)
- **Deployment**: Vercel-compatible
- **CDN**: Cloudinary

## Project Structure

```
tulumbak-master/
├── backend/                    # Backend API server
│   ├── config/                 # Configuration files (MongoDB, Redis, Cloudinary, Swagger)
│   ├── controllers/            # Request handlers and business logic
│   ├── models/                 # MongoDB schemas and models
│   ├── routes/                 # API route definitions
│   ├── services/               # Core business services
│   │   ├── EmailService.js     # Email management and sending
│   │   ├── MuditaKuryeService.js # Courier integration
│   │   ├── CircuitBreakerService.js # Fault tolerance
│   │   ├── RetryService.js     # Retry logic for failed operations
│   │   └── ...
│   ├── middleware/             # Authentication, validation, rate limiting
│   ├── emails/                 # React Email templates
│   ├── schemas/                # Zod validation schemas
│   ├── utils/                  # Helper functions
│   ├── __tests__/              # Unit and integration tests
│   └── server.js               # Application entry point
│
├── admin/                      # Admin Panel (React)
│   ├── src/
│   │   ├── components/         # Shadcn UI components
│   │   │   └── ui/             # Base UI components (button, card, dialog, etc.)
│   │   ├── pages/              # Application pages
│   │   │   ├── auth/           # Login, authentication
│   │   │   ├── dashboard/      # Dashboard and analytics
│   │   │   ├── orders/         # Order management
│   │   │   ├── products/       # Product management
│   │   │   ├── email/          # Email management system
│   │   │   ├── courier/        # Courier management
│   │   │   ├── settings/       # System settings
│   │   │   └── ...
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   └── App.jsx             # Main application component
│   └── ...
│
└── Docs/                       # Documentation
    ├── Backend/                # Backend documentation
    ├── Admin-Panel/            # Admin panel documentation
    ├── Integrations/           # Integration guides
    ├── Development/            # Development guides
    └── MuditaKurye Entegrasyon Dokümantasyonu/ # External courier docs
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB 6+
- Redis (optional, for caching)
- Cloudinary account (for image uploads)
- SMTP server credentials (for email)

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if using Docker):
```bash
docker-compose up -d mongodb
```

5. **Run the server**:
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:4001`

### Admin Panel Setup

1. **Navigate to admin directory**:
```bash
cd admin
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure API endpoint**:
Create `.env` file:
```env
VITE_API_URL=http://localhost:4001
```

4. **Run the development server**:
```bash
npm run dev
```

Admin panel will run on `http://localhost:5173`

### Default Admin Credentials

```
Email: admin@tulumbak.com
Password: admin123
```

⚠️ **Change these credentials immediately in production!**

## Architecture Overview

### Backend Architecture

```mermaid
graph TB
    Client[Client/Admin Panel] --> API[Express API Server]
    API --> Auth[Authentication Middleware]
    Auth --> Rate[Rate Limiter]
    Rate --> Controller[Controllers]
    Controller --> Service[Services]
    Service --> DB[(MongoDB)]
    Service --> Cache[(Redis Cache)]
    Service --> External[External Services]
    External --> Courier[MuditaKurye API]
    External --> Payment[PayTR Gateway]
    External --> CDN[Cloudinary CDN]
    External --> SMTP[Email SMTP]
```

### Key Design Patterns

1. **Circuit Breaker**: Prevents cascading failures in external API calls
2. **Retry Pattern**: Automatic retry with exponential backoff for transient failures
3. **Dead Letter Queue**: Captures and manages failed operations for manual review
4. **Caching Strategy**: Redis caching for frequently accessed data
5. **Repository Pattern**: Data access abstraction through Mongoose models
6. **Service Layer**: Business logic separation from controllers

## Core Features

### 1. Email Management System

Modern email system with React Email templates:
- **SMTP Configuration**: Flexible SMTP server setup (Gmail, custom servers)
- **Template Management**: React-based email templates with SWC transpilation
- **Email Logging**: Comprehensive logging with trigger tracking
- **Logo Management**: URL-based or file upload with Cloudinary integration
- **Template Testing**: Test emails before sending to customers

📖 [Email System Documentation](./Backend/Email-System.md)

### 2. Courier Integration

MuditaKurye courier service integration:
- **Order Assignment**: Automatic courier assignment
- **Real-time Tracking**: Live delivery status updates
- **Webhook Integration**: Receive status updates from courier
- **Circuit Breaker**: Fault-tolerant external API calls
- **Retry Mechanism**: Automatic retry for failed operations

📖 [MuditaKurye Integration](./Integrations/MuditaKurye-Implementation.md)

### 3. Order Management

Complete order lifecycle:
- Order creation and validation
- Status tracking (pending → preparing → ready → delivered)
- Delivery zone management
- Courier assignment
- Order history and reporting

### 4. Product Management

Comprehensive product catalog:
- Category-based organization
- Inventory tracking
- Pricing and discounts
- Image gallery with Cloudinary
- Product variants and options

### 5. Admin Panel

Modern dashboard built with Shadcn UI:
- **Dashboard**: Analytics and overview
- **Orders**: Order management and tracking
- **Products**: Product CRUD operations
- **Email**: Email template and settings management
- **Courier**: Courier integration configuration
- **Settings**: System-wide settings

📖 [Admin Panel Documentation](./Admin-Panel/Setup.md)

## API Documentation

The backend provides a RESTful API with Swagger documentation.

**Access Swagger UI**: `http://localhost:4001/api-docs`

### Main API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/user` | User authentication and management |
| `/api/product` | Product catalog operations |
| `/api/order` | Order management |
| `/api/cart` | Shopping cart operations |
| `/api/courier` | Courier integration |
| `/api/delivery` | Delivery management |
| `/api/email` | Email management system |
| `/api/settings` | System settings |
| `/api/admin` | Admin operations |

📖 [Complete API Reference](./Backend/API-Reference.md)

## Database Schema

MongoDB collections:

- **users**: Customer accounts
- **admins**: Admin accounts with roles
- **products**: Product catalog
- **categories**: Product categories
- **orders**: Order records
- **couriers**: Courier information
- **deliveryzones**: Delivery area definitions
- **emailsettings**: Email configuration
- **emaillogs**: Email sending history
- **emailtemplates**: Email templates
- **courierintegrationconfigs**: Courier integration settings
- **deadletterqueue**: Failed operations

📖 [Database Schema Documentation](./Backend/Database-Schema.md)

## Security Features

- **Helmet.js**: Security headers (CSP, HSTS, etc.)
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API rate limiting per endpoint
- **CORS Configuration**: Whitelist-based origin control
- **Input Validation**: Zod schema validation
- **Password Hashing**: Bcrypt password encryption
- **Environment Variables**: Sensitive data in .env
- **Webhook Encryption**: Encrypted webhook secrets

## Performance Optimization

- **Redis Caching**: Cache frequently accessed data
- **Database Indexing**: Optimized MongoDB indexes
- **Lazy Loading**: Component and route lazy loading
- **Image Optimization**: Cloudinary CDN with transformations
- **Compression**: Response compression middleware
- **Connection Pooling**: MongoDB connection reuse

## Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
backend/__tests__/
├── unit/               # Unit tests
├── integration/        # Integration tests
└── mocks/              # Test mocks and fixtures
```

## Deployment

### Environment Configuration

Ensure all environment variables are configured:

```env
# Production settings
NODE_ENV=production
PORT=4001

# Database
MONGODB_URI=your_production_mongodb_uri

# Security
JWT_SECRET=your_production_jwt_secret

# Services
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret

# Courier
MUDITA_API_KEY=your_mudita_api_key
MUDITA_ENABLED=true
MUDITA_TEST_MODE=false
```

📖 [Deployment Guide](./Development/Deployment.md)

## Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push and create PR
git push origin feature/your-feature-name
```

📖 [Git Workflow Guide](./Development/Git-Workflow.md)

### Coding Standards

- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting (if configured)
- **Naming Conventions**: camelCase for JS, PascalCase for React components
- **File Organization**: Feature-based structure
- **Commit Messages**: Conventional commits format

📖 [Coding Standards](./Development/Coding-Standards.md)

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB is running
docker ps

# Verify connection string in .env
MONGODB_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
```

**CORS Errors**
```bash
# Add your frontend URL to .env
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

**Email Sending Failed**
```bash
# For Gmail, enable "Less secure app access" or use App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**Redis Connection Failed**
```bash
# Disable Redis if not needed
REDIS_ENABLED=false
```

## Documentation Index

### Backend Documentation
- [API Reference](./Backend/API-Reference.md) - Complete API endpoint documentation
- [Services](./Backend/Services.md) - Core service layer documentation
- [Database Schema](./Backend/Database-Schema.md) - MongoDB schema and relationships
- [Authentication](./Backend/Authentication.md) - Authentication system and middleware
- [Email System](./Backend/Email-System.md) - Email management detailed documentation

### Admin Panel Documentation
- [Setup](./Admin-Panel/Setup.md) - Installation and development setup
- [Components](./Admin-Panel/Components.md) - Shadcn UI components guide
- [Pages](./Admin-Panel/Pages.md) - Page structure and routing
- [Styling](./Admin-Panel/Styling.md) - Tailwind CSS and design system

### Integration Documentation
- [MuditaKurye Implementation](./Integrations/MuditaKurye-Implementation.md) - Courier integration guide
- [Cloudinary](./Integrations/Cloudinary.md) - Image upload integration
- [SMTP Email](./Integrations/SMTP-Email.md) - Email service configuration

### Development Documentation
- [Getting Started](./Development/Getting-Started.md) - Development environment setup
- [Coding Standards](./Development/Coding-Standards.md) - Project standards and best practices
- [Git Workflow](./Development/Git-Workflow.md) - Branching and commit conventions
- [Deployment](./Development/Deployment.md) - Production deployment guide

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

## Support

For questions or issues:
- Create an issue in the repository
- Check existing documentation
- Review Swagger API documentation at `/api-docs`

## License

Proprietary - All rights reserved

---

**Version**: 1.0.0
**Maintained by**: Tulumbak Development Team
**Last Updated**: 2025-11-13
