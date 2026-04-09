import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductsResponse, ProductResponse, ProductFilters } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/getAllProducts`);
  }

  getProductById(productId: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/getProductById/${productId}`);
  }
}
