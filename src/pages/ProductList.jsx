import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI, mockProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    setLoading(true);
    let response;

    if (filter === 'premium') {
      response = await productAPI.getPremium();
    } else {
      response = await productAPI.getAll();
    }

    if (response.status === 'success' && response.data?.length > 0) {
      setProducts(response.data);
    } else {
      setProducts(mockProducts);
    }
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-luxury-gray to-luxury-black py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-white mb-4">
              Our Collection
            </h1>
            <p className="text-luxury-white/60 text-lg">
              Discover exquisite pieces crafted for discerning tastes
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'all'
                ? 'gold-gradient text-luxury-black'
                : 'glass-effect text-luxury-white hover:scale-105'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('premium')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'premium'
                ? 'gold-gradient text-luxury-black'
                : 'glass-effect text-luxury-white hover:scale-105'
            }`}
          >
            Premium Only
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="glass-effect rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-luxury-gray-light"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-luxury-gray-light rounded"></div>
                  <div className="h-4 bg-luxury-gray-light rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  {product.isPremium && (
                    <span className="inline-block px-3 py-1 bg-luxury-gold/20 text-luxury-gold text-xs font-medium rounded-full mb-3">
                      PREMIUM
                    </span>
                  )}
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-xl font-serif font-bold text-luxury-white mb-2 hover:text-luxury-gold transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-2xl font-bold text-gradient mb-4">
                    ${product.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 glass-effect border border-luxury-gold/50 rounded-lg text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ProductList;
