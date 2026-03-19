import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl glass-effect cursor-pointer"
    >
      {/* Premium Badge */}
      {product.isPremium && (
        <div className="absolute top-4 right-4 z-20 px-4 py-2 gold-gradient rounded-full text-luxury-black text-xs font-bold tracking-wider">
          PREMIUM
        </div>
      )}

      {/* Image Container */}
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
            loading="lazy"
          />

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent"
        />

        {/* Glass overlay effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 glass-effect-dark"
        />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-serif font-semibold text-luxury-white group-hover:text-gradient transition-all duration-300">
              {product.name}
            </h3>
            <p className="text-luxury-white/60 text-sm mt-1">{product.category}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <p className="text-2xl font-semibold text-luxury-gold">
            ${product.price.toLocaleString()}
          </p>

          <Link to={`/products/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 glass-effect rounded-lg text-sm font-medium text-luxury-white border border-luxury-gold/30 hover:border-luxury-gold transition-all duration-300"
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
        }}
      />
    </motion.div>
  );
}
