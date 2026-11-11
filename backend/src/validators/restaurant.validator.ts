import { z } from 'zod';

export const updateRestaurantSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().max(2000).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),
  openingHours: z.record(z.unknown()).optional().nullable(),
  socialLinks: z.record(z.unknown()).optional().nullable(),
  settings: z.record(z.unknown()).optional().nullable(),
});

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
