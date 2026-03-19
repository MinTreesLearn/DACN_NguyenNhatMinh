import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Section from './components/Section';
import Footer from './components/Footer';
import { api, mockProducts } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from API, fallback to mock data
    const fetchProducts = async () => {
      setLoading(true);
      const response = await api.getPremiumProducts();

      if (response.status === 'success' && response.data?.length > 0) {
        setProducts(response.data);
      } else {
        // Use mock data if API fails
        setProducts(mockProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Hero Section */}
      <Hero />

      {/* Premium Product Showcase */}
      <Section className="bg-gradient-to-b from-luxury-black via-luxury-gray to-luxury-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury-white mb-4">
              Exclusive Collection
            </h2>
            <p className="text-luxury-white/60 text-lg max-w-2xl mx-auto">
              Handpicked treasures for those who appreciate the extraordinary
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-effect rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] bg-luxury-gray-light animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-luxury-gray-light rounded animate-pulse"></div>
                    <div className="h-4 bg-luxury-gray-light rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Storytelling Section 1: Craftsmanship */}
      <Section className="bg-luxury-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="glass-effect rounded-3xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=800&fit=crop"
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury-white">
                Our Craftsmanship
              </h2>
              <p className="text-luxury-white/70 text-lg leading-relaxed">
                Each piece in our collection is a testament to centuries of refined artistry.
                Master craftsmen pour their soul into every detail, creating not just products,
                but timeless works of art that transcend generations.
              </p>
              <p className="text-luxury-white/70 text-lg leading-relaxed">
                We believe that true luxury lies in the perfection of execution, where heritage
                techniques meet contemporary innovation to create something truly extraordinary.
              </p>
              <div className="pt-4">
                <button className="group px-8 py-3 glass-effect rounded-full font-medium text-luxury-white border border-luxury-gold/50 hover:border-luxury-gold transition-all duration-300 hover:scale-105">
                  Discover Our Process
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Storytelling Section 2: Heritage & Legacy */}
      <Section className="bg-gradient-to-b from-luxury-black via-luxury-gray to-luxury-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury-white">
                Heritage & Legacy
              </h2>
              <p className="text-luxury-white/70 text-lg leading-relaxed">
                Our legacy spans decades of unwavering commitment to excellence. We've been
                privileged to serve the world's most discerning clientele, building relationships
                that transcend mere transactions.
              </p>
              <p className="text-luxury-white/70 text-lg leading-relaxed">
                Every acquisition becomes part of your personal legacy, a treasure to be cherished
                and passed down through generations, carrying stories of elegance and prestige.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-gradient">50+</p>
                  <p className="text-luxury-white/60 text-sm mt-2">Years of Excellence</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-gradient">10K+</p>
                  <p className="text-luxury-white/60 text-sm mt-2">Elite Members</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-gradient">100%</p>
                  <p className="text-luxury-white/60 text-sm mt-2">Authentic</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-effect rounded-3xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1594576722512-582bcd46fba3?w=800&h=800&fit=crop"
                  alt="Heritage"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Storytelling Section 3: Designed for the Elite */}
      <Section className="bg-luxury-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="glass-effect rounded-3xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop"
                  alt="Elite Design"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury-white">
                Designed for the Elite
              </h2>
              <p className="text-luxury-white/70 text-lg leading-relaxed">
                We understand that true luxury is not about ostentation, but about subtle
                sophistication. Our collection speaks to those who value quality over quantity,
                exclusivity over availability.
              </p>
              <p className="text-luxury-white/70 text-lg leading-relaxed">
                Join a select circle where every detail matters, where excellence is the standard,
                and where your refined taste is not just understood, but celebrated.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Brand Values Section */}
      <Section className="bg-gradient-to-b from-luxury-black via-luxury-gray to-luxury-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury-white mb-4">
              Our Values
            </h2>
            <p className="text-luxury-white/60 text-lg max-w-2xl mx-auto">
              The pillars that define our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '💎',
                title: 'Exclusivity',
                description: 'Limited collections available only to our distinguished members',
              },
              {
                icon: '✨',
                title: 'Quality',
                description: 'Uncompromising standards in materials, craftsmanship, and design',
              },
              {
                icon: '🚀',
                title: 'Innovation',
                description: 'Blending timeless elegance with cutting-edge contemporary vision',
              },
              {
                icon: '👑',
                title: 'Prestige',
                description: 'Curated for those who appreciate the finer things in life',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group glass-effect rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 hover:glow-gold-sm"
              >
                <div className="text-6xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-serif font-bold text-luxury-white mb-4 group-hover:text-gradient transition-all duration-300">
                  {value.title}
                </h3>
                <p className="text-luxury-white/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Membership / CTA Section */}
      <Section className="bg-luxury-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxury-gold rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxury-gold-light rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-effect-dark rounded-3xl p-12 md:p-16 space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury-white mb-6">
              Enter the <span className="text-gradient">Inner Circle</span>
            </h2>
            <p className="text-luxury-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
              Join an exclusive community of connoisseurs who demand nothing but the finest.
              Membership unlocks a world of privileges designed for the discerning few.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              {[
                { title: 'Early Access', desc: 'Preview new collections before public release' },
                { title: 'VIP Events', desc: 'Exclusive invitations to private showcases' },
                { title: 'Concierge Service', desc: 'Personal luxury shopping assistant' },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="glass-effect rounded-xl p-6"
                >
                  <h4 className="font-serif font-semibold text-luxury-gold text-xl mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-luxury-white/60 text-sm">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 gold-gradient rounded-full font-bold text-luxury-black text-lg shadow-2xl glow-gold"
            >
              Become a Member
            </motion.button>

            <p className="text-luxury-white/40 text-sm mt-6">
              Limited memberships available • By invitation or application
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
