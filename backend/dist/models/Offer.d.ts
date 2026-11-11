import { Model, Optional } from 'sequelize';
interface OfferAttributes {
    id: string;
    title: string;
    description: string | null;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    applicableTo: 'all' | 'products' | 'categories';
    productIds: string[] | null;
    categoryIds: string[] | null;
    image: string | null;
    offerKind: 'menu' | 'loyalty';
    minOrderCount: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface OfferCreationAttributes extends Optional<OfferAttributes, 'id' | 'description' | 'isActive' | 'productIds' | 'categoryIds' | 'image' | 'offerKind' | 'minOrderCount' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class Offer extends Model<OfferAttributes, OfferCreationAttributes> implements OfferAttributes {
    id: string;
    title: string;
    description: string | null;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    applicableTo: 'all' | 'products' | 'categories';
    productIds: string[] | null;
    categoryIds: string[] | null;
    image: string | null;
    offerKind: 'menu' | 'loyalty';
    minOrderCount: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export {};
//# sourceMappingURL=Offer.d.ts.map