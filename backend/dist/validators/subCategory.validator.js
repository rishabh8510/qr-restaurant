"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubCategorySchema = exports.createSubCategorySchema = void 0;
const zod_1 = require("zod");
exports.createSubCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().max(120).optional().nullable(),
    description: zod_1.z.string().max(1000).optional().nullable(),
    categoryId: zod_1.z.string().uuid(),
    isActive: zod_1.z.boolean().optional(),
    sortOrder: zod_1.z.number().int().optional(),
});
exports.updateSubCategorySchema = exports.createSubCategorySchema
    .partial()
    .omit({ categoryId: true })
    .extend({
    categoryId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=subCategory.validator.js.map