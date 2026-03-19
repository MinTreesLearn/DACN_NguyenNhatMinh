const API_BASE_URL = '/api';

export const api = {
  // Fetch all products
  getProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return { status: 'error', data: [] };
    }
  },

  // Fetch premium products
  getPremiumProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/premium`);
      if (!response.ok) throw new Error('Failed to fetch premium products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching premium products:', error);
      return { status: 'error', data: [] };
    }
  },

  // Fetch product by ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return { status: 'error', data: null };
    }
  }
};

// Mock data for development (when backend is not available)
export const mockProducts = [
  {
    id: 1,
    name: 'Diamond Essence Watch',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=800&fit=crop',
    category: 'Timepieces',
    isPremium: true
  },
  {
    id: 2,
    name: 'Platinum Chain Necklace',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=800&fit=crop',
    category: 'Jewelry',
    isPremium: true
  },
  {
    id: 3,
    name: 'Italian Leather Briefcase',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
    category: 'Accessories',
    isPremium: true
  },
  {
    id: 4,
    name: 'Sapphire Cufflinks',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1611923134239-a9a99c97d76c?w=600&h=800&fit=crop',
    category: 'Jewelry',
    isPremium: true
  },
  {
    id: 5,
    name: 'Cashmere Overcoat',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b52f?w=600&h=800&fit=crop',
    category: 'Apparel',
    isPremium: true
  },
  {
    id: 6,
    name: 'Gold Fountain Pen',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1565735149911-4c62f72f1aca?w=600&h=800&fit=crop',
    category: 'Accessories',
    isPremium: true
  }
];
