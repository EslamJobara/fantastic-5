import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProductsResponse, ProductResponse, ProductFilters, Product, getProductDefaultImage, getProductImages } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/getAllProducts`).pipe(
      map(response => ({
        ...response,
        data: response.data
          .filter(product => product.visible !== false && product.isDeleted !== true)
          .map(product => this.enrichProduct(product))
      }))
    );
  }

  getProductById(productId: string): Observable<ProductResponse> {
    return this.http.get<any>(`${this.apiUrl}/getProductById/${productId}`).pipe(
      map(response => {
        // Backend returns array, get first item
        const productData = Array.isArray(response.data) ? response.data[0] : response.data;
        
        // Check if product is visible and not deleted
        if (productData && (productData.visible === false || productData.isDeleted === true)) {
          return {
            ...response,
            data: null
          };
        }
        
        return {
          ...response,
          data: productData ? this.enrichProduct(productData) : null
        };
      })
    );
  }

  /**
   * Get product by ID without visibility filtering (for orders/cart)
   * This is used when we need to show products that were purchased even if they're now hidden
   */
  getProductByIdUnfiltered(productId: string): Observable<ProductResponse> {
    return this.http.get<any>(`${this.apiUrl}/getProductById/${productId}`).pipe(
      map(response => {
        // Backend returns array, get first item
        const productData = Array.isArray(response.data) ? response.data[0] : response.data;
        
        return {
          ...response,
          data: productData ? this.enrichProduct(productData) : null
        };
      })
    );
  }

  private enrichProduct(product: Product): Product {
    return {
      ...product,
      defaultImg: getProductDefaultImage(product),
      images: getProductImages(product)
    };
  }

  /**
   * Update product with FormData (supports image uploads)
   * @param productId Product ID to update
   * @param formData FormData containing product fields and images
   */
  updateProduct(productId: string, formData: FormData): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(`${this.apiUrl}/updateProduct/${productId}`, formData);
  }
}
