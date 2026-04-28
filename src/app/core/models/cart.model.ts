export interface CartItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    defaultImg?: string;
    variations?: CartProductVariation[];
  };
  quantity: number;
  variationId?: string;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variationId?: string;
}

export interface RemoveFromCartRequest {
  productId: string;
  variationId?: string;
  removeAll?: boolean;
}

export interface CartProductVariation {
  _id: string;
  colorName?: string;
  colorValue?: string;
  defaultImage?: string;
  variationImgs?: string[];
  stock?: number;
}

export interface CartResponse {
  message: string;
  data: Cart;
}
