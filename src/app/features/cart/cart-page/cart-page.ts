import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { Cart, CartItem } from '../models/cart.model';

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
  isLoading = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // الاشتراك في تحديثات السلة
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = { ...cart }; // Create new reference
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * زيادة كمية المنتج بمقدار 1
   */
  increaseQuantity(item: CartItem): void {
    // بنبعت quantity = 1 عشان نزود واحد بس
    this.cartService.addToCart(item.productId, 1, item.variationId).subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to update quantity', error)
    });
  }

  /**
   * تقليل كمية المنتج بمقدار 1
   */
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      // بنبعت quantity = -1 عشان ننقص واحد بس
      this.cartService.decreaseCartQuantity(item.productId, item.variationId).subscribe({
        next: () => {
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Failed to update quantity', error)
      });
    }
  }

  /**
   * حذف منتج من السلة
   */
  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.productId, item.variationId).subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to remove item', error)
    });
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
      console.log('Your cart is empty');
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

  /**
   * الانتقال لصفحة تفاصيل المنتج
   */
  goToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
