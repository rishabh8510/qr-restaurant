// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// interface RestaurantAttributes {
//   id: string;
//   name: string;
//   description: string | null;
//   logo: string | null;
//   coverImage: string | null;
//   address: string | null;
//   phone: string | null;
//   email: string | null;
//   openingHours: object | null;
//   socialLinks: object | null;
//   settings: object | null;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// interface RestaurantCreationAttributes
//   extends Optional<
//     RestaurantAttributes,
//     | 'id'
//     | 'description'
//     | 'logo'
//     | 'coverImage'
//     | 'address'
//     | 'phone'
//     | 'email'
//     | 'openingHours'
//     | 'socialLinks'
//     | 'settings'
//     | 'createdAt'
//     | 'updatedAt'
//   > {}

// export class Restaurant
//   extends Model<RestaurantAttributes, RestaurantCreationAttributes>
//   implements RestaurantAttributes
// {
//   public id!: string;
//   public name!: string;
//   public description!: string | null;
//   public logo!: string | null;
//   public coverImage!: string | null;
//   public address!: string | null;
//   public phone!: string | null;
//   public email!: string | null;
//   public openingHours!: object | null;
//   public socialLinks!: object | null;
//   public settings!: object | null;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Restaurant.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(150),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     logo: {
//       type: DataTypes.STRING(500),
//       allowNull: true,
//     },
//     coverImage: {
//       type: DataTypes.STRING(500),
//       allowNull: true,
//       field: 'cover_image',
//     },
//     address: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     phone: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },
//     email: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     openingHours: {
//       type: DataTypes.JSONB,
//       allowNull: true,
//       field: 'opening_hours',
//     },
//     socialLinks: {
//       type: DataTypes.JSONB,
//       allowNull: true,
//       field: 'social_links',
//     },
//     settings: {
//       type: DataTypes.JSONB,
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'restaurants',
//     timestamps: true,
//     underscored: true,
//   }
// );





import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RestaurantAttributes {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  openingHours: object | null;
  socialLinks: object | null;
  settings: object | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RestaurantCreationAttributes
  extends Optional<
    RestaurantAttributes,
    | 'id'
    | 'description'
    | 'logo'
    | 'coverImage'
    | 'address'
    | 'phone'
    | 'email'
    | 'openingHours'
    | 'socialLinks'
    | 'settings'
    | 'createdAt'
    | 'updatedAt'
  > {}

export class Restaurant
  extends Model<RestaurantAttributes, RestaurantCreationAttributes>
  implements RestaurantAttributes
{
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare logo: string | null;
  declare coverImage: string | null;
  declare address: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare openingHours: object | null;
  declare socialLinks: object | null;
  declare settings: object | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Restaurant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'cover_image',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    openingHours: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'opening_hours',
    },
    socialLinks: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'social_links',
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'restaurants',
    timestamps: true,
    underscored: true,
  }
);