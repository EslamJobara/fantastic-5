import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders'; // غير دا حسب الباك إند بتاعك
  
  // 🔧 Mock Mode - غير دا لـ false لما الباك يبقى جاهز
  private useMockData = true;

  constructor(private http: HttpClient) {}

  /**
   * Mock Data - بيانات تجريبية للطلبات
   */
  private getMockOrders(): Order[] {
    return [
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
      },
      {
        id: '3',
        orderNumber: 'ORD-6510',
        date: new Date('2024-08-05'),
        total: 899.00,
        status: 'delivered',
        items: [
          {
            id: '3',
            productName: 'Acoustic Precision X2',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
            variant: 'Matte Black | Active Noise Cancelling',
            price: 450.00,
            quantity: 2
          }
        ]
      },
      {
        id: '4',
        orderNumber: 'ORD-5399',
        date: new Date('2024-07-18'),
        total: 1101.00,
        status: 'delivered',
        items: [
          {
            id: '4',
            productName: 'Nexus Phone 15 Pro',
            productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
            variant: '256GB | Ceramic White',
            price: 1101.00,
            quantity: 1
          }
        ]
      },
      {
        id: '5',
        orderNumber: 'ORD-4288',
        date: new Date('2024-06-22'),
        total: 499.00,
        status: 'cancelled',
        items: [
          {
            id: '5',
            productName: 'Curator Watch II',
            productImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
            variant: 'Titanium | GPS + Cellular',
            price: 499.00,
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
      // Mock: استخدام البيانات التجريبية
      console.log('📦 Using Mock Orders Data');
      return of(this.getMockOrders()).pipe(
        delay(500) // محاكاة تأخير الشبكة
      );
    }

    // Real API Call
    return this.http.get<Order[]>(this.apiUrl);
  }

  /**
   * جلب طلب واحد بالـ ID
   */
  getOrderById(orderId: string): Observable<Order | undefined> {
    if (this.useMockData) {
      // Mock: البحث في البيانات التجريبية
      const order = this.getMockOrders().find(o => o.id === orderId);
      return of(order).pipe(delay(300));
    }

    // Real API Call
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  /**
   * إلغاء طلب
   */
  cancelOrder(orderId: string): Observable<Order> {
    if (this.useMockData) {
      // Mock: تحديث حالة الطلب
      const orders = this.getMockOrders();
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
      }
      return of(order!).pipe(delay(500));
    }

    // Real API Call
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  /**
   * إعادة طلب (Re-order)
   */
  reorder(orderId: string): Observable<any> {
    if (this.useMockData) {
      // Mock: محاكاة إعادة الطلب
      console.log('📦 Mock: Reordering', orderId);
      return of({ success: true, message: 'Items added to cart' }).pipe(delay(500));
    }

    // Real API Call
    return this.http.post(`${this.apiUrl}/${orderId}/reorder`, {});
  }
}
