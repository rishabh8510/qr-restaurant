"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductLike = exports.Otp = exports.DishOfTheDay = exports.Banner = exports.Order = exports.Offer = exports.Product = exports.SubCategory = exports.Category = exports.Restaurant = exports.RefreshToken = exports.User = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const RefreshToken_1 = require("./RefreshToken");
Object.defineProperty(exports, "RefreshToken", { enumerable: true, get: function () { return RefreshToken_1.RefreshToken; } });
const Restaurant_1 = require("./Restaurant");
Object.defineProperty(exports, "Restaurant", { enumerable: true, get: function () { return Restaurant_1.Restaurant; } });
const Category_1 = require("./Category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return Category_1.Category; } });
const SubCategory_1 = require("./SubCategory");
Object.defineProperty(exports, "SubCategory", { enumerable: true, get: function () { return SubCategory_1.SubCategory; } });
const Product_1 = require("./Product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return Product_1.Product; } });
const Offer_1 = require("./Offer");
Object.defineProperty(exports, "Offer", { enumerable: true, get: function () { return Offer_1.Offer; } });
const Order_1 = require("./Order");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return Order_1.Order; } });
const Banner_1 = require("./Banner");
Object.defineProperty(exports, "Banner", { enumerable: true, get: function () { return Banner_1.Banner; } });
const DishOfTheDay_1 = require("./DishOfTheDay");
Object.defineProperty(exports, "DishOfTheDay", { enumerable: true, get: function () { return DishOfTheDay_1.DishOfTheDay; } });
const ProductLike_1 = require("./ProductLike");
Object.defineProperty(exports, "ProductLike", { enumerable: true, get: function () { return ProductLike_1.ProductLike; } });
const Otp_1 = require("./Otp");
Object.defineProperty(exports, "Otp", { enumerable: true, get: function () { return Otp_1.Otp; } });
User_1.User.hasMany(RefreshToken_1.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken_1.RefreshToken.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
Category_1.Category.hasMany(SubCategory_1.SubCategory, { foreignKey: 'categoryId', as: 'subCategories' });
SubCategory_1.SubCategory.belongsTo(Category_1.Category, { foreignKey: 'categoryId', as: 'category' });
SubCategory_1.SubCategory.hasMany(Product_1.Product, { foreignKey: 'subCategoryId', as: 'products' });
Product_1.Product.belongsTo(SubCategory_1.SubCategory, { foreignKey: 'subCategoryId', as: 'subCategory' });
Category_1.Category.hasMany(Product_1.Product, { foreignKey: 'categoryId', as: 'products' });
Product_1.Product.belongsTo(Category_1.Category, { foreignKey: 'categoryId', as: 'category' });
User_1.User.hasMany(Order_1.Order, { foreignKey: 'userId', as: 'orders' });
Order_1.Order.belongsTo(User_1.User, { foreignKey: 'userId', as: 'customer' });
Order_1.Order.belongsTo(User_1.User, { foreignKey: 'assignedStaffId', as: 'assignedStaff' });
exports.default = {
    sequelize: database_1.sequelize,
    User: User_1.User,
    RefreshToken: RefreshToken_1.RefreshToken,
    Restaurant: Restaurant_1.Restaurant,
    Category: Category_1.Category,
    SubCategory: SubCategory_1.SubCategory,
    Product: Product_1.Product,
    Offer: Offer_1.Offer,
    Order: Order_1.Order,
    Banner: Banner_1.Banner,
    DishOfTheDay: DishOfTheDay_1.DishOfTheDay,
    Otp: Otp_1.Otp,
    ProductLike: ProductLike_1.ProductLike
};
//# sourceMappingURL=index.js.map