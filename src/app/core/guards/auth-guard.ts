import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // لو مش مسجل دخول، نوديه على صفحة اللوجن
  router.navigate(['/auth/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
