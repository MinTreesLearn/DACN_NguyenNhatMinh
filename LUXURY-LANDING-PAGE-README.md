# Luxury E-Commerce Landing Page

A high-end luxury e-commerce landing page built with React, featuring a modern, elegant, and minimalist aesthetic with glassmorphism effects.

## 🎨 Features

- **Dark Luxury Theme**: Black, deep gray, gold accents, and soft white color palette
- **Glassmorphism Effects**: Blurred backgrounds, transparency, and soft reflections
- **Smooth Animations**: Powered by Framer Motion for elegant transitions and micro-interactions
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop devices
- **Premium Components**: Reusable Hero, ProductCard, Section, and Footer components
- **API Integration**: Ready to fetch products from backend API endpoints
- **Performance Optimized**: Lazy loading images and intersection observer for animations

## 🏗️ Page Structure

1. **Hero Section**: Fullscreen layout with brand messaging and CTAs
2. **Premium Product Showcase**: Grid layout with glassmorphism cards and hover effects
3. **Storytelling Sections**: Three sections (Craftsmanship, Heritage, Elite Design)
4. **Brand Values**: Four columns highlighting core values
5. **Membership/CTA Section**: Exclusive membership invitation with benefits
6. **Footer**: Minimal, elegant footer with newsletter and social links

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 API Integration

The application is configured to work with the following backend API endpoints:

- `GET /api/products` - Fetch all products
- `GET /api/products/premium` - Fetch premium products
- `GET /api/products/{id}` - Fetch product by ID

The app includes mock data for development when the backend is not available.

## 🛠️ Technology Stack

- **React 18**: Modern React with functional components and hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom luxury theme
- **Framer Motion**: Animation library for smooth transitions
- **React Intersection Observer**: Lazy loading and scroll animations

## 🎨 Customization

### Colors

Edit the Tailwind config in `tailwind.config.js` to customize the luxury color palette:

```javascript
colors: {
  luxury: {
    black: '#0a0a0a',
    gray: '#1a1a1a',
    gold: '#d4af37',
    // ...
  }
}
```

### Typography

The page uses:
- **Playfair Display** for headings (serif)
- **Inter** for body text (sans-serif)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Project Structure

```
src/
├── components/
│   ├── Hero.jsx          # Hero section component
│   ├── ProductCard.jsx   # Product card with glassmorphism
│   ├── Section.jsx       # Reusable section wrapper
│   └── Footer.jsx        # Footer component
├── services/
│   └── api.js           # API integration and mock data
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles and utilities
```

## 📄 License

This project is part of the DACN_NguyenNhatMinh repository.

## 🤝 Contributing

This is a system design project. For contributions or questions, please refer to the main repository documentation.
