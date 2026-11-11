"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductLike = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ProductLike extends sequelize_1.Model {
}
exports.ProductLike = ProductLike;
ProductLike.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    productId: { type: sequelize_1.DataTypes.UUID, allowNull: false, field: 'product_id' },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: true, field: 'user_id' },
    guestKey: { type: sequelize_1.DataTypes.STRING(64), allowNull: true, field: 'guest_key' },
}, { sequelize: database_1.sequelize, tableName: 'product_likes', timestamps: true, underscored: true });
//# sourceMappingURL=ProductLike.js.map