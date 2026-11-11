"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const errors_1 = require("../utils/errors");
const StorageService_1 = require("./StorageService");
const slug_1 = require("../utils/slug");
class CategoryService {
    async list(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 50, 100);
        const offset = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.name = { [sequelize_1.Op.iLike]: `%${query.search}%` };
        }
        if (query.status === 'active')
            where.isActive = true;
        if (query.status === 'inactive')
            where.isActive = false;
        const { rows, count } = await models_1.Category.findAndCountAll({
            where,
            order: [
                ['sortOrder', 'ASC'],
                ['name', 'ASC'],
            ],
            limit,
            offset,
        });
        return {
            data: rows,
            meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
        };
    }
    async getById(id) {
        const category = await models_1.Category.findByPk(id);
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        return category;
    }
    async create(input, imageUrl) {
        const existing = await models_1.Category.findOne({ where: { name: input.name } });
        if (existing)
            throw new errors_1.ConflictError('Category name already exists');
        const slug = input.slug?.trim() || (0, slug_1.slugify)(input.name);
        return models_1.Category.create({
            name: input.name,
            slug,
            description: input.description || null,
            image: imageUrl || null,
            isActive: input.isActive ?? true,
            sortOrder: input.sortOrder ?? 0,
        });
    }
    async update(id, input, imageUrl) {
        const category = await models_1.Category.findByPk(id);
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        if (input.name && input.name !== category.name) {
            const existing = await models_1.Category.findOne({ where: { name: input.name } });
            if (existing)
                throw new errors_1.ConflictError('Category name already exists');
            category.name = input.name;
            if (!input.slug)
                category.slug = (0, slug_1.slugify)(input.name);
        }
        if (input.slug !== undefined)
            category.slug = input.slug || (0, slug_1.slugify)(category.name);
        if (input.description !== undefined)
            category.description = input.description;
        if (input.isActive !== undefined)
            category.isActive = input.isActive;
        if (input.sortOrder !== undefined)
            category.sortOrder = input.sortOrder;
        if (imageUrl) {
            if (category.image)
                await StorageService_1.storageService.delete(category.image);
            category.image = imageUrl;
        }
        await category.save();
        return category;
    }
    async delete(id) {
        const category = await models_1.Category.findByPk(id);
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        if (category.image)
            await StorageService_1.storageService.delete(category.image);
        await category.destroy();
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
//# sourceMappingURL=CategoryService.js.map