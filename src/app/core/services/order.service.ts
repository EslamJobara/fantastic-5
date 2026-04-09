import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, forkJoin, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order as ApiOrder, OrdersResponse, ProductVariation } from '@core/models';
import { Order as LocalOrder } from '../../features/orders/models/order.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;
  
  // 🔧 Mock Mode - غير دا لـ false لما الباك يبقى جاهز
  private useMockData = false;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  /**
   * Mock Data - بيانات تجريبية للطلبات
   */
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

  /**
   * جلب جميع الطلبات
   */
  getOrders(): Observable<LocalOrder[]> {
    if (this.useMockData) {
      // Mock: استخدام البيانات التجريبية
      console.log('📦 Using Mock Orders Data');
      return of(this.getMockOrders()).pipe(
        delay(500) // محاكاة تأخير الشبكة
      );
    }

    // Real API Call - جلب الأوردرات ثم جلب تفاصيل المنتجات الكاملة
    return this.http.get<OrdersResponse>(`${this.apiUrl}/getUserOrders`).pipe(
      switchMap(response => this.enrichOrdersWithFullProducts(response.data))
    );
  }

  /**
   * جلب تفاصيل المنتجات الكاملة لكل الأوردرات
   */
  private enrichOrdersWithFullProducts(apiOrders: ApiOrder[]): Observable<LocalOrder[]> {
    if (!apiOrders || apiOrders.length === 0) {
      return of([]);
    }

    // جمع كل الـ product IDs الفريدة
    const productIds = new Set<string>();
    apiOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product._id) {
          productIds.add(item.product._id);
        }
      });
    });

    // لو مفيش منتجات، ارجع array فاضي
    if (productIds.size === 0) {
      return of([]);
    }

    // جلب تفاصيل كل المنتجات دفعة واحدة (بدون فلترة)
    const productRequests = Array.from(productIds).map(id => 
      this.productService.getProductByIdUnfiltered(id).pipe(
        map(response => ({
          id,
          product: Array.isArray(response.data) ? response.data[0] : response.data
        }))
      )
    );

    return forkJoin(productRequests).pipe(
      map(results => {
        // إنشاء Map للمنتجات للوصول السريع
        const productsMap = new Map();
        results.forEach(result => {
          if (result.product) {
            productsMap.set(result.id, result.product);
          }
        });
        
        console.log('📦 Products Map:', productsMap);
        
        return this.transformApiOrdersWithProducts(apiOrders, productsMap);
      })
    );
  }

  /**
   * تحويل البيانات من API للـ Model المحلي مع استخدام المنتجات الكاملة
   */
  private transformApiOrdersWithProducts(apiOrders: ApiOrder[], productsMap: Map<string, any>): LocalOrder[] {
    console.log('🔍 Transforming orders with full products');
    
    return apiOrders.map(apiOrder => {
      console.log(`\n📦 Processing Order: ${apiOrder._id}`);
      
      const transformedOrder = {
        id: apiOrder._id,
        orderNumber: `ORD-${apiOrder._id.slice(-4).toUpperCase()}`,
        date: new Date(apiOrder.createdAt),
        total: apiOrder.totalPrice,
        status: apiOrder.status,
        items: apiOrder.items.map((item, index) => {
          const productFromOrder = item.product;
          const fullProduct = productsMap.get(productFromOrder._id);
          
          console.log(`\n  📝 Item ${index}:`, {
            productId: productFromOrder._id,
            productName: productFromOrder.name,
            variationId: item.variationId,
            quantity: item.quantity,
            hasFullProduct: !!fullProduct,
            fullProductVariations: fullProduct?.variations?.length || 0
          });
          
          // Default values
          let variationName = 'Default';
          let productImage = 'https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image';
          const productPrice = productFromOrder.price || 0;
          
          // استخدام المنتج الكامل من الـ Map
          if (fullProduct && fullProduct.variations && Array.isArray(fullProduct.variations) && fullProduct.variations.length > 0) {
            let selectedVariation: ProductVariation | undefined;
            
            // Find the specific variation that was ordered
            if (item.variationId) {
              selectedVariation = fullProduct.variations.find((v: ProductVariation) => v._id === item.variationId);
              
              console.log(`  🔎 Looking for variation: ${item.variationId}`);
              console.log(`  ✓ Found variation:`, selectedVariation ? {
                id: selectedVariation._id,
                name: selectedVariation.colorName,
                image: selectedVariation.defaultImage
              } : 'NOT FOUND');
              
              // If variation not found (deleted), log warning and use default
              if (!selectedVariation) {
                console.warn(`  ⚠️ Variation ${item.variationId} not found, using default`);
              }
            }
            
            // Fallback to default variation if ordered variation not found
            if (!selectedVariation) {
              selectedVariation = fullProduct.variations.find((v: ProductVariation) => v.isDefault) || fullProduct.variations[0];
              console.log(`  🔄 Using fallback variation:`, selectedVariation ? {
                id: selectedVariation._id,
                name: selectedVariation.colorName,
                isDefault: selectedVariation.isDefault
              } : 'NONE');
            }
            
            // Use the selected variation's data
            if (selectedVariation) {
              variationName = selectedVariation.colorName || 'Default';
              productImage = selectedVariation.defaultImage || productImage;
            }
          } else {
            console.warn(`  ⚠️ No variations found for product ${productFromOrder._id}`);
          }
          
          const transformedItem = {
            // Create unique ID by combining product ID, variation ID, and index
            id: `${productFromOrder._id}_${item.variationId || 'default'}_${index}`,
            productName: productFromOrder.name || 'Product',
            productImage: productImage,
            variant: variationName,
            price: productPrice,
            quantity: item.quantity
          };
          
          console.log(`  ✅ Transformed item:`, transformedItem);
          
          return transformedItem;
        })
      };
      
      console.log(`\n✅ Transformed Order:`, transformedOrder);
      return transformedOrder;
    });
  }

  /**
   * جلب طلب واحد بالـ ID
   */
  getOrderById(orderId: string): Observable<LocalOrder | undefined> {
    if (this.useMockData) {
      // Mock: البحث في البيانات التجريبية
      const order = this.getMockOrders().find(o => o.id === orderId);
      return of(order).pipe(delay(300));
    }

    // Real API Call
    return this.http.get<LocalOrder>(`${this.apiUrl}/${orderId}`);
  }

  /**
   * إلغاء طلب
   */
  cancelOrder(orderId: string): Observable<LocalOrder> {
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
    return this.http.put<LocalOrder>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  /**
   * إنشاء طلب جديد
   */
  createOrder(items: { product: string; quantity: number; variationId?: string }[]): Observable<any> {
    const request = { items };
    
    return this.http.post<any>(`${this.apiUrl}/createOrder`, request);
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
