import { CanActivateFn, Router } from '@angular/router';
import { RegistroService } from '../../service/registro.service';
import { inject } from '@angular/core';
import { UserService } from '../../../app/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const statusGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _userService = inject(UserService);
  const registroService = inject(RegistroService);

  const id = _userService.currentUserValue?.id;

 
  return registroService.getStatus(String(id)).pipe(
    map((response: any) => {
      if (response.data === 1 || response.data === 4) {
        return true;

      } else {
        return router.createUrlTree(['/registro/documentos']);
      }

    }),
    catchError((error: HttpErrorResponse) => {
      return of(router.createUrlTree(['/error/404']));
    })
  );
};
