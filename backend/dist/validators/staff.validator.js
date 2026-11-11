"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStaffSchema = exports.createStaffSchema = void 0;
const zod_1 = require("zod");
exports.createStaffSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().max(20).optional().nullable(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
exports.updateStaffSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().max(20).optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
    password: zod_1.z.string().min(8).optional(),
});
//# sourceMappingURL=staff.validator.js.map