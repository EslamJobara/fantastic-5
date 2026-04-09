import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product { 
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  colors?: { colorName: string; colorHex: string; imageUrl: string }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductResponse {
  message: string;
  data: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

 constructor(private http: HttpClient) {}  
//filters?: ProductFilters, page: number = 1, pageSize: number = 12
  getProducts(): Observable<ProductResponse> {  
    // const params: any = { page, pageSize, ...filters };
    //, { params }
    return this.http.get<ProductResponse>(`${this.apiUrl}/getAllProducts`);
  }

  getProductById(productId: string): Observable<ProductResponse | undefined> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/getProductById/${productId}`);
  }


  // getRelatedProducts(productId: string, limit: number = 4): Observable<Product[]> {   
  //   return this.http.get<Product[]>(`${this.apiUrl}/getAllProducts`, {
  //     params: { limit: limit.toString() }
  //   });
  // }

  // searchProducts(query: string): Observable<Product[]> {
  //   return this.getProducts({ search: query }).pipe(
  //     delay(300)
  //   ) as any;
  // }
}
