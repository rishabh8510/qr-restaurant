"use strict";
// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
// export type OrderType = 'delivery' | 'dining' | 'pickup';
// export type PaymentMethod = 'cash' | 'card' | 'upi' | 'online';
// export type PaymentStatus = 'pending' | 'paid' | 'failed';
// // Pending → Accepted (confirmed) → Preparing → Ready → Completed/Delivered, Cancelled
// export type OrderStatus =
//   | 'pending'
//   | 'confirmed'
//   | 'preparing'
//   | 'ready'
//   | 'completed'
//   | 'cancelled';
// export type OrderSource = 'website' | 'staff' | 'admin';
// export interface OrderItemSnapshot {
//   productId: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string | null;
// }
// interface OrderAttributes {
//   id: string;
//   orderNumber: string;
//   userId: string | null;
//   assignedStaffId: string | null;
//   orderSource: OrderSource;
//   customerName: string | null;
//   customerPhone: string | null;
//   customerEmail: string | null;
//   orderType: OrderType;
//   paymentMethod: PaymentMethod;
//   paymentStatus: PaymentStatus;
//   status: OrderStatus;
//   items: OrderItemSnapshot[];
//   subtotal: number;
//   tax: number;
//   discount: number;
//   pricingMeta: object | null;
//   total: number;
//   notes: string | null;
//   acceptedAt: Date | null;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
// interface OrderCreationAttributes
//   extends Optional<
//     OrderAttributes,
//     | 'id'
//     | 'userId'
//     | 'assignedStaffId'
//     | 'orderSource'
//     | 'customerName'
//     | 'customerPhone'
//     | 'customerEmail'
//     | 'paymentStatus'
//     | 'status'
//     | 'tax'
//     | 'discount'
//     | 'pricingMeta'
//     | 'notes'
//     | 'acceptedAt'
//     | 'createdAt'
//     | 'updatedAt'
//   > {}
// export class Order
//   extends Model<OrderAttributes, OrderCreationAttributes>
//   implements OrderAttributes
// {
//   declare id: string;
//   declare orderNumber: string;
//   declare userId: string | null;
//   declare assignedStaffId: string | null;
//   declare orderSource: OrderSource;
//   declare customerName: string | null;
//   declare customerPhone: string | null;
//   declare customerEmail: string | null;
//   declare orderType: OrderType;
//   declare paymentMethod: PaymentMethod;
//   declare paymentStatus: PaymentStatus;
//   declare status: OrderStatus;
//   declare items: OrderItemSnapshot[];
//   declare subtotal: number;
//   declare tax: number;
//   declare discount: number;
//   declare pricingMeta: object | null;
//   declare total: number;
//   declare notes: string | null;
//   declare acceptedAt: Date | null;
//   declare readonly createdAt: Date;
//   declare readonly updatedAt: Date;
// }
// Order.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     orderNumber: {
//       type: DataTypes.STRING(30),
//       allowNull: false,
//       unique: true,
//       field: 'order_number',
//     },
//     userId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       field: 'user_id',
//     },
//     assignedStaffId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       field: 'assigned_staff_id',
//     },
//     orderSource: {
//       type: DataTypes.ENUM('website', 'staff', 'admin'),
//       allowNull: false,
//       defaultValue: 'website',
//       field: 'order_source',
//     },
//     customerName: {
//       type: DataTypes.STRING(150),
//       allowNull: true,
//       field: 'customer_name',
//     },
//     customerPhone: {
//       type: DataTypes.STRING(30),
//       allowNull: true,
//       field: 'customer_phone',
//     },
//     customerEmail: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//       field: 'customer_email',
//     },
//     orderType: {
//       type: DataTypes.ENUM('delivery', 'dining', 'pickup'),
//       allowNull: false,
//       defaultValue: 'pickup',
//       field: 'order_type',
//     },
//     paymentMethod: {
//       type: DataTypes.ENUM('cash', 'card', 'upi', 'online'),
//       allowNull: false,
//       defaultValue: 'cash',
//       field: 'payment_method',
//     },
//     paymentStatus: {
//       type: DataTypes.ENUM('pending', 'paid', 'failed'),
//       allowNull: false,
//       defaultValue: 'pending',
//       field: 'payment_status',
//     },
//     status: {
//       type: DataTypes.ENUM(
//         'pending',
//         'confirmed',
//         'preparing',
//         'ready',
//         'completed',
//         'cancelled'
//       ),
//       allowNull: false,
//       defaultValue: 'pending',
//     },
//     items: {
//       type: DataTypes.JSONB,
//       allowNull: false,
//       defaultValue: [],
//     },
//     subtotal: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//       defaultValue: 0,
//     },
//     tax: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//       defaultValue: 0,
//     },
//     discount: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//       defaultValue: 0,
//     },
//     pricingMeta: {
//       type: DataTypes.JSONB,
//       allowNull: true,
//       field: 'pricing_meta',
//     },
//     total: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//       defaultValue: 0,
//     },
//     notes: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     acceptedAt: {
//       type: DataTypes.DATE,
//       allowNull: true,
//       field: 'accepted_at',
//     },
//   },
//   {
//     sequelize,
//     tableName: 'orders',
//     timestamps: true,
//     underscored: true,
//   }
// );
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderNumber: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        field: 'order_number',
    },
    tableNumber: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        field: 'table_number',
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
    },
    assignedStaffId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'assigned_staff_id',
    },
    orderSource: {
        type: sequelize_1.DataTypes.ENUM('website', 'staff', 'admin'),
        allowNull: false,
        defaultValue: 'website',
        field: 'order_source',
    },
    customerName: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true,
        field: 'customer_name',
    },
    customerPhone: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: true,
        field: 'customer_phone',
    },
    customerEmail: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'customer_email',
    },
    orderType: {
        type: sequelize_1.DataTypes.ENUM('delivery', 'dining', 'pickup'),
        allowNull: false,
        defaultValue: 'pickup',
        field: 'order_type',
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.ENUM('cash', 'card', 'upi', 'online'),
        allowNull: false,
        defaultValue: 'cash',
        field: 'payment_method',
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM('pending', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'payment_status',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    items: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    subtotal: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    tax: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    discount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    pricingMeta: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        field: 'pricing_meta',
    },
    total: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    acceptedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'accepted_at',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders',
    timestamps: true,
    underscored: true,
});
//# sourceMappingURL=Order.js.map