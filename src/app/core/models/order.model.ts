export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    defaultImg: string;
  };
  quantity: number;
  variationId?: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = Order['status'];
export type PaymentStatus = Order['paymentStatus'];

export interface OrdersResponse {
  message: string;
  data: Order[];
}

export interface OrderResponse {
  message: string;
  data: Order;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    variationId?: string;
  }[];
  paymentMethod?: string;
}
