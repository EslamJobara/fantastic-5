/**
 * Order Models - Local UI Models
 */

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  variant: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

export type OrderStatus = Order['status'];
