import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, delay, map, switchMap, catchError } from 'rxjs';
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
  private useMockData = false;
  
  private cartSubject: BehaviorSubject<Cart>;
  public cart$: Observable<Cart>;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {
    const savedCart = this.loadFromLocalStorage();
    this.cartSubject = new BehaviorSubject<Cart>(savedCart || this.getInitialMockCart());
    this.cart$ = this.cartSubject.asObservable();
    this.loadCart();
  }

  private saveToLocalStorage(cart: Cart): void {
    localStorage.setItem('fantastic_cart', JSON.stringify(cart));
  }

  private loadFromLocalStorage(): Cart | null {
    const saved = localStorage.getItem('fantastic_cart');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private getInitialMockCart(): Cart {
    const items: CartItem[] = []; 
    return this.calculateCart(items);
  }

  private calculateCart(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = (subtotal > 1000 || subtotal === 0) ? 0 : 50; 
    const total = subtotal + tax + shipping;

    const cart = {
      items,
      subtotal,
      tax,
      shipping,
      total
    };
    
    // Save to local storage whenever calculated
    this.saveToLocalStorage(cart);
    return cart;
  }

  loadCart(): void {
    if (this.useMockData) {
      console.log('📦 Using Mock Cart Data');
      return;
    }

    this.http.get<Cart>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.warn('⚠️ Cart API failed, showing local/mock cart:', error);
        return of(this.loadFromLocalStorage() || this.getInitialMockCart());
      })
    ).subscribe({
      next: (cart) => {
        this.cartSubject.next(cart);
        this.saveToLocalStorage(cart);
      },
      error: (error) => console.error('Failed to load cart properly', error)
    });
  }

  addToCart(productId: string, quantity: number = 1): Observable<Cart> {
    if (this.useMockData) {
      // ... existing mock logic ...
      return this.productService.getProductById(productId).pipe(
        map(response => {
          if (!response || !response.data) throw new Error('Product not found');
          const product = (Array.isArray(response.data) ? response.data[0] : response.data) as any;
          const currentCart = this.cartSubject.value;
          const existingItemIndex = currentCart.items.findIndex(item => item.productId === productId);
          let updatedItems = [...currentCart.items];
          
          if (existingItemIndex > -1) {
            updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], quantity: updatedItems[existingItemIndex].quantity + quantity };
          } else {
            const newItem: CartItem = {
              id: Math.random().toString(36).substr(2, 9),
              productId: product._id,
              name: product.name,
              description: product.description?.substring(0, 50) + '...',
              price: product.price,
              quantity: quantity,
              image: product.image
            };
            updatedItems.push(newItem);
          }
          const updatedCart = this.calculateCart(updatedItems);
          this.cartSubject.next(updatedCart);
          return updatedCart;
        })
      );
    }

    // محاولة الإضافة على /cart مباشرة بدلاً من /cart/add
    return this.http.post<Cart>(`${this.apiUrl}`, { productId, quantity })
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
          this.saveToLocalStorage(cart);
        }),
        catchError(error => {
          console.error('❌ API Error adding to cart, falling back to Mock Logic:', error);
          // الفالباك للمتحكم المحلي
          return this.productService.getProductById(productId).pipe(
            map(response => {
              if (!response || !response.data) throw new Error('Product not found');
              const product = (Array.isArray(response.data) ? response.data[0] : response.data) as any;
              const currentCart = this.cartSubject.value;
              const existingItemIndex = currentCart.items.findIndex(item => item.productId === productId);
              let updatedItems = [...currentCart.items];
              
              if (existingItemIndex > -1) {
                updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], quantity: updatedItems[existingItemIndex].quantity + quantity };
              } else {
                const newItem: CartItem = {
                  id: Math.random().toString(36).substr(2, 9),
                  productId: product._id,
                  name: product.name,
                  description: product.description?.substring(0, 50) + '...',
                  price: product.price,
                  quantity: quantity,
                  image: product.image
                };
                updatedItems.push(newItem);
              }
              const updatedCart = this.calculateCart(updatedItems);
              this.cartSubject.next(updatedCart);
              return updatedCart;
            })
          );
        })
      );
  }

  updateQuantity(itemId: string, quantity: number): Observable<Cart> {
    if (this.useMockData) {
      const currentCart = this.cartSubject.value;
      const updatedItems = currentCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      const updatedCart = this.calculateCart(updatedItems);
      this.cartSubject.next(updatedCart);
      return of(updatedCart);
    }

    return this.http.put<Cart>(`${this.apiUrl}/${itemId}`, { quantity })
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
          this.saveToLocalStorage(cart);
        })
      );
  }

  removeItem(itemId: string): Observable<Cart> {
    if (this.useMockData) {
      const currentCart = this.cartSubject.value;
      const updatedItems = currentCart.items.filter(item => item.id !== itemId);
      const updatedCart = this.calculateCart(updatedItems);
      this.cartSubject.next(updatedCart);
      return of(updatedCart);
    }

    return this.http.delete<Cart>(`${this.apiUrl}/${itemId}`)
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
          this.saveToLocalStorage(cart);
        })
      );
  }

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
        this.cartSubject.next(updatedCart);
        return of(updatedCart);
      } else {
        return of(currentCart).pipe(
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

  clearCart(): Observable<void> {
    const emptyCart: Cart = {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    };
    this.cartSubject.next(emptyCart);
    
    if (this.useMockData) {
      return of(void 0);
    }

    return this.http.delete<void>(`${this.apiUrl}/clear`);
  }

  getItemCount(): number {
    return this.cartSubject.value.items.reduce((count, item) => count + item.quantity, 0);
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }
}
