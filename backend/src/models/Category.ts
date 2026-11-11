// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

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



import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

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

interface CategoryCreationAttributes
  extends Optional<
    CategoryAttributes,
    'id' | 'slug' | 'description' | 'image' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string | null;
  declare description: string | null;
  declare image: string | null;
  declare isActive: boolean;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    sequelize,
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
  }
);