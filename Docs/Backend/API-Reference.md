# Backend API Reference

**Last Updated**: 2025-11-13

Complete API endpoint documentation for Tulumbak E-Commerce Platform.

## Base URL

```
Development: http://localhost:4001
Production: https://your-domain.com
```

## Authentication

Most admin endpoints require JWT authentication. Include the token in the request header:

```http
Authorization: Bearer <your_jwt_token>
```

### Authentication Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Admin routes | JWT Bearer token |
| `token` | User routes | User authentication token |

## API Endpoints Overview

| Category | Base Path | Description |
|----------|-----------|-------------|
| User | `/api/user` | User authentication and management |
| Product | `/api/product` | Product catalog operations |
| Order | `/api/order` | Order management |
| Cart | `/api/cart` | Shopping cart operations |
| Courier | `/api/courier` | Courier integration |
| Delivery | `/api/delivery` | Delivery management |
| Email | `/api/email` | Email system management |
| Settings | `/api/settings` | System settings |
| Admin | `/api/admin` | Admin operations |
| Media | `/api/media` | Media library |
| Reports | `/api/report` | Analytics and reports |

---

## User API

### POST `/api/user/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "securePassword123",
  "phone": "+905551234567"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com"
  }
}
```

### POST `/api/user/login`

User authentication.

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "role": "customer"
  }
}
```

### POST `/api/user/admin`

Admin authentication.

**Request Body:**
```json
{
  "email": "admin@tulumbak.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@tulumbak.com",
    "role": "admin"
  }
}
```

---

## Product API

### GET `/api/product/list`

Get all products with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category name
- `inStockOnly` (optional): Show only in-stock products (boolean)

**Response:**
```json
{
  "success": true,
  "productData": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Fıstıklı Baklava",
      "description": "Premium pistachio baklava",
      "price": 125,
      "category": "Baklava",
      "sizes": ["250g", "500g", "1000g"],
      "image": ["http://localhost:4001/uploads/baklava1.jpg"],
      "inStock": true,
      "createdAt": "2024-11-01T10:00:00.000Z"
    }
  ]
}
```

### POST `/api/product/single`

Get single product details.

**Request Body:**
```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Fıstıklı Baklava",
    "description": "Premium pistachio baklava made with authentic Turkish ingredients",
    "price": 125,
    "category": "Baklava",
    "sizes": ["250g", "500g", "1000g"],
    "image": [
      "http://localhost:4001/uploads/baklava1.jpg",
      "http://localhost:4001/uploads/baklava2.jpg"
    ],
    "inStock": true,
    "stockCount": 45,
    "ingredients": ["Fıstık", "Un", "Tereyağı", "Şeker"],
    "createdAt": "2024-11-01T10:00:00.000Z"
  }
}
```

### POST `/api/product/add` 🔒 Admin

Add a new product.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `category`: Category name
- `sizes`: JSON array of available sizes
- `inStock`: Boolean
- `stockCount`: Number
- `image1`, `image2`, `image3`, `image4`: Image files

**Response:**
```json
{
  "success": true,
  "message": "Product added successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Fıstıklı Baklava",
    "price": 125
  }
}
```

### POST `/api/product/update` 🔒 Admin

Update existing product.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `id`: Product ID (required)
- Other fields same as add

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

### POST `/api/product/remove` 🔒 Admin

Delete a product.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product removed successfully"
}
```

---

## Order API

### POST `/api/order/place` 🔐 User

Place a new order.

**Headers:**
```
token: <user_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "size": "500g",
      "quantity": 2,
      "price": 125
    }
  ],
  "amount": 275,
  "address": {
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "street": "Atatürk Caddesi No:123",
    "city": "İzmir",
    "district": "Konak",
    "zipCode": "35000",
    "phone": "+905551234567"
  },
  "deliveryDate": "2024-11-15",
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-1699707600000-ABC123",
  "message": "Order placed successfully"
}
```

### POST `/api/order/list` 🔒 Admin

Get all orders with filtering.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "page": 1,
  "limit": 20,
  "status": "pending",
  "startDate": "2024-11-01",
  "endDate": "2024-11-13"
}
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderId": "ORD-1699707600000-ABC123",
      "userId": "507f1f77bcf86cd799439012",
      "items": [...],
      "amount": 275,
      "status": "pending",
      "paymentStatus": "paid",
      "deliveryDate": "2024-11-15",
      "createdAt": "2024-11-13T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

### POST `/api/order/status` 🔒 Admin

Update order status.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "preparing"
}
```

**Status Values:**
- `pending`: Order received, awaiting processing
- `preparing`: Order being prepared
- `ready`: Order ready for delivery
- `assigned`: Courier assigned
- `in_transit`: Out for delivery
- `delivered`: Successfully delivered
- `cancelled`: Order cancelled

**Response:**
```json
{
  "success": true,
  "message": "Order status updated to preparing"
}
```

### POST `/api/order/assign-branch` 🔒 Admin

Assign branch to order.

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "branchId": "507f1f77bcf86cd799439013"
}
```

### POST `/api/order/send-to-courier` 🔒 Admin

Send order to courier service.

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order sent to courier",
  "trackingNumber": "TRK-1699707600000"
}
```

### GET `/api/order/:orderId/status`

Get order status (public endpoint).

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-1699707600000-ABC123",
  "status": "in_transit",
  "currentLocation": "Konak Distribution Center",
  "estimatedDelivery": "2024-11-15T14:00:00.000Z"
}
```

### POST `/api/order/userorders` 🔐 User

Get user's order history.

**Headers:**
```
token: <user_token>
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderId": "ORD-1699707600000-ABC123",
      "items": [...],
      "amount": 275,
      "status": "delivered",
      "deliveryDate": "2024-11-10",
      "createdAt": "2024-11-08T10:00:00.000Z"
    }
  ]
}
```

---

## Email API

### GET `/api/email/settings`

Get email configuration settings.

**Response:**
```json
{
  "success": true,
  "settings": {
    "general": {
      "enabled": true,
      "fromName": "Tulumbak Baklava",
      "fromEmail": "noreply@tulumbak.com"
    },
    "smtp": {
      "enabled": true,
      "host": "smtp.gmail.com",
      "port": 587,
      "user": "your@gmail.com"
    },
    "branding": {
      "logoType": "url",
      "logoUrl": "https://res.cloudinary.com/tulumbak/image/upload/logo.png"
    },
    "notifications": {
      "orderConfirmation": true,
      "orderStatusUpdate": true
    }
  }
}
```

### PUT `/api/email/settings`

Update email settings.

**Request Body:**
```json
{
  "general": {
    "enabled": true,
    "fromName": "Tulumbak Baklava",
    "fromEmail": "noreply@tulumbak.com"
  },
  "smtp": {
    "enabled": true,
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "your@gmail.com",
    "password": "your_app_password"
  }
}
```

### POST `/api/email/settings/test`

Test SMTP configuration.

**Request Body:**
```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "user": "your@gmail.com",
  "password": "your_app_password",
  "testEmail": "test@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

### POST `/api/email/settings/test-template`

Test React Email template.

**Request Body:**
```json
{
  "templateType": "order-confirmation",
  "testEmail": "test@example.com"
}
```

### GET `/api/email/logs`

Get email logs with filtering.

**Query Parameters:**
- `trigger`: Filter by trigger type
- `status`: Filter by status (sent/failed)
- `to`: Filter by recipient email
- `startDate`: Start date filter
- `endDate`: End date filter
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "trigger": "order-confirmation",
      "to": "customer@example.com",
      "subject": "Order Confirmation - ORD-1699707600000",
      "status": "sent",
      "sentAt": "2024-11-13T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 256,
    "pages": 6
  }
}
```

### GET `/api/email/logs/stats/overview`

Get email statistics.

**Query Parameters:**
- `startDate`: Start date filter
- `endDate`: End date filter

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 1250,
    "byStatus": [
      { "_id": "sent", "count": 1180 },
      { "_id": "failed", "count": 70 }
    ],
    "byTrigger": [
      { "_id": "order-confirmation", "count": 650 },
      { "_id": "order-status-update", "count": 400 },
      { "_id": "delivery-notification", "count": 200 }
    ]
  }
}
```

---

## Courier API

### POST `/api/courier/assign` 🔒 Admin

Manually assign courier to order.

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "courierId": "507f1f77bcf86cd799439014"
}
```

### GET `/api/courier/tracking/:trackingNumber`

Get courier tracking information.

**Response:**
```json
{
  "success": true,
  "tracking": {
    "trackingNumber": "TRK-1699707600000",
    "status": "in_transit",
    "currentLocation": "Konak Distribution Center",
    "estimatedDelivery": "2024-11-15T14:00:00.000Z",
    "history": [
      {
        "status": "picked_up",
        "location": "Tulumbak Baklava - Alsancak",
        "timestamp": "2024-11-13T10:00:00.000Z"
      },
      {
        "status": "in_transit",
        "location": "Konak Distribution Center",
        "timestamp": "2024-11-13T11:30:00.000Z"
      }
    ]
  }
}
```

---

## Settings API

### GET `/api/settings`

Get system-wide settings.

**Response:**
```json
{
  "success": true,
  "settings": {
    "storeName": "Tulumbak Baklava",
    "storeDescription": "Premium Turkish Baklava",
    "currency": "TRY",
    "timezone": "Europe/Istanbul",
    "maintenanceMode": false,
    "deliveryFee": 25,
    "freeDeliveryThreshold": 200
  }
}
```

### PUT `/api/settings` 🔒 Admin

Update system settings.

**Request Body:**
```json
{
  "storeName": "Tulumbak Baklava",
  "deliveryFee": 30,
  "freeDeliveryThreshold": 250
}
```

---

## Cart API

### GET `/api/cart` 🔐 User

Get user's cart.

**Headers:**
```
token: <user_token>
```

### POST `/api/cart/add` 🔐 User

Add item to cart.

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "size": "500g",
  "quantity": 2
}
```

### POST `/api/cart/update` 🔐 User

Update cart item quantity.

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439015",
  "quantity": 3
}
```

### POST `/api/cart/remove` 🔐 User

Remove item from cart.

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439015"
}
```

---

## Media API

### GET `/api/media/list` 🔒 Admin

Get all media files.

**Query Parameters:**
- `category`: Filter by category
- `page`: Page number
- `limit`: Items per page

### POST `/api/media/upload` 🔒 Admin

Upload media file.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Media file
- `category`: Media category
- `alt`: Alt text for image

---

## Reports API

### GET `/api/report/sales` 🔒 Admin

Get sales report.

**Query Parameters:**
- `startDate`: Start date
- `endDate`: End date
- `groupBy`: day | week | month

**Response:**
```json
{
  "success": true,
  "report": {
    "totalSales": 45780,
    "totalOrders": 156,
    "averageOrderValue": 293.46,
    "data": [
      {
        "date": "2024-11-13",
        "sales": 3450,
        "orders": 12
      }
    ]
  }
}
```

### GET `/api/report/products` 🔒 Admin

Get product performance report.

**Response:**
```json
{
  "success": true,
  "report": {
    "topProducts": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "name": "Fıstıklı Baklava",
        "unitsSold": 245,
        "revenue": 30625
      }
    ]
  }
}
```

---

## Rate Limiting

API rate limits per endpoint category:

| Category | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Order Placement | 5 requests | 15 minutes |
| File Upload | 10 requests | 15 minutes |
| Authentication | 5 requests | 15 minutes |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699708500000
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Example Error Response

```json
{
  "success": false,
  "message": "Product not found",
  "code": "NOT_FOUND",
  "status": 404
}
```

---

## Swagger Documentation

Interactive API documentation available at:

```
http://localhost:4001/api-docs
```

Swagger UI provides:
- Interactive API testing
- Request/response schemas
- Authentication testing
- Example requests

---

## Real-time Notifications (SSE)

Real-time updates via Server-Sent Events:

### SSE Stream Endpoint

**GET** `/api/notifications/stream` 🔒 Admin

Establishes a Server-Sent Events connection for real-time admin notifications.

**Query Parameters:**
```
token=<admin_jwt_token>
```

**Headers:**
```http
Accept: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Response Format:**
```
event: NEW_ORDER
data: {"order": {...}, "title": "Yeni Sipariş", "message": "Sipariş #12345 alındı"}

event: ORDER_STATUS_CHANGED
data: {"order": {...}, "title": "Durum Güncellendi", "message": "Sipariş durumu değişti"}

event: COURIER_ASSIGNED
data: {"order": {...}, "title": "Kurye Atandı", "message": "Sipariş kuryeye verildi"}

event: TEST_NOTIFICATION
data: {"title": "Test", "message": "Test bildirimi"}
```

### Event Types

| Event Type | Description | Payload |
|------------|-------------|---------|
| `NEW_ORDER` | New order placed | `{ order, title, message }` |
| `ORDER_STATUS_CHANGED` | Order status updated | `{ order, title, message }` |
| `COURIER_ASSIGNED` | Courier assigned to order | `{ order, title, message }` |
| `TEST_NOTIFICATION` | Test notification | `{ title, message }` |

### Client Implementation Example

```javascript
const token = localStorage.getItem('adminToken')
const sseUrl = `${apiUrl}/api/notifications/stream?token=${token}`
const eventSource = new EventSource(sseUrl)

eventSource.addEventListener('NEW_ORDER', (event) => {
  const data = JSON.parse(event.data)
  console.log('New order received:', data.order)
  // Trigger browser notification
  showNotification(data.title, { body: data.message })
})

eventSource.addEventListener('ORDER_STATUS_CHANGED', (event) => {
  const data = JSON.parse(event.data)
  console.log('Order status changed:', data.order)
})

eventSource.onerror = (error) => {
  console.error('SSE connection error:', error)
  // Implement reconnection with exponential backoff
}
```

### Connection Management

- **Authentication**: Requires valid admin JWT token in query parameter
- **Keep-Alive**: Server sends heartbeat every 30 seconds
- **Reconnection**: Client should implement exponential backoff (2s → 4s → 8s → 16s → 30s max)
- **Error Handling**: Connection closes on authentication failure or server error
- **Multiple Clients**: Each admin user maintains separate SSE connection

📖 **For detailed notification system documentation, see**: [Admin Panel Notifications](../Admin-Panel/Notifications.md)

---

## WebSocket Events

Real-time updates via Socket.IO:

### Order Status Updates

```javascript
socket.on('order:status:update', (data) => {
  console.log('Order status changed:', data);
  // { orderId, status, timestamp }
});
```

### Courier Location Updates

```javascript
socket.on('courier:location:update', (data) => {
  console.log('Courier location:', data);
  // { trackingNumber, lat, lng, timestamp }
});
```

---

## Pagination

Standard pagination format for list endpoints:

**Request:**
```json
{
  "page": 1,
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

---

## Best Practices

1. **Always validate input** on the client side before sending requests
2. **Handle rate limiting** gracefully with retry logic
3. **Store JWT tokens securely** (httpOnly cookies recommended)
4. **Use HTTPS** in production environments
5. **Implement request timeouts** (recommended: 30 seconds)
6. **Log failed requests** for debugging
7. **Cache frequently accessed data** on the client
8. **Use pagination** for large data sets

---

**For detailed service layer documentation, see**: [Services Documentation](./Services.md)
**For database schema details, see**: [Database Schema](./Database-Schema.md)
**For authentication details, see**: [Authentication Documentation](./Authentication.md)
