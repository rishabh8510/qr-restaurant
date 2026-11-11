"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffService = exports.StaffService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const errors_1 = require("../utils/errors");
class StaffService {
    async list(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 10, 100);
        const offset = (page - 1) * limit;
        const where = { role: 'staff' };
        if (query.search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
            ];
        }
        if (query.status === 'active')
            where.isActive = true;
        if (query.status === 'inactive')
            where.isActive = false;
        const { rows, count } = await models_1.User.findAndCountAll({
            where,
            attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        return {
            data: rows,
            meta: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
    async getById(id) {
        const staff = await models_1.User.findOne({
            where: { id, role: 'staff' },
            attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
        });
        if (!staff)
            throw new errors_1.NotFoundError('Staff not found');
        return staff;
    }
    async create(input) {
        const existing = await models_1.User.findOne({ where: { email: input.email.toLowerCase() } });
        if (existing)
            throw new errors_1.ConflictError('Email already in use');
        const hashed = await argon2_1.default.hash(input.password);
        const staff = await models_1.User.create({
            name: input.name,
            email: input.email.toLowerCase(),
            phone: input.phone || null,
            password: hashed,
            role: 'staff',
            isActive: true,
        });
        return {
            id: staff.id,
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            role: staff.role,
            isActive: staff.isActive,
            createdAt: staff.createdAt,
        };
    }
    async update(id, input) {
        const staff = await models_1.User.findOne({ where: { id, role: 'staff' } });
        if (!staff)
            throw new errors_1.NotFoundError('Staff not found');
        if (input.email && input.email.toLowerCase() !== staff.email) {
            const existing = await models_1.User.findOne({ where: { email: input.email.toLowerCase() } });
            if (existing)
                throw new errors_1.ConflictError('Email already in use');
            staff.email = input.email.toLowerCase();
        }
        if (input.name)
            staff.name = input.name;
        if (input.phone !== undefined)
            staff.phone = input.phone;
        if (input.isActive !== undefined)
            staff.isActive = input.isActive;
        if (input.password) {
            staff.password = await argon2_1.default.hash(input.password);
        }
        await staff.save();
        return {
            id: staff.id,
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            role: staff.role,
            isActive: staff.isActive,
            updatedAt: staff.updatedAt,
        };
    }
    async delete(id) {
        const staff = await models_1.User.findOne({ where: { id, role: 'staff' } });
        if (!staff)
            throw new errors_1.NotFoundError('Staff not found');
        await staff.destroy();
    }
    async toggleStatus(id) {
        const staff = await models_1.User.findOne({ where: { id, role: 'staff' } });
        if (!staff)
            throw new errors_1.NotFoundError('Staff not found');
        staff.isActive = !staff.isActive;
        await staff.save();
        return {
            id: staff.id,
            isActive: staff.isActive,
        };
    }
}
exports.StaffService = StaffService;
exports.staffService = new StaffService();
//# sourceMappingURL=StaffService.js.map