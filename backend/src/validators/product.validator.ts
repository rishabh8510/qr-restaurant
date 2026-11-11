import { z } from 'zod';

const tagsSchema = z
  .union([
    z.array(z.string()),
    z.string().transform((s) => {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed.map(String) : s.split(',').map((t) => t.trim()).filter(Boolean);
      } catch {
        return s.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }),
  ])
  .optional()
  .nullable();

export const createProductSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().min(0),
  oldPrice: z.number().min(0).optional().nullable(),
  discount: z.string().max(50).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  subCategoryId: z.string().uuid().optional().nullable(),
  weight: z.string().max(50).optional().nullable(),
  prepTime: z.string().max(50).optional().nullable(),
  isVeg: z.boolean().optional(),
  isEgg: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  tags: tagsSchema,
  rating: z.number().min(0).max(5).optional().nullable(),
  reviewCount: z.number().int().min(0).optional(),
  orderCount: z.number().int().min(0).optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
