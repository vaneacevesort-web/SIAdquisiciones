import { CanActivateFn, Router } from '@angular/router';
import { RegistroService } from '../../service/registro.service';
import { inject } from '@angular/core';
import { UserService } from '../../../app/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {

 const router = inject(Router);
  const _userService = inject(UserService) ;
  const userRole = ['Administrador', 'Validador', 'Usuario']
  const role = _userService.currentUserValue?.rol_users?.role?.name;
  if (role && userRole.includes(role)) {
    if(role == 'Usuario'){
        router.navigate(['/registro/documentos']);
        return false;
    }else{
        router.navigate(['/solicitud/tramite']);
        return false;
    }
 
  }

  router.navigate(['/error/404']);
  return false;
};
