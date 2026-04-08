import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService, Cart, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPageComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  };
  
  promoCode = '';
  isLoadingPromo = false;
  promoError = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // الاشتراك في تحديثات السلة
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * زيادة كمية المنتج
   */
  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1).subscribe({
      error: (error) => console.error('Failed to update quantity', error)
    });
  }

  /**
   * تقليل كمية المنتج
   */
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1).subscribe({
        error: (error) => console.error('Failed to update quantity', error)
      });
    }
  }

  /**
   * حذف منتج من السلة
   */
  removeItem(item: CartItem): void {
    if (confirm(`Remove ${item.name} from cart?`)) {
      this.cartService.removeItem(item.id).subscribe({
        error: (error) => console.error('Failed to remove item', error)
      });
    }
  }

  /**
   * تطبيق كود الخصم
   */
  applyPromoCode(): void {
    if (!this.promoCode.trim()) {
      return;
    }

    this.isLoadingPromo = true;
    this.promoError = '';

    this.cartService.applyPromoCode(this.promoCode).subscribe({
      next: () => {
        this.promoCode = '';
        this.isLoadingPromo = false;
      },
      error: (error) => {
        this.promoError = error.error?.message || 'Invalid promo code';
        this.isLoadingPromo = false;
      }
    });
  }

  /**
   * الانتقال لصفحة الدفع
   */
  proceedToCheckout(): void {
    if (this.cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  /**
   * التحقق من وجود منتجات في السلة
   */
  get hasItems(): boolean {
    return this.cart.items.length > 0;
  }
}
