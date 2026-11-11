import { Model, Optional } from 'sequelize';
interface DishOfTheDayAttributes {
    id: string;
    name: string;
    price: number;
    image: string;
    productId: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface DishOfTheDayCreationAttributes extends Optional<DishOfTheDayAttributes, 'id' | 'productId' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class DishOfTheDay extends Model<DishOfTheDayAttributes, DishOfTheDayCreationAttributes> implements DishOfTheDayAttributes {
    id: string;
    name: string;
    price: number;
    image: string;
    productId: string | null;
    sortOrder: number;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export {};
//# sourceMappingURL=DishOfTheDay.d.ts.map