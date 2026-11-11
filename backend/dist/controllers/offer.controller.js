"use strict";
// import { offerService } from '../services/OfferService';
// import { createOfferSchema, updateOfferSchema } from '../validators/offer.validator';
// import { storageService } from '../services/StorageService';
// import { asyncHandler } from '../utils/asyncHandler';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOffer = exports.updateOffer = exports.createOffer = exports.getOffer = exports.listOffers = void 0;
// export const listOffers = asyncHandler(async (req, res) => {
//   const result = await offerService.list({
//     page: req.query.page ? parseInt(req.query.page as string) : 1,
//     limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
//     search: req.query.search as string,
//     status: req.query.status as string,
//     activeOnly: req.query.activeOnly === 'true',
//   });
//   res.json({ success: true, ...result });
// });
// export const getOffer = asyncHandler(async (req, res) => {
//   const offer = await offerService.getById(req.params.id);
//   res.json({ success: true, data: offer });
// });
// export const createOffer = asyncHandler(async (req, res) => {
//   const body = { ...req.body };
//   if (typeof body.discountValue === 'string') body.discountValue = parseFloat(body.discountValue);
//   if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
//   if (typeof body.productIds === 'string') {
//     try { body.productIds = JSON.parse(body.productIds); } catch { body.productIds = []; }
//   }
//   if (typeof body.categoryIds === 'string') {
//     try { body.categoryIds = JSON.parse(body.categoryIds); } catch { body.categoryIds = []; }
//   }
//   const input = createOfferSchema.parse(body);
//   let imageUrl: string | undefined;
//   if (req.file) {
//     imageUrl = await storageService.upload(req.file, 'offers');
//   }
//   const offer = await offerService.create(input, imageUrl);
//   res.status(201).json({ success: true, data: offer });
// });
// export const updateOffer = asyncHandler(async (req, res) => {
//   const body = { ...req.body };
//   if (typeof body.discountValue === 'string') body.discountValue = parseFloat(body.discountValue);
//   if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
//   if (typeof body.productIds === 'string') {
//     try { body.productIds = JSON.parse(body.productIds); } catch { body.productIds = []; }
//   }
//   if (typeof body.categoryIds === 'string') {
//     try { body.categoryIds = JSON.parse(body.categoryIds); } catch { body.categoryIds = []; }
//   }
//   const input = updateOfferSchema.parse(body);
//   let imageUrl: string | undefined;
//   if (req.file) {
//     imageUrl = await storageService.upload(req.file, 'offers');
//   }
//   const offer = await offerService.update(req.params.id, input, imageUrl);
//   res.json({ success: true, data: offer });
// });
// export const deleteOffer = asyncHandler(async (req, res) => {
//   await offerService.delete(req.params.id);
//   res.json({ success: true, message: 'Offer deleted successfully' });
// });
const OfferService_1 = require("../services/OfferService");
const offer_validator_1 = require("../validators/offer.validator");
const StorageService_1 = require("../services/StorageService");
const asyncHandler_1 = require("../utils/asyncHandler");
function normalizeBody(raw) {
    const body = { ...raw };
    if (typeof body.discountValue === 'string')
        body.discountValue = parseFloat(body.discountValue);
    if (typeof body.isActive === 'string')
        body.isActive = body.isActive === 'true';
    if (typeof body.minOrderCount === 'string') {
        body.minOrderCount = body.minOrderCount ? parseInt(body.minOrderCount, 10) : null;
    }
    if (typeof body.productIds === 'string') {
        try {
            body.productIds = JSON.parse(body.productIds);
        }
        catch {
            body.productIds = [];
        }
    }
    if (typeof body.categoryIds === 'string') {
        try {
            body.categoryIds = JSON.parse(body.categoryIds);
        }
        catch {
            body.categoryIds = [];
        }
    }
    return body;
}
exports.listOffers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await OfferService_1.offerService.list({
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 20,
        search: req.query.search,
        status: req.query.status,
        activeOnly: req.query.activeOnly === 'true',
    });
    res.json({ success: true, ...result });
});
exports.getOffer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const offer = await OfferService_1.offerService.getById(req.params.id);
    res.json({ success: true, data: offer });
});
exports.createOffer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = normalizeBody({ ...req.body });
    const input = offer_validator_1.createOfferSchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'offers');
    }
    const offer = await OfferService_1.offerService.create(input, imageUrl);
    res.status(201).json({ success: true, data: offer });
});
exports.updateOffer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = normalizeBody({ ...req.body });
    const input = offer_validator_1.updateOfferSchema.parse(body);
    let imageUrl;
    if (req.file) {
        imageUrl = await StorageService_1.storageService.upload(req.file, 'offers');
    }
    const offer = await OfferService_1.offerService.update(req.params.id, input, imageUrl);
    res.json({ success: true, data: offer });
});
exports.deleteOffer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await OfferService_1.offerService.delete(req.params.id);
    res.json({ success: true, message: 'Offer deleted successfully' });
});
//# sourceMappingURL=offer.controller.js.map