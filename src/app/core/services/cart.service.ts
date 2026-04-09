import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, of, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart as UICart, CartItem as UICartItem } from '../../features/cart/models/cart.model';
import { Cart, CartResponse, AddToCartRequest } from '../models/cart.model';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  private cartSubject = new BehaviorSubject<UICart>(this.getEmptyCart());
  
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {
    this.loadCart();
  }

  /**
   * سلة فارغة
   */
  private getEmptyCart(): UICart {
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    };
  }

  /**
   * تحويل Cart من API إلى UI Cart مع جلب تفاصيل المنتجات
   */
  private transformToUICartWithProducts(apiCart: Cart): Observable<UICart> {
    if (!apiCart.items || apiCart.items.length === 0) {
      return of(this.getEmptyCart());
    }

    // Filter out items with null products first
    const validItems = apiCart.items.filter(item => item.product && (item.product._id || item.product));

    if (validItems.length === 0) {
      return of(this.getEmptyCart());
    }

    // جلب تفاصيل كل المنتجات
    const productRequests = validItems.map(item => {
      const productId = item.product._id || (item.product as any);
      
      if (!productId) {
        return of({
          cartItem: item,
          product: null
        });
      }

      return this.productService.getProductById(productId).pipe(
        map(response => ({
          cartItem: item,
          product: Array.isArray(response.data) ? response.data[0] : response.data
        })),
        catchError(error => {
          console.error(`Failed to load product ${productId}`, error);
          return of({
            cartItem: item,
            product: null
          });
        })
      );
    });

    return forkJoin(productRequests).pipe(
      map(results => {
        const items: UICartItem[] = results
          .filter(result => result.product !== null)
          .map(result => {
            const { cartItem, product } = result;
            
            // Default values
            let image = 'https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image';
            let description = product!.description || '';
            let variationName = '';
            
            // إيجاد الـ variation المحدد
            if (cartItem.variationId && product!.variations && product!.variations.length > 0) {
              const selectedVariation = product!.variations.find(v => v._id === cartItem.variationId);
              
              if (selectedVariation) {
                // Variation found - use its data
                image = selectedVariation.defaultImage || image;
                variationName = selectedVariation.colorName || '';
              } else {
                // Variation not found (deleted) - use default variation
                console.warn(`Variation ${cartItem.variationId} not found for product ${product!._id}, using default`);
                const defaultVariation = product!.variations.find(v => v.isDefault) || product!.variations[0];
                if (defaultVariation) {
                  image = defaultVariation.defaultImage || image;
                  variationName = `${defaultVariation.colorName} (Default)`;
                }
              }
            } else if (product!.variations && product!.variations.length > 0) {
              // No variation selected - use default
              const defaultVariation = product!.variations.find(v => v.isDefault) || product!.variations[0];
              if (defaultVariation) {
                image = defaultVariation.defaultImage || image;
              }
            }
            
            // Build description with variation name
            if (variationName) {
              description = `${description} - ${variationName}`;
            }

            return {
              id: cartItem.product._id || (cartItem.product as any),
              productId: cartItem.product._id || (cartItem.product as any),
              name: product!.name,
              description: description,
              price: product!.price,
              quantity: cartItem.quantity,
              image: image,
              variationId: cartItem.variationId
            };
          });

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = 0; // No tax
        const shipping = subtotal > 1000 ? 0 : 50; // شحن مجاني فوق 1000
        const total = subtotal + shipping;

        return {
          items,
          subtotal,
          tax,
          shipping,
          total
        };
      })
    );
  }

  /**
   * تحميل السلة من الباك إند
   */
  loadCart(): void {
    this.http.get<CartResponse>(`${this.apiUrl}/getMyCart`).pipe(
      catchError(error => {
        console.log('Cart is empty or not found');
        return of({ message: 'Cart is empty', data: { items: [], totalPrice: 0 } } as CartResponse);
      })
    ).subscribe({
      next: (response) => {
        if (response.data && response.data.items && response.data.items.length > 0) {
          this.transformToUICartWithProducts(response.data).subscribe({
            next: (cart) => this.cartSubject.next(cart),
            error: (error) => {
              console.error('Failed to transform cart', error);
              this.cartSubject.next(this.getEmptyCart());
            }
          });
        } else {
          this.cartSubject.next(this.getEmptyCart());
        }
      },
      error: (error) => {
        console.error('Failed to load cart', error);
        this.cartSubject.next(this.getEmptyCart());
      }
    });
  }

  /**
   * إضافة منتج للسلة
   */
  addToCart(productId: string, quantity: number = 1, variationId?: string): Observable<UICart> {
    const request: AddToCartRequest = {
      productId,
      quantity,
      variationId
    };

    return this.http.post<CartResponse>(`${this.apiUrl}/addToCart`, request).pipe(
      catchError(error => {
        console.error('Failed to add to cart', error);
        throw error;
      }),
      tap(() => {
        // بعد الإضافة، نعيد تحميل السلة بالكامل
        this.loadCart();
      }),
      map(() => this.cartSubject.value)
    );
  }

  /**
   * تحديث كمية منتج في السلة
   */
  updateQuantity(productId: string, quantity: number, variationId?: string): Observable<UICart> {
    if (quantity === 0) {
      return this.removeItem(productId, variationId);
    }

    const request: AddToCartRequest = {
      productId,
      quantity,
      variationId
    };

    return this.http.post<CartResponse>(`${this.apiUrl}/addToCart`, request).pipe(
      catchError(error => {
        console.error('Failed to update quantity', error);
        throw error;
      }),
      tap(() => {
        // بعد التحديث، نعيد تحميل السلة بالكامل
        this.loadCart();
      }),
      map(() => this.cartSubject.value)
    );
  }

  /**
   * تقليل كمية منتج في السلة بمقدار 1
   */
  decreaseCartQuantity(productId: string, variationId?: string): Observable<UICart> {
    const request: any = {
      productId,
      removeAll: false // نقلل واحد بس مش نحذف كله
    };

    if (variationId) {
      request.variationId = variationId;
    }

    return this.http.patch<CartResponse>(`${this.apiUrl}/remove`, request).pipe(
      catchError(error => {
        console.error('Failed to decrease quantity', error);
        throw error;
      }),
      tap(() => {
        // بعد التقليل، نعيد تحميل السلة بالكامل
        this.loadCart();
      }),
      map(() => this.cartSubject.value)
    );
  }

  /**
   * حذف منتج من السلة
   */
  removeItem(productId: string, variationId?: string): Observable<UICart> {
    const request: any = {
      productId,
      removeAll: true
    };

    if (variationId) {
      request.variationId = variationId;
    }

    return this.http.patch<CartResponse>(`${this.apiUrl}/remove`, request).pipe(
      catchError(error => {
        console.error('Failed to remove item', error);
        throw error;
      }),
      tap(() => {
        // بعد الحذف، نعيد تحميل السلة بالكامل
        this.loadCart();
      }),
      map(() => this.cartSubject.value)
    );
  }

  /**
   * تطبيق كود خصم (مش موجود في API حالياً)
   */
  applyPromoCode(code: string): Observable<UICart> {
    // TODO: لما يتضاف endpoint للـ promo code في الـ API
    console.log('Promo code feature not implemented in API yet');
    return of(this.cartSubject.value);
  }

  /**
   * مسح السلة بالكامل
   */
  clearCart(): Observable<void> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/clearCart`).pipe(
      tap(() => this.cartSubject.next(this.getEmptyCart())),
      map(() => void 0),
      catchError(error => {
        console.error('Failed to clear cart', error);
        throw error;
      })
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
  getCurrentCart(): UICart {
    return this.cartSubject.value;
  }
}
