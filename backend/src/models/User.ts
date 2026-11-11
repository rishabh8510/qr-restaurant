import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Role } from '../types';

interface UserAttributes {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  password: string | null;
  role: Role;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'email' | 'phone' | 'password' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string | null;
  declare phone: string | null;
  declare password: string | null;
  declare role: Role;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

User.init(
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff', 'customer'),
      allowNull: false,
      defaultValue: 'staff',
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
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { fields: ['email'], unique: true },
      { fields: ['phone'] },
      { fields: ['role'] },
      { fields: ['is_active'] },
    ],
  }
);
