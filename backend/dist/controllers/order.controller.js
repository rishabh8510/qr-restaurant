"use strict";
// import { AuthRequest } from '../types';
// import { orderService } from '../services/OrderService';
// import { asyncHandler } from '../utils/asyncHandler';
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.myOrders = exports.createManualOrder = exports.updateOrderStatus = exports.acceptOrder = exports.getOrder = exports.listOrders = void 0;
const OrderService_1 = require("../services/OrderService");
const asyncHandler_1 = require("../utils/asyncHandler");
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    tableNumber: zod_1.z.string().max(50).optional().nullable(),
    customerName: zod_1.z.string().max(150).optional().nullable(),
    customerPhone: zod_1.z.string().max(30).optional().nullable(),
    customerEmail: zod_1.z.string().email().optional().nullable().or(zod_1.z.literal('')),
    orderType: zod_1.z.enum(['delivery', 'dining', 'pickup']),
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
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
});
/** Safely coerce an Express route param (string | string[]) into a single string */
function paramToString(value) {
    if (Array.isArray(value))
        return value[0] ?? '';
    return value ?? '';
}
exports.listOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '20'), 10);
    const status = req.query.status;
    const result = await OrderService_1.orderService.listForStaff({ status, page, limit });
    res.json({ success: true, ...result });
});
exports.getOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await OrderService_1.orderService.getById(paramToString(req.params.id), req.user?.userId, req.user?.role);
    res.json({ success: true, data: order });
});
exports.acceptOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await OrderService_1.orderService.acceptOrder(paramToString(req.params.id), req.user.userId);
    res.json({ success: true, data: order, message: 'Order accepted' });
});
exports.updateOrderStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status } = statusSchema.parse(req.body);
    const order = await OrderService_1.orderService.updateStatus(paramToString(req.params.id), status, req.user.userId, req.user.role);
    res.json({ success: true, data: order });
});
/** Staff/Admin manual order creation */
exports.createManualOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = createOrderSchema.parse(req.body);
    const source = req.user.role === 'admin' ? 'admin' : 'staff';
    const order = await OrderService_1.orderService.create({
        ...input,
        orderSource: source,
        createdByStaffId: req.user.userId,
    });
    res.status(201).json({ success: true, data: order, message: 'Order created' });
});
/** Customer: my orders */
exports.myOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const orders = await OrderService_1.orderService.listForCustomer(req.user.userId);
    res.json({
        success: true,
        data: Array.isArray(orders) ? orders : [],
    });
});
//# sourceMappingURL=order.controller.js.map