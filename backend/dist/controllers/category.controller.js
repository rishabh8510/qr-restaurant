"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.listCategories = void 0;
const CategoryService_1 = require("../services/CategoryService");
const category_validator_1 = require("../validators/category.validator");
const StorageService_1 = require("../services/StorageService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.listCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await CategoryService_1.categoryService.list({
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 50,
        search: req.query.search,
        status: req.query.status,
    });
    res.json({ success: true, ...result });
});
exports.getCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await CategoryService_1.categoryService.getById(req.params.id);
    res.json({ success: true, data: category });
});
exports.createCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = { ...req.body };
    if (typeof body.isActive === 'string')
        body.isActive = body.isActive === 'true';
    if (typeof body.sortOrder === 'string')
        body.sortOrder = parseInt(body.sortOrder, 10);
    const input = category_validator_1.createCategorySchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'categories');
    }
    const category = await CategoryService_1.categoryService.create(input, imageUrl);
    res.status(201).json({ success: true, data: category });
});
exports.updateCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = { ...req.body };
    if (typeof body.isActive === 'string')
        body.isActive = body.isActive === 'true';
    if (typeof body.sortOrder === 'string')
        body.sortOrder = parseInt(body.sortOrder, 10);
    const input = category_validator_1.updateCategorySchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'categories');
    }
    const category = await CategoryService_1.categoryService.update(req.params.id, input, imageUrl);
    res.json({ success: true, data: category });
});
exports.deleteCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await CategoryService_1.categoryService.delete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
});
//# sourceMappingURL=category.controller.js.map