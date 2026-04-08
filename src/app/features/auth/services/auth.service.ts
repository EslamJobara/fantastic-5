import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

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
    // لو فيه token محفوظ، حمله
    const token = localStorage.getItem('access_token');
    if (token) {
      this.loadUserFromToken(token);
    }
  }

  /**
   * تسجيل الدخول
   * Backend: POST /api/auth/login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // حفظ الـ tokens
          localStorage.setItem('access_token', response.data.accessToken);
          localStorage.setItem('refresh_token', response.data.refreshToken);
          
          // تحديث حالة المستخدم
          this.currentUserSubject.next({ loggedIn: true });
        })
      );
  }

  /**
   * إنشاء حساب جديد
   * Backend: POST /api/auth/signUp
   * ملاحظة: بعد التسجيل، لازم نعمل login تلقائي
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    // إضافة role: "user" بشكل افتراضي
    const requestData = {
      role: 'user',
      ...data
    };
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/signUp`, requestData);
  }

  /**
   * تسجيل + دخول تلقائي
   * بعد التسجيل، نعمل login تلقائي عشان ناخد الـ tokens
   */
  registerAndLogin(data: RegisterRequest): Observable<LoginResponse> {
    return this.register(data).pipe(
      switchMap(() => {
        // بعد التسجيل الناجح، نعمل login
        return this.login({
          email: data.email,
          password: data.password
        });
      })
    );
  }

  /**
   * تسجيل الخروج
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * التحقق من تسجيل الدخول
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * الحصول على الـ access token
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * الحصول على الـ refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * تحميل بيانات المستخدم من الـ token
   */
  private loadUserFromToken(token: string): void {
    // هنا ممكن تعمل API call عشان تجيب بيانات المستخدم
    // أو تفك الـ JWT token
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      this.http.get<any>(`${this.apiUrl}/me`).subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }
}
