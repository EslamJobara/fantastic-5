import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Order } from '../models/order.model';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  expandedOrderId: string | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck();
    
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Orders loaded:', orders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrderId === orderId;
  }

  getStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'processing': 'bg-orange-100 text-orange-700',
      'shipped': 'bg-blue-100 text-blue-700',
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  getStatusDotClass(status: string): string {
    const dotClasses: Record<string, string> = {
      'pending': 'bg-yellow-500',
      'processing': 'bg-orange-500',
      'shipped': 'bg-blue-500',
      'delivered': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return dotClasses[status] || 'bg-gray-500';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)}`;
  }

  reorder(orderId: string): void {
    this.orderService.reorder(orderId).subscribe({
      next: () => {
        alert('Items added to cart!');
      },
      error: (error) => {
        console.error('Error reordering:', error);
        alert('Failed to reorder. Please try again.');
      }
    });
  }

  get hasOrders(): boolean {
    return this.orders.length > 0;
  }
}
