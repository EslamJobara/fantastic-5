import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AddToCartRequest,
  Cart as ApiCart,
  CartItem as ApiCartItem,
  CartResponse,
  RemoveFromCartRequest
} from '../models/cart.model';
import { Cart, CartItem } from '../../features/cart/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  private readonly emptyCart: Cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  };

  private cartSubject = new BehaviorSubject<Cart>(this.emptyCart);
  
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private buildCartTotals(items: CartItem[], totalPrice?: number): Cart {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0;
    const shipping = 0;
    const total = totalPrice ?? subtotal;

    return {
      items,
      subtotal,
      tax,
      shipping,
      total
    };
  }

  private transformApiCartItem(item: ApiCartItem): CartItem {
    const selectedVariation = item.product.variations?.find(
      variation => variation._id === item.variationId
    );
    const fallbackImage = 'https://via.placeholder.com/400x400?text=No+Image';

    return {
      id: item._id || `${item.product._id}-${item.variationId ?? 'default'}`,
      productId: item.product._id,
      name: item.product.name,
      description: selectedVariation?.colorName || item.product.description || 'Default variation',
      price: item.product.price,
      quantity: item.quantity,
      image: selectedVariation?.defaultImage || item.product.defaultImg || fallbackImage,
      variationId: item.variationId
    };
  }

  private transformApiCart(apiCart: ApiCart): Cart {
    const items = apiCart.items.map(item => this.transformApiCartItem(item));
    return this.buildCartTotals(items, apiCart.totalPrice);
  }

  /**
   * تحميل السلة من الباك إند
   */
  loadCart(): void {
    this.getMyCart().subscribe({
      error: (error) => console.error('Failed to load cart', error)
    });
  }

  /**
   * إضافة منتج للسلة
   */
  addToCart(productId: string, quantity: number = 1, variationId?: string): Observable<Cart> {
    const payload: AddToCartRequest = { productId, quantity, variationId };
    return this.http.post<CartResponse>(`${this.apiUrl}/addToCart`, payload)
      .pipe(
        map(response => this.transformApiCart(response.data)),
        tap(cart => this.cartSubject.next(cart))
      );
  }

  /**
   * تحديث كمية منتج في السلة
   */
  updateQuantity(item: CartItem, quantity: number): Observable<Cart> {
    const difference = quantity - item.quantity;

    if (difference === 0) {
      return of(this.cartSubject.value);
    }

    if (difference > 0) {
      return this.addToCart(item.productId, difference, item.variationId);
    }

    const removeRequests = Array.from({ length: Math.abs(difference) }, () =>
      this.removeFromCart(item.productId, item.variationId, false)
    );
    return forkJoin(removeRequests).pipe(
      map(results => results[results.length - 1])
    );
  }

  /**
   * حذف منتج من السلة
   */
  removeItem(item: CartItem): Observable<Cart> {
    return this.removeFromCart(item.productId, item.variationId, true);
  }

  removeFromCart(productId: string, variationId?: string, removeAll: boolean = false): Observable<Cart> {
    const payload: RemoveFromCartRequest = { productId, variationId, removeAll };

    return this.http.patch<CartResponse>(`${this.apiUrl}/remove`, payload)
      .pipe(
        map(response => this.transformApiCart(response.data)),
        tap(cart => this.cartSubject.next(cart))
      );
  }

  /**
   * جلب سلة المستخدم الحالي
   */
  getMyCart(): Observable<Cart> {
    return this.http.get<CartResponse>(`${this.apiUrl}/getMyCart`)
      .pipe(
        map(response => this.transformApiCart(response.data)),
        tap(cart => this.cartSubject.next(cart)),
        catchError(error => {
          if (error.status === 404) {
            this.cartSubject.next(this.emptyCart);
            return of(this.emptyCart);
          }
          throw error;
        })
      );
  }

  /**
   * مسح السلة بالكامل
   */
  clearCart(): Observable<void> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/clearCart`)
      .pipe(
        switchMap(() => this.getMyCart()),
        map(() => void 0)
      );
  }

  /**
   * الحصول على عدد المنتجات في السلة
   */
  getItemCount(): number {
    return this.cartSubject.value.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * الحصول على السلة الحالية
   */
  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }
}
