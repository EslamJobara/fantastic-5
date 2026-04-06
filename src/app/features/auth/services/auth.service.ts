import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // غير دا حسب الباك إند بتاعك
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // لو فيه token محفوظ، حمله
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loadUserFromToken(token);
    }
  }

  /**
   * تسجيل الدخول
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // حفظ الـ token
          localStorage.setItem('auth_token', response.token);
          
          // حفظ الـ user
          this.currentUserSubject.next(response.user);
          
          // لو اختار Remember Me، احفظ في localStorage
          if (credentials.rememberMe) {
            localStorage.setItem('remember_me', 'true');
          }
        })
      );
  }

  /**
   * إنشاء حساب جديد
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          // حفظ الـ token والـ user
          localStorage.setItem('auth_token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  /**
   * تسجيل الخروج
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('remember_me');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * التحقق من تسجيل الدخول
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * الحصول على الـ token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * تحميل بيانات المستخدم من الـ token
   */
  private loadUserFromToken(token: string): void {
    // هنا ممكن تعمل API call عشان تجيب بيانات المستخدم
    // أو تفك الـ JWT token
    this.http.get<any>(`${this.apiUrl}/me`).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.logout()
    });
  }
}
