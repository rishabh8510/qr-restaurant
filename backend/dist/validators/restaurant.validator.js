"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRestaurantSchema = void 0;
const zod_1 = require("zod");
exports.updateRestaurantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(150).optional(),
    description: zod_1.z.string().max(2000).optional().nullable(),
    address: zod_1.z.string().max(500).optional().nullable(),
    phone: zod_1.z.string().max(20).optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    openingHours: zod_1.z.record(zod_1.z.unknown()).optional().nullable(),
    socialLinks: zod_1.z.record(zod_1.z.unknown()).optional().nullable(),
    settings: zod_1.z.record(zod_1.z.unknown()).optional().nullable(),
});
//# sourceMappingURL=restaurant.validator.js.map