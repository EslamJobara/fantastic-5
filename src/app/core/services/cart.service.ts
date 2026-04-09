import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, delay, map, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductService, Product } from './product.service';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  // 🔧 Mock Mode - غير دا لـ false لما الباك يبقى جاهز
  private useMockData = true;
  
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialMockCart());
  
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {
    this.loadCart();
  }

  /**
   * Mock Data - بيانات تجريبية أولية
   */
  private getInitialMockCart(): Cart {
    const items: CartItem[] = []; // نبدأ بسلة فاضية عشان نختبر الإضافة بجد
    return this.calculateCart(items);
  }

  /**
   * حساب المجاميع
   */
  private calculateCart(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 50; 
    const total = subtotal + tax + shipping;

    return {
      items,
      subtotal,
      tax,
      shipping,
      total
    };
  }

  /**
   * تحميل السلة من الباك إند أو Mock Data
   */
  loadCart(): void {
    if (this.useMockData) {
      console.log('📦 Using Mock Cart Data');
      return;
    }

    this.http.get<Cart>(`${this.apiUrl}`).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (error) => console.error('Failed to load cart', error)
    });
  }

  /**
   * إضافة منتج للسلة
   */
  addToCart(productId: string, quantity: number = 1): Observable<Cart> {
    if (this.useMockData) {
      // Mock: جلب المنتج وإضافته فعلياً
      return this.productService.getProductById(productId).pipe(
        delay(300),
        map(response => {
          const product = (Array.isArray(response.data) ? response.data[0] : response.data) as any;
          const currentCart = this.cartSubject.value;
          
          // هل المنتج موجود أصلاً؟
          const existingItemIndex = currentCart.items.findIndex(item => item.productId === productId);
          
          let updatedItems = [...currentCart.items];
          
          if (existingItemIndex > -1) {
            // تحديث الكمية
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity
            };
          } else {
            // إضافة منتج جديد
            const newItem: CartItem = {
              id: Math.random().toString(36).substr(2, 9),
              productId: product._id,
              name: product.name,
              description: product.description.substring(0, 50) + '...',
              price: product.price,
              quantity: quantity,
              image: product.image
            };
            updatedItems.push(newItem);
          }
          
          const updatedCart = this.calculateCart(updatedItems);
          this.cartSubject.next(updatedCart);
          console.log('📦 Mock: Successfully added real product to cart', updatedCart);
          return updatedCart;
        })
      );
    }

    // Real API Call
    return this.http.post<Cart>(`${this.apiUrl}/add`, { productId, quantity })
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  /**
   * تحديث كمية منتج في السلة
   */
  updateQuantity(itemId: string, quantity: number): Observable<Cart> {
    if (this.useMockData) {
      const currentCart = this.cartSubject.value;
      const updatedItems = currentCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      const updatedCart = this.calculateCart(updatedItems);
      
      return of(updatedCart).pipe(
        delay(300),
        tap(cart => {
          this.cartSubject.next(cart);
          console.log('📦 Mock: Updated quantity');
        })
      );
    }

    return this.http.put<Cart>(`${this.apiUrl}/items/${itemId}`, { quantity })
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  /**
   * حذف منتج من السلة
   */
  removeItem(itemId: string): Observable<Cart> {
    if (this.useMockData) {
      const currentCart = this.cartSubject.value;
      const updatedItems = currentCart.items.filter(item => item.id !== itemId);
      const updatedCart = this.calculateCart(updatedItems);
      
      return of(updatedCart).pipe(
        delay(300),
        tap(cart => {
          this.cartSubject.next(cart);
          console.log('📦 Mock: Removed item');
        })
      );
    }

    return this.http.delete<Cart>(`${this.apiUrl}/items/${itemId}`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  /**
   * تطبيق كود خصم
   */
  applyPromoCode(code: string): Observable<Cart> {
    if (this.useMockData) {
      const currentCart = this.cartSubject.value;
      const validCodes: { [key: string]: number } = {
        'SAVE10': 0.1,
        'SAVE20': 0.2,
        'FREE50': 50
      };

      if (validCodes[code.toUpperCase()]) {
        const discount = validCodes[code.toUpperCase()];
        const discountAmount = discount < 1 ? currentCart.subtotal * discount : discount;
        const updatedCart = {
          ...currentCart,
          total: Math.max(0, currentCart.total - discountAmount)
        };

        return of(updatedCart).pipe(
          delay(500),
          tap(cart => {
            this.cartSubject.next(cart);
            console.log('📦 Mock: Applied promo code');
          })
        );
      } else {
        return of(currentCart).pipe(
          delay(500),
          map(() => {
            throw { error: { message: 'Invalid promo code' } };
          })
        );
      }
    }

    return this.http.post<Cart>(`${this.apiUrl}/promo`, { code })
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  /**
   * مسح السلة بالكامل
   */
  clearCart(): Observable<void> {
    if (this.useMockData) {
      const emptyCart: Cart = {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
      };

      return of(void 0).pipe(
        delay(300),
        tap(() => {
          this.cartSubject.next(emptyCart);
          console.log('📦 Mock: Cleared cart');
        })
      );
    }

    return this.http.delete<void>(`${this.apiUrl}/clear`)
      .pipe(
        tap(() => this.cartSubject.next({
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        }))
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
