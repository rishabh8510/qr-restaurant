"use strict";
// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
// interface CategoryAttributes {
//   id: string;
//   name: string;
//   slug: string | null;
//   description: string | null;
//   image: string | null;
//   isActive: boolean;
//   sortOrder: number;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
// }
// interface CategoryCreationAttributes
//   extends Optional<
//     CategoryAttributes,
//     'id' | 'slug' | 'description' | 'image' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt' | 'deletedAt'
//   > {}
// export class Category
//   extends Model<CategoryAttributes, CategoryCreationAttributes>
//   implements CategoryAttributes
// {
//   public id!: string;
//   public name!: string;
//   public slug!: string | null;
//   public description!: string | null;
//   public image!: string | null;
//   public isActive!: boolean;
//   public sortOrder!: number;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
//   public readonly deletedAt!: Date | null;
// }
// Category.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       unique: true,
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
//   },
//   {
//     sequelize,
//     tableName: 'categories',
//     timestamps: true,
//     paranoid: true,
//     underscored: true,
//     indexes: [
//       { fields: ['name'], unique: true },
//       { fields: ['slug'] },
//       { fields: ['is_active'] },
//       { fields: ['sort_order'] },
//     ],
//   }
// );
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Category extends sequelize_1.Model {
}
exports.Category = Category;
Category.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
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
}, {
    sequelize: database_1.sequelize,
    tableName: 'categories',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['name'], unique: true },
        { fields: ['slug'] },
        { fields: ['is_active'] },
        { fields: ['sort_order'] },
    ],
});
//# sourceMappingURL=Category.js.map