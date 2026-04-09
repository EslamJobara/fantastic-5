import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
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

  private getMockProducts(): Product[] {
    return [
      {
        _id: '1',
        name: 'Vitrine Pro Display 16"',
        description: 'Atmospheric liquid-metal finish with a 120Hz ProMotion panel.',
        price: 2499,
        stock: 12,
        category: '64f1a2b3c4d5e6f7a8b9c0d1',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'
      },
      {
        _id: '2',
        name: 'Acoustic Precision X2',
        description: 'Lossless spatial audio with titanium drivers.',
        price: 450,
        stock: 25,
        category: '64f1a2b3c4d5e6f7a8b9c0d2',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'
      },
      {
        _id: '3',
        name: 'Nexus Phone 15 Pro',
        description: 'Minimalist ceramic body housing a neural processing powerhouse.',
        price: 1100,
        stock: 8,
        category: '64f1a2b3c4d5e6f7a8b9c0d3',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
      }
    ];
  }

  getProducts(): Observable<ProductResponse> {  
    return this.http.get<ProductResponse>(`${this.apiUrl}/getAllProducts`).pipe(
      catchError(error => {
        console.warn('⚠️ Product API failed, showing mock data:', error);
        return of({
          message: 'Success (Mock)',
          data: this.getMockProducts()
        });
      })
    );
  }

  getProductById(productId: string): Observable<ProductResponse | any> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/getProductById/${productId}`).pipe(
      catchError(error => {
        console.warn('⚠️ Product Detail API failed, showing mock data:', error);
        const mockProduct = this.getMockProducts().find(p => p._id === productId);
        return of({
          message: 'Success (Mock)',
          data: mockProduct
        });
      })
    );
  }
}
