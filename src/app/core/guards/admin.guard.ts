import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../../app/service/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _userService = inject(UserService) ;
  const userRole = ['Administrador', 'Validador']
  const role = _userService.currentUserValue?.rol_users?.role?.name;

  if (role && userRole.includes(role)) {
    return true;
  }

  router.navigate(['/error/404']);
  return false;

};
