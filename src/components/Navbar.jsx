import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-luxury-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif font-bold text-gradient">
            LUXE
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-luxury-white hover:text-luxury-gold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-luxury-white hover:text-luxury-gold transition-colors"
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/ai-stylist"
                  className="text-luxury-white hover:text-luxury-gold transition-colors"
                >
                  AI Stylist
                </Link>
                <Link
                  to="/orders"
                  className="text-luxury-white hover:text-luxury-gold transition-colors"
                >
                  Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="text-luxury-white hover:text-luxury-gold transition-colors"
                >
                  Wishlist
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-luxury-white hover:text-luxury-gold transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold text-luxury-black text-xs rounded-full flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="text-luxury-white/80 text-sm hover:text-luxury-gold transition-colors"
                >
                  {user?.username}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 glass-effect border border-luxury-white/20 rounded-lg text-luxury-white hover:border-luxury-gold transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 glass-effect border border-luxury-white/20 rounded-lg text-luxury-white hover:border-luxury-gold transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 gold-gradient rounded-lg text-luxury-black hover:scale-105 transition-transform duration-300 text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
