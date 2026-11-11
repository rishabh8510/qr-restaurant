import { Model, Optional } from 'sequelize';
interface RestaurantAttributes {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    coverImage: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    openingHours: object | null;
    socialLinks: object | null;
    settings: object | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface RestaurantCreationAttributes extends Optional<RestaurantAttributes, 'id' | 'description' | 'logo' | 'coverImage' | 'address' | 'phone' | 'email' | 'openingHours' | 'socialLinks' | 'settings' | 'createdAt' | 'updatedAt'> {
}
export declare class Restaurant extends Model<RestaurantAttributes, RestaurantCreationAttributes> implements RestaurantAttributes {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    coverImage: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    openingHours: object | null;
    socialLinks: object | null;
    settings: object | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export {};
//# sourceMappingURL=Restaurant.d.ts.map