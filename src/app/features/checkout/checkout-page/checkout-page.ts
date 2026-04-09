import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Cart } from '../../cart/models/cart.model';

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

  // Shipping form data
  shippingData = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load cart data
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.isLoading = false;

      // Redirect if cart is empty
      if (cart.items.length === 0 && !this.isLoading) {
        this.router.navigate(['/cart']);
      }
    });
  }

  placeOrder(): void {
    // Validate shipping data
    if (!this.validateShippingData()) {
      console.log('Please fill in all shipping details');
      return;
    }

    if (this.cart.items.length === 0) {
      console.log('Your cart is empty');
      return;
    }

    this.isPlacingOrder = true;

    // Prepare order items
    const orderItems = this.cart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      variationId: item.variationId
    }));

    // Create order
    this.orderService.createOrder(orderItems).subscribe({
      next: (response) => {
        this.isPlacingOrder = false;
        console.log('Order placed successfully!');
        
        // Clear cart after successful order
        this.cartService.clearCart().subscribe({
          next: () => {
            // Navigate to orders page
            this.router.navigate(['/orders']);
          },
          error: (error) => {
            console.error('Failed to clear cart', error);
            this.router.navigate(['/orders']);
          }
        });
      },
      error: (error) => {
        this.isPlacingOrder = false;
        console.error('Failed to place order', error);
      }
    });
  }

  validateShippingData(): boolean {
    return !!(
      this.shippingData.fullName.trim() &&
      this.shippingData.address.trim() &&
      this.shippingData.city.trim() &&
      this.shippingData.postalCode.trim() &&
      this.shippingData.phone.trim()
    );
  }
}
