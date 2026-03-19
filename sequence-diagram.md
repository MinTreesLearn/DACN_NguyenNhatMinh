# 🔄 Sequence Diagram - Sơ Đồ Tuần Tự

## Tổng Quan

Sequence Diagram mô tả luồng xử lý và tương tác giữa các đối tượng theo trình tự thời gian.

## 📋 Danh Sách Sequence Diagrams

1. [🔐 User Login](#1-user-login)
2. [👤 User Registration](#2-user-registration)
3. [🛒 Add Product to Cart](#3-add-product-to-cart)
4. [💳 Checkout & Payment](#4-checkout--payment)
5. [🤖 AI Stylist Suggestion](#5-ai-stylist-suggestion) ⭐
6. [📦 Admin Manage Product](#6-admin-manage-product)

---

## 1️⃣ User Login

### Mô tả
Luồng đăng nhập của người dùng vào hệ thống.

### Actors
- Customer/Admin
- Web UI
- Backend API
- Database

### PlantUML Code
```plantuml
@startuml

actor User
participant "Web UI" as UI
participant "AuthController" as Auth
participant "UserService" as Service
participant "Database" as DB

User -> UI : Nhập email, password
UI -> Auth : POST /api/auth/login
Auth -> Service : login(email, password)
Service -> DB : findByEmail(email)
DB --> Service : User data

alt Password đúng
    Service -> Service : validatePassword()
    Service -> Service : generateJWT()
    Service --> Auth : JWT Token + User Info
    Auth --> UI : 200 OK + Token
    UI -> UI : Lưu token vào localStorage
    UI --> User : Redirect to Home
else Password sai
    Service --> Auth : 401 Unauthorized
    Auth --> UI : Error message
    UI --> User : Hiển thị lỗi
end

@enduml
```

### Steps
1. User nhập email và password
2. UI gửi POST request đến `/api/auth/login`
3. Backend tìm user theo email
4. Validate password (BCrypt)
5. Nếu đúng: Tạo JWT token và trả về
6. Nếu sai: Trả về 401 Unauthorized
7. UI lưu token và redirect đến trang chủ

---

## 2️⃣ User Registration

### Mô tả
Luồng đăng ký tài khoản mới.

### PlantUML Code
```plantuml
@startuml

actor User
participant "Web UI" as UI
participant "AuthController" as Auth
participant "UserService" as Service
participant "Database" as DB

User -> UI : Nhập thông tin đăng ký
UI -> UI : Validate input (client-side)
UI -> Auth : POST /api/auth/register

Auth -> Service : register(UserDTO)
Service -> DB : checkEmailExists(email)

alt Email đã tồn tại
    DB --> Service : exists = true
    Service --> Auth : 400 Bad Request
    Auth --> UI : "Email already exists"
    UI --> User : Hiển thị lỗi
else Email chưa tồn tại
    Service -> Service : encryptPassword()
    Service -> DB : save(User)
    DB --> Service : User saved
    Service -> Service : generateJWT()
    Service --> Auth : JWT Token + User
    Auth --> UI : 201 Created
    UI --> User : "Đăng ký thành công"
    UI --> User : Redirect to Home
end

@enduml
```

### Business Rules
- Email phải unique
- Password tối thiểu 8 ký tự
- Tự động login sau khi đăng ký thành công

---

## 3️⃣ Add Product to Cart

### Mô tả
Thêm sản phẩm vào giỏ hàng.

### PlantUML Code
```plantuml
@startuml

actor Customer
participant "Web UI" as UI
participant "CartController" as Cart
participant "CartService" as Service
participant "ProductService" as Product
participant "Database" as DB

Customer -> UI : Click "Add to Cart"
UI -> Cart : POST /api/cart/add
note right: {productId, quantity}

Cart -> Service : addToCart(userId, productId, quantity)
Service -> Product : checkStock(productId, quantity)
Product -> DB : getProduct(productId)
DB --> Product : Product data

alt Sản phẩm hết hàng
    Product --> Service : "Out of stock"
    Service --> Cart : 400 Bad Request
    Cart --> UI : Error message
    UI --> Customer : "Sản phẩm hết hàng"
else Còn hàng
    Service -> DB : getCart(userId)
    
    alt Item đã có trong cart
        Service -> DB : updateQuantity()
    else Item mới
        Service -> DB : addCartItem()
    end
    
    DB --> Service : Cart updated
    Service --> Cart : Cart DTO
    Cart --> UI : 200 OK + Cart data
    UI -> UI : Update cart icon (badge)
    UI --> Customer : "Đã thêm vào giỏ hàng"
end

@enduml
```

### Key Points
- Kiểm tra tồn kho trước khi thêm
- Nếu sản phẩm đã có trong cart → tăng quantity
- Update UI real-time (cart badge)

---

## 4️⃣ Checkout & Payment

### Mô tả
Luồng thanh toán đơn hàng (tích hợp Payment Gateway).

### PlantUML Code
```plantuml
@startuml

actor Customer
participant "Web UI" as UI
participant "OrderController" as Order
participant "OrderService" as Service
participant "PaymentGateway" as Payment
participant "Database" as DB

Customer -> UI : Click "Checkout"
UI -> UI : Hiển thị review order

Customer -> UI : Nhập thông tin giao hàng
Customer -> UI : Chọn phương thức thanh toán

UI -> Order : POST /api/orders/checkout
note right
  {
    items: [...],
    shippingAddress,
    phoneNumber,
    paymentMethod
  }
end note

Order -> Service : createOrder(orderDTO)

' Validate cart
Service -> DB : getCart(userId)
DB --> Service : Cart data
Service -> Service : validateCart()

alt Cart rỗng
    Service --> Order : 400 "Cart is empty"
    Order --> UI : Error
    UI --> Customer : "Giỏ hàng trống"
else Cart hợp lệ
    ' Create order
    Service -> DB : createOrder()
    Service -> DB : createOrderItems()
    Service -> DB : updateProductStock()
    DB --> Service : Order created
    
    ' Process payment
    Service -> Payment : processPayment(orderInfo)
    
    alt Online Payment
        Payment --> UI : redirect to payment page
        Customer -> Payment : Nhập thông tin thanh toán
        Payment -> Payment : Process payment
        
        alt Thanh toán thành công
            Payment -> Service : callback /api/payment/success
            Service -> DB : updateOrderStatus(PROCESSING)
            Service -> DB : updatePaymentStatus(COMPLETED)
            Payment --> Customer : Redirect to success page
        else Thanh toán thất bại
            Payment -> Service : callback /api/payment/failed
            Service -> DB : updateOrderStatus(CANCELLED)
            Service -> DB : revertStock()
            Payment --> Customer : Redirect to failed page
        end
        
    else COD (Cash on Delivery)
        Service -> DB : updateOrderStatus(PENDING)
        Service --> Order : Order created
        Order --> UI : Success
        UI --> Customer : "Đặt hàng thành công"
    end
    
    ' Send notification
    Service -> Service : sendEmailConfirmation()
    Service -> DB : clearCart(userId)
end

@enduml
```

### Steps
1. Customer review giỏ hàng
2. Nhập thông tin giao hàng
3. Chọn phương thức thanh toán
4. Backend tạo Order
5. Xử lý thanh toán qua Gateway (nếu online)
6. Cập nhật trạng thái Order & Payment
7. Gửi email xác nhận
8. Xóa giỏ hàng

---

## 5️⃣ AI Stylist Suggestion ⭐

### Mô tả
Luồng sử dụng AI để gợi ý phối đồ - Tính năng nổi bật của hệ thống.

### PlantUML Code
```plantuml
@startuml

actor Customer
participant "Web UI" as UI
participant "AIStylistController" as Controller
participant "AIStylistService" as Service
participant "AI API" as AI
participant "ProductService" as Product
participant "Database" as DB

Customer -> UI : Truy cập AI Stylist
UI --> Customer : Form nhập thông tin

Customer -> UI : Nhập thông tin
note right
  - Giới tính
  - Độ tuổi
  - Dịp sử dụng
  - Phong cách
  - Màu sắc yêu thích
end note

UI -> Controller : POST /api/ai/suggest-outfit
Controller -> Service : suggestOutfit(userPreference)

' Build prompt
Service -> Service : buildPrompt(userPreference)
note right
  "Gợi ý outfit cho:\n
  - Nam, 25 tuổi\n
  - Đi làm văn phòng\n
  - Style: Smart Casual\n
  - Màu: Xanh navy, Trắng"
end note

' Call AI API
Service -> AI : POST /v1/chat/completions
note right: Gửi prompt với format JSON mong muốn

AI -> AI : Process request
AI --> Service : JSON Response
note left
  {
    "top": "Áo sơ mi trắng",
    "bottom": "Quần tây xanh navy",
    "shoes": "Giày Derby đen",
    "accessories": "Dây nịt da, Đồng hồ",
    "reason": "Phối đồ smart casual..."
  }
end note

' Parse & Map
Service -> Service : parseResponse(jsonResponse)
Service -> Product : findSimilarProducts(suggestion)

Product -> DB : searchByStyleAndColor(...)
DB --> Product : List<Product>
Product --> Service : Matched products

' Build final response
Service -> Service : mapToOutfitDTO(suggestion, products)
Service --> Controller : OutfitSuggestionDTO

Controller --> UI : 200 OK + Outfit data
UI --> Customer : Hiển thị gợi ý outfit

Customer -> UI : Click vào sản phẩm
UI --> Customer : Redirect to Product Detail

@enduml
```

### Key Components

#### 1. Request DTO
```json
{
  "gender": "male",
  "age": 25,
  "occasion": "work",
  "preferredStyle": "smart-casual",
  "preferredColor": "navy, white"
}
```

#### 2. AI Prompt Template
```
Bạn là một fashion stylist chuyên nghiệp. 
Hãy gợi ý outfit hoàn chỉnh cho:
- Giới tính: {gender}
- Tuổi: {age}
- Dịp: {occasion}
- Phong cách yêu thích: {preferredStyle}
- Màu sắc yêu thích: {preferredColor}

Trả về JSON format:
{
  "top": "tên áo",
  "bottom": "tên quần/váy",
  "shoes": "tên giày",
  "accessories": "phụ kiện",
  "reason": "lý do gợi ý này"
}
```

#### 3. Response DTO
```json
{
  "outfit": {
    "top": {
      "suggestion": "Áo sơ mi trắng",
      "product": {
        "id": 123,
        "name": "Áo sơ mi Oxford trắng",
        "price": 450000,
        "imageUrl": "..."
      }
    },
    "bottom": {
      "suggestion": "Quần tây xanh navy",
      "product": {...}
    },
    "shoes": {...},
    "accessories": [...]
  },
  "reason": "Outfit này phù hợp cho môi trường công sở..."
}
```

### Business Logic
1. **Build Prompt**: Tạo prompt từ user input
2. **Call AI API**: Gửi request đến OpenAI/Custom AI
3. **Parse Response**: Parse JSON từ AI
4. **Product Matching**: 
   - Tìm sản phẩm tương tự trong DB
   - Match theo: category, color, styleTag
   - Sắp xếp theo độ phù hợp
5. **Return Result**: Trả về gợi ý + products

### Error Handling
- AI API timeout → Fallback to default suggestions
- No matching products → Suggest alternative
- Invalid AI response → Retry hoặc show error

---

## 6️⃣ Admin Manage Product

### Mô tả
Admin thêm/sửa/xóa sản phẩm.

### PlantUML Code
```plantuml
@startuml

actor Admin
participant "Admin UI" as UI
participant "ProductController" as Controller
participant "ProductService" as Service
participant "Database" as DB

== Add Product ==

Admin -> UI : Nhập thông tin sản phẩm
Admin -> UI : Upload hình ảnh
UI -> Controller : POST /api/admin/products

Controller -> Controller : checkAdminRole()

alt Không phải Admin
    Controller --> UI : 403 Forbidden
else Là Admin
    Controller -> Service : createProduct(productDTO)
    Service -> Service : validateProduct()
    Service -> DB : save(product)
    DB --> Service : Product saved
    Service --> Controller : ProductDTO
    Controller --> UI : 201 Created
    UI --> Admin : "Thêm sản phẩm thành công"
end

== Update Product ==

Admin -> UI : Chỉnh sửa sản phẩm
UI -> Controller : PUT /api/admin/products/{id}
Controller -> Service : updateProduct(id, productDTO)
Service -> DB : findById(id)

alt Product không tồn tại
    DB --> Service : null
    Service --> Controller : 404 Not Found
else Product tồn tại
    Service -> DB : update(product)
    DB --> Service : Updated
    Service --> Controller : ProductDTO
    Controller --> UI : 200 OK
    UI --> Admin : "Cập nhật thành công"
end

== Delete Product ==

Admin -> UI : Xóa sản phẩm
UI -> UI : Confirm dialog
Admin -> UI : Xác nhận

UI -> Controller : DELETE /api/admin/products/{id}
Controller -> Service : deleteProduct(id)

Service -> DB : checkProductInOrders(id)

alt Sản phẩm đã có trong đơn hàng
    Service -> DB : softDelete(id)
    note right: Set isActive = false
else Sản phẩm mới
    Service -> DB : delete(id)
end

DB --> Service : Deleted
Service --> Controller : 200 OK
Controller --> UI : Success
UI --> Admin : "Xóa thành công"

@enduml
```

### Admin Authorization
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/admin/products")
public ResponseEntity<?> createProduct(@RequestBody ProductDTO dto) {
    // Implementation
}
```

---

## 📊 Timing Considerations

| Sequence | Average Time | Notes |
|----------|-------------|-------|
| Login | 200-500ms | Include DB query + JWT generation |
| Registration | 300-600ms | Include password encryption |
| Add to Cart | 100-300ms | Fast operation |
| Checkout | 1-3s | Include payment gateway |
| AI Stylist | 3-10s | Depends on AI API response time |
| Admin CRUD | 200-500ms | Standard CRUD operations |

## 🔒 Security Notes

1. **JWT Token**: Expire sau 24h, refresh token sau 30 days
2. **Password**: BCrypt với cost factor = 12
3. **Payment**: Chỉ lưu transaction ID, không lưu card info
4. **AI API**: Rate limiting 10 requests/minute/user
5. **Admin**: Require 2FA cho sensitive operations

## 📝 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

**[⬅️ Class Diagram](class-diagram.md)** | **[➡️ Activity Diagram](activity-diagram.md)**
