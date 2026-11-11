import { Model, Optional } from 'sequelize';
interface BannerAttributes {
    id: string;
    image: string;
    title: string | null;
    link: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface BannerCreationAttributes extends Optional<BannerAttributes, 'id' | 'title' | 'link' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class Banner extends Model<BannerAttributes, BannerCreationAttributes> implements BannerAttributes {
    id: string;
    image: string;
    title: string | null;
    link: string | null;
    sortOrder: number;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export {};
//# sourceMappingURL=Banner.d.ts.map