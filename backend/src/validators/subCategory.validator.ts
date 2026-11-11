import { z } from 'zod';

export const createSubCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().max(120).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  categoryId: z.string().uuid(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateSubCategorySchema = createSubCategorySchema
  .partial()
  .omit({ categoryId: true })
  .extend({
    categoryId: z.string().uuid().optional(),
  });

export type CreateSubCategoryInput = z.infer<typeof createSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof updateSubCategorySchema>;
