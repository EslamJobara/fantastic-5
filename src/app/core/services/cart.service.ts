import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  /**
   * Mock Data - بيانات تجريبية
   */
  private getInitialMockCart(): Cart {
    const items: CartItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Spectre Pro M1 Max',
        description: '32GB RAM / 1TB SSD / Space Grey',
        price: 1899.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkrEDDnCQK-96zYo5sji8hrg5rojSiSvPKyTngIv6sCJYqgkiYS0iHtrUyVKizGZWECscVxbdy-eNu5LwXVdvdoFzp5zbHkYM-nMHJWlRF2e3txHlvFITv98n2IJAiIDZbGKOODVVZ6PxiLd5iOoCZIQgETTFOCrDNOZOwHbmpP0v9nuoxNN2A5D6qgOIHGIz78dpYWD8LZ87T2bwRbni77COBjIk-WINwb51rb_RY0ywaPreHznxAoahtvYC6PnBkIfhVVC1Km9qn'
      },
      {
        id: '2',
        productId: 'prod-2',
        name: 'Acoustic Precision X2',
        description: 'Active Noise Cancelling / Bluetooth 5.2',
        price: 450.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-cnuzihNTytV8qi60AwQcewIG-bznRoGc-8yvMACFPA5S6tWfppvF6j7Y0BSeChRP8Jtl2F5TE1JhzRs7ID6fDUTMujL9OY1MnTH4typfH7DChfNp8G7d3NBNirkz2_hzYGSr2Us9tnCfXqvNYiR6l8NHa5YDQHhqsawPHCbHyp9CXU1rd_6WKh5MPB3rh7JzzCqo8fe_Rftpsw5Cw1p97O1l7hK7IOTj9Co4R1FJFycu9tAh4RVOQk2CV9ZFb_lW1VrM0ei1hORD'
      },
      {
        id: '3',
        productId: 'prod-3',
        name: 'Nexus Phone 15 Pro',
        description: '256GB / Ceramic White',
        price: 1101.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGH-xM0vgecRbPAxN7pqq7l1zYYyrDEXrFIBJkgaYvuzD0AOPk4rAzOG99eWAmwXiq1VG_MhAMTLI7QKAEo_h__LxozVKYN3nOOy3tKarXkRNvm6bC1iGEIneYtxIHY0y650J-5CZlfY73CkTAR5Il8gn4u6KSWVHCSqHo1_NWvuQB-i1uTLOhk3WZfDZVQASg1vte7C3sJNS-SrRW97PYsujjYjEK-_Ei_NE3JOmtQGERk-f51w8DKWKmO7cHDGmIoOzUbQdvQEKu'
      }
    ];

    return this.calculateCart(items);
  }

  /**
   * حساب المجاميع
   */
  private calculateCart(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
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
      // Mock: استخدام البيانات التجريبية
      console.log('📦 Using Mock Cart Data');
      return;
    }

    // Real API Call
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
      // Mock: إضافة منتج للبيانات التجريبية
      return of(this.cartSubject.value).pipe(
        delay(500), // محاكاة تأخير الشبكة
        tap(() => console.log('📦 Mock: Added to cart'))
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
      // Mock: تحديث الكمية في البيانات التجريبية
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

    // Real API Call
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
      // Mock: حذف المنتج من البيانات التجريبية
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

    // Real API Call
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
      // Mock: محاكاة تطبيق كود خصم
      const currentCart = this.cartSubject.value;
      
      // أكواد تجريبية
      const validCodes: { [key: string]: number } = {
        'SAVE10': 0.1,  // 10% discount
        'SAVE20': 0.2,  // 20% discount
        'FREE50': 50    // $50 off
      };

      if (validCodes[code.toUpperCase()]) {
        const discount = validCodes[code.toUpperCase()];
        const discountAmount = discount < 1 ? currentCart.subtotal * discount : discount;
        const updatedCart = {
          ...currentCart,
          total: currentCart.total - discountAmount
        };

        return of(updatedCart).pipe(
          delay(500),
          tap(cart => {
            this.cartSubject.next(cart);
            console.log('📦 Mock: Applied promo code');
          })
        );
      } else {
        // كود خاطئ
        return of(currentCart).pipe(
          delay(500),
          tap(() => {
            throw new Error('Invalid promo code');
          })
        );
      }
    }

    // Real API Call
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
      // Mock: مسح البيانات التجريبية
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

    // Real API Call
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
