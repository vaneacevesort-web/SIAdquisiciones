import { Routes } from '@angular/router';

export const gestionSolicitudesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lista/gestion-lista.component').then(m => m.GestionListaComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detalle/gestion-detalle.component').then(m => m.GestionDetalleComponent)
  }
];
