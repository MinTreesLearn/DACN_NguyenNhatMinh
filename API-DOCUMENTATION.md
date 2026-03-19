# API Documentation

## Base URL
```
http://localhost:8080/api
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Username already exists"
}
```

---

### Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "admin",
    "email": "admin@luxury.com",
    "role": "ADMIN"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Invalid username or password"
}
```

---

## Product Endpoints

### Get All Products
Retrieve all products from the database.

**Endpoint:** `GET /products`

**Headers:** None (Public endpoint)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Diamond Essence Watch",
      "description": "Exquisite timepiece crafted with precision and adorned with carefully selected diamonds",
      "price": 12500.00,
      "imageUrl": "https://images.unsplash.com/photo-...",
      "category": "Timepieces",
      "isPremium": true,
      "stockQuantity": 5,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

---

### Get Premium Products
Retrieve only premium products.

**Endpoint:** `GET /products/premium`

**Headers:** None (Public endpoint)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Diamond Essence Watch",
      "price": 12500.00,
      "isPremium": true,
      ...
    }
  ]
}
```

---

### Get Product by ID
Retrieve a specific product.

**Endpoint:** `GET /products/{id}`

**Parameters:**
- `id` (path): Product ID

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Diamond Essence Watch",
    "description": "Exquisite timepiece...",
    "price": 12500.00,
    "imageUrl": "https://...",
    "category": "Timepieces",
    "isPremium": true,
    "stockQuantity": 5
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Product not found with id: 999"
}
```

---

### Get Products by Category
Retrieve products from a specific category.

**Endpoint:** `GET /products/category/{category}`

**Parameters:**
- `category` (path): Category name (e.g., "Timepieces", "Jewelry", "Accessories")

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Diamond Essence Watch",
      "category": "Timepieces",
      ...
    }
  ]
}
```

---

### Search Products
Search products by keyword in name.

**Endpoint:** `GET /products/search?keyword={keyword}`

**Query Parameters:**
- `keyword`: Search term

**Example:** `GET /products/search?keyword=watch`

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Diamond Essence Watch",
      ...
    }
  ]
}
```

---

### Create Product (ADMIN Only)
Create a new product.

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "Platinum Ring",
  "description": "Elegant platinum ring with diamonds",
  "price": 5000.00,
  "imageUrl": "https://...",
  "category": "Jewelry",
  "isPremium": true,
  "stockQuantity": 10
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": 9,
    "name": "Platinum Ring",
    ...
  }
}
```

---

### Update Product (ADMIN Only)
Update an existing product.

**Endpoint:** `PUT /products/{id}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 6000.00,
  ...
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Product Name",
    ...
  }
}
```

---

### Delete Product (ADMIN Only)
Delete a product.

**Endpoint:** `DELETE /products/{id}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": null
}
```

---

## Order Endpoints

### Create Order
Create a new order with multiple items.

**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main St, New York, NY 10001",
  "paymentMethod": "credit_card",
  "totalAmount": 28200.00
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "username": "johndoe"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Diamond Essence Watch"
        },
        "quantity": 2,
        "price": 12500.00
      }
    ],
    "totalAmount": 28200.00,
    "status": "PENDING",
    "shippingAddress": "123 Main St...",
    "paymentMethod": "credit_card",
    "createdAt": "2024-01-15T14:30:00"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Insufficient stock for product: Diamond Essence Watch"
}
```

---

### Get User Orders
Retrieve all orders for a specific user.

**Endpoint:** `GET /orders/user/{userId}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "totalAmount": 28200.00,
      "status": "PENDING",
      "createdAt": "2024-01-15T14:30:00"
    }
  ]
}
```

---

### Get Order by ID
Retrieve a specific order.

**Endpoint:** `GET /orders/{id}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "user": {...},
    "items": [...],
    "totalAmount": 28200.00,
    "status": "PENDING"
  }
}
```

---

### Get All Orders (ADMIN Only)
Retrieve all orders in the system.

**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "user": {...},
      "totalAmount": 28200.00,
      "status": "PENDING"
    }
  ]
}
```

---

### Update Order Status (ADMIN Only)
Update the status of an order.

**Endpoint:** `PUT /orders/{id}/status?status={status}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `status`: New status (e.g., "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED")

**Example:** `PUT /orders/1/status?status=SHIPPED`

**Response (200):**
```json
{
  "status": "success",
  "message": "Order status updated",
  "data": {
    "id": 1,
    "status": "SHIPPED",
    ...
  }
}
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration:** 24 hours (86400000 ms)

**How to get a token:**
1. Register a new user or login with existing credentials
2. Extract the `token` from the response
3. Include it in the Authorization header for subsequent requests

---

## Rate Limiting

Currently, there are no rate limits. In production, consider implementing rate limiting to prevent abuse.

---

## CORS

The API allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)

Update `cors.allowed-origins` in `application.properties` for production.
