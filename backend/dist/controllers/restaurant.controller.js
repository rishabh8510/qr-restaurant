"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRestaurant = exports.getRestaurant = void 0;
const RestaurantService_1 = require("../services/RestaurantService");
const restaurant_validator_1 = require("../validators/restaurant.validator");
const StorageService_1 = require("../services/StorageService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getRestaurant = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const restaurant = await RestaurantService_1.restaurantService.get();
    res.json({ success: true, data: restaurant });
});
exports.updateRestaurant = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = { ...req.body };
    // FormData may send settings as JSON string
    if (typeof body.settings === 'string') {
        try {
            body.settings = JSON.parse(body.settings);
        }
        catch {
            body.settings = undefined;
        }
    }
    const input = restaurant_validator_1.updateRestaurantSchema.parse(body);
    let logoUrl;
    let coverUrl;
    // Handle multiple files if using fields
    const files = req.files;
    if (files?.logo?.[0]) {
        logoUrl = await StorageService_1.storageService.upload(files.logo[0], 'restaurant');
    }
    if (files?.coverImage?.[0]) {
        coverUrl = await StorageService_1.storageService.upload(files.coverImage[0], 'restaurant');
    }
    // Single file fallback
    if (req.file) {
        logoUrl = await StorageService_1.storageService.upload(req.file, 'restaurant');
    }
    const restaurant = await RestaurantService_1.restaurantService.update(input, logoUrl, coverUrl);
    res.json({ success: true, data: restaurant });
});
//# sourceMappingURL=restaurant.controller.js.map