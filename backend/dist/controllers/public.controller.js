"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteOrder = exports.likeProduct = exports.getPublicOrder = exports.createPublicOrder = exports.getPublicOffers = exports.getPublicDishOfTheDay = exports.getPublicBanners = exports.getPublicSettings = exports.getPublicMenu = exports.DEFAULT_WEBSITE_SETTINGS = void 0;
exports.normalizeWebsiteSettings = normalizeWebsiteSettings;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const asyncHandler_1 = require("../utils/asyncHandler");
const zod_1 = require("zod");
const OrderService_1 = require("../services/OrderService");
exports.DEFAULT_WEBSITE_SETTINGS = {
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
function normalizeWebsiteSettings(raw) {
    const base = {
        ...exports.DEFAULT_WEBSITE_SETTINGS,
        filters: { ...exports.DEFAULT_WEBSITE_SETTINGS.filters },
        pricing: { ...exports.DEFAULT_WEBSITE_SETTINGS.pricing },
    };
    if (!raw || typeof raw !== 'object')
        return base;
    const s = raw;
    const website = (s.website && typeof s.website === 'object' ? s.website : s);
    if (typeof website.showBanner === 'boolean')
        base.showBanner = website.showBanner;
    if (typeof website.showDishOfTheDay === 'boolean')
        base.showDishOfTheDay = website.showDishOfTheDay;
    if (typeof website.showOffers === 'boolean')
        base.showOffers = website.showOffers;
    if (typeof website.showSearch === 'boolean')
        base.showSearch = website.showSearch;
    if (typeof website.showCategoryFilter === 'boolean')
        base.showCategoryFilter = website.showCategoryFilter;
    if (typeof website.showSubCategoryFilter === 'boolean')
        base.showSubCategoryFilter = website.showSubCategoryFilter;
    if (website.filters && typeof website.filters === 'object') {
        const f = website.filters;
        for (const key of Object.keys(base.filters)) {
            if (typeof f[key] === 'boolean')
                base.filters[key] = f[key];
        }
    }
    if (website.pricing && typeof website.pricing === 'object') {
        const p = website.pricing;
        if (typeof p.deliveryCharge === 'number')
            base.pricing.deliveryCharge = p.deliveryCharge;
        if (typeof p.packingCharge === 'number')
            base.pricing.packingCharge = p.packingCharge;
    }
    // Enforce 0 tax and no discount
    base.pricing.taxPercent = 0;
    base.pricing.firstOrderDiscountPercent = 0;
    base.pricing.firstOrderDiscountEnabled = false;
    return base;
}
function getActiveOffersForProduct(offers, productId, categoryId) {
    const now = new Date();
    const applicable = offers.filter((o) => {
        if (!o.isActive)
            return false;
        if (o.endDate && new Date(o.endDate) < now)
            return false;
        if (!o.applicableTo || o.applicableTo === 'all')
            return true;
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
    if (applicable.length === 0)
        return null;
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
function applyOfferPrice(price, offer) {
    if (!offer)
        return { finalPrice: price, savings: 0 };
    let final = price;
    if (offer.discountType === 'percentage') {
        final = Math.max(0, price * (1 - Number(offer.discountValue) / 100));
    }
    else {
        final = Math.max(0, price - Number(offer.discountValue));
    }
    final = Math.round(final * 100) / 100;
    return { finalPrice: final, savings: Math.round((price - final) * 100) / 100 };
}
exports.getPublicMenu = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const now = new Date();
    const [categories, subCategories, products, offers] = await Promise.all([
        models_1.Category.findAll({
            where: { isActive: true },
            order: [
                ['sortOrder', 'ASC'],
                ['name', 'ASC'],
            ],
        }),
        models_1.SubCategory.findAll({
            where: { isActive: true },
            order: [
                ['sortOrder', 'ASC'],
                ['name', 'ASC'],
            ],
        }),
        models_1.Product.findAll({
            where: { isActive: true, isAvailable: true },
            order: [['name', 'ASC']],
        }),
        models_1.Offer.findAll({
            where: {
                isActive: true,
                endDate: { [sequelize_1.Op.gte]: now },
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
                image: c.image ||
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
                    image: p.image ||
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
exports.getPublicSettings = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const restaurant = await models_1.Restaurant.findOne();
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
exports.getPublicBanners = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const restaurant = await models_1.Restaurant.findOne();
    const website = normalizeWebsiteSettings(restaurant?.settings || null);
    if (!website.showBanner) {
        res.json({ success: true, data: [] });
        return;
    }
    const rows = await models_1.Banner.findAll({
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
exports.getPublicDishOfTheDay = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const restaurant = await models_1.Restaurant.findOne();
    const website = normalizeWebsiteSettings(restaurant?.settings || null);
    if (!website.showDishOfTheDay) {
        res.json({ success: true, data: [] });
        return;
    }
    const rows = await models_1.DishOfTheDay.findAll({
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
exports.getPublicOffers = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const now = new Date();
    const rows = await models_1.Offer.findAll({
        where: {
            isActive: true,
            offerKind: 'menu',
            startDate: { [sequelize_1.Op.lte]: now },
            endDate: { [sequelize_1.Op.gte]: now },
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
const createOrderSchema = zod_1.z.object({
    tableNumber: zod_1.z.string().max(50).optional().nullable(),
    customerName: zod_1.z.string().max(150).optional().nullable(),
    customerPhone: zod_1.z.string().max(30).optional().nullable(),
    customerEmail: zod_1.z.string().email().optional().nullable().or(zod_1.z.literal('')),
    orderType: zod_1.z.enum(['delivery', 'dining', 'pickup', 'drive_in', 'drive-in']),
    paymentMethod: zod_1.z.enum(['cash', 'card', 'upi', 'online']),
    notes: zod_1.z.string().max(1000).optional().nullable(),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string(),
        name: zod_1.z.string(),
        price: zod_1.z.number().min(0),
        quantity: zod_1.z.number().int().min(1),
        image: zod_1.z.string().optional().nullable(),
    }))
        .min(1),
});
exports.createPublicOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = createOrderSchema.parse(req.body);
    // Logged-in user → always same userId (any device / OTP session)
    const userId = req.user?.userId || null;
    const order = await OrderService_1.orderService.create({
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
exports.getPublicOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await models_1.Order.findOne({
        where: {
            [sequelize_1.Op.or]: [{ id: req.params.id }, { orderNumber: req.params.id }],
        },
    });
    if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
    }
    res.json({ success: true, data: order });
});
exports.likeProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const productId = req.params.id;
    const product = await models_1.Product.findByPk(productId);
    if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
    }
    const userId = req.user?.userId || null;
    const guestKey = (typeof req.body?.guestKey === 'string' && req.body.guestKey.trim()) ||
        (typeof req.headers['x-guest-key'] === 'string' && String(req.headers['x-guest-key']).trim()) ||
        null;
    if (!userId && !guestKey) {
        res.status(400).json({ success: false, message: 'Login or guest key required' });
        return;
    }
    const rawAction = typeof req.body?.action === 'string' ? req.body.action : 'toggle';
    const action = rawAction === 'like' || rawAction === 'unlike' || rawAction === 'toggle'
        ? rawAction
        : 'toggle';
    const orClause = [];
    if (userId)
        orClause.push({ userId });
    if (guestKey)
        orClause.push({ guestKey });
    const rows = await models_1.ProductLike.findAll({
        where: { productId, [sequelize_1.Op.or]: orClause },
    });
    const hasLike = rows.length > 0;
    const currentLikes = Number(product.reviewCount || 0);
    if (action === 'unlike' || (action === 'toggle' && hasLike)) {
        if (hasLike) {
            for (const row of rows)
                await row.destroy();
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
            await models_1.ProductLike.create({
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
exports.quoteOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        orderType: zod_1.z.enum(['delivery', 'dining', 'pickup', 'drive_in', 'drive-in']).optional(),
        items: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.string(),
            name: zod_1.z.string(),
            price: zod_1.z.number().min(0),
            quantity: zod_1.z.number().int().min(1),
            image: zod_1.z.string().optional().nullable(),
        }))
            .min(1),
    });
    const input = schema.parse(req.body);
    const breakdown = await OrderService_1.orderService.computePricing({
        items: input.items,
        userId: req.user?.userId ?? null,
        orderType: input.orderType,
    });
    res.json({ success: true, data: breakdown });
});
//# sourceMappingURL=public.controller.js.map