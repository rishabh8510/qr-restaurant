import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface OtpAttributes {
  id: string;
  phone: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OtpCreationAttributes
  extends Optional<OtpAttributes, 'id' | 'verified' | 'createdAt' | 'updatedAt'> {}

export class Otp extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
  declare id: string;
  declare phone: string;
  declare code: string;
  declare expiresAt: Date;
  declare verified: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'otps',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['phone'] }, { fields: ['phone', 'code'] }],
  }
);
