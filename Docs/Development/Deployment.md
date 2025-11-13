# Deployment Guide

**Last Updated**: 2025-11-13

Production deployment guide for Tulumbak E-Commerce Platform.

## Pre-Deployment Checklist

### Security

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET (64+ characters)
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Encrypt sensitive environment variables
- [ ] Enable rate limiting
- [ ] Review and update security headers
- [ ] Disable debug logging in production
- [ ] Remove development dependencies

### Performance

- [ ] Enable Redis caching
- [ ] Configure MongoDB indexes
- [ ] Optimize images (Cloudinary)
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure connection pooling

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy
- [ ] Set up alerts

---

## Environment Configuration

### Backend Production Environment

Create `.env.production`:

```env
# Server
NODE_ENV=production
PORT=4001

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tulumbak?retryWrites=true&w=majority

# Security
JWT_SECRET=your_production_jwt_secret_minimum_64_characters_random_string

# CORS
CORS_ORIGINS=https://tulumbak.com,https://admin.tulumbak.com

# Admin Account
ADMIN_EMAIL=admin@tulumbak.com
ADMIN_PASSWORD=your_secure_password

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@tulumbak.com
SMTP_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_NAME=your_production_cloudinary
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_SECRET_KEY=your_production_secret

# Redis
REDIS_ENABLED=true
REDIS_URL=redis://production-redis:6379

# MuditaKurye
MUDITA_ENABLED=true
MUDITA_TEST_MODE=false
MUDITA_API_KEY=yk_production_api_key
MUDITA_API_SECRET=production_secret
MUDITA_WEBHOOK_SECRET=wh_production_webhook_secret
MUDITA_RESTAURANT_ID=rest_production_id

# Error Tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Frontend URL
FRONTEND_URL=https://tulumbak.com
```

### Admin Panel Production Environment

Create `.env.production`:

```env
VITE_API_URL=https://api.tulumbak.com
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Admin Panel)

#### Backend on Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Configure vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. **Deploy:**
```bash
cd backend
vercel --prod
```

4. **Set Environment Variables:**
- Go to Vercel dashboard
- Project Settings → Environment Variables
- Add all production environment variables

#### Admin Panel on Vercel

1. **Build:**
```bash
cd admin
npm run build
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Configure:**
- Add `VITE_API_URL` environment variable
- Set domain: admin.tulumbak.com

---

### Option 2: VPS/Cloud Server (Digital Ocean, AWS, etc.)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
# Follow: https://www.mongodb.com/docs/manual/installation/

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

#### 2. Deploy Backend

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-org/tulumbak.git
cd tulumbak/backend

# Install dependencies
npm install --production

# Create .env.production file
sudo nano .env.production
# Add all production environment variables

# Start with PM2
pm2 start server.js --name tulumbak-backend

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
```

#### 3. Configure Nginx

**Backend Reverse Proxy:**

```bash
sudo nano /etc/nginx/sites-available/tulumbak-api
```

```nginx
server {
    listen 80;
    server_name api.tulumbak.com;

    location / {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Admin Panel:**

```bash
sudo nano /etc/nginx/sites-available/tulumbak-admin
```

```nginx
server {
    listen 80;
    server_name admin.tulumbak.com;

    root /var/www/tulumbak/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Enable Sites:**
```bash
sudo ln -s /etc/nginx/sites-available/tulumbak-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/tulumbak-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d api.tulumbak.com -d admin.tulumbak.com

# Auto-renewal (added by certbot)
sudo systemctl status certbot.timer
```

#### 5. Deploy Admin Panel

```bash
cd /var/www/tulumbak/admin

# Build production
npm run build

# Files are in dist/ directory
# Served by Nginx as configured above
```

---

### Option 3: Docker Deployment

#### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 4001

# Start application
CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4001:4001"
    env_file:
      - ./backend/.env.production
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped

  mongodb:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    restart: unless-stopped

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./admin/dist:/usr/share/nginx/html
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

#### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down

# Update and restart
git pull
docker-compose build
docker-compose up -d
```

---

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Cluster:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free/paid cluster
   - Choose region closest to your users

2. **Configure:**
   - Database Access: Create user with readWrite permissions
   - Network Access: Add server IP (or 0.0.0.0/0 for testing)
   - Get connection string

3. **Connection String:**
```
mongodb+srv://username:password@cluster.mongodb.net/tulumbak?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt install -y mongodb-org

# Configure
sudo nano /etc/mongod.conf

# Enable authentication
security:
  authorization: enabled

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "securePassword",
  roles: ["root"]
})

# Create application user
use tulumbak
db.createUser({
  user: "tulumbak_user",
  pwd: "securePassword",
  roles: ["readWrite"]
})
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run tests
        working-directory: ./backend
        run: npm test

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./backend

  deploy-admin:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./admin
        run: npm ci

      - name: Build
        working-directory: ./admin
        run: npm run build
        env:
          VITE_API_URL: https://api.tulumbak.com

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_ADMIN_PROJECT_ID }}
          working-directory: ./admin
```

---

## Monitoring and Logging

### PM2 Monitoring

```bash
# View processes
pm2 list

# View logs
pm2 logs tulumbak-backend

# Monitor resources
pm2 monit

# View detailed info
pm2 show tulumbak-backend
```

### Sentry Error Tracking

1. **Setup:**
```bash
npm install @sentry/node
```

2. **Initialize (server.js):**
```javascript
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: 'production',
    tracesSampleRate: 1.0,
  });
}

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## Backup Strategy

### MongoDB Backup

```bash
# Manual backup
mongodump --uri="mongodb://user:pass@localhost:27017/tulumbak" --out=/backup/$(date +%Y-%m-%d)

# Automated daily backup (crontab)
0 2 * * * /usr/bin/mongodump --uri="mongodb://user:pass@localhost:27017/tulumbak" --out=/backup/$(date +\%Y-\%m-\%d)

# Backup to S3
0 3 * * * mongodump --uri="mongodb://..." --archive | aws s3 cp - s3://tulumbak-backups/mongo-$(date +\%Y-\%m-\%d).gz
```

### Files Backup

```bash
# Backup uploads directory
tar -czf /backup/uploads-$(date +%Y-%m-%d).tar.gz /var/www/tulumbak/backend/uploads
```

---

## Performance Optimization

### Redis Caching

```javascript
// Enable Redis in production
REDIS_ENABLED=true
REDIS_URL=redis://your-redis-host:6379
```

### MongoDB Optimization

```javascript
// Create indexes
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ orderId: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.emaillogs.createIndex({ createdAt: -1 });
```

### Nginx Caching

```nginx
# Cache static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

---

## Health Checks

### Backend Health Endpoint

```javascript
// server.js
app.get('/health', async (req, res) => {
  try {
    // Check database
    await mongoose.connection.db.admin().ping();

    // Check Redis
    if (REDIS_ENABLED) {
      await redis.ping();
    }

    res.json({
      status: 'healthy',
      timestamp: new Date(),
      database: 'connected',
      redis: REDIS_ENABLED ? 'connected' : 'disabled'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### Monitoring Script

```bash
#!/bin/bash
# check-health.sh

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.tulumbak.com/health)

if [ $RESPONSE -ne 200 ]; then
  echo "Health check failed: $RESPONSE"
  # Send alert (email, Slack, etc.)
  # Restart service if needed
fi
```

---

## Rollback Procedure

### Vercel Rollback

```bash
# View deployments
vercel list

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### PM2 Rollback

```bash
# Stop current version
pm2 stop tulumbak-backend

# Switch to previous version
cd /var/www/tulumbak
git checkout <previous-commit-hash>

# Restart
pm2 restart tulumbak-backend
```

### Docker Rollback

```bash
# List images
docker images

# Use previous image
docker-compose down
docker-compose up -d tulumbak-backend:<previous-tag>
```

---

## Post-Deployment

### Verify Deployment

- [ ] Check health endpoint: `/health`
- [ ] Test login functionality
- [ ] Test order placement
- [ ] Test email sending
- [ ] Check admin panel access
- [ ] Verify SSL certificates
- [ ] Test API endpoints
- [ ] Check error tracking (Sentry)
- [ ] Review logs
- [ ] Monitor performance

### Update DNS

- Point domain to server IP
- Wait for DNS propagation (24-48 hours)
- Verify with: `nslookup api.tulumbak.com`

---

## Troubleshooting

### 502 Bad Gateway

- Check backend is running: `pm2 list`
- Check backend logs: `pm2 logs tulumbak-backend`
- Verify Nginx configuration: `sudo nginx -t`
- Check firewall: `sudo ufw status`

### Database Connection Failed

- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Verify database user permissions
- Check network/firewall rules

### High Memory Usage

- Check PM2 processes: `pm2 monit`
- Review application logs for memory leaks
- Restart application: `pm2 restart tulumbak-backend`
- Consider scaling up server resources

---

**For development setup, see**: [Getting Started](./Getting-Started.md)
**For coding standards, see**: [Coding Standards](./Coding-Standards.md)
**For Git workflow, see**: [Git Workflow](./Git-Workflow.md)
