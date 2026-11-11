import { Model, Optional } from 'sequelize';
interface CategoryAttributes {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'slug' | 'description' | 'image' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export {};
//# sourceMappingURL=Category.d.ts.map