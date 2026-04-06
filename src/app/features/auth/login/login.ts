import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
  animations: [
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.95)' })
        )
      ])
    ])
  ]
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  showPassword = false;
  showConfirmPassword = false;
  
  loginForm: FormGroup;
  registerForm: FormGroup;
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // إنشاء Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // إنشاء Register Form
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.activeTab === 'login') {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Validator للتأكد من تطابق الباسوورد
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Helper methods للـ validation errors
  getLoginError(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('email')) return 'Invalid email address';
    if (control?.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  }

  getRegisterError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('email')) return 'Invalid email address';
    if (control?.hasError('minlength')) return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
    if (field === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
