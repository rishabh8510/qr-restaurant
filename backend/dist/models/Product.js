"use strict";
// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
// interface ProductAttributes {
//   id: string;
//   name: string;
//   description: string | null;
//   price: number;
//   oldPrice: number | null;
//   discount: string | null;
//   categoryId: string | null;
//   subCategoryId: string | null;
//   image: string | null;
//   weight: string | null;
//   prepTime: string | null;
//   isVeg: boolean;
//   isEgg: boolean;
//   isVegan: boolean;
//   isAvailable: boolean;
//   isActive: boolean;
//   isNew: boolean;
//   isBestseller: boolean;
//   tags: string[] | null;
//   rating: number | null;
//   reviewCount: number;
//   orderCount: number;
//   metadata: object | null;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
// }
// interface ProductCreationAttributes
//   extends Optional<
//     ProductAttributes,
//     | 'id'
//     | 'description'
//     | 'oldPrice'
//     | 'discount'
//     | 'categoryId'
//     | 'subCategoryId'
//     | 'image'
//     | 'weight'
//     | 'prepTime'
//     | 'isVeg'
//     | 'isEgg'
//     | 'isVegan'
//     | 'isAvailable'
//     | 'isActive'
//     | 'isNew'
//     | 'isBestseller'
//     | 'tags'
//     | 'rating'
//     | 'reviewCount'
//     | 'orderCount'
//     | 'metadata'
//     | 'createdAt'
//     | 'updatedAt'
//     | 'deletedAt'
//   > {}
// export class Product
//   extends Model<ProductAttributes, ProductCreationAttributes>
//   implements ProductAttributes
// {
//   public id!: string;
//   public name!: string;
//   public description!: string | null;
//   public price!: number;
//   public oldPrice!: number | null;
//   public discount!: string | null;
//   public categoryId!: string | null;
//   public subCategoryId!: string | null;
//   public image!: string | null;
//   public weight!: string | null;
//   public prepTime!: string | null;
//   public isVeg!: boolean;
//   public isEgg!: boolean;
//   public isVegan!: boolean;
//   public isAvailable!: boolean;
//   public isActive!: boolean;
//   public isNew!: boolean;
//   public isBestseller!: boolean;
//   public tags!: string[] | null;
//   public rating!: number | null;
//   public reviewCount!: number;
//   public orderCount!: number;
//   public metadata!: object | null;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
//   public readonly deletedAt!: Date | null;
// }
// Product.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(150),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     price: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//       validate: { min: 0 },
//     },
//     oldPrice: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: true,
//       field: 'old_price',
//     },
//     discount: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//     categoryId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       field: 'category_id',
//     },
//     subCategoryId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       field: 'sub_category_id',
//     },
//     image: {
//       type: DataTypes.STRING(500),
//       allowNull: true,
//     },
//     weight: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//     prepTime: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//       field: 'prep_time',
//     },
//     isVeg: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//       field: 'is_veg',
//     },
//     isEgg: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//       field: 'is_egg',
//     },
//     isVegan: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//       field: 'is_vegan',
//     },
//     isAvailable: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//       field: 'is_available',
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//       field: 'is_active',
//     },
//     isNew: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//       field: 'is_new',
//     },
//     isBestseller: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//       field: 'is_bestseller',
//     },
//     tags: {
//       type: DataTypes.JSONB,
//       allowNull: true,
//       defaultValue: [],
//     },
//     rating: {
//       type: DataTypes.DECIMAL(3, 2),
//       allowNull: true,
//       defaultValue: 0,
//     },
//     reviewCount: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//       field: 'review_count',
//     },
//     orderCount: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//       field: 'order_count',
//     },
//     metadata: {
//       type: DataTypes.JSONB,
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'products',
//     timestamps: true,
//     paranoid: true,
//     underscored: true,
//     indexes: [
//       { fields: ['category_id'] },
//       { fields: ['sub_category_id'] },
//       { fields: ['is_active'] },
//       { fields: ['is_available'] },
//       { fields: ['is_veg'] },
//       { fields: ['name'] },
//     ],
//   }
// );
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Product extends sequelize_1.Model {
}
exports.Product = Product;
Product.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
    },
    oldPrice: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'old_price',
    },
    discount: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'category_id',
    },
    subCategoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'sub_category_id',
    },
    image: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    weight: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    prepTime: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        field: 'prep_time',
    },
    isVeg: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_veg',
    },
    isEgg: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_egg',
    },
    isVegan: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_vegan',
    },
    isAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_available',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    },
    isNew: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_new',
    },
    isBestseller: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_bestseller',
    },
    tags: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
    },
    rating: {
        type: sequelize_1.DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0,
    },
    reviewCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'review_count',
    },
    orderCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'order_count',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['category_id'] },
        { fields: ['sub_category_id'] },
        { fields: ['is_active'] },
        { fields: ['is_available'] },
        { fields: ['is_veg'] },
        { fields: ['name'] },
    ],
});
//# sourceMappingURL=Product.js.map