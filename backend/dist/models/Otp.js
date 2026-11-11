"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Otp extends sequelize_1.Model {
}
exports.Otp = Otp;
Otp.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    code: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'otps',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['phone'] }, { fields: ['phone', 'code'] }],
});
//# sourceMappingURL=Otp.js.map