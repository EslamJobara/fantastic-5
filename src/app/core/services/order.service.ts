import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, catchError, tap } from 'rxjs';
import { Order } from '../../features/orders/models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  
  // 🔧 Mock Mode - غير دا لـ false لما الباك يبقى جاهز
  private useMockData = false;

  constructor(private http: HttpClient) {}

  /**
   * Mock Data - بيانات تجريبية للطلبات (محدثة)
   */
  private getMockOrders(): Order[] {
    return [
      {
        id: '1',
        orderNumber: 'ORD-2026-001',
        date: new Date(),
        total: 1899.00,
        status: 'processing',
        items: [
          {
            id: '1',
            productName: 'Spectre Pro M1 Max',
            productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkrEDDnCQK-96zYo5sji8hrg5rojSiSvPKyTngIv6sCJYqgkiYS0iHtrUyVKizGZWECscVxbdy-eNu5LwXVdvdoFzp5zbHkYM-nMHJWlRF2e3txHlvFITv98n2IJAiIDZbGKOODVVZ6PxiLd5iOoCZIQgETTFOCrDNOZOwHbmpP0v9nuoxNN2A5D6qgOIHGIz78dpYWD8LZ87T2bwRbni77COBjIk-WINwb51rb_RY0ywaPreHznxAoahtvYC6PnBkIfhVVC1Km9qn',
            variant: 'Liquid Vitrine Edition',
            price: 1899.00,
            quantity: 1
          }
        ]
      },
      {
        id: '2',
        orderNumber: 'ORD-2026-002',
        date: new Date('2026-03-15'),
        total: 1551.00,
        status: 'delivered',
        items: [
          {
            id: '2',
            productName: 'Nexus Phone 15 Pro',
            productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGH-xM0vgecRbPAxN7pqq7l1zYYyrDEXrFIBJkgaYvuzD0AOPk4rAzOG99eWAmwXiq1VG_MhAMTLI7QKAEo_h__LxozVKYN3nOOy3tKarXkRNvm6bC1iGEIneYtxIHY0y650J-5CZlfY73CkTAR5Il8gn4u6KSWVHCSqHo1_NWvuQB-i1uTLOhk3WZfDZVQASg1vte7C3sJNS-SrRW97PYsujjYjEK-_Ei_NE3JOmtQGERk-f51w8DKWKmO7cHDGmIoOzUbQdvQEKu',
            variant: 'Ceramic White',
            price: 1101.00,
            quantity: 1
          },
          {
            id: '3',
            productName: 'Acoustic Precision X2',
            productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-cnuzihNTytV8qi60AwQcewIG-bznRoGc-8yvMACFPA5S6tWfppvF6j7Y0BSeChRP8Jtl2F5TE1JhzRs7ID6fDUTMujL9OY1MnTH4typfH7DChfNp8G7d3NBNirkz2_hzYGSr2Us9tnCfXqvNYiR6l8NHa5YDQHhqsawPHCbHyp9CXU1rd_6WKh5MPB3rh7JzzCqo8fe_Rftpsw5Cw1p97O1l7hK7IOTj9Co4R1FJFycu9tAh4RVOQk2CV9ZFb_lW1VrM0ei1hORD',
            variant: 'Matte Black',
            price: 450.00,
            quantity: 1
          }
        ]
      }
    ];
  }

  /**
   * جلب جميع الطلبات
   */
  getOrders(): Observable<Order[]> {
    if (this.useMockData) {
      console.log('📦 Using Mock Orders Data');
      return of(this.getMockOrders());
    }

    return this.http.get<Order[]>(this.apiUrl).pipe(
      tap(orders => this.saveToLocalStorage(orders)),
      catchError(error => {
        console.error('❌ API Error, falling back to Local Cache or Mock Data:', error);
        const cached = this.loadFromLocalStorage();
        return of(cached || this.getMockOrders());
      })
    );
  }

  private saveToLocalStorage(orders: Order[]): void {
    localStorage.setItem('fantastic_orders', JSON.stringify(orders));
  }

  private loadFromLocalStorage(): Order[] | null {
    const saved = localStorage.getItem('fantastic_orders');
    try {
      if (!saved) return null;
      // Convert date strings back to Date objects
      const orders = JSON.parse(saved);
      return orders.map((o: any) => ({
        ...o,
        date: new Date(o.date)
      }));
    } catch {
      return null;
    }
  }

  /**
   * جلب طلب واحد بالـ ID
   */
  getOrderById(orderId: string): Observable<Order | undefined> {
    if (this.useMockData) {
      const order = this.getMockOrders().find(o => o.id === orderId);
      return of(order);
    }

    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  /**
   * إلغاء طلب
   */
  cancelOrder(orderId: string): Observable<Order> {
    if (this.useMockData) {
      const orders = this.getMockOrders();
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
      }
      return of(order!);
    }

    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  /**
   * إعادة طلب (Re-order)
   */
  reorder(orderId: string): Observable<any> {
    if (this.useMockData) {
      console.log('📦 Mock: Reordering', orderId);
      return of({ success: true, message: 'Items added to cart' });
    }

    return this.http.post(`${this.apiUrl}/${orderId}/reorder`, {});
  }
}
