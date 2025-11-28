import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard = (requiredRole: string) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getUsuario();

    if (user && user.role === requiredRole) {
      return true;
    }

    router.navigate(['/']);
    return false;
  };
};
