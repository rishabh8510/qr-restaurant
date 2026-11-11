import { Model, Optional } from 'sequelize';
interface ProductLikeAttributes {
    id: string;
    productId: string;
    userId: string | null;
    guestKey: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
type Creation = Optional<ProductLikeAttributes, 'id' | 'userId' | 'guestKey' | 'createdAt' | 'updatedAt'>;
export declare class ProductLike extends Model<ProductLikeAttributes, Creation> implements ProductLikeAttributes {
    id: string;
    productId: string;
    userId: string | null;
    guestKey: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export {};
//# sourceMappingURL=ProductLike.d.ts.map