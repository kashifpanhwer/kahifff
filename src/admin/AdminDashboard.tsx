/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Settings, ShoppingCart, LayoutDashboard, Package, 
  FolderTree, Percent, Star, Database, Key, LogOut, 
  User, Bell, ChevronLeft, ChevronRight, Plus, Pencil, 
  Trash2, Copy, FileSpreadsheet, Download, Upload, 
  RefreshCw, CheckCircle, Clock, XCircle, Search, Save,
  Apple, Milk, Coffee, Cookie, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../storage/db';
import { Product, Category, Coupon, FAQItem, ShopSettings, OrderItem } from '../types';

export const AdminDashboard: React.FC = () => {
  const { setAdminLoggedIn, showToast, reloadDB } = useShop();

  // Navigation panel tab selection
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'coupons' | 'settings' | 'backups'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Common Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => db.getSettings());

  const loadLocalDB = () => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
    setOrders(db.getOrders());
    setCoupons(db.getCoupons());
    setShopSettings(db.getSettings());
  };

  useEffect(() => {
    loadLocalDB();
  }, []);

  // Sync state to local DB and prompt contexts
  const saveProductsList = (newProds: Product[]) => {
    db.saveProducts(newProds);
    setProducts(newProds);
    reloadDB();
  };

  const saveCategoriesList = (newCats: Category[]) => {
    db.saveCategories(newCats);
    setCategories(newCats);
    reloadDB();
  };

  const saveOrdersList = (newOrders: OrderItem[]) => {
    db.saveOrders(newOrders);
    setOrders(newOrders);
    reloadDB();
  };

  const saveCouponsList = (newCoupons: Coupon[]) => {
    db.saveCoupons(newCoupons);
    setCoupons(newCoupons);
    reloadDB();
  };

  const saveSettingsObject = (newSettings: ShopSettings) => {
    db.saveSettings(newSettings);
    setShopSettings(newSettings);
    reloadDB();
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PRODUCTS MANAGEMENT STATES & LOGIC
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Product Form states
  const [prodForm, setProdForm] = useState({
    name: '', category: '', price: 0, originalPrice: 0, discountPercent: 0,
    description: '', image: '', stock: 0, unit: 'kg', brand: ''
  });

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const query = productSearch.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
  }, [products, productSearch]);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '', category: categories[0]?.name || 'Grains & Pantry', price: 100, originalPrice: 0, discountPercent: 0,
      description: '', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600', stock: 10, unit: 'kg', brand: ''
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name, category: prod.category, price: prod.price, originalPrice: prod.originalPrice || 0,
      discountPercent: prod.discountPercent || 0, description: prod.description, image: prod.image,
      stock: prod.stock, unit: prod.unit, brand: prod.brand || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.category || prodForm.price <= 0) {
      showToast('Please fill out all product details.', 'error');
      return;
    }

    const matchedCategory = categories.find(c => c.name === prodForm.category);
    const catId = matchedCategory?.id || 'cat-1';

    if (editingProduct) {
      // Edit Product
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: prodForm.name,
            category: prodForm.category,
            categoryId: catId,
            price: Number(prodForm.price),
            originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
            discountPercent: prodForm.discountPercent ? Number(prodForm.discountPercent) : undefined,
            description: prodForm.description,
            image: prodForm.image,
            stock: Number(prodForm.stock),
            unit: prodForm.unit,
            brand: prodForm.brand
          };
        }
        return p;
      });
      saveProductsList(updated);
      showToast('Product updated successfully!');
    } else {
      // Add Product
      const newProd: Product = {
        id: 'prod-' + Date.now().toString(),
        name: prodForm.name,
        category: prodForm.category,
        categoryId: catId,
        price: Number(prodForm.price),
        originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
        discountPercent: prodForm.discountPercent ? Number(prodForm.discountPercent) : undefined,
        description: prodForm.description,
        image: prodForm.image,
        images: [prodForm.image],
        stock: Number(prodForm.stock),
        rating: 5.0,
        reviewsCount: 0,
        isFeatured: true,
        isFlashSale: false,
        unit: prodForm.unit,
        brand: prodForm.brand
      };
      saveProductsList([newProd, ...products]);
      showToast('New product added to store catalog!');
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this product?')) {
      const remaining = products.filter(p => p.id !== id);
      saveProductsList(remaining);
      showToast('Product deleted from database.', 'info');
    }
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) {
      const remaining = products.filter(p => !selectedProductIds.includes(p.id));
      saveProductsList(remaining);
      setSelectedProductIds([]);
      showToast('Bulk deletion complete.', 'info');
    }
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: 'prod-' + Date.now().toString(),
      name: `${prod.name} (Copy)`
    };
    saveProductsList([duplicated, ...products]);
    showToast(`Duplicated "${prod.name}"!`);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  // CSV Import/Export Support
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    // Generate standard CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Name,Category,Price,OriginalPrice,Discount,Description,Image,Stock,Unit,Brand\n';
    
    products.forEach(p => {
      const row = [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.price,
        p.originalPrice || '',
        p.discountPercent || '',
        `"${p.description.replace(/"/g, '""')}"`,
        p.image,
        p.stock,
        p.unit,
        `"${(p.brand || '').replace(/"/g, '""')}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'shahmeer_products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV database file!');
  };

  const handleImportCSVTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleImportCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      if (lines.length <= 1) return;

      const newProds: Product[] = [];
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parser supporting quotes
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const cleanValues = matches.map(val => val.replace(/^"|"$/g, '').trim());

        if (cleanValues.length < 4) continue;

        const id = cleanValues[0] || 'prod-' + (Date.now() + i).toString();
        const name = cleanValues[1];
        const category = cleanValues[2];
        const price = Number(cleanValues[3]);
        const originalPrice = cleanValues[4] ? Number(cleanValues[4]) : undefined;
        const discountPercent = cleanValues[5] ? Number(cleanValues[5]) : undefined;
        const description = cleanValues[6] || 'Freshly imported grocery.';
        const image = cleanValues[7] || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600';
        const stock = Number(cleanValues[8]) || 10;
        const unit = cleanValues[9] || 'kg';
        const brand = cleanValues[10] || 'Shahmeer Premium';

        newProds.push({
          id,
          name,
          category,
          categoryId: 'cat-1',
          price,
          originalPrice,
          discountPercent,
          description,
          image,
          images: [image],
          stock,
          rating: 5.0,
          reviewsCount: 0,
          isFeatured: true,
          isFlashSale: false,
          unit,
          brand
        });
      }

      if (newProds.length > 0) {
        saveProductsList([...newProds, ...products]);
        showToast(`Successfully imported ${newProds.length} products!`, 'success');
      } else {
        showToast('Failed to parse CSV file. Ensure standard column format.', 'error');
      }
    };
    reader.readAsText(file);
  };


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CATEGORIES MANAGEMENT STATES & LOGIC
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [categorySlugInput, setCategorySlugInput] = useState('');
  const [categoryIconInput, setCategoryIconInput] = useState('Apple');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;

    const slug = categorySlugInput.trim() || categoryNameInput.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: 'cat-' + Date.now().toString(),
      name: categoryNameInput,
      slug,
      icon: categoryIconInput,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=500',
      productsCount: 0
    };

    saveCategoriesList([...categories, newCat]);
    setCategoryNameInput('');
    setCategorySlugInput('');
    showToast(`Category "${newCat.name}" added successfully!`);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Delete this category? Any associated products may lose categorization.')) {
      const remaining = categories.filter(c => c.id !== id);
      saveCategoriesList(remaining);
      showToast('Category deleted.', 'info');
    }
  };


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ORDERS MANAGEMENT STATES & LOGIC
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleUpdateOrderStatus = (orderId: string, status: 'Pending' | 'Completed' | 'Cancelled') => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    saveOrdersList(updated);
    showToast(`Order #${orderId} status updated to ${status}!`);
  };


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COUPONS MANAGEMENT STATES & LOGIC
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(10);
  const [couponDesc, setCouponDesc] = useState('');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const code = couponCode.toUpperCase().trim();
    if (coupons.some(c => c.code === code)) {
      showToast('Coupon code already exists.', 'error');
      return;
    }

    const newCoupon: Coupon = {
      code,
      discountPercent: Number(couponDiscount),
      description: couponDesc || `${couponDiscount}% OFF on catalog`,
      active: true
    };

    saveCouponsList([...coupons, newCoupon]);
    setCouponCode('');
    setCouponDesc('');
    showToast(`Coupon "${code}" generated successfully!`);
  };

  const handleToggleCouponActive = (code: string) => {
    const updated = coupons.map(c => {
      if (c.code === code) {
        return { ...c, active: !c.active };
      }
      return c;
    });
    saveCouponsList(updated);
    showToast('Coupon status updated!');
  };

  const handleDeleteCoupon = (code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon ${code}?`)) {
      const remaining = coupons.filter(c => c.code !== code);
      saveCouponsList(remaining);
      showToast('Coupon removed.', 'info');
    }
  };


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SETTINGS & SEO CONFIG
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [settingsForm, setSettingsForm] = useState<ShopSettings>({ ...shopSettings });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettingsObject(settingsForm);
    showToast('Website configurations and SEO settings saved successfully!', 'success');
  };


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BACKUPS MANAGEMENT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [backupString, setBackupString] = useState('');

  useEffect(() => {
    setBackupString(db.getBackupJSON());
  }, [products, categories, orders, coupons, shopSettings]);

  const handleCopyBackup = () => {
    navigator.clipboard.writeText(backupString);
    showToast('Database JSON backup copied to clipboard!', 'success');
  };

  const handleRestoreBackup = (e: React.FormEvent) => {
    e.preventDefault();
    const backupText = (e.currentTarget.elements.namedItem('restoreInput') as HTMLTextAreaElement).value;
    if (backupText) {
      const success = db.restoreBackup(backupText);
      if (success) {
        loadLocalDB();
        showToast('Complete Store database restored successfully!', 'success');
        e.currentTarget.reset();
      } else {
        showToast('Restore failed. Invalid Backup JSON schema.', 'error');
      }
    }
  };

  const handleResetDatabase = () => {
    if (window.confirm('⚠️ CRITICAL WARNING:\nThis will permanently wipe all orders, products, categories, settings, and reload default factory values. Proceed?')) {
      db.resetDB();
      loadLocalDB();
      showToast('Database reset to defaults successfully.', 'info');
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DASHBOARD CALCULATED METRICS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Completed');
    const pendingOrders = orders.filter(o => o.status === 'Pending');
    
    // Simulate some standard rural visitor stats (usually ~4x of orders)
    const simulatedVisitors = totalOrders * 4 + 85;
    
    // Revenue is sum of all completed orders
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      totalOrders,
      completedOrdersCount: completedOrders.length,
      pendingOrdersCount: pendingOrders.length,
      simulatedVisitors,
      totalRevenue
    };
  }, [orders]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] dark:bg-slate-950 flex transition-colors duration-300 font-sans">
      
      {/* 1. Left Sidebar panel */}
      <aside 
        className={`bg-slate-950 text-slate-400 border-r border-slate-900 transition-all duration-300 flex flex-col justify-between p-5 relative z-20 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col gap-8">
          
          {/* Sidebar Header branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#C7F36B] text-black flex-shrink-0 flex items-center justify-center font-black text-lg shadow-lg">
                S
              </div>
              {!isSidebarCollapsed && (
                <div className="text-left leading-none">
                  <p className="text-xs font-black text-white uppercase tracking-wider">ADMIN PANEL</p>
                  <p className="text-[9px] text-slate-500 font-mono tracking-widest mt-0.5">SaaS SaaS v1.2</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-left font-sans">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-[#C7F36B] text-black shadow-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard Metrics</span>}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'products' 
                  ? 'bg-[#C7F36B] text-black shadow-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4.5 h-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Store Products</span>}
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'categories' 
                  ? 'bg-[#C7F36B] text-black shadow-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderTree className="w-4.5 h-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Categories Map</span>}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'orders' 
                  ? 'bg-[#C7F36B] text-black shadow-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4.5 h-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>WhatsApp Orders</span>}
              {metrics.pendingOrdersCount > 0 && !isSidebarCollapsed && (
                <span className="absolute right-3 bg-rose-500 text-white rounded-full px-2 py-0.5 text-[9px] font-black animate-pulse">
                  {metrics.pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'coupons' 
                  ? 'bg-[#C7F36B] text-black shadow-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Percent className="w-4.5 h-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Store Coupons</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'settings' 
                  ? 'bg-[#C7F36B] text-black shadow-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4.5 h-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>SEO & Settings</span>}
            </button>

            <button
              onClick={() => setActiveTab('backups')}
              className={`flex items-center gap-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'backups' 
                  ? 'bg-[#C7F36B] text-black shadow-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Database className="w-4.5 h-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>DB Backups</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <button
          onClick={() => setAdminLoggedIn(false)}
          className="flex items-center gap-3.5 w-full py-3.5 px-4 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 font-bold text-xs uppercase tracking-wider transition-all text-left"
        >
          <LogOut className="w-4.5 h-4.5" />
          {!isSidebarCollapsed && <span>Log Out Securely</span>}
        </button>
      </aside>

      {/* 2. Main content Stage area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-4 px-6 md:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-2 text-left">
            <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider font-sans">
              {activeTab === 'dashboard' && 'Executive Metrics'}
              {activeTab === 'products' && 'Product Catalogue database'}
              {activeTab === 'categories' && 'Classification mapping'}
              {activeTab === 'orders' && 'Real-time billing dispatches'}
              {activeTab === 'coupons' && 'Discount campaign engine'}
              {activeTab === 'settings' && 'Store details & SEO mappings'}
              {activeTab === 'backups' && 'Cold storage backup layer'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notification alert simulator bell */}
            <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 relative hover:scale-105 active:scale-95 transition-all">
              <Bell className="w-4 h-4" />
              {metrics.pendingOrdersCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Profile pill */}
            <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-[#C7F36B] text-black font-black flex items-center justify-center text-xs">
                A
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
                Shahmeer Executive
              </span>
            </div>

          </div>
        </header>

        {/* Scrollable Sub-Tab layout viewports */}
        <div className="p-6 md:p-8 flex-1">
          
          {/* ====================================
              VIEW: DASHBOARD METRICS & CHARTS
              ==================================== */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8 text-left">
              
              {/* Metrics cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active revenue</span>
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><Percent className="w-4.5 h-4.5" /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-2.5xl font-black text-slate-950 dark:text-white font-sans">Rs. {metrics.totalRevenue}</span>
                    <span className="text-[10px] text-emerald-500 font-extrabold block mt-1 uppercase tracking-wider">▲ 100% COD simulated</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store orders</span>
                    <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500"><ShoppingCart className="w-4.5 h-4.5" /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-2.5xl font-black text-slate-950 dark:text-white font-sans">{metrics.totalOrders} total</span>
                    <span className="text-[10px] text-indigo-500 font-extrabold block mt-1 uppercase tracking-wider">
                      {metrics.pendingOrdersCount} pending • {metrics.completedOrdersCount} complete
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catalogue volume</span>
                    <span className="p-1.5 rounded-lg bg-[#C7F36B]/15 text-[#C7F36B]"><Package className="w-4.5 h-4.5" /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-2.5xl font-black text-slate-950 dark:text-white font-sans">{products.length} Products</span>
                    <span className="text-[10px] text-slate-400 font-extrabold block mt-1 uppercase tracking-wider">across {categories.length} segments</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audited Visitors</span>
                    <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500"><User className="w-4.5 h-4.5" /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-2.5xl font-black text-slate-950 dark:text-white font-sans">{metrics.simulatedVisitors}</span>
                    <span className="text-[10px] text-slate-400 font-extrabold block mt-1 uppercase tracking-wider">Simulated Traffic curves</span>
                  </div>
                </div>

              </div>

              {/* simulated Analytics charts and list split */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                
                {/* Visual Chart representation card (3 cols) */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-1">Store Sales Volume Analytics</h3>
                    <p className="text-[11px] text-slate-400 font-semibold font-mono">Simulated monthly orders curve tracking</p>
                  </div>

                  {/* HTML5 SVG custom simulated charts curve */}
                  <div className="w-full h-64 bg-slate-50 dark:bg-slate-950 rounded-2xl relative p-4 overflow-hidden border dark:border-slate-800/50 flex flex-col justify-between">
                    
                    {/* Background grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                      <div className="border-b dark:border-slate-800 w-full h-1" />
                      <div className="border-b dark:border-slate-800 w-full h-1" />
                      <div className="border-b dark:border-slate-800 w-full h-1" />
                      <div className="border-b dark:border-slate-800 w-full h-1" />
                    </div>

                    {/* Sales graph bars */}
                    <div className="relative flex-1 flex items-end justify-between gap-3 px-4 z-10">
                      {[
                        { month: 'Jan', orders: 12, rev: 4500 },
                        { month: 'Feb', orders: 18, rev: 6200 },
                        { month: 'Mar', orders: 24, rev: 8900 },
                        { month: 'Apr', orders: 35, rev: 14500 },
                        { month: 'May', orders: 48, rev: 18900 },
                        { month: 'Jun', orders: 60, rev: 25000 },
                        { month: 'Jul', orders: 85, rev: 32000 }
                      ].map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                          <div className="text-[10px] text-[#C7F36B] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-1.5 py-0.5 rounded -mt-6">
                            Rs.{bar.rev}
                          </div>
                          
                          {/* Animated bar pill */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(bar.rev / 35000) * 100}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="w-full bg-[#C7F36B]/20 border border-[#C7F36B]/30 group-hover:bg-[#C7F36B] hover:scale-105 rounded-t-lg transition-all"
                          />
                          <span className="text-[10px] font-bold text-slate-400 font-mono">{bar.month}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Best selling products (2 cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-1 font-sans">Best Sellers</h3>
                    <p className="text-[11px] text-slate-400 font-semibold font-mono">Top ranked by metrics rating score</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {products.slice(0, 4).map((prod) => (
                      <div key={prod.id} className="flex items-center gap-3.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800/30">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-white" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-950 dark:text-white truncate">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Rating: {prod.rating} ★ • {prod.reviewsCount} reviews</p>
                        </div>
                        <span className="text-xs font-extrabold text-[#C7F36B] font-mono shrink-0">Rs. {prod.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* ====================================
              VIEW: MANAGE PRODUCTS CATALOG
              ==================================== */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-6 text-left">
              
              {/* Product Tools bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                
                {/* Search in admin */}
                <div className="relative w-full md:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search database..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  {/* CSV Actions */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportCSVUpload}
                    accept=".csv"
                    className="hidden"
                  />
                  
                  <button
                    onClick={handleImportCSVTrigger}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all active:scale-95"
                    title="Import CSV database template"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import CSV</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all active:scale-95"
                    title="Export complete catalog CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  {selectedProductIds.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold transition-all hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Bulk Delete ({selectedProductIds.length})</span>
                    </button>
                  )}

                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-[#C7F36B] text-black text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Interactive Table Grid */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-4.5 px-5 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={handleToggleSelectAll}
                            className="rounded accent-[#C7F36B]"
                          />
                        </th>
                        <th className="py-4.5 px-4">Product Details</th>
                        <th className="py-4.5 px-4">Category</th>
                        <th className="py-4.5 px-4">Price / Unit</th>
                        <th className="py-4.5 px-4">Stock level</th>
                        <th className="py-4.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                          <td className="py-4 px-5 text-center">
                            <input
                              type="checkbox"
                              checked={selectedProductIds.includes(p.id)}
                              onChange={() => handleSelectProduct(p.id)}
                              className="rounded accent-[#C7F36B]"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-50 flex-shrink-0" referrerPolicy="no-referrer" />
                              <div className="min-w-0">
                                <p className="font-extrabold text-slate-950 dark:text-white truncate max-w-[180px]">{p.name}</p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{p.brand || 'No brand'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">{p.category}</td>
                          <td className="py-4 px-4">
                            <span className="font-extrabold text-slate-950 dark:text-white font-mono">Rs.{p.price}</span> / {p.unit}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-bold font-mono ${p.stock <= 0 ? 'text-rose-500' : p.stock < 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {p.stock} Qty
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right flex items-center justify-end gap-1.5 mt-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                              title="Edit product"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                              title="Duplicate product"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ====================================
              VIEW: MANAGE CATEGORIES MAP
              ==================================== */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              
              {/* Left Column: Category adding form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
                <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b dark:border-slate-800">
                  Add New Category Map
                </h3>

                <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Fruits & Greens..."
                      required
                      value={categoryNameInput}
                      onChange={(e) => setCategoryNameInput(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Category Slug (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. fruits-greens..."
                      value={categorySlugInput}
                      onChange={(e) => setCategorySlugInput(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Icon Representation</label>
                    <select
                      value={categoryIconInput}
                      onChange={(e) => setCategoryIconInput(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    >
                      <option value="Apple">Apple (Fruits / Vegetables)</option>
                      <option value="Milk">Milk (Dairy / Butter)</option>
                      <option value="Package">Package (Grains / Flour / Pantry)</option>
                      <option value="Coffee">Coffee (Beverages / Drinks)</option>
                      <option value="Cookie">Cookie (Sweets / Snacks)</option>
                      <option value="Sparkles">Sparkles (Mirpurkhas Specialties)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#C7F36B] text-black font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Add Category
                  </button>
                </form>
              </div>

              {/* Right Column: Categories lists table (2 cols) */}
              <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b dark:border-slate-800">
                  Database Categories Map ({categories.length})
                </h3>

                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C7F36B]/15 text-[#C7F36B] flex items-center justify-center font-bold">
                          {cat.icon === 'Apple' && <Apple className="w-4.5 h-4.5" />}
                          {cat.icon === 'Milk' && <Milk className="w-4.5 h-4.5" />}
                          {cat.icon === 'Package' && <Package className="w-4.5 h-4.5" />}
                          {cat.icon === 'Coffee' && <Coffee className="w-4.5 h-4.5" />}
                          {cat.icon === 'Cookie' && <Cookie className="w-4.5 h-4.5" />}
                          {cat.icon === 'Sparkles' && <Sparkles className="w-4.5 h-4.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-950 dark:text-white">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Slug: {cat.slug}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.productsCount} products map</span>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete category mapping"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}


          {/* ====================================
              VIEW: ORDERS LIST & LOGS
              ==================================== */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6 text-left">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b dark:border-slate-800">
                  WhatsApp Orders Logs ({orders.length})
                </h3>

                {orders.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="bg-slate-50 dark:bg-slate-950 border dark:border-slate-800/50 rounded-2xl p-5 flex flex-col gap-4"
                      >
                        {/* Order Upper meta */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b dark:border-slate-800 pb-3">
                          <div>
                            <span className="font-extrabold text-slate-950 dark:text-white">Order ID: #{o.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono ml-3">{new Date(o.date).toLocaleString('en-PK')}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                              o.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : o.status === 'Cancelled'
                                ? 'bg-rose-500/10 text-rose-500'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {o.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5" />}
                              {o.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                              {o.status === 'Pending' && <Clock className="w-3.5 h-3.5 animate-spin-slow" />}
                              <span>{o.status}</span>
                            </span>

                            {/* Status triggers */}
                            {o.status === 'Pending' && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'Completed')}
                                  className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-extrabold uppercase hover:opacity-85"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'Cancelled')}
                                  className="px-2 py-1 bg-rose-500 text-white rounded text-[10px] font-extrabold uppercase hover:opacity-85"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Customer details info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 mb-0.5">Billing Client Name</p>
                            <p className="text-slate-900 dark:text-white font-bold">{o.customerName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 mb-0.5">Contact WhatsApp</p>
                            <a href={`https://wa.me/${o.phone}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white font-mono hover:underline block">
                              {o.phone}
                            </a>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 mb-0.5">Shipping Location Address</p>
                            <p className="text-slate-900 dark:text-white truncate" title={o.address}>{o.address}</p>
                          </div>
                        </div>

                        {/* Items listed */}
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 text-xs">
                          <p className="text-[9px] uppercase font-black text-slate-400 mb-2">Cart checklist summary</p>
                          <div className="flex flex-col gap-2">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                                <span>{it.productName} (Qty: {it.quantity} {it.unit})</span>
                                <span className="font-mono text-slate-950 dark:text-white">Rs.{it.price * it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Subtotal / Billing calculation */}
                        <div className="flex justify-between items-baseline border-t dark:border-slate-800 pt-3 mt-1 text-xs">
                          <span className="text-slate-400 font-semibold">Coupon: {o.couponCode || 'None'} • Delivery: Rs.{o.deliveryCharges}</span>
                          <span className="text-sm font-extrabold text-slate-950 dark:text-white">
                            Total Paid (COD): <strong className="text-[#C7F36B] font-black">Rs. {o.total}</strong>
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 italic">No orders received on website yet. Checkout logs will populate here instantly when users order.</p>
                )}
              </div>
            </div>
          )}


          {/* ====================================
              VIEW: MANAGE STORE COUPONS
              ==================================== */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              
              {/* Left Form: Create Promo Coupon */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
                <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b dark:border-slate-800">
                  Generate Promo Coupon
                </h3>

                <form onSubmit={handleAddCoupon} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Coupon Promo Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SINDH25..."
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-extrabold uppercase focus:outline-none focus:border-[#C7F36B] dark:text-white font-mono tracking-widest"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Discount Percentage (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      required
                      value={couponDiscount}
                      onChange={(e) => setCouponDiscount(Number(e.target.value))}
                      className="w-full px-4.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Campaign Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Save 25% on Sindhri Mangoes..."
                      value={couponDesc}
                      onChange={(e) => setCouponDesc(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#C7F36B] text-black font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Generate Coupon
                  </button>
                </form>
              </div>

              {/* Right Table: Active coupons map (2 cols) */}
              <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b dark:border-slate-800">
                  Database Coupon campaigns ({coupons.length})
                </h3>

                <div className="flex flex-col gap-3">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800/40 text-left"
                    >
                      <div>
                        <span className="bg-[#C7F36B]/15 text-slate-900 dark:text-[#C7F36B] text-[10px] font-black px-2.5 py-1 rounded">
                          Save {c.discountPercent}% OFF
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-950 dark:text-white font-mono mt-2 tracking-wider uppercase">
                          {c.code}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{c.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleCouponActive(c.code)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                            c.active
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          }`}
                        >
                          {c.active ? 'Active' : 'Disabled'}
                        </button>

                        <button
                          onClick={() => handleDeleteCoupon(c.code)}
                          className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Remove coupon Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}


          {/* ====================================
              VIEW: WEBSITE CONFIGS & SEO
              ==================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm text-left">
              <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-6 pb-2 border-b dark:border-slate-800">
                Configure Shop details & SEO Meta Tags
              </h3>

              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Shop Metadata */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-800 pb-1.5">Shop Information</h4>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Shop Name</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.shopName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                      className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Location Address</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.location}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">WhatsApp Line</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Delivery Surcharge (Rs.)</label>
                      <input
                        type="number"
                        required
                        value={settingsForm.deliveryCharges}
                        onChange={(e) => setSettingsForm({ ...settingsForm, deliveryCharges: Number(e.target.value) })}
                        className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Announcement Bar text */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Announcement text overlay</span>
                      <input
                        type="checkbox"
                        checked={settingsForm.announcementActive}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                        className="rounded accent-[#C7F36B]"
                      />
                    </div>
                    
                    <input
                      type="text"
                      disabled={!settingsForm.announcementActive}
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      className="w-full px-4.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white disabled:opacity-50"
                    />
                  </div>

                </div>

                {/* SEO and Custom Codes (Right column) */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-800 pb-1.5">SEO & Search Crawling</h4>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Google Meta Search Title</label>
                    <input
                      type="text"
                      value={settingsForm.metaTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metaTitle: e.target.value })}
                      className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Google Meta Search Description</label>
                    <textarea
                      rows={2}
                      value={settingsForm.metaDescription}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                      className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Meta Keywords Index (Comma separated)</label>
                    <input
                      type="text"
                      value={settingsForm.metaKeywords}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metaKeywords: e.target.value })}
                      className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 border-t dark:border-slate-800 pt-6 mt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-[#C7F36B] text-black text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Website Configuration</span>
                  </button>
                </div>

              </form>
            </div>
          )}


          {/* ====================================
              VIEW: DATABASE COLD BACKUPS
              ==================================== */}
          {activeTab === 'backups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              {/* Export backup */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider pb-2 border-b dark:border-slate-800">
                  Export Cold Storage Backup
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Copy this compiled JSON schema to keep a cold-backup of all your custom products, category setups, coupon structures, settings, and orders history.
                </p>

                <textarea
                  readOnly
                  rows={8}
                  value={backupString}
                  className="w-full p-4.5 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 text-[10px] font-mono text-slate-500 focus:outline-none"
                  onClick={(e) => (e.currentTarget as HTMLTextAreaElement).select()}
                />

                <button
                  onClick={handleCopyBackup}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-[#C7F36B] hover:text-black rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete Backup JSON</span>
                </button>
              </div>

              {/* Restore / wipe backup */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 h-fit">
                <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider pb-2 border-b dark:border-slate-800">
                  Restore / Reset database layers
                </h3>
                
                <form onSubmit={handleRestoreBackup} className="flex flex-col gap-4">
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    Paste a previously copied backup JSON string here to reload all details. ⚠️ This will overwrite any current database state.
                  </p>

                  <textarea
                    name="restoreInput"
                    placeholder="Paste backup JSON string here..."
                    required
                    rows={4}
                    className="w-full p-4.5 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 text-[10px] font-mono focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-white"
                  />

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload & Restore Database</span>
                  </button>
                </form>

                <div className="border-t dark:border-slate-800 pt-4 mt-2">
                  <p className="text-xs text-rose-500 leading-relaxed font-semibold mb-3">
                    Danger zone action:
                  </p>
                  <button
                    onClick={handleResetDatabase}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Wipe Database & Seed Factory Defaults</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* 3. Add/Edit Product Modal Dialog overlay */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setIsProductModalOpen(false)}
            />

            {/* Modal stage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[28px] border dark:border-slate-800 shadow-2xl overflow-hidden z-10 p-6 text-left max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-6 pb-2 border-b dark:border-slate-800">
                {editingProduct ? `Edit Details: ${editingProduct.name}` : 'Catalog New Product'}
              </h3>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Store Category</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Original Price</label>
                    <input
                      type="number"
                      value={prodForm.originalPrice}
                      onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Discount %</label>
                    <input
                      type="number"
                      value={prodForm.discountPercent}
                      onChange={(e) => setProdForm({ ...prodForm, discountPercent: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Initial Stock</label>
                    <input
                      type="number"
                      required
                      value={prodForm.stock}
                      onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Packaging Unit (e.g. kg, dozen)</label>
                    <input
                      type="text"
                      required
                      value={prodForm.unit}
                      onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider">Brand Name (Optional)</label>
                    <input
                      type="text"
                      value={prodForm.brand}
                      onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider">Image Unsplash URL</label>
                  <input
                    type="url"
                    required
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider">Detailed Description</label>
                  <textarea
                    rows={3}
                    required
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 focus:outline-none focus:border-[#C7F36B] dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2.5 border-t dark:border-slate-800 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C7F36B] text-black rounded-xl font-extrabold uppercase tracking-wide"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
