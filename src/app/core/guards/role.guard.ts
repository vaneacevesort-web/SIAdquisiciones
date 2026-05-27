import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../../app/service/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const role = userService.currentUserValue?.rol_users?.role?.name;

  console.log('ROL EN roleGuard:', role);

  if (!role) {
    return router.createUrlTree(['/']);
  }

  if (role === 'Usuario') {
    return router.createUrlTree(['/registro/documentos']);
  }

  if (role === 'Administrador' || role === 'Validador') {
    return router.createUrlTree(['/gestion-solicitudes']);
  }

  return router.createUrlTree(['/error/404']);
};