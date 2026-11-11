"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantService = exports.RestaurantService = void 0;
const models_1 = require("../models");
const StorageService_1 = require("./StorageService");
class RestaurantService {
    async get() {
        let restaurant = await models_1.Restaurant.findOne();
        if (!restaurant) {
            restaurant = await models_1.Restaurant.create({
                name: 'My Restaurant',
                description: null,
                logo: null,
                coverImage: null,
                address: null,
                phone: null,
                email: null,
                openingHours: null,
                socialLinks: null,
                settings: null,
            });
        }
        return restaurant;
    }
    async update(input, logoUrl, coverUrl) {
        const restaurant = await this.get();
        if (input.name)
            restaurant.name = input.name;
        if (input.description !== undefined)
            restaurant.description = input.description;
        if (input.address !== undefined)
            restaurant.address = input.address;
        if (input.phone !== undefined)
            restaurant.phone = input.phone;
        if (input.email !== undefined)
            restaurant.email = input.email;
        if (input.openingHours !== undefined)
            restaurant.openingHours = input.openingHours;
        if (input.socialLinks !== undefined)
            restaurant.socialLinks = input.socialLinks;
        if (input.settings !== undefined)
            restaurant.settings = input.settings;
        if (logoUrl) {
            if (restaurant.logo)
                await StorageService_1.storageService.delete(restaurant.logo);
            restaurant.logo = logoUrl;
        }
        if (coverUrl) {
            if (restaurant.coverImage)
                await StorageService_1.storageService.delete(restaurant.coverImage);
            restaurant.coverImage = coverUrl;
        }
        await restaurant.save();
        return restaurant;
    }
}
exports.RestaurantService = RestaurantService;
exports.restaurantService = new RestaurantService();
//# sourceMappingURL=RestaurantService.js.map