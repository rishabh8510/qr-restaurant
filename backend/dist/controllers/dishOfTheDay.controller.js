"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDish = exports.updateDish = exports.createDish = exports.listDishes = void 0;
const models_1 = require("../models");
const StorageService_1 = require("../services/StorageService");
const asyncHandler_1 = require("../utils/asyncHandler");
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const schema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(150),
    price: zod_1.z.number().min(0),
    productId: zod_1.z.string().uuid().optional().nullable(),
    sortOrder: zod_1.z.number().int().optional(),
    isActive: zod_1.z.boolean().optional(),
});
function parseBody(body) {
    const b = { ...body };
    if (typeof b.price === 'string')
        b.price = parseFloat(b.price);
    if (typeof b.isActive === 'string')
        b.isActive = b.isActive === 'true';
    if (typeof b.sortOrder === 'string')
        b.sortOrder = parseInt(b.sortOrder, 10);
    if (b.productId === '')
        b.productId = null;
    return b;
}
exports.listDishes = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const where = {};
    if (req.query.status === 'active')
        where.isActive = true;
    if (req.query.status === 'inactive')
        where.isActive = false;
    const rows = await models_1.DishOfTheDay.findAll({
        where,
        order: [
            ['sortOrder', 'ASC'],
            ['createdAt', 'DESC'],
        ],
    });
    res.json({ success: true, data: rows });
});
exports.createDish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = schema.parse(parseBody({ ...req.body }));
    if (!req.file) {
        res.status(400).json({ success: false, message: 'Image is required' });
        return;
    }
    const imageUrl = await StorageService_1.storageService.upload(req.file, 'dish-of-the-day');
    const dish = await models_1.DishOfTheDay.create({
        name: input.name,
        price: input.price,
        image: imageUrl,
        productId: input.productId || null,
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
    });
    res.status(201).json({ success: true, data: dish });
});
exports.updateDish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const dish = await models_1.DishOfTheDay.findByPk(req.params.id);
    if (!dish)
        throw new errors_1.NotFoundError('Dish not found');
    const input = schema.partial().parse(parseBody({ ...req.body }));
    if (input.name)
        dish.name = input.name;
    if (input.price !== undefined)
        dish.price = input.price;
    if (input.productId !== undefined)
        dish.productId = input.productId;
    if (input.sortOrder !== undefined)
        dish.sortOrder = input.sortOrder;
    if (input.isActive !== undefined)
        dish.isActive = input.isActive;
    if (req.file) {
        if (dish.image)
            await StorageService_1.storageService.delete(dish.image);
        dish.image = await StorageService_1.storageService.upload(req.file, 'dish-of-the-day');
    }
    await dish.save();
    res.json({ success: true, data: dish });
});
exports.deleteDish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const dish = await models_1.DishOfTheDay.findByPk(req.params.id);
    if (!dish)
        throw new errors_1.NotFoundError('Dish not found');
    if (dish.image)
        await StorageService_1.storageService.delete(dish.image);
    await dish.destroy();
    res.json({ success: true, message: 'Dish deleted' });
});
//# sourceMappingURL=dishOfTheDay.controller.js.map