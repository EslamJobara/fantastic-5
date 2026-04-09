export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    defaultImg: string;
  };
  quantity: number;
  variationId?: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variationId?: string;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
  variationId?: string;
}

// API Response Types
export interface CartResponse {
  message: string;
  data: Cart;
}
