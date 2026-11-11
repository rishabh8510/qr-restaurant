import { z } from 'zod';
export declare const updateRestaurantSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    openingHours: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    socialLinks: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    settings: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    email?: string | null | undefined;
    phone?: string | null | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    address?: string | null | undefined;
    openingHours?: Record<string, unknown> | null | undefined;
    socialLinks?: Record<string, unknown> | null | undefined;
    settings?: Record<string, unknown> | null | undefined;
}, {
    email?: string | null | undefined;
    phone?: string | null | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    address?: string | null | undefined;
    openingHours?: Record<string, unknown> | null | undefined;
    socialLinks?: Record<string, unknown> | null | undefined;
    settings?: Record<string, unknown> | null | undefined;
}>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
//# sourceMappingURL=restaurant.validator.d.ts.map