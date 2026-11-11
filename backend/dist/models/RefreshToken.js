"use strict";
// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
// interface RefreshTokenAttributes {
//   id: string;
//   userId: string;
//   token: string;
//   expiresAt: Date;
//   isRevoked: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
// interface RefreshTokenCreationAttributes
//   extends Optional<RefreshTokenAttributes, 'id' | 'isRevoked' | 'createdAt' | 'updatedAt'> {}
// export class RefreshToken
//   extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
//   implements RefreshTokenAttributes
// {
//   public id!: string;
//   public userId!: string;
//   public token!: string;
//   public expiresAt!: Date;
//   public isRevoked!: boolean;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }
// RefreshToken.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     userId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       field: 'user_id',
//     },
//     token: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     expiresAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       field: 'expires_at',
//     },
//     isRevoked: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//       field: 'is_revoked',
//     },
//   },
//   {
//     sequelize,
//     tableName: 'refresh_tokens',
//     timestamps: true,
//     underscored: true,
//     indexes: [
//       { fields: ['user_id'] },
//       { fields: ['token'] },
//       { fields: ['expires_at'] },
//     ],
//   }
// );
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class RefreshToken extends sequelize_1.Model {
}
exports.RefreshToken = RefreshToken;
RefreshToken.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
    },
    isRevoked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_revoked',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['token'] },
        { fields: ['expires_at'] },
    ],
});
//# sourceMappingURL=RefreshToken.js.map