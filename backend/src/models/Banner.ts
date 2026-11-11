// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// interface BannerAttributes {
//   id: string;
//   image: string;
//   title: string | null;
//   link: string | null;
//   sortOrder: number;
//   isActive: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
// }

// interface BannerCreationAttributes
//   extends Optional<
//     BannerAttributes,
//     'id' | 'title' | 'link' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'
//   > {}

// export class Banner
//   extends Model<BannerAttributes, BannerCreationAttributes>
//   implements BannerAttributes
// {
//   public id!: string;
//   public image!: string;
//   public title!: string | null;
//   public link!: string | null;
//   public sortOrder!: number;
//   public isActive!: boolean;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
//   public readonly deletedAt!: Date | null;
// }

// Banner.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     image: {
//       type: DataTypes.STRING(500),
//       allowNull: false,
//     },
//     title: {
//       type: DataTypes.STRING(150),
//       allowNull: true,
//     },
//     link: {
//       type: DataTypes.STRING(500),
//       allowNull: true,
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
//     tableName: 'banners',
//     timestamps: true,
//     paranoid: true,
//     underscored: true,
//   }
// );





import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

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

interface BannerCreationAttributes
  extends Optional<
    BannerAttributes,
    'id' | 'title' | 'link' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export class Banner
  extends Model<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes
{
  declare id: string;
  declare image: string;
  declare title: string | null;
  declare link: string | null;
  declare sortOrder: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Banner.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
    tableName: 'banners',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);