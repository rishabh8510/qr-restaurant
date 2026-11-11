export type Role = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  openingHours: Record<string, string> | null;
  socialLinks: Record<string, string> | null;
  settings: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  category?: { id: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  oldPrice: number | string | null;
  discount: string | null;
  categoryId: string | null;
  subCategoryId: string | null;
  image: string | null;
  weight: string | null;
  prepTime: string | null;
  isVeg: boolean;
  isEgg: boolean;
  isVegan: boolean;
  isAvailable: boolean;
  isActive: boolean;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[] | null;
  rating: number | string | null;
  reviewCount: number;
  orderCount: number;
  metadata: Record<string, unknown> | null;
  category?: { id: string; name: string; slug?: string } | null;
  subCategory?: { id: string; name: string; slug?: string; categoryId?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

// export interface Offer {
//   id: string;
//   title: string;
//   description: string | null;
//   discountType: 'percentage' | 'fixed';
//   discountValue: number | string;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   applicableTo: 'all' | 'products' | 'categories';
//   productIds: string[] | null;
//   categoryIds: string[] | null;
//   image: string | null;
//   createdAt?: string;
//   updatedAt?: string;
// }


export interface Offer {
  id: string;
  title: string;
  description: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number | string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableTo: 'all' | 'products' | 'categories';
  productIds: string[] | null;
  categoryIds: string[] | null;
  image: string | null;
  offerKind?: 'menu' | 'loyalty';
  minOrderCount?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number | string;
  image?: string | null;
  productId?: string;
}

export interface OrderPricingMeta {
  cgst?: number;
  sgst?: number;
  cgstPercent?: number;
  sgstPercent?: number;
  deliveryCharge?: number;
  packingCharge?: number;
  discountLabel?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string | null;
  status: OrderStatus | string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  orderType?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  total: number | string;
  subtotal?: number | string;
  tax?: number | string;
  discount?: number | string;
  items: OrderItem[];
  notes?: string | null;
  assignedStaffId?: string | null;
  assignedStaff?: { id: string; name: string } | null;
  orderSource?: string;
  createdAt: string;
  updatedAt?: string;
  pricingMeta?: OrderPricingMeta | null;
}

export interface DashboardStats {
  totalStaff: number;
  totalCategories: number;
  totalProducts: number;
  activeProducts: number;
  activeOffers: number;
  orders?: {
    today: { orderCount: number; revenue: number };
    week: { orderCount: number; revenue: number };
    month: { orderCount: number; revenue: number };
    year: { orderCount: number; revenue: number };
    allTime: { orderCount: number; revenue: number };
  };
  byStatus?: Record<string, number>;
  topItems?: {
    name: string;
    productId: string;
    quantity: number;
    revenue: number;
  }[];
  recentOrders?: {
    id: string;
    orderNumber: string;
    tableNumber?: string | null;
    status: string;
    total: number | string;
    customerName?: string | null;
    customerPhone?: string | null;
    orderType?: string;
    createdAt: string;
  }[];
  last7Days?: { day: string; orders: number; revenue: number }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}