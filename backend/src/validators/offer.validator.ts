// import { z } from 'zod';

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



import { z } from 'zod';

export const createOfferSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(2000).optional().nullable(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isActive: z.boolean().optional(),
  applicableTo: z.enum(['all', 'products', 'categories']).optional(),
  productIds: z.array(z.string().uuid()).optional().nullable(),
  categoryIds: z.array(z.string().uuid()).optional().nullable(),
  offerKind: z.enum(['menu', 'loyalty']).optional(),
  minOrderCount: z.number().int().min(1).optional().nullable(),
});

export const updateOfferSchema = createOfferSchema.partial();

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;