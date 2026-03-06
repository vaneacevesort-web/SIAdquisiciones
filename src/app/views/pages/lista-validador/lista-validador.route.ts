import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'tramite', pathMatch: 'full' },
    {
        path: 'tramite',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'finalizados',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'rechazados',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'registradas',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./solicitud-create/solicitud-create.component').then(c => c.SolicitudCreateComponent)
      },
      {
        path: 'validacion/:id',
        loadComponent: () => import('./detalle-validador/detalle-validador.component').then(c => c.DetalleValidadorComponent)
      }
] as Routes;