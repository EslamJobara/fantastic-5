import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-8842',
      date: new Date('2024-10-24'),
      total: 2499.00,
      status: 'processing',
      items: [
        {
          id: '1',
          productName: 'Vitrine Pro Display 16"',
          productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdM-WXbJ3uZ_k2fIcutmHe680QRTPSyQOckVlEDr88TNga6Dv5tYvypFezEh4EvT7kX5zNFcUUZ5VmTNEEa01XhyP2D-RgwKnScHf4Ns1WYJBS6xLz00QAOEXXgX8ACo6pXMyRcgb79sNUPAkZHo1jrQHzCo4ZQOKX1VqFaV4bQHco6G8RuYOZWcT4WRNIDLl1cVlvj1Aa6_xZw661NhYhiuzqZk3gj8RwAibJ2ZfVLc2Qzbzz64FpOLSY5dOPkSroHY5iTR4pbY4y',
          variant: 'Space Gray | 1TB SSD | 32GB RAM',
          price: 2499.00,
          quantity: 1
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-7721',
      date: new Date('2024-09-12'),
      total: 1299.00,
      status: 'shipped',
      items: [
        {
          id: '2',
          productName: 'Zenith Pro M3',
          productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
          variant: 'Silver | 512GB SSD | 16GB RAM',
          price: 1299.00,
          quantity: 1
        }
      ]
    }
  ];
  expandedOrderId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    console.log('OrderHistoryComponent initialized');
    console.log('Initial orders:', this.orders);
    console.log('hasOrders:', this.hasOrders);
    
    // Load orders from service (will replace initial mock data)
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Orders loaded from service:', this.orders);
        console.log('hasOrders after loading:', this.hasOrders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again.';
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
      'processing': 'bg-orange-100 text-orange-700',
      'shipped': 'bg-blue-100 text-blue-700',
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  getStatusDotClass(status: string): string {
    const dotClasses: Record<string, string> = {
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
    return `$${price.toFixed(2)}`;
  }

  loadOrders(): void {
    this.error = null;
    
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again.';
      }
    });
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
