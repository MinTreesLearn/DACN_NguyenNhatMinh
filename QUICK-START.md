# Quick Start Guide - Luxury E-Commerce System

This guide will help you get the fullstack luxury e-commerce system running in under 5 minutes.

---

## ⚡ Prerequisites Checklist

- [ ] Java 17+ installed
- [ ] PostgreSQL installed and running
- [ ] Node.js 16+ installed
- [ ] Maven installed (or use IDE with Maven support)

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Database Setup (1 minute)

Open your PostgreSQL client (psql, pgAdmin, or DBeaver) and run:

```sql
CREATE DATABASE luxury_ecommerce;
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Edit application.properties if needed (change database credentials)
# File: backend/src/main/resources/application.properties

# Build and run the backend
mvn spring-boot:run
```

✅ Backend should now be running on `http://localhost:8080`

### Step 3: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

---

## 🎯 Test Your Setup

### 1. Open your browser
Navigate to: `http://localhost:5173`

### 2. Try logging in
Use the default admin account:
- **Username:** `admin`
- **Password:** `admin123`

### 3. Browse products
- Click "Products" in the navbar
- View product details
- Add items to cart

### 4. Test the checkout flow
- Add products to cart
- Go to cart
- Proceed to checkout
- Complete the order

---

## 🔍 Troubleshooting

### Backend won't start?
**Check database connection:**
```bash
psql -U postgres -d luxury_ecommerce
```

**Check if port 8080 is in use:**
```bash
# Linux/Mac
lsof -i :8080

# Windows
netstat -ano | findstr :8080
```

### Frontend won't start?
**Clear node_modules and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Check if port 5173 is in use:**
```bash
# Kill process on port 5173 and restart
```

### Database connection errors?
**Update credentials in:**
`backend/src/main/resources/application.properties`

```properties
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password
```

---

## 📝 API Testing

### Test the API with curl:

```bash
# Get all products
curl http://localhost:8080/api/products

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Or use Postman/Insomnia:
Import this collection URL: `http://localhost:8080/api`

---

## 🎨 What You'll See

### Landing Page
- Premium hero section
- Glassmorphism design
- Animated product cards
- Premium product showcase

### Product Pages
- Product listing with filters
- Detailed product views
- Add to cart functionality

### Shopping Experience
- Real-time cart updates
- Smooth checkout flow
- Order confirmation

---

## 📚 Next Steps

1. **Explore the code:**
   - Backend: `backend/src/main/java/com/luxury/ecommerce/`
   - Frontend: `src/`

2. **Read the documentation:**
   - Full README: `FULLSTACK-ECOMMERCE-README.md`
   - API Docs: `API-DOCUMENTATION.md`

3. **Customize:**
   - Add your own products via the admin account
   - Customize colors in `tailwind.config.js`
   - Add new features!

---

## 🛠️ Development Commands

### Backend
```bash
cd backend
mvn spring-boot:run          # Run backend
mvn clean install            # Build
mvn test                     # Run tests
```

### Frontend
```bash
npm run dev                  # Development server
npm run build                # Production build
npm run preview              # Preview production build
npm run lint                 # Lint code
```

---

## 🎓 Default Accounts

### Admin Account
- Username: `admin`
- Password: `admin123`
- Can: Manage products, view all orders

### User Account
- Username: `johndoe`
- Password: `user123`
- Can: Browse products, create orders

---

## 💡 Pro Tips

1. **Use React DevTools** to inspect components and state
2. **Check browser console** for any errors
3. **Monitor backend logs** for API errors
4. **Use PostgreSQL client** to view database changes in real-time
5. **Test API endpoints** with Postman before frontend integration

---

## 🆘 Need Help?

1. Check the full documentation: `FULLSTACK-ECOMMERCE-README.md`
2. Review API documentation: `API-DOCUMENTATION.md`
3. Check application logs in the terminal
4. Verify all prerequisites are installed

---

## ✅ Success Checklist

After completing this guide, you should be able to:
- [ ] Access the frontend at http://localhost:5173
- [ ] Login with admin credentials
- [ ] View products list
- [ ] Add products to cart
- [ ] Complete checkout process
- [ ] See orders in the database

---

**Congratulations! Your luxury e-commerce system is now running! 🎉**
