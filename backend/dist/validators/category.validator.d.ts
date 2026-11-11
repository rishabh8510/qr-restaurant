import { z } from 'zod';
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
}, {
    name: string;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
}, {
    isActive?: boolean | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
}>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
//# sourceMappingURL=category.validator.d.ts.map