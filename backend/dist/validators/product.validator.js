"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const tagsSchema = zod_1.z
    .union([
    zod_1.z.array(zod_1.z.string()),
    zod_1.z.string().transform((s) => {
        try {
            const parsed = JSON.parse(s);
            return Array.isArray(parsed) ? parsed.map(String) : s.split(',').map((t) => t.trim()).filter(Boolean);
        }
        catch {
            return s.split(',').map((t) => t.trim()).filter(Boolean);
        }
    }),
])
    .optional()
    .nullable();
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(150),
    description: zod_1.z.string().max(2000).optional().nullable(),
    price: zod_1.z.number().min(0),
    oldPrice: zod_1.z.number().min(0).optional().nullable(),
    discount: zod_1.z.string().max(50).optional().nullable(),
    categoryId: zod_1.z.string().uuid().optional().nullable(),
    subCategoryId: zod_1.z.string().uuid().optional().nullable(),
    weight: zod_1.z.string().max(50).optional().nullable(),
    prepTime: zod_1.z.string().max(50).optional().nullable(),
    isVeg: zod_1.z.boolean().optional(),
    isEgg: zod_1.z.boolean().optional(),
    isVegan: zod_1.z.boolean().optional(),
    isAvailable: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    isNew: zod_1.z.boolean().optional(),
    isBestseller: zod_1.z.boolean().optional(),
    tags: tagsSchema,
    rating: zod_1.z.number().min(0).max(5).optional().nullable(),
    reviewCount: zod_1.z.number().int().min(0).optional(),
    orderCount: zod_1.z.number().int().min(0).optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional().nullable(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
//# sourceMappingURL=product.validator.js.map