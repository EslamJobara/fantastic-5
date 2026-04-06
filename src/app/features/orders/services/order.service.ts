import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // TODO: Replace with actual API call
  getOrders(): Observable<Order[]> {
    // Mock data for development
    const mockOrders: Order[] = [
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
        status: 'delivered',
        items: []
      },
      {
        id: '3',
        orderNumber: 'ORD-6510',
        date: new Date('2024-08-05'),
        total: 450.00,
        status: 'delivered',
        items: []
      }
    ];

    return of(mockOrders);
  }

  // TODO: Implement when backend is ready
  // getOrders(): Observable<Order[]> {
  //   return this.http.get<Order[]>('/api/orders');
  // }
}
