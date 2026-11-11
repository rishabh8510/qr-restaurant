import { Order } from '../models';
import { OrderStatus, OrderSource, OrderItemSnapshot } from '../models/Order';
export interface CreateOrderInput {
    tableNumber?: string | null;
    customerName?: string | null;
    customerPhone?: string | null;
    customerEmail?: string | null;
    orderType: 'delivery' | 'dining' | 'pickup';
    paymentMethod: 'cash' | 'card' | 'upi' | 'online';
    notes?: string | null;
    items: OrderItemSnapshot[];
    userId?: string | null;
    orderSource?: OrderSource;
    createdByStaffId?: string | null;
}
export declare class OrderService {
    isFirstOrderForUser(userId: string | null | undefined): Promise<boolean>;
    computePricing(input: {
        items: OrderItemSnapshot[];
        userId?: string | null;
        orderType?: 'delivery' | 'dining' | 'pickup';
    }): Promise<{
        subtotal: number;
        discount: number;
        tax: number;
        taxPercent: number;
        cgst: number;
        sgst: number;
        cgstPercent: number;
        sgstPercent: number;
        deliveryCharge: number;
        packingCharge: number;
        total: number;
        isFirstOrder: boolean;
        discountLabel: string | null;
        firstOrderDiscountPercent: number;
        firstOrderDiscountEnabled: boolean;
        loyaltyDiscount: number;
        loyaltyLabel: string | null;
    }>;
    create(input: CreateOrderInput): Promise<Order>;
    acceptOrder(orderId: string, staffId: string): Promise<Order | null>;
    updateStatus(orderId: string, status: OrderStatus, actorId: string, actorRole: string): Promise<Order>;
    listForStaff(filters: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Order[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    /**
     * List all orders belonging to a customer.
     *
     * Matches by:
     *  - `userId` (primary link)
     *  - `customerPhone` (fallback for legacy orders created before login was required)
     *
     * Phone matching is done on normalized last-10 digits so that stored variants
     * like "+91 98765 43210", "9876543210", "09876543210" all resolve to the same order.
     */
    listForCustomer(userId: string): Promise<import("../models/Order").OrderAttributes[]>;
    getById(id: string, userId?: string, role?: string): Promise<Order>;
}
export declare const orderService: OrderService;
//# sourceMappingURL=OrderService.d.ts.map