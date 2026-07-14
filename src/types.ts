/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  description: string;
  image: string; // main image Unsplash url
  images: string[]; // gallery images
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isFlashSale: boolean;
  unit: string; // e.g. "kg", "pack", "liter", "1 dozen"
  brand?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name (as string)
  slug: string;
  image: string;
  productsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  date: string; // ISO string
  customerName: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  subtotal: number;
  deliveryCharges: number;
  couponCode: string;
  discountAmount: number;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ShopSettings {
  shopName: string;
  location: string;
  whatsappNumber: string;
  deliveryCharges: number;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  announcementActive: boolean;
  announcementText: string;
  customCss?: string;
  customJs?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}
