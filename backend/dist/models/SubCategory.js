"use strict";
// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategory = void 0;
// interface SubCategoryAttributes {
//   id: string;
//   name: string;
//   slug: string | null;
//   description: string | null;
//   image: string | null;
//   isActive: boolean;
//   sortOrder: number;
//   categoryId: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
// }
// interface SubCategoryCreationAttributes
//   extends Optional<
//     SubCategoryAttributes,
//     'id' | 'slug' | 'description' | 'image' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt' | 'deletedAt'
//   > {}
// export class SubCategory
//   extends Model<SubCategoryAttributes, SubCategoryCreationAttributes>
//   implements SubCategoryAttributes
// {
//   public id!: string;
//   public name!: string;
//   public slug!: string | null;
//   public description!: string | null;
//   public image!: string | null;
//   public isActive!: boolean;
//   public sortOrder!: number;
//   public categoryId!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
//   public readonly deletedAt!: Date | null;
// }
// SubCategory.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     slug: {
//       type: DataTypes.STRING(120),
//       allowNull: true,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     image: {
//       type: DataTypes.STRING(500),
//       allowNull: true,
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//       field: 'is_active',
//     },
//     sortOrder: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//       field: 'sort_order',
//     },
//     categoryId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       field: 'category_id',
//     },
//   },
//   {
//     sequelize,
//     tableName: 'sub_categories',
//     timestamps: true,
//     paranoid: true,
//     underscored: true,
//     indexes: [
//       { fields: ['category_id'] },
//       { fields: ['slug'] },
//       { fields: ['is_active'] },
//       { fields: ['sort_order'] },
//       { fields: ['name'] },
//     ],
//   }
// );
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class SubCategory extends sequelize_1.Model {
}
exports.SubCategory = SubCategory;
SubCategory.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(120),
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    },
    sortOrder: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sort_order',
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'category_id',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'sub_categories',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['category_id'] },
        { fields: ['slug'] },
        { fields: ['is_active'] },
        { fields: ['sort_order'] },
        { fields: ['name'] },
    ],
});
//# sourceMappingURL=SubCategory.js.map