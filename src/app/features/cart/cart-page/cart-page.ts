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
  isLoadingCart = true;
  pendingRemoveItem: CartItem | null = null;
  isRemovingItem = false;
  removeError = '';

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        this.cdr.detectChanges();
      });

    this.cartService.getMyCart().subscribe({
      next: () => {
        this.isLoadingCart = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingCart = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item, item.quantity + 1).subscribe({
      error: (error) => console.error('Failed to update quantity', error)
    });
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item, item.quantity - 1).subscribe({
        error: (error) => console.error('Failed to update quantity', error)
      });
    }
  }

  promptRemoveItem(item: CartItem): void {
    this.pendingRemoveItem = item;
    this.removeError = '';
  }

  cancelRemoveItem(): void {
    this.pendingRemoveItem = null;
    this.isRemovingItem = false;
    this.removeError = '';
  }

  confirmRemoveItem(): void {
    if (!this.pendingRemoveItem || this.isRemovingItem) {
      return;
    }

    this.isRemovingItem = true;
    this.removeError = '';
    this.cartService.removeItem(this.pendingRemoveItem).subscribe({
      next: () => {
        this.cancelRemoveItem();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isRemovingItem = false;
        this.removeError = error?.error?.message || 'Failed to remove item';
        this.cdr.detectChanges();
      }
    });
  }

  proceedToCheckout(): void {
    if (this.cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  get hasItems(): boolean {
    return this.cart.items.length > 0;
  }
}
