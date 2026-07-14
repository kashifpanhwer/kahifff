/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Heart, ShoppingBag, MessageCircle, Star, Share2, 
  ChevronRight, Calendar, ArrowLeft, ArrowRight, Sparkles, Send, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../storage/db';

export const ProductDetails: React.FC = () => {
  const {
    selectedProduct,
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    settings,
    showToast
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Review form states
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [authorRating, setAuthorRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Sync reviews and state on product change
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setActiveImageIndex(0);
      
      // Load reviews matching this product ID from local database
      const allReviews = db.getReviews();
      const matched = allReviews.filter((r: any) => r.productId === selectedProduct.id);
      setReviewsList(matched);
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border rounded-3xl p-8 shadow-sm">
          <p className="text-sm text-slate-500 font-bold">No product selected.</p>
          <button onClick={() => navigateTo('products')} className="mt-6 bg-[#C7F36B] text-black font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl">
            Go to Catalog
          </button>
        </div>
      </div>
    );
  }

  const product = selectedProduct;
  const wish = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0;

  // Settle related products (same category, excluding active one)
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#product-details/${product.id}`);
    showToast('Product link copied to clipboard!', 'success');
  };

  const handleWhatsAppOrder = () => {
    const text = `Assalamu Alaikum Shahmeer Shop, I want to order:\n\n*${product.name}*\nQty: ${quantity} ${product.unit}\nPrice: Rs. ${product.price}/${product.unit}\nTotal: Rs. ${product.price * quantity}\n\nPlease deliver to my address.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) {
      showToast('Please fill out all the fields in review form.', 'error');
      return;
    }

    setIsSubmittingReview(true);

    setTimeout(() => {
      const newReview = {
        id: 'rev-' + Date.now().toString(),
        productId: product.id,
        author: authorName,
        rating: authorRating,
        comment: commentText,
        date: new Date().toISOString().split('T')[0]
      };

      const allReviews = db.getReviews();
      allReviews.unshift(newReview);
      db.saveReviews(allReviews);

      setReviewsList(prev => [newReview, ...prev]);
      setAuthorName('');
      setAuthorRating(5);
      setCommentText('');
      setIsSubmittingReview(false);
      showToast('Thank you! Your review has been submitted.', 'success');

      // Update product rating metadata locally
      const storedProds = db.getProducts();
      const updatedProds = storedProds.map(p => {
        if (p.id === product.id) {
          const matchedReviews = allReviews.filter((r: any) => r.productId === product.id);
          const avgRating = Number((matchedReviews.reduce((sum, r) => sum + r.rating, 0) / matchedReviews.length).toFixed(1));
          return { ...p, rating: avgRating, reviewsCount: matchedReviews.length };
        }
        return p;
      });
      db.saveProducts(updatedProds);
    }, 1000);
  };

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-10 px-4 md:px-8 transition-colors duration-300 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Navigation Breadcrumb bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-900 pb-4">
          <button
            onClick={() => navigateTo('products')}
            className="flex items-center gap-1.5 hover:text-[#C7F36B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Shop</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#C7F36B] truncate max-w-[150px]">{product.name}</span>
          </div>
        </div>

        {/* Upper Grid Layout: Gallery + Description info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Premium Gallery Layout */}
          <div className="flex flex-col gap-4">
            
            {/* Main Active image container */}
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10">
                {product.discountPercent && (
                  <span className="bg-rose-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              <img
                src={product.images && product.images.length > 0 ? product.images[activeImageIndex] : product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl shadow-sm bg-slate-50"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnails list */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                      idx === activeImageIndex 
                        ? 'border-[#C7F36B] scale-105' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right: Pricing, Description, Specs & Actions */}
          <div className="flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 md:p-8 shadow-sm">
            
            <div className="flex flex-col gap-4">
              
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C7F36B] bg-[#C7F36B]/10 dark:bg-[#C7F36B]/5 px-3 py-1 rounded-lg">
                  {product.category}
                </span>
                
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({reviewsList.length} customer reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white leading-tight font-sans">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono uppercase tracking-wider">
                <span>Brand: <strong className="text-slate-900 dark:text-white">{product.brand || 'Local Specialty'}</strong></span>
                <span>•</span>
                <span>Packaging: <strong className="text-slate-900 dark:text-white">{product.unit}</strong></span>
              </div>

              {/* Pricing section */}
              <div className="flex items-baseline gap-4 mt-2">
                <span className="text-3.5xl font-black text-slate-950 dark:text-white font-sans">
                  Rs. {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-400 line-through font-medium">
                    Rs. {product.originalPrice}
                  </span>
                )}
                <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  isOutOfStock 
                    ? 'bg-rose-500/10 text-rose-500' 
                    : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {isOutOfStock ? 'Sold Out' : 'Ready to Ship'}
                </span>
              </div>

              {/* Description body */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2">Product Description</h4>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

              {/* Delivery specifications */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400 mt-2 font-semibold">
                <div className="flex items-center justify-between">
                  <span>Available stock quantity</span>
                  <span className="font-extrabold text-slate-950 dark:text-white">{product.stock} {product.unit}(s) ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Home Delivery Areas</span>
                  <span className="font-extrabold text-[#C7F36B] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Village Imzaiz Panhwar & Mirpurkhas</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Qty and Order Call-To-Action controls */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Select quantity</span>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border dark:border-slate-800">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-[#C7F36B] hover:text-black transition-colors disabled:opacity-50 shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-black text-slate-800 dark:text-slate-200">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-[#C7F36B] hover:text-black transition-colors disabled:opacity-50 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Large CTAs */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product, quantity)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-[#C7F36B] hover:text-black dark:hover:bg-[#C7F36B] dark:hover:text-black shadow-slate-950/5'
                    }`}
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                    <span>Add {quantity} To Cart • Rs. {product.price * quantity}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-500 dark:text-slate-400 transition-all shadow-md"
                    title="Wishlist Toggle"
                  >
                    <Heart className={`w-5 h-5 ${wish ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Direct Order via WhatsApp</span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-3 px-1 uppercase tracking-wider">
                  <button onClick={handleShare} className="flex items-center gap-1 hover:text-[#C7F36B]">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share This Product Link</span>
                  </button>
                  <span>Ready Local Delivery</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Middle Tab area: Reviews Section & Review adding form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start border-t border-slate-150 dark:border-slate-800 pt-10 mt-6">
          
          {/* Left 3 cols: Display reviews */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider text-left border-b dark:border-slate-800 pb-3">
              Customer Reviews ({reviewsList.length})
            </h3>

            {reviewsList.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-xs font-black text-slate-950 dark:text-white">{rev.author}</h5>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 italic text-left">No reviews yet for this product. Be the first to share your experience!</p>
            )}
          </div>

          {/* Right 2 cols: Write a Review Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b dark:border-slate-800">
                Write a Customer Review
              </h3>

              <form onSubmit={handleAddReview} className="flex flex-col gap-4 text-left">
                
                {/* Author name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white"
                  />
                </div>

                {/* Rating selection stars */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Rating (1 - 5 Stars)</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setAuthorRating(starValue)}
                        className="p-1 hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${starValue <= authorRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Detailed Comment</label>
                  <textarea
                    rows={3}
                    placeholder="Share your experience about the freshness, delivery, or packaging..."
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-[#C7F36B] text-black font-extrabold text-xs tracking-wider uppercase py-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>

              </form>
            </div>
          </div>

        </div>

        {/* Lower section: Related Products */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-6 border-t border-slate-100 dark:border-slate-800 pt-10 mt-6">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider text-left flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C7F36B]" />
              <span>Related Fresh Groceries</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
