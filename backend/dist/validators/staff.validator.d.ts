import { z } from 'zod';
export declare const createStaffSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    phone?: string | null | undefined;
}, {
    email: string;
    password: string;
    name: string;
    phone?: string | null | undefined;
}>;
export declare const updateStaffSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    phone?: string | null | undefined;
    password?: string | undefined;
    isActive?: boolean | undefined;
    name?: string | undefined;
}, {
    email?: string | undefined;
    phone?: string | null | undefined;
    password?: string | undefined;
    isActive?: boolean | undefined;
    name?: string | undefined;
}>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
//# sourceMappingURL=staff.validator.d.ts.map