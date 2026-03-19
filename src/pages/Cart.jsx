import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-3xl p-12"
          >
            <h2 className="text-4xl font-serif font-bold text-luxury-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-luxury-white/60 mb-8">
              Explore our collection and find something extraordinary
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 gold-gradient rounded-lg font-medium text-luxury-black hover:scale-105 transition-transform duration-300"
            >
              Browse Products
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-serif font-bold text-luxury-white mb-12 text-center">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="glass-effect rounded-2xl p-6 flex gap-6"
                >
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-luxury-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-luxury-gold font-medium mb-4">
                      ${item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 glass-effect rounded text-luxury-white hover:text-luxury-gold transition-colors"
                      >
                        -
                      </button>
                      <span className="text-luxury-white font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 glass-effect rounded text-luxury-white hover:text-luxury-gold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gradient mb-4">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-effect rounded-2xl p-8 sticky top-8">
                <h2 className="text-2xl font-serif font-bold text-luxury-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-luxury-white/80">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-luxury-white/80">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-luxury-white/10 pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span className="text-luxury-white">Total</span>
                      <span className="text-gradient">${getCartTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 gold-gradient rounded-lg font-medium text-luxury-black hover:scale-105 transition-transform duration-300 mb-4"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 glass-effect border border-luxury-white/20 rounded-lg text-luxury-white hover:border-luxury-gold transition-colors mb-4"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
