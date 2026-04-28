import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Cart, CartItem } from '../../cart/models/cart.model';

@Component({
  selector: 'app-checkout-page',
  standalone: false,
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPageComponent implements OnInit {
  cart: Cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  };
  isLoading = true;
  isPlacingOrder = false;
  orderError = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCheckoutData();
  }

  private loadCheckoutData(): void {
    this.isLoading = true;
    this.cartService.getMyCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.orderError = 'Failed to load checkout data.';
        this.cdr.detectChanges();
      }
    });
  }

  placeOrder(): void {
    if (this.isPlacingOrder || this.cart.items.length === 0) {
      return;
    }

    this.isPlacingOrder = true;
    this.orderError = '';

    const payload = {
      items: this.cart.items.map((item: CartItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        variationId: item.variationId
      })),
      paymentMethod: 'cod'
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe({
          next: () => this.router.navigate(['/orders']),
          error: () => this.router.navigate(['/orders'])
        });
      },
      error: (error) => {
        this.orderError = error?.error?.message || 'Failed to place order.';
        this.isPlacingOrder = false;
        this.cdr.detectChanges();
      }
    });
  }

  get hasItems(): boolean {
    return this.cart.items.length > 0;
  }
}
