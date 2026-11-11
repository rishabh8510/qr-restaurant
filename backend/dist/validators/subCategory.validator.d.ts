import { z } from 'zod';
export declare const createSubCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    categoryId: z.ZodString;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    categoryId: string;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
}, {
    name: string;
    categoryId: string;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
}>;
export declare const updateSubCategorySchema: z.ZodObject<Omit<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    categoryId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "categoryId"> & {
    categoryId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | undefined;
}, {
    isActive?: boolean | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    slug?: string | null | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | undefined;
}>;
export type CreateSubCategoryInput = z.infer<typeof createSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof updateSubCategorySchema>;
//# sourceMappingURL=subCategory.validator.d.ts.map