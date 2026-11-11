"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategoryService = exports.SubCategoryService = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const errors_1 = require("../utils/errors");
const StorageService_1 = require("./StorageService");
const slug_1 = require("../utils/slug");
class SubCategoryService {
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
        if (query.categoryId)
            where.categoryId = query.categoryId;
        const { rows, count } = await models_1.SubCategory.findAndCountAll({
            where,
            include: [{ model: models_1.Category, as: 'category', attributes: ['id', 'name'] }],
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
        const subCategory = await models_1.SubCategory.findByPk(id, {
            include: [{ model: models_1.Category, as: 'category', attributes: ['id', 'name'] }],
        });
        if (!subCategory)
            throw new errors_1.NotFoundError('Sub-category not found');
        return subCategory;
    }
    async create(input, imageUrl) {
        const category = await models_1.Category.findByPk(input.categoryId);
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        const existing = await models_1.SubCategory.findOne({
            where: { name: input.name, categoryId: input.categoryId },
        });
        if (existing)
            throw new errors_1.ConflictError('Sub-category name already exists in this category');
        const slug = input.slug?.trim() || (0, slug_1.slugify)(input.name);
        return models_1.SubCategory.create({
            name: input.name,
            slug,
            description: input.description || null,
            image: imageUrl || null,
            isActive: input.isActive ?? true,
            sortOrder: input.sortOrder ?? 0,
            categoryId: input.categoryId,
        });
    }
    async update(id, input, imageUrl) {
        const subCategory = await models_1.SubCategory.findByPk(id);
        if (!subCategory)
            throw new errors_1.NotFoundError('Sub-category not found');
        if (input.categoryId && input.categoryId !== subCategory.categoryId) {
            const category = await models_1.Category.findByPk(input.categoryId);
            if (!category)
                throw new errors_1.NotFoundError('Category not found');
            subCategory.categoryId = input.categoryId;
        }
        if (input.name && input.name !== subCategory.name) {
            const catId = input.categoryId || subCategory.categoryId;
            const existing = await models_1.SubCategory.findOne({
                where: { name: input.name, categoryId: catId },
            });
            if (existing)
                throw new errors_1.ConflictError('Sub-category name already exists in this category');
            subCategory.name = input.name;
            if (!input.slug)
                subCategory.slug = (0, slug_1.slugify)(input.name);
        }
        if (input.slug !== undefined)
            subCategory.slug = input.slug || (0, slug_1.slugify)(subCategory.name);
        if (input.description !== undefined)
            subCategory.description = input.description;
        if (input.isActive !== undefined)
            subCategory.isActive = input.isActive;
        if (input.sortOrder !== undefined)
            subCategory.sortOrder = input.sortOrder;
        if (imageUrl) {
            if (subCategory.image)
                await StorageService_1.storageService.delete(subCategory.image);
            subCategory.image = imageUrl;
        }
        await subCategory.save();
        return this.getById(id);
    }
    async delete(id) {
        const subCategory = await models_1.SubCategory.findByPk(id);
        if (!subCategory)
            throw new errors_1.NotFoundError('Sub-category not found');
        if (subCategory.image)
            await StorageService_1.storageService.delete(subCategory.image);
        await subCategory.destroy();
    }
}
exports.SubCategoryService = SubCategoryService;
exports.subCategoryService = new SubCategoryService();
//# sourceMappingURL=SubCategoryService.js.map