"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.listProducts = void 0;
const ProductService_1 = require("../services/ProductService");
const product_validator_1 = require("../validators/product.validator");
const StorageService_1 = require("../services/StorageService");
const asyncHandler_1 = require("../utils/asyncHandler");
function parseBody(body) {
    const b = { ...body };
    if (typeof b.price === 'string')
        b.price = parseFloat(b.price);
    if (typeof b.oldPrice === 'string') {
        b.oldPrice = b.oldPrice === '' ? null : parseFloat(b.oldPrice);
    }
    if (typeof b.rating === 'string') {
        b.rating = b.rating === '' ? null : parseFloat(b.rating);
    }
    if (typeof b.reviewCount === 'string')
        b.reviewCount = parseInt(b.reviewCount, 10) || 0;
    if (typeof b.orderCount === 'string')
        b.orderCount = parseInt(b.orderCount, 10) || 0;
    const boolFields = [
        'isVeg',
        'isEgg',
        'isVegan',
        'isAvailable',
        'isActive',
        'isNew',
        'isBestseller',
    ];
    for (const f of boolFields) {
        if (typeof b[f] === 'string')
            b[f] = b[f] === 'true';
    }
    return b;
}
exports.listProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await ProductService_1.productService.list({
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 20,
        search: req.query.search,
        status: req.query.status,
        categoryId: req.query.categoryId,
        subCategoryId: req.query.subCategoryId,
        available: req.query.available,
    });
    res.json({ success: true, ...result });
});
exports.getProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await ProductService_1.productService.getById(req.params.id);
    res.json({ success: true, data: product });
});
exports.createProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = parseBody({ ...req.body });
    const input = product_validator_1.createProductSchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'products');
    }
    const product = await ProductService_1.productService.create(input, imageUrl);
    res.status(201).json({ success: true, data: product });
});
exports.updateProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = parseBody({ ...req.body });
    const input = product_validator_1.updateProductSchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'products');
    }
    const product = await ProductService_1.productService.update(req.params.id, input, imageUrl);
    res.json({ success: true, data: product });
});
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await ProductService_1.productService.delete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
});
//# sourceMappingURL=product.controller.js.map