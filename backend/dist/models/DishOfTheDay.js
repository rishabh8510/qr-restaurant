"use strict";
// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishOfTheDay = void 0;
// interface DishOfTheDayAttributes {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   productId: string | null;
//   sortOrder: number;
//   isActive: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
// }
// interface DishOfTheDayCreationAttributes
//   extends Optional<
//     DishOfTheDayAttributes,
//     'id' | 'productId' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'
//   > {}
// export class DishOfTheDay
//   extends Model<DishOfTheDayAttributes, DishOfTheDayCreationAttributes>
//   implements DishOfTheDayAttributes
// {
//   public id!: string;
//   public name!: string;
//   public price!: number;
//   public image!: string;
//   public productId!: string | null;
//   public sortOrder!: number;
//   public isActive!: boolean;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
//   public readonly deletedAt!: Date | null;
// }
// DishOfTheDay.init(
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
//     price: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     image: {
//       type: DataTypes.STRING(500),
//       allowNull: false,
//     },
//     productId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       field: 'product_id',
//     },
//     sortOrder: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//       field: 'sort_order',
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//       field: 'is_active',
//     },
//   },
//   {
//     sequelize,
//     tableName: 'dish_of_the_day',
//     timestamps: true,
//     paranoid: true,
//     underscored: true,
//   }
// );
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class DishOfTheDay extends sequelize_1.Model {
}
exports.DishOfTheDay = DishOfTheDay;
DishOfTheDay.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
    },
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'product_id',
    },
    sortOrder: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sort_order',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'dish_of_the_day',
    timestamps: true,
    paranoid: true,
    underscored: true,
});
//# sourceMappingURL=DishOfTheDay.js.map