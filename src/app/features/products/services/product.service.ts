import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  badge: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`; // ⚠️ لاحظ: product مش products
  
  // 🔧 Mock Mode - غير دا لـ false لما الباك يبقى جاهز
  private useMockData = true;

  constructor(private http: HttpClient) {}

  /**
   * Mock Data - بيانات تجريبية للمنتجات
   */
  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Lumina Pro 14"',
        badge: 'Laptops',
        price: 1299,
        description: 'M3 Chip • 16GB RAM • 512GB SSD',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRGDwtLxL-NgFDB5ZY819ZISRgEDdT41rM74tpxv61bJ-kGuuSMQCVhONzD39c55sp3KR4um69MgMkkIZq3pZlEvOIfPHKM91HKi036T0H7uNcbK12t9_mXW9ORQqjMDEB8PVoC_H9KuymxJzhHC7MRYZPRQXCYNTEDGI--b9U5x6lStGplhoiKfnNCu4ZXAQQ8FfwrZii1HOfpel2lOVoMqaNDDywXpLM4-ZOW0rjtF-xwMI_Wp8iz6ETQhMGq0hmNdlH7phmu1rU',
        category: 'Laptops',
        stock: 15,
        rating: 4.8,
        reviews: 234
      },
      {
        id: '2',
        name: 'Acoustic S1 Wireless',
        badge: 'Audio',
        price: 349,
        description: 'Active Noise Canceling • 40H Battery',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClnnMDJ7ahHNcrONhxVynHcWYCP_sTity5znvSHX9sNjW_J1rAHzzazxyrN_R56gRq4ZGpnlYtETUhaHzOnU3GDiGEhAbRnIfkxnVFEcEysXmxHojEamcr96JZ10Sa9i4FouxN9hvFgFay9EY-AOqMIMsTwqXGfoWm0kVmXXpqVcJArnKqEmyWS2binP6yM0payEcNXT9hrdE9RT6CdoQi8oAVXXMSyh8cYEpRcjZuBnXYQVhtPL10zdyyDZxOOcike5MKRnCw8pBD',
        category: 'Audio',
        stock: 42,
        rating: 4.6,
        reviews: 189
      },
      {
        id: '3',
        name: 'Chronos Gen 5',
        badge: 'Wearables',
        price: 499,
        description: 'OLED Display • Heart Rate Sensor',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWcCrzVEzLJrTst1L08ttWkJ96Vp_pBDnMAuThMtDZBcmSpLDxK4kFoAkFoqwbYVPy3r8qwE5HgGp_Yw0NSRG7zgtIv_XUPRWHYA0B95TLqhkjtiJTfhKX82Ao9JUy_dScmQTluJT--RNPIULmwCk6u0m0FhDlv1UBFzgBlZtj-0tgS8zm2I5DQssUe2jwLqiHxnsjeL-MAugIyQ4POMppH-qXl2Eu8rK1M2GPH3ZNwHgtmYIxAaJHjNocWM_GmzQuzM53qdrEUNlh',
        category: 'Wearables',
        stock: 28,
        rating: 4.7,
        reviews: 156
      },
      {
        id: '4',
        name: 'Tactile Mechanical K1',
        badge: 'Accessories',
        price: 189,
        description: 'Hot-Swappable • RGB • Aluminum Base',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmO7IJiRPU6c3Uc1vZy-r8Tryo8G9o5c1BcUyXhTbcYa0Q8DNtKsNUpWcSk-Ej1hkuHphOcze9_TGn0D-0AePxTM49R3aM6_ZqyZDX2xGYksgCdaKrZ9We_3z5MFb4E-r16jb5Cklxhg_Il4zTrwWHZklY_rNwKiqPRkDkqYAQ99iIjkNSn2ezUjLtevS7y4lxk1m9qaikF3uWScLmtQtlI4jRQ9zXFbAYNo7jRkQ3m0Opf3QUJ4YP37pSgOQSQ0AgbcDqb57M-zJy',
        category: 'Accessories',
        stock: 67,
        rating: 4.9,
        reviews: 412
      },
      {
        id: '5',
        name: 'Slate Pro 12.9',
        badge: 'Tablets',
        price: 1099,
        description: 'Liquid Retina • Pencil Support',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdnmBLSSY9CgMeaijUQk8TvnjXG3OaPCucvMqmruiHEJjdL8Pul_bbRQixEg56NFuGj06S8Sh5wGmDi6cOjO3lQtlXBJQPTEsaxoYqHqAMEml3ClJsOb2ZPmDrpPUXKT-E08ZVsAhoc6V8lmjs6_Aizz_f1hw9cw_O-voLameT2dQ3T6d33znJZesKbBUTSXVmD_fByWrlp5adlEyLG0ppJinrxwCnRF7MBN_E9_WHEIecfKUH8uKeLWmU_21DRkDeY1jrfm98DBr0',
        category: 'Tablets',
        stock: 19,
        rating: 4.8,
        reviews: 298
      },
      {
        id: '6',
        name: 'Precision Mouse Gen 2',
        badge: 'Accessories',
        price: 129,
        description: '8000 DPI • Silent Clicks • Multi-Device',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsJVUqZWPyxactILpkLH3NdfZMAHY4TRpc0-0OdF18cXvcm0vBPK5r7d5GfcTvRsGEVaQhbx6uDLUBNP66MCPMlqhv3hXXXu1ub6fjPCpLqXYiks3ZDkyCq3WO_g_p5Zg0vCijcutfXToTsys8forToKABI8ciTOl_7of1_fIa6mhdSsq9Gr9r0-6RDlOX_bhaHDdzwECimyLZ6z-z1aTNaRXdtSY-zjCIPwtvlHYgdH9G4hwWsTgig1mooPawaE39q1uLy4sguld0',
        category: 'Accessories',
        stock: 89,
        rating: 4.5,
        reviews: 523
      },
      {
        id: '7',
        name: 'Sonic Core H1',
        badge: 'Audio',
        price: 299,
        description: 'Hi-Res Audio • Bluetooth 5.2',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbeAJudCI_leJOIZxm1oAs-wV5dItSnIEXq4Mvk4eM9TkXoNdC1R03dMePb1T-Z21Ckttk_FADxaCi8vQ9F5eECAXvdAYNvr7bqtLi_0UR5OlsW2zDwm02GGZCBazauiNTaeBWFIptBHdWCb7SXY0j1WBEZXKntOmkuKg2IH12QAsjQ6B2KBsNSlrOu4avkQljS-d6eD6c5xytZ_3H2Ycyt2U3jeFHeSNBQnj1S0nQlL5uWN9klqsJUTEIpCKmU3-AkaIDkvK_8Xid',
        category: 'Audio',
        stock: 34,
        rating: 4.7,
        reviews: 267
      },
      {
        id: '8',
        name: 'Vortex Pro PC',
        badge: 'Gaming',
        price: 2499,
        description: 'RTX 4080 • i9-14900K • 32GB RAM',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY_aJ0Rg9zMZa9IPucmgf0Ox3jYll5jgDxMT-UOZpnYVIk19v3pohJIoVNZSO-LyXMD4XIyy14tQP4rlq5AZY5gbVAFxQWvxK-cXDbr_8H0iq5Qgc21xWscxkwpqi_Jsvg3cGGfO7pYaElX10rwYodGupagg6Sjui5uhWa52n1VXbbMzWVBjBpOjC8qGvAU4wX3jAbZdKq3PkGMxksYd96h9HixPepWCuFwFIteCQ8FCyQxioDGaUZZjKQUMtdonntO1jnMHCKGLMV',
        category: 'Gaming',
        stock: 8,
        rating: 4.9,
        reviews: 178
      },
      {
        id: '9',
        name: 'Visionary X-100',
        badge: 'Cameras',
        price: 1599,
        description: '45MP Sensor • 8K Video • IBIS',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlvbxwLP2qyLQ28jOpCW77o_luhZTGivdXg_L9uRJgSuZVDbpIi8nDoskrmFiQhMNNKsxSKGAo8ncjuEYhyU_PC_WCB6lcuUBYQP-lT46bzUNqmia26OrLvPp1UaonCMFSLe23M6CHEEQqRwiuRTAMCnccJt_2S9H0EbWo4ecEPGTkKAXcgxgrVTWfe5JAU3iPsoufNUrqe8qXogqRHjBWPiVtO5G5r9IbHQSMptzdjC5b4H4S1wO3cEQP6hzSMdubvYEUVUR__iNH',
        category: 'Cameras',
        stock: 12,
        rating: 4.8,
        reviews: 145
      }
    ];
  }

  /**
   * جلب جميع المنتجات مع فلترة واختيارية
   * Backend: GET /api/product/getAllProducts
   */
  getProducts(filters?: ProductFilters, page: number = 1, pageSize: number = 12): Observable<ProductListResponse> {
    if (this.useMockData) {
      let products = this.getMockProducts();

      // تطبيق الفلاتر
      if (filters) {
        if (filters.category) {
          products = products.filter(p => p.category === filters.category);
        }
        if (filters.minPrice) {
          products = products.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice) {
          products = products.filter(p => p.price <= filters.maxPrice!);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          products = products.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search)
          );
        }
      }

      // Pagination
      const start = (page - 1) * pageSize;
      const paginatedProducts = products.slice(start, start + pageSize);

      return of({
        products: paginatedProducts,
        total: products.length,
        page,
        pageSize
      }).pipe(delay(400));
    }

    // Real API Call
    const params: any = { page, pageSize, ...filters };
    return this.http.get<ProductListResponse>(`${this.apiUrl}/getAllProducts`, { params });
  }

  /**
   * جلب منتج واحد بالـ ID
   * Backend: GET /api/product/getProductById/{id}
   */
  getProductById(productId: string): Observable<Product | undefined> {
    if (this.useMockData) {
      const product = this.getMockProducts().find(p => p.id === productId);
      return of(product).pipe(delay(300));
    }

    // Real API Call
    return this.http.get<Product>(`${this.apiUrl}/getProductById/${productId}`);
  }

  /**
   * جلب المنتجات المشابهة
   */
  getRelatedProducts(productId: string, limit: number = 4): Observable<Product[]> {
    if (this.useMockData) {
      const currentProduct = this.getMockProducts().find(p => p.id === productId);
      let related = this.getMockProducts()
        .filter(p => p.id !== productId);

      // لو لقينا المنتج، نجيب منتجات من نفس الـ category
      if (currentProduct) {
        related = related.filter(p => p.category === currentProduct.category);
      }

      return of(related.slice(0, limit)).pipe(delay(300));
    }

    // Real API Call - استخدام getAllProducts مع filter
    return this.http.get<Product[]>(`${this.apiUrl}/getAllProducts`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * البحث في المنتجات
   */
  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts({ search: query }).pipe(
      delay(300)
    ) as any;
  }
}
