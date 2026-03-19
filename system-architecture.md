# 🏛 System Architecture - Kiến Trúc Hệ Thống

## Tổng Quan

Document này mô tả chi tiết kiến trúc tổng thể của hệ thống web kinh doanh thời trang tích hợp AI Stylist, bao gồm các pattern, công nghệ và quyết định thiết kế quan trọng.

---

## 📐 Architecture Pattern

### Layered Architecture (3-Tier)

```
┌─────────────────────────────────────────────────┐
│          PRESENTATION LAYER                     │
│  ┌────────────────────────────────────────┐     │
│  │     React/Vue.js Web Application       │     │
│  │  - Components                          │     │
│  │  - Pages                               │     │
│  │  - State Management                    │     │
│  └────────────────────────────────────────┘     │
└──────────────────┬──────────────────────────────┘
                   │ REST API
                   │ JSON/HTTP
┌──────────────────▼──────────────────────────────┐
│           BUSINESS LOGIC LAYER                  │
│  ┌────────────────────────────────────────┐     │
│  │      Spring Boot Application           │     │
│  │                                         │     │
│  │  ┌──────────────────────────────┐      │     │
│  │  │    Controllers               │      │     │
│  │  │  - AuthController            │      │     │
│  │  │  - ProductController         │      │     │
│  │  │  - OrderController           │      │     │
│  │  │  - AIStylistController       │      │     │
│  │  └──────────────────────────────┘      │     │
│  │                                         │     │
│  │  ┌──────────────────────────────┐      │     │
│  │  │    Services (Business Logic) │      │     │
│  │  │  - UserService               │      │     │
│  │  │  - ProductService            │      │     │
│  │  │  - OrderService              │      │     │
│  │  │  - AIStylistService          │      │     │
│  │  │  - PaymentService            │      │     │
│  │  └──────────────────────────────┘      │     │
│  │                                         │     │
│  │  ┌──────────────────────────────┐      │     │
│  │  │    Repositories (Data Access)│      │     │
│  │  │  - UserRepository            │      │     │
│  │  │  - ProductRepository         │      │     │
│  │  │  - OrderRepository           │      │     │
│  │  └──────────────────────────────┘      │     │
│  └────────────────────────────────────────┘     │
└──────────────────┬──────────────────────────────┘
                   │ JDBC/JPA
┌──────────────────▼──────────────────────────────┐
│             DATA LAYER                          │
│  ┌────────────────────────────────────────┐     │
│  │         MySQL Database                 │     │
│  │  - users, products, orders             │     │
│  │  - carts, payments                     │     │
│  └────────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

### Key Principles

#### 1. Separation of Concerns
- **Presentation** chỉ lo UI/UX
- **Business Logic** chứa toàn bộ logic nghiệp vụ
- **Data** chỉ lo lưu trữ và truy xuất dữ liệu

#### 2. Dependency Inversion
- Các layer phụ thuộc vào **interface**, không phụ thuộc concrete class
- Controller → Service (Interface) → Repository (Interface)

#### 3. Single Responsibility
- Mỗi class/module có một trách nhiệm duy nhất
- ProductService chỉ lo logic về Product

---

## 🎯 Design Patterns

### 1. MVC (Model-View-Controller)
```
Frontend (React/Vue):
View → User Interface
Controller → React Components với Hooks/Vuex Actions
Model → State Management (Redux/Vuex)

Backend (Spring Boot):
View → REST API Response (JSON)
Controller → @RestController
Model → Entity/DTO
```

### 2. Repository Pattern
```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByPriceBetween(Double min, Double max);
}

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
}
```

**Benefits:**
- Abstraction của data access logic
- Dễ test (mock repository)
- Có thể thay đổi database mà không ảnh hưởng service layer

### 3. Service Layer Pattern
```java
@Service
@Transactional
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductService productService;
    @Autowired private CartService cartService;
    @Autowired private PaymentService paymentService;
    
    public Order createOrder(OrderDTO dto) {
        // Complex business logic
        validateCart();
        checkStock();
        calculateTotal();
        createOrder();
        processPayment();
        sendEmail();
        return order;
    }
}
```

### 4. DTO (Data Transfer Object) Pattern
```java
// Entity - Internal representation
@Entity
public class User {
    private Long id;
    private String password; // Don't expose
    // ...
}

// DTO - External representation
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    // No password field
}
```

**Benefits:**
- Không expose internal structure
- Giảm network overhead
- Validation layer

### 5. Builder Pattern
```java
Order order = Order.builder()
    .user(user)
    .totalPrice(total)
    .status(OrderStatus.PENDING)
    .shippingAddress(address)
    .build();
```

### 6. Factory Pattern (AI Stylist)
```java
public interface AIProvider {
    OutfitSuggestion suggest(UserPreference preference);
}

public class AIProviderFactory {
    public static AIProvider getProvider(String type) {
        switch(type) {
            case "OPENAI": return new OpenAIProvider();
            case "CUSTOM": return new CustomAIProvider();
            default: throw new IllegalArgumentException();
        }
    }
}
```

### 7. Strategy Pattern (Payment)
```java
public interface PaymentStrategy {
    PaymentResult process(PaymentInfo info);
}

public class CODPaymentStrategy implements PaymentStrategy {
    public PaymentResult process(PaymentInfo info) {
        // COD logic
    }
}

public class OnlinePaymentStrategy implements PaymentStrategy {
    public PaymentResult process(PaymentInfo info) {
        // Online payment logic
    }
}
```

---

## 🔐 Security Architecture

### Authentication Flow (JWT)

```
┌──────┐                 ┌─────────┐                ┌──────────┐
│Client│                 │ Backend │                │ Database │
└──┬───┘                 └────┬────┘                └────┬─────┘
   │                          │                          │
   │ POST /api/auth/login     │                          │
   │ {email, password}        │                          │
   ├─────────────────────────>│                          │
   │                          │ SELECT * FROM users      │
   │                          │ WHERE email = ?          │
   │                          ├─────────────────────────>│
   │                          │                          │
   │                          │<─────────────────────────┤
   │                          │ User data                │
   │                          │                          │
   │                          │ Validate password        │
   │                          │ (BCrypt)                 │
   │                          │                          │
   │                          │ Generate JWT             │
   │                          │ - Header                 │
   │                          │ - Payload (userId, role) │
   │                          │ - Signature (Secret)     │
   │                          │                          │
   │<─────────────────────────┤                          │
   │ 200 OK                   │                          │
   │ {token, user}            │                          │
   │                          │                          │
   │ Store token in           │                          │
   │ localStorage             │                          │
   │                          │                          │
   │ GET /api/products        │                          │
   │ Header: Authorization:   │                          │
   │ Bearer <token>           │                          │
   ├─────────────────────────>│                          │
   │                          │ Validate JWT             │
   │                          │ - Verify signature       │
   │                          │ - Check expiration       │
   │                          │ - Extract userId         │
   │                          │                          │
   │                          │ If valid:                │
   │                          │ Process request          │
   │                          │                          │
   │<─────────────────────────┤                          │
   │ 200 OK                   │                          │
   │ {products}               │                          │
```

### JWT Structure
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user123",
  "email": "user@example.com",
  "role": "CUSTOMER",
  "iat": 1677904800,
  "exp": 1677991200
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Authorization (RBAC)
```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO dto) {
        // Only ADMIN can access
    }
}
```

### Security Filters Chain
```
Request → CORS Filter
       → JWT Authentication Filter
       → Authorization Filter
       → Rate Limiting Filter
       → Controller
```

---

## 🚀 API Design

### RESTful API Principles

#### 1. Resource Naming
```
✅ Good:
GET    /api/products          - List all products
GET    /api/products/{id}     - Get product by ID
POST   /api/products          - Create product
PUT    /api/products/{id}     - Update product
DELETE /api/products/{id}     - Delete product

❌ Bad:
GET /api/getProducts
POST /api/createProduct
GET /api/product_detail?id=123
```

#### 2. HTTP Methods
| Method | Usage | Idempotent | Safe |
|--------|-------|------------|------|
| GET | Read | ✅ | ✅ |
| POST | Create | ❌ | ❌ |
| PUT | Update (full) | ✅ | ❌ |
| PATCH | Update (partial) | ❌ | ❌ |
| DELETE | Delete | ✅ | ❌ |

#### 3. Status Codes
```
200 OK              - Successful GET, PUT, PATCH
201 Created         - Successful POST
204 No Content      - Successful DELETE
400 Bad Request     - Invalid input
401 Unauthorized    - Not authenticated
403 Forbidden       - Not authorized
404 Not Found       - Resource not found
409 Conflict        - Duplicate resource
422 Unprocessable   - Validation error
500 Internal Error  - Server error
```

#### 4. Response Format
```json
Success Response:
{
  "status": "success",
  "data": {
    "id": 123,
    "name": "Product Name"
  },
  "message": "Product created successfully"
}

Error Response:
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}

Pagination Response:
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 10,
    "totalItems": 200
  }
}
```

### API Endpoints Reference

#### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login
POST   /api/auth/logout        - Logout
POST   /api/auth/refresh       - Refresh token
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password
```

#### Products
```
GET    /api/products                    - List products
GET    /api/products/{id}               - Get product
GET    /api/products/search?q={keyword} - Search
GET    /api/products/filter?category=... - Filter
POST   /api/admin/products              - Create (Admin)
PUT    /api/admin/products/{id}         - Update (Admin)
DELETE /api/admin/products/{id}         - Delete (Admin)
```

#### Cart
```
GET    /api/cart                 - Get user cart
POST   /api/cart/add             - Add item
PUT    /api/cart/items/{id}      - Update quantity
DELETE /api/cart/items/{id}      - Remove item
DELETE /api/cart                 - Clear cart
```

#### Orders
```
POST   /api/orders/checkout      - Create order
GET    /api/orders               - Get order history
GET    /api/orders/{id}          - Get order detail
PUT    /api/orders/{id}/cancel   - Cancel order
GET    /api/admin/orders         - List all orders (Admin)
PUT    /api/admin/orders/{id}/status - Update status (Admin)
```

#### AI Stylist
```
POST   /api/ai/suggest-outfit    - Get AI suggestion
```

---

## 💾 Database Design

### Schema Overview
```sql
-- Users & Authentication
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    role_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Products
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE
);

CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50),
    style_tag VARCHAR(50),
    stock INT DEFAULT 0,
    image_url VARCHAR(500),
    category_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_price (price),
    INDEX idx_style (style_tag)
);

-- Shopping Cart
CREATE TABLE carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_cart_product (cart_id, product_id)
);

-- Orders
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL, -- PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    shipping_address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_date)
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL UNIQUE,
    method VARCHAR(50) NOT NULL, -- COD, VNPAY, MOMO, CREDIT_CARD
    status VARCHAR(20) NOT NULL, -- PENDING, COMPLETED, FAILED, REFUNDED
    transaction_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### Indexing Strategy
```sql
-- Frequently queried columns
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_style ON products(style_tag);
CREATE INDEX idx_products_compound ON products(category_id, price, is_active);

-- Search optimization
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);

-- Order queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_date ON orders(created_date DESC);
```

### Database Optimization

#### 1. Query Optimization
```java
// ❌ N+1 Query Problem
List<Order> orders = orderRepository.findAll();
for (Order order : orders) {
    order.getUser().getName(); // N additional queries
}

// ✅ Solution: Fetch Join
@Query("SELECT o FROM Order o JOIN FETCH o.user")
List<Order> findAllWithUser();
```

#### 2. Pagination
```java
// Large dataset handling
Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
Page<Product> products = productRepository.findAll(pageable);
```

#### 3. Caching
```java
@Cacheable(value = "products", key = "#id")
public Product getProductById(Long id) {
    return productRepository.findById(id);
}

@CacheEvict(value = "products", key = "#id")
public void updateProduct(Long id, ProductDTO dto) {
    // Update logic
}
```

---

## ⚡ Performance Optimization

### 1. Frontend Optimization
```javascript
// Code splitting
const AIStylist = lazy(() => import('./pages/AIStylist'));

// Memoization
const ProductCard = memo(({ product }) => {
    // Component logic
});

// Debouncing search
const debouncedSearch = debounce((keyword) => {
    searchProducts(keyword);
}, 300);

// Image lazy loading
<img src={product.image} loading="lazy" alt={product.name} />
```

### 2. Backend Optimization
```java
// Async processing
@Async
public CompletableFuture<OutfitSuggestion> getSuggestion(UserPreference pref) {
    // AI call
}

// Batch operations
@Transactional
public void updateProductStocks(List<StockUpdate> updates) {
    productRepository.saveAll(updates);
}

// Connection pooling (application.yml)
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
```

### 3. Caching Layers
```
┌──────────────────┐
│  Browser Cache   │ (Static assets)
└────────┬─────────┘
         │
┌────────▼─────────┐
│   CDN Cache      │ (Images, CSS, JS)
└────────┬─────────┘
         │
┌────────▼─────────┐
│  Redis Cache     │ (API responses, sessions)
└────────┬─────────┘
         │
┌────────▼─────────┐
│  Database        │
└──────────────────┘
```

### 4. Database Query Cache
```java
@Cacheable("products")
public List<Product> getAllProducts() {
    return productRepository.findAll();
}

@CacheEvict(value = "products", allEntries = true)
public Product createProduct(Product product) {
    return productRepository.save(product);
}
```

---

## 🧪 Testing Strategy

### Test Pyramid
```
        /\
       /  \       E2E Tests (5%)
      /────\      - Selenium, Cypress
     /      \
    /────────\    Integration Tests (20%)
   /          \   - Spring Boot Test, TestContainers
  /────────────\
 /              \  Unit Tests (75%)
/________________\ - JUnit, Mockito, Jest
```

### Backend Testing
```java
// Unit Test
@Test
void testCreateOrder() {
    // Arrange
    when(cartService.getCart(userId)).thenReturn(cart);
    
    // Act
    Order result = orderService.createOrder(orderDTO);
    
    // Assert
    assertNotNull(result);
    assertEquals(OrderStatus.PENDING, result.getStatus());
}

// Integration Test
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testCheckout() throws Exception {
        mockMvc.perform(post("/api/orders/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isCreated());
    }
}
```

### Frontend Testing
```javascript
// Component Test (React Testing Library)
test('renders product card', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
});

// E2E Test (Cypress)
describe('Checkout Flow', () => {
    it('should complete checkout', () => {
        cy.visit('/products');
        cy.get('[data-testid="add-to-cart"]').first().click();
        cy.get('[data-testid="checkout-button"]').click();
        cy.get('[data-testid="confirm-order"]').click();
        cy.contains('Order placed successfully');
    });
});
```

---

## 📊 Monitoring & Logging

### Logging Levels
```
ERROR - Lỗi nghiêm trọng
WARN  - Cảnh báo
INFO  - Thông tin quan trọng
DEBUG - Thông tin chi tiết (dev)
TRACE - Thông tin rất chi tiết (dev)
```

### Structured Logging
```java
@Slf4j
@Service
public class OrderService {
    public Order createOrder(OrderDTO dto) {
        log.info("Creating order for user: {}", dto.getUserId());
        
        try {
            // Logic
            log.info("Order created successfully: {}", order.getId());
            return order;
        } catch (Exception e) {
            log.error("Failed to create order", e);
            throw e;
        }
    }
}
```

### Metrics
```
- Response time (avg, p95, p99)
- Request rate (req/sec)
- Error rate (%)
- Database query time
- Cache hit rate (%)
- Memory usage
- CPU usage
```

---

## 🎯 Future Enhancements

### Phase 1 (Current)
- ✅ Core e-commerce features
- ✅ AI Stylist integration
- ✅ Basic admin panel

### Phase 2
- 📱 Mobile app (React Native/Flutter)
- 🔍 Advanced search with Elasticsearch
- ⭐ Product reviews & ratings
- 💝 Wishlist feature
- 🎁 Discount coupons

### Phase 3
- 🤖 Chatbot customer support
- 📊 Advanced analytics dashboard
- 🌍 Multi-language support
- 💱 Multi-currency support
- 📦 Order tracking with real-time updates

### Phase 4
- 🎨 Virtual try-on (AR/VR)
- 🔮 Personalized recommendations (ML)
- 📱 Progressive Web App (PWA)
- 🔗 Social media integration
- 📈 Advanced inventory management

---

## 📝 Conclusion

Hệ thống được thiết kế với kiến trúc:
- **Scalable**: Dễ mở rộng theo chiều ngang
- **Maintainable**: Code sạch, tách biệt rõ ràng
- **Secure**: Authentication, Authorization, Encryption
- **Performant**: Caching, Indexing, Optimization
- **Testable**: Unit tests, Integration tests

Điểm nổi bật: **Tích hợp AI Stylist** để tạo trải nghiệm mua sắm độc đáo và cá nhân hóa.

---

**[⬅️ Component & Deployment Diagram](component-deployment-diagram.md)** | **[🏠 Quay về README](README.md)**
