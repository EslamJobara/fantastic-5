import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // لو مسجل دخول، نوديه على الصفحة الرئيسية
  if (authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  // لو مش مسجل دخول، يقدر يدخل على صفحة اللوجن
  return true;
};
