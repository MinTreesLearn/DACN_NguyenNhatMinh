import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI, mockProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const response = await productAPI.getById(id);

    if (response.status === 'success' && response.data) {
      setProduct(response.data);
    } else {
      // Fallback to mock data
      const mockProduct = mockProducts.find((p) => p.id === parseInt(id));
      if (mockProduct) {
        setProduct(mockProduct);
      }
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-luxury-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-luxury-white mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 gold-gradient rounded-lg text-luxury-black font-medium"
          >
            Back to Products
          </button>
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Product Image */}
          <div className="glass-effect rounded-3xl overflow-hidden">
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            {product.isPremium && (
              <span className="inline-block w-fit px-4 py-2 bg-luxury-gold/20 text-luxury-gold text-sm font-medium rounded-full">
                PREMIUM COLLECTION
              </span>
            )}

            <h1 className="text-5xl font-serif font-bold text-luxury-white">
              {product.name}
            </h1>

            <p className="text-4xl font-bold text-gradient">
              ${product.price.toLocaleString()}
            </p>

            <p className="text-luxury-white/70 text-lg leading-relaxed">
              {product.description || 'A luxurious piece from our exclusive collection, crafted with the finest materials and attention to detail.'}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-luxury-white/80">Category:</span>
                <span className="text-luxury-gold">{product.category}</span>
              </div>

              {product.stockQuantity !== undefined && (
                <div className="flex items-center gap-4">
                  <span className="text-luxury-white/80">Availability:</span>
                  <span className={product.stockQuantity > 0 ? 'text-green-400' : 'text-red-400'}>
                    {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="text-luxury-white/80">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 glass-effect rounded-lg text-luxury-white hover:text-luxury-gold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-luxury-white font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 glass-effect rounded-lg text-luxury-white hover:text-luxury-gold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 py-4 gold-gradient rounded-lg font-medium text-luxury-black hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-4 glass-effect border border-luxury-white/20 rounded-lg text-luxury-white hover:border-luxury-gold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
