import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../../app/service/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const role = userService.currentUserValue?.rol_users?.role?.name;

  // Sin sesión activa → ir al login
  if (!role) {
    return router.createUrlTree(['/auth/login']);
  }

  // Todos los roles válidos del sistema aterrizan en gestion-solicitudes
  return router.createUrlTree(['/gestion-solicitudes']);
};