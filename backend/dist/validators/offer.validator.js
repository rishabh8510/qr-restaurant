"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferSchema = exports.createOfferSchema = void 0;
// export const createOfferSchema = z.object({
//   title: z.string().min(1).max(150),
//   description: z.string().max(2000).optional().nullable(),
//   discountType: z.enum(['percentage', 'fixed']),
//   discountValue: z.number().min(0),
//   startDate: z.string().or(z.date()),
//   endDate: z.string().or(z.date()),
//   isActive: z.boolean().optional(),
//   applicableTo: z.enum(['all', 'products', 'categories']).optional(),
//   productIds: z.array(z.string().uuid()).optional().nullable(),
//   categoryIds: z.array(z.string().uuid()).optional().nullable(),
// });
// export const updateOfferSchema = createOfferSchema.partial();
// export type CreateOfferInput = z.infer<typeof createOfferSchema>;
// export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
const zod_1 = require("zod");
exports.createOfferSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(150),
    description: zod_1.z.string().max(2000).optional().nullable(),
    discountType: zod_1.z.enum(['percentage', 'fixed']),
    discountValue: zod_1.z.number().min(0),
    startDate: zod_1.z.string().or(zod_1.z.date()),
    endDate: zod_1.z.string().or(zod_1.z.date()),
    isActive: zod_1.z.boolean().optional(),
    applicableTo: zod_1.z.enum(['all', 'products', 'categories']).optional(),
    productIds: zod_1.z.array(zod_1.z.string().uuid()).optional().nullable(),
    categoryIds: zod_1.z.array(zod_1.z.string().uuid()).optional().nullable(),
    offerKind: zod_1.z.enum(['menu', 'loyalty']).optional(),
    minOrderCount: zod_1.z.number().int().min(1).optional().nullable(),
});
exports.updateOfferSchema = exports.createOfferSchema.partial();
//# sourceMappingURL=offer.validator.js.map