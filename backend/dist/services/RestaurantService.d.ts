import { Restaurant } from '../models';
import { UpdateRestaurantInput } from '../validators/restaurant.validator';
export declare class RestaurantService {
    get(): Promise<Restaurant>;
    update(input: UpdateRestaurantInput, logoUrl?: string, coverUrl?: string): Promise<Restaurant>;
}
export declare const restaurantService: RestaurantService;
//# sourceMappingURL=RestaurantService.d.ts.map