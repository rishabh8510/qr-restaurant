import { Model, Optional } from 'sequelize';
interface ProductAttributes {
    id: string;
    name: string;
    description: string | null;
    price: number;
    oldPrice: number | null;
    discount: string | null;
    categoryId: string | null;
    subCategoryId: string | null;
    image: string | null;
    weight: string | null;
    prepTime: string | null;
    isVeg: boolean;
    isEgg: boolean;
    isVegan: boolean;
    isAvailable: boolean;
    isActive: boolean;
    isNew: boolean;
    isBestseller: boolean;
    tags: string[] | null;
    rating: number | null;
    reviewCount: number;
    orderCount: number;
    metadata: object | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'oldPrice' | 'discount' | 'categoryId' | 'subCategoryId' | 'image' | 'weight' | 'prepTime' | 'isVeg' | 'isEgg' | 'isVegan' | 'isAvailable' | 'isActive' | 'isNew' | 'isBestseller' | 'tags' | 'rating' | 'reviewCount' | 'orderCount' | 'metadata' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    id: string;
    name: string;
    description: string | null;
    price: number;
    oldPrice: number | null;
    discount: string | null;
    categoryId: string | null;
    subCategoryId: string | null;
    image: string | null;
    weight: string | null;
    prepTime: string | null;
    isVeg: boolean;
    isEgg: boolean;
    isVegan: boolean;
    isAvailable: boolean;
    isActive: boolean;
    isNew: boolean;
    isBestseller: boolean;
    tags: string[] | null;
    rating: number | null;
    reviewCount: number;
    orderCount: number;
    metadata: object | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export {};
//# sourceMappingURL=Product.d.ts.map