"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const errors_1 = require("../utils/errors");
const StorageService_1 = require("./StorageService");
function normalizeTags(tags) {
    if (tags == null)
        return null;
    if (Array.isArray(tags))
        return tags.map(String);
    if (typeof tags === 'string') {
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed))
                return parsed.map(String);
        }
        catch {
            /* ignore */
        }
        return tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
    }
    return null;
}
class ProductService {
    async list(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 20, 100);
        const offset = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.name = { [sequelize_1.Op.iLike]: `%${query.search}%` };
        }
        if (query.status === 'active')
            where.isActive = true;
        if (query.status === 'inactive')
            where.isActive = false;
        if (query.available === 'true')
            where.isAvailable = true;
        if (query.available === 'false')
            where.isAvailable = false;
        if (query.categoryId)
            where.categoryId = query.categoryId;
        if (query.subCategoryId)
            where.subCategoryId = query.subCategoryId;
        const { rows, count } = await models_1.Product.findAndCountAll({
            where,
            include: [
                { model: models_1.Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: models_1.SubCategory, as: 'subCategory', attributes: ['id', 'name', 'slug', 'categoryId'] },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        return {
            data: rows,
            meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
        };
    }
    async getById(id) {
        const product = await models_1.Product.findByPk(id, {
            include: [
                { model: models_1.Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                { model: models_1.SubCategory, as: 'subCategory', attributes: ['id', 'name', 'slug', 'categoryId'] },
            ],
        });
        if (!product)
            throw new errors_1.NotFoundError('Product not found');
        return product;
    }
    async create(input, imageUrl) {
        let categoryId = input.categoryId || null;
        let subCategoryId = input.subCategoryId || null;
        if (subCategoryId) {
            const sub = await models_1.SubCategory.findByPk(subCategoryId);
            if (!sub)
                throw new errors_1.NotFoundError('Sub-category not found');
            categoryId = sub.categoryId;
        }
        else if (categoryId) {
            const cat = await models_1.Category.findByPk(categoryId);
            if (!cat)
                throw new errors_1.NotFoundError('Category not found');
        }
        return models_1.Product.create({
            name: input.name,
            description: input.description || null,
            price: input.price,
            oldPrice: input.oldPrice ?? null,
            discount: input.discount || null,
            categoryId,
            subCategoryId,
            image: imageUrl || null,
            weight: input.weight || null,
            prepTime: input.prepTime || null,
            isVeg: input.isVeg ?? true,
            isEgg: input.isEgg ?? false,
            isVegan: input.isVegan ?? false,
            isAvailable: input.isAvailable ?? true,
            isActive: input.isActive ?? true,
            isNew: input.isNew ?? false,
            isBestseller: input.isBestseller ?? false,
            tags: normalizeTags(input.tags),
            rating: input.rating ?? 0,
            reviewCount: input.reviewCount ?? 0,
            orderCount: input.orderCount ?? 0,
            metadata: input.metadata || null,
        });
    }
    async update(id, input, imageUrl) {
        const product = await models_1.Product.findByPk(id);
        if (!product)
            throw new errors_1.NotFoundError('Product not found');
        if (input.subCategoryId !== undefined) {
            if (input.subCategoryId) {
                const sub = await models_1.SubCategory.findByPk(input.subCategoryId);
                if (!sub)
                    throw new errors_1.NotFoundError('Sub-category not found');
                product.subCategoryId = input.subCategoryId;
                product.categoryId = sub.categoryId;
            }
            else {
                product.subCategoryId = null;
            }
        }
        if (input.categoryId !== undefined && input.subCategoryId === undefined) {
            if (input.categoryId) {
                const cat = await models_1.Category.findByPk(input.categoryId);
                if (!cat)
                    throw new errors_1.NotFoundError('Category not found');
                product.categoryId = input.categoryId;
            }
            else {
                product.categoryId = null;
            }
        }
        if (input.name)
            product.name = input.name;
        if (input.description !== undefined)
            product.description = input.description;
        if (input.price !== undefined)
            product.price = input.price;
        if (input.oldPrice !== undefined)
            product.oldPrice = input.oldPrice;
        if (input.discount !== undefined)
            product.discount = input.discount;
        if (input.weight !== undefined)
            product.weight = input.weight;
        if (input.prepTime !== undefined)
            product.prepTime = input.prepTime;
        if (input.isVeg !== undefined)
            product.isVeg = input.isVeg;
        if (input.isEgg !== undefined)
            product.isEgg = input.isEgg;
        if (input.isVegan !== undefined)
            product.isVegan = input.isVegan;
        if (input.isAvailable !== undefined)
            product.isAvailable = input.isAvailable;
        if (input.isActive !== undefined)
            product.isActive = input.isActive;
        if (input.isNew !== undefined)
            product.isNew = input.isNew;
        if (input.isBestseller !== undefined)
            product.isBestseller = input.isBestseller;
        if (input.tags !== undefined)
            product.tags = normalizeTags(input.tags);
        if (input.rating !== undefined)
            product.rating = input.rating;
        if (input.reviewCount !== undefined)
            product.reviewCount = input.reviewCount;
        if (input.orderCount !== undefined)
            product.orderCount = input.orderCount;
        if (input.metadata !== undefined)
            product.metadata = input.metadata;
        if (imageUrl) {
            if (product.image)
                await StorageService_1.storageService.delete(product.image);
            product.image = imageUrl;
        }
        await product.save();
        return this.getById(id);
    }
    async delete(id) {
        const product = await models_1.Product.findByPk(id);
        if (!product)
            throw new errors_1.NotFoundError('Product not found');
        if (product.image)
            await StorageService_1.storageService.delete(product.image);
        await product.destroy();
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
//# sourceMappingURL=ProductService.js.map