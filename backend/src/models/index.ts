import { sequelize } from '../config/database';
import { User } from './User';
import { RefreshToken } from './RefreshToken';
import { Restaurant } from './Restaurant';
import { Category } from './Category';
import { SubCategory } from './SubCategory';
import { Product } from './Product';
import { Offer } from './Offer';
import { Order } from './Order';
import { Banner } from './Banner';
import { DishOfTheDay } from './DishOfTheDay';
import { ProductLike } from './ProductLike';
import { Otp } from './Otp';

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(SubCategory, { foreignKey: 'categoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

SubCategory.hasMany(Product, { foreignKey: 'subCategoryId', as: 'products' });
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: 'subCategory' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });
Order.belongsTo(User, { foreignKey: 'assignedStaffId', as: 'assignedStaff' });

export {
  sequelize,
  User,
  RefreshToken,
  Restaurant,
  Category,
  SubCategory,
  Product,
  Offer,
  Order,
  Banner,
  DishOfTheDay,
  Otp,
  ProductLike
};

export default {
  sequelize,
  User,
  RefreshToken,
  Restaurant,
  Category,
  SubCategory,
  Product,
  Offer,
  Order,
  Banner,
  DishOfTheDay,
  Otp,
  ProductLike
};
