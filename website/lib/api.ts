const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
      'http://backend:5000/api';

export type PublicCategory = {
  id: string;
  name: string;
  slug?: string | null;
  image: string;
};

export type PublicSubCategory = {
  id: string;
  name: string;
  slug?: string | null;
  title: string;
  description: string;
  categoryId: string;
  image?: string | null;
};

export type PublicOfferOnItem = {
  id: string;
  title: string;
  description?: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  savings?: number;
  startDate?: string;
  endDate?: string;
};

export type PublicItem = {
  id: string;
  category: string | null;
  subCategory: string | null;
  name: string;
  price: number;
  originalPrice?: number;
  oldPrice: number | null;
  discount?: string | null;
  offer?: PublicOfferOnItem | null;
  weight: string;
  time: string;
  description: string;
  likes: number;
  available: boolean;
  isVegan: boolean;
  isVeg?: boolean;
  isEgg?: boolean;
  isNew: boolean;
  isBestseller?: boolean;
  tags?: string[];
  image: string;
};

export type PublicOffer = {
  id: string;
  title: string;
  description?: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableTo: string;
  productIds?: string[] | null;
  categoryIds?: string[] | null;
  image?: string | null;
};

export type PublicMenu = {
  categories: PublicCategory[];
  subCategories: PublicSubCategory[];
  items: PublicItem[];
  offers?: PublicOffer[];
};

export type PublicBanner = {
  id: string;
  image: string;
  title?: string | null;
  link?: string | null;
};

export type PublicDish = {
  id: string;
  name: string;
  price: number;
  image: string;
  productId?: string | null;
};

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as T;
  } catch {
    return null;
  }
}

export async function fetchPublicMenu(): Promise<PublicMenu | null> {
  return getJson<PublicMenu>('/public/menu');
}

export async function fetchPublicBanners(): Promise<PublicBanner[]> {
  const data = await getJson<PublicBanner[]>('/public/banners');
  return data || [];
}

export async function fetchPublicDishOfTheDay(): Promise<PublicDish[]> {
  const data = await getJson<PublicDish[]>('/public/dish-of-the-day');
  return data || [];
}

export async function fetchPublicOffers(): Promise<PublicOffer[]> {
  const data = await getJson<PublicOffer[]>('/public/offers');
  return data || [];
}

export type PlaceOrderPayload = {
  tableNumber?: string | null;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderType: 'delivery' | 'dining' | 'pickup';
  paymentMethod: 'cash' | 'card' | 'upi' | 'online';
  notes?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
  }[];
};

export async function placeOrder(payload: PlaceOrderPayload, token?: string | null) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/public/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to place order');
  }
  return json.data;
}

export async function fetchMyOrders(token: string) {
  const res = await fetch(`${API_BASE}/orders/me/list`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load orders');
  const data = json.data;
  return Array.isArray(data) ? data : [];
}

export type WebsiteSettings = {
  showBanner: boolean;
  showDishOfTheDay: boolean;
  showOffers: boolean;
  showSearch: boolean;
  showCategoryFilter: boolean;
  showSubCategoryFilter: boolean;
  filters: {
    veg: boolean;
    nonveg: boolean;
    vegan: boolean;
    egg: boolean;
    new: boolean;
    bestseller: boolean;
  };
};

export type PublicSettings = {
  name?: string | null;
  logo?: string | null;
  website: WebsiteSettings;
};

export async function fetchPublicSettings(): Promise<PublicSettings | null> {
  return getJson<PublicSettings>('/public/settings');
}

function guestKey(): string {
  if (typeof window === 'undefined') return '';
  let k = localStorage.getItem('guest_key');
  if (!k) {
    k = 'g_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('guest_key', k);
  }
  return k;
}

export async function likeProduct(
  productId: string,
  token?: string | null,
  action: 'like' | 'unlike' = 'like'
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/public/products/${productId}/like`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      guestKey: guestKey(),
      action,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to like');
  return json.data as { likes: number; liked: boolean; alreadyLiked?: boolean };
}

export type OrderQuote = {
  subtotal: number;
  discount: number;
  tax: number;
  taxPercent: number;
  cgst: number;
  sgst: number;
  cgstPercent: number;
  sgstPercent: number;
  deliveryCharge: number;
  packingCharge: number;
  total: number;
  isFirstOrder: boolean;
  discountLabel: string | null;
  firstOrderDiscountPercent: number;
  firstOrderDiscountEnabled: boolean;
};

export async function quoteOrder(
  items: PlaceOrderPayload['items'],
  token?: string | null,
  orderType?: 'delivery' | 'dining' | 'pickup'
): Promise<OrderQuote> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/public/orders/quote`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ items, orderType }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to quote');
  return json.data as OrderQuote;
}