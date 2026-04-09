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
        data: response.data.map(product => this.enrichProduct(product))
      }))
    );
  }

  getProductById(productId: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/getProductById/${productId}`).pipe(
      map(response => ({
        ...response,
        data: this.enrichProduct(response.data)
      }))
    );
  }

  private enrichProduct(product: Product): Product {
    return {
      ...product,
      defaultImg: getProductDefaultImage(product),
      images: getProductImages(product)
    };
  }
}
