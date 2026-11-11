// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// interface OfferAttributes {
//   id: string;
//   title: string;
//   description: string | null;
//   discountType: 'percentage' | 'fixed';
//   discountValue: number;
//   startDate: Date;
//   endDate: Date;
//   isActive: boolean;
//   applicableTo: 'all' | 'products' | 'categories';
//   productIds: string[] | null;
//   categoryIds: string[] | null;
//   image: string | null;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
// }

// interface OfferCreationAttributes
//   extends Optional<
//     OfferAttributes,
//     | 'id'
//     | 'description'
//     | 'isActive'
//     | 'productIds'
//     | 'categoryIds'
//     | 'image'
//     | 'createdAt'
//     | 'updatedAt'
//     | 'deletedAt'
//   > {}

// export class Offer extends Model<OfferAttributes, OfferCreationAttributes> implements OfferAttributes {
//   declare id: string;
//   declare title: string;
//   declare description: string | null;
//   declare discountType: 'percentage' | 'fixed';
//   declare discountValue: number;
//   declare startDate: Date;
//   declare endDate: Date;
//   declare isActive: boolean;
//   declare applicableTo: 'all' | 'products' | 'categories';
//   declare productIds: string[] | null;
//   declare categoryIds: string[] | null;
//   declare image: string | null;
//   declare readonly createdAt: Date;
//   declare readonly updatedAt: Date;
//   declare readonly deletedAt: Date | null;
// }

// Offer.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     title: {
//       type: DataTypes.STRING(150),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     discountType: {
//       type: DataTypes.ENUM('percentage', 'fixed'),
//       allowNull: false,
//       field: 'discount_type',
//     },
//     discountValue: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//       field: 'discount_value',
//       validate: {
//         min: 0,
//       },
//     },
//     startDate: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       field: 'start_date',
//     },
//     endDate: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       field: 'end_date',
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//       field: 'is_active',
//     },
//     applicableTo: {
//       type: DataTypes.ENUM('all', 'products', 'categories'),
//       allowNull: false,
//       defaultValue: 'all',
//       field: 'applicable_to',
//     },
//     productIds: {
//       type: DataTypes.ARRAY(DataTypes.UUID),
//       allowNull: true,
//       field: 'product_ids',
//     },
//     categoryIds: {
//       type: DataTypes.ARRAY(DataTypes.UUID),
//       allowNull: true,
//       field: 'category_ids',
//     },
//     image: {
//       type: DataTypes.STRING(500),
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'offers',
//     timestamps: true,
//     paranoid: true,
//     underscored: true,
//     indexes: [
//       { fields: ['is_active'] },
//       { fields: ['start_date'] },
//       { fields: ['end_date'] },
//     ],
//   }
// );


import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface OfferAttributes {
  id: string;
  title: string;
  description: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableTo: 'all' | 'products' | 'categories';
  productIds: string[] | null;
  categoryIds: string[] | null;
  image: string | null;
  offerKind: 'menu' | 'loyalty';
  minOrderCount: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface OfferCreationAttributes
  extends Optional<
    OfferAttributes,
    | 'id'
    | 'description'
    | 'isActive'
    | 'productIds'
    | 'categoryIds'
    | 'image'
    | 'offerKind'
    | 'minOrderCount'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

export class Offer
  extends Model<OfferAttributes, OfferCreationAttributes>
  implements OfferAttributes
{
  declare id: string;
  declare title: string;
  declare description: string | null;
  declare discountType: 'percentage' | 'fixed';
  declare discountValue: number;
  declare startDate: Date;
  declare endDate: Date;
  declare isActive: boolean;
  declare applicableTo: 'all' | 'products' | 'categories';
  declare productIds: string[] | null;
  declare categoryIds: string[] | null;
  declare image: string | null;
  declare offerKind: 'menu' | 'loyalty';
  declare minOrderCount: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Offer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
      field: 'discount_type',
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'discount_value',
      validate: { min: 0 },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    applicableTo: {
      type: DataTypes.ENUM('all', 'products', 'categories'),
      allowNull: false,
      defaultValue: 'all',
      field: 'applicable_to',
    },
    productIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      field: 'product_ids',
    },
    categoryIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      field: 'category_ids',
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    offerKind: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'menu',
      field: 'offer_kind',
    },
    minOrderCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'min_order_count',
    },
  },
  {
    sequelize,
    tableName: 'offers',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { fields: ['is_active'] },
      { fields: ['start_date'] },
      { fields: ['end_date'] },
      { fields: ['offer_kind'] },
    ],
  }
);