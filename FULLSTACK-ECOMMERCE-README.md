# Luxury E-Commerce Fullstack System

A complete fullstack luxury e-commerce application with a premium glassmorphism UI, featuring user authentication, product management, shopping cart, and checkout functionality.

## 🏗️ Architecture

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: JWT Authentication
- **Architecture**: Clean Architecture (Controller → Service → Repository → Entity)

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + Glassmorphism
- **Animations**: Framer Motion
- **HTTP Client**: Axios

---

## 📋 Features

### Backend Features
- ✅ RESTful API endpoints
- ✅ JWT-based authentication
- ✅ Role-based access control (USER / ADMIN)
- ✅ Product management (CRUD operations)
- ✅ Order management
- ✅ User registration and login
- ✅ Premium product filtering
- ✅ Secure password encryption (BCrypt)

### Frontend Features
- ✅ Responsive luxury UI with glassmorphism effects
- ✅ User authentication (Login/Register)
- ✅ Product browsing and filtering
- ✅ Product detail pages
- ✅ Shopping cart functionality
- ✅ Checkout process
- ✅ Premium product showcase
- ✅ Real-time cart updates
- ✅ Protected routes

---

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE luxury_ecommerce;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/luxury_ecommerce
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. The database schema will be automatically created by Hibernate. Alternatively, you can run the SQL script:
```bash
psql -U your_username -d luxury_ecommerce -f backend/src/main/resources/schema.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the project root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/premium` - Get premium products only
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?keyword={keyword}` - Search products
- `POST /api/products` - Create product (ADMIN only)
- `PUT /api/products/{id}` - Update product (ADMIN only)
- `DELETE /api/products/{id}` - Delete product (ADMIN only)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/user/{userId}` - Get user orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders` - Get all orders (ADMIN only)
- `PUT /api/orders/{id}/status?status={status}` - Update order status (ADMIN only)

---

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication.

### Login Flow:
1. User sends credentials to `/api/auth/login`
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for protected routes

### Example Request:
```javascript
// Login
const response = await axios.post('http://localhost:8080/api/auth/login', {
  username: 'admin',
  password: 'admin123'
});

// Store token
localStorage.setItem('token', response.data.data.token);

// Use token in requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    is_premium BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders & Order Items
See `backend/src/main/resources/schema.sql` for complete schema.

---

## 👥 Default Users

### Admin Account
- Username: `admin`
- Password: `admin123`
- Role: ADMIN

### User Account
- Username: `johndoe`
- Password: `user123`
- Role: USER

---

## 🎨 UI Components

### Glassmorphism Style
The application uses a modern glassmorphism design with:
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle shadows and borders
- Gold accent colors (#d4af37)
- Dark theme (luxury-black, luxury-gray)

### Key Components
- **Navbar**: Fixed navigation with cart count
- **Hero**: Animated hero section
- **ProductCard**: Glassmorphic product cards with hover effects
- **Cart**: Shopping cart with quantity controls
- **Checkout**: Multi-step checkout form

---

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/luxury_ecommerce
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration (`src/services/api.js`)
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 📦 Project Structure

```
.
├── backend/
│   ├── src/main/java/com/luxury/ecommerce/
│   │   ├── config/          # Security, CORS configuration
│   │   ├── controller/      # REST Controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities
│   │   ├── repository/      # JPA Repositories
│   │   ├── security/        # JWT Utils, Filters
│   │   ├── service/         # Business Logic
│   │   └── LuxuryEcommerceApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── schema.sql
│   └── pom.xml
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context (Auth, Cart)
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── App.jsx              # Main app with routing
│   └── main.jsx             # Entry point
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🛠️ Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development
```bash
npm run dev
```

### Build for Production

Backend:
```bash
cd backend
mvn clean package
java -jar target/ecommerce-1.0.0.jar
```

Frontend:
```bash
npm run build
npm run preview
```

---

## 🧪 Testing

### Test API Endpoints

Using curl:
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get Products
curl http://localhost:8080/api/products

# Get Premium Products
curl http://localhost:8080/api/products/premium
```

---

## 🚢 Deployment

### Backend Deployment
1. Package the application:
```bash
mvn clean package
```

2. Deploy JAR file to your server
3. Configure PostgreSQL connection
4. Run: `java -jar ecommerce-1.0.0.jar`

### Frontend Deployment
1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Your own web server

3. Update API_BASE_URL to point to your backend server

---

## 🔒 Security Features

- Password encryption using BCrypt
- JWT token-based authentication
- Role-based access control
- CORS configuration
- Input validation
- SQL injection prevention (JPA)
- XSS prevention (React escaping)

---

## 📝 License

This project is for educational purposes.

---

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Spring Boot, React, and PostgreSQL**
