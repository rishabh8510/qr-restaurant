"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.listBanners = void 0;
const models_1 = require("../models");
const StorageService_1 = require("../services/StorageService");
const asyncHandler_1 = require("../utils/asyncHandler");
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const schema = zod_1.z.object({
    title: zod_1.z.string().max(150).optional().nullable(),
    link: zod_1.z.string().max(500).optional().nullable(),
    sortOrder: zod_1.z.number().int().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.listBanners = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const where = {};
    if (req.query.status === 'active')
        where.isActive = true;
    if (req.query.status === 'inactive')
        where.isActive = false;
    const rows = await models_1.Banner.findAll({
        where,
        order: [
            ['sortOrder', 'ASC'],
            ['createdAt', 'DESC'],
        ],
    });
    res.json({ success: true, data: rows });
});
exports.createBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = { ...req.body };
    if (typeof body.isActive === 'string')
        body.isActive = body.isActive === 'true';
    if (typeof body.sortOrder === 'string')
        body.sortOrder = parseInt(body.sortOrder, 10);
    const input = schema.parse(body);
    if (!req.file) {
        res.status(400).json({ success: false, message: 'Image is required' });
        return;
    }
    const imageUrl = await StorageService_1.storageService.upload(req.file, 'banners');
    const banner = await models_1.Banner.create({
        image: imageUrl,
        title: input.title || null,
        link: input.link || null,
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
    });
    res.status(201).json({ success: true, data: banner });
});
exports.updateBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const banner = await models_1.Banner.findByPk(req.params.id);
    if (!banner)
        throw new errors_1.NotFoundError('Banner not found');
    const body = { ...req.body };
    if (typeof body.isActive === 'string')
        body.isActive = body.isActive === 'true';
    if (typeof body.sortOrder === 'string')
        body.sortOrder = parseInt(body.sortOrder, 10);
    const input = schema.partial().parse(body);
    if (input.title !== undefined)
        banner.title = input.title;
    if (input.link !== undefined)
        banner.link = input.link;
    if (input.sortOrder !== undefined)
        banner.sortOrder = input.sortOrder;
    if (input.isActive !== undefined)
        banner.isActive = input.isActive;
    if (req.file) {
        if (banner.image)
            await StorageService_1.storageService.delete(banner.image);
        banner.image = await StorageService_1.storageService.upload(req.file, 'banners');
    }
    await banner.save();
    res.json({ success: true, data: banner });
});
exports.deleteBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const banner = await models_1.Banner.findByPk(req.params.id);
    if (!banner)
        throw new errors_1.NotFoundError('Banner not found');
    if (banner.image)
        await StorageService_1.storageService.delete(banner.image);
    await banner.destroy();
    res.json({ success: true, message: 'Banner deleted' });
});
//# sourceMappingURL=banner.controller.js.map