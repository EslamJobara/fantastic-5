import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: false,
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
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
export class AuthPageComponent implements OnInit {
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
    private router: Router,
    private route: ActivatedRoute
  ) {
    // إنشاء Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]]
    });

    // إنشاء Register Form
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(13), Validators.max(120)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // قراءة الـ route لتحديد الـ tab
    this.route.url.subscribe(segments => {
      const lastSegment = segments[segments.length - 1]?.path;
      if (lastSegment === 'register') {
        this.activeTab = 'register';
      } else {
        this.activeTab = 'login';
      }
    });
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    
    // تحديث الـ URL
    this.router.navigate(['/auth', tab]);
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

    const { fullName, userName, age, phone, email, password } = this.registerForm.value;

    // استخدام registerAndLogin عشان نعمل login تلقائي بعد التسجيل
    this.authService.registerAndLogin({ 
      fullName, 
      userName, 
      age: Number(age), 
      phone, 
      email, 
      password 
    }).subscribe({
      next: (response) => {
        console.log('Registration and login successful', response);
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

  // Validator لقوة الباسوورد (Capital Letter + Special Character)
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    // التحقق من وجود حرف كبير
    const hasUpperCase = /[A-Z]/.test(value);
    
    // التحقق من وجود special character
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const passwordValid = hasUpperCase && hasSpecialChar;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasSpecialChar
        }
      };
    }

    return null;
  }

  // Helper methods للـ validation errors
  getLoginError(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('email')) return 'Invalid email address';
    if (control?.hasError('minlength')) return 'Password must be at least 6 characters';
    if (control?.hasError('passwordStrength')) {
      const errors = control.errors?.['passwordStrength'];
      if (!errors.hasUpperCase && !errors.hasSpecialChar) {
        return 'Password must contain uppercase letter and special character';
      }
      if (!errors.hasUpperCase) return 'Password must contain at least one uppercase letter';
      if (!errors.hasSpecialChar) return 'Password must contain at least one special character';
    }
    return '';
  }

  getRegisterError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('email')) return 'Invalid email address';
    if (control?.hasError('minlength')) return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
    if (control?.hasError('min')) return `Minimum age is ${control.errors?.['min'].min}`;
    if (control?.hasError('max')) return `Maximum age is ${control.errors?.['max'].max}`;
    if (control?.hasError('pattern') && field === 'phone') return 'Invalid Egyptian phone number';
    if (control?.hasError('passwordStrength')) {
      const errors = control.errors?.['passwordStrength'];
      if (!errors.hasUpperCase && !errors.hasSpecialChar) {
        return 'Password must contain uppercase letter and special character';
      }
      if (!errors.hasUpperCase) return 'Password must contain at least one uppercase letter';
      if (!errors.hasSpecialChar) return 'Password must contain at least one special character';
    }
    if (field === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
