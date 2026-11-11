// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

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





import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

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

interface DishOfTheDayCreationAttributes
  extends Optional<
    DishOfTheDayAttributes,
    'id' | 'productId' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export class DishOfTheDay
  extends Model<DishOfTheDayAttributes, DishOfTheDayCreationAttributes>
  implements DishOfTheDayAttributes
{
  declare id: string;
  declare name: string;
  declare price: number;
  declare image: string;
  declare productId: string | null;
  declare sortOrder: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

DishOfTheDay.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'product_id',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'dish_of_the_day',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);