/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Coupon, FAQItem, ShopSettings, OrderItem, Testimonial } from '../types';

// Standard Unsplash high-quality images for groceries
const SEED_IMAGES = {
  mangoes: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
  honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
  ghee: 'https://images.unsplash.com/photo-1589733901241-5e53429e1db4?auto=format&fit=crop&q=80&w=600',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
  bananas: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600',
  onions: 'https://images.unsplash.com/photo-1618243868594-38b102233361?auto=format&fit=crop&q=80&w=600',
  potatoes: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
  eggs: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=600',
  tea: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600',
  nuts: 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?auto=format&fit=crop&q=80&w=600',
  rabri: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
  
  // Category images
  catFruitsVeg: 'https://images.unsplash.com/photo-1610832958506-ee5633619144?auto=format&fit=crop&q=80&w=500',
  catDairy: 'https://images.unsplash.com/photo-1628088062854-d1870b4553cb?auto=format&fit=crop&q=80&w=500',
  catPantry: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=500',
  catBeverages: 'https://images.unsplash.com/photo-1527960656-26902793b85f?auto=format&fit=crop&q=80&w=500',
  catSnacks: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=500',
  catSpecial: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=500',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Fruits & Vegetables', icon: 'Apple', slug: 'fruits-veg', image: SEED_IMAGES.catFruitsVeg, productsCount: 4 },
  { id: 'cat-2', name: 'Dairy & Eggs', icon: 'Milk', slug: 'dairy-eggs', image: SEED_IMAGES.catDairy, productsCount: 3 },
  { id: 'cat-3', name: 'Grains & Pantry', icon: 'Package', slug: 'pantry', image: SEED_IMAGES.catPantry, productsCount: 2 },
  { id: 'cat-4', name: 'Beverages', icon: 'Coffee', slug: 'beverages', image: SEED_IMAGES.catBeverages, productsCount: 1 },
  { id: 'cat-5', name: 'Snacks & Sweets', icon: 'Cookie', slug: 'snacks', image: SEED_IMAGES.catSnacks, productsCount: 1 },
  { id: 'cat-6', name: 'Mirpurkhas Specialties', icon: 'Sparkles', slug: 'specialties', image: SEED_IMAGES.catSpecial, productsCount: 2 }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Sindhri Mangoes (Mirpurkhas Special)',
    category: 'Mirpurkhas Specialties',
    categoryId: 'cat-6',
    price: 299,
    originalPrice: 399,
    discountPercent: 25,
    description: 'Directly sourced from the prestigious mango orchards of Mirpurkhas, Sindh. Hand-picked at optimal ripeness, these Sindhri mangoes are exceptionally sweet, fiber-free, and bear a rich heavenly aroma. Truly the King of Mangoes!',
    image: SEED_IMAGES.mangoes,
    images: [
      SEED_IMAGES.mangoes,
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=600'
    ],
    stock: 45,
    rating: 4.9,
    reviewsCount: 32,
    isFeatured: true,
    isFlashSale: true,
    unit: 'kg',
    brand: 'Mirpurkhas Orchards'
  },
  {
    id: 'prod-2',
    name: 'Organic Sidr Honey (Sindh Forest Special)',
    category: 'Mirpurkhas Specialties',
    categoryId: 'cat-6',
    price: 1499,
    originalPrice: 1799,
    discountPercent: 17,
    description: '100% pure, raw, and unpasteurized Sidr Honey harvested from wild Sidr (Lote) trees in Sindh. Recognized for its deep amber color, thick consistency, and remarkable medicinal properties. Boost your health and vitality naturally.',
    image: SEED_IMAGES.honey,
    images: [SEED_IMAGES.honey, 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=600'],
    stock: 15,
    rating: 4.8,
    reviewsCount: 19,
    isFeatured: true,
    isFlashSale: false,
    unit: '500g Glass Jar',
    brand: 'Sindh Wild'
  },
  {
    id: 'prod-3',
    name: 'Pure Desi Ghee (Village Imzaiz Special)',
    category: 'Dairy & Eggs',
    categoryId: 'cat-2',
    price: 1899,
    originalPrice: 2100,
    discountPercent: 10,
    description: 'Traditional wood-churned Desi Ghee crafted directly in Village Imzaiz Panhwar. Prepared using slow-cooking methods with grass-fed local cow milk. Extremely rich in aroma, granular texture, and loaded with fat-soluble vitamins.',
    image: SEED_IMAGES.ghee,
    images: [SEED_IMAGES.ghee, 'https://images.unsplash.com/photo-1605291499390-76c1103f3335?auto=format&fit=crop&q=80&w=600'],
    stock: 20,
    rating: 5.0,
    reviewsCount: 28,
    isFeatured: true,
    isFlashSale: false,
    unit: 'kg',
    brand: 'Imzaiz Organic Farms'
  },
  {
    id: 'prod-4',
    name: 'Super Kernel Basmati Rice (Premium Long Grain)',
    category: 'Grains & Pantry',
    categoryId: 'cat-3',
    price: 340,
    originalPrice: 380,
    discountPercent: 11,
    description: 'Aged for over 12 months to perfection, this Super Kernel Basmati Rice offers exceptionally long slender grains that double in length when cooked. Perfect for aromatic Biryani and Pulao. Delicate texture with classic fragrant aroma.',
    image: SEED_IMAGES.rice,
    images: [SEED_IMAGES.rice],
    stock: 200,
    rating: 4.7,
    reviewsCount: 42,
    isFeatured: true,
    isFlashSale: false,
    unit: 'kg',
    brand: 'Shahmeer Premium'
  },
  {
    id: 'prod-5',
    name: 'Fresh Sindhri Bananas (Imzaiz Orchards)',
    category: 'Fruits & Vegetables',
    categoryId: 'cat-1',
    price: 140,
    originalPrice: 160,
    discountPercent: 12,
    description: 'Naturally ripened bananas from local farms in Mirpurkhas. Extremely rich in potassium, naturally sweet, and creamy. Perfect for milkshakes, healthy breakfast cereals, or an energizing quick snack.',
    image: SEED_IMAGES.bananas,
    images: [SEED_IMAGES.bananas],
    stock: 30,
    rating: 4.6,
    reviewsCount: 14,
    isFeatured: false,
    isFlashSale: true,
    unit: 'Dozen',
    brand: 'Local Farm'
  },
  {
    id: 'prod-6',
    name: 'Organic Red Onions (Fresh Local Harvest)',
    category: 'Fruits & Vegetables',
    categoryId: 'cat-1',
    price: 120,
    originalPrice: 150,
    discountPercent: 20,
    description: 'Sharp, crispy, and nutrient-dense organic red onions harvested from nearby soil. Sourced with zero chemical fertilizers. Ideal base for any traditional handi or refreshing salads.',
    image: SEED_IMAGES.onions,
    images: [SEED_IMAGES.onions],
    stock: 120,
    rating: 4.5,
    reviewsCount: 23,
    isFeatured: false,
    isFlashSale: false,
    unit: 'kg',
    brand: 'Local Farm'
  },
  {
    id: 'prod-7',
    name: 'Premium Russet Potatoes (Local Crop)',
    category: 'Fruits & Vegetables',
    categoryId: 'cat-1',
    price: 80,
    description: 'Freshly harvested large, high-starch potatoes from local fields. Ideal for making perfectly crispy golden french fries, traditional subzi, or smooth mashed potatoes.',
    image: SEED_IMAGES.potatoes,
    images: [SEED_IMAGES.potatoes],
    stock: 150,
    rating: 4.6,
    reviewsCount: 17,
    isFeatured: false,
    isFlashSale: false,
    unit: 'kg',
    brand: 'Local Farm'
  },
  {
    id: 'prod-8',
    name: 'Fresh Buffalo Milk (Full Cream Daily)',
    category: 'Dairy & Eggs',
    categoryId: 'cat-2',
    price: 190,
    description: 'Fresh milk delivered daily from the farms of Imzaiz Panhwar. Pure, unadulterated, raw, and creamy milk containing rich natural fat. Excellent for brewing strong Sindhi Chai or making fresh home-made yogurt.',
    image: SEED_IMAGES.milk,
    images: [SEED_IMAGES.milk],
    stock: 40,
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isFlashSale: false,
    unit: 'Liter',
    brand: 'Imzaiz Dairy'
  },
  {
    id: 'prod-9',
    name: 'Organic Brown Eggs (Farm Fresh)',
    category: 'Dairy & Eggs',
    categoryId: 'cat-2',
    price: 280,
    originalPrice: 320,
    discountPercent: 12,
    description: 'High-quality organic brown eggs sourced from free-range cage-free poultry in Sindh. High in omega-3 and proteins, with deep golden yolks. Rich and incredibly nutritious.',
    image: SEED_IMAGES.eggs,
    images: [SEED_IMAGES.eggs],
    stock: 25,
    rating: 4.8,
    reviewsCount: 11,
    isFeatured: false,
    isFlashSale: false,
    unit: 'Dozen',
    brand: 'Imzaiz Poultry'
  },
  {
    id: 'prod-10',
    name: 'Cardamom Strong Chai (Premium Blend)',
    category: 'Beverages',
    categoryId: 'cat-4',
    price: 450,
    originalPrice: 499,
    discountPercent: 10,
    description: 'An exceptional robust CTC black tea blended with freshly crushed organic green cardamom pods. Crafted to brew a highly aromatic and strong traditional milk-tea (Karak Chai).',
    image: SEED_IMAGES.tea,
    images: [SEED_IMAGES.tea],
    stock: 60,
    rating: 4.8,
    reviewsCount: 33,
    isFeatured: true,
    isFlashSale: false,
    unit: '250g Pack',
    brand: 'Shahmeer Premium'
  },
  {
    id: 'prod-11',
    name: 'Salted Pistachios (Premium Roasted)',
    category: 'Snacks & Sweets',
    categoryId: 'cat-5',
    price: 990,
    originalPrice: 1150,
    discountPercent: 14,
    description: 'Carefully selected large, crunchy pistachios, lightly salted and roasted to perfection. A healthy and delicious snack filled with plant protein, healthy fats, and antioxidants.',
    image: SEED_IMAGES.nuts,
    images: [SEED_IMAGES.nuts],
    stock: 18,
    rating: 4.7,
    reviewsCount: 22,
    isFeatured: false,
    isFlashSale: false,
    unit: '250g Container',
    brand: 'Shahmeer Premium'
  },
  {
    id: 'prod-12',
    name: 'Traditional Rabri (Mirpurkhas Sweet Secret)',
    category: 'Mirpurkhas Specialties',
    categoryId: 'cat-6',
    price: 650,
    originalPrice: 750,
    discountPercent: 13,
    description: 'A luxurious traditional sweet prepared by thick reduction of sweetened pure milk with layer-by-layer malai accumulation. Styled and formulated using an ancestral culinary recipe. A creamy and delightful luxury dessert.',
    image: SEED_IMAGES.rabri,
    images: [SEED_IMAGES.rabri],
    stock: 12,
    rating: 4.9,
    reviewsCount: 29,
    isFeatured: true,
    isFlashSale: true,
    unit: '500g Box',
    brand: 'Mirpurkhas Traditional Sweets'
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'SHAHMEER5', discountPercent: 5, description: '5% off on your first order', active: true },
  { code: 'SINDHRI10', discountPercent: 10, description: '10% off on all specialty items', active: true },
  { code: 'VILLAGE20', discountPercent: 20, description: 'Mega 20% discount on orders above Rs. 5000', active: true }
];

const DEFAULT_FAQS: FAQItem[] = [
  { id: 'faq-1', question: 'Where is Shahmeer Shop located?', answer: 'We are proudly located in Village Imzaiz Panhwar, Mirpurkhas, Sindh, Pakistan.' },
  { id: 'faq-2', question: 'How do I place an order?', answer: 'Simple! Add items to your Cart, apply any discount Coupon, and proceed to Checkout. Clicking "Confirm via WhatsApp" will generate a beautifully styled digital invoice and directly open WhatsApp to send your order detail and location to us on +923192616627.' },
  { id: 'faq-3', question: 'Do you deliver outside Mirpurkhas?', answer: 'Currently, we provide priority home delivery to Village Imzaiz Panhwar, local rural areas, and Mirpurkhas City. For special orders outside, please chat with us on WhatsApp.' },
  { id: 'faq-4', question: 'What are your delivery charges?', answer: 'Delivery is completely FREE for orders above Rs. 1000 in Village Imzaiz Panhwar. For other areas or lower amounts, standard charges are only Rs. 100.' },
  { id: 'faq-5', question: 'How is the quality of fresh items ensured?', answer: 'Our milk, butter, ghee, and vegetables are sourced daily from our local village farms. Sindhri Mangoes are hand-picked from premium local orchards to ensure absolute top tier premium quality.' }
];

const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'SHAHMEER SHOP',
  location: 'Village Imzaiz Panhwar, Mirpurkhas, Sindh, Pakistan',
  whatsappNumber: '923192616627',
  deliveryCharges: 100,
  instagramUrl: 'https://instagram.com/shahmeershop',
  facebookUrl: 'https://facebook.com/shahmeershop',
  twitterUrl: 'https://twitter.com/shahmeershop',
  metaTitle: 'Shahmeer Shop | Premium Kiryana & Local Grocery Mirpurkhas',
  metaDescription: 'Luxury shopping experience for premium fresh mangoes, desi ghee, sidr honey, and daily groceries in Sindh, Mirpurkhas, Village Imzaiz Panhwar.',
  metaKeywords: 'Shahmeer Shop, Mirpurkhas Grocery, Sindhri Mangoes, Village Imzaiz, Desi Ghee Sindh, Kiryana Store Sindh',
  announcementActive: true,
  announcementText: '🎉 Grand Sale! Get Free Delivery on all orders above Rs. 1000 in Imzaiz Panhwar!'
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Abdul Rehman Panhwar',
    role: 'Local Resident',
    comment: 'The quality of Pure Desi Ghee from Village Imzaiz is outstanding. It takes me back to my childhood days. Excellent customer service over WhatsApp too!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'test-2',
    name: 'Sanaullah Baloch',
    role: 'Mirpurkhas City Customer',
    comment: 'Best Sindhri Mangoes I have ever had! Beautifully packed, fiberless, sweet as honey. Highly recommended premium quality!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'test-3',
    name: 'Ayesha Shah',
    role: 'Regular Shopper',
    comment: 'Shahmeer Shop makes grocery shopping so elegant. Order via WhatsApp is super fast, and the delivery charges are very reasonable. The eggs and milk are always fresh!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const DEFAULT_REVIEWS = [
  { id: 'rev-1', productId: 'prod-1', author: 'Bashir Ahmed', rating: 5, comment: 'Slightly more expensive but absolutely worth every rupee. Superb aroma and sweetness.', date: '2026-06-15' },
  { id: 'rev-2', productId: 'prod-1', author: 'Zainab Bibi', rating: 5, comment: 'Delivered fresh within 2 hours. Highly recommended Sindhri Mangoes!', date: '2026-06-20' },
  { id: 'rev-3', productId: 'prod-3', author: 'Kamran Panhwar', rating: 5, comment: 'Prepared cleanly. Granular texture and authentic taste of Sindh village life.', date: '2026-07-02' }
];

const KEYS = {
  PRODUCTS: 'shahmeer_products',
  CATEGORIES: 'shahmeer_categories',
  COUPONS: 'shahmeer_coupons',
  FAQS: 'shahmeer_faqs',
  SETTINGS: 'shahmeer_settings',
  TESTIMONIALS: 'shahmeer_testimonials',
  REVIEWS: 'shahmeer_reviews',
  ORDERS: 'shahmeer_orders',
  WISHLIST: 'shahmeer_wishlist',
  THEME: 'shahmeer_theme',
  ADMIN_LOGGED_IN: 'shahmeer_admin_logged_in'
};

// Initialize DB safely
export function initDB() {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem(KEYS.COUPONS)) {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
  }
  if (!localStorage.getItem(KEYS.FAQS)) {
    localStorage.setItem(KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.THEME)) {
    localStorage.setItem(KEYS.THEME, 'light');
  }
}

// Ensure database is initialized
initDB();

// Data access utility methods
export const db = {
  // PRODUCTS
  getProducts: (): Product[] => {
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]');
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    // Trigger mock custom storage event for sync
    window.dispatchEvent(new Event('storage'));
  },
  
  // CATEGORIES
  getCategories: (): Category[] => {
    return JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('storage'));
  },

  // COUPONS
  getCoupons: (): Coupon[] => {
    return JSON.parse(localStorage.getItem(KEYS.COUPONS) || '[]');
  },
  saveCoupons: (coupons: Coupon[]) => {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    window.dispatchEvent(new Event('storage'));
  },

  // FAQS
  getFAQs: (): FAQItem[] => {
    return JSON.parse(localStorage.getItem(KEYS.FAQS) || '[]');
  },
  saveFAQs: (faqs: FAQItem[]) => {
    localStorage.setItem(KEYS.FAQS, JSON.stringify(faqs));
    window.dispatchEvent(new Event('storage'));
  },

  // SETTINGS
  getSettings: (): ShopSettings => {
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS));
  },
  saveSettings: (settings: ShopSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));
  },

  // TESTIMONIALS
  getTestimonials: (): Testimonial[] => {
    return JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS) || '[]');
  },
  saveTestimonials: (testimonials: Testimonial[]) => {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    window.dispatchEvent(new Event('storage'));
  },

  // REVIEWS
  getReviews: (): typeof DEFAULT_REVIEWS => {
    return JSON.parse(localStorage.getItem(KEYS.REVIEWS) || '[]');
  },
  saveReviews: (reviews: typeof DEFAULT_REVIEWS) => {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('storage'));
  },

  // ORDERS
  getOrders: (): OrderItem[] => {
    return JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]');
  },
  saveOrders: (orders: OrderItem[]) => {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('storage'));
  },
  addOrder: (order: OrderItem) => {
    const orders = db.getOrders();
    orders.unshift(order); // Newest orders first
    db.saveOrders(orders);
  },

  // WISHLIST
  getWishlist: (): string[] => {
    return JSON.parse(localStorage.getItem(KEYS.WISHLIST) || '[]');
  },
  saveWishlist: (wishlist: string[]) => {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
    window.dispatchEvent(new Event('storage'));
  },
  toggleWishlist: (productId: string): boolean => {
    const wishlist = db.getWishlist();
    const index = wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
      added = true;
    }
    db.saveWishlist(wishlist);
    return added;
  },

  // THEME
  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(KEYS.THEME) as 'light' | 'dark') || 'light';
  },
  saveTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(KEYS.THEME, theme);
    // Apply class to body or document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.dispatchEvent(new Event('storage'));
  },

  // ADMIN
  isAdminLoggedIn: (): boolean => {
    return localStorage.getItem(KEYS.ADMIN_LOGGED_IN) === 'true';
  },
  setAdminLoggedIn: (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      localStorage.setItem(KEYS.ADMIN_LOGGED_IN, 'true');
    } else {
      localStorage.removeItem(KEYS.ADMIN_LOGGED_IN);
    }
    window.dispatchEvent(new Event('storage'));
  },

  // BACKUP & RESTORE
  getBackupJSON: (): string => {
    const data: Record<string, any> = {};
    Object.values(KEYS).forEach((key) => {
      data[key] = localStorage.getItem(key);
    });
    return JSON.stringify(data);
  },
  restoreBackup: (backupJSON: string): boolean => {
    try {
      const data = JSON.parse(backupJSON);
      Object.keys(data).forEach((key) => {
        if (data[key] !== null) {
          localStorage.setItem(key, data[key]);
        }
      });
      // Re-initialize to apply correctly
      initDB();
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  resetDB: () => {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    initDB();
    window.dispatchEvent(new Event('storage'));
  }
};
