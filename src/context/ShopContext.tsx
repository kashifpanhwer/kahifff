/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, OrderItem, ShopSettings, Coupon } from '../types';
import { db } from '../storage/db';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  settings: ShopSettings;
  coupons: Coupon[];
  
  // Router
  currentPage: string;
  selectedProduct: Product | null;
  selectedCategorySlug: string | null;
  navigateTo: (page: string, params?: { productId?: string; categorySlug?: string }) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTotal: () => number;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  
  // Coupon Actions
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  // Toast Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Admin Session
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (status: boolean) => void;
  
  // Force reload DB
  reloadDB: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(() => db.getSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  // Routing State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  
  // Modal states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Admin Logged In State
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(false);

  // Load from db/localStorage
  const reloadDB = () => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
    setCoupons(db.getCoupons());
    setSettings(db.getSettings());
    setWishlist(db.getWishlist());
    setTheme(db.getTheme());
    setIsAdminLoggedInState(db.isAdminLoggedIn());
    
    // Load cart from LocalStorage
    const storedCart = localStorage.getItem('shahmeer_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      setCart([]);
    }
  };

  useEffect(() => {
    reloadDB();
    
    // Key listeners for Admin Login CTRL + SHIFT + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'A') {
        e.preventDefault();
        navigateTo('admin-login');
        showToast('Entering premium admin gateway...', 'info');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Add popstate listener for browser navigation fallback
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const [pageName, param] = hash.split('/');
        if (pageName === 'product-details' && param) {
          const prods = db.getProducts();
          const p = prods.find(item => item.id === param || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === param);
          if (p) {
            setCurrentPage('product-details');
            setSelectedProduct(p);
          } else {
            setCurrentPage('home');
          }
        } else if (pageName === 'products' && param) {
          setCurrentPage('products');
          setSelectedCategorySlug(param);
        } else if (['home', 'categories', 'products', 'offers', 'wishlist', 'cart', 'checkout', 'about', 'contact', 'faq', 'privacy', 'terms', 'admin', 'admin-login'].includes(pageName)) {
          setCurrentPage(pageName);
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sync theme with DOM on mount and changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navigateTo = (page: string, params?: { productId?: string; categorySlug?: string }) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page === 'product-details' && params?.productId) {
      const prod = products.find(p => p.id === params.productId);
      setSelectedProduct(prod || null);
      window.location.hash = `product-details/${params.productId}`;
    } else if (page === 'products' && params?.categorySlug) {
      setSelectedCategorySlug(params.categorySlug);
      window.location.hash = `products/${params.categorySlug}`;
    } else {
      setSelectedProduct(null);
      setSelectedCategorySlug(null);
      window.location.hash = page;
    }
  };

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const saveCartToStorage = (newCart: CartItem[]) => {
    localStorage.setItem('shahmeer_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (product: Product, quantity = 1) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(item => item.product.id === product.id);
    
    if (existingIndex > -1) {
      const newQty = newCart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        showToast(`Sorry, only ${product.stock} ${product.unit}(s) available in stock.`, 'error');
        newCart[existingIndex].quantity = product.stock;
      } else {
        newCart[existingIndex].quantity = newQty;
        showToast(`Updated ${product.name} quantity to ${newQty} in cart!`);
      }
    } else {
      if (quantity > product.stock) {
        showToast(`Sorry, only ${product.stock} available in stock.`, 'error');
        newCart.push({ product, quantity: product.stock });
      } else {
        newCart.push({ product, quantity });
        showToast(`Added ${product.name} to cart!`);
      }
    }
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCartToStorage(newCart);
    if (item) {
      showToast(`Removed ${item.product.name} from cart!`, 'info');
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = products.find(p => p.id === productId);
    if (item && quantity > item.stock) {
      showToast(`Only ${item.stock} in stock!`, 'error');
      quantity = item.stock;
    }
    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
    setAppliedCoupon(null);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getCartSubtotal();
    return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    if (subtotal === 0) return 0;
    
    // If subtotal is greater than Rs. 1000, delivery is free
    const delCharges = subtotal >= 1000 ? 0 : settings.deliveryCharges;
    return subtotal - discount + delCharges;
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    const added = db.toggleWishlist(productId);
    setWishlist(db.getWishlist());
    const prod = products.find(p => p.id === productId);
    if (prod) {
      if (added) {
        showToast(`Added ${prod.name} to your Wishlist!`, 'success');
      } else {
        showToast(`Removed ${prod.name} from your Wishlist!`, 'info');
      }
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Coupon Actions
  const applyCoupon = (code: string): boolean => {
    const foundCoupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
      showToast(`Coupon "${foundCoupon.code}" applied! Save Rs. ${Math.round((getCartSubtotal() * foundCoupon.discountPercent) / 100)}`, 'success');
      return true;
    } else {
      showToast('Invalid or expired coupon code.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Theme Action
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    db.saveTheme(newTheme);
    showToast(`Switched to ${newTheme} mode!`, 'info');
  };

  const setAdminLoggedIn = (status: boolean) => {
    db.setAdminLoggedIn(status);
    setIsAdminLoggedInState(status);
    if (status) {
      showToast('Welcome Back, Administrator!', 'success');
    } else {
      showToast('Logged out securely.', 'info');
      navigateTo('home');
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      categories,
      cart,
      wishlist,
      settings,
      coupons,
      currentPage,
      selectedProduct,
      selectedCategorySlug,
      navigateTo,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartSubtotal,
      getCartDiscount,
      getCartTotal,
      toggleWishlist,
      isWishlisted,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      theme,
      toggleTheme,
      quickViewProduct,
      setQuickViewProduct,
      toasts,
      showToast,
      removeToast,
      isAdminLoggedIn,
      setAdminLoggedIn,
      reloadDB
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
