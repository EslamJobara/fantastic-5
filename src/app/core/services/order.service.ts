import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, switchMap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderRequest, Order as ApiOrder, OrdersResponse, Product } from '@core/models';
import { Order as LocalOrder } from '../../features/orders/models/order.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;
  private useMockData = false;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  private getMockOrders(): LocalOrder[] {
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

  getOrders(): Observable<LocalOrder[]> {
    if (this.useMockData) {
      return of(this.getMockOrders()).pipe(
        delay(500)
      );
    }

    return this.http.get<OrdersResponse>(`${this.apiUrl}/getUserOrders`).pipe(
      switchMap(response => this.enrichOrdersWithProducts(response.data))
    );
  }

  private enrichOrdersWithProducts(apiOrders: ApiOrder[]): Observable<LocalOrder[]> {
    if (!apiOrders.length) {
      return of([]);
    }

    return this.productService.getProducts().pipe(
      map(productsResponse => {
        const productsMap = new Map<string, Product>(
          productsResponse.data.map(product => [product._id, product])
        );
        return this.transformApiOrders(apiOrders, productsMap);
      }),
      catchError(() => of(this.transformApiOrders(apiOrders)))
    );
  }

  private transformApiOrders(apiOrders: ApiOrder[], productsMap?: Map<string, Product>): LocalOrder[] {
    const fallbackImage = 'https://via.placeholder.com/400x400?text=No+Image';

    return apiOrders.map(apiOrder => ({
      id: apiOrder._id,
      orderNumber: `ORD-${apiOrder._id.slice(-4).toUpperCase()}`,
      date: new Date(apiOrder.createdAt),
      total: apiOrder.totalPrice,
      status: apiOrder.status,
      items: apiOrder.items.map((item, index) => {
        const productDetails = productsMap?.get(item.product._id);
        const productName = productDetails?.name || item.product.name;
        const productPrice = productDetails?.price ?? item.product.price;
        const selectedVariation = productDetails?.variations?.find(v => v._id === item.variationId)
          || item.product.variations?.find(v => v._id === item.variationId);
        const productImage = selectedVariation?.defaultImage
          || productDetails?.defaultImg
          || item.product.defaultImg
          || fallbackImage;

        return {
          id: `${apiOrder._id}-${String(item._id ?? item.product._id)}-${index}`,
          productName,
          productImage,
          variant: selectedVariation?.colorName || item.variationId || 'Default',
          price: productPrice,
          quantity: item.quantity
        };
      })
    }));
  }

  getOrderById(orderId: string): Observable<LocalOrder | undefined> {
    if (this.useMockData) {
      const order = this.getMockOrders().find(o => o.id === orderId);
      return of(order).pipe(delay(300));
    }

    return this.http.get<LocalOrder>(`${this.apiUrl}/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<LocalOrder> {
    if (this.useMockData) {
      const orders = this.getMockOrders();
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
      }
      return of(order!).pipe(delay(500));
    }

    return this.http.put<LocalOrder>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  reorder(orderId: string): Observable<any> {
    if (this.useMockData) {
      return of({ success: true, message: 'Items added to cart' }).pipe(delay(500));
    }

    return this.http.post(`${this.apiUrl}/${orderId}/reorder`, {});
  }

  createOrder(payload: CreateOrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/createOrder`, payload);
  }
}
