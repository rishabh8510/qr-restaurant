// import { AuthRequest } from '../types';
// import { orderService } from '../services/OrderService';
// import { asyncHandler } from '../utils/asyncHandler';
// import { z } from 'zod';

// const createOrderSchema = z.object({
//   customerName: z.string().max(150).optional().nullable(),
//   customerPhone: z.string().max(30).optional().nullable(),
//   customerEmail: z.string().email().optional().nullable().or(z.literal('')),
//   orderType: z.enum(['delivery', 'dining', 'pickup']),
//   paymentMethod: z.enum(['cash', 'card', 'upi', 'online']),
//   notes: z.string().max(1000).optional().nullable(),
//   items: z
//     .array(
//       z.object({
//         productId: z.string(),
//         name: z.string(),
//         price: z.number().min(0),
//         quantity: z.number().int().min(1),
//         image: z.string().optional().nullable(),
//       })
//     )
//     .min(1),
// });

// const statusSchema = z.object({
//   status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
// });

// export const listOrders = asyncHandler(async (req: AuthRequest, res) => {
//   const page = parseInt(String(req.query.page || '1'), 10);
//   const limit = parseInt(String(req.query.limit || '20'), 10);
//   const status = req.query.status as string | undefined;
//   const result = await orderService.listForStaff({ status, page, limit });
//   res.json({ success: true, ...result });
// });

// export const getOrder = asyncHandler(async (req: AuthRequest, res) => {
//   const order = await orderService.getById(
//     req.params.id,
//     req.user?.userId,
//     req.user?.role
//   );
//   res.json({ success: true, data: order });
// });

// export const acceptOrder = asyncHandler(async (req: AuthRequest, res) => {
//   const order = await orderService.acceptOrder(req.params.id, req.user!.userId);
//   res.json({ success: true, data: order, message: 'Order accepted' });
// });

// export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res) => {
//   const { status } = statusSchema.parse(req.body);
//   const order = await orderService.updateStatus(
//     req.params.id,
//     status,
//     req.user!.userId,
//     req.user!.role
//   );
//   res.json({ success: true, data: order });
// });

// /** Staff/Admin manual order creation */
// export const createManualOrder = asyncHandler(async (req: AuthRequest, res) => {
//   const input = createOrderSchema.parse(req.body);
//   const source = req.user!.role === 'admin' ? 'admin' : 'staff';
//   const order = await orderService.create({
//     ...input,
//     orderSource: source,
//     createdByStaffId: req.user!.userId,
//   });
//   res.status(201).json({ success: true, data: order, message: 'Order created' });
// });

// /** Customer: my orders */
// export const myOrders = asyncHandler(async (req: AuthRequest, res) => {
//   const orders = await orderService.listForCustomer(req.user!.userId);
//   res.json({
//     success: true,
//     data: Array.isArray(orders) ? orders : [],
//   });
// });



import { AuthRequest } from '../types';
import { orderService } from '../services/OrderService';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

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

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
});

/** Safely coerce an Express route param (string | string[]) into a single string */
function paramToString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export const listOrders = asyncHandler(async (req: AuthRequest, res) => {
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = parseInt(String(req.query.limit || '20'), 10);
  const status = req.query.status as string | undefined;
  const result = await orderService.listForStaff({ status, page, limit });
  res.json({ success: true, ...result });
});

export const getOrder = asyncHandler(async (req: AuthRequest, res) => {
  const order = await orderService.getById(
    paramToString(req.params.id),
    req.user?.userId,
    req.user?.role
  );
  res.json({ success: true, data: order });
});

export const acceptOrder = asyncHandler(async (req: AuthRequest, res) => {
  const order = await orderService.acceptOrder(
    paramToString(req.params.id),
    req.user!.userId
  );
  res.json({ success: true, data: order, message: 'Order accepted' });
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res) => {
  const { status } = statusSchema.parse(req.body);
  const order = await orderService.updateStatus(
    paramToString(req.params.id),
    status,
    req.user!.userId,
    req.user!.role
  );
  res.json({ success: true, data: order });
});

/** Staff/Admin manual order creation */
export const createManualOrder = asyncHandler(async (req: AuthRequest, res) => {
  const input = createOrderSchema.parse(req.body);
  const source = req.user!.role === 'admin' ? 'admin' : 'staff';
  const order = await orderService.create({
    ...input,
    orderSource: source,
    createdByStaffId: req.user!.userId,
  });
  res.status(201).json({ success: true, data: order, message: 'Order created' });
});

/** Customer: my orders */
export const myOrders = asyncHandler(async (req: AuthRequest, res) => {
  const orders = await orderService.listForCustomer(req.user!.userId);
  res.json({
    success: true,
    data: Array.isArray(orders) ? orders : [],
  });
});