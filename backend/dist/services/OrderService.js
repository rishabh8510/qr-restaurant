"use strict";
// import { Op, Transaction } from 'sequelize';
// import { sequelize, Order, User, Product, Restaurant, Offer } from '../models';
// import { OrderStatus, OrderSource, OrderItemSnapshot } from '../models/Order';
// import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
// import { emitToStaff, emitToUser } from '../socket';
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
// function generateOrderNumber() {
//   const now = new Date();
//   const stamp = now.toISOString().slice(0, 10).replace(/-/g, '');
//   const rand = Math.floor(1000 + Math.random() * 9000);
//   return `ORD-${stamp}-${rand}`;
// }
// /** Normalize a phone number to its last 10 digits (or empty string if invalid) */
// function normalizePhone(phone?: string | null): string {
//   if (!phone) return '';
//   const digits = String(phone).replace(/\D/g, '');
//   return digits.length >= 10 ? digits.slice(-10) : digits;
// }
// /** Admin-controlled. Defaults: everything OFF / 0 */
// function readPricingSettings(settings: unknown) {
//   const defaults = {
//     taxPercent: 0,
//     firstOrderDiscountPercent: 0,
//     firstOrderDiscountEnabled: false,
//     deliveryCharge: 0,
//     packingCharge: 0,
//   };
//   if (!settings || typeof settings !== 'object') return defaults;
//   const s = settings as Record<string, unknown>;
//   const website = (s.website && typeof s.website === 'object' ? s.website : s) as Record<
//     string,
//     unknown
//   >;
//   const pricing = (
//     website.pricing && typeof website.pricing === 'object' ? website.pricing : website
//   ) as Record<string, unknown>;
//   return {
//     taxPercent: typeof pricing.taxPercent === 'number' ? pricing.taxPercent : defaults.taxPercent,
//     firstOrderDiscountPercent:
//       typeof pricing.firstOrderDiscountPercent === 'number'
//         ? pricing.firstOrderDiscountPercent
//         : defaults.firstOrderDiscountPercent,
//     firstOrderDiscountEnabled:
//       typeof pricing.firstOrderDiscountEnabled === 'boolean'
//         ? pricing.firstOrderDiscountEnabled
//         : defaults.firstOrderDiscountEnabled,
//     deliveryCharge:
//       typeof pricing.deliveryCharge === 'number' ? pricing.deliveryCharge : defaults.deliveryCharge,
//     packingCharge:
//       typeof pricing.packingCharge === 'number' ? pricing.packingCharge : defaults.packingCharge,
//   };
// }
// export interface CreateOrderInput {
//   customerName?: string | null;
//   customerPhone?: string | null;
//   customerEmail?: string | null;
//   orderType: 'delivery' | 'dining' | 'pickup';
//   paymentMethod: 'cash' | 'card' | 'upi' | 'online';
//   notes?: string | null;
//   items: OrderItemSnapshot[];
//   userId?: string | null;
//   orderSource?: OrderSource;
//   createdByStaffId?: string | null;
// }
// export class OrderService {
//   async isFirstOrderForUser(userId: string | null | undefined) {
//     if (!userId) return false;
//     const count = await Order.count({
//       where: { userId, status: { [Op.ne]: 'cancelled' } },
//     });
//     return count === 0;
//   }
//   async computePricing(input: {
//     items: OrderItemSnapshot[];
//     userId?: string | null;
//     orderType?: 'delivery' | 'dining' | 'pickup';
//   }) {
//     const subtotal = input.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
//     const restaurant = await Restaurant.findOne();
//     const pricing = readPricingSettings(restaurant?.settings || null);
//     const isFirstOrder = await this.isFirstOrderForUser(input.userId);
//     let discount = 0;
//     let discountLabel: string | null = null;
//     if (
//       isFirstOrder &&
//       pricing.firstOrderDiscountEnabled &&
//       pricing.firstOrderDiscountPercent > 0
//     ) {
//       discount =
//         Math.round(((subtotal * pricing.firstOrderDiscountPercent) / 100) * 100) / 100;
//       discountLabel = `First order ${pricing.firstOrderDiscountPercent}% off`;
//     }
//     const afterDiscount = Math.max(0, subtotal - discount);
//     // GST total % → split equally CGST + SGST (real local billing)
//     const taxPercent = Number(pricing.taxPercent || 0);
//     const cgstPercent = Math.round((taxPercent / 2) * 1000) / 1000;
//     const sgstPercent = Math.round((taxPercent / 2) * 1000) / 1000;
//     const cgst = Math.round(((afterDiscount * cgstPercent) / 100) * 100) / 100;
//     const sgst = Math.round(((afterDiscount * sgstPercent) / 100) * 100) / 100;
//     const tax = Math.round((cgst + sgst) * 100) / 100;
//     const deliveryCharge =
//       input.orderType === 'delivery' ? Number(pricing.deliveryCharge || 0) : 0;
//     const packingCharge = Number(pricing.packingCharge || 0);
//     const total =
//       Math.round((afterDiscount + tax + deliveryCharge + packingCharge) * 100) / 100;
//     return {
//       subtotal: Math.round(subtotal * 100) / 100,
//       discount,
//       tax,
//       taxPercent,
//       cgst,
//       sgst,
//       cgstPercent,
//       sgstPercent,
//       deliveryCharge,
//       packingCharge,
//       total,
//       isFirstOrder,
//       discountLabel,
//       firstOrderDiscountPercent: pricing.firstOrderDiscountPercent,
//       firstOrderDiscountEnabled: pricing.firstOrderDiscountEnabled,
//     };
//   }
//   async create(input: CreateOrderInput) {
//     if (!input.items?.length) {
//       throw new BadRequestError('Order must have at least one item');
//     }
//     const breakdown = await this.computePricing({
//       items: input.items,
//       userId: input.userId || null,
//       orderType: input.orderType,
//     });
//     const paymentStatus = input.paymentMethod === 'cash' ? 'pending' : 'paid';
//     const order = await Order.create({
//       orderNumber: generateOrderNumber(),
//       userId: input.userId || null,
//       assignedStaffId: null,
//       orderSource: input.orderSource || 'website',
//       customerName: input.customerName || null,
//       customerPhone: input.customerPhone || null,
//       customerEmail: input.customerEmail || null,
//       orderType: input.orderType,
//       paymentMethod: input.paymentMethod,
//       paymentStatus,
//       status: 'pending',
//       items: input.items,
//       subtotal: breakdown.subtotal,
//       tax: breakdown.tax,
//       discount: breakdown.discount,
//       total: breakdown.total,
//       pricingMeta: {
//         taxPercent: breakdown.taxPercent,
//         cgstPercent: breakdown.cgstPercent,
//         sgstPercent: breakdown.sgstPercent,
//         cgst: breakdown.cgst,
//         sgst: breakdown.sgst,
//         isFirstOrder: breakdown.isFirstOrder,
//         discountLabel: breakdown.discountLabel,
//         deliveryCharge: breakdown.deliveryCharge,
//         packingCharge: breakdown.packingCharge,
//       },
//       notes: input.notes || null,
//       acceptedAt: null,
//     });
//     for (const item of input.items) {
//       try {
//         const product = await Product.findByPk(item.productId);
//         if (product) {
//           product.orderCount = (product.orderCount || 0) + item.quantity;
//           await product.save();
//         }
//       } catch {
//         /* ignore */
//       }
//     }
//     emitToStaff('order:created', order.toJSON());
//     return order;
//   }
//   async acceptOrder(orderId: string, staffId: string) {
//     const result = await sequelize.transaction(async (t: Transaction) => {
//       const [affected] = await Order.update(
//         {
//           status: 'confirmed',
//           assignedStaffId: staffId,
//           acceptedAt: new Date(),
//         },
//         {
//           where: {
//             id: orderId,
//             status: 'pending',
//             assignedStaffId: null,
//           },
//           transaction: t,
//         }
//       );
//       if (affected === 0) {
//         const existing = await Order.findByPk(orderId, { transaction: t });
//         if (!existing) throw new NotFoundError('Order not found');
//         if (existing.assignedStaffId) {
//           throw new BadRequestError('Order already accepted by another staff');
//         }
//         throw new BadRequestError('Order cannot be accepted in its current status');
//       }
//       return Order.findByPk(orderId, {
//         transaction: t,
//         include: [
//           { model: User, as: 'assignedStaff', attributes: ['id', 'name', 'phone'] },
//         ],
//       });
//     });
//     if (result) {
//       emitToStaff('order:accepted', result.toJSON());
//       emitToStaff('order:updated', result.toJSON());
//     }
//     return result;
//   }
//   async updateStatus(orderId: string, status: OrderStatus, actorId: string, actorRole: string) {
//     const order = await Order.findByPk(orderId);
//     if (!order) throw new NotFoundError('Order not found');
//     if (actorRole === 'staff' && order.assignedStaffId && order.assignedStaffId !== actorId) {
//       throw new ForbiddenError('You are not assigned to this order');
//     }
//     const allowed: Record<string, OrderStatus[]> = {
//       pending: ['confirmed', 'cancelled'],
//       confirmed: ['preparing', 'cancelled'],
//       preparing: ['ready', 'cancelled'],
//       ready: ['completed', 'cancelled'],
//       completed: [],
//       cancelled: [],
//     };
//     if (!allowed[order.status]?.includes(status)) {
//       throw new BadRequestError(`Cannot transition from ${order.status} to ${status}`);
//     }
//     order.status = status;
//     if (status === 'confirmed' && !order.assignedStaffId) {
//       order.assignedStaffId = actorId;
//       order.acceptedAt = new Date();
//     }
//     await order.save();
//     emitToStaff('order:updated', order.toJSON());
//     if (order.userId) {
//       emitToUser(order.userId, 'order:updated', order.toJSON());
//     }
//     return order;
//   }
//   async listForStaff(filters: { status?: string; page?: number; limit?: number }) {
//     const page = filters.page || 1;
//     const limit = Math.min(filters.limit || 20, 100);
//     const where: any = {};
//     if (filters.status) where.status = filters.status;
//     const { rows, count } = await Order.findAndCountAll({
//       where,
//       order: [['createdAt', 'DESC']],
//       limit,
//       offset: (page - 1) * limit,
//       include: [
//         { model: User, as: 'assignedStaff', attributes: ['id', 'name'] },
//         { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
//       ],
//     });
//     return {
//       data: rows,
//       meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
//     };
//   }
//   /**
//    * List all orders belonging to a customer.
//    *
//    * Matches by:
//    *  - `userId` (primary link)
//    *  - `customerPhone` (fallback for legacy orders created before login was required)
//    *
//    * Phone matching is done on normalized last-10 digits so that stored variants
//    * like "+91 98765 43210", "9876543210", "09876543210" all resolve to the same order.
//    */
//   async listForCustomer(userId: string) {
//     const user = await User.findByPk(userId);
//     const orConditions: any[] = [{ userId }];
//     // Legacy orders: link by phone if userId was missing
//     const digits = normalizePhone(user?.phone);
//     if (digits.length === 10) {
//       // Exact match on normalized digits
//       orConditions.push({ customerPhone: digits });
//       // Raw stored value (in case DB stores the original format)
//       if (user?.phone) orConditions.push({ customerPhone: user.phone });
//       // Handle stored values with prefixes/suffixes (e.g. "+91 9876543210")
//       orConditions.push({ customerPhone: { [Op.like]: `%${digits}` } });
//     }
//     const orders = await Order.findAll({
//       where: { [Op.or]: orConditions },
//       order: [['createdAt', 'DESC']],
//     });
//     return orders.map((o) => o.toJSON());
//   }
//   async getById(id: string, userId?: string, role?: string) {
//     const order = await Order.findOne({
//       where: {
//         [Op.or]: [{ id }, { orderNumber: id }],
//       },
//       include: [
//         { model: User, as: 'assignedStaff', attributes: ['id', 'name'] },
//         { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
//       ],
//     });
//     if (!order) throw new NotFoundError('Order not found');
//     if (role === 'customer' && order.userId !== userId) {
//       throw new ForbiddenError('You can only view your own orders');
//     }
//     return order;
//   }
// }
// export const orderService = new OrderService();
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const errors_1 = require("../utils/errors");
const socket_1 = require("../socket");
function generateOrderNumber() {
    const now = new Date();
    const stamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${stamp}-${rand}`;
}
/** Normalize a phone number to its last 10 digits (or empty string if invalid) */
function normalizePhone(phone) {
    if (!phone)
        return '';
    const digits = String(phone).replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : digits;
}
/** Admin-controlled. Defaults: everything OFF / 0 */
function readPricingSettings(settings) {
    const defaults = {
        taxPercent: 0,
        firstOrderDiscountPercent: 0,
        firstOrderDiscountEnabled: false,
        deliveryCharge: 0,
        packingCharge: 0,
    };
    if (!settings || typeof settings !== 'object')
        return defaults;
    const s = settings;
    const website = (s.website && typeof s.website === 'object' ? s.website : s);
    const pricing = (website.pricing && typeof website.pricing === 'object' ? website.pricing : website);
    return {
        taxPercent: typeof pricing.taxPercent === 'number' ? pricing.taxPercent : defaults.taxPercent,
        firstOrderDiscountPercent: typeof pricing.firstOrderDiscountPercent === 'number'
            ? pricing.firstOrderDiscountPercent
            : defaults.firstOrderDiscountPercent,
        firstOrderDiscountEnabled: typeof pricing.firstOrderDiscountEnabled === 'boolean'
            ? pricing.firstOrderDiscountEnabled
            : defaults.firstOrderDiscountEnabled,
        deliveryCharge: typeof pricing.deliveryCharge === 'number' ? pricing.deliveryCharge : defaults.deliveryCharge,
        packingCharge: typeof pricing.packingCharge === 'number' ? pricing.packingCharge : defaults.packingCharge,
    };
}
class OrderService {
    async isFirstOrderForUser(userId) {
        if (!userId)
            return false;
        const count = await models_1.Order.count({
            where: { userId, status: { [sequelize_1.Op.ne]: 'cancelled' } },
        });
        return count === 0;
    }
    async computePricing(input) {
        const subtotal = input.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
        const roundedSubtotal = Math.round(subtotal * 100) / 100;
        // Direct original price only — no tax, no discount, no extra charges
        return {
            subtotal: roundedSubtotal,
            discount: 0,
            tax: 0,
            taxPercent: 0,
            cgst: 0,
            sgst: 0,
            cgstPercent: 0,
            sgstPercent: 0,
            deliveryCharge: 0,
            packingCharge: 0,
            total: roundedSubtotal,
            isFirstOrder: false,
            discountLabel: null,
            firstOrderDiscountPercent: 0,
            firstOrderDiscountEnabled: false,
            loyaltyDiscount: 0,
            loyaltyLabel: null,
        };
    }
    async create(input) {
        if (!input.items?.length) {
            throw new errors_1.BadRequestError('Order must have at least one item');
        }
        const breakdown = await this.computePricing({
            items: input.items,
            userId: input.userId || null,
            orderType: input.orderType,
        });
        const paymentStatus = input.paymentMethod === 'cash' ? 'pending' : 'paid';
        const order = await models_1.Order.create({
            orderNumber: generateOrderNumber(),
            tableNumber: input.tableNumber || null,
            userId: input.userId || null,
            assignedStaffId: null,
            orderSource: input.orderSource || 'website',
            customerName: input.customerName || null,
            customerPhone: input.customerPhone || null,
            customerEmail: input.customerEmail || null,
            orderType: input.orderType,
            paymentMethod: input.paymentMethod,
            paymentStatus,
            status: 'pending',
            items: input.items,
            subtotal: breakdown.subtotal,
            tax: breakdown.tax,
            discount: breakdown.discount,
            total: breakdown.total,
            pricingMeta: {
                taxPercent: breakdown.taxPercent,
                cgstPercent: breakdown.cgstPercent,
                sgstPercent: breakdown.sgstPercent,
                cgst: breakdown.cgst,
                sgst: breakdown.sgst,
                isFirstOrder: breakdown.isFirstOrder,
                discountLabel: breakdown.discountLabel,
                deliveryCharge: breakdown.deliveryCharge,
                packingCharge: breakdown.packingCharge,
                loyaltyDiscount: breakdown.loyaltyDiscount,
                loyaltyLabel: breakdown.loyaltyLabel,
            },
            notes: input.notes || null,
            acceptedAt: null,
        });
        for (const item of input.items) {
            try {
                const product = await models_1.Product.findByPk(item.productId);
                if (product) {
                    product.orderCount = (product.orderCount || 0) + item.quantity;
                    await product.save();
                }
            }
            catch {
                /* ignore */
            }
        }
        (0, socket_1.emitToStaff)('order:created', order.toJSON());
        return order;
    }
    async acceptOrder(orderId, staffId) {
        const result = await models_1.sequelize.transaction(async (t) => {
            const [affected] = await models_1.Order.update({
                status: 'confirmed',
                assignedStaffId: staffId,
                acceptedAt: new Date(),
            }, {
                where: {
                    id: orderId,
                    status: 'pending',
                    assignedStaffId: null,
                },
                transaction: t,
            });
            if (affected === 0) {
                const existing = await models_1.Order.findByPk(orderId, { transaction: t });
                if (!existing)
                    throw new errors_1.NotFoundError('Order not found');
                if (existing.assignedStaffId) {
                    throw new errors_1.BadRequestError('Order already accepted by another staff');
                }
                throw new errors_1.BadRequestError('Order cannot be accepted in its current status');
            }
            return models_1.Order.findByPk(orderId, {
                transaction: t,
                include: [
                    { model: models_1.User, as: 'assignedStaff', attributes: ['id', 'name', 'phone'] },
                ],
            });
        });
        if (result) {
            (0, socket_1.emitToStaff)('order:accepted', result.toJSON());
            (0, socket_1.emitToStaff)('order:updated', result.toJSON());
        }
        return result;
    }
    async updateStatus(orderId, status, actorId, actorRole) {
        const order = await models_1.Order.findByPk(orderId);
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        if (actorRole === 'staff' && order.assignedStaffId && order.assignedStaffId !== actorId) {
            throw new errors_1.ForbiddenError('You are not assigned to this order');
        }
        const allowed = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['preparing', 'cancelled'],
            preparing: ['ready', 'cancelled'],
            ready: ['completed', 'cancelled'],
            completed: [],
            cancelled: [],
        };
        if (!allowed[order.status]?.includes(status)) {
            throw new errors_1.BadRequestError(`Cannot transition from ${order.status} to ${status}`);
        }
        order.status = status;
        if (status === 'confirmed' && !order.assignedStaffId) {
            order.assignedStaffId = actorId;
            order.acceptedAt = new Date();
        }
        await order.save();
        (0, socket_1.emitToStaff)('order:updated', order.toJSON());
        if (order.userId) {
            (0, socket_1.emitToUser)(order.userId, 'order:updated', order.toJSON());
        }
        return order;
    }
    async listForStaff(filters) {
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 100);
        const where = {};
        if (filters.status)
            where.status = filters.status;
        const { rows, count } = await models_1.Order.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
            include: [
                { model: models_1.User, as: 'assignedStaff', attributes: ['id', 'name'] },
                { model: models_1.User, as: 'customer', attributes: ['id', 'name', 'phone'] },
            ],
        });
        return {
            data: rows,
            meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
        };
    }
    /**
     * List all orders belonging to a customer.
     *
     * Matches by:
     *  - `userId` (primary link)
     *  - `customerPhone` (fallback for legacy orders created before login was required)
     *
     * Phone matching is done on normalized last-10 digits so that stored variants
     * like "+91 98765 43210", "9876543210", "09876543210" all resolve to the same order.
     */
    async listForCustomer(userId) {
        const user = await models_1.User.findByPk(userId);
        const orConditions = [{ userId }];
        // Legacy orders: link by phone if userId was missing
        const digits = normalizePhone(user?.phone);
        if (digits.length === 10) {
            // Exact match on normalized digits
            orConditions.push({ customerPhone: digits });
            // Raw stored value (in case DB stores the original format)
            if (user?.phone)
                orConditions.push({ customerPhone: user.phone });
            // Handle stored values with prefixes/suffixes (e.g. "+91 9876543210")
            orConditions.push({ customerPhone: { [sequelize_1.Op.like]: `%${digits}` } });
        }
        const orders = await models_1.Order.findAll({
            where: { [sequelize_1.Op.or]: orConditions },
            order: [['createdAt', 'DESC']],
        });
        return orders.map((o) => o.toJSON());
    }
    async getById(id, userId, role) {
        const order = await models_1.Order.findOne({
            where: {
                [sequelize_1.Op.or]: [{ id }, { orderNumber: id }],
            },
            include: [
                { model: models_1.User, as: 'assignedStaff', attributes: ['id', 'name'] },
                { model: models_1.User, as: 'customer', attributes: ['id', 'name', 'phone'] },
            ],
        });
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        if (role === 'customer' && order.userId !== userId) {
            throw new errors_1.ForbiddenError('You can only view your own orders');
        }
        return order;
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
//# sourceMappingURL=OrderService.js.map