// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

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





import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

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

interface SubCategoryCreationAttributes
  extends Optional<
    SubCategoryAttributes,
    'id' | 'slug' | 'description' | 'image' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export class SubCategory
  extends Model<SubCategoryAttributes, SubCategoryCreationAttributes>
  implements SubCategoryAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string | null;
  declare description: string | null;
  declare image: string | null;
  declare isActive: boolean;
  declare sortOrder: number;
  declare categoryId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

SubCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id',
    },
  },
  {
    sequelize,
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
  }
);