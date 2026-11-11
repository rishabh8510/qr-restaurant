import { Model, Optional } from 'sequelize';
interface SubCategoryAttributes {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
    categoryId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface SubCategoryCreationAttributes extends Optional<SubCategoryAttributes, 'id' | 'slug' | 'description' | 'image' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class SubCategory extends Model<SubCategoryAttributes, SubCategoryCreationAttributes> implements SubCategoryAttributes {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
    categoryId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export {};
//# sourceMappingURL=SubCategory.d.ts.map