import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.data.accessToken);
          localStorage.setItem('refresh_token', response.data.refreshToken);
          this.currentUserSubject.next({ loggedIn: true } as any);
        })
      );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    const requestData = {
      role: 'user',
      ...data
    };
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/signUp`, requestData);
  }

  registerAndLogin(data: RegisterRequest): Observable<LoginResponse> {
    return this.register(data).pipe(
      switchMap(() => {
        return this.login({
          email: data.email,
          password: data.password
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
