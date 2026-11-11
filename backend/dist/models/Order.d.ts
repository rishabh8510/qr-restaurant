import { Model, Optional } from 'sequelize';
export type OrderType = 'delivery' | 'dining' | 'pickup';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderSource = 'website' | 'staff' | 'admin';
export interface OrderItemSnapshot {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
}
export interface OrderAttributes {
    id: string;
    orderNumber: string;
    tableNumber?: string | null;
    userId: string | null;
    assignedStaffId: string | null;
    orderSource: OrderSource;
    customerName: string | null;
    customerPhone: string | null;
    customerEmail: string | null;
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    items: OrderItemSnapshot[];
    subtotal: number;
    tax: number;
    discount: number;
    pricingMeta: object | null;
    total: number;
    notes: string | null;
    acceptedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'tableNumber' | 'userId' | 'assignedStaffId' | 'orderSource' | 'customerName' | 'customerPhone' | 'customerEmail' | 'paymentStatus' | 'status' | 'tax' | 'discount' | 'pricingMeta' | 'notes' | 'acceptedAt' | 'createdAt' | 'updatedAt'> {
}
export declare class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    id: string;
    orderNumber: string;
    tableNumber: string | null;
    userId: string | null;
    assignedStaffId: string | null;
    orderSource: OrderSource;
    customerName: string | null;
    customerPhone: string | null;
    customerEmail: string | null;
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    items: OrderItemSnapshot[];
    subtotal: number;
    tax: number;
    discount: number;
    pricingMeta: object | null;
    total: number;
    notes: string | null;
    acceptedAt: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=Order.d.ts.map