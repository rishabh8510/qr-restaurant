import { Op } from 'sequelize';
import {
  Category,
  SubCategory,
  Product,
  Order,
  Banner,
  DishOfTheDay,
  Offer,
  Restaurant,
  ProductLike,
} from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
import { orderService } from '../services/OrderService';
import { AuthRequest } from '../types';

export const DEFAULT_WEBSITE_SETTINGS = {
  showBanner: true,
  showDishOfTheDay: true,
  showOffers: true,
  showSearch: true,
  showCategoryFilter: true,
  showSubCategoryFilter: true,
  filters: {
    veg: true,
    nonveg: true,
    vegan: true,
    egg: true,
    new: true,
    bestseller: true,
  },
  pricing: {
    taxPercent: 0,
    firstOrderDiscountPercent: 0,
    firstOrderDiscountEnabled: false,
    deliveryCharge: 0,
    packingCharge: 0,
  },
};

export function normalizeWebsiteSettings(raw: unknown) {
  const base = {
    ...DEFAULT_WEBSITE_SETTINGS,
    filters: { ...DEFAULT_WEBSITE_SETTINGS.filters },
    pricing: { ...DEFAULT_WEBSITE_SETTINGS.pricing },
  };
  if (!raw || typeof raw !== 'object') return base;
  const s = raw as Record<string, unknown>;
  const website = (s.website && typeof s.website === 'object' ? s.website : s) as Record<
    string,
    unknown
  >;
  if (typeof website.showBanner === 'boolean') base.showBanner = website.showBanner;
  if (typeof website.showDishOfTheDay === 'boolean') base.showDishOfTheDay = website.showDishOfTheDay;
  if (typeof website.showOffers === 'boolean') base.showOffers = website.showOffers;
  if (typeof website.showSearch === 'boolean') base.showSearch = website.showSearch;
  if (typeof website.showCategoryFilter === 'boolean')
    base.showCategoryFilter = website.showCategoryFilter;
  if (typeof website.showSubCategoryFilter === 'boolean')
    base.showSubCategoryFilter = website.showSubCategoryFilter;
  if (website.filters && typeof website.filters === 'object') {
    const f = website.filters as Record<string, unknown>;
    for (const key of Object.keys(base.filters) as (keyof typeof base.filters)[]) {
      if (typeof f[key] === 'boolean') base.filters[key] = f[key] as boolean;
    }
  }
  if (website.pricing && typeof website.pricing === 'object') {
    const p = website.pricing as Record<string, unknown>;
    if (typeof p.deliveryCharge === 'number') base.pricing.deliveryCharge = p.deliveryCharge;
    if (typeof p.packingCharge === 'number') base.pricing.packingCharge = p.packingCharge;
  }
  // Enforce 0 tax and no discount
  base.pricing.taxPercent = 0;
  base.pricing.firstOrderDiscountPercent = 0;
  base.pricing.firstOrderDiscountEnabled = false;
  return base;
}

function getActiveOffersForProduct(
  offers: Offer[],
  productId: string,
  categoryId: string | null
): {
  id: string;
  title: string;
  description: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: Date;
  endDate: Date;
} | null {
  const now = new Date();
  const applicable = offers.filter((o) => {
    if (!o.isActive) return false;
    if (o.endDate && new Date(o.endDate) < now) return false;
    if (!o.applicableTo || o.applicableTo === 'all') return true;
    if (o.applicableTo === 'products') {
      const pids = Array.isArray(o.productIds) ? o.productIds : [];
      return pids.includes(productId);
    }
    if (o.applicableTo === 'categories') {
      const cids = Array.isArray(o.categoryIds) ? o.categoryIds : [];
      return Boolean(categoryId && cids.includes(categoryId));
    }
    return false;
  });
  if (applicable.length === 0) return null;
  applicable.sort((a, b) => Number(b.discountValue) - Number(a.discountValue));
  const best = applicable[0];
  return {
    id: best.id,
    title: best.title,
    description: best.description,
    discountType: best.discountType,
    discountValue: Number(best.discountValue),
    startDate: best.startDate,
    endDate: best.endDate,
  };
}

function applyOfferPrice(
  price: number,
  offer: { discountType: 'percentage' | 'fixed'; discountValue: number } | null
): { finalPrice: number; savings: number } {
  if (!offer) return { finalPrice: price, savings: 0 };
  let final = price;
  if (offer.discountType === 'percentage') {
    final = Math.max(0, price * (1 - Number(offer.discountValue) / 100));
  } else {
    final = Math.max(0, price - Number(offer.discountValue));
  }
  final = Math.round(final * 100) / 100;
  return { finalPrice: final, savings: Math.round((price - final) * 100) / 100 };
}

export const getPublicMenu = asyncHandler(async (_req, res) => {
  const now = new Date();
  const [categories, subCategories, products, offers] = await Promise.all([
    Category.findAll({
      where: { isActive: true },
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    }),
    SubCategory.findAll({
      where: { isActive: true },
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    }),
    Product.findAll({
      where: { isActive: true, isAvailable: true },
      order: [['name', 'ASC']],
    }),
    Offer.findAll({
      where: {
        isActive: true,
        endDate: { [Op.gte]: now },
      },
      order: [['createdAt', 'DESC']],
    }),
  ]);

  res.json({
    success: true,
    data: {
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image:
          c.image ||
          'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
      })),
      subCategories: subCategories.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        title: s.name,
        description: s.description || '',
        categoryId: s.categoryId,
        image: s.image,
      })),
      items: products.map((p) => {
        const basePrice = Number(p.price);
        return {
          id: p.id,
          category: p.categoryId,
          subCategory: p.subCategoryId,
          name: p.name,
          price: basePrice,
          originalPrice: basePrice,
          oldPrice: null,
          discount: null,
          offer: null,
          weight: p.weight || '',
          time: p.prepTime || 'N/A',
          description: p.description || '',
          likes: p.reviewCount || 0,
          available: p.isAvailable,
          isVegan: p.isVegan,
          isVeg: p.isVeg,
          isEgg: p.isEgg,
          isNew: p.isNew,
          isBestseller: p.isBestseller,
          tags: p.tags || [],
          image:
            p.image ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
        };
      }),
      offers: offers.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        discountType: o.discountType,
        discountValue: Number(o.discountValue),
        startDate: o.startDate,
        endDate: o.endDate,
        applicableTo: o.applicableTo,
        productIds: o.productIds,
        categoryIds: o.categoryIds,
        image: o.image,
      })),
    },
  });
});

export const getPublicSettings = asyncHandler(async (_req, res) => {
  const restaurant = await Restaurant.findOne();
  const website = normalizeWebsiteSettings(restaurant?.settings || null);
  res.json({
    success: true,
    data: {
      name: restaurant?.name || null,
      logo: restaurant?.logo || null,
      website,
    },
  });
});

export const getPublicBanners = asyncHandler(async (_req, res) => {
  const restaurant = await Restaurant.findOne();
  const website = normalizeWebsiteSettings(restaurant?.settings || null);
  if (!website.showBanner) {
    res.json({ success: true, data: [] });
    return;
  }
  const rows = await Banner.findAll({
    where: { isActive: true },
    order: [
      ['sortOrder', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });
  res.json({
    success: true,
    data: rows.map((b) => ({
      id: b.id,
      image: b.image,
      title: b.title,
      link: b.link,
    })),
  });
});

export const getPublicDishOfTheDay = asyncHandler(async (_req, res) => {
  const restaurant = await Restaurant.findOne();
  const website = normalizeWebsiteSettings(restaurant?.settings || null);
  if (!website.showDishOfTheDay) {
    res.json({ success: true, data: [] });
    return;
  }
  const rows = await DishOfTheDay.findAll({
    where: { isActive: true },
    order: [
      ['sortOrder', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });
  res.json({
    success: true,
    data: rows.map((d) => ({
      id: d.id,
      name: d.name,
      price: Number(d.price),
      image: d.image,
      productId: d.productId,
    })),
  });
});

export const getPublicOffers = asyncHandler(async (_req, res) => {
  const now = new Date();
  const rows = await Offer.findAll({
    where: {
      isActive: true,
      offerKind: 'menu',
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now },
    },
    order: [['createdAt', 'DESC']],
  });
  res.json({
    success: true,
    data: rows.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      discountType: o.discountType,
      discountValue: Number(o.discountValue),
      startDate: o.startDate,
      endDate: o.endDate,
      applicableTo: o.applicableTo,
      productIds: o.productIds,
      categoryIds: o.categoryIds,
      image: o.image,
    })),
  });
});

const createOrderSchema = z.object({
  tableNumber: z.string().max(50).optional().nullable(),
  customerName: z.string().max(150).optional().nullable(),
  customerPhone: z.string().max(30).optional().nullable(),
  customerEmail: z.string().email().optional().nullable().or(z.literal('')),
  orderType: z.enum(['delivery', 'dining', 'pickup', 'drive_in', 'drive-in']),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'online']),
  notes: z.string().max(1000).optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().min(0),
        quantity: z.number().int().min(1),
        image: z.string().optional().nullable(),
      })
    )
    .min(1),
});

export const createPublicOrder = asyncHandler(async (req: AuthRequest, res) => {
  const input = createOrderSchema.parse(req.body);

  // Logged-in user → always same userId (any device / OTP session)
  const userId = req.user?.userId || null;

  const order = await orderService.create({
    tableNumber: input.tableNumber || null,
    customerName: input.customerName || null,
    customerPhone: input.customerPhone || null,
    customerEmail: input.customerEmail || null,
    orderType: input.orderType,
    paymentMethod: input.paymentMethod,
    notes: input.notes || null,
    items: input.items,
    userId,
    orderSource: 'website',
  });

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order placed successfully',
  });
});

export const getPublicOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    where: {
      [Op.or]: [{ id: req.params.id }, { orderNumber: req.params.id }],
    },
  });
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  res.json({ success: true, data: order });
});

export const likeProduct = asyncHandler(async (req: AuthRequest, res) => {
  const productId = req.params.id;
  const product = await Product.findByPk(productId);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const userId = req.user?.userId || null;
  const guestKey =
    (typeof req.body?.guestKey === 'string' && req.body.guestKey.trim()) ||
    (typeof req.headers['x-guest-key'] === 'string' && String(req.headers['x-guest-key']).trim()) ||
    null;

  if (!userId && !guestKey) {
    res.status(400).json({ success: false, message: 'Login or guest key required' });
    return;
  }

  const rawAction = typeof req.body?.action === 'string' ? req.body.action : 'toggle';
  const action: 'like' | 'unlike' | 'toggle' =
    rawAction === 'like' || rawAction === 'unlike' || rawAction === 'toggle'
      ? rawAction
      : 'toggle';

  const orClause: { userId?: string; guestKey?: string }[] = [];
  if (userId) orClause.push({ userId });
  if (guestKey) orClause.push({ guestKey });

  const rows = await ProductLike.findAll({
    where: { productId, [Op.or]: orClause },
  });

  const hasLike = rows.length > 0;
  const currentLikes = Number(product.reviewCount || 0);

  if (action === 'unlike' || (action === 'toggle' && hasLike)) {
    if (hasLike) {
      for (const row of rows) await row.destroy();
      const next = Math.max(0, currentLikes - 1);
      await product.update({ reviewCount: next });
      res.json({
        success: true,
        data: { likes: next, liked: false },
        message: 'Unliked',
      });
      return;
    }
    res.json({
      success: true,
      data: { likes: currentLikes, liked: false },
      message: 'Already unliked',
    });
    return;
  }

  if (action === 'like' || (action === 'toggle' && !hasLike)) {
    if (!hasLike) {
      await ProductLike.create({
        productId,
        userId: userId || null,
        guestKey: userId ? null : guestKey,
      });
      const next = currentLikes + 1;
      await product.update({ reviewCount: next });
      res.json({
        success: true,
        data: { likes: next, liked: true },
        message: 'Liked',
      });
      return;
    }
    res.json({
      success: true,
      data: { likes: currentLikes, liked: true },
      message: 'Already liked',
    });
    return;
  }

  res.json({
    success: true,
    data: { likes: currentLikes, liked: hasLike },
  });
});

export const quoteOrder = asyncHandler(async (req: AuthRequest, res) => {
  const schema = z.object({
    orderType: z.enum(['delivery', 'dining', 'pickup', 'drive_in', 'drive-in']).optional(),
    items: z
      .array(
        z.object({
          productId: z.string(),
          name: z.string(),
          price: z.number().min(0),
          quantity: z.number().int().min(1),
          image: z.string().optional().nullable(),
        })
      )
      .min(1),
  });
  const input = schema.parse(req.body);

  const breakdown = await orderService.computePricing({
    items: input.items,
    userId: req.user?.userId ?? null,
    orderType: input.orderType,
  });

  res.json({ success: true, data: breakdown });
});