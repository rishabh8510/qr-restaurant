"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.updateSubCategory = exports.createSubCategory = exports.getSubCategory = exports.listSubCategories = void 0;
const SubCategoryService_1 = require("../services/SubCategoryService");
const subCategory_validator_1 = require("../validators/subCategory.validator");
const StorageService_1 = require("../services/StorageService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.listSubCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await SubCategoryService_1.subCategoryService.list({
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 50,
        search: req.query.search,
        status: req.query.status,
        categoryId: req.query.categoryId,
    });
    res.json({ success: true, ...result });
});
exports.getSubCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subCategory = await SubCategoryService_1.subCategoryService.getById(req.params.id);
    res.json({ success: true, data: subCategory });
});
exports.createSubCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = { ...req.body };
    if (typeof body.isActive === 'string')
        body.isActive = body.isActive === 'true';
    if (typeof body.sortOrder === 'string')
        body.sortOrder = parseInt(body.sortOrder, 10);
    const input = subCategory_validator_1.createSubCategorySchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'sub-categories');
    }
    const subCategory = await SubCategoryService_1.subCategoryService.create(input, imageUrl);
    res.status(201).json({ success: true, data: subCategory });
});
exports.updateSubCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = { ...req.body };
    if (typeof body.isActive === 'string')
        body.isActive = body.isActive === 'true';
    if (typeof body.sortOrder === 'string')
        body.sortOrder = parseInt(body.sortOrder, 10);
    const input = subCategory_validator_1.updateSubCategorySchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'sub-categories');
    }
    const subCategory = await SubCategoryService_1.subCategoryService.update(req.params.id, input, imageUrl);
    res.json({ success: true, data: subCategory });
});
exports.deleteSubCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await SubCategoryService_1.subCategoryService.delete(req.params.id);
    res.json({ success: true, message: 'Sub-category deleted successfully' });
});
//# sourceMappingURL=subCategory.controller.js.map