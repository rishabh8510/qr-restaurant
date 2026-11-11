import { Restaurant } from '../models';
import { UpdateRestaurantInput } from '../validators/restaurant.validator';
import { NotFoundError } from '../utils/errors';
import { storageService } from './StorageService';

export class RestaurantService {
  async get() {
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = await Restaurant.create({
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

  async update(input: UpdateRestaurantInput, logoUrl?: string, coverUrl?: string) {
    const restaurant = await this.get();

    if (input.name) restaurant.name = input.name;
    if (input.description !== undefined) restaurant.description = input.description;
    if (input.address !== undefined) restaurant.address = input.address;
    if (input.phone !== undefined) restaurant.phone = input.phone;
    if (input.email !== undefined) restaurant.email = input.email;
    if (input.openingHours !== undefined) restaurant.openingHours = input.openingHours;
    if (input.socialLinks !== undefined) restaurant.socialLinks = input.socialLinks;
    if (input.settings !== undefined) restaurant.settings = input.settings;

    if (logoUrl) {
      if (restaurant.logo) await storageService.delete(restaurant.logo);
      restaurant.logo = logoUrl;
    }
    if (coverUrl) {
      if (restaurant.coverImage) await storageService.delete(restaurant.coverImage);
      restaurant.coverImage = coverUrl;
    }

    await restaurant.save();
    return restaurant;
  }
}

export const restaurantService = new RestaurantService();
