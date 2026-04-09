import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriesResponse } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/getAllCategory`);
  }
}
