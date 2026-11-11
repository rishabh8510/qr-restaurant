import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ProductLikeAttributes {
  id: string;
  productId: string;
  userId: string | null;
  guestKey: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type Creation = Optional<ProductLikeAttributes, 'id' | 'userId' | 'guestKey' | 'createdAt' | 'updatedAt'>;

export class ProductLike extends Model<ProductLikeAttributes, Creation> implements ProductLikeAttributes {
  declare id: string;
  declare productId: string;
  declare userId: string | null;
  declare guestKey: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductLike.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
    userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
    guestKey: { type: DataTypes.STRING(64), allowNull: true, field: 'guest_key' },
  },
  { sequelize, tableName: 'product_likes', timestamps: true, underscored: true }
);