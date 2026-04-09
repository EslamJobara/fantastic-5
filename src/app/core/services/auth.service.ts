import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  role?: string;
  fullName: string;
  userName: string;
  age: number;
  phone: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterResponse {
  message: string;
  data: {
    role: string;
    fullName: string;
    userName: string;
    age: number;
    phone: string;
    email: string;
    password: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // التحقق من وجود توكن عند بدء التطبيق للحفاظ على الجلسة
    const token = localStorage.getItem('access_token');
    if (token) {
      setTimeout(() => this.loadUserFromToken(), 0);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.data.accessToken);
          localStorage.setItem('refresh_token', response.data.refreshToken);
          // تحميل بيانات اليوزر فور تسجيل الدخول
          this.loadUserFromToken();
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

  private loadUserFromToken(): void {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // محاولة الحصول على بيانات اليوزر الحقيقية
      this.http.get<any>(`${this.apiUrl}/getMyProfile`).subscribe({
        next: (response) => {
          // نفترض أن الداتا راجعة بـ response.data
          this.currentUserSubject.next(response.data || response);
        },
        error: (err) => {
          console.warn('Could not load user profile, setting minimal auth state', err);
          // في حالة فشل الـ endpoint، نضع حالة مسجل دخول فقط كأمان
          this.currentUserSubject.next({ loggedIn: true });
        }
      });
    }
  }
}
