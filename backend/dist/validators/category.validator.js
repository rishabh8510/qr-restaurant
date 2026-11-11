"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().max(120).optional().nullable(),
    description: zod_1.z.string().max(1000).optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
    sortOrder: zod_1.z.number().int().optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
//# sourceMappingURL=category.validator.js.map